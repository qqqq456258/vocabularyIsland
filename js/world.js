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

        }
        
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
                
                $('#name').text(name);
                $('#flashcard').text(number_of_card);
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest:" + XMLHttpRequest);
                console.log("textStatus:" + textStatus);
                console.log("errorThrown:" + errorThrown);
                console.log('Error.');
                name = "None";
                number_of_card = 0;
                $('#name').text(name);
                $('#flashcard').text(number_of_card);
            }
        });
        /* 未完成 */
    }
    
    /*抓每個島嶼的關卡進度。*/
    function getStatus(){
        /* 未完成 */
    }
    
    /*印出島嶼的樣貌。*/
    function printWorld(){
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
    getStatus();
    printWorld();
    
    
        
});