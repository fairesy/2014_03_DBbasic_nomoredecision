(function(){

    var request = new XMLHttpRequest();
    var formData = new FormData();
    
    var day = document.getElementById('day');
    var hungry = document.getElementById('hungry_state');
    var financial = document.getElementById('financial_state');
    var time = document.getElementById('time_state');

    var submitButton = document.getElementById('submitButton');    
    submitButton.addEventListener('click', function(){
        var today = day.options[day.selectedIndex].value;
        var my_hungry_degree = hungry.options[hungry.selectedIndex].value;
        var my_financial_degree = financial.options[financial.selectedIndex].value;
        var my_time_degree = time.options[time.selectedIndex].value;
        
        if(today===""||my_hungry_degree===""||my_financial_degree===""||my_time_degree===""){
            alert('모든 조건을 선택해주세요!!');
        }
        else{
            formData.append('today', today);
            formData.append('hungry_degree', my_hungry_degree);
            formData.append('financial_degree', my_financial_degree);
            formData.append('time_degree', my_time_degree);

            request.open('POST', '/findStore', true);
            request.send(formData);

            request.addEventListener('load', function(){
                var result = JSON.parse(request.responseText);
                showResults(result);
            },false);
        }
    },false);
    
    function showResults(result){
        var bg=document.getElementById('bgForModal');
        var resultModal = document.getElementById('resultModal');
        bg.style.height = window.innerHeight+'px';
        bg.style.display = 'block';
        resultModal.style.display='block';
        
        if(result.length===0){
            var noItem = document.createElement('div');
            noItem.style.paddingTop = '100px';
            noItem.innerHTML = '조건에 맞는 가게가 없습니다!';
            resultModal.appendChild(noItem);
        }
        
        for(var i=0; i<result.length ; i++){
            var resultItem = document.createElement('div');
            resultItem.setAttribute('class','resultItem');
            resultItem.innerHTML = result[i].name;
            
            var location = document.createElement('div');
            location.setAttribute('class', 'location');
            location.innerHTML = result[i].location;
            
            var description = document.createElement('div');
            description.setAttribute('class', 'description');
            description.innerHTML = result[i].description.substring(0, result[i].description.length-2)
            
            resultItem.appendChild(location);
            resultItem.appendChild(description);
            resultModal.appendChild(resultItem);
        }
    }
    
    var returnButton = document.getElementById('return');
    returnButton.addEventListener('click', function(){
        window.location.href = '/main/'+userId;
    });
    
})();