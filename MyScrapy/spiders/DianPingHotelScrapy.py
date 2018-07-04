import scrapy
from ..items import DianPingHotelItem

class DianPingHotelScrapy(scrapy.Spider):
    #定义爬虫名称
    name = 'DianPingHotelScrapy'
    # 允许访问的域
    #allowed_domains = ['imooc.com']
    #定义开始爬取的网址
    start_urls=['http://www.dianping.com/fuzhou/hotel/p1']
    # 设置独立的请求头
    headers = {'Accept': '*/*',
               'Accept-Encoding': 'gzip, deflate, br',
               'Accept-Language': 'zh-CN,zh;q=0.9',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
               'Connection': 'keep-alive',
               'Referer': 'https://www.baidu.com',
               'Host': 'www.dianping.com',
               }

    def parse(self, response):

        for course in response.css('.hotelshop-list li'):
            # 创建对象
            item = DianPingHotelItem()
            #获取图片地址
            item['image_urls'] ='http:' + course.css('img::attr(src)').extract_first()

            yield item

        #获取下一页的信息，将其加入爬取目标中
        next_url = response.css('.course-list .page a:nth-child(10)::attr(href)').extract_first()
        if next_url:
            next_url = response.urljoin(next_url)
            print('下一个爬取页面是：'+ next_url)
            yield scrapy.Request(next_url, callback=self.parse)
