var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64DecodeChars = new Array((-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), 62, (-1), (-1), (-1), 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, (-1), (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1), (-1), 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, (-1), (-1), (-1), (-1), (-1));

//打印调用堆栈
function printStact() {
    Java.perform(function () {
        try {
            console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
        } catch (e) {
            try {
                send(Java.use('android.util.log').getStackTraceString(Java.use('java.lang.Throwable').$new()));
            } catch (e) {
                try {
                    var Exception = Java.use("java.lang.Exception");
                    var ins = Exception.$new("Exception");
                    var straces = ins.getStackTrace();
                    if (straces != undefined && straces != null) {
                        var strace = straces.toString();
                        var replaceStr = strace.replace(/,/g, "\r\n");
                        console.log("[*]  =============================Stack strat=======================");
                        console.log(replaceStr);
                        console.log("[*]  =============================Stack end=======================\r\n");
                        Exception.$dispose();
                    }
                } catch (e) {
                }
            }
        }
    });
}

function showStacks() {
    send('调用栈输出\n\t' + Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
}

function base64ToString(e) {
    var r, a, c, h, o, t, d;
    for (t = e.length, o = 0, d = ''; o < t;) {
        do
            r = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && r == -1);
        if (r == -1)
            break;
        do
            a = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && a == -1);
        if (a == -1)
            break;
        d += String.fromCharCode(r << 2 | (48 & a) >> 4);
        do {
            if (c = 255 & e.charCodeAt(o++), 61 == c)
                return d;
            c = base64DecodeChars[c]
        } while (o < t && c == -1);
        if (c == -1)
            break;
        d += String.fromCharCode((15 & a) << 4 | (60 & c) >> 2);
        do {
            if (h = 255 & e.charCodeAt(o++), 61 == h)
                return d;
            h = base64DecodeChars[h]
        } while (o < t && h == -1);
        if (h == -1)
            break;
        d += String.fromCharCode((3 & c) << 6 | h)
    }
    return d
}

function hexToBase64(str) {
    return base64Encode(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

function base64ToHex(str) {
    for (var i = 0, bin = base64Decode(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1)
            tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
}

function hexToBytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var hexA = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}

function bytesToHex(arr) {
    var str = '';
    var k, j;
    for (var i = 0; i < arr.length; i++) {
        k = arr[i];
        j = k;
        if (k < 0) {
            j = k + 256;
        }
        if (j < 16) {
            str += "0";
        }
        str += j.toString(16);
    }
    return str;
}

function stringToHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16);
    }
    return val
}

function stringToBytes(str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        st = [];

        do {
            st.push(ch & 0xFF);
            ch = ch >> 8;
        }
        while (ch);
        re = re.concat(st.reverse());
    }
    return re;
}

function bytesToString(arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = "";
    arr = new Uint8Array(arr);
    for (var i in arr) {
        str += String.fromCharCode(arr[i]);
    }
    return str
}

function bytesToBase64(e) {
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break
        }
        if (o = e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break
        }
        t = e[a++],
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t)
    }
    return r
}

function base64ToBytes(e) {
    var r, a, c, h, o, t, d;
    for (t = e.length, o = 0, d = []; o < t;) {
        do
            r = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && r == -1);
        if (r == -1)
            break;
        do
            a = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && a == -1);
        if (a == -1)
            break;
        d.push(r << 2 | (48 & a) >> 4);
        do {
            if (c = 255 & e.charCodeAt(o++), 61 == c)
                return d;
            c = base64DecodeChars[c]
        } while (o < t && c == -1);
        if (c == -1)
            break;
        d.push((15 & a) << 4 | (60 & c) >> 2);
        do {
            if (h = 255 & e.charCodeAt(o++), 61 == h)
                return d;
            h = base64DecodeChars[h]
        } while (o < t && h == -1);
        if (h == -1)
            break;
        d.push((3 & c) << 6 | h)
    }
    return d
}

function stringToBase64(e) {
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break
        }
        if (o = e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break
        }
        t = e.charCodeAt(a++),
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t)
    }
    return r
}

//array 转成 string
function array2string(array) {
    var buffer = Java.array('byte', array);
    var result = '';
    for (var i = 0; i < buffer.length; i++) {
        result += (String.fromCharCode(buffer[i]))
    }
    return result;
}

//Uint8Array转字符串
function Uint8ArrayToString(fileData) {
    var dataString = "";
    for (var i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i]);
        // console.log(dataString)
    }
    return dataString
}

//byte数组转16进制字符串
function byteToHexString(uint8arr) {
    if (!uint8arr) {
        return '';
    }
    var hexStr = '';
    for (var i = 0; i < uint8arr.length; i++) {
        var hex = (uint8arr[i] & 0xff).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        hexStr += hex;
    }

    return hexStr.toUpperCase();
}

//字符转换
function dataShow(tag, data) {
    Java.perform(function () {
        var ByteString = Java.use("com.android.okhttp.okio.ByteString");
        //tag为标签，data为数据
        //toBase64 1
        try {
            console.log(tag + " toBase64: ", ByteString.of(data).base64());
        } catch (e) {
        }
        try {
            //toHex 2
            console.log(tag + " toHex: ", ByteString.of(data).hex());
        } catch (e) {
        }
        try {
            //toUtf8 3
            console.log(tag + " toUtf8: ", ByteString.of(data).utf8());
        } catch (e) {
        }
    });
}

// 加密主体函数 ======================================加密主体函数====================================加密主体函数==

//Base64
function javaFridaHookBase64() {
    Java.perform(function () {
        console.log("[*]  ******* javaFridaHookBase64   ****** 开始 **********")
        var base64 = Java.use('android.util.Base64');
        var string = Java.use('java.lang.String');
        base64.encode.overload('[B', 'int', 'int', 'int').implementation = function () {
            console.log("[*]  =================base64 encode====================");
            var tag = "javaFridaHookBase64 : base64 encode arguments[0] => ";
            //tag为标签，data为数据
            dataShow(tag, arguments[0]);
            console.log("[*]  base64 encode arguments[1] => " + arguments[1]);
            console.log("[*]  base64 encode arguments[2] => " + arguments[2]);
            console.log("[*]  base64 encode arguments[3] => " + arguments[3]);
            printStact();
            try {
                var data = this.encode(arguments[0], arguments[1], arguments[2], arguments[3])
                send("base64:" + string.$new(data));
            } catch (e) {
            }
            console.log("[*]  javaFridaHookBase64 11111111 =============================================================")
            return data;
        }

        base64.decode.overload('[B', 'int', 'int', 'int').implementation = function () {
            send("=================base64 decode====================");
            send(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
            var tag = "javaFridaHookBase64 : base64 encode arguments[0] => ";
            //tag为标签，data为数据
            dataShow(tag, arguments[0]);
            console.log("[*]  base64 encode arguments[1] => " + arguments[1]);
            console.log("[*]  base64 encode arguments[2] => " + arguments[2]);
            console.log("[*]  base64 encode arguments[3] => " + arguments[3]);
            printStact();
            try {
                var data = this.decode(arguments[0], arguments[1], arguments[2], arguments[3])
                send("base64:" + string.$new(data));
            } catch (e) {
            }
            console.log("[*]  javaFridaHookBase64 2222222 =============================================================")
            return data;
        }
    });
}

//消息摘要算法 MD5 SHA
function javaFridaHookMD5orSHA() {
    Java.perform(function () {
        console.log("[*]  ******* javaFridaHookMD5orSHA   **** 开始 **********")
        var messageDigest = Java.use("java.security.MessageDigest");
        messageDigest.getInstance.overload('java.lang.String', 'java.lang.String').implementation = function (a, b) {
            console.log("[*]  javaFridaHookMD5orSHA 算法名：" + a);
            return this.getInstance(a, b);
        }
        messageDigest.getInstance.overload('java.lang.String').implementation = function (a) {
            console.log("[*]  javaFridaHookMD5orSHA 算法名：" + a);
            return this.getInstance(a);
        }
        messageDigest.update.overload('byte').implementation = function (data) {
            console.log("[*]  javaFridaHookMD5orSHA MessageDigest.update('byte') is called!");
            printStact();
            console.log("[*]  javaFridaHookMD5orSHA  111111 ====================================================================");

            return this.update(data);
        }
        messageDigest.update.overload('java.nio.ByteBuffer').implementation = function (data) {
            console.log("[*]  javaFridaHookMD5orSHA  MessageDigest.update('java.nio.ByteBuffer') is called!");
            printStact();
            console.log("[*]  javaFridaHookMD5orSHA  222222 ====================================================================");

            return this.update(data);
        }
        messageDigest.update.overload('[B').implementation = function (data) {
            console.log("[*]  javaFridaHookMD5orSHA  MessageDigest.update('[B') 被调用了！");
            //调用getAlgorithm得到算法名，因为getAlgorithm为静态方法用this调用
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookMD5orSHA : " + algorithm + " => 调用update得到的数据：";
            //tag为标签，data为数据
            dataShow(tag, data);
            printStact();
            console.log("[*]  javaFridaHookMD5orSHA  333333 ====================================================================");
            return this.update(data);
        }
        messageDigest.update.overload('[B', 'int', 'int').implementation = function (data, start, length) {
            console.log("[*]  javaFridaHookMD5orSHA  MessageDigest.update('[B', 'int', 'int') 被调用了！");
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookMD5orSHA : " + algorithm + " => 调用update得到的数据：";
            dataShow(tag, data);
            printStact();
            console.log("[*]   javaFridaHookMD5orSHA *************************", start, length);
            console.log("[*]  javaFridaHookMD5orSHA  444444 ====================================================================");
            return this.update(data, start, length);
        }
        messageDigest.digest.overload().implementation = function () {
            console.log("[*]  javaFridaHookMD5orSHA  MessageDigest.digest() 被调用了！");
            var result = this.digest();
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookMD5orSHA : " + algorithm + " => 调用digest返回输出的数据：";
            dataShow(tag, result);
            printStact();
            console.log("[*]  javaFridaHookMD5orSHA  555555 ====================================================================");

            return result;
        }
        messageDigest.digest.overload('[B').implementation = function (data) {
            console.log("[*]  javaFridaHookMD5orSHA  MessageDigest.digest('[B') 被调用了！");
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookMD5orSHA : " + algorithm + " => 调用digest得到的数据：";
            dataShow(tag, data);
            var result = this.digest(data);
            var tags = "javaFridaHookMD5orSHA : " + algorithm + " => 调用digest返回输出的数据：";
            dataShow(tags, result);
            printStact();
            console.log("[*]  javaFridaHookMD5orSHA  666666 ====================================================================");
            return result;
        }
        messageDigest.digest.overload('[B', 'int', 'int').implementation = function (data, start, length) {
            console.log("[*]  javaFridaHookMD5orSHA  MessageDigest.digest('[B', 'int', 'int') 被调用了！");
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookMD5orSHA : " + algorithm + " => 调用digest得到的数据：";
            dataShow(tag, data);
            var result = this.digest(data, start, length);
            var tags = algorithm + " => 调用digest返回输出的数据：";
            dataShow(tags, data);
            console.log("[*]  javaFridaHookMD5orSHA *************************", start, length);
            console.log("[*]  javaFridaHookMD5orSHA  777777 ====================================================================");

            printStact();
            return result;
        }
    });
}

//消息摘要算法 HMAC
function javaFridaHookHMAC() {
    Java.perform(function () {
        console.log("[*]  ******* javaFridaHookHMAC   ******** 开始 **********")
        var mac = Java.use("javax.crypto.Mac");
        mac.getInstance.overload('java.lang.String').implementation = function (a) {

            var result = this.getInstance(a);
            printStact();
            console.log("[*]  javaFridaHookHMAC  算法名 ==== ", +a);
            return result;
        }
        //获取到密钥，init方法三个重载
        mac.init.overload('java.security.Key', 'java.security.spec.AlgorithmParameterSpec').implementation = function (key, AlgorithmParameterSpec) {
            console.log("[*]  javaFridaHookHMAC Mac.init('java.security.Key', 'java.security.spec.AlgorithmParameterSpec') is called!");
            console.log("[*]  javaFridaHookHMAC  java.security.Key 111111 =======================================");
            return this.init(key, AlgorithmParameterSpec);
        }
        mac.init.overload('java.security.Key').implementation = function (key) {
            console.log("[*]  javaFridaHookHMAC Mac.init('java.security.Key') is called!");
            // getAlgorithm为静态方法使用this调用
            var algorithm = this.getAlgorithm();
            // 获取到方法名
            var tag = "javaFridaHookHMAC : " + algorithm + " init Key";
            var keyBytes = key.getEncoded();
            dataShow(tag, keyBytes);
            printStact();
            console.log("[*]  javaFridaHookHMAC  java.security.Key 222222 ====================================================");
            return this.init(key);
        }
        // 获取传入的数据，四个重载方法都写上
        mac.update.overload('byte').implementation = function (data) {
            console.log("[*]  javaFridaHookHMAC Mac.update('byte') is called!");
            printStact();
            console.log("[*]  javaFridaHookHMAC  222222 =======================================================================");
            return this.update(data);
        }
        mac.update.overload('java.nio.ByteBuffer').implementation = function (data) {
            console.log("[*]  javaFridaHookHMAC Mac.update('java.nio.ByteBuffer') is called!");
            console.log("[*]  javaFridaHookHMAC  333333 =======================================================================");
            return this.update(data);
        }
        mac.update.overload('[B').implementation = function (data) {
            console.log("[*]  javaFridaHookHMAC Mac.update('[B') is called!");
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookHMAC : " + algorithm + " 调用update得到的数据：";
            dataShow(tag, data);
            printStact();
            console.log("[*]  javaFridaHookHMAC  444444 =======================================================================");
            return this.update(data);
        }
        mac.update.overload('[B', 'int', 'int').implementation = function (data, start, length) {
            console.log("[*]  javaFridaHookHMAC Mac.update('[B', 'int', 'int') is called!");
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookHMAC : " + algorithm + " 调用update得到的数据：";
            dataShow(tag, data);
            console.log("[*]  *******************************", start, length);
            printStact();
            console.log("[*]  javaFridaHookHMAC  555555 =======================================================================");
            return this.update(data, start, length);
        }
        // 获取加密后的值。这里本来有几个重载的为啥只写这一个呢就是牵扯到java底层代码的解释，我自己也绕蒙了，反正写这一个够了
        mac.doFinal.overload().implementation = function () {
            console.log("[*]  javaFridaHookHMAC Mac.doFinal() is called!");
            var result = this.doFinal();
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookHMAC : " + algorithm + " 调用doFinal返回输出的数据：";
            dataShow(tag, result);
            printStact();
            console.log("[*]  javaFridaHookHMAC  666666 =======================================================================");
            return result;
        }
        mac.doFinal.overload('[B').implementation = function (a) {

            var algorithm = this.getAlgorithm();
            var tag1 = "javaFridaHookHMAC : " + algorithm + " 调用doFinal 参数 ：";
            var tag2 = "javaFridaHookHMAC : " + algorithm + " 调用doFinal 返回值 ：";
            var result = this.doFinal(a);
            dataShow(tag1, a);
            dataShow(tag2, result);
            printStact();
            console.log("[*]  javaFridaHookHMAC  777777 =======================================================================");
            return result;
        }
    });
}

//对称加密 DES AES
function javaFridaHookDESorDES3orAES() {
    Java.perform(function () {
        console.log("[*]  ******* javaFridaHookDESorDES3orAES  开始 **********")
        var cipher = Java.use('javax.crypto.Cipher');
        cipher.getInstance.overload('java.lang.String').implementation = function (a) {
            send("填充模式：" + bytesToString(a));
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   填充模式 11111 *****************  ************************ ***************** ")
            return this.getInstance(a);
        }
        cipher.getInstance.overload('java.lang.String', 'java.lang.String').implementation = function (a, b) {
            send("填充模式：" + bytesToString(a));
            send("填充模块：" + bytesToString(b));
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   填充模式 222222  *****************  ************************ ***************** ")
            return this.getInstance(a, b);
        }
        cipher.update.overload('[B').implementation = function (a) {
            var result = this.update(a)
            send("update推入:" + bytesToString(a));
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   update推入 11111  *****************  ************************ ***************** ")
            return result;
        }
        cipher.update.overload('[B', 'int', 'int').implementation = function (a, b, c) {
            var result = this.update(a, b, c);
            send("update推入:" + bytesToString(a) + "|" + b + "|" + c);
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   update推入 222222  *****************  ************************ ***************** ")
            return result;
        }
        cipher.doFinal.overload().implementation = function () {
            var result = this.doFinal();
            send("doFinal(无参)");
            send("doFinal结果(Hex):" + bytesToHex(result));
            send("doFinal结果(Base64):" + bytesToBase64(result));
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   doFinal 111111  *****************  ************************ ***************** ")
            return result;
        }
        cipher.doFinal.overload('[B').implementation = function (a) {
            var result = this.doFinal(a);
            send("doFinal参数(String):" + bytesToString(a));
            send("doFinal结果(Hex):" + bytesToHex(result));
            send("doFinal结果(Base64):" + bytesToBase64(result));
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   doFinal 222222  *****************  ************************ ***************** ")
            return result;
        }
        cipher.init.overload('int', 'java.security.cert.Certificate').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.init('int', 'java.security.cert.Certificate') 被调用了！");
            return this.init.apply(this, arguments);
        }
        cipher.init.overload('int', 'java.security.Key', 'java.security.SecureRandom').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.init('int', 'java.security.Key', 'java.security.SecureRandom') 被调用了！");
            return this.init.apply(this, arguments);
        }
        cipher.init.overload('int', 'java.security.cert.Certificate', 'java.security.SecureRandom').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.init('int', 'java.security.cert.Certificate', 'java.security.SecureRandom') 被调用了！");
            return this.init.apply(this, arguments);
        }
        cipher.init.overload('int', 'java.security.Key', 'java.security.AlgorithmParameters', 'java.security.SecureRandom').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.init('int', 'java.security.Key', 'java.security.AlgorithmParameters', 'java.security.SecureRandom') 被调用了！");
            return this.init.apply(this, arguments);
        }
        cipher.init.overload('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec', 'java.security.SecureRandom').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.init('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec', 'java.security.SecureRandom') 被调用了！");
            return this.init.apply(this, arguments);
        }
        cipher.init.overload('int', 'java.security.Key', 'java.security.AlgorithmParameters').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.init('int', 'java.security.Key', 'java.security.AlgorithmParameters') 被调用了！");
            return this.init.apply(this, arguments);
        }
        cipher.init.overload('int', 'java.security.Key').implementation = function (a, b) {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.init('int', 'java.security.Key') 被调用了！");
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookDESorDES3orAES : " + algorithm + " => init Key";
            var className = JSON.stringify(arguments[1]);
            if (className.indexOf("OpenSSLRSAPrivateKey") === -1) {
                var keyBytes = arguments[1].getEncoded();
                dataShow(tag, keyBytes);
            }

            if (a === 1) {
                console.log("[*]  init  | 加密模式");
            } else if (a === 2) {
                console.log("[*]  init  | 解密模式");
            }
            var bytes_key = b.getEncoded();
            console.log("[*]  init key:" + "|str**:" + bytesToString(bytes_key));
            console.log("[*]  init key:" + "|Hex**:" + bytesToHex(bytes_key));
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   java.security.Key 1111111  ============================================== ")
            return this.init.apply(this, arguments);
        }
        cipher.init.overload('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.init('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec') 被调用了！");
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookDESorDES3orAES : " + algorithm + " => init Key";
            var keyBytes = arguments[1].getEncoded();
            dataShow(tag, keyBytes);
            var tags = "javaFridaHookDESorDES3orAES : " + algorithm + " init iv";
            try {
                var iv = Java.cast(arguments[2], Java.use("javax.crypto.spec.IvParameterSpec"));
                var ivBytes = iv.getIV();
                dataShow(tags, ivBytes);
            } catch (e) {
            }
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES javaFridaHookDESorDES3orAES   init iv Key 222222  ============================================== ")
            return this.init.apply(this, arguments);
        }
        cipher.doFinal.overload().implementation = function () {
            var result = this.doFinal();

            console.log("[*]  doFinal结果: |str  :" + bytesToString(result));
            console.log("[*]  doFinal结果: |hex  :" + bytesToHex(result));
            console.log("[*]  doFinal结果: |base64  :" + bytesToBase64(result));
            return result;
        }
        cipher.doFinal.overload('java.nio.ByteBuffer', 'java.nio.ByteBuffer').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.doFinal('java.nio.ByteBuffer', 'java.nio.ByteBuffer') 被调用了！");
            return this.doFinal.apply(this, arguments);
        }
        cipher.doFinal.overload('[B', 'int').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.doFinal('[B', 'int') 被调用了！");
            return this.doFinal.apply(this, arguments);
        }
        cipher.doFinal.overload('[B', 'int', 'int', '[B').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.doFinal('[B', 'int', 'int', '[B') 被调用了！");
            return this.doFinal.apply(this, arguments);
        }
        cipher.doFinal.overload('[B', 'int', 'int', '[B', 'int').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.doFinal('[B', 'int', 'int', '[B', 'int') 被调用了！");
            return this.doFinal.apply(this, arguments);
        }
        cipher.doFinal.overload().implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.doFinal() 被调用了！");
            return this.doFinal.apply(this, arguments);
        }
        cipher.doFinal.overload('[B').implementation = function () {
            console.log("[*]  javaFridaHookDESorDES3orAES Cipher.doFinal('[B') 被调用了！");
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookDESorDES3orAES : " + algorithm + " 调用doFinal 得到的数据：";
            var data = arguments[0];
            dataShow(tag, data);
            var result = this.doFinal.apply(this, arguments);
            var tags = "javaFridaHookDESorDES3orAES : " + algorithm + " 调用doFinal返回输出的数据：";
            dataShow(tags, result);
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   调用doFinal 111111  ============================================== ")
            return result;
        }
        cipher.doFinal.overload('[B', 'int', 'int').implementation = function () {
            console.log("[*]  Cipher.doFinal('[B', 'int', 'int') 被调用了！");
            var algorithm = this.getAlgorithm();
            var tag = "javaFridaHookDESorDES3orAES : " + algorithm + " 调用doFinal 得到的数据：";
            var data = arguments[0];
            dataShow(tag, data);
            var result = this.doFinal.apply(this, arguments);
            var tags = "javaFridaHookDESorDES3orAES : " + algorithm + " 调用doFinal返回输出的数据：";
            dataShow(tags, result);
            console.log("[*]  ==== ", arguments[1], arguments[2]);
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   调用doFinal 2222222  ============================================== ")
            return result;
        }
        // javax.crypto.spec.DESKeySpec
        var DESKeySpec = Java.use('javax.crypto.spec.DESKeySpec');
        DESKeySpec.$init.overload('[B').implementation = function (a) {
            var result = this.$init(a);

            var bytes_key_des = this.getKey();
            console.log("[*]  des**  |str " + bytesToString(bytes_key_des));
            console.log("[*]  des**  |hex " + bytesToHex(bytes_key_des));
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   javax.crypto.spec.DESKeySpec 1111111  ============================================== ")
            return result;
        }
        DESKeySpec.$init.overload('[B', 'int').implementation = function (a, b) {
            showStacks();
            var result = this.$init(a, b);

            var bytes_key_des = this.getKey();
            console.log("[*]  des**  |str " + bytesToString(bytes_key_des));
            console.log("[*]  des**  |hex " + bytesToHex(bytes_key_des));
            printStact();
            console.log("[*]  javaFridaHookDESorDES3orAES   javax.crypto.spec.DESKeySpec 2222222  ============================================== ")
            return result;
        }
    });
}

//对称加密 RSA
function javaFridaHookRSA() {
    Java.perform(function () {
        console.log("[*]  ******* javaFridaHookRSA   ********* 开始 **********")
        // 密钥 base64
        var x509EncodedKeySpec = Java.use('java.security.spec.X509EncodedKeySpec');
        x509EncodedKeySpec.$init.overload('[B').implementation = function (a) {
            var result = this.$init(a);
            send("javaFridaHookRSA 算法名：RSA");
            send("javaFridaHookRSA RSA钥匙(Base64):" + bytesToBase64(a));
            printStact();
            console.log("[*]  javaFridaHookRSA   密钥 base64 *****************  ************************ ***************** ")
            return result;
        }
        // 密钥 hex 16进制
        var rSAPublicKeySpec = Java.use('java.security.spec.RSAPublicKeySpec');
        rSAPublicKeySpec.$init.overload('java.math.BigInteger', 'java.math.BigInteger').implementation = function (a, b) {

            var result = this.$init(a, b);
            send("javaFridaHookRSA 算法名：RSA(Hex版)");
            send("javaFridaHookRSA RSA钥匙N(16进制Hex):" + a.toString(16));
            send("javaFridaHookRSA RSA钥匙E(16进制Hex):" + b.toString(16));
            printStact();
            console.log("[*]  javaFridaHookRSA   密钥 hex 16进制 *****************  ************************ *****************")
            return result;
        }
        // java.security.KeyPairGenerator
        var KeyPairGenerator = Java.use('java.security.KeyPairGenerator');
        KeyPairGenerator.generateKeyPair.implementation = function () {
            var result = this.generateKeyPair();

            var str_private = result.getPrivate().getEncoded();
            var str_public = result.getPublic().getEncoded();
            console.log("[*]  公钥  |hex" + bytesToHex(str_public));
            console.log("[*]  私钥  |hex" + bytesToHex(str_private));
            console.log("[*]  javaFridaHookRSA   公钥 私钥 11111 *****************  ************************ *****************")
            return result;
        }
        KeyPairGenerator.genKeyPair.implementation = function () {
            var result = this.genKeyPair();

            var str_private = result.getPrivate().getEncoded();
            var str_public = result.getPublic().getEncoded();
            console.log("[*]  公钥  |hex" + bytesToHex(str_public));
            console.log("[*]  私钥  |hex" + bytesToHex(str_private));
            console.log("[*]  javaFridaHookRSA   公钥 私钥 222222 *****************  ************************ *****************")
            return result;
        }
    });
}

//utils
function utils() {
    Java.perform(function () {
        console.log("[*]  ******* utils ********************** 开始 **********")
        var secretKeySpec = Java.use('javax.crypto.spec.SecretKeySpec');
        secretKeySpec.$init.overload('[B', 'java.lang.String').implementation = function (a, b) {
            console.log("[*]  utils ======================================");
            var result = this.$init(a, b)
            console.log("[*]  算法名：" + b);
            console.log("[*]  密钥 | String ：" + bytesToString(a));
            console.log("[*]  密钥 | Hex ：" + bytesToHex(a));
            console.log("[*]  密钥 | Base64 ：" + bytesToBase64(a));
            printStact();
            console.log("[*]  utils  *****************  ************************ *****************  ************************")
            return result;
        }
        //javax.crypto.spec.IvParameterSpec
        var ivParameterSpec = Java.use('javax.crypto.spec.IvParameterSpec');
        ivParameterSpec.$init.overload('[B').implementation = function (a) {

            var result = this.$init(a)
            console.log("[*]  iv向量  | String :" + bytesToString(a));
            console.log("[*]  iv向量  | Hex :" + bytesToHex(a));
            printStact();
            console.log("[*]  utils   iv向量  ivParameterSpec *****************  ************************ ***************** ")
            return result;
        }
        //signature
        var signature = Java.use("java.security.Signature");
        signature.update.overload('byte').implementation = function (data) {
            console.log("[*]  Signature.update('byte') is called!");
            return this.update(data);
        }
        signature.update.overload('java.nio.ByteBuffer').implementation = function (data) {
            console.log("[*]  Signature.update('java.nio.ByteBuffer') is called!");
            return this.update(data);
        }
        signature.update.overload('[B', 'int', 'int').implementation = function (data, start, length) {
            console.log("[*]  Signature.update('[B', 'int', 'int') is called!");
            var algorithm = this.getAlgorithm();
            var tag = "utils : " + algorithm + " update data";
            // dataShow(tag, data);
            console.log("[*]  utils signature =======================================================", start, length);
            return this.update(data, start, length);
        }
        signature.sign.overload('[B', 'int', 'int').implementation = function () {
            console.log("[*]  Signature.sign('[B', 'int', 'int') is called!");
            return this.sign.apply(this, arguments);
        }
        signature.sign.overload().implementation = function () {
            console.log("[*]  Signature.sign() is called!");
            var result = this.sign();
            var algorithm = this.getAlgorithm();
            var tag = "utils : " + algorithm + " sign result";
            // dataShow(tag, result);
            console.log("[*]  utils signature =======================================================");
            return result;
        }
    });
}
// frida HOOK 通杀 常用Java加密函数  =============================================================================
function main() {
    //MD5 SHA
   javaFridaHookMD5orSHA();
    //HMAC
    javaFridaHookHMAC();
    //对称加密 DES AES
   javaFridaHookDESorDES3orAES();
    //对称加密 RSA
   javaFridaHookRSA();
    //utils 密钥、IV、signature
    utils();
    //Base64
    // javaFridaHookBase64();
}

setImmediate(main);



