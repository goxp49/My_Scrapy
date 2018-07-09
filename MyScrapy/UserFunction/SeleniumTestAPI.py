from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
#获取配置参数，可进行修改
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--disable-gpu') #谷歌文档提到需要加上这个属性来规避bug
chrome_options.add_argument('--hide-scrollbars') #隐藏滚动条, 应对一些特殊页面
chrome_options.add_argument('blink-settings=imagesEnabled=false') #不加载图片, 提升速度
chrome_options.add_argument('--headless') #浏览器不提供可视化页面. linux下如果系统不支持可视化不加这条会启动失败
chrome_options.binary_location = r"C:\Users\wang\AppData\Local\Google\Chrome\Application\chrome.exe" #手动指定使用的浏览器位置
# 打开请求的url
driver=webdriver.Chrome(chrome_options=chrome_options)
driver.get('http://hotels.ctrip.com/hotel/436755.html')
#time.sleep(5)
# 获取网页渲染后的源代码
print(driver.page_source)
driver.close() #切记关闭浏览器，回收资源