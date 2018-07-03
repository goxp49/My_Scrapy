import scrapy, re,os
from ..items import FictionItem
from ..settings import FONT_STORE
import requests
from fontTools.ttLib import TTFont     # 导包
import xml.etree.ElementTree as et

class QiDianScrapy(scrapy.Spider):
    # 定义爬虫名称
    name = 'QiDianScrapy'
    # 定义开始爬取的网址
    start_urls = ['https://www.qidian.com/all?orderId=&style=1&pageSize=20&siteid=1&pubflag=0&hiddenField=0&page=%x'
                  % x for x in range(1,4)]
    # 设置独立的请求头
    headers = {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
               'Accept-Language': 'zh-CN,zh;q=0.9',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
               'Connection': 'keep-alive',
               'Referer': 'https://www.qidian.com/all',
               'Host': 'www.qidian.com',
               }
    #用于字库破解映射
    number_dict = {
        'period': '.',
        'zero': '0',
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9',
    }

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, headers=self.headers, dont_filter=True)

    def parse(self, response):
        # print(response.url)
        # ---------------------------------先下载字体文件用于破解数字----------------------------------------------
        font_url = re.findall(r'((https|http|ftp|rtsp|mms)?://[^\s]+ttf)',
                              response.css('.update style::text').extract_first())[0][0]
        font_name = response.css('.all-img-list li .update span::attr(class)').extract_first() + '.ttf'
        font_path = os.path.join(FONT_STORE, font_name)
        if os.path.exists('font_path') is False:
            download = requests.get(font_url)
            print('开始下载字体文件：' + font_name)
            with open(font_path , "wb") as file:
                file.write(download.content)
        # ---------------------------------------------------------------------------------------------------------
        # ---------------------------------将字库转换为XML后获取对应数字-------------------------------------------
        xml_path = font_path.replace('.ttf','.xml')
        font = TTFont(font_path)    # 打开文件
        font.saveXML(xml_path)     # 转换成 xml 文件并保存

        root = et.parse(xml_path).getroot()
        # 找到map那一堆标签(PyQuery)
        map_ele = root.find('cmap').find('cmap_format_12').findall('map')
        map_dict = {}
        # 把map那一堆数据存到字典中
        for map in map_ele:
            # print(help(m))
            code = map.attrib['code'].replace('0x', '')
            map_dict[code] = self.number_dict[map.attrib['name']]  # code是键, name是值
        print(map_dict)
        # ---------------------------------------------------------------------------------------------------------
        for fiction in response.css('.all-img-list li'):
            # 创建对象
            item = FictionItem()
            words_temp = ''
            # 获取小说名称
            item['title'] = fiction.css('a[data-eid=qd_B58]::text').extract_first()
            # 获取作者
            item['author'] = fiction.css('a[data-eid=qd_B59]::text').extract_first()
            # 获取小说类型
            item['type'] = fiction.css('a[data-eid=qd_B60]::text').extract_first()
            # 获取小说状态
            item['status'] = fiction.css('.author span::text').extract_first()
            # 通过查表的方式获取小说中字数（表来源于字体中提取）
            for num in str(fiction.css('.update span::text').extract_first().encode("unicode-escape")).strip(
                    '\'').strip('b\'').split(r'\\'):
                print('当前输出字符：' + num)
                #确认有内容才取值
                if num is not "":
                    words_temp += map_dict.get(num[4:])
            item['words'] = words_temp + '万字'
            # 获取小说链接
            item['fiction_urls'] = 'http:' + fiction.css('.book-mid-info a::attr(href)').extract_first()
            # 获取图片链接
            item['image_urls'] = 'http:' + fiction.css('a[data-eid=qd_B57] img::attr(src)').extract_first()

            yield item

        # #获取字库的信息，将其加入爬取目标中
        # font_url = response.css('.update style::text').extract_first()
        # #正则神器网站
        # #http://tools.jb51.net/regex/create_reg
        # #http://tools.jb51.net/regex/javascript
        # font_url = re.findall(r'((https|http|ftp|rtsp|mms)?://[^\s]+ttf)', font_url)[0][0]
        # if font_url:
        #     print('添加字体文件URL：' + font_url)
        #     next_url = response.urljoin(font_url)
        #     yield scrapy.Request(next_url, callback=self.parse)
