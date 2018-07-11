from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import urllib.request,urllib.parse
from io import BytesIO
import json,time,gzip,datetime,threading

bed_list = ['','大床','双床','','多床']
network_list = ['没有网络','提供WIFI','有线网络']
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

def GetCtripHotelIformation(url):
    #获取配置参数，可进行修改
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--disable-gpu') #谷歌文档提到需要加上这个属性来规避bug
    chrome_options.add_argument('--hide-scrollbars') #隐藏滚动条, 应对一些特殊页面
    chrome_options.add_argument('blink-settings=imagesEnabled=false') #不加载图片, 提升速度
    chrome_options.add_argument('--headless') #浏览器不提供可视化页面. linux下如果系统不支持可视化不加这条会启动失败
    chrome_options.add_argument("--disable-plugins-discovery")
    chrome_options.add_argument('user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"')
    chrome_options.binary_location = r"C:\Users\goxp\AppData\Local\Google\Chrome\Application\chrome.exe" #手动指定使用的浏览器位置
    # 打开请求的url
    driver=webdriver.Chrome(chrome_options=chrome_options)
    driver.implicitly_wait(10)  #隐性等待10s，加载完成后即刻解除等待
    driver.delete_all_cookies() #清除所有Cookies
    #driver.get('http://hotels.ctrip.com/hotel/8020262.html')
    driver.get(url)

    # 获取房型列表
    room_data = driver.find_elements_by_class_name('child_name')[1:]
    # 获取房型是否还可以预定
    available_data = driver.find_elements_by_class_name('btns_base22_main')[1:]

    #print(driver.page_source)
    room_list = []
    for x in range(len(room_data)):
        dict_temp = {}
        price = room_data[x].get_attribute('data-price')
        bed_type = bed_list[int(room_data[x].get_attribute('data-bed'))]
        network_support = network_list[int(room_data[x].get_attribute('data-network'))] if room_data[x].get_attribute('data-network') \
            else network_list[0]
        policy = '不可取消' if room_data[x].get_attribute('data-policy') == '3' else '免费取消'
        available = True if '预订' in available_data[x].text else False
        if available:
            dict_temp['bed_type'] = bed_type
            dict_temp['policy'] = policy
            dict_temp['price'] = price
            dict_temp['network_support'] = network_support
            room_list.append(dict_temp)
        # print('xxxxx'+available_data[x].text)
        # print(price)
        # print(bed_type)
        # print(network_support)
        # print(policy)
        # print(available)
    print(room_list)
    driver.close() #切记关闭浏览器，回收资源

def SearchHotelUrl(keywork):
    url = 'http://m.ctrip.com/restapi/h5api/searchapp/search'

    data = {
        'action': 'autocomplete',
        'source': 'globalonline',
        'keyword': keywork,
        't': '1531269421978',
    }
    # request接收的data数据必须为字节流，因此需要进行转换
    #data_bytes = bytes(urllib.parse.urlencode(data), encoding='utf8') 这个用于POST请求
    data = urllib.parse.urlencode(data)#首先对data进行转码，转化成str类型
    new_url = url + "?" + data  #URL拼接
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
        #判断当前结果是否为酒店信息
        if result['type'] != 'hotel':
            continue
        #如果信息名称包含关键字（避免连锁酒店搜索错误），则返回对应的url地址
        if keywork in result['word']:
            url_list.append(result['url'])
    print('目标URL列表为：' + str(url_list))
    return url_list

if __name__ == '__main__':
    SearchHotelUrl('璞宿酒店')
