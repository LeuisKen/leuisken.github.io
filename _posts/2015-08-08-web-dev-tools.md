---
title: WEB开发经验总结
labels: [Web]
description: 我将自己所学到的一些东西，在这里重新整理成一个提纲，希望能给大家一些学习的方向：
---

时至今日，web开发已经发生了巨大的变化，以至于让我很多时候都不知所措。

不过不管怎么说，从刚入门传统的web开发兼容IE7的时候，到现在进入百花齐放的大发展时代，真心为自己的学弟学妹感到欣慰。很多曾经的bug，你们可能永远都不会接触到了，不能不说是一种幸福。

我将自己所学到的一些东西，在这里重新整理成一个提纲，希望能给大家一些学习的方向：

<h3>工具篇：</h3>

<h4>一、运行环境</h4>

运行环境，就是指你的代码是在哪里运行的。对于js，主要有浏览器端和服务器端两种环境：
<h5>1.Node.js（io.js）</h5>

服务器端环境的代表。前端的同学如果不想学shell之类的脚本，用node写点命令行工具也是很爽的。

<h5>2.Chrome浏览器和其他浏览器</h5>

一般来说做前端，主流浏览器肯定是必备的：Chrome / Firefox / IE / Safari

对于如何最大限度地使用浏览器给我们开发带来的优势，我将在后面提到。

<h4>二、开发工具</h4>

<h5>1.编辑器之王：Vim / Emacs</h5>

程序员专属，和机械键盘简直绝配。个人感觉最大的优点就是：如果需求紧张，直接在服务器上就用vi改起来，很方便。

另外，完全可以用自己写的脚本来自定义，让你感受自由的最高境界。

<h5>2.亲民编辑器：Sublime Text / Atom</h5>

Sublime是我的最爱，用了就知道了。

Atom可谓新秀，能与Sublime一战，尤其是针对React的[http://nuclide.io/](http://nuclide.io/)，React专属，值得一试。

<h5>3.健全IDE：WebStorm / Hbuilder</h5>

说实话，我没用过（单纯是用惯了Sublime觉得有点卡），但是在接触的圈子里，也还是有不少用户的，尤其是WebStrom。Hbuilder是国产神器，也拥有一定用户量。（虽然我试着用了一会儿就卸了吧，但是还是知道下比较好）

/**
	别用Dw
 */

<h4>三、构建工具</h4>

构建工具我稍微解释一下。一般来说，前端代码上线肯定要压缩的，至少能给用户省不少流量对吧。诸如自动压缩一类的任务，就可以用构建工具自动完成。当然，应用不止这么简单，需求到了，自然就会用到。

<h5>1.Grunt</h5>

教程相对亲民，也易用。

参考学习：

[http://acgtofe.com/posts/2013/10/grunt-for-automation/](http://acgtofe.com/posts/2013/10/grunt-for-automation/)

以下为压缩css的任务的配置文件：

{% highlight javascript %}
//Gruntfile.js
module.exports = function (grunt) {//初始化配置
	grunt.initConfig({
		cssmin: { //定义配置对象
			minify: { //定义任务目标：压缩
				expand: true, //表下面的文件占位符*要扩展成具体文件名
				cwd: 'css/', //需要处理文件所在目录
				src: ['*.css', '!*.min.css'],//需处理的文件列表（*表任意数量字符，!表示不匹配的情况）
				dest: 'css/', //处理后生成的文件所在目录
				ext: '.min.css' //处理后生成的文件扩展名
			},
			combine: { //定义任务目标：合并
				files: { //目标文件名，源文件名列表
				'css/out.min.css': ['css/part1.min.css', 'css/part2.min.css']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-cssmin'); //加载npm安装的cssmin模块
	grunt.registerTask('default', ['cssmin:minify', 'cssmin:combine']); //注册任务
};
{% endhighlight %}

<h5>2.Gulp</h5>

会写Grunt，一般直接看现成的Gulp也能明白。

不过中文文档的翻译看着真心难受。

以下为压缩css的任务的配置文件

{% highlight javascript %}
//Gulpfile.js
var gulp = require("gulp"),
	mincss = require("gulp-minify-css"),
	del = require("del");
var stream = gulp.src("css/*.css"); //定义压缩的文件，返回stream
//压缩前先清除文件夹里面的内容
gulp.task("clean", function (callback) {
	del(["css/min"], callback);
});
gulp.task("mincss", function () {
	return stream
		.pipe(gulp.dest("css/min")) //输出文件夹
		.pipe(mincss()); //执行压缩
});
gulp.task("default", ["clean"], function () {
	gulp.start("mincss");//clear任务执行时，执行压缩。start方法可传入多个任务参数，表依次执行
});
{% endhighlight %}

<h4>四、测试工具</h4>

<h5>1.单元测试</h5>

说真的，有段时间测试很流行，也诞生了一系列js的测试方法，有兴趣的可以看看《编写可测试的JavaScript》和《测试驱动的JavaScript》。测试驱动开发（TDD）也是敏捷开发里面常提到的东西。

测试驱动开发，就是先写好测试，在写项目代码。简单说，可能大家都在Online Judge上面做过题，比如LeetCode。当你的代码出错的时候，OJ告诉你那组数据出错了，是不是能让你更有针对性的debug。测试驱动同理，先把测试数据和自动化测试的环境准备好，然后开始写代码。直观上应该都会觉得，不单debug更有针对性，严密的思考了测试数据之后，写的肯定都会更严谨吧。

话说回来，记得有个人在应聘脸书的时候，不光发过去了自己的代码，还有自己的测试数据，之后的应聘过程自然呼会得到很大的buff。

1.1前端单元测试Qunit

[http://www.zhangxinxu.com/wordpress/?p=3170](http://www.zhangxinxu.com/wordpress/?p=3170)（张大神博文镇楼，本人最爱博客之一）

1.2后端单元测试NodeUnit / Node自带的Assert模块 / Mocha

由于没有接触过相关的东西，缺乏感悟，辛苦大家自行捉摸咯。

<h5>2.性能测试</h5>

web页面怎么能少的了对性能的追求呢，在可控的范围内，用户看到页面所需的加载时间越短，自然是越容易受到青睐。

2.1 PageSpeed Insights（页面性能）

[https://developers.google.com/speed/pagespeed](https://developers.google.com/speed/pagespeed) 在线工具，让google给你建议吧。

页面性能方面还有其他工具，比如Chrome_Dev_Tools里面的Audits，火狐下的Yslow。

2.2 Apache Bench （服务器压力）

估计当了SA的话，肯定要接触的东西吧（我没干过SA并不知道）。

<h4>五、调试工具</h4>

<h5>1.浏览器系列</h5>

Chrome开发者工具，我的最爱，想深入学习请看官方文档，简单入门可看下面链接

[http://www.cnblogs.com/constantince/category/712675.html](http://www.cnblogs.com/constantince/category/712675.html)

[http://www.kazaff.me/tag/chrome/](http://www.kazaff.me/tag/chrome/)

[http://frontenddev.org/link/js-memory-leak-screening-method-chrome-profiles.html](http://frontenddev.org/link/js-memory-leak-screening-method-chrome-profiles.html)

尤其是最后一篇，内存泄漏可是不得不管的一个问题哦。

对于FireFox来说，大名鼎鼎的FireBug还是要提一下的。不过说起来，我很少用FireBug，一般来说Chrome表现好的话，FireFox也不会有太大问题。不过FireBug有一点非常人性化，就是其FireBugLite版本是跨浏览器的，支持到IE6。而且最简便的方式就是，直接引入一个js文件https://getfirebug.com/firebug-lite.js就能使用，支持IE6。如果没有办法用IE11的仿真的话，这还是一种非常方便的方法。

对于IE的话，我一直是使用IE11的开发者工具。其仿真功能，在应对老式IE兼容问题时简直是神器。IE11支持到Win7 sp1，安装起来也并不麻烦，Win7用户还是建议装上啦。

关于手机的调试，现在可以说已经很方便了：Chrome Inspect / Safari Inspect / UC浏览器开发者版本 / QQ浏览器都有着自己的解决方案。UC和QQ见下方链接：

UC：[http://www.cnblogs.com/constantince/p/4711098.html](http://www.cnblogs.com/constantince/p/4711098.html)
QQ：[http://bbs.mb.qq.com/thread-227056-1-1.html](http://bbs.mb.qq.com/thread-227056-1-1.html)

<h5>2.Http抓包工具——Fiddler</h5>

之前在处理手机页面debug的时候，看到过不少推荐使用Fiddler抓包来debug的方案，但是没有尝试过，不敢妄言。

推荐几款Fiddler插件，希望对大家有帮助：

Rosin：[https://github.com/AlloyTeam/Rosin](https://github.com/AlloyTeam/Rosin)
SSI Proxy：[http://tid.tenpay.com/labs/ssiproxy/index.html](http://tid.tenpay.com/labs/ssiproxy/index.html)
Willow：[http://tid.tenpay.com/?p=3011](http://tid.tenpay.com/?p=3011)

<h3>框架篇：</h3>

以后再说，先给大家看个好东西：
[http://todomvc.com/](http://todomvc.com/)

<h3>工作室前端代码规范：（制定中。。。）</h3>

主要参考腾讯AlloyTeam和BaiduFECodeStyle来制定，大家可以先观摩一下这两个规范：

[http://alloyteam.github.io/CodeGuide/](http://alloyteam.github.io/CodeGuide/)
[https://github.com/ecomfe/spec](https://github.com/ecomfe/spec)
