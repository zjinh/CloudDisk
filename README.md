# CloudDisk> Cloud-网盘#### 项目效果#### 登录页面   ![登录页面](screen/login.png)#### 网盘页面  ![登录页面](screen/disk.png)#### 网盘页面  ![登录页面](screen/disk1.png)#### 内置音乐播放器  ![内置音乐播放器](screen/music.png)#### 内置视频播放器  ![内置视频播放器](screen/video.png)#### pdf阅读器  ![pdf阅读器](screen/pdf.png)---#### Build & Setup# 安装node模块npm install# 运行项目npm run dev# 打包项目npm run build#### 2018-07-06     1、新增排序功能    2、搜索框实现    3、右下角实现查看网盘容量信息    4、分享、传输列表修改为组件状态    5、添加分页参数    6、修复图标区分错误的问题    7、添加滚动加载功能    8、DiskFile组件的数据计算方法移动到父组件位置    9、修改头部样式    10、修复列表模式下文件大小丢失问题#### 2018-07-08    1、新增鼠标选择文件功能    2、新增Ctrl多选功能    3、登陆新增服务器修改窗口    4、新增服务器验证方法    5、引入element对话框组件    6、增加监听函数，监听选择文件参数及用户网盘参数    7、搜索参数合并为对象    8、添加文件选择提示    9、修复文件选择提示一些错误    10、新增双击打开文件夹方法    11、新增导航栏功能#### 2018-07-09    1、修复导航栏无法正确指引的问题    2、OpenFile函数添加类别区分    3、导航栏后退功能增加    4、新增文件拖拽选择功能    5、样式表精简    6、修复滚动加载没到达底部开始加载的问题    7、修复搜索点击失焦问题#### 2018-07-10    1、修复拖选文件时出现重复文件的问题    2、修复按住Shift连选无法使用的问题    3、新增右键菜单控制方法    4、修改选择文件的记录方式，由原先多个push改为使用watch监听状态插入选择数组    5、修复右侧内容展示脱动选择和右键菜单冒泡问题#### 2018-07-11    1、新建文件夹功能完成    2、新增插入用户网盘数据统一接口函数    3、修复右键菜单鬼畜问题    4、右键刷新功能完成#### 2018-07-13    1、重命名功能完成    2、复制文件夹功能实现    3、剪切文件功能实现    4、粘贴功能实现    5、修改文件地址导航样式    6、剪切文件增加判断条件    7、修复右键打开文件在选择多个文件仍然可用的问题    8、修改复制剪切时多个文件的的提示方法    9、文件右键增加区别方法    10、右键菜单代码整理    11、清空回收站功能完成    12、登录窗口增加激活码重发功能    13、还原、彻底删除文件功能实现    14、新增文件属性窗口#### 2018-07-14    1、删除一些可以用其他方法代替的ipc指令    2、修复打包完成后字体大小的问题    3、修复打包完登录完成白屏问题    4、修改了登录页的结构和样式问题    5、一些主进程的操作改为子进程操作    6、限制网盘只能启动一个实例    7、修复打包后图标消失的问题#### 2018-07-15    1、修复相同目录下复制后出现点击双选的问题    2、修复网盘使用条90%下回到低位颜色不变的问题    3、修复出现confrim框后键盘失效的问题    4、添加复制剪切粘贴操作等快捷键 #### 2018-07-16    1、右键部分功能添加右键菜单    2、修复一些快捷键功能在不同环境下生效问题    3、修复分享的文件无法加载的问题    4、添加复制文件时空间检查方法#### 2018-07-17    1、移动到弹窗实现    2、树目录组件完成#### 2018-07-19    1、修复树目录加载无法准确加载到指定目录的错误    2、树目录展开增加加载动画    3、修复confrim提示文字不显示的问题    4、树目录传参vuex实现，出现异常报错，改为emit（报错不影响使用）    5、右键移动到功能实现    6、主进程添加打开文件属性窗口方法    7、文件属性窗口完成    8、api更新    9、解决树目录传参 使用树目录子组件递归传参    10、取消单选框    11、修复分享地址显示错误的问题    12、添加分享文件弹窗，新增组件    13、修复在一些弹框内使用右键出现右键菜单    14、右键分享功能实现，支持加密分享和公开分享#### 2018-07-20    1、修改属性窗口的一些样式    2、文件格式统一小写判断取消大小写判断    3、新增内嵌音乐播放器    4、播放器和任务栏按钮联动    5、播放器自动搜索当前目录文件生成播放列表    6、音乐播放器添加可视化效果    7、修复点击进度条进度更改，播放暂停的问题    8、修复可视化效果重复音乐的bug    9、去掉了一些不必要的判断    10、修复序号列表显示异常的问题    11、修复音量按钮点击关闭后关闭又展开的问题    12、添加取消分享功能    13、zip压缩实现解压功能    14、新增视频播放器模块    15、修复用户状态错误返回登录窗口失效的问题    16、去除一些可以用其他方法取代的ipc通信#### 2018-07-21    1、完成视频播放器    2、修复全屏状态下控制栏消失的问题    3、增加控制栏的移入移除动画    4、取消视频切换下一个上一个按钮，默认只播放一个    5、修复全屏状态下，视频黑边过大问题    6、音视频处理函数整理为模块使用    7、去掉Slimf前缀    8、拦截移动到弹框的报错（不影响使用）    10、打开文件函数整理，合并一些共有条件    11、修复音乐播放器播放网最后一首歌仍为播放状态的bug    12、引入pdf插件    13、加入pdf阅读器    14、删除一些没有用的样式表和文件    15、精简一些目录    16、增加拖拽拦截    17、添加PDf加载提示，优化PDF阅读器打开过程    18、修复视频播放器全屏检测问题#### 2018-07-22    1、彻底解决视频播放器全屏问题    2、音乐播放器添加资源失效自动下一曲功能    3、窗口控制按钮样式修改    4、样式表整理到APP.vue	5、添加歌词解开	6、音乐添加歌词效果#### 2018-07-23    1、添加系统下拉菜单    2、完成退出功能（后期仍需完善）    3、完成切换账号功能（后期仍需完善）    4、主进程严格模式根据生产环境变化    5、视频播放器音量样式修改    6、去除:function    7、个人信息窗口铺设完成    8、修复个人头像更新，网盘缓存无法更改的问题    9、添加一些个人信息获取和更新的方法    10、修复一些打包后运行的错误    11、修复切换账号出现多个托盘图标的问题    12、修复切换账号，文件预览窗口不关闭的问题    13、修改了pdf阅读器一些显示文本#### 2018-07-24    1、关于页面铺设完成    2、主进程细节修改#### 2018-07-25    1、修复属性窗口在网盘关闭时仍然存在的问题    2、属性窗口为单一窗口，多文件共用    3、实现关于我们检查更新功能    4、实现版本号获取    5、修复自动更新出现的错误    6、electron版本更新    7、实现更新检测及升级    8、修复打开个人信息后无法打开关于窗口的问题    9、增加图片预览窗口#### 2018-07-26    1、完成图片查看切换图片功能    2、完成图片旋转功能    3、初步完成图片缩放功能    4、完成图片拖拽功能    5、增加一些图片效果    6、图片缩放、拖拽算法修改    7、图片查看功能完成    8、优化图片查看器加载#### 2018-07-27    1、pdf阅读器代码精简    2、拆分slimf,css，分为icon.css,共用部分合并入disk.css    3、压缩iviewer.css    4、删除pdf阅读器一些图片#### 2018-07-28    1、添加文件查看窗口    2、删除一些重复定义的ipc参数    3、解决了一些窗口的鼠标拖拽问题    4、添加代码高亮效果    5、修复打包后文件查看失效的问题#### 2018-07-30    1、断点上传试水，深不可测    2、网盘分类切换增加了一些逻辑判断    3、修复网盘切换传输列表更新不及时的问题    4、优化上传后台代码    5、添加拖拽上传    6、支持断点续传    7、移除了一些没有用的判断#### 2018-08-01    1、上传添加限制，不允许拖拽文件夹上传    2、修改了上传前的提示判断    3、修复上传过程中选择其他文件上传会失败的问题    4、修复视频播放器的全屏问题    5、视频播放器添加按键控制    6、音乐播放器添加按键控制    7、图片查看器添加键盘切换    8、修复音乐播放器无法聚焦的问题    9、修复视频播放器无法聚焦的问题    10、修复图片查看器无法聚焦的问题    11、修复ncm文件识别错误问题    12、传输列表加入计数器    13、修改传输列表样式#### 2018-08-02    1、添加反馈窗口    2、完成反馈流程    3、后台反馈接口更新    4、修改全局弹框消失时间    5、添加设置窗口    6、api接口更新    7、修复搜索框无法输入的问题    8、调整全局键盘事件#### 2018-08-03    1、修复反馈窗口一些按钮错位问题    2、修复设置窗口输入框错位问题    3、node模块升级，代码更新    4、添加用户密码修改接口    5、支持设置页面修改密码门    6、支持设置页面修改传输设置    7、修复视频全屏后标题栏仍然存在的问题#### 2018-08-04    1、优化主进程登录成功后的加载速度    2、修复pdf查看器顶部白边    3、api更新邮件更改接口    4、添加安全邮箱修改功能    5、添加传输完成提示音    6、增加设置提示音效功能    7、添加传输完成提示气泡    8、设置增加气泡设置功能#### 2018-08-05    1、修复网盘排序不正确    2、修复音乐播放器频谱底部空白bug    3、优化记录上传的方式    4、修复树目录图标消失的bug#### 2018-08-06    1、右下角添加灯塔图片，图片根据时间季节变化    2、调整一些样式适应图片    3、修改了底部文件数量提示文字    4、添加头部图片，根据时间季节变化    5、添加背景动画过度    6、优化静态资源体积    7、修复打包后图片无法使用的问题#### 2018-08-09    1、版本更改    2、主进程开发模式去除    3、修复复制、剪切文件粘贴后，再次操作判断为同一目录的问题#### 2018-08-10    1、优化主进程URL判断    2、打包压缩css文件#### 2018-08-13    1、主进程优化，减少代码    2、修复反馈窗口无法正常打开的问题    3、修复文件查看窗口无法显示标题的问题    4、修复pdf查看器按钮丢失问题#### 2018-08-14    1、版本获取更加快捷    2、修改登录页面标题#### 2018-08-21    1、增加用户进行登录注册等操作时阻止切换    2、删除了一些主进程的函数#### 2018-09-13    1、css移入assest目录    2、将一些多次定义的函数放入api。js    3、删除了一些样式    4、修复了新建文件夹，生成空文件夹名称的bug    5、修复了重命名没有文件名重命名成功的bug    6、精简了组件引入，按需引入    7、将一些需要拼接的字符串在api获取数据时进行拼接，避免多次拼接    8、导航栏后退按钮改为箭头模式    9、导航栏加入主页、刷新功能    10、修改了拖选框的样式    11、移除了快捷键函数    12、优化快捷键的写法    13、修复快捷键导致搜索无法使用的问题    14、主页、刷新按钮添加状态判断    15、删除一些窗口的代码，统一使用组件解决#### 2018-09-19    1、修复个人信息顶部样式问题    2、修复在任务栏右键关闭软件会退出的问题    3、修改上传记录方式，采用本地化记录    4、修复导航栏的bug    5、修复上传接口的一些小问题    6、修改传输完成后不自动删除任务    7、删除一些不必要的代码#### 2018-09-20    1、修改解压接口，解压完成实时显示，不需要刷新    2、完善上传，添加取消任务按钮    3、修改托盘按钮右键退出不直接退出，弹窗询问    4、添加消息通知弹窗#### 2018-09-25    1、修改了ipc的监听逻辑，减少资源使用。    2、修复托盘右键菜单退出无响应的问题    3、提示弹框制作完成    4、传输完成添加弹窗提醒    5、添加自动登录功能    6、设置菜单添加系统分栏    7、树目录一些绑定写法更新    8、消息弹窗添加自动关闭及动画#### 2018-10-09    1、修复背景不会根据时间而改变的问题#### 2018-10-10    1、electron版本更新3.0.3#### 2018-10-11    1、去除旧版弃用函数    2、完成应用单实例模式#### 2018-10-25    1、api函数由局部调用改为全局调用    2、修复注销登录三次报错的问题    3、新增api报错拦截器#### 2018-11-01    1、package.json更新#### 2018-11-02    1、修复登录窗口验证码错误的问题    2、api更新验证码方法#### 2018-11-05    1、解决服务器修改无法接收更新的问题# 2019-updates#### 2019-02-26    1.更新package.json#### 2019-02-27    1.合并ipc事件,减少ipc事件监听    2.优化版本号获取方法，路由传参    3.窗口函数合并优化    4.创建窗口函数增加方法#### 2019-02-28    1、修改窗体函数    2、统一窗口传参接口为win-data    3、修复注销账户报错问题    4、ipc统一在main.js引入使用this.$ipc    5、path统一在main.js引入使用this.$path    6、导航栏拆分为单独组件，统一方法控制    7、底部拖拽栏拆分单独组件，数据独立统一管理    8、左侧导航拆分组件管理    9、回收站工具条拆分组件    10、Confrim在main.js注册使用#### 2019-03-01    1、修复排序问题    2、添加排序判断，避免无数据操作    3、修复用户下拉菜单无法使用    4、修复搜索报错问题    5、系统消息通知提示函数整合    6、修复消息弹框报错    7、优化搜索框效果#### 2019-03-02    1、网盘操作函数合并    2、totast消息函数统一管理    3、新增数据处理函数，集中处理post数据，选择数据    4、修改文件打开判断    5、api.js判断文件类型，方便前台判断打开类型#### 2019-03-04    1、修复api.js的报错    2、优化用户本地文件创建方式    3、去除一些localStorage    4、用户设置采用本地文件存储    5、修复切换用户自动登录的问题    6、添加用户信息更新ipc事件    7、删除一些没用的数据    8、修复设置信息覆写问题    9、修复切换账户和退出时的underfind报错    10、修复npm i的警告错误