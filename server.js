/*
 * @Description: 
 * @Date: 2020-08-03 15:18:37
 * @LastEditTime: 2020-08-14 15:21:24
 * @FilePath: \test\server.js
 */
let xlsx = require('node-xlsx');
let nodemailer = require('nodemailer');

// 解析得到文档中的所有 sheet
let sheets = xlsx.parse('xxx.xls');
let content = [] // 内容数组
// 遍历 sheet
sheets.forEach(function (sheet) {
  console.log(sheet['name']);
  // 读取每行内容
  for (let rowId in sheet['data']) {
    console.log(rowId);
    let row = sheet['data'][rowId];
    // 循环行数据判断，如果为空则转换为'-'
    for (let i = 0; i < row.length; i++) {
      if (!row[i]) {
        row[i] = '-'
      }
    }
    console.log(row);
    // 添加进内容数组
    content.push(row)
  }
});

// 表头内容
let table_head = ''
// 如果为第一行则为表头
table_head += '<table border="1px solid black" cellspacing="0" style="text-align: right;"><thead style="text-align: center;">'
content[0].forEach(sub => {
  table_head += '<th>' + sub + '</th>'
})
table_head += '</thead>'
// 表格内容
content.forEach((item, index) => {
  let table_body = ''
  let emailItem = {}
  // 从不为第一行开始操作
  if (index > 0) {
    // 其他为表格内容
    table_body += '<tr>'
    emailItem = {}
    item.forEach((sub, ind) => {
      // console.log(sub);
      table_body += '<td>' + sub + '</td>'
      // 获取姓名，暂时根据表格内容定为第二列
      if (ind === 1) {
        emailItem.name = sub
      }
      // 取最后一列邮箱地址
      if (ind === item.length - 1) {
        emailItem.email = sub
      }
    })
    table_body += '</tr></table>'
    // 发送内容为表头加表格内容
    emailItem.sendHtml = table_head + table_body
    console.log(emailItem);
    // 发送邮件
    sendEmail(emailItem)
  }
})

// 发送邮件模块
function sendEmail (item) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.mxhichina.com',
    port: 465,
    secureConnection: true,
    // 需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
    auth: {
      user: 'xxx@xxx.cn', // 邮箱登录地址
      pass: '******' // 邮箱登录密码
    }
  });

  let mailOptions = {
    // 发送邮件的地址
    from: '"xxx" <xxx@xxx.cn>', // login user must equal to this user
    // 接收邮件的地址
    to: item.email, // xxx@xxx.com
    // 邮件主题
    subject: "你有一条新消息",
    // 以HTML的格式显示，这样可以显示图片、链接、字体颜色等信息
    html: item.sendHtml
  };

  transporter.sendMail(mailOptions, (error, info = {}) => {
    if (error) {
      return console.log(`${item.name}:${item.email}的邮件发送失败，请确认。`, error);
    }
    console.log(`${item.name}:${item.email}Message sent 邮件发送成功`);
  });
}