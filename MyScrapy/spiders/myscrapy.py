import scrapy
from ..items import CourseItem

class MyScrapy(scrapy.Spider):
    #定义爬虫名称
    name = 'MyScrapy'
    # 允许访问的域
    allowed_domains = ['imooc.com']
    #定义开始爬取的网址
    start_urls=['http://www.imooc.com/course/list']

    def parse(self, response):
        item = CourseItem()