/**
 * Created by Limbo on 2017/12/29.
 */
var list3D=[];

listInit3D();

$('.matrix3D .boxA').attr('maxlength', 1).on('input', function () {
    this.value = this.value.replace(/\D/g, '');

});
$('.matrix3D .num').attr('maxlength', 2).on('input', function () {
    var val=this.value.replace(/(\D|0)*/g, '');
    if(val.length>1){
        val=val.slice(1);
    }
    this.value = val;
    var dom=$(this);
    listChange3D(dom)
});
$('.go2').click(function () {
    boxChange()
});


//初始化序列
function listInit3D() {
    $('.matrix3D .num').each(function (i, item) {
        item.value = i + 1;
        $(item).attr('num',i);
        list3D.push({
            val:i+1,
            index:i,
            dom:item,
            $dom:$(item).parent().parent().find('.variant'),
            params:~~$(item).parent().parent().find('.variant').val()
        })
    })
}

//序列num变化
function listChange3D(dom) {
    var num=~~dom.attr('num');
    var val=~~dom.val();

    for(var i=0;i<list3D.length;i++){
        if(val==list3D[i].val){
            list3D[i].val=list3D[num].val;
            list3D[num].val=val;

            list3D[i].dom.value=list3D[i].val;
            list3D[num].dom.value=list3D[num].val;
        }
    }
}

//盒子变化3D
function boxChange() {

    var arrParams = [];
    $('.matrix3D .num').each(function (i, item) {
        arrParams.push({
            val: item.value,
            index: i,
            dom: $(item).parent().parent().find('.variant')
        })
    });
    arrParams.sort(function (a, b) {
        return a.val - b.val;
    });

    var arr = [];
    arrParams.forEach(function (item, i) {
        var a = item.index, b = item.dom.val();
        if (i == 0) {
            arr = fnList(a, b);
        } else {
            arr = calcMatrix(arr, fnList(a, b), 4);
        }
    });

    var str = 'matrix3d';
    str += '(';
    arr.forEach(function (item) {
        str += item + ',';
    });
    str = str.slice(0, -1) + ')';
    $(('.box' + $('.matrix3D .boxA').val())).css('transform', str);
}


//方法映射表
function fnList(i, num) {
    var num1 = ~~num;
    var list = [
        {fn: translateX},
        {fn: translateY},
        {fn: translateZ},
        {fn: scaleX},
        {fn: scaleY},
        {fn: scaleZ},
        {fn: rotateX},
        {fn: rotateY},
        {fn: rotateZ},
    ];
    return list[i].fn(num1);
}

//平移
function translateX(num) {
    var arr = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, num, 0, 0, 1];
    return arr;
}
function translateY(num) {
    var arr = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, num, 0, 1];
    return arr;
}
function translateZ(num) {
    var arr = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, num, 1];
    return arr;
}

//缩放
function scaleX(num) {
    var arr = [num, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    return arr;
}
function scaleY(num) {
    var arr = [1, 0, 0, 0, 0, num, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    return arr;
}
function scaleZ(num) {
    var arr = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, num, 0, 0, 0, 0, 1];
    return arr;
}

//旋转
function rotateX(num) {
    var arr = [1, 0, 0, 0, 0, angle('cos', num), angle('sin', num), 0, 0, (-1 * angle('sin', num)), angle('cos', num), 0, 0, 0, 0, 1];
    return arr;
}
function rotateY(num) {
    var arr = [angle('cos', num), 0, (-1 * angle('sin', num)), 0, 0, 1, 0, 0, angle('sin', num), 0, angle('cos', num), 0, 0, 0, 0, 1];
    return arr;
}
function rotateZ(num) {
    var arr = [angle('cos', num), angle('sin', num), 0, 0, (-1 * angle('sin', num)), angle('cos', num), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    return arr;
}


//角度
function angle(str, num) {
    var result;
    var deg = num * Math.PI / 180;

    if (str == 'sin') {
        result = Math.sin(deg)
    } else if (str == 'cos') {
        result = Math.cos(deg)
    } else if (str == 'tan') {
        result = Math.tan(deg)
    }

    //不使用toFixed,四省五入与数学规则不同
    result = Math.round(result * Math.pow(10, 16)) / Math.pow(10, 16);
    return result;
}

//矩阵运算
function calcMatrix(arr1, arr2, num) {
    if (num == 3) {
        arr1 = arr1.concat([0, 0, 1]);
        arr2 = arr2.concat([0, 0, 1]);
    }

    var arr = [];
    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            var sum = 0;
            for (var k = 0; k < num; k++) {
                sum += arr1[i * num + k] * arr2[k * num + j]
            }
            arr.push(sum);
        }
    }

    if (num == 3) {
        arr.splice(-3)
    }
    return arr;
}