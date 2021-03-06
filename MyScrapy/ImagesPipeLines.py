import scrapy
from scrapy.pipelines.images import ImagesPipeline
from scrapy.exceptions import DropItem

class ImagesPipeline(ImagesPipeline):

    def get_media_requests(self, item, info):
        print("开始下载图片：" + item['image_urls'])
        yield scrapy.Request(item['image_urls'])

    def item_completed(self, results, item, info):
        image_paths = [x['path'] for ok, x in results if ok]
        if not image_paths:
            raise DropItem("Item contains no images")
        item['image_paths'] = image_paths
        return item