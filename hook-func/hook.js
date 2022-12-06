function printStacks() {
    var stackTraceString = Java.use("android.util.Log").getStackTraceString(
        Java.use("java.lang.Throwable").$new()
    );

    console.log(stackTraceString)
}

function hookHashMap(limitString) {
    var hashMap = Java.use("java.util.HashMap");
    hashMap.put.implementation = function (a, b) {
        //a=="username"和a.equals("username")一般都可以
        if (a == limitString) {
            console.log("hashMap.put: ", a, b);
            printStacks();
        }

        return this.put(a, b);
    }
}

function hookArrayList(limitString) {
    var arrayList = Java.use("java.util.ArrayList");
    arrayList.add.implementation = function (a) {
        if (a == limitString) {
            console.log("arrayList.add: ", a);
            printStacks();
        }
        return this.add(a);
    }
    arrayList.add.overload('int', 'java.lang.Object').implementation = function (a, b) {
        console.log("arrayList.add: ", a, b);
        return this.add(a, b);
    }
}

function hookTextUtils(limitString) {

    var textUtils = Java.use("android.text.TextUtils");
    textUtils.isEmpty.implementation = function (a) {
        if (a == limitString) {
            console.log("textUtils.isEmpty: ", a);
            printStacks();

        }
        return this.isEmpty(a);
    }
}

function hookStringTrim() {
    var string = Java.use("java.lang.String");
    string.trim.implementation = function () {
        console.log("str.trim: ", this);
        printStacks();
        return this.trim();
    }

}


function hookLogW() {
    var log = Java.use("android.util.Log");
    log.w.overload('java.lang.String', 'java.lang.String').implementation = function (tag, message) {
        console.log("log.w: ", tag, message);
        printStacks();
        return this.w(tag, message);
    }
}

function hookGetText() {
    var editText = Java.use("android.widget.EditText");
    editText.getText.overload().implementation = function () {
        var result = this.getText();
        result = Java.cast(result, Java.use("java.lang.CharSequence"));
        console.log("editText.getText: ", result.toString());
        printStacks();
        return result;
    }
}

function hookSort() {
    var collections = Java.use("java.util.Collections");
    collections.sort.overload('java.util.List').implementation = function (a) {
        var result = Java.cast(a, Java.use("java.util.ArrayList"));
        console.log("collections.sort List: ", result.toString());
        printStacks();
        return this.sort(a);
    }
    collections.sort.overload('java.util.List', 'java.util.Comparator').implementation = function (a, b) {
        var result = Java.cast(a, Java.use("java.util.ArrayList"));
        console.log("collections.sort List Comparator: ", result.toString());
        printStacks();
        return this.sort(a, b);
    }
// .overload('java.lang.String', 'double')
// .overload('java.lang.String', 'int')
// .overload('java.lang.String', 'long')
// .overload('java.lang.String', 'boolean')
}

function hookPut() {
    var jSONObject = Java.use("org.json.JSONObject");
    jSONObject.put.overload('java.lang.String', 'java.lang.Object').implementation = function (a, b) {
        //var result = Java.cast(a, Java.use("java.util.ArrayList"));
        console.log("jSONObject.put: ", a, b);
        printStacks();
        return this.put(a, b);
    }
    jSONObject.getString.implementation = function (a) {
        //var result = Java.cast(a, Java.use("java.util.ArrayList"));
        console.log("jSONObject.getString: ", a);
        var result = this.getString(a);
        console.log("jSONObject.getString result: ", result);
        printStacks();
        return result;
    }

}

function hookShow() {
    var toast = Java.use("android.widget.Toast");
    toast.show.implementation = function () {
        console.log("toast.show: ");
        printStacks();
        return this.show();
    }
}

function hookEncodeToString() {
    var base64 = Java.use("android.util.Base64");
    base64.encodeToString.overload('[B', 'int').implementation = function (a, b) {
        console.log("base64.encodeToString: ", JSON.stringify(a));
        var result = this.encodeToString(a, b);
        console.log("base64.encodeToString result: ", result)
        printStacks();
        return result;
    }
}

function hookGetBytes() {
    var str = Java.use("java.lang.String");
    str.getBytes.overload().implementation = function () {
        var result = this.getBytes();
        var newStr = str.$new(result);
        console.log("str.getBytes result: ", newStr);
        printStacks();
        return result;
    }
    str.getBytes.overload('java.lang.String').implementation = function (a) {
        var result = this.getBytes(a);
        var newStr = str.$new(result, a);
        console.log("str.getBytes result: ", newStr);
        printStacks();
        return result;
    }
}


function main_comm() {
    //hook HashMap的put方法
    hookHashMap("limitString")
    //hook ArrayList的add方法
    hookArrayList("limitString")
    //hook TextUtils的isEmpty方法 这个方法通常是安卓判断输入框是否为空必经的方法！
    hookTextUtils("limitString")
    //hook String的trim方法 这个方法似乎也挺多，去掉开头和结尾的空格，防止脏数据
    hookStringTrim()
    //hook log的w方法
    hookLogW()
    //hook EditText的getText方法 这个应该就多了，但是这个一般在加密的上层，可以考虑使用。
    hookGetText()
    //hook Collections的sort方法
    hookSort()
    //hook jSONObject的put方法 一般在转成json时用的听过的，可以考虑
    hookPut()
    //hook Toast的show方法 这个就很多了，基本上每个app都有，但是hook这个位置又偏加密下层，因为肯定是处理完才弹窗
    hookShow()
    //hook Base64的encodeToString方法 base64就很多了吧，除了消息摘要算法其他最后的形式都是base64格式，很有必要。
    hookEncodeToString()
    //hook String的getBytes方法
    hookGetBytes()
}


setImmediate(main)