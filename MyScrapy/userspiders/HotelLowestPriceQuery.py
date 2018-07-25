"""
    获取通过携程、去哪儿、住哪儿获取酒店的最低报价

    输入：城市(city)、关键字(keyword)、入住日期(start_time)、离开日期(end_time)

    输出：酒店名(name)、房型(bed_type)、最低价(price)、URL(url)，数据格式：LIST[DICT1、DICT2…………]

    备注：当没找到合适的房间时返回None
"""


import threading
from MyScrapy.api.ZhuNaHotelAPI import GetZhuNaHotelLowestPrice
from MyScrapy.api.QunarHotelAPI import GetQunarHotelLowestPrice
from MyScrapy.api.DianPingHotelPriceAPI import GetDianPingLowestPrice
from MyScrapy.api.CtripHotelAPI import GetCtripHotelLowestPrice

def GetAllWebsitePirce(city, keyword, start_time, end_time):
    thread_list = []  # 线程存放列表
    thread_list.append(threading.Thread(target=GetZhuNaHotelLowestPrice, args=(city, keyword, start_time, end_time), name='住哪网'))
    thread_list.append(threading.Thread(target=GetQunarHotelLowestPrice, args=(city, keyword, start_time, end_time), name='去哪网'))
    thread_list.append(threading.Thread(target=GetDianPingLowestPrice, args=(city, keyword, start_time, end_time), name='点评网'))
    thread_list.append(threading.Thread(target=GetCtripHotelLowestPrice, args=(city, keyword, start_time, end_time), name='携程网'))
    for t in thread_list:
        t.start()

    for t in thread_list:
        t.join()

    print('运行结束！')


if __name__ == '__main__':
    GetAllWebsitePirce('上海', '上海新发展亚太JW万豪酒店', '2018-07-25', '2018-07-30')