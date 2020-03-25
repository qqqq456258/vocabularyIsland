$(function () {
    var account = ""; //輸入的帳號。
    var password = ""; //輸入的密碼。
    var name = ""; //使用者姓名。

    function dialog(status) { // 跳出通知。
        let icon = "";
        let title = "";
        let text = "";
        let console_log = "";
        if (status == 0) {
            icon = "error";
            title = "Failure";
            text = "使用者名稱或密碼不能為空。";
            console_log = "status - 0";

        } else if (status == 1) {
            icon = "error";
            title = "Failure";
            text = "無此使用者。";
            console_log = "status - 1";

        } else if (status == 2) {
            icon = "success";
            title = "Success";
            text = "歡迎 " + name + " 進入英文單字島。";
            console_log = "status - 2";

        } else if (status == 3) {
            icon = "error";
            title = "Failure";
            text = "使用者名稱或密碼錯誤。";
            console_log = "status - 3";

        }

        swal.fire({         //sweetAlert2 的功能。
                icon: icon,
                title: title,
                text: text,
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            .then((result) => {
                console.log(console_log);
                console.log("result:"+result);
                console.log("status:"+status);
                if(status == 2){
                    window.location.assign("world.html");
                }
            });
    }

    $('#account,#password').bind("input propertychange", function (e) {
        let input_value = $(this).val().toLowerCase();
        $(this).val(input_value);
    });
    
    
    $('#btn_login').on('click', function () {
        account = $('#account').val();
        password = $('#password').val();
        
        $.ajax({    // 檢證輸入的帳號、密碼。
            url: "php/sign_in_confirm.php",
            type: "POST",
            dataType: "json",
            data: {
                "account": account,
                "password": password
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                console.log(textStatus);
                console.log(errorThrown);
            },
            success: function (data) {
                if (data.status == "no input") {
                    dialog(0);
                } else if (data.status == "no data") {
                    dialog(1);
                } else if (data.status == "success") {
                    name = data.nickname;
                    dialog(2);
                } else {
                    dialog(3);
                }
            }
        });
        
        
    });
});