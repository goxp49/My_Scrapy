'''
    通过selenium获取去哪儿网的酒店信息，并找出最低价

    GetQunarHotelLowestPrice(city,keyword) ：通过关键字获取相关酒店的最低房价

    GetQunarHotelIformation(urls)：根据URL获取对应酒店的详细房间信息
'''

from selenium import webdriver
import urllib.request, urllib.parse
from io import BytesIO
import json, time, gzip, datetime, threading
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import operator  # 导入运算符模块
from pandas.tseries.offsets import Day

bed_list = ['', '大床', '双床', '', '多床']
network_list = ['没有网络', '提供WIFI', '有线网络']
headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'hotel.qunar.com',
}

api_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'hs.qunar.com',
}

def GetQunarHotelLowestPrice(city, keyword, start_time, end_time):
    # 获得对应城市的index，用于组成请求的url
    city_index = GetCityIndex(city)
    if not city_index:
        print('<住哪网>中没有找到合适房型！')
        return None
    # print(city_index)
    url = 'http://hotel.qunar.com/city/%s/q-%s#fromDate=%s&toDate=%s' % (city_index, keyword, start_time, end_time)
    # 获取配置参数，可进行修改
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--disable-gpu')  # 谷歌文档提到需要加上这个属性来规避bug
    chrome_options.add_argument('--headless')  # 浏览器不提供可视化页面. linux下如果系统不支持可视化不加这条会启动失败
    chrome_options.add_argument("--disable-plugins-discovery")
    chrome_options.add_argument(
        'user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"')
    chrome_options.binary_location = r"C:\Users\goxp\AppData\Local\Google\Chrome\Application\chrome.exe" #手动指定使用的浏览器位置
    # chrome_options.binary_location = r"C:\Users\wang\AppData\Local\Google\Chrome\Application\chrome.exe"  # 手动指定使用的浏览器位置
    prefs = {"profile.managed_default_content_settings.images": 2}  # 不加载图片
    chrome_options.add_experimental_option('prefs', prefs)
    # 打开请求的url
    browser = webdriver.Chrome(chrome_options=chrome_options)
    browser.implicitly_wait(2)  #隐性等待10s，加载完成后即刻解除等待
    browser.get(url)
    # 获取相关酒店URL
    room = browser.find_element_by_class_name('e_title')
    name = room.get_attribute('title')
    url = room.get_attribute('href')
    # 只保留含有关键字的目标
    if keyword in name:
        print(GetQunarHotelIformation(browser, url))
    else:
        print('<去哪网>中没有找到合适房型！')


def GetQunarHotelIformation(browser, url):
    # 建立临时变量存储最低价格的房间信息
    temp_dict = {}
    min_price = 99999  # 初始化最低价格
    # 打开网页
    browser.get(url)
    time.sleep(3)
    # 获取酒店名
    totel_name = browser.find_element_by_xpath(
        '//*[@id="detail_pageHeader"]/h2/span').text if isElementExsitByXpath(browser,
                                                                              '//*[@id="detail_pageHeader"]/h2/span') else \
        browser.find_element_by_xpath('//*[@id="bnb_detail_pageHeader"]/div[1]/h2/span').text
    # print(totel_name + '价格最低的房型为：')
    # 获取大房型列表,第二个为团购，忽略
    room_types = browser.find_element_by_class_name('m-room-tools-bd').find_elements_by_class_name(
        'room-item-inner')
    # 获取每个酒店的小房型信息
    for room_type in room_types:
        for room in room_type.find_elements_by_class_name('tbl-tbd'):
            # 获取酒店名
            hotel_name = browser.find_element_by_id('detail_pageHeader').find_element_by_css_selector('span').text
            # 遇到团购房型时房间名位置有变化，class=js-tuan-title/js-product，所以需要进行判断
            room_name = room.find_element_by_class_name('js-product').text if isElementExsitByClass(room,
                                                                                                    'js-product') else \
                room.find_element_by_class_name('js-tuan-title').text
            # 个别房型没有取消项时class = non_cancel
            room_cancel = room.find_element_by_class_name('js-cancel').text if isElementExsitByClass(room,
                                                                                                     'js-cancel') else \
                room.find_element_by_class_name('non_cancel').text
            room_price = int(room.find_element_by_class_name('origin-price').find_element_by_class_name('sprice') \
                             .get_attribute('textContent').strip()[1:])
            available = True if room.find_element_by_class_name(
                'btn-book').text != '已订完' else False
            # print(room_name)
            # print(room_cancel)
            # print(room_price)
            # print(available)
            # 判断是否为最低价格,如果是，则更新价格
            if available and operator.le(room_price, min_price):
                # print('发现更低价格：' + str(room_price))
                min_price = room_price
                temp_dict['name'] = hotel_name
                temp_dict['bed_type'] = room_name
                temp_dict['price'] = room_price
                temp_dict['url'] = url
    browser.quit()  # 切记关闭浏览器，回收资源
    return temp_dict if temp_dict else '<去哪网>中没有找到合适房型！'


def GetCityIndex(city):
    # 设定去哪儿城市index API地址
    api_url = 'http://hs.qunar.com/api/hs/citysugV3'
    #设置请求内容
    data = {
        'city': city,
    }
    data_bytes = urllib.parse.urlencode(data)
    new_url = api_url + "?" + data_bytes  #URL拼接
    # print(new_url)
    request = urllib.request.Request(url=new_url, headers=api_headers)
    response = urllib.request.urlopen(request)
    content = response.read()  # content是压缩过的数据
    buff = BytesIO(content)  # 把content转为文件对象
    f = gzip.GzipFile(fileobj=buff)
    #print(json.loads(f.read().decode('utf-8'))['data'])
    try:
        result_json = json.loads(f.read().decode('utf-8'))['data']
        if result_json:
            for result in result_json:
                #由于JSON已经在服务器排序过，所以第一个结果是最优搜索
                if city in result['c']:
                    return result['o']
        return False
    except:
        return False

def isElementExsitByClass(browser, class_name):
    try:
        browser.find_element_by_class_name(class_name)
        # print('找到对应的类:' + class_name)
        return True
    except:
        print('没找到对应的类:' + class_name)
        return False


def isElementExsitByXpath(browser, xpath):
    try:
        browser.find_element_by_xpath(xpath)
        return True
    except:
        print('没找到对应的xpath:' + xpath)
        return False


if __name__ == '__main__':
    start_time = datetime.datetime.now().strftime('%Y-%m-%d')
    end_time = (datetime.datetime.now() + Day()).strftime('%Y-%m-%d')
    #GetCtripHotelUrl('锦江都城酒店')  # 富豪/随意/丽思卡尔顿
    GetQunarHotelLowestPrice('上海', '万豪', '2018-07-23', '2018-07-26')
