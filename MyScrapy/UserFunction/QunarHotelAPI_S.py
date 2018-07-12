'''
    通过selenium获取携程的酒店信息

    SearchCtripHotelUrl(keywork) ：通过关键字获取相关酒店的URL

    GetCtripHotelIformation(urls)：根据URL获取对应酒店的详细房间信息
'''



from selenium import webdriver
import urllib.request,urllib.parse
from io import BytesIO
import json,time,gzip,datetime,threading
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


bed_list = ['','大床','双床','','多床']
network_list = ['没有网络','提供WIFI','有线网络']
headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Connection': 'keep-alive',
    'Host': 'hotel.qunar.com',
}
def GetCtripHotelUrl(keyword):
    url = 'http://hotel.qunar.com/city/shanghai_city/q-随意'
    #获取配置参数，可进行修改
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--disable-gpu') #谷歌文档提到需要加上这个属性来规避bug
    chrome_options.add_argument('--headless') #浏览器不提供可视化页面. linux下如果系统不支持可视化不加这条会启动失败
    chrome_options.add_argument("--disable-plugins-discovery")
    chrome_options.add_argument('user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"')
    chrome_options.binary_location = r"C:\Users\goxp\AppData\Local\Google\Chrome\Application\chrome.exe" #手动指定使用的浏览器位置
    # chrome_options.binary_location = r"C:\Users\wang\AppData\Local\Google\Chrome\Application\chrome.exe" #手动指定使用的浏览器位置
    prefs = {"profile.managed_default_content_settings.images": 2}  # 不加载图片
    chrome_options.add_experimental_option('prefs', prefs)
    # 打开请求的url
    browser=webdriver.Chrome(chrome_options=chrome_options)
    #browser.implicitly_wait(3)  #隐性等待10s，加载完成后即刻解除等待
    browser.get(url)
    # 获取相关酒店URL
    room_list = browser.find_elements_by_class_name('e_title')
    urls = []
    for room in room_list:
        name = room.get_attribute('title')
        url = room.get_attribute('href')
        urls.append(url)
        print(name + ':' + url)
    GetQunarHotelIformation(browser,urls)


def GetQunarHotelIformation(browser,urls):
    hotel_all = []
    # 在不同窗口中打开不同url
    for x in range(len(urls)):
        browser.get(urls[x])
        browser.execute_script('window.open()')
        browser._switch_to.window(browser.window_handles[x + 1])
    #time.sleep(3)
    # 获取各个URL中的信息
    room_class = '没有合适租房'
    for x in range(len(urls)):
        # 先切换回对应窗口
        browser._switch_to.window(browser.window_handles[x])
        #每个网页有5s时间加载，如果加载失败则跳过
        # 获取酒店名
        try:
            totel_name = browser.find_element_by_xpath('//*[@id="detail_pageHeader"]/h2/span').text
            totel_type = '酒店'
        except:
            totel_name = browser.find_element_by_xpath('//*[@id="bnb_detail_pageHeader"]/div[1]/h2/span').text
            totel_type = '民宿'

        try:
            wait = WebDriverWait(browser, 3)
            wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'room-item-inner')))
            print(totel_name + '有以下房型：')
            # 获取大房型列表,第二个为团购，忽略
            room_types = browser.find_element_by_class_name('m-room-tools-bd').find_elements_by_class_name('room-item-inner')
            # 获取每个酒店的小房型信息
            for room_type in room_types:
                for room in room_type.find_elements_by_class_name('tbl-tbd'):
                    room_name = room.find_element_by_class_name('js-product').text
                    room_cancel = room.find_element_by_class_name('js-cancel').text
                    room_price = room.find_element_by_class_name('origin-price').find_element_by_class_name('sprice')\
                        .get_attribute('textContent').strip()
                    available = True if room.find_element_by_class_name('btn-book').text == '预 订' else False
                    print(room_name)
                    print(room_cancel)
                    print(room_price)
                    print(available)
        except:
            print(totel_name+':无可订房间!')
            continue

    browser.quit()  # 切记关闭浏览器，回收资源

if __name__ == '__main__':
    GetCtripHotelUrl('s')