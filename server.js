var express = require("express");
var app = express();
var process = require('process');

// 数据库 mysql 相关配置
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "feng8090",
  database: "simple_http_server"
});
connection.connect();

var versionPatt = /(?<=[vV]).*?(?=\/)/gi;
var actionPatt = /(?<=[^v0-9][\/]).*?(?=\?)/gi;
var userNamePatt = /(?<=(self)\/).*?(?=\?)/gi;
var htmlTemplateHead =
  '<html><head><title>Student List</title></head><body><table style="width:100%"><tr><th>Firstname</th><th>Lastname</th><th>Age</th></tr>';
var htmlTemplateData = "";
var htmlTemplatefoot = "</table></body></html>";

var bodyParser = require("body-parser");

function responseHandle(res, data) {
  res.send(data);
}

function arithmeticHandle(action, a, b) {
  a = parseInt(a);
  b = parseInt(b);
  var result = 0;
  switch (action) {
    case "plus":
      result = a + b;
      break;
    case "substruction":
      result = a - b;
      break;
    case "multiplication":
      result = a * b;
      break;
    case "division":
      result = a / b;
      break;
    default:
      result = "error";
  }

  console.log(result);

  if (result == -Infinity || result == Infinity) {
    result = "除数不能为零";
  } else if(result == "error") {
    result = "计算出错，请检查参数。";
  } else {
    result = Math.round(result*100)/100;
  }

  return result;
}

app.use(bodyParser.urlencoded({ extended: false }));

// #1 API
app.get("/v3/test-api", function(req, res) {
  res.send({
    ret: 1000
  });
});

// #2 API
// #3 API
app.all("/v3/arithmetic/*", function(req, res) {
  var reqMethod = req.method;
  var reqData = { ret: 1000, version: 0, action: "null", result: 0 };

  var originalUrl = req.originalUrl;
  var result = "";

  var version = originalUrl.match(versionPatt);
  var action = originalUrl.match(actionPatt);

  // console.log(version + "  " + JSON.stringify(action));
  var queryLength = Object.keys(req.query).length;

  if(JSON.stringify(action) != "null" && queryLength >= 2){
    if (reqMethod == "GET") {
      result = arithmeticHandle(action[0], req.query["a"], req.query["b"]);
    } else if (reqMethod == "POST") {
      result = arithmeticHandle(action[0], req.query["a"], req.query["b"]);
    }
    console.log(req.query);

    action = action[0];

  }else{
    result = '计算出错，请检查参数。';
    action = "null";
  }

  reqData = {
    ret: 1000,
    version: version[0],
    action: action,
    result: result
  };
  
  responseHandle(res, reqData);
});

// #4 API
app.get("/tutorial/student/list", function(req, res) {
  var that = this;
  connection.query("SELECT * FROM students", function(error, results, fields) {
    if (error) throw error;

    that.htmlTemplateData = "";
    var resHtml = "";
    for (var i = 0, length = results.length; i < length; i++) {
      console.log("user: " + JSON.stringify(results[i]));
      that.htmlTemplateData += "<tr>";
      that.htmlTemplateData += "<th>" + results[i].firstname + "</th>";
      that.htmlTemplateData += "<th>" + results[i].lastname + "</th>";
      that.htmlTemplateData += "<th>" + results[i].age + "</th>";
      that.htmlTemplateData += "</tr>";
    }

    resHtml = htmlTemplateHead + that.htmlTemplateData + htmlTemplatefoot;
    responseHandle(res, resHtml);
  });
});

// #5 API
app.all("/user/self/*", function(req, res){
  if(req.method == "POST"){
    var originalUrl = req.originalUrl;
    var userName = originalUrl.match(userNamePatt);
    var intAuthToken = req.query.intAuthToken;

    console.log("userName: "+userName[0]);

    if(intAuthToken == null){
      responseHandle(res, {
        ret: 1001
      });
    }
  
    var sql = "SELECT u.*, at.* FROM user u, int_auth_token_cache at where (u.id = at.id) and u.name = '"+ userName[0] +"' and at.int_auth_token = '" + intAuthToken + "'";
    connection.query(sql, function(error, results, fields) {
      if (error) throw error;
  
      // console.log(JSON.stringify(results));
  
      responseHandle(res, results);
    });
  }
  
});

var port = process.argv[2] | 8080;

var server = app.listen(port, function() {
  console.log("Service start. -> http://localhost:%s", port);
});
