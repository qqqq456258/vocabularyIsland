$(function(){
    
function get_card(){        // 抓取字卡所需資訊。
        
        $.ajax({
            type: "POST",
            async: true, //async設定true會變成異步請求。
            cache: true,
            url: "php/bag.php",
            dataType: "json",
            success: function (json) {
                //jQuery會自動將結果傳入(如果有設定callback函式的話，兩者都會執行)
                console.log(json);
                console.log(json.length+" 筆資料");
                
                for(let i = 0 ; i<json.length ; i++){
                    
                    let file_name = json[i]['picture_filename'].split("_")[2];
                    let word = json[i]['vocabulary'];
                    let bg_color = json[i]['background_color'];
                    let br_color = json[i]['border_color'];
                    
                    let part_speech = "(n..)";
                    let definition = "還沒完成";
                    
                    let context = "<div id='"+file_name+"' class='card' data-target='"+json[i]['picture_filename'].split("_")[1]+"' style='background-color: "+bg_color+";border: 8px solid "+br_color+"'><p class='vocabulary'>"+word+"</p><span class='part_speech'>"+part_speech+"</span><span class='definition'>"+definition+"</span><br><input type='image' class='normal_sound' src='material/speaker.png'><input type='image' class='self_sound' src='material/self_speak.png'><img class='picture' src='upload/image/"+json[i]['picture_filename']+".jpeg' alt=''></div>";
                    
                    $('#card_pile').append(context);
                    
                }
                
            },
            error: function (error) {
                console.log(error.responseText);
                alert('get_card : Wrong。');
                
            }
        });
}
    
function get_audio(){        // 抓取字卡所需語音。
    
}
   
$('#search').msearch('#card_pile .card', 'data-target');
$('#earth').on('click',function(){
        console.log('將進入 - 英文單字島');
        window.location.assign("world.html");
});

get_card();
    
    
    
});