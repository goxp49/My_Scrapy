import scrapy
from ..items import IPPorxyItem_xici

class IPScrapy(scrapy.Spider):
    #爬取XICI的代理IP，较稳定
    name = 'IPScrapy_xici'
    # 允许访问的域
    #allowed_domains = ['imooc.com']
    # 用来保持登录状态，可把chrome上拷贝下来的字符串形式cookie转化成字典形式，粘贴到此处
    cookies = {'_free_proxy_session=BAh7B0kiD3Nlc3Npb25faWQGOgZFVEkiJTA4ZjQwN2UwMDE5MDJjMmM0YTE0NjhjODJlZjUyNTI0BjsAVEkiEF9jc3JmX3Rva2VuBjsARkkiMSszRHFLWXdWVVJXcktsS0VpZjNjMHZSZG1lcFJMQXh3eE1venRvVmQzaUU9BjsARg%3D%3D--6fcbbe41d72f9040b06842f16aa0c04e88b5799e; Hm_lvt_0cf76c77469e965d2957f0553e6ecf59=1530272483; Hm_lpvt_0cf76c77469e965d2957f0553e6ecf59=1530276522'}

    #只爬取两页就够用了
    start_urls=['http://www.xicidaili.com/nn/%d' % x for x in range(1,3)]

    def parse(self, response):
        #第一个结果为标题栏
        for ip_porxy in response.css('#ip_list tr')[1:]:
            # 创建对象
            item = IPPorxyItem_xici()
            #获取ip地址 + 端口号
            item['ip'] = ':'.join([ip_porxy.css('td::text').extract_first(),ip_porxy.css('td::text').extract()[1]])
            #获取类型
            item['type'] = ip_porxy.css('td::text').extract()[5]
            # 返回信息
            yield item
