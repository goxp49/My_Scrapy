import scrapy
from ..items import FictionItem

class QiDianScrapy(scrapy.Spider):
    #定义爬虫名称
    name = 'QiDianScrapy'
    #定义开始爬取的网址
    start_urls=['https://www.qidian.com/all']
    #设置独立的请求头
    headers = {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
               'Accept-Language': 'zh-CN,zh;q=0.9',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
               'Connection': 'keep-alive',
               'Referer': 'https://www.qidian.com/all',
               'Host': 'www.qidian.com',
               }

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url,headers=self.headers, dont_filter=True)

    def parse(self, response):

        for course in response.css('.course-card-container'):
            # 创建对象
            item = FictionItem()
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
        # next_url = response.css('.course-list .page a:nth-child(10)::attr(href)').extract_first()
        # if next_url:
        #     next_url = response.urljoin(next_url)
        #     print('下一个爬取页面是：'+ next_url)
        #     yield scrapy.Request(next_url, callback=self.parse)
