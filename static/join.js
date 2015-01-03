(function(){
    var newId = document.getElementById('newId');
    var submitButton = document.getElementById('submitButton');
    var request = new XMLHttpRequest();
    var formData = new FormData();
    
    submitButton.addEventListener('click', function(){
        formData.append('newId', newId.value);
        request.open('POST', '/newMember', true);
        request.send(formData);
        
        request.addEventListener('load', function(e){
            var isExistId = JSON.parse(request.responseText);
            console.log(isExistId);
            if(isExistId===true){
                alert('이미 존재하는 아이디입니다!!');
            }
            else{
                window.location.href='/';
            }
        },false);
    });

})();