'''
    通过selenium获取携程的酒店信息

    SearchCtripHotelUrl(keywork) ：通过关键字获取相关酒店的URL

    GetCtripHotelIformation(urls)：根据URL获取对应酒店的详细房间信息
'''

from selenium import webdriver
import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, string
from urllib.parse import quote
from bs4 import BeautifulSoup

bed_list = ['', '大床', '双床', '', '多床']
network_list = ['没有网络', '提供WIFI', '有线网络']
headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Referer': 'http://www.ctrip.com/',
    'Host': 'm.ctrip.com',
    'Origin': 'http://www.ctrip.com'
}

index_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Host': 'hotels.ctrip.com',
}

list_headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Host': 'hotels.ctrip.com',
    'Origin': 'http://www.ctrip.com',
    'Referer': 'http://www.ctrip.com/',
    'Cookie': '_abtest_userid=61af2760-de3d-4762-8768-59278b49706c; _ga=GA1.2.2071221705.1530883501; '
              'MKT_Pagesource=PC; _RSG=KCalN5l8Na708LIPiN61K9; _RDG=2816579724a37b2931057df9cc00ae9c27; '
              '_RGUID=791722f1-57be-4314-9501-197b19495200; StartCity_Pkg=PkgStartCity=258; Corp_ResLang=zh-cn; '
              '_RF1=124.72.244.136; _gid=GA1.2.999617163.1531829417; appFloatCnt=11; manualclose=1; '
              'HotelDomesticVisitedHotels1=1569729=0,0,4.5,9200,/200w080000002zosp5BBE.jpg,&436187=0,0,4.4,8705,'
              '/200n0s000000hhavcFF0F.jpg,&472757=0,0,4.4,1779,'
              '/fd/hotel/g3/M09/72/2B/CggYGVY8GlmAJ_RjABA9tOa05Eg752.jpg,&981622=0,0,4.5,808,'
              '/200u0q000000g4c2o517C.jpg,&978086=0,0,4.5,798,'
              '/hotel/439000/438574/2f85a12c2f044858971a3337d73aef50.jpg,&975443=0,0,4.5,3084,'
              '/200a0r000000hcwpm2AEA.jpg,'
              '; _bfa=1.1530883496718.13phf2.1.1531916698006.1532000932091.12.176.600001375; _bfs=1.1; _gat=1; '
              'Mkt_UnionRecord=%5B%7B%22aid%22%3A%224897%22%2C%22timestamp%22%3A1532005872646%7D%5D; '
              'Session=smartlinkcode=U130026&smartlinklanguage=zh&SmartLinkKeyWord=&SmartLinkQuary=&SmartLinkHost=; '
              'Union=AllianceID=4897&SID=130026&OUID=&Expires=1532605737512; '
              '_jzqco=%7C%7C%7C%7C%7C1.1003814229.1530883501572.1531920890549.1532000937602.1531920890549'
              '.1532000937602.0.0.0.147.147; __zpspc=9.13.1532000937.1532000937.1%232%7Cwww.baidu.com%7C%7C%7C%25E6'
              '%2590%25BA%25E7%25A8%258B%7C%23; _bfi=p1%3D100101991%26p2%3D0%26v1%3D176%26v2%3D0; '
    ,
}



# 通过API获取指定对应城市的索引
def GetCityIndex(city):
    url = 'http://hotels.ctrip.com/Domestic/Tool/AjaxDestination.aspx'
    # 设置请求内容
    data = {
        'keyword': city,
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = url + "?" + data_bytes  # URL拼接
    # print(new_url)
    try:
        request = urllib.request.Request(url=new_url, headers=index_headers)
        response = urllib.request.urlopen(request)
        content = response.read()  # content是压缩过的数据
        buff = BytesIO(content)  # 把content转为文件对象
        f = gzip.GzipFile(fileobj=buff)
        # 获得原始结果'cQuery.jsonpResponse={"key":"北京","data":"@Beijing|北京|1|15660|北京||Cit………………'
        original_str = f.read().decode('utf-8')
        # print(original_str.split('=')[1].split('@')[1].split('|'))
        process_str = original_str.split('=')[1].split('@')[1].split('|')
        # ['Beijing', '北京', '1', '15660', '北京', '', 'City', '北京', '1', '1', '1', '', '', '', '1']
        # 返回结果,检查结果是否包含城市名称,不包含则返回None
        return process_str[0] + process_str[2] if city in process_str[1] else None
    except:
        return None


# 通过城市索引获取酒店搜索结果
# 携程会依据Cookie来显示不同的价格（险恶），没有Cookie时会更便宜~

def GetHotelPricr(city_index, hotel_name, start_time, end_time):
    url = 'http://hotels.ctrip.com/hotel/%s/k1%s#ctm_ref=ctr_hp_sb_lst' % (city_index, hotel_name)
    new_url = quote(url, safe=string.printable)
    #new_url = urllib.parse.quote(url)
    # 设置请求内容
    data = {
        'checkIn': start_time,  #'2018-7-19',
        'checkOut': end_time,   #'2018-07-25',
        'RoomGuestCount': '1,1,0',
        'Star': 0,
    }

    data_bytes = bytes(urllib.parse.urlencode(data), encoding='utf8')
    # print(new_url)
    request = urllib.request.Request(url=new_url, data=data_bytes, headers=list_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    file = gzip.GzipFile(fileobj=buff).read().decode('utf-8')
    soup = BeautifulSoup(file, 'lxml')
    hotel_soups = soup.find_all('div', 'hotel_new_list')
    # print(hotel_soups)
    result_dict = {}
    price_min = 99999  # 初始化最低价格
    for hotel in hotel_soups:
        dict_temp = {}
        if hotel.find('span', 'J_price_lowList'):
            dict_temp['name'] = hotel.select_one('.hotel_name a').get('title')
            dict_temp['price'] = hotel.select_one('.J_price_lowList').string
            # 判断是否还有剩余房间,如果能找到对象，说明已经没房
            dict_temp['available'] = hotel.select_one('.sale_out')
            # print(dict_temp['available'])
            # print(dict_temp['name'])
            # print(dict_temp['price'])
            # 只有酒店名中包含关键字才会被添加
            if hotel_name in dict_temp['name'] and int(dict_temp['price']) <= price_min and not dict_temp['available']:
                price_min = int(dict_temp['price'])
                result_dict['name']= dict_temp['name']
                result_dict['bed_type'] = '未知'  # 暂时不需要实现，还需进一步爬取
                result_dict['price']= dict_temp['price']
                result_dict['url'] = 'http://hotels.ctrip.com' + hotel.select_one('.hotel_name a').get('href')
    # 返回结果
    #print(result_list)
    return result_dict


# 获取对应酒店最低价格
# 流程：获取城市对应索引 --> 获取目标酒店ID --> 获取目标酒店价格
def GetCtripHotelLowestPrice(city, keyword, start_time, end_time):
    try:
        city_index = GetCityIndex(city)
        result = GetHotelPricr(city_index, keyword, start_time, end_time)
        print(result if result else '<携程网>中没有找到合适房型！')
    except urllib.error.HTTPError:
        print('<携程网>中没有找到合适房型！')



if __name__ == '__main__':
    GetCtripHotelLowestPrice('上海', '如家', '2018-7-22', '2018-7-23')
