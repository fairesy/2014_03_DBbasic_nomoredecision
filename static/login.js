(function(){ 
    var inputId = document.getElementById('inputId');
    var loginButton = document.getElementById('loginButton');
    var joinButton = document.getElementById('joinButton');
    loginButton.addEventListener('click', function(e){
        e.preventDefault();    
        var request = new XMLHttpRequest();
        var formData = new FormData();
        formData.append("id", inputId.value);
        request.open("POST", "/login", true);
        request.send(formData);

        request.addEventListener('load', function(){
            var isMember = JSON.parse(request.responseText);
            if(isMember===false){ //회원이 아님.
                inputId.style.border = '2px solid #ea4646';
                inputId.value = '';
                inputId.placeholder = '존재하지 않는 아이디입니다';
            }
            else{
                window.location.href='./main/'+inputId.value;
            }
        });
    },false);
    
    joinButton.addEventListener('click', function(){
        window.location.href = './join';
    });
})();