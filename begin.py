from scrapy import cmdline
import os
#os.system("python ./MyScrapy/UserFunction/GetIpPorxy.py")
cmdline.execute("scrapy crawl QiDianScrapy".split())
