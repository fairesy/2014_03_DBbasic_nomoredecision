(function(){ 
    var inputId = document.getElementById('inputId');
    var loginButton = document.getElementById('loginButton');
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
                alert('Join us!');
                window.location.href='./join';
            }
            else{
                alert('Welcome!');
                window.location.href='./main/'+inputId.value;
            }
        });
    },false);
    
})();