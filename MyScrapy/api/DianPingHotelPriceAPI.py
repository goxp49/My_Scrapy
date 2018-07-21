# coding=utf-8

'''
    用于获取大众点评网中关于酒店的起步价格

    URL：http://www.dianping.com/hotelproduct/pc/hotelListPrice

    方法：POST

    输出：{code: 200, msg: {price: [149, 538, 932, 229, 951, 218, 917, 380, 886, 686, 952, 442, 413, 557, 408]}}

'''

import urllib.request, urllib.parse
from urllib.parse import quote
from io import BytesIO
import json, time, gzip, datetime, string
from pandas.tseries.offsets import Day
from MyScrapy.userfaction.PinYinUtil import to_pinyin
from bs4 import BeautifulSoup

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Referer': 'https://www.baidu.com',
    'Host': 'www.dianping.com',
    # 'Cookie': '_lxsdk_cuid=1646549e147c8-055f4efef223ce-737356c-144000-1646549e147c8; '
    #           '_lxsdk=1646549e147c8-055f4efef223ce-737356c-144000-1646549e147c8; '
    #           '_hc.v=ed0f5c81-1a2d-ceca-d718-99e075e10071.1530707698; s_ViewType=10; aburl=1; '
    #           '_dp.ac.v=e67bfe64-0ecb-4c7c-827d-3a92bf54bf01; '
    #           'dper'
    #           '=74bbbe35954443dcae6e88e8cff40dfeb8c6ead906126ca71c0265adbb32142fb2bac49e1cf21e98eb04b8b43c9fca81b73f098d6e1e1d79c04f95da468790ef78bc5167ef73daca9944b471521e82f9969525ac8462ce4bac1462462eba98f2; ua=dpuser_8345204909; '
    #           'ctu=dd2891b53f8b5190247c37fa499b58743136a1509698dbcc8d40e3a2672a6356; '
    #           'll=7fd06e815b796be3df069dec7836c3df; _tr.u=VK9CHvpX7DIUs6Tr; cy=1; cye=shanghai; '
    #           '_lx_utm=utm_source%3Dbaidu%26utm_medium%3Dorganic%26utm_term%3D%25E5%25A4%25A7%25E4%25BC%2597%25E7'
    #           '%2582%25B9%25E8%25AF%2584; selectLevel=%7B%7D; '
    #           '__mta=243004349.1530707957424.1532087814245.1532087837331.20; '
    #           'cityInfo=%7B%22cityId%22%3A1%2C%22cityEnName%22%3A%22shanghai%22%2C%22cityName%22%3A%22%E4%B8%8A%E6%B5'
    #           '%B7%22%7D; hotelTime=2018-07-21%7C2018-07-22; _lxsdk_s=164b7bf08e5-531-f45-853%7C%7C17',
}


def GetHotelMinimumPrice(shopIds, start_date, end_date):
    url = 'http://www.dianping.com/hotelproduct/pc/hotelListPrice'
    # data = {
    #     'shopIds': '2190139,2325763,16971619,13896465,4559936,2884120,17181289,3527272,6177978,2325745,8060078,13770053,2325799,5191433,6724043,',
    #     'start': '2018-7-5',
    #     'end': '2018-7-5',
    # }
    data = {
        'shopIds': shopIds,
        'start': start_date,
        'end': end_date,
    }
    # request接收的data数据必须为字节流，因此需要进行转换
    data_bytes = bytes(urllib.parse.urlencode(data), encoding='utf8')
    request = urllib.request.Request(url=url, data=data_bytes, headers=headers, method='POST')
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    return f.read().decode('utf-8')


'''
    获取酒店的详细房间信息
'''


def GetHotelDetailInformation(shopId, hotel_name, start_date, end_date):
    url = 'http://www.dianping.com/hotelproduct/pc/hotelPrepayAndOtaGoodsList'
    data = {
        'utm_medium': 'touch',
        'utm_campaign': 'ADianpingB',
        'uuid': '160a0033f88c8-095625a82000b5-7b113d-100200-160a0033f88c8',
        'init': True,
        'shopId': shopId,  # '2190139',
        'checkinDate': start_date,  # '2018-07-5',
        'checkoutDate': end_date,  # '2018-07-6',
        '_token': 'eJxVTttqg0AQ/Zd5XnRnd9VEyIOhITFNDDViKSEP3jAS1K0usbT03zuB5KEwcC5zDpwfGMISfOSco2JwqwbwAS1uucDAjPRxJPc8KT1UQjIo/nsuegzyIX0B/4SzmWAopTrfrZick3BczlApfmZPzokLRXdPhRSCizHat+1pmqyyyTrddLVV9K09XnptC5xzlHMaA1RoEyoQXh+YPdA89Z7WU3Zs6o5Ytf1KjqMTJoV3+N5E292qxSgJJxMFuI8KTN8OO0dX733Q5J9x2jnLUmlTZ+u0z9ZLnb/WqyC+fcRTvVjA7x+jSlIr',
    }

    # request接收的data数据必须为字节流，因此需要进行转换
    data_bytes = bytes(urllib.parse.urlencode(data), encoding='utf8')
    request = urllib.request.Request(url=url, data=data_bytes, headers=headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    file = f.read().decode('utf-8')
    room_list = json.loads(file)['data']['hotelGoodsList']['roomList']
    price_min = 99999
    dict_temp = {}
    # 获得房型大类
    for room_big in room_list:
        # 获得房型小类
        for room_small in room_big['goodsList']:
            available = room_small['inventoryMin']
            price = room_small['price']
            if available != 0 and price <= price_min:
                price_min = price   # 更新最小价格
                dict_temp['name'] = hotel_name
                dict_temp['bed_type'] = room_small['bedType']
                dict_temp['price'] = room_small['price']
                dict_temp['url'] = 'http://www.dianping.com/shop/%s' % shopId
    print(dict_temp)
    return dict_temp

# 获得目标酒店的id列表
def GetTargetHotelIdAndName(city, keywords):
    city_index = to_pinyin(city)
    url = 'http://www.dianping.com/%s/hotel/_%s' % (city_index, keywords)
    new_url = quote(url, safe=string.printable)
    print(new_url)
    request = urllib.request.Request(url=new_url, headers=headers)
    response = urllib.request.urlopen(request)
    content = response.read()
    soup = BeautifulSoup(content, 'lxml')
    hotel_soups = soup.find_all('li', 'hotel-block')
    ids_list = []
    for hotel in hotel_soups:
        dict_temp = {}
        hotel_id = hotel.get('data-poi')
        hotel_name = hotel.find('a', 'hotel-name-link').string
        # 判断是否包含关键词
        if keywords in hotel_name:
            dict_temp['id'] = hotel_id
            dict_temp['name'] = hotel_name
            ids_list.append(dict_temp)
        # print(hotel_name)
        # print(hotel_id)
    return ids_list


if __name__ == '__main__':
    # print(GetHotelMinimumPrice('2190139','2018-7-5','2018-7-5')
    now_time = datetime.datetime.now().strftime('%Y-%m-%d')
    next_day_time = (datetime.datetime.now() + Day()).strftime('%Y-%m-%d')
    # print(GetHotelDetailInformation('2190139', now_time, next_day_time))
    # print(type(GetHotelDetailInformation('2190139', now_time, next_day_time)))
    # GetTargetHotelIds('上海', '如家')
    print(GetHotelDetailInformation('2032231', '傻逼','2018-07-21', '2018-07-22'))