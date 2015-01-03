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

app.get('/', function(request, response){
    response.render('login.html');
});

app.get('/join', function(request, response){
	response.render('join.html');
});

app.post('/newMember', function(request, response){
    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files){
        if(error){
            console.log('newMember Insert error');
            throw error;
        }
        var newId = fields.newId;
        
        pool.getConnection(function(err, connection){
            if(err){ throw err; }
            connection.query('INSERT INTO user(id) SELECT "'+newId+'" FROM DUAL WHERE NOT EXISTS (SELECT * FROM user WHERE id="'+newId+'");SELECT ROW_COUNT() AS flag;',function(err, result){
                
                if(err){ throw err; }
                    console.log(result[0].flag);
                    var isExistId;
                    if(result[0].flag===0){ isExistId = true; }
                    else{ isExistId = false; }
                    response.json(isExistId);
                    response.end();
                
            });
            connection.release();
            
            //클라이언트에 중복아이디인지 아닌지를 알려줄 수 있는 방법? ROW_COUNT()가 잘 동작하지 않는다.
//            pool.getConnection(function(err, connection){
//                if(err){ throw err; }
//                connection.query('SELECT ROW_COUNT() AS flag;', function(err, result){
//                    if(err){ throw err; }
//                    console.log(result[0].flag);
//                    var isExistId;
//                    if(result[0].flag===0){ isExistId = true; }
//                    else{ isExistId = false; }
//                    response.json(isExistId);
//                    response.end();
//                });
//                connection.release();
//            });
        });
    });
});

app.get('/main/:userId', function(request, response){
    var userId = request.param('userId');
    console.log('>>>>>'+userId+'의 메인페이지로 이동하였습니다.');
    var data = {
        "userId" : userId
    };
	response.render('main', data);
});

/*
접속시 첫페이지. 비밀번호 없이 id(학번)로 로그인한다. 
회원일 경우 로그인하면 메인페이지로 이동한다.
회원이 아닐 경우 join 페이지로 이동하여 가입과정을 거친다. 
*/
app.post('/login', function(request, response){
	var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
    	var userId = fields.id;
    	pool.getConnection(function(err, connection){
    		if(err){
    			console.log('login db connection error');
    			throw err;
    		}
    		connection.query('SELECT id FROM user WHERE id="'+userId+'";', function(err, result){
    			if(err){
    				console.log('id select error');
    				throw err;
    			}

    			var isMember;

    			if(result.length===0){ isMember=false; }
    			else{ isMember=true; }
    			response.json(isMember); // 쿼리 결과 전송 
    		});
    		connection.release();
    	});
	});
});


app.post('',function(request, response){
	//주중.주말
	//배고픔 상태 
	//재정 상태
	//여유 시간 

});

app.listen(app.get('port'));