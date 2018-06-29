import requests


def ValidateIP(ip):
    url = 'http://ip.chinaz.com/getip.aspx'
    try:
        head = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
            'Connection': 'keep-alive'
        }
        proxy_host = {
            'http': ('http' + "://" + ip),
            'https': ('https' + "://" + ip),
        }
        html = requests.get(url, proxies=proxy_host, timeout=3,headers=head)
        if (html.status_code == 200):
            print(html.text)
            print(ip + "有效")
        else:
            print(ip + "无效")
    except:
        print("IP验证错误")


if __name__ == '__main__':
    ValidateIP("118.190.95.35:9001")
