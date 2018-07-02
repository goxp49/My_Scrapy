from sqlalchemy import Column, String, create_engine,DateTime,Boolean,Integer,Float
from sqlalchemy.orm import sessionmaker,scoped_session
from sqlalchemy.ext.declarative import declarative_base

# Settings to connect to mysql database
database_setting = { 'database_type':'mysql',    # 数据库类型
                'connector':'mysqlconnector',    # 数据库连接器
                'user_name':'root',              # 用户名，根据实际情况修改
                'password':'2952342',            # 用户密码，根据实际情况修改
                'host_name':'localhost:3306',         # 在本机上运行
                'database_name':'qidianfiction',
                }

# 创建对象的基类:
Base = declarative_base()

# 1. `primary_key`：主键，True和False。
# 2. `autoincrement`：是否自动增长，True和False。
# 3. `unique`：是否唯一。
# 4. `nullable`：是否可空，默认是True。
# 5. `default`：默认值。
# 6. `onupdate`：在更新的时候，一般用在时间上面。


class Fiction(Base):
    __tablename__ = 'fiction'  # 表名

    id = Column(Integer,primary_key=True,autoincrement=True)
    title = Column(String(100), nullable=False,unique=True)
    author = Column(String(20),nullable=False)
    type = Column(String(20),nullable=False)
    status = Column(Boolean,default=False)
    words = Column(Float,default=0)
    fiction_urls = Column(String(100), nullable=False)
    image_urls = Column(String(100), nullable=True)
    image_paths = Column(String(100), nullable=True)

    def __repr__(self):
        return "<小说>：{},作者：{}，状态：{}/n 连接：{}".format(self.title, self.author, self.static, self.fiction_urls)



# 初始化数据库连接:
engine = create_engine(  # 生成连接字符串，有特定的格式
    database_setting['database_type'] +
    '+' +
    database_setting['connector'] +
    '://' +
    database_setting['user_name'] +
    ':' +
    database_setting['password'] +
    '@' +
    database_setting['host_name'] +
    '/' +
    database_setting['database_name']
)
Session = sessionmaker(bind=engine)
SessionType = scoped_session(sessionmaker(bind=engine))