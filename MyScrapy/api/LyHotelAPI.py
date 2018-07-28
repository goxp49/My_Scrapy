import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, string, re
from urllib.parse import quote
from bs4 import BeautifulSoup

index_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'www.ly.com',
    'Referer': 'www.baidu.com',
}

price_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'm.ly.com',
    'Referer': 'https://m.ly.com',
    'Cookie': "__tctma=144323752.1532675527811530.1532675527791.1532675527791.1532675527791.1; NewProvinceId=4; "
              "NCid=54; NewProvinceName=%E7%A6%8F%E5%BB%BA; NCName=%E7%A6%8F%E5%B7%9E; "
              "Hm_lvt_64941895c0a12a3bdeb5b07863a52466=1532675528,1532676772; "
              "Hm_lpvt_64941895c0a12a3bdeb5b07863a52466=1532676772; "
              "TicketSEInfo=RefId=6928722&SEFrom=baidu&SEKeyWords=; qdid=39264|1|6928722|0a6c16; "
              "__tctmu=144323752.0.0; __tctmz=144323752.1532676770802.1.1.utmccn=("
              "organic)|utmcmd=organic|utmEsl=gb2312|utmcsr=baidu|utmctr=; longKey=1532675527811530; __tctrack=0; "
              "Hm_lvt_c6a93e2a75a5b1ef9fb5d4553a2226e5=1532675543,1532676785; "
              "Hm_lpvt_c6a93e2a75a5b1ef9fb5d4553a2226e5=1532676785; wangba=1532676785528; "
              "CNSEInfo=RefId=18024458&tcbdkeyid=&SEFrom=&SEKeyWords=&RefUrl=; 17uCNRefId=18024458; "
              "__tctmc=144323752.248916955; __tctmd=144323752.215904203; "
              "__tctmb=144323752.2950568820479052.1532676787284.1532676806890.8; user_hotel_history_new=["
              "%2230201158%22]; route=c038dd5908962e8c5b7d772a7ac50921; comedate=2018-07-27; leavedate=2018-07-28",
}


def GetCityIndexAPI(city):
    # 设定去哪儿城市获取index API地址
    api_url = 'https://www.ly.com/commonajax/SearchBoxAjaxHandler/GetNationHotelSearchBoxResult'
    # 设置请求内容
    data = {
        'keyWords': city,
        'HotelSearchType': 1,
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = api_url + "?" + data_bytes  # URL拼接
    # print(new_url)
    request = urllib.request.Request(url=new_url, headers=index_headers)
    response = urllib.request.urlopen(request)
    content = json.loads(response.read().decode('utf-8'))
    try:
        index = content['ReturnValue']['CityList'][0]['cityid']
    except:
        index = None
    return index


def GetTargetHotelIdAndName(city_index, keyword, start_time, end_time):
    api_url = 'https://www.ly.com/searchlist.html'
    # 设置请求内容
    data = {
        'cityid': city_index,
        'sectionid': 0,
        'comedate': start_time,
        'leavedate': end_time,
        'word': keyword,
        'wordid': 0,
        'wordtype': 0,
        'HotelType': 0,
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = api_url + "?" + data_bytes  # URL拼接
    print(new_url)
    request = urllib.request.Request(url=new_url, headers=index_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    data = gzip.GzipFile(fileobj=buff)
    soup = BeautifulSoup(data, 'lxml')
    hotels_soups = soup.select('#hotel-list li.list-li')
    price_min = 99999
    result_dict = {}
    for hotel in hotels_soups:
        name = hotel.get('data-hotel-name')
        id = hotel.get('data-deshotelid')
        # 满房时才能找到这对象
        available = hotel.find('div', 'full-room')
        # 满房时会找不到价格对象，所以需要判断
        price = int(hotel.find('p', 'my-price ').get_text().strip()[1:-1]) if not available else None
        if price and keyword in name and price <= price_min:
            price_min = price
            result_dict['id'] = id
            result_dict['name'] = name
    # print(result_dict)
    return result_dict if result_dict else None


# App比PC端便宜，所以使用App查询
def GetTargetHotelPrice(hotel_id, hotel_name, start_time, end_time):
    api_url = 'https://www.ly.com/hotel/api/tmapi/roomlist/'
    # 设置请求内容
    data = {
        'HotelId': hotel_id,
        'ComeDate': start_time,
        'LeaveDate': end_time,
        'antitoken': '73cad319ace5cc041865d365b0d7df8b',
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = api_url + "?" + data_bytes  # URL拼接
    # print(new_url)
    request = urllib.request.Request(url=new_url, headers=price_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    room_type_list = json.loads(content.decode('utf-8'))['RoomList']
    # 判断获取的房型是否正常
    if not room_type_list:
        return None
    price_min = 99999
    result_dict = {}
    # print(room_type_list)
    # 先获取每个大到房间类型，再获取其中小的床型价格
    for room_type in room_type_list:
        for room in room_type['PolicyInfo']:
            available = room['IsCanYuding']
            price = int(room['AvgPrice'])
            # 选择最低价床型
            if available and price <= price_min:
                price_min = price
                result_dict['name'] = hotel_name
                result_dict['bed_type'] = room_type['Bed']
                result_dict['price'] = price
                # https://www.ly.com/HotelInfo-30101035.html
                result_dict['url'] = 'https://www.ly.com/HotelInfo-%s.html' % hotel_id
    # print(result_dict)
    return result_dict if result_dict else None


# 获得最低价格
def GetLyHotelLowestPrice(city, keywords, start_time, end_time):
    city_index = GetCityIndexAPI(city)
    id_name_dict = GetTargetHotelIdAndName(city_index, keywords, start_time, end_time)
    if id_name_dict and 'id' in id_name_dict.keys() and 'name' in id_name_dict.keys():
        result_dict = GetTargetHotelPrice(id_name_dict['id'], id_name_dict['name'], start_time, end_time)
        print(result_dict if result_dict else ('<同程网>中没有找到合适房型！'))
    else:
        print('<同程网>中没有找到合适房型！')


if __name__ == '__main__':
    # 上海龙安宾馆、上海玩具总动员酒店（91651904）
    # GetCityIndexAPI('xxx')
    # GetTargetHotelIdAndName('321', '上海华晶宾馆', '2018-07-27', '2018-07-28')
    # GetTargetHotelPrice('91651904', '上海华晶宾馆', '2018-07-27', '2018-07-28')
    GetLyHotelLowestPrice('上海', '上海玩具总动员酒店', '2018-07-28', '2018-07-29')