'''
    通过selenium获取携程的酒店信息

    SearchCtripHotelUrl(keywork) ：通过关键字获取相关酒店的URL

    GetCtripHotelIformation(urls)：根据URL获取对应酒店的详细房间信息
'''

from selenium import webdriver
import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, pinyin, string
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

# 通过selenium的方式获取酒店价格（速度慢）
def GetCtripHotelIformation(urls):
    # 获取配置参数，可进行修改
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--disable-gpu')  # 谷歌文档提到需要加上这个属性来规避bug
    # chrome_options.add_argument('--headless') #浏览器不提供可视化页面. linux下如果系统不支持可视化不加这条会启动失败
    chrome_options.add_argument("--disable-plugins-discovery")
    chrome_options.add_argument(
        'user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"')
    chrome_options.binary_location = r"C:\Users\goxp\AppData\Local\Google\Chrome\Application\chrome.exe"  # 手动指定使用的浏览器位置
    # chrome_options.binary_location = r"C:\Users\wang\AppData\Local\Google\Chrome\Application\chrome.exe"  # 手动指定使用的浏览器位置
    prefs = {"profile.managed_default_content_settings.images": 2}  # 不加载图片
    chrome_options.add_experimental_option('prefs', prefs)
    # 打开请求的url
    browser = webdriver.Chrome(chrome_options=chrome_options)
    browser.implicitly_wait(3)  # 隐性等待10s，加载完成后即刻解除等待
    # browser.delete_all_cookies() #清除所有Cookies
    # driver.get('http://hotels.ctrip.com/hotel/8020262.html')

    # 在不同窗口中打开不同url
    for x in range(len(urls)):
        browser.get(urls[x])
        browser.execute_script('window.open()')
        browser._switch_to.window(browser.window_handles[x + 1])
    # 建立变量保存返回结果
    result_list = []
    # 获取各个窗口中的信息
    for index_url in range(len(urls)):
        # 先切换回对应窗口
        browser._switch_to.window(browser.window_handles[index_url])
        # 获取酒店名称
        name = browser.find_element_by_class_name('cn_n').text
        # 获取房型列表
        room_data = browser.find_elements_by_class_name('child_name')[1:]
        # 获取房型是否还可以预定
        available_data = browser.find_elements_by_class_name('btns_base22_main')[1:]

        # print(driver.page_source)

        min_price = 99999  # 初始化最低价格
        for x in range(len(room_data)):
            dict_temp = {}
            price = room_data[x].get_attribute('data-price')
            bed_type = bed_list[int(room_data[x].get_attribute('data-bed'))]
            network_support = network_list[int(room_data[x].get_attribute('data-network'))] if room_data[
                x].get_attribute('data-network') \
                else network_list[0]
            policy = '不可取消' if room_data[x].get_attribute('data-policy') == '3' else '免费取消'
            available = True if '预订' in available_data[x].text else False
            # 判断是否还有空余并且价格最低的房间
            if available and int(price) <= min_price:
                dict_temp['name'] = name
                dict_temp['bed_type'] = bed_type
                dict_temp['price'] = price
                dict_temp['url'] = urls[index_url]
            # print('xxxxx'+available_data[x].text)
            # print(price)
            # print(bed_type)
            # print(network_support)
            # print(policy)
            # print(available)
        # 如果结果不为空则加入到返回结果中
        if dict_temp:
            result_list.append(dict_temp)
    print(result_list if result_list != [] else '房间已售罄')
    return result_list if result_list else None
    browser.quit()  # 切记关闭浏览器，回收资源


'''
def SearchCtripHotelUrl(keywork):
    url = 'http://m.ctrip.com/restapi/h5api/searchapp/search'

    data = {
        'action': 'autocomplete',
        'source': 'globalonline',
        'keyword': keywork,
        't': '1531269421978',
    }
    # request接收的data数据必须为字节流，因此需要进行转换
    # data_bytes = bytes(urllib.parse.urlencode(data), encoding='utf8') 这个用于POST请求
    data = urllib.parse.urlencode(data)  # 首先对data进行转码，转化成str类型
    new_url = url + "?" + data  # URL拼接
    print(new_url)
    request = urllib.request.Request(url=new_url, headers=headers, method='GET')
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)

    result_list = json.loads(f.read().decode('utf-8'))['data']
    print(result_list)
    url_list = []
    for result in result_list:
        # 判断当前结果是否为酒店信息
        if result['type'] != 'hotel':
            continue
        # 如果信息名称包含关键字（避免连锁酒店搜索错误），则返回对应的url地址
        if keywork in result['word']:
            url_list.append(result['url'])
    print('目标URL列表为：' + str(url_list))
    return url_list
'''


# 通过API获取指定对应城市的索引
def GetCityIndex(city):
    url = 'http://hotels.ctrip.com/Domestic/Tool/AjaxDestination.aspx'
    # 设置请求内容
    data = {
        'keyword': city,
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = url + "?" + data_bytes  # URL拼接
    print(new_url)
    request = urllib.request.Request(url=new_url, headers=index_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    # 获得原始结果'cQuery.jsonpResponse={"key":"北京","data":"@Beijing|北京|1|15660|北京||Cit………………'
    original_str = f.read().decode('utf-8')
    print(original_str.split('=')[1].split('@')[1].split('|'))
    process_str = original_str.split('=')[1].split('@')[1].split('|')
    # ['Beijing', '北京', '1', '15660', '北京', '', 'City', '北京', '1', '1', '1', '', '', '', '1']
    # 返回结果,检查结果是否包含城市名称,不包含则返回None
    return process_str[0] + process_str[2] if city in process_str[1] else None


# 通过城市索引获取酒店搜索结果
# 携程会依据Cookie来显示不同的价格（险恶），没有Cookie时会更便宜~

def GetHotelList(city_index, city_py, hotel_name, start_time, end_time):
    new_index = city_py + city_index
    url = 'http://hotels.ctrip.com/hotel/%s/k1%s#ctm_ref=ctr_hp_sb_lst' % (new_index, hotel_name)
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
    print(new_url)
    request = urllib.request.Request(url=new_url, data=data_bytes, headers=list_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    file = gzip.GzipFile(fileobj=buff).read().decode('utf-8')
    soup = BeautifulSoup(file, 'lxml')
    hotel_soups = soup.find_all('div', 'hotel_new_list')
    # print(hotel_soups)
    result_list = []
    for hotel in hotel_soups:
        dict_temp = {}
        if hotel.find('span','J_price_lowList'):
            dict_temp['name'] = hotel.select_one('.hotel_name a').get('title')
            dict_temp['bed_type'] = '未知' # 暂时不需要实现，还需进一步爬取
            dict_temp['price'] = hotel.select_one('.J_price_lowList').string
            dict_temp['url'] = 'http://hotels.ctrip.com' + hotel.select_one('.hotel_name a').get('href')
            result_list.append(dict_temp)
        # print(dict_temp['name'])
        # print(dict_temp['price'])
        # print(dict_temp['url'])
    print(result_list)



# 将中文转换为拼音
def ConvertToPinYin(string):
    """
        汉字[钓鱼岛是中国的]=>拼音[diaoyudaoshizhongguode]\n
        汉字[我是shui]=>拼音[woshishui]\n
        汉字[AreYou好]=>拼音[AreYouhao]\n
        汉字[None]=>拼音[]\n
        汉字[]=>拼音[]\n
        :param string:  str 类型的字符串
        :return: 汉字转小写拼音
    """
    if isinstance(string, str):
        if string == 'None':
            return ""
        else:
            return pinyin.get(string, format='strip', delimiter="")
    else:
        return '类型不对'


# 获取对应酒店最低价格
# 流程：获取城市对应索引 --> 获取目标酒店ID --> 获取目标酒店价格
def GetCtripHotelLowestPrice(city, keyword, start_time, end_time):
    pass


if __name__ == '__main__':
    # SearchHotelUrl('璞宿酒店')
    # GetCtripHotelIformation(['http://hotels.ctrip.com/hotel/3680675.html', 'http://hotels.ctrip.com/hotel/8020262.html'])
    # GetCtripHotelIformation(SearchCtripHotelUrl('璞宿酒店'))
    #print(GetCityIndex('尼玛'))
    GetHotelList('1', 'beijing', '如家', '2018-7-20', '2018-7-21')
