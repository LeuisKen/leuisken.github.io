// +----------------------------------------------------------------------
// | Automated Scripts (自动生成文章的脚本)
// +----------------------------------------------------------------------
// | Author: LeuisKen <leuisken@gmail.com>
// +----------------------------------------------------------------------

var fs = require('fs');

var text = 
	'---\n' + 
	'layout: post\n' + 
	'category: ""\n' + 
	'tag: []\n' + 
	'title: \n' + 
	'---\n';

var date = new Date();
var dateDetail = date.getFullYear() + '-' +
				((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' +
				date.getDate() + '-';

var fileName = process.argv.splice(2)[0] || 'new';
fileName = dateDetail + fileName + '.html'

fs.writeFile(fileName, text, function (err){
	if(err){
		console.log(err);
	}else{
		console.log('Create new passage successfully! The file name is ' + fileName);
	}
})
