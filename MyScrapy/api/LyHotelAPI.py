import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, string, re
from urllib.parse import quote
from bs4 import BeautifulSoup



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
    # print(new_url)
    request = urllib.request.Request(url=new_url, headers=index_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    # 获取对应的index
    try:
        result_json = json.loads(f.read().decode('utf-8'))['response']
        # print(result_json)
        if result_json:
            for result in result_json['docs']:
                # 由于JSON已经在服务器排序过，所以第一个结果是最优搜索
                if city in result['cityname']:
                    return result['ecityid']
        return False
    except:
        return False