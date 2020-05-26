var http = require('./httpHelper.js')
function paysuccess(Appid,userId,orderId){
  http.httpGet("pay/paysuccess", data, function (res) {
    if (res.statusCode == '200') {
      var ispaysuccess = res.data;
      return ispaysuccess;
    }
  });
};
module.exports = {
  paysuccess: paysuccess
}