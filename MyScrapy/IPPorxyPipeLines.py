# -*- coding: utf-8 -*-

from scrapy.exceptions import DropItem
import json
from .UserFunction import ValidateIP

class IPPorxyPipeLine(object):
    def __init__(self):
        self.file=open('IPPorxy.json','w',encoding='utf-8')
    def process_item(self, item, spider):
        #读取item中的数据
        line = json.dumps(dict(item), ensure_ascii=False) + "\n"
        #写入文件
        self.file.write(line)
        #返回item
        return item
    #该方法在spider被开启时被调用。
    def open_spider(self, spider):
        pass
    #该方法在spider被关闭时被调用。
    def close_spider(self, spider):
        pass
