$(function () {
    let account = ""; // 輸入的帳號。
    let name = ""; // 使用者姓名。
    let total_building_status = [14, 9, 12, 9]; // 島上每棟建築物全部進度。
    let building_status = [0, 0, 0, 0]; // 島上每棟建築物實際進度。
    var svg = d3.select('svg'); //用 Svg 控制整個頁面。
    var g = d3.select('g'); //將 g element 放入 SVG 中，並包覆著頁面所有的 DOM element，以便控制縮放變化。

    
    
    /*抓島嶼的關卡進度。*/
    function getStatus() {
        /* 未完成 */
    }

    /*印出島嶼的樣貌。*/
    function printIsland() {
        /* 未完成 */
    }

    /* d3.js 的功能，設定縮放事件的內容*/
    function zoomed() {
        try {
            $('foreignObject').attr('transform', d3.event.transform);
        } catch (e) {
            alert(e);
        }
    }

    
    /* 首先，宣告行為 d3.zoom()，再使用call來呼叫，然後設定zoom的參數，最後執行 zoomed 這個function。*/
    if(document.body.clientHeight != 768){
        svg.call(d3.zoom()
            .translateExtent([[0, 0], [1024, 768]]) // 設定 縮放的範圍，避免拖曳拉出視窗之外。
            .scaleExtent([1, 8]) // 設定 縮放的倍率範圍。
            .on("zoom", zoomed)); // 執行。
    }
    
    /* 進入關卡 */
    $('.buliding_left,.buliding_right,.title').on('click',function(){
        let name = $(this).data('name');
        console.log('將要進入 '+name+' 標題');
        let icon = "";
        let title = "";
        let text = "";
        let console_log = "";
        if (status == 0) {
            icon = "warning";
            title = '將要前往';
            text = '是否進入 " '+name+' " ？';
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
                    location.replace("topic_challenge_pick.html?name="+name);
                }
            });
    });

    /* 上一頁 */
    $('#boat').on('click', function () {
        console.log('將回到主畫面。');
        location.replace("world.html");
    });



    /*---------------------------------------------------------------------*/



    getStatus();
    printIsland();


});