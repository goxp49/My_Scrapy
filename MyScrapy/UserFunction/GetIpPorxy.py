import urllib.request
import urllib
import re
import socket
import threading
import os

# 新建一个模拟浏览器的请求头
headers = {
    'Accept': 'image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
}

# 新建一个储存有效IP的文档
project_dir = os.path.dirname(os.path.dirname(os.getcwd()))  # 获取当前爬虫项目的绝对路径
PorxyFilePath = os.path.join(project_dir, 'proxy_ip.txt')  # 组装新的图片路径
file_proxy = open(PorxyFilePath, 'w')
# 建立一个锁，避免竞争
lock = threading.Lock()

def getipporxy(urls):
    ip_totle = []
    type_totle = []

    for url in urls:
        request = urllib.request.Request(url=url, headers=headers)
        response = urllib.request.urlopen(request)
        content = response.read()
        print("当前正在下载：" + url)
        pattern=re.compile('<td>(\d.*?)</td>')  #截取<td>与</td>之间第一个数为数字的内容
        type=re.compile('<td>(HTTP|HTTPS)</td>')  #截取<td>与</td>之间第一个数为数字的内容
        ip_page=re.findall(pattern,str(content))
        type_page=re.findall(type,str(content))
        #print(ip_page)
        #print(type_page)
        ip_totle.extend(ip_page)
        type_totle.extend(type_page)
        #print(type_totle)
    #整理代理IP格式
    proxys = []
    for i in range(0,len(ip_totle),4):
        #print(type_totle[int(i/4)].lower())
        proxy_host = ip_totle[i]+':'+ip_totle[i+1]
        proxy_temp = {type_totle[int(i/4)].lower():proxy_host}
        proxys.append(proxy_temp)
    # 多线程验证IP
    threads = []
    for proxy in proxys:
        thread = threading.Thread(target=testip, args=[proxy])
        threads.append(thread)
        thread.start()
    # 阻塞主进程，等待所有子线程结束
    for thread in threads:
        thread.join()

    file_proxy.close()  # 关闭文件



    # 验证代理IP有效性的方法

#验证代理IP有效性的方法
def testip(proxy):
    socket.setdefaulttimeout(5)  # 设置全局超时时间
    url = "http://ip.chinaz.com/getip.aspx"  # 打算爬取的网址
    try:
        proxy_support = urllib.request.ProxyHandler(proxy)
        opener = urllib.request.build_opener(proxy_support)
        opener.addheaders = [("User-Agent", "'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'")]
        urllib.request.install_opener(opener)
        res = urllib.request.urlopen(url).read()
        lock.acquire()  # 获得锁
        print(proxy, 'is OK')
        file_proxy.write('%s\n' % str(proxy))  # 写入该代理IP
        lock.release()  # 释放锁
    except Exception as e:
        lock.acquire()
        print(proxy, e)
        lock.release()

if __name__ == '__main__':
    getipporxy(["http://www.xicidaili.com/nn/"])