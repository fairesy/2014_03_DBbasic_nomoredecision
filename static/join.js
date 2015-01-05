window.onload=function(){
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
                newId.style.border = '2px solid #ea4646';
                newId.value = '';
                newId.placeholder = '이미 존재하는 아이디입니다!';
            }
            else{
                alert('가입이 완료되었습니다!!');
                window.location.href='./';
            }
        },false);
    });

};