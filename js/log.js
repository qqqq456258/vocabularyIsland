$(function(){
    let content = "";
$('#search').on('click',function(){
    content = "<table border='1' id='output'>";
    let account = $('#account').val();
    

/*
    練習發音時，聆聽語音次數
    練習發音時，重新發音次數
    練習發音時，挑選發音紀錄
    第一次拼字，聆聽語音次數
    第一次拼字，提示次數
    第一次拼字，錯誤次數
    第二次拼字，聆聽語音次數
    第二次拼字，提示次數
    第二次拼字，錯誤次數
*/
    
    $.ajax({
        type: "get",
        async: "true", //async設定true會變成異步請求。
        cache: true,
        url: "php/log.php",
        data:{
            account:account
        },
        dataType: "json",
        success: function (json) {
            /* jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行) */
            console.log('Success.');
            console.log(json);
            
            $('#name').text(json[7][0]);
            
            content = content + "<tr><th></th><th>第一關</th><th>第一關複習</th><th>第二關</th><th>第二關複習</th><th>第三關</th><th>第三關複習</th><th>第四關</th><th>第四關複習</th><th>第五關</th><th>第五關複習</th><th>第六關</th><th>第六關複習</th><th>第七關</th><th>第七關複習</th><th>第八關</th><th>第八關複習</th></tr>";
            
            
            /*練習發音時，聆聽語音次數*/
            content = content + "<tr><th>練習發音時，平均語音次數</th>";
            for(let i = 0; i < 16 ; i++ ){
                content = content + "<td>"+(Number(json[0][i])-12)/4+"</td>";
            }
            content = content + "</tr>";
            
            
            /*練習發音時，重新發音次數*/
            content = content + "<tr><th>練習發音時，平均重新發音</th>";
            for(let i = 0; i < 16 ; i++ ){
                content = content + "<td>"+(Number(json[1][i]))/4+"</td>";
            }
            content = content + "</tr>";
            
            
            /*練習發音時，挑選發音紀錄*/
            content = content + "<tr><th>練習發音時，挑選發音紀錄</th>";
            for(let i = 0; i < 16 ; i++ ){
                content = content + "<td>"+json[2][i]+"</td>";
            }
            content = content + "</tr>";
            

            /*第一次拼字，聆聽語音次數*/
            content = content + "<tr><th>第一次拼字，平均語音次數</th>";
            for(let i = 0; i < 16 ; i++ ){
                content = content + "<td>"+(Number(json[3][i]))/4+"</td>";
            }
            content = content + "</tr>";
            

            /*第一次拼字，提示次數*/
            content = content + "<tr><th>第一次拼字，平均提示次數</th>";
            for(let i = 0; i < 16 ; i++ ){
                content = content + "<td>"+(Number(json[4][i]))/4+"</td>";
            }
            content = content + "</tr>";
            

            /*第二次拼字，聆聽語音次數*/
            content = content + "<tr><th>第二次拼字，平均語音次數</th>";
            for(let i = 0; i < 16 ; i++ ){
                content = content + "<td>"+(Number(json[5][i]))/4+"</td>";
            }
            content = content + "</tr>";
            

            /*第二次拼字，提示次數*/
            content = content + "<tr><th>第二次拼字，平均提示次數</th>";
            for(let i = 0; i < 16 ; i++ ){
                content = content + "<td>"+(Number(json[6][i]))/4+"</td>";
            }
            content = content + "</tr>";
            

            $('#output').html(content);


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error.');
            console.log("XMLHttpRequest:" + XMLHttpRequest.responseText);
        }
    });
    
    
})
    
    
    
});