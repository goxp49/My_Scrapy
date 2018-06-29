import requests

def ValidateIP(ip,protocol='http'):
    url = 'http://ip.chinaz.com/getip.aspx'
    # try:
    proxy_host = {protocol:(protocol + "://" + ip)}
    html = requests.get(url,proxies=proxy_host,timeout=2)
    if(html.status_code == 200):
        print( ip + "有效")
    else:
        print( ip + "无效")
    # except:
    #     print("IP验证错误")


if __name__ == '__main__':
    ValidateIP("115.223.202.72:9000")