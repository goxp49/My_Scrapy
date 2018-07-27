import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, string, re
from urllib.parse import quote
from bs4 import BeautifulSoup

id_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 's.lvmama.com',
}

price_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'hotels.lvmama.com',
    'Origin': 'http://hotels.lvmama.com',
    'Referer': 'http://www.baidu.com',
}


# 测试发现改变日期对价格显示无影响，显示的价格与酒店页面中价格不一致
def GetTargetHotelIdAndName(city, keywords, start_time, end_time):
    start_time = start_time.strip('-')
    end_time = end_time.strip('-')
    # http://s.lvmama.com/hotel/U9C20180727O20180728?keyword=%E5%A6%82%E5%AE%B6&mdd=%E4%B8%8A%E6%B5%B7
    api_url = 'http://s.lvmama.com/hotel/U9C%sO%s' % (start_time, end_time)
    # 设置请求内容
    data = {
        'keyword': keywords,
        'mdd': city,
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = api_url + "?" + data_bytes  # URL拼接
    # print(new_url)
    request = urllib.request.Request(url=new_url, headers=id_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    html = f.read().decode('utf-8')
    soup = BeautifulSoup(html, 'lxml')
    hotel_soups = soup.find_all('div', 'prdLi')
    price_min = 99999
    result_dicr = {}
    for hotel in hotel_soups:
        hotel_name = hotel.get('name')
        hotel_price = int(hotel.find('span', 'num').string)
        # print(hotel_name)
        # print(hotel_price)
        # print(keywords in hotel_name)
        if keywords in hotel_name and hotel_price <= price_min:
            price_min = hotel_price
            # 通过正则表达式获取属性中的酒店url地址 属性：clickAndRecovery('','','','1211259','如家快捷酒店（上海虹桥枢纽曹安路轻纺市场店）',
            # 'http://hotels.lvmama.com/hotel/1211259.html',
            # 'http://pic.lvmama.com/uploads/pc/place_vst/hotels/10605/106054/images-t1-hotel-1207000-1206069
            # -cca58855a6cf4f7998025cacf2289fa9-R-550-412-R20_480_320.jpg', '127', '')
            re_str = hotel.find('a', 'proImg').get('onclick')
            result_dicr['name'] = hotel_name
            result_dicr['id'] = re.search(r'(https|http|ftp|rtsp|mms)?://[^\s]+[\D]+([\d]+).html', re_str).group(
                2)  # 匹配结果
    # print(result_dicr)
    return result_dicr if result_dicr else None


def GetTargetHotelPrice(hotel_id, hotel_name, start_time, end_time):
    url = 'http://hotels.lvmama.com/prod/hotel/showNewHotelGoods.do'
    # 设置请求内容
    data = {
        'startDateStr': start_time,
        'endDateStr': end_time,
        'productId': hotel_id,
        'getTopTwo': False,
        'getPropInfo': False,
        'notSell': 'N',
        'removeTimePriceTabel': 'removeTimePriceTabel',
    }
    data_bytes = bytes(urllib.parse.urlencode(data), encoding='utf8')
    request = urllib.request.Request(url=url, data=data_bytes, headers=price_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    html = f.read().decode('utf-8')
    soup = BeautifulSoup(html, 'lxml')
    rooms_soups = soup.find_all('div', 'room_list')
    price_min = 99999
    lowest_dict = {}
    # 获取每个房型的价格
    for room in rooms_soups:
        bed_type = room.find('h4').string
        price = int(room.find('span', 'num').string)
        available = room.find('div', 'saleoff')  # 找到则说明已售光
        # 查找价格最低且有空余的房型
        if not available and price <= price_min:
            price_min = price
            lowest_dict['name'] = hotel_name
            lowest_dict['bed_type'] = bed_type
            lowest_dict['price'] = price
            lowest_dict['url'] = 'http://hotels.lvmama.com/hotel/%s.html' % hotel_id
    return lowest_dict if lowest_dict else None


# 获得最低价格
def GetLvmamaHotelLowestPrice(city, keywords, start_time, end_time):
    id_name_dict = GetTargetHotelIdAndName(city, keywords, start_time, end_time)
    if id_name_dict and 'id' in id_name_dict.keys() and 'name' in id_name_dict.keys():
        result_dict = GetTargetHotelPrice(id_name_dict['id'], id_name_dict['name'], start_time, end_time)
        print(result_dict if result_dict else ('<驴妈妈>中没有找到合适房型！'))
    else:
        print('<驴妈妈>中没有找到合适房型！')


if __name__ == '__main__':
    # 上海龙安宾馆(1195995)\上海华晶宾馆(1196965)\玩具总动员酒店(662997)
    # GetTargetHotelUrl('上海','上海龙安宾馆', '2018-07-25', '2018-07-26')
    # GetTargetHotelPrice('1196965', '上海龙安宾馆', '2018-07-27', '2018-07-30')
    GetLvmamaHotelLowestPrice('上海', '上海新发展亚太JW万豪酒店', '2018-07-27', '2018-07-30')
