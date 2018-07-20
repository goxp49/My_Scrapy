# My_Scrapy
用于爬虫技术学习~

常见问题：
1.在urllib.request提示错误'utf-8' codec can't decode byte invalid start byte?.
    -->观察返回信息发现'Content-Encoding: gzip'，说明返回的是gzip压缩过的内容，所以需要先解码才能读取里面的内容，
    参考地址：https://segmentfault.com/q/1010000008631001

2.SCRAPY如何爬取多层页面后再将数据统一存储？
    -->可以将爬取到的数据存储在Request的meta中，再通过callback调用下一级解析函数。在下一级解析函数中将上一级的数据
    从meta中取出，最后才yield item。
    参考地址：https://blog.csdn.net/ygc123189/article/details/79160146

3.使用urllib.request提交Post时中文编码问题
    -->只需在传递时将Dict类型给request，它会自动对数据编码。
    参考地址：https://blog.csdn.net/m1mory/article/details/58309378

4.使用Selenium加载多个页面时，只能在通过‘_switch_to.window’切换到对应的窗口后查找它的‘browser’变量，否则会报错。

5.使用Selenium的‘text’返回一直为空？
    先使用‘element.is_displayed()’判断是否被隐藏文本是否已经被隐藏（返回false为隐藏），如果被
    隐藏，可以用以下方式：
    （1）通过‘element.attribute('innerHTML ')’，可以获取内部HTML代码，如‘<div>Hello <p>World!</p></div>’；
    （2）通过‘element.attribute('textContent ')，可以获取文本内容，如‘Hello World!’；
    参考地址：https://www.cnblogs.com/ppppying/p/7755064.html

6.使用字符串格式化时报错'not enough arguments for format string'
    在字符串中如果包含有'%'符号，要用'%%'来代替。

7.使用urllib.request提交URL中包含中文字符时报错？
    -->可以使用'new_url = quote(url, safe=string.printable)'来将含中文的字符串进行URL编码。