'''
    通过selenium获取住哪网的酒店信息，并找出最低价

    GetCityIndexAPI(city) ：获得各城市的URL代码

    GetHotelIdName(city,keyword)： 获取酒店的ID与名称对应关系

    GetHotelInformationAPI(id_name_dict, star_time, end_time)：获取酒店的最低价格等信息

    GetZhuNaHotelLowestPrice(city,keyword)： 根据城市与关键字查找酒店的最低价格
'''

import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, datetime, threading
from bs4 import BeautifulSoup
from pandas.tseries.offsets import Day

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
def GetHotelInformationAPI(id_name_dict, star_time, end_time):
    # 设定住哪儿酒店获取房价的API
    url = 'http://www.api.zhuna.cn/r/json.php'
    # 将id取出
    hotel_ids = []
    for id,name in id_name_dict.items():
        hotel_ids.append(id)
    hotel_ids = ','.join(hotel_ids)
    # 设置请求内容
    data = {
        'hid': hotel_ids,   # '11304,14764,12404,6190,11186,11252,7504,5064,14714,22913',
        'tm1': star_time,   #'2018-07-14',
        'tm2': end_time,    #'2018-07-17',
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
    hotel_list = json.loads(f.read().decode('utf-8'))
    # 获取第一页中酒店的价格（网站已自动筛选出最低价）
    # 获取的第一个房间价格一定是最低的
    # 'max_price = 0'表示酒店已经没有可预订的房间
    # result_list用于保存搜索结果
    result_list = []
    for hotel in hotel_list:
        temp_dict = {}
        #temp_dict['available'] = False if hotel['max_price'] == 0 else True
        if hotel['max_price'] != 0:
            temp_dict['name'] = id_name_dict[str(hotel['zid'])]
            temp_dict['min_price'] = hotel['rooms'][0]['plans'][0]['AverageRate']
            temp_dict['bed_type'] = hotel['rooms'][0]['bed']
            result_list.append(temp_dict)
            print(temp_dict['name'])
            print(temp_dict['min_price'])
            print(temp_dict['bed_type'])
    # 返回搜索结果
    return result_list

# 通过关键字与地点获取酒店的id和对应的名称，返回的是dict[id, val]
def GetHotelIdName(city,keyword):
    city_index = GetCityIndexAPI(city)
    if not city_index:
        raise RuntimeError('没有找到(住哪儿网)对应城市的索引')
    # 设定去哪儿城市获取index API地址
    url = 'http://www.zhuna.cn/hotellist/e%s/' % city_index
    # 设置请求内容
    data = {
        'q': keyword,
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = url + "?" + data_bytes  # URL拼接
    print(new_url)
    request = urllib.request.Request(url=new_url, headers=headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    data = gzip.GzipFile(fileobj=buff)
    soup = BeautifulSoup(data, 'lxml')
    id_soups = soup.find_all('div', 'lb_con1')
    result_dict = {}
    for id_soup in id_soups:
        # 只保存含有关键字的结果
        if keyword in id_soup.find('a').string:
            #从结果中提取出id值\对应的酒店名
            result_dict.setdefault(id_soup.attrs['id'].split('_')[1], id_soup.find('a').string)
    print(result_dict)
    return result_dict

# 获取对应酒店最低价格
# 流程：获取城市对应索引 --> 获取目标酒店ID --> 获取目标酒店价格
def GetZhuNaHotelLowestPrice(city,keyword):
    now_time = datetime.datetime.now().strftime('%Y-%m-%d')
    next_day_time = (datetime.datetime.now() + Day()).strftime('%Y-%m-%d')
    id_name_dict = GetHotelIdName(city, keyword)
    # 确认搜索结果不为空
    if id_name_dict:
        GetHotelInformationAPI(id_name_dict, now_time, next_day_time)
    else:
        print('目标酒店不存在！')


if __name__ == '__main__':
    #GetHotelInformationAPI('11304,14764')
    GetZhuNaHotelLowestPrice('上海', '')
    #GetHotelId('上海', '上海新锦江大酒店')