# -*- coding: utf-8 -*-

# Define here the models for your spider middleware
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
from MyScrapy.settings import PorxyFilePath
import time,random,json

class ProxyMiddleWare(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called
        #return None
        proxy = self.get_random_proxy()
        print("当前请求使用的代理ip为:" + proxy)
        request.meta['proxy'] = proxy
        return None

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.

        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest

        if response.status != 200:
            proxy = self.get_random_proxy()
            print("this is response ip:" + proxy)
            # 对当前reque加上代理
            request.meta['proxy'] = proxy
            return request
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        #pass

        proxy = self.get_random_proxy()
        print('IP请求超时,将使用新IP请求：'+ proxy)
        request.meta['proxy'] = proxy
        return request

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)

    def get_random_proxy(self):
        """随机从文件中读取proxy"""
        while 1:
            with open(PorxyFilePath, 'r') as file:
                proxies = file.readlines()
            if proxies:
                break
            else:
                time.sleep(1)
        #数据为'https://114.225.169.32:53128' 样式
        proxy =  random.choice(proxies).strip()
        return proxy


if __name__ == '__main__':
    print(ProxyMiddleWare().get_random_proxy())