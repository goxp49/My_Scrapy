# coding=utf-8

'''
    用于获取大众点评网中关于酒店的起步价格

    URL：http://www.dianping.com/hotelproduct/pc/hotelListPrice

    方法：POST

    输出：{code: 200, msg: {price: [149, 538, 932, 229, 951, 218, 917, 380, 886, 686, 952, 442, 413, 557, 408]}}

'''

import urllib.request,urllib.parse
from io import BytesIO
import json,time,gzip,datetime
from pandas.tseries.offsets import Day

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Referer': 'https://www.baidu.com',
    'Host': 'www.dianping.com',
}

def GetHotelMinimumPrice(shopIds,start_date,end_date):

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
    #request接收的data数据必须为字节流，因此需要进行转换
    data_bytes = bytes(urllib.parse.urlencode(data), encoding='utf8')
    request = urllib.request.Request(url=url, data=data_bytes, headers=headers,method='POST')
    response = urllib.request.urlopen(request)
    content = response.read() # content是压缩过的数据
    buff = BytesIO(content) # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    return f.read().decode('utf-8')

'''
    获取酒店的详细房间信息
'''
def GetHotelDetailInformation(shopId,start_date,end_date):

    url = 'http://www.dianping.com/hotelproduct/pc/hotelPrepayAndOtaGoodsList'
    data = {
        'utm_medium': 'touch',
        'utm_campaign': 'ADianpingB',
        'uuid': '160a0033f88c8-095625a82000b5-7b113d-100200-160a0033f88c8',
        'init': True,
        'shopId': shopId,   #'2190139',
        'checkinDate': start_date,  #'2018-07-5',
        'checkoutDate': end_date,   #'2018-07-6',
        '_token': 'eJxVTttqg0AQ/Zd5XnRnd9VEyIOhITFNDDViKSEP3jAS1K0usbT03zuB5KEwcC5zDpwfGMISfOSco2JwqwbwAS1uucDAjPRxJPc8KT1UQjIo/nsuegzyIX0B/4SzmWAopTrfrZick3BczlApfmZPzokLRXdPhRSCizHat+1pmqyyyTrddLVV9K09XnptC5xzlHMaA1RoEyoQXh+YPdA89Z7WU3Zs6o5Ytf1KjqMTJoV3+N5E292qxSgJJxMFuI8KTN8OO0dX733Q5J9x2jnLUmlTZ+u0z9ZLnb/WqyC+fcRTvVjA7x+jSlIr',
    }

    #request接收的data数据必须为字节流，因此需要进行转换
    data_bytes = bytes(urllib.parse.urlencode(data), encoding='utf8')
    request = urllib.request.Request(url=url, data=data_bytes, headers=headers)
    response = urllib.request.urlopen(request)
    content = response.read() # content是压缩过的数据
    buff = BytesIO(content) # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    return json.loads(f.read().decode('utf-8'))['data']['hotelGoodsList']['roomList']

if __name__ == '__main__':
    #print(GetHotelMinimumPrice('2190139','2018-7-5','2018-7-5')
    now_time = datetime.datetime.now().strftime('%Y-%m-%d')
    next_day_time = (datetime.datetime.now() + Day()).strftime('%Y-%m-%d')
    print(GetHotelDetailInformation('2190139',now_time ,next_day_time))
    print(type(GetHotelDetailInformation('2190139','2018-07-5','2018-07-6')))