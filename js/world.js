$(function(){
    let account = "";           // 輸入的帳號。
    let name = "";              // 使用者姓名。
    let number_of_card = 0;     // 字卡數量。
    var islands_status = [];    // 每個島嶼進度。
    
    
    /* 跳出通知。*/
    function dialog(status) {
        let icon = "";
        let title = "";
        let text = "";
        let console_log = "";
        if (status == 0) {
            icon = "warning";
            title = "將前往";
            text = "是否前往【登入畫面】？";
            swal.fire({
                    icon: icon,
                    title: title,
                    text: text,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes !'
                })
                .then((result) => {
                    if (result.value) {
                        window.location.assign("index.html");
                    }
                });
            
        }else if(status == 1){
            icon = "warning";
            title = "哎呀！發現你沒登入哦！";
            text = "將前往【登入畫面】";
        
            swal.fire({
                    icon: icon,
                    title: title,
                    text: text,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'O K'
                })
                .then((result) => {
                    if (result.value) {
                        window.location.assign("index.html");
                    }
                });
        }
        

        
        
        
        
    }
    
    /*抓使用者資訊。*/
    function getPersonalInformation() {
        console.log("開始抓使用者資訊...");
        
        $.ajax({
            type: "get",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/world.php",
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log('Success.');
                name = json['name'];
                number_of_card = json['cardAmount'];
                
                console.log('Name:'+name);
                
                if(name == "" || name == null){ // 帳號未登入。
                    dialog(1);
                }
                
                $('#name').text(name);
                $('#flashcard').text(number_of_card);
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest.responseText);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                console.log('Error.');
                
                console.log('Name:'+name);
                
                if(name == "" || name == null){ // 帳號未登入。
                    dialog(1);
                }
                
                number_of_card = 0;
                $('#name').text(name);
                $('#flashcard').text(number_of_card);
            }
        });
        /* 未完成 */
    }
    
    /*抓每個島嶼的關卡進度。*/
    function getStatus(theme_code,title_code,building_code){
        console.log("開始抓島嶼的關卡進度...");
        /* building_code = 0~3 */
        $.ajax({
            type: "post",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/get_island_information.php",
            data:{
                theme:theme_code,
                title:title_code
            },
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log('Success.');
                console.log(json['percentage']);
                if(json['percentage'] == 100){
                    $('#buliding-'+theme_code+'-'+title_code).attr('src','material/animal-island/building-3-'+building_code+'.png');
                }else if(json['percentage'] > 50 && json['percentage'] < 100){
                    $('#buliding-'+theme_code+'-'+title_code).attr('src','material/animal-island/building-2.png');
                }else if(json['percentage'] > 0 && json['percentage'] <= 50){
                    $('#buliding-'+theme_code+'-'+title_code).attr('src','material/animal-island/building-1.png');
                }else{
                    $('#buliding-'+theme_code+'-'+title_code).attr('src','material/animal-island/building-0.png');
                }
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest.responseText);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
            }
        });
        /* 未完成 */
    }
    
    
    /*進入島嶼*/
    $('#Animals').on('click',function(){
        let ID = $(this).attr('id');
        console.log('將要進入 '+ID+' 島');
        window.location.assign(ID+"_island.html");
    });
    
    /*進入背包*/
    $('#bag').on('click',function(){
        console.log('將要進入 背包 ');
        window.location.assign("bag.html");
    });

    /*上一頁*/
    $('#boat').on('click',function(){
        console.log('將回到登入畫面。');
        dialog(0);
    });
    
    
    
    /*---------------------------------------------------------------------*/
    
    
    
    
    getPersonalInformation();
    getStatus(0,0,2);
    getStatus(0,1,1);
    
    
        
});