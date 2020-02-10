const express = require('express');
const app = express();
var request = require('request');
var jwt = require('jsonwebtoken');
var auth = require('./lib/auth')
var host = "https://testapi.openbanking.or.kr";

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

/**
 * 렌더링 해보기
 */
app.get('/', function(req, res) {
    res.render('test');
});

/**
 * 페이지 띄워보기
 */
app.get('/home', function(req, res) {
    res.send('Hello World - ksj');
});

app.get('/member', function(req, res) {
    res.send('member page - ksj');
});

/**
 * 회원가입
 */
app.post("/join", function(req, res) {
    console.log(req.body);
});

/**
 * 템플릿 가져와보기
 */
app.get("/designTest", function(req, res) {
    res.render('designTest');
});

/**
 * 로그인
 */
app.get("/login", function(req, res) {
    res.render('login');
});

/**
 * 로그인 세션 저장 및 계정 검증
 */
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
                          console.log('로그인 성공', token);
                          res.json(token);
                      }
                    )
                } else {
                    res.json("비밀번호가 틀렸습니다.");
                }
            }
        }
    });
});

/**
 * 계좌 리스트 화면
 */
app.get("/main", function(req, res) {
    res.render('main');
});

/**
 * 회원가입
 */
app.get("/signup", function(req, res) {
    res.render('signup');
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

/**
 * 세션 검증 및 토큰 받아오기
 */
app.get("/authResult", function(req, res) {
    var authCode = req.query.code;
    var option = {
        method : "POST",
        url : host + "/oauth/2.0/token",
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
        var parseData = JSON.parse(body);
        console.log(parseData);
        res.render("resultChild", {data : parseData});
    });
});

/**
 * 세션 테스트
 */
app.get('/authTest',auth, function(req, res){
    console.log(req.decoded);
    res.json("메인 컨텐츠")
});

/**
 * 계좌조회
 */
app.post("/list",auth,function(req, res) {
    var user = req.decoded;
    var query = "SELECT * FROM user WHERE id = ?";
    var option = "";
    
    connecction.query(query,[user.userId], function(error, results, fields) {
        if(error) throw error;
        else {
            var authToken = "Bearer " + results[0].accesstoken;
            var userSeqNo =  results[0].userseqno;

            option = {
                method : "GET",
                url : host + "/v2.0/user/me",
                headers : {
                    "Authorization" : authToken
                },
                qs : {user_seq_no : userSeqNo}
            }
        
            request(option, function(error, response, body) {
                var parseData = JSON.parse(body);
                res.json(parseData);
            });
        }
    });
});

/**
 * 잔액조회
 */
app.get("/balance", function(req, res) {
    res.render('balance');
});
app.post("/balance", auth, function(req, res) {
    var finUseNo = "";
    var authToken = "";
    var userSeqNo =  "";
    var countNum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991602030U" + countNum;
    var user = req.decoded;
    var query = "SELECT * FROM user WHERE id = ?";

    connecction.query(query,[user.userId], function(error, results, fields) {
        if(error) throw error;
        else {

            authToken = "Bearer " + results[0].accesstoken;
            userSeqNo =  results[0].userseqno;
            finUseNo = req.body.fin_use_num;

            option = {
                method : "GET",
                url : host + "/v2.0/account/balance/fin_num",
                headers : {
                    "Authorization" : authToken
                },
                qs : {
                    bank_tran_id : transId
                    , fintech_use_num : finUseNo
                    , tran_dtime : "20200206113100"
                }
            }
        
            request(option, function(error, response, body) {
                var parseData = JSON.parse(body);
                console.log(parseData);
                res.json(parseData);
            });
        }
    });
});

/**
 * 거래내역조회
 */
app.post("/transactionList", auth, function(req, res) {
    var finUseNo = "";
    var authToken = "";
    var countNum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991602030U" + countNum;
    var user = req.decoded;
    var query = "SELECT * FROM user WHERE id = ?";

    connecction.query(query,[user.userId], function(error, results, fields) {
        if(error) throw error;
        else {

            authToken = "Bearer " + results[0].accesstoken;
            finUseNo = req.body.fin_use_num;

            option = {
                method : "GET",
                url : host + "/v2.0/account/transaction_list/fin_num",
                headers : {
                    "Authorization" : authToken
                },
                qs : {
                    bank_tran_id : transId
                    , fintech_use_num : finUseNo
                    , inquiry_type : "A"
                    , inquiry_base : "D"
                    , from_date : "20200101"
                    , to_date : "20200206"
                    , sort_order : "D"
                    , tran_dtime : "20200206113100"
                }
            }
        
            request(option, function(error, response, body) {
                var parseData = JSON.parse(body);
                console.log(parseData);
                res.json(parseData);
            });
        }
    });
});

/**
 * QR코드 생성
 */
app.get("/qrcode", function(req, res) {
    res.render('qrcode');
});

/**
 * QR코드 리더
 */
app.get("/qrReader", function(req, res) {
    res.render('qrReader');
});

/**
 * 출금이체
 */
app.get("/transaction", function(req, res) {
    res.render('transaction');
});
app.post("/transaction", auth, function(req, res) {
    var finUseNo = "";
    var authToken = "";
    var countNum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991602030U" + countNum;
    var user = req.decoded;
    var query = "SELECT * FROM user WHERE id = ?";

    connecction.query(query,[user.userId], function(error, results, fields) {
        if(error) throw error;
        else {

            authToken = "Bearer " + results[0].accesstoken;
            finUseNo = req.body.fin_use_num;
            var data = {
                            bank_tran_id : transId
                            , cntr_account_type : "N"
                            , cntr_account_num : "0341201175"
                            , dps_print_content : "환불"
                            , fintech_use_num : "199160203057881263133693"
                            , tran_amt : "1004"
                            , tran_dtime : "20200206164000"
                            , req_client_bank_code : "097"
                            , req_client_account_num : "12312321312"
                            , req_client_name : "강소진"
                            , req_client_num : "1100751898"
                            , transfer_purpose : "TR"
                            , recv_client_name : "수취인"
                            , recv_client_bank_code : "097"
                            , recv_client_account_num : "80550201293691"
                        }

            option = {
                method : "POST",
                url : host + "/v2.0/transfer/withdraw/fin_num",
                headers : {
                    "Authorization" : authToken,
                    "Content-Type" : "application/json; charset=UTF-8"
                },
                json :  data
            }

            request(option, function(error, response, body) {
                console.log(body); 
                res.json(body);
            });
        }
    });
});
/**
 * oob 권한 토큰 받기(입금 기능 구현 시 사용)
 */
app.get("/oob", function(req, res) {
    var authCode = req.query.code;
    var option = {
        method : "POST",
        url : host + "/oauth/2.0/token",
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
        },
        form : {
            client_id : "Vn0D9mniM8Er8WMR3Zz4QNJ3euO45IU10ufDYp6S",
            client_secret : "uUHKTZNqXLs226KQR9Wf17ZC13LYhRzI869CwDp4",
            scope : "oob",
            grant_type : "client_credentials"
        }
    };
 
    request(option, function(error, response, body) {
        var parseData = JSON.parse(body);
        console.log(parseData);
        res.render("resultChild", {data : parseData});
    })
});


app.listen(3000); //포트 지정