$(function () {
    var layer = layui.layer
    var form = layui.form
    // 初始化富文本编辑器
    initEditor()
    initCate()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!')
                }
                // 调用模板引擎, 渲染分类的下拉菜单
                const htmlStr = template('tpl-cate', res)
                $('#cate_id').html(htmlStr)
                // 一定要记得调用form.render()方法重新渲染
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $("#btnChooseImage").on('click', () => {
        $("#coverFile").click()
    })

    $("#coverFile").on('change', (e) => {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var file = files[0]
        var newImgURL = URL.createObjectURL(file)
        $image.cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
    // 为存为草稿按钮绑定点击事件处理函数
    $("#btnSave2").on('click', () => {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $("#form-pub").on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 基于form表单快速创建一个 FormData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        fd.forEach((v, k) => {
            console.log(k, v);
        })
        // 将封面裁剪过后的图片输出为一个文件对象
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)
            // 发起ajax请求
            publishArticle(fd)
        })
    })
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意: 如果向服务器提交的是FormData格式的数据, 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章失败')
                }
                layer.msg('添加文章成功')
                location.href = '/article/art_list.html'
            }
        });
    }

})