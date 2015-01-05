//모듈을 추출한다.
var express = require('express');
var formidable = require('formidable'); 
var ejs = require('ejs');
var mysql = require('mysql');

//express 모듈을 사용해 웹서버를 생성한다.
var app=express();

//static 폴더 위치를 찾는다.
var static = __dirname + '/static';
app.use(express.static(static));

//view engine set : ejs
app.set('view engine', 'ejs');
app.set('views', __dirname+'/view');
app.engine('html', require('ejs').renderFile);

//port 설정
app.set('port', (process.env.PORT || 5000));

//DB settings
var pool = mysql.createPool({
    host :'127.0.0.1', 
    user : 'root',
    password : '',
    database : 'nomoredecision',
    connectionLimit:20,
    waitForConnections:true 
});

/* LOGIN
접속시 첫페이지. 비밀번호 없이 id로 로그인한다. 
회원일 경우 로그인하면 메인페이지로 이동한다.
회원이 아닐 경우 join 페이지로 이동하여 가입과정을 거친다. 
*/
app.get('/', function(request, response){
    response.render('login.html');
});
app.post('/login', function(request, response){
	var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
    	var userId = fields.id;
    	pool.getConnection(function(err, connection){
    		if(err){ throw err; }
    		connection.query('SELECT id FROM user WHERE id="'+userId+'";', function(err, result){
    			if(err){ throw err; }
    			var isMember;
    			if(result.length===0){ isMember=false; }
    			else{ isMember=true; }
    			response.json(isMember);
    		});
    		connection.release();
    	});
	});
});

/* JOIN
새로운 멤버를 추가한다. 중복 아이디를 허용하지 않는다.
*/
app.get('/join', function(request, response){
	response.render('join.html');
});
app.post('/newMember', function(request, response){
    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files){
        if(error){ throw error; }
        var newId = fields.newId;
        
        pool.getConnection(function(err, connection){
            if(err){ throw err; }
            var value=1;
            connection.query('CALL insertUser("'+newId+'")',function(err, result){
                if(err){ throw err; }
            });
            connection.release();
            
            pool.getConnection(function(err, connection){
                if(err){ throw err; }
                connection.query('SELECT @isExist AS flag;', function(err, result){
                    if(err){ throw err; }
                    console.log(result[0].flag);
                    var isExistId;
                    if(result[0].flag===0){ isExistId = true; }
                    else{ isExistId = false; }
                    response.json(isExistId);
                    response.end();
                });
                connection.release();
            });
        });
    });
});

/* MAIN
로그인 성공 시 유저에 따라 메인페이지를 보여준다.
*/
app.get('/main/:userId', function(request, response){
    var userId = request.param('userId');
    console.log('>>>>>'+userId+'의 메인페이지로 이동하였습니다.');
    var data = {
        "userId" : userId
    };
	response.render('main', data);
});

/* FIND STORE
사용자가 선택한 옵션에 맞는 가게목록을 찾는다.
*/
app.post('/findStore',function(request, response){
    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files){
        if(error){ throw error; }
        var today = fields.today;
        var hungry_degree = fields.hungry_degree;
        var financial_degree = fields.financial_degree;
        var time_degree = fields.time_degree;
                
        pool.getConnection(function(err,connection){
            connection.query('SELECT type FROM matching_type WHERE hungry_degree="'+hungry_degree+'"AND financial_degree="'+financial_degree+'" AND time_degree="'+time_degree+'";',function(err, result){
            
                var storeType = result[0].type;
                    
                    if(today==='weekday'){
                        pool.getConnection(function(err,connection){
                            connection.query('SELECT id, name, location, description FROM store WHERE type="'+storeType+'";',function(err,result){
                                var matchingStores = JSON.stringify(result);
                                console.log(matchingStores);
                                response.send(matchingStores);
                                response.end();
                            });
                            connection.release();                     
                        });
                    }
                    else{
                        pool.getConnection(function(err,connection){
                            connection.query("SELECT id, name, location, description FROM store WHERE type='"+storeType+"' AND "+today+"='Y';",function(err,result){
                                var matchingStores = JSON.stringify(result);
                                response.send(matchingStores);
                                response.end();
                            });
                            connection.release();
                        });
                    }
            });
            connection.release();
        });
        
    });

});

app.listen(app.get('port'));