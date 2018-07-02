import scrapy
from ..items import IPPorxyItem_kuaidaili

class IPScrapy(scrapy.Spider):
    #定义爬虫名称
    name = 'IPScrapy_kuaidaili'

    # 用来保持登录状态，可把chrome上拷贝下来的字符串形式cookie转化成字典形式，粘贴到此处
    cookies = {}

    #定义开始爬取的网址
    start_urls=['https://www.kuaidaili.com/free/inha/%d/' % x for x in range(1,4)]

    def parse(self, response):

        for ip_porxy in response.css('#list tbody tr'):
            # 创建对象
            item = IPPorxyItem_kuaidaili()
            #获取ip地址 + 端口号
            item['ip'] = ':'.join([ip_porxy.css('td::text').extract_first(),ip_porxy.css('td::text').extract()[1]])
            #获取类型
            item['type'] = ip_porxy.css('td::text').extract()[3]
            # 获取位置
            item['address'] = ip_porxy.css('td::text').extract()[4]
            # 获取速度
            item['speed'] = ip_porxy.css('td::text').extract()[5]
            # 获取最后验证时间
            item['update_time'] = ip_porxy.css('td::text').extract()[6]
            # 返回信息
            yield item

    def make_requests_from_url(self, url):
        self.logger.debug('Try first time')
        #'dont_filter = True'时允许重复发送请求直到成功为止
        return scrapy.Request(url=url, meta={'download_timeout': 5}, callback=self.parse,dont_filter=True)