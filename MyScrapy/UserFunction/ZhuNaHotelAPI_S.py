'''
    通过selenium获取住哪网的酒店信息，并找出最低价

    GetCtripHotelLowestPrice(city,keyword) ：通过关键字获取相关酒店的最低房价

    GetCtripHotelIformation(urls)：根据URL获取对应酒店的详细房间信息
'''

from selenium import webdriver
import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, datetime, threading
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import operator  # 导入运算符模块
from bs4 import BeautifulSoup

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'www.zhuna.cn',
}

index_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'kezhan.zhuna.cn',
}
information_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'www.api.zhuna.cn',
}
def GetCityIndexAPI(city):
    # 设定去哪儿城市获取index API地址
    api_url = 'http://kezhan.zhuna.cn/api/city/select'
    # 设置请求内容
    data = {
        'q': city,
        'wt': 'json',
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = api_url + "?" + data_bytes  # URL拼接
    print(new_url)
    request = urllib.request.Request(url=new_url, headers=index_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    # 获取对应的index
    try:
        result_json = json.loads(f.read().decode('utf-8'))['response']
        print(result_json)
        if result_json:
            for result in result_json['docs']:
                # 由于JSON已经在服务器排序过，所以第一个结果是最优搜索
                if city in result['cityname']:
                    return result['ecityid']
        return False
    except:
        return False

# 这个API可以直接获得该酒店下的所有房型信息！
def GetHotelInformationAPI(hotel_ids):
    # 设定住哪儿酒店获取房价的API
    url = 'http://www.api.zhuna.cn/r/json.php'
    # 设置请求内容
    data = {
        'hid': '11304',
        'tm1': '2018-07-14',
        'tm2': '2018-07-18',
        'orderfrom': 'Null',
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = url + "?" + data_bytes  # URL拼接
    print(new_url)
    request = urllib.request.Request(url=new_url, headers=information_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    print(json.loads(f.read().decode('utf-8')))
    # 获取第一页中酒店的价格（网站已自动筛选出最低价）


if __name__ == '__main__':
    GetHotelInformationAPI('北京')
