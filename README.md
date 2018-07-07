# My_Scrapy
用于爬虫技术学习~

常见问题：
1.在urllib.request提示错误'utf-8' codec can't decode byte invalid start byte?.
    -->观察返回信息发现'Content-Encoding: gzip'，说明返回的是gzip压缩过的内容，所以需要先解码才能读取里面的内容，
    参考地址：https://segmentfault.com/q/1010000008631001

2.如果爬取多层页面后再将数据统一存储？
    -->可以将爬取到的数据存储在Request的meta中，再通过callback调用下一级解析函数。在下一级解析函数中将上一级的数据
    从meta中取出，最后才yield item。
    参考地址：https://blog.csdn.net/ygc123189/article/details/79160146

3.使用urllib.request提交Post时中文编码问题
    -->只需在传递时将Dict类型给request，它会自动对数据编码。
    参考地址：https://blog.csdn.net/m1mory/article/details/58309378