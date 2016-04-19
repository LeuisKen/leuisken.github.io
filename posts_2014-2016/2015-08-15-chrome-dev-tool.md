---
title: JavaScript开发工具——浏览器控制台
labels: [前端, JavaScript]
description: 对于运行在前端的js，浏览器不单充当着运行环境，还是调试工具，测试工具。本文会记录一些讲述浏览器开发者工具使用的博文，供大家参阅研究：
---

对于运行在前端的js，浏览器不单充当着运行环境，还是调试工具，测试工具。本文会记录一些讲述浏览器开发者工具使用的博文，供大家参阅研究：

首先是我最爱的Chrome：

[Chrome开发者工具系列](http://www.cnblogs.com/constantince/category/712675.html)

这个系列是一个总览，让你对Chrome的每一个部分都有所了解。

[从应用的角度分析Chrome](http://www.kazaff.me/tag/chrome/)

这个系列着重对调试和内存分析等内容进行研究。

[JS内存泄漏排查方法](http://frontenddev.org/link/js-memory-leak-screening-method-chrome-profiles.html)

通过示例分析排查内存泄漏，很建议一读。

除此之外，Chrome官方的文档也是很赞的，其通过对Chrome开发者工具进行详细说明以及使用大量的demo，可以说是Chrome学习最全面的资料。

对于FireFox来说，大名鼎鼎的FireBug还是要提一下的。不过说起来，我很少用FireBug，一般来说Chrome表现好的话，FireFox也不会有太大问题。不过FireBug有一点非常人性化，就是其FireBugLite版本是跨浏览器的，支持到IE6。而且最简便的方式就是，直接引入一个js文件[https://getfirebug.com/firebug-lite.js](https://getfirebug.com/firebug-lite.js)就能使用，支持IE6。如果没有办法用IE11的仿真的话，这还是一种非常方便的方法。

对于IE的话，我一直是使用IE11的开发者工具。其仿真功能，在应对老式IE兼容问题时简直是神器。IE11支持到Win7 sp1，安装起来也并不麻烦，Win7用户还是建议装上啦。

另外还有一个要提一下，就是uc浏览器的开发者版本，成功解决了安卓平台手机移动端调试老大难的问题。大家可以参考官方文档试一下；如果是ios平台，safari的inspect则是首选。而如果调试微信内页面的话，目前还没有太好的办法。

文章结尾，附上两份文档，方便查阅：

[qq x5 文档](http://open.mb.qq.com/doc?id=1201)

[uc文档](http://www.uc.cn/business/developer/)
