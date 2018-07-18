'''
    通过selenium获取携程的酒店信息

    SearchCtripHotelUrl(keywork) ：通过关键字获取相关酒店的URL

    GetCtripHotelIformation(urls)：根据URL获取对应酒店的详细房间信息
'''

from selenium import webdriver
import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, datetime, threading

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
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Host': 'hotels.ctrip.com',
    'Origin': 'http://www.ctrip.com',
    'Referer': 'http://www.ctrip.com/',
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
def GetHotelList(city_index, city):
    new_url = 'http://hotels.ctrip.com/hotel/shanghai2/k1%E5%A6%82%E5%AE%B6#ctm_ref=hod_hp_sb_lst'
    # url = 'http://hotels.ctrip.com/hotel/%s/k1%s' % (city_index, city)
    # 转换含中文的url地址
    #new_url = urllib.parse.quote(url)
    # 设置请求内容
    data = {
        'CityName':'%C9%CF%BA%A3',
        'cityId': 2,
        'cityPY': 'Shanghai',
        'checkIn': '2018-7-18',
        'checkOut': '2018-07-19',
        'RoomGuestCount': '1,1,0',
        'keywordNew': '%C8%E7%BC%D2',
        'keyword': '%C8%E7%BC%D2',
        'Cookie': '_abtest_userid=61af2760-de3d-4762-8768-59278b49706c; _ga=GA1.2.2071221705.1530883501; MKT_Pagesource=PC; _RSG=KCalN5l8Na708LIPiN61K9; _RDG=2816579724a37b2931057df9cc00ae9c27; _RGUID=791722f1-57be-4314-9501-197b19495200; StartCity_Pkg=PkgStartCity=258; Corp_ResLang=zh-cn; _RF1=124.72.244.136; _gid=GA1.2.999617163.1531829417; ASP.NET_SessionId=n1rrx0cdudpitcckj0uuszd4; OID_ForOnlineHotel=153088349671813phf21531916749911102002; appFloatCnt=11; manualclose=1; Session=smartlinkcode=U130026&smartlinklanguage=zh&SmartLinkKeyWord=&SmartLinkQuary=&SmartLinkHost=; Union=AllianceID=4897&SID=130026&OUID=&Expires=1532521761664; HotelDomesticVisitedHotels1=1569729=0,0,4.5,9200,/200w080000002zosp5BBE.jpg,&436187=0,0,4.4,8705,/200n0s000000hhavcFF0F.jpg,&472757=0,0,4.4,1779,/fd/hotel/g3/M09/72/2B/CggYGVY8GlmAJ_RjABA9tOa05Eg752.jpg,&981622=0,0,4.5,808,/200u0q000000g4c2o517C.jpg,&978086=0,0,4.5,798,/hotel/439000/438574/2f85a12c2f044858971a3337d73aef50.jpg,&975443=0,0,4.5,3084,/200a0r000000hcwpm2AEA.jpg,; HotelCityID=2split%E4%B8%8A%E6%B5%B7splitShanghaisplit2018-7-18split2018-07-19split0; _gat=1; _bfa=1.1530883496718.13phf2.1.1531829411686.1531916698006.11.170.600001375; _bfs=1.36; Mkt_UnionRecord=%5B%7B%22aid%22%3A%224897%22%2C%22timestamp%22%3A1531920353093%7D%5D; __zpspc=9.12.1531916961.1531920353.28%232%7Cwww.baidu.com%7C%7C%7C%25E6%2590%25BA%25E7%25A8%258B%7C%23; _jzqco=%7C%7C%7C%7C%7C1.1003814229.1530883501572.1531920317303.1531920353131.1531920317303.1531920353131.0.0.0.142.142; _bfi=p1%3D100101991%26p2%3D102002%26v1%3D170%26v2%3D168',
    }

    data_bytes = bytes(urllib.parse.urlencode(data), encoding='utf8')
    #print(new_url)
    request = urllib.request.Request(url=new_url, data=data_bytes, headers=list_headers)
    response = urllib.request.urlopen(request)
    print(response.info())
    print(response.getcode())
    print(response.geturl())
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    # 获得原始结果'cQuery.jsonpResponse={"key":"北京","data":"@Beijing|北京|1|15660|北京||Cit………………'
    print(f.read().decode('utf-8'))



# 获取对应酒店最低价格
# 流程：获取城市对应索引 --> 获取目标酒店ID --> 获取目标酒店价格
def GetCtripHotelLowestPrice(city, keyword, start_time, end_time):
    pass


if __name__ == '__main__':
    # SearchHotelUrl('璞宿酒店')
    # GetCtripHotelIformation(['http://hotels.ctrip.com/hotel/3680675.html', 'http://hotels.ctrip.com/hotel/8020262.html'])
    # GetCtripHotelIformation(SearchCtripHotelUrl('璞宿酒店'))
    #print(GetCityIndex('尼玛'))
    GetHotelList('1','2')
