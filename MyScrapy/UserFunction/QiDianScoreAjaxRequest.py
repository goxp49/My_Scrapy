# coding=utf-8

# 用于起点小说网页中的Ajax请求，获取小说的评分
#
#     请求命令存放在isPlainObject.js中
#
#     返回数据内容：
#
#     {"data":{"rate":9.1,"userCount":1132,"iRated":0,"totalCnt":1421,"pageMax":95,"iRateStar":0,"pageIndex":1,"
#       commentInfo":[{"userId":313007740,"rateId":914050,"star":5,"comment":"乱叔，《全职法师》是很不错的小说，……
#       }

import urllib.request
import json

headers = {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Host': 'book.qidian.com',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://book.qidian.com/info/3489766',
    #'Cookie':'36qljAAl7HLuw0f4WOEeiviQoBONT5z3Uk5npcba; newstatisticUUID=1530513039_640667421; qdrs=0%7C3%7C0%7C0%7C1; qdgd=1; rcr=3602691; lrbc=3602691%7C87926246%7C0; e1=%7B%22pid%22%3A%22qd_P_all%22%2C%22eid%22%3A%22qd_C44%22%2C%22l1%22%3A5%7D; e2=%7B%22pid%22%3A%22qd_P_all%22%2C%22eid%22%3A%22qd_A15%22%2C%22l1%22%3A3%7D; hiijack=0',
}

if __name__ == '__main__':
    url = 'https://book.qidian.com/ajax/comment/index?_csrfToken=36qljAAl7HLuw0f4WOEeiviQoBONT5z3Uk5npcba&bookId=1010938502&pageSize=15'
    request = urllib.request.Request(url=url)
    response = urllib.request.urlopen(request)
    dict_data = eval(str(response.read(), encoding='utf-8'))
    print(dict_data['data']['rate'])
