import scrapy
from ..items import CourseItem

class MyScrapy(scrapy.Spider):
    #定义爬虫名称
    name = 'MyScrapy'
    # 允许访问的域
    #allowed_domains = ['imooc.com']
    #定义开始爬取的网址
    start_urls=['http://www.imooc.com/course/list']

    def parse(self, response):

        for course in response.css('.course-card-container'):
            # 创建对象
            item = CourseItem()
            #获取图片地址
            item['image_urls'] ='http:' + course.css('img::attr(src)').extract_first()
            # 获取课程名称
            item['title'] = course.css('.course-card-name::text').extract_first()
            #print('目前课程名称：' + item['title'])
            # 获取课程等级
            item['grade'] = course.css('.course-card-info span::text').extract_first()
            # 获取课程人数
            item['studentnum'] = course.css('.course-card-info span::text').extract()[1]
            # 获取课程简介
            item['describe'] = course.css('.course-card-desc::text').extract_first()
            # 返回信息,如果不传递list，在后续管道中会报错
            yield item

        #获取下一页的信息，将其加入爬取目标中
        next_url = response.css('.course-list .page a:nth-child(10)::attr(href)').extract_first()
        if next_url:
            next_url = response.urljoin(next_url)
            print('下一个爬取页面是：'+ next_url)
            yield scrapy.Request(next_url, callback=self.parse)
