# clouddisk

> Cloud-网盘

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build:win

npm run build:linux

npm run build:mac

```

---
#### 2018-07-06 
    1、新增排序功能
    2、搜索框实现
    3、右下角实现查看网盘容量信息
    4、分享、传输列表修改为组件状态
    5、添加分页参数
    6、修复图标区分错误的问题
    7、添加滚动加载功能
    8、DiskFile组件的数据计算方法移动到父组件位置
    9、修改头部样式
    10、修复列表模式下文件大小丢失问题
#### 2018-07-08
    1、新增鼠标选择文件功能
    2、新增Ctrl多选功能
    3、登陆新增服务器修改窗口
    4、新增服务器验证方法
    5、引入element对话框组件
    6、增加监听函数，监听选择文件参数及用户网盘参数
    7、搜索参数合并为对象
    8、添加文件选择提示
    9、修复文件选择提示一些错误
    10、新增双击打开文件夹方法
    11、新增导航栏功能
#### 2018-07-09
    1、修复导航栏无法正确指引的问题
    2、OpenFile函数添加类别区分
    3、导航栏后退功能增加
    4、新增文件拖拽选择功能
    5、样式表精简
    6、修复滚动加载没到达底部开始加载的问题
    7、修复搜索点击失焦问题
#### 2018-07-10
    1、修复拖选文件时出现重复文件的问题
    2、修复按住Shift连选无法使用的问题
    3、新增右键菜单控制方法