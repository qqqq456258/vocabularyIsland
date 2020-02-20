$(function(){
    let account = "";               // 輸入的帳號。
    let password = "";              // 輸入的密碼。
    let name = "Bunny";             // 使用者姓名。
    let total_building_status = [14,9,12,9]; // 島上每棟建築物全部進度。
    let building_status = [0,0,0,0];       // 島上每棟建築物實際進度。
    let width = 1024;
    let height = 768;
    var svg = null;
    var container = null;
    
    /*抓每個島嶼的關卡進度。*/
    function getStatus(){
        /* 未完成 */
    }
    
    /*印出島嶼的樣貌。*/
    function printIsland(){
        /* 未完成 */
    }
    
    /*縮放地圖的功能。*/
    function zoomed() {
        x = d3.event.translate[0];
        y = d3.event.translate[1];
        s = d3.event.scale;
        container.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    }
    
    /*上一頁*/
    $('#world').on('click',function(){
        console.log('將回到登入畫面。');
        dialog(0);
    });
    
    
    
    /*---------------------------------------------------------------------*/
    
    
    
    getStatus();
    printIsland();

    svg = d3.select('#content')
        .append('svg:svg')
        .attr({
            'width': '100%',
            'height': '100%'
        });

    container = svg.append('g'); // g element 其功能能將需要縮放的 svg 圖檔 分在一組。
    
    container.append("g").select('#island-name-animal');
    container.append("g").select('#boat');
    container.append("g").select('#Animals');
    container.append("g").select('#island-image');
    container.append("g").select('#content-image');
    container.append("g").select('.buliding');
    
    
    
    var x, y, s;

    var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scaleExtent([1, 10])
        .scale(1)
        .on("zoom", zoomed);
    
    
    
});