$(function () {
    // 点击去注册账号的链接事件
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    // 点击去登录的链接事件
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repass: function (value) {
            var pass = $('.reg-box [name=password]').val();
            console.log(pass);

            if (pass !== value) {
                return '两次输入的密码不一致'
            }
        }
    });


    // 监听注册表单的提交事件
    $("#form_reg").on('submit', function (e) {
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }
        e.preventDefault();
        $.post("/api/reguser", data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                } else {
                    layer.msg('注册成功, 请登录');
                    // 模拟人的点击行为
                    return $("#link_login").click();
                }
            }
        );
    });



    $("#form_login").submit(function (e) {
        var login_data = $(this).serialize();
        e.preventDefault();
        $.post("/api/login", login_data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                } else {
                    console.log(res);
                    layer.msg('登录成功');
                    // 将登录成功后的token字符串保存到localStorage中
                    localStorage.setItem('token', res.token);
                    //跳转到后台主页
                    location.href = '/index.html';
                }
            }
        );
    });



})