import scrapy,datetime
from ..items import DianPingHotelItem
from  ..UserFunction.DianPingHotelPriceAPI import GetHotelDetailInformation
from pandas.tseries.offsets import Day


class DianPingHotelScrapy(scrapy.Spider):
    #定义爬虫名称
    name = 'DianPingHotelScrapy'
    #定义爬取多少页（最大50页）
    max_page = 50
    #定义开始爬取的网址
    start_urls= ['http://www.dianping.com/fuzhou/hotel/p%d' % x for x in range(1,max_page)]

    # 设置独立的请求头
    headers = {'Accept': '*/*',
               'Accept-Encoding': 'gzip, deflate, br',
               'Accept-Language': 'zh-CN,zh;q=0.9',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
               'Connection': 'keep-alive',
               'Referer': 'https://www.baidu.com',
               'Host': 'www.dianping.com',
               }

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url,headers=self.headers, callback=self.parse_list,dont_filter=False)

    def parse_list(self, response):
        for hotel in response.css('ul.hotelshop-list li.hotel-block'):
            # 创建对象
            item = DianPingHotelItem()
            #获取酒店名
            item['name'] = hotel.css('.hotel-name-link::text').extract_first()
            #获取酒店id
            item['id'] = hotel.css('li::attr(data-poi)').extract_first()
            #获取酒店房间最低价格
            item['price'] = hotel.css('.price strong::text').extract_first()
            #获取酒店网址，以便下一步爬取
            item['url'] ='http://www.dianping.com/shop/' + item['id']
            #爬取酒店的详细信息
            yield scrapy.Request(item['url'], meta={'item':item }, callback=self.parse_detail)
            # 有下级页面爬取 注释掉数据返回
            #yield item

    def parse_detail(self, response):
        # 接收上级已爬取的数据
        item = response.meta['item']
        # 获取酒店位置
        item['place'] = response.css('span.hotel-address::text').extract_first()
        # 获取评分
        item['score'] = response.css('span.score::text').extract_first()
        # 获取联系方式
        item['contact'] = response.css('.info-value::text').extract_first()
        # 获取开业时间
        item['destablishment_data'] = response.css('.info-value::text').extract()[1]
        # 获取点评数量,[1:-1]用于去除两端的括号
        item['remark_number'] = response.css('#comment .count::text').extract_first()[1:-1]
        # 获取好评比例,先判断总数是否为0
        if int(response.css('a[data-filter] span.count::text').extract()[0][1:-1]) != 0 :
            item['good_ratio'] = int((int(response.css('a[data-filter] span.count::text').extract()[0][1:-1]) +
                                 int(response.css('a[data-filter] span.count::text').extract()[1][1:-1]) )/ int(item['remark_number'])
                                *100)
        else:
            item['good_ratio'] = 0
        # 通过API获取房型列表(默认获取未来一天的房价,暂时先不采集)
        # now_time = datetime.datetime.now().strftime('%Y-%m-%d')
        # next_day_time = (datetime.datetime.now() + Day()).strftime('%Y-%m-%d')
        # item['room_type_list'] = GetHotelDetailInformation(item['id'],now_time,next_day_time)

        yield item