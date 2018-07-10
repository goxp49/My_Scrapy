from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

bed_list = ['','大床','双床','','多床']
network_list = ['没有免费网络','提供免费网络']

#获取配置参数，可进行修改
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--disable-gpu') #谷歌文档提到需要加上这个属性来规避bug
chrome_options.add_argument('--hide-scrollbars') #隐藏滚动条, 应对一些特殊页面
chrome_options.add_argument('blink-settings=imagesEnabled=false') #不加载图片, 提升速度
# chrome_options.add_argument('--headless') #浏览器不提供可视化页面. linux下如果系统不支持可视化不加这条会启动失败
chrome_options.binary_location = r"C:\Users\goxp\AppData\Local\Google\Chrome\Application\chrome.exe" #手动指定使用的浏览器位置
# 打开请求的url
driver=webdriver.Chrome(chrome_options=chrome_options)
driver.implicitly_wait(10)
driver.get('http://hotels.ctrip.com/hotel/1782542.html')

# 获取房型列表
room_list = driver.find_elements_by_class_name('child_name')[1:]
# 获取房型是否还可以预定
available_list = driver.find_elements_by_class_name('btns_base22_main')[1:]
#大床还是双床,舍弃前两个和最后一个无关结果
bad_type = driver.find_elements_by_class_name('col3')[2:-1]

print(driver.page_source)
for x in range(len(room_list)):
    price = room_list[x].get_attribute('data-price')
    bed_type = bed_list[int(room_list[x].get_attribute('data-bed'))]
    network_support = network_list[int(room_list[x].get_attribute('data-network'))]
    policy = '不可取消' if room_list[x].get_attribute('data-policy') == '3' else '免费取消'
    available = '有房' if available_list[x].text=='预定' else '无房'
    print('xxxxx'+available_list[x].text)
    print(price)
    print(bed_type)
    print(network_support)
    print(policy)
    print(available)
driver.close() #切记关闭浏览器，回收资源