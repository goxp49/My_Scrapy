import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, datetime, threading
import operator  # 导入运算符模块
from pandas.tseries.offsets import Day
from bs4 import BeautifulSoup

bed_list = ['', '大床', '双床', '', '多床']
network_list = ['没有网络', '提供WIFI', '有线网络']

index_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'hs.qunar.com',
}

list_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'touch.qunar.com',
}


def GetCityIndex(city):
    # 设定去哪儿城市index API地址
    api_url = 'http://hs.qunar.com/api/hs/citysugV3'
    # 设置请求内容
    data = {
        'city': city,
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = api_url + "?" + data_bytes  # URL拼接
    # print(new_url)
    request = urllib.request.Request(url=new_url, headers=index_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    # print(json.loads(f.read().decode('utf-8'))['data'])
    try:
        result_json = json.loads(f.read().decode('utf-8'))['data']
        if result_json:
            for result in result_json:
                # 由于JSON已经在服务器排序过，所以第一个结果是最优搜索
                if city in result['c']:
                    return result['o']
        return False
    except:
        return False


def GetTargetHotelList(city, city_index, keywords, start_time, end_time):
    api_url = 'https://touch.qunar.com/hotel/hotellist'
    # 设置请求内容
    data = {
        'city': city,
        'cityUrl': city_index,
        'checkInDate': start_time,
        'checkOutDate': end_time,
        'keywords': keywords,
        'extra': '{"L":"","DU":"","MIN":0,"MAX":0}',
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = api_url + "?" + data_bytes  # URL拼接
    # print(new_url)
    request = urllib.request.Request(url=new_url, headers=list_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    html = f.read().decode('utf-8')
    soup = BeautifulSoup(html, 'lxml')
    hotel_soups = soup.find_all('li', 'qt-bb-x1')
    price_min = 99999  # 初始化最低价格
    lowest_hotel_id = None
    for hotel in hotel_soups:
        hotel_name = hotel.find('p', 'hotel-title').string
        hotel_available = hotel.find('span', 'qt-mr5')
        hotel_price = hotel_available.get_text().split('n')[1] if hotel_available else '100000'
        print(hotel_name)
        print(hotel_price)
        if keywords in hotel_name and int(hotel_price) <= price_min:
            price_min = int(hotel_price)
            lowest_hotel_id = hotel.get('data-id')
    return lowest_hotel_id


def GetTargetHotelPrice(hotel_id, hotel_name,start_time, end_time):
    api_url = 'https://touch.qunar.com/api/hotel/hotelprice'
    # 设置请求内容
    data = {
        'seq': 'shanghai_city_24925',
        'checkInDate': '2018-07-24',
        'checkOutDate': '2018-07-25',
        'type': 0,
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = api_url + "?" + data_bytes  # URL拼接
    # print(new_url)
    request = urllib.request.Request(url=new_url, headers=list_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    roomlist = json.loads(f.read().decode('utf-8'))['data']['rooms']
    price_min = 99999
    result_dict = {}
    print(roomlist)
    for room in roomlist:
        bed_type = room['name']
        price = int(room['lowPrice'])
        if price <= price_min:
            price_min = price
            result_dict['name'] = hotel_name
            result_dict['bed_type'] = bed_type
            result_dict['price'] = price
            result_dict['url'] = hotel_id.split('_')[-1:]
            print(result_dict['url'])
        print(bed_type)
        print(price)


if __name__ == '__main__':
    # GetCtripHotelUrl('锦江都城酒店')  # 富豪/随意/丽思卡尔顿
    # print(GetTargetHotelList('上海', 'shanghai_city', '丽思卡尔顿', '2018-07-24', '2018-07-26'))
    print(GetTargetHotelPrice('shanghai_city_24925','n',1,1))
