import scrapy
from ..items import IPPorxyItem_kuaidaili

class IPScrapy(scrapy.Spider):
    #定义爬虫名称
    name = 'IPScrapy_kuaidaili'
    # 允许访问的域
    #allowed_domains = ['imooc.com']
    # 发送给服务器的http头信息，有的网站需要伪装出浏览器头进行爬取，有的则不需要
    headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
    }
    # 用来保持登录状态，可把chrome上拷贝下来的字符串形式cookie转化成字典形式，粘贴到此处
    cookies = {}

    #定义开始爬取的网址
    start_urls=['https://www.kuaidaili.com/free/inha/%d/' % x for x in range(4)]

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
