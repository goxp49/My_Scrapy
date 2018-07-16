# coding=utf-8

'''
    用于获取携程网中关于酒店的起步价格，由于携程的搜索结果是通过Ajax来显示，所以
    无需多做URL递归，只需递归Ajax查询即可

    URL：http://hotels.ctrip.com/Domestic/Tool/AjaxHotelList.aspx

    方法：POST

    输出：{"totalMsg":"<b id=\"lblAmount\">14014</b> 家酒店","hotelAmount"………………}

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
    'Host': 'hotels.ctrip.com',
    'Origin': 'http://hotels.ctrip.com',
}

def GetHotelList():

    url = 'http://hotels.ctrip.com/Domestic/Tool/AjaxHotelList.aspx'
    # data = {
    #     'shopIds': '2190139,2325763,16971619,13896465,4559936,2884120,17181289,3527272,6177978,2325745,8060078,13770053,2325799,5191433,6724043,',
    #     'start': '2018-7-5',
    #     'end': '2018-7-5',
    # }
    data = {
               '__VIEWSTATEGENERATOR': 'DB1FBB6D',
               'cityName': '重庆',
    'StartTime': '2018-07-07',
    'DepTime': '2018-07-08',
    'RoomGuestCount': '1, 1, 0',
    'txtkeyword':'',
    'Resource':'',
    'Room':'',
    'Paymentterm':'',
    'BRev':'',
    'Minstate':'',
    'PromoteType':'',
    'PromoteDate':'',
    'operationtype': 'NEWHOTELORDER',
    'PromoteStartDate':'',
    'PromoteEndDate':'',
    'OrderID':'',
    'RoomNum':'',
    'IsOnlyAirHotel': 'F',
    'cityId': '4',
    'cityPY': 'chongqing',
    'cityCode': '023',
    'cityLat': '29.5693030786',
    'cityLng': '106.5579918074',
    'positionArea':'',
    'positionId':'',
    'hotelposition':'',
    'keyword':'',
    'hotelId':'',
    'htlPageView':'0',
    'hotelType': 'F',
    'hasPKGHotel': 'F',
    'requestTravelMoney': 'F',
    'isusergiftcard': 'F',
    'useFG': 'F',
    'HotelEquipment':'',
    'priceRange': '-2',
    'hotelBrandId':'',
    'promotion': 'F',
    'prepay': 'F',
    'IsCanReserve': 'F',
    'OrderBy': '99',
    'OrderType':'',
    'k1':'',
    'k2':'',
    'CorpPayType':'',
    'viewType':'',
    'checkIn': '2018-07-07',
    'checkOut': '2018-07-08',
    'DealSale':'',
    'ulogin':'',
    'hidTestLat': '0|0',
    'AllHotelIds': '6238298,5240070,2638694,2697130,1451725,6336835,1214343,2295624,3484522,532149,12599430,'
                   '449668,12402004,13982827,5435182,11328075,445411,967705,445538,4807222,1743129,17491688,1578513,1337534,8020262',
    'psid':'',
    'isfromlist': 'T',
    'ubt_price_key': 'htl_search_result_promotion',
    'showwindow':'',
    'defaultcoupon':'',
    'isHuaZhu': False,
    'hotelPriceLow':'',
    'htlFrom': 'hotellist',
    'unBookHotelTraceCode':'',
    'showTipFlg':'',
    'hotelIds': '6238298_1_1, 5240070_2_1, 2638694_3_1, 2697130_4_1, 1451725_5_1, 6336835_6_1, 1214343_7_1,'
                '2295624_8_1, 3484522_9_1, 532149_10_1, 12599430_11_1, 449668_12_1, 12402004_13_1, 13982827_14_1,'
                '5435182_15_1, 11328075_16_1, 445411_17_1, 967705_18_1, 445538_19_1, 4807222_20_1, 1743129_21_1,'
                '17491688_22_1, 1578513_23_1, 1337534_24_1, 8020262_25_1',
    'markType': 0,
    'zone':'',
    'location':'',
    'type':'',
    'brand':'',
    'group':'',
    'feature':'',
    'equip':'',
    'bed':'',
    'breakfast':'',
    'other':'',
    'star':'',
    'sl':'',
    's':'',
    'l':'',
    'price':'',
    'a': 0,
    'keywordLat':'',
    'keywordLon':'',
    'contrast': 0,
    'PaymentType':'',
    'CtripService':'',
    'promotionf':'',
    'contyped': 0,
    'productcode':'',
    'page': 2,
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
def GetHotelDetailInformation():
    url = 'http://hotels.ctrip.com/hotel/8020262.html'

    #request接收的data数据必须为字节流，因此需要进行转换
    request = urllib.request.Request(url=url, headers=headers)
    response = urllib.request.urlopen(request)
    content = response.read() # content是压缩过的数据
    buff = BytesIO(content) # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    return f.read().decode('utf-8')

if __name__ == '__main__':
    print(GetHotelList())