# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class CourseItem(scrapy.Item):
    # 课程标题
    title = scrapy.Field()
    # 课程等级
    grade = scrapy.Field()
    # 课程人数
    studentnum = scrapy.Field()
    # 课程URL
    url = scrapy.Field()
    # 课程图片连接
    image_urls = scrapy.Field()
    # 课程图片
    image_paths = scrapy.Field()
    # 课程简介
    describe = scrapy.Field()

class IPPorxyItem_kuaidaili(scrapy.Item):
    # IP地址
    ip = scrapy.Field()
    # 类型
    type = scrapy.Field()
    # 位置
    address = scrapy.Field()
    # 响应速度
    speed = scrapy.Field()
    # 最后验证时间
    update_time = scrapy.Field()

class IPPorxyItem_xici(scrapy.Item):
    # IP地址
    ip = scrapy.Field()
    # 类型
    type = scrapy.Field()

class FictionItem(scrapy.Item):
    # 名称
    title = scrapy.Field()
    # 作者
    author = scrapy.Field()
    # 小说类型
    type = scrapy.Field()
    # 小说状态
    status = scrapy.Field()
    # 总字数
    words = scrapy.Field()
    # 小说链接
    fiction_urls = scrapy.Field()
    # 图片链接
    image_urls = scrapy.Field()
    # 图片存储路径
    image_paths = scrapy.Field()