/*
 * @Description: 上传请求
 * @Date: 2020-08-14 15:32:09
 * @LastEditTime: 2020-08-21 15:05:08
 * @FilePath: \test\email-send\server.js
 */
var fs = require('fs');
var express = require('express');
var multer = require('multer');
var handle = require('./lib/handle');

var app = express();
// var upload = multer({ dest: 'upload/' });

var createFolder = function (folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};

var uploadFolder = './upload/';

let readFileName = ''

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    console.log(file);
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    let saveFileNmae = file.fieldname + '-' + Date.now()
    cb(null, saveFileNmae);
    readFileName = saveFileNmae
  }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

// 上传
app.post('/upload', upload.single('file'), function (req, res, next) {
  var file = req.file;
  console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path);

  res.send({ ret_code: '0', ret_message: '处理成功' });

  // 读取文件
  handle.readFile(readFileName)
  // 发送邮件
  handle.creatContent()
});

app.get('/form', function (req, res, next) {
  var form = fs.readFileSync('./index.html', { encoding: 'utf8' });
  res.send(form);
});

app.listen(3000);