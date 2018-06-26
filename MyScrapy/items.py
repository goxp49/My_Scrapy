# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class CourseItem(scrapy.Item):
    # define the fields for your item here like:
    # 课程标题
    title = scrapy.Field()
    # 课程等级
    grade = scrapy.Field()
    # 课程人数
    studentnum = scrapy.Field()
    # 课程URL
    url = scrapy.Field()
    # 课程图片
    image = scrapy.Field()

