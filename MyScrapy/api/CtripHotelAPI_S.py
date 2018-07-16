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


def GetCtripHotelIformation(urls):
    # 获取配置参数，可进行修改
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--disable-gpu')  # 谷歌文档提到需要加上这个属性来规避bug
    # chrome_options.add_argument('--headless') #浏览器不提供可视化页面. linux下如果系统不支持可视化不加这条会启动失败
    chrome_options.add_argument("--disable-plugins-discovery")
    chrome_options.add_argument(
        'user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"')
    # chrome_options.binary_location = r"C:\Users\goxp\AppData\Local\Google\Chrome\Application\chrome.exe" #手动指定使用的浏览器位置
    chrome_options.binary_location = r"C:\Users\wang\AppData\Local\Google\Chrome\Application\chrome.exe"  # 手动指定使用的浏览器位置
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

    # 获取各个窗口中的信息
    for x in range(len(urls)):
        # 先切换回对应窗口
        browser._switch_to.window(browser.window_handles[x])
        # 获取酒店名称
        name = browser.find_element_by_class_name('cn_n').text
        # 获取房型列表
        room_data = browser.find_elements_by_class_name('child_name')[1:]
        # 获取房型是否还可以预定
        available_data = browser.find_elements_by_class_name('btns_base22_main')[1:]

        # print(driver.page_source)
        room_list = []
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
                dict_temp['url'] = urls[x]
                room_list.append(dict_temp)
            # print('xxxxx'+available_data[x].text)
            # print(price)
            # print(bed_type)
            # print(network_support)
            # print(policy)
            # print(available)
        print(room_list if room_list != [] else '房间已售罄')
    browser.quit()  # 切记关闭浏览器，回收资源


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


if __name__ == '__main__':
    # SearchHotelUrl('璞宿酒店')
    # GetCtripHotelIformation(['http://hotels.ctrip.com/hotel/3680675.html', 'http://hotels.ctrip.com/hotel/8020262.html'])
    GetCtripHotelIformation(SearchCtripHotelUrl('璞宿酒店'))
