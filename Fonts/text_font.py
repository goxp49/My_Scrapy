from fontTools.ttLib import TTFont     # 导包
import xml.etree.ElementTree as et

#这东西貌似没办法直接提取CMAP里的数据，只能保存为XML后
#再通过解析XML获取了
number_dict = {
    'period': '.',
    'zero': '0',
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
}

XML_Name = 'qidian.xml'
#-----------------------------------------------------------
#font = TTFont('./lREoJmMi.ttf')    # 打开文件
#font.saveXML('./XML_Name')     # 转换成 xml 文件并保存

root = et.parse('XML_Name').getroot()
# 找到map那一堆标签(PyQuery)
map_ele = root.find('cmap').find('cmap_format_12').findall('map')
map_dict = {}
# 把map那一堆数据存到字典中
for map in map_ele:
    # print(help(m))
    code = map.attrib['code'].replace('0x', '')
    map_dict[code] = number_dict[map.attrib['name']]  # code是键, name是值
print(map_dict)