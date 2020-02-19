$(function(){
    let account = "";           // 輸入的帳號。
    let password = "";          // 輸入的密碼。
    let name = "Bunny";         // 使用者姓名。
    let number_of_card = 99;    // 字卡數量。
    var islands_status = [];    // 每個島嶼進度。
    
    
    /* sweetAlert2 的跳出通知。*/
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
    
    /*抓每個島嶼的關卡進度。*/
    function getStatus(){
        /* 未完成 */
    }
    
    /*印出島嶼的樣貌。*/
    function printIsland(){
        /* 未完成 */
    }
    
    /*進入島嶼*/
    $('.island').on('click',function(){
        let ID = $(this).attr('id');
        console.log('將要進入 '+ID+' 島');
//        window.location.assign("island.html");
    });
    
    /*進入背包*/
    $('#bag').on('click',function(){
        console.log('將要進入 背包 ');
//        window.location.assign("bag.html");
    });

    /*上一頁*/
    $('#world').on('click',function(){
        console.log('將回到登入畫面。');
        dialog(0);
    });
    
    
    
    $('#name').text(name);
    $('#flashcard').text(number_of_card);
    
    
        
});