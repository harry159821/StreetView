var fs = require('fs');
var http = require('http');
var crypto = require('crypto');

var a = [{
  "title": "校大门",
  "fileName": "xindamen.jpg"
}, {
  "title": "图书馆",
  "fileName": "tushuguan.jpg"
}, {
  "title": "科技馆",
  "fileName": "kejiguan.jpg"
}, {
  "title": "体育馆",
  "fileName": "tiyuguan.jpg"
}, {
  "title": "艺术学院",
  "fileName": "yishuxueyuan.jpg"
}, {
  "title": "基础医学",
  "fileName": "yiji.jpg"
}, {
  "title": "药学院",
  "fileName": "yaoxueyuan.jpg"
}, {
  "title": "临床医学",
  "fileName": "yixueyaoxue.jpg"
}, {
  "title": "材料机械",
  "fileName": "cailiaojixie.jpg"
}, {
  "title": "食品学院",
  "fileName": "shipin.jpg"
}, {
  "title": "环境学院",
  "fileName": "huanjingxueyuan.jpg"
}, {
  "title": "京江学院",
  "fileName": "jingjiangxueyuan.jpg"
}, {
  "title": "三江楼",
  "fileName": "sanjianglou.jpg"
}, {
  "title": "三山楼",
  "fileName": "sanshanlou.jpg"
}, {
  "title": "主楼",
  "fileName": "zhulou.jpg"
}, {
  "title": "行政一号楼",
  "fileName": "xingzhenglou.jpg"
}, {
  "title": "专家楼",
  "fileName": "zhuanjialou.jpg"
}, {
  "title": "教工之家",
  "fileName": "jiaogongzhijia.jpg"
}, {
  "title": "四食堂",
  "fileName": "shitang4.jpg"
}, {
  "title": "六食堂",
  "fileName": "shitang6.jpg"
}, {
  "title": "学生区",
  "fileName": "xueshengqu.jpg"
}, {
  "title": "东山操场",
  "fileName": "dongshancaochang.jpg"
}, {
  "title": "西山操场",
  "fileName": "xishancaochang.jpg"
}, {
  "title": "京江操场",
  "fileName": "jingjiangxueyuancaochang.jpg"
}, {
  "title": "校园风景一",
  "fileName": "qiao.jpg"
}, {
  "title": "校园风景二",
  "fileName": "yuanzhuguangchang.jpg"
}, {
  "title": "校园风景三",
  "fileName": "fengjing01.jpg"
}, {
  "title": "校园风景四",
  "fileName": "tushuguanhu.jpg"
}, {
  "title": "校园风景五",
  "fileName": "jisuanjihu.jpg"
}, {
  "title": "校园风景六",
  "fileName": "yijihu.jpg"
}, {
  "title": "校园风景七",
  "fileName": "kejiguanhu.jpg"
}, {
  'title': '京江学院西侧',
  'fileName': 'jingjiangxueyuanxice.jpg'
}, {
  title: '计算机学院和电气学院',
  fileName: 'jisuanjidianqi.jpg'
}, {
  title: '三江楼门厅',
  fileName: 'sanjianglou_menting.jpg',
}, {
  title: '研究生院和化工学院',
  fileName: 'yanjiuhuagong.jpg'
}];


var b = a.map(function(e) {
  var name = e.fileName.replace('.jpg', '.swf.jpg');
  var hash = crypto.createHash('sha1');
  hash.update(e.title);
  var newName = hash.digest('hex') + '.jpg';

  if (fs.existsSync(name)) {
    fs.renameSync(name, newName);
    console.log('rename', name, 'to', newName);
  }

  var thumbs = 'http://www.ujs.edu.cn/swqj/littletp/%s'.replace('%s', e.fileName.replace('.jpg', 'l.jpg'));
  var thumbName = newName.replace('.jpg', '.thumb.jpg');
  var file = fs.createWriteStream(thumbName);
  var request = http.get(thumbs, function(response) {
    response.pipe(file);
  });

  return {
    "title": e.title,
    "location": [],
    "type": "sphere",
    "src": "data/" + newName,
    "thumbs": "data/" + thumbName
  };
});

console.log(JSON.stringify(b));
