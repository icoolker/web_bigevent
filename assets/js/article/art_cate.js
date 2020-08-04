$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }


    var indexAdd = null;
    var indexEdit = null;
    $("#btnAddCate").on('click', function () {
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $("#dialog-add").html()
        });
    })

    // 通过代理的形式, 为form-add表单绑定submit事件
    $("body").on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }
                initArtCateList();
                layer.msg('新增分类成功!~')
                layer.close(indexAdd);
            }
        });
    })

    // 通过代理的形式, 为btn-edit按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $("#dialog-edit").html()
        });

        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    layer.closeAll();
                    return layer.msg('获取文章信息失败!~');
                }
                form.val("form-edit", res.data);
            }
        });
    })
    // 通过代理的形式, 为form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败!~');
                }
                layer.msg('更新分类数据成功!~');
                layer.close(indexEdit);
                initArtCateList();
            }
        });


    })


    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        var indexDelete = layer.confirm('确定要删除此条分类记录吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类数据失败!~');
                    }
                    layer.msg('删除分类数据成功!~');
                    layer.close(indexDelete);
                    initArtCateList();
                }
            });

        });

    });
})