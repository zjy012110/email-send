/*
 * @Description: 登录模块
 * @Date: 2020-09-08 17:37:30
 * @LastEditTime: 2020-09-08 18:09:23
 * @FilePath: \test\lib\login.js
 */

const login = {
  getInfo (data) {
    let email = data.email
    let password = data.password
    console.log(data);
    console.log(email);
    console.log(password);
    return { email: email, password: password }
  }
}
module.exports = login