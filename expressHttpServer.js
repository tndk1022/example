const express = require('express');
const app = express();
var request = require('request');
var jwt = require('jsonwebtoken');
var auth = require('./lib/auth')

var tokenKey = "fintech202020!#abcd"

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

var mysql = require('mysql');
var connecction = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'fintech'
});

connecction.connect();

app.get('/', function(req, res) {
    res.render('test');
});

app.get('/home', function(req, res) {
    res.send('Hello World - ksj');
});

app.get('/member', function(req, res) {
    res.send('member page - ksj');
});

app.post("/join", function(req, res) {
    console.log(req.body);
});

app.get("/designTest", function(req, res) {
    res.render('designTest');
});

app.get("/login", function(req, res) {
    res.render('login');
});

app.post("/login", function(req, res) {
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var query = "SELECT * FROM user WHERE email = ?;";

    connecction.query(query,[userEmail], function(error, results) {
        if(error) throw error;
        else {
            if(results.length == 0) {
                res.json("등록된 계정이 없습니다.");
            } else {
                if(userPassword == results[0].password){
                    jwt.sign(
                      {
                          userName : results[0].name,
                          userId : results[0].id,
                          userEmail : results[0].email
                      },
                      tokenKey,
                      {
                          expiresIn : '10d',
                          issuer : 'fintech.admin',
                          subject : 'user.login.info'
                      },
                      function(err, token){
                          console.log('로그인 성공', token)
                          res.json(token)
                      }
                    )
                } else {
                    res.json("비밀번호가 틀렸습니다.");
                }
            }
        }
    });
});

app.get("/signup", function(req, res) {
    res.render('signup');
});
app.get("/authResult", function(req, res) {
    var authCode = req.query.code;
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
        },
        form : {
            code : authCode,
            client_id : "Vn0D9mniM8Er8WMR3Zz4QNJ3euO45IU10ufDYp6S",
            client_secret : "uUHKTZNqXLs226KQR9Wf17ZC13LYhRzI869CwDp4",
            redirect_uri : "http://localhost:3000/authResult",
            grant_type : "authorization_code"
        }
    }

    request(option, function(error, response, body) {
        //res.send(body);
        var parseData = JSON.parse(body);
        console.log(parseData);
        res.render("resultChild", {data : parseData});
    });
});

app.post("/signup", function(req, res) {
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var accessToken = req.body.accessToken;
    var refreshToken = req.body.refreshToken;
    var userSeqNo = req.body.userSeqNo;
    var query = "INSERT INTO user (email,password,name,accesstoken,refreshtoken,userseqno) VALUES (?,?,?,?,?,?);";

    connecction.query(query,[userEmail,userPassword,userName,accessToken,refreshToken,userSeqNo], function(error, results, fields) {
        if(error) throw error;
        else {
            res.json(1);
        }
    });
});

app.get('/authTest',auth, function(req, res){
    res.json("메인 컨텐츠")
  })

app.listen(3000);