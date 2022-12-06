//普通方法 hook
function hook01() {
    Java.perform(function () {
        var Utils = Java.use("com.xiaojianbang.app.Utils");
        Utils.getCalc.implementation = function (a, b) {
            var returnData = this.getCalc(a, b);
            console.log("普通方法的调用 ：", a, b);
            //修改返回值
            returnData = 77770;
            return returnData;
        }
    });
}

//重载 hook

/*
        .overload()
        .overload('com.xiaojianbang.app.Money')
        .overload('int')

* */
function hook02() {
    Java.perform(function () {
        var Utils = Java.use("com.xiaojianbang.app.Utils");
        Utils.test.overload().implementation = function () {
            var data = this.test();
            console.log("重载 无参数重载", data)
            return data;
        }

        Utils.test.overload('com.xiaojianbang.app.Money').implementation = function (money) {
            console.log('重载 test is called' + ', ' + 'money: ' + money);
            var ret = this.test(money);
            console.log('重载 test ret value is ' + ret);
            return ret;
        };

        //指定方法 的所有重载
        var overload_len = Utils.test.overload.length;
        for (var i = 0; i < overload_len; i++) {
            Utils.test.overload[i].implementation = function () {
                //遍历打印参数
                for (var a = 0; a < arguments.length; a++) {
                    console.log("指定方法 打印参数", arguments[a]);
                }
                //调用原方法 给参数
                return this.test.apply(this, arguments);
            }
        }

    });
}

//构造方法 hook $init
function hook03() {
    Java.perform(function () {
        var Money = Java.use("com.xiaojianbang.app.Money");
        Money.$init.overload().implementation = function () {
            console.log("构造方法 hook $init")
            this.$init;
        }
    });
}


//对象 hook

/*
    1. 通过 Java.choose找到指定对象
    2.通过Java.use找到对应的类, 在手动调用构造方法构造对象
    3. hook 动态方法, 此时的this就是对象本身;
    4. hook 以目标对象作为参数的方法, 此时该参数就是对象;

 */
function hook04() {
    Java.perform(function () {
        Java.choose("com.xiaojianbang.app.Money", {
            onMatch: function (instance) {
                console.log("对象主动调用：", instance.getInfo())
            }, onComplete: function () {
                console.log("完成")
            }
        })
    });
}


//经常在加壳的 app 中, 没办法正确找到正常加载 app 类的 classloade
function hook05() {
    Java.perform(function () {
        Java.enumerateClassLoadersSync().forEach(function (classloader) {
            try {
                console.log("classloader", classloader);
                classloader.loadClass("com.kanxue.encrypt01.MainActivity");
                Java.classFactory[loader] = classloader;
                var mainActivityClass = Java.use("com.kanxue.encrypt01.MainActivity");
                console.log("mainActivityClass", mainActivityClass);
            } catch (error) {
                console.log("error", error);

            }
        })
    });
}


//动静态成员属性 hook
function hook06() {
    Java.perform(function () {
        var Money = Java.use("com.xiaojianbang.app.Money");
        //获取静态成员
        var static_value = Money.flag.value;
        console.log("静态成员的属性值 ： ", static_value);
        //改变静态成员值
        Money.flag.value = "肉丝牛逼";
        console.log("改变静态变量的值：", Money.flag.value);
        //获取动态成员
        Java.choose("com.xiaojianbang.app.Money", {
            onMatch: function (instance) {
                var dynamic_value = instance.num.value;
                console.log("动态成员变量的值：", dynamic_value)
                //改变动态成员的值
                instance.num.value = 500000000
                console.log("动态成员变量值改变后：", instance.num.value);
            }, onComplete: function () {
                console.log("完成")
            }
        })
    });
}


//内部类 hook
function hook07() {
    Java.perform(function () {
        //内部类使用$进行分隔 不使用.
        var Money_to_innerClass = Java.use("com.xiaojianbang.app.Money$innerClass");
        Money_to_innerClass.outPrint.implementation = function () {
            var ret = this.outPrint();
            console.log("内部类的调用：", ret);
            return ret;
        }
    });
}


//匿名类 hook

/*

接口, 抽象类, 不可以被new
接口, 抽象类 要使用必须要实例化, 实例化不是通过new, 而是通过实现接口方法, 继承抽象类等方式
new __接口__{} 可以理解成 new 了一个实现接口的匿名类, 在匿名类的内部(花括号内),实现了这个接口

*/
function hook08() {
    Java.perform(function () {
        //匿名类在 smail中以 $1, $2 等方式存在, 需要通过 java 行号去 smail 找到准确的匿名类名称
        //    invoke-virtual {v0}, Lcom/xiaojianbang/app/MainActivity$1;->getInfo()Ljava/lang/String;
        var NiMingClass = Java.use("com.xiaojianbang.app.MainActivity$1");
        NiMingClass.getInfo.implementation = function () {
            var ret = this.getInfo();
            console.log("匿名类的hook ：", ret)
            return ret;
        }
    });
}


//类的所有方法 hook 反射
function hook09() {
    Java.perform(function () {
        Java.enumerateLoadedClasses({
            onMatch: function (name, handle) {
                if (name.indexOf("com.xiaojianbang.app.Money") != -1) {
                    console.log("反射：", name, handle);
                    var TargetClass = Java.use(name);
                    var methodsList = TargetClass.class.getDeclaredMethods();
                    for (var i = 0; i < methodsList.length; i++) {
                        console.log(methodsList[i].getName())
                    }
                }
            }, onComplete: function () {
                console.log("完成")
            }
        });
    });
}


//类的所有方法和重载 hook
function hook10() {
    Java.perform(function () {
        //hook md5
        var classList = Java.enumerateLoadedClassesSync();
        for (var i = 0; i < classList.length; i++) {
            //筛选过滤 只遍历 MD5 下面的方法
            if (classList.indexOf("com.xiaojianbang.app.MD5" != -1)) {
                var className = classList[i];
                console.log("class name is :", className);
                //获得类的所有方法
                var methodsList = Java.use(className).class.getDeclaredMethods();
                for (var k = 0; k < methodsList.length; k++) {
                    console.log("method is :", methodsList[k], typeof (methodsList[k]));
                    var methodName = methodsList[k].getName();
                    console.log('methodName', methodName);

                    var hookClass = Java.use(className);
                    //处理重载
                    for (var o = 0; o < hookClass[methodName].overloads.length; o++) {
                        hookClass[methodName].overloads[o].implementation = function () {
                            for (var a = 0; a < arguments.length; a++) {
                                console.log('argument ', a, arguments[a]);
                            }
                            return this[methodName].apply(this, arguments);
                            return "fucking the md5"
                        }
                    }

                }
            }
        }
    });
}


//动态加载的dex hook
function hook11() {
    Java.perform(function () {
        Java.enumerateClassLoaders({
            //loadClass or findClass
            onMatch: function (loader) {
                if (loader.loadClass("com.xiaojianbang.app.Dynamic")) {
                    Java.classFactory['loader'] = loader;
                    var hookClass = Java.use("com.xiaojianbang.app.Dynamic");
                    console.log("success hook it :", hookClass);
                }
            }, onComplete: function () {
                console.log("complete !!! ")
            }
        })
    });
}


//主动构造数组 hook
function hook12() {
    Java.perform(function () {
        var array = Java.array("char", ['1', '2', '3']);
        var array1 = Java.array("java.lang.String", ['4', '5', '6']);
        var ArrayClass = Java.use("java.util.Arrays");
        console.log(ArrayClass.toString(array));
        console.log(ArrayClass.toString(array1));
    });
}


//强制类型转换 hook
//Java.cast() 子类可以强转成父类, 父类不能转成子类
//可以使用Java.cast()将子类强转成父类, 再调用父类的动态方法
function hook13() {
    Java.perform(function () {
        var JuiceHandle = null;
        var WaterClass = Java.use("com.r0ysue.a0526printout.Water");
        Java.choose("com.r0ysue.a0526printout.Juice", {
            onMatch: function (instance) {
                JuiceHandle = instance;
                console.log("JuiceHandle instance", instance);
                // 调用Juice对象的方法
                console.log(JuiceHandle.fillEnergy());
                // 子类Juice转父类Water 并调用父类的动态方法
                var WaterInstance = Java.cast(JuiceHandle, WaterClass);
                console.log(WaterInstance.still(WaterInstance));

            }, onComplete: function () {
                console.log("完成")
            }
        })
    });
}


//打印类实现的接口 hook
function hook14() {
    Java.perform(function () {
        Java.enumerateLoadedClasses({
            onMatch: function (name, handle) {
                if (name.indexOf("com.r0ysue.a0526printout") != -1) {
                    console.log("找到我们需要的类");
                    var targetClass = Java.use(name);
                    //使用反射获取类实现的接口数组
                    var interfaceList = targetClass.class.getInterfaces();
                    if (interfaceList.length > 0) {
                        console.log(name) // 打印类名
                        for (var i in interfaceList) {
                            console.log("\t", interfaceList[i].toString()); // 直接打印接口名称
                        }
                    }

                }
            }, onComplete: function () {
                console.log("完成")
            }
        })
    });
}


//枚举 hook
function hook15() {
    Java.perform(function () {

    });
}


//主动调用构造方法 hook
function hook16() {
    Java.perform(function () {
        var StringClass = Java.use("java.lang.String");
        var MoneyClass = Java.use("com.xiaojianbang.app.Money");
        MoneyClass.$init.overload('java.lang.String', 'int').implementation = function (x, y) {
            console.log('hook Money init', x, y);
            var myX = StringClass.$new("Hello World!");
            var myY = 9999;
            this.$init(myX, myY);
        }
    });
}


//获取context hook
function hook17() {
    Java.perform(function () {
        var currentApplication = Java.use("android.app.ActivityThread").currentApplication();
        console.log(currentApplication);
        var context = currentApplication.getApplicationContext();
        console.log(context);
        var packageName = context.getPackageName();
        console.log(packageName);
        console.log(currentApplication.getPackageName());
    });
}

//主动调用静态方法 hook
function hook18() {
    Java.perform(function () {
        var RSA = Java.use("com.xiaojianbang.app.RSA");
        var StringClass = Java.use("java.lang.String");
        var base64Class = Java.use("android.util.Base64");
        var myBytes = StringClass.$new("Hello World").getBytes();
        var result = RSA.encrypt(myBytes);
        console.log("result is :", result);
        console.log("json result is: ", JSON.stringify(result));
        console.log("base64 result is :", base64Class.encodeToString(result, 0));
        // console.log("new String is : ", StringClass.$new(result)); // 加密之后的内容有很多不可见字符, 不能直接 new String()
    });
}


//主动调用动态方法 hook
function hook19() {
    Java.perform(function () {
        var instance = Java.use("com.xiaojianbang.app.Money").$new("日元", 300000);
        console.log(instance.getInfo());

        //遍历所有的对象并调用 需要进行过滤
        Java.choose("com.xiaojianbang.app.Money", {
            onMatch: function (instance) {
                console.log(instance.getInfo());

            }, onComplete: function () {
                console.log("end")
            }
        })

    });
}


//frida 和 python 交互 hook
function hook20() {
    Java.perform(function () {

    });
}


//打印char hook
function hook21() {
    //打印char字符, 直接调用java.lang.Character toString()即可
    Java.perform(function () {
        var charClass = Java.use("java.lang.Character");
        CharClass.toString.overload("char").implementation = function (inputChar) {
            var result = this.toString(inputChar);
            console.log("inputChar, result: ", inputChar, result);
            return result;
        }
    });
}


//打印char数组 hook
function hook22() {
    // 1. 使用 java.util.Arrays 的 toString 方法 打印 [C
    // 2. 使用 js 的 JSON.stringify 打印 [C
    Java.perform(function () {
        var ArrayClass = Java.use("java.util.Arrays");
        ArrayClass.toString.overload('[C').implementation = function (charArray) {
            // 1. java.util.Arrays.toString()
            var re = this.toString(charArray);
            // 2. javascript JSON.stringify()
            var re1 = JSON.stringify(charArray);
            console.log('charArray, result : ', charArray, re);
            console.log('charArray, result :', charArray, re1);
        }
    });
}


//打印和修改hashmap hook
function hook23() {
    //遍历打印
    Java.perform(function () {
        var targetClass = Java.use("com.xiaojianbang.app.ShufferMap");
        targetClass.show.implementation = function (map) {
            // 遍历 map
            var result = "";
            var it = map.keySet().iterator();
            while (it.hasNext()) {
                var keyStr = it.next();
                var valueStr = map.get(keyStr);
                result += valueStr;
            }
            console.log("result :", result);

            // 修改 map
            map.put("pass", "fxxk");
            map.put("code", "Hello World");
            console.log(JSON.stringify(map));
            this.show(map);

            return this.show(map);
        }
    });
    /// cast打印 HashMap
    Java.perform(function () {
        var HashMapNode = Java.use("java.util.HashMap$Node");
        var targetClass = Java.use("com.xiaojianbang.app.ShufferMap");

        targetClass.show.implementation = function (map) {
            var result = "";
            var iterator = map.entrySet().iterator();
            while (iterator.hasNext()) {
                console.log("entry", iterator.next());
                var entry = Java.cast(iterator.next(), HashMapNode);
                console.log(entry.getKey());
                console.log(entry.getValue());
                return entry.getValue();
            }

            console.log("result is :", result);
        }
    });
    // toString()打印
    Java.perform(function () {
        var targetClass = Java.use("com.xiaojianbang.app.ShufferMap");
        targetClass.show.implementation = function (map) {
            // 直接调用 toString()
            console.log("打印hashmap: -> " + map.toString());
            return this.show.apply(this, arguments);
        }
    })

    Java.perform(function () {
        var HashMap = Java.use('java.util.HashMap');
        var args_map = Java.cast(param_hm, HashMap);
        send(flag + ":" + args_map.toString());
    })

}


//打印byte数组 hook
function hook24() {
    // 方法 1
    Java.perform(function () {
        var StringClass = Java.use("java.lang.String");
        var byteArray = StringClass.$new("Hello World").getBytes();

        // load r0gson
        // openClassFile 返回 dex对象, dex对象.load()加载dex文件内容
        Java.openClassFile("/data/local/tmp/r0gson.dex").load();
        var gson = Java.use("com.r0ysue.gson.Gson");
        console.log(gson.$new().toJson(byteArray));

        // // console byte[]
        // var ByteString = Java.use("com.android.okhttp.okio.ByteString");
        // console.log(ByteString.of(byteArray).hex()); // byte转16进制字符串

        // // 创建自定义Java数组 并打印
        // var MyArray = Java.array("byte",[13,4,4,2]);
        // console.log(gson.$new().toJson(MyArray));

        var TargetClass = Java.use("com.xiaojianbang.app.ShufferMap");
        TargetClass.show.implementation = function (map) {
            console.log(gson.$new().toJson(map));
            return this.show(map);
        }
    });

    //方法 2
    // // 1. 使用 java.util.Arrays.toString() 打印 [B
    // // 2. 使用 javascript JSON.stringify() 打印 [B
    Java.perform(function () {
        var ArrayClass = Java.use("java.util.Arrays");
        ArrayClass.toString.overload('[B').implementation = function (byteArray) {
            // 1. 使用 java.util.Arrays.toString() 打印 [B
            var result = this.toString(byteArray);
            // 2. 使用 javascript JSON.stringify() 打印 [B
            var result1 = JSON.stringify(byteArray);

            console.log('byteArray,result: ', byteArray, result);
            console.log('byteArray,result1 :', byteArray, result1);

            return result
        }
    })

    //方法 3
    Java.perform(function () {
        var ByteString = Java.use("com.android.okhttp.okio.ByteString");
        console.log(ByteString.of(byteArray).hex())
    })

}


//打印调用栈 hook
function hook25() {
    Java.perform(function () {
        console.log("====== printStacks start ====== " + name + "==============================")

        // sample 1
        var throwable = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
        console.log(throwable);

        // sample 2
        var exception = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new());
        console.log(exception);

        console.log("====== printStacks end ======== " + name + "==============================")
    });
}


//gson打印 hook
function hook26() {
    Java.perform(function () {
        var StringClass = Java.use("java.lang.String");
        var byteArray = StringClass.$new("Hello World").getBytes();

        // load r0gson
        // openClassFile 返回 dex对象, dex对象.load()加载dex文件内容
        Java.openClassFile("/data/local/tmp/r0gson.dex").load();
        var gson = Java.use("com.r0ysue.gson.Gson");
        console.log(gson.$new().toJson(byteArray));

        // // console byte[]
        // var ByteString = Java.use("com.android.okhttp.okio.ByteString");
        // console.log(ByteString.of(byteArray).hex()); // byte转16进制字符串

        // // 创建自定义Java数组 并打印
        // var MyArray = Java.array("byte",[13,4,4,2]);
        // console.log(gson.$new().toJson(MyArray));

        var TargetClass = Java.use("com.xiaojianbang.app.ShufferMap");
        TargetClass.show.implementation = function (map) {
            console.log(gson.$new().toJson(map));
            return this.show(map);
        }
    });
}


//打印non-ascii和特殊字符 hook
function hook27() {
    // 一些特殊字符和不可见字符, 可以先通过编码再解码的方式进行 hook
    // int ֏(int x) {
    //         return x + 100;
    //     }
//针对上面的֏, 直接用js编码, 在通过类名[js解码的方法名]进行implementation
    Java.perform(function x() {

        var targetClass = "com.example.hooktest.MainActivity";

        var hookCls = Java.use(targetClass);
        var methods = hookCls.class.getDeclaredMethods();

        for (var i in methods) {
            console.log(methods[i].toString());
            console.log(encodeURIComponent(methods[i].toString().replace(/^.*?\.([^\s\.\(\)]+)\(.*?$/, "$1")));
        }

        hookCls[decodeURIComponent("%D6%8F")].implementation = function (x) {
            console.log("original call: fun(" + x + ")");
            var result = this[decodeURIComponent("%D6%8F")](900);
            return result;
        }
    })
}


//简易wallbreaker内存打印 hook
function hook28() {
    Java.perform(function () {
        var Class = Java.use("java.lang.Class");

        function inspectObject(obj) {
            var obj_class = Java.cast(obj.getClass(), Class);
            var fields = obj_class.getDeclaredFields();
            var methods = obj_class.getMethods();
            console.log("Inspectiong " + obj.getClass().toString());
            console.log("\t Fields:")
            for (var i in fields) {
                console.log("\t\t" + fields[i].toString());
            }
            console.log("\t Methods:")
            for (var i in methods) {
                console.log("\t\t" + methods[i].toString())
            }
        }

        Java.choose("com.baidu.lbs.waimai.WaimaiActivity", {
            onComplete: function () {
                console.log("complete!");

            }, onMatch: function (instance) {
                console.log("find instance", instance);
                inspectObject(instance);
            }
        })
    })
}


//frida 实现runnable hook
function hook29() {
    Java.perform(function () {
        // https://developer.android.com/reference/android/view/WindowManager.LayoutParams.html#FLAG_SECURE
        var FLAG_SECURE = 0x2000;
        var Runnable = Java.use("java.lang.Runnable");
        var DisableSecureRunnable = Java.registerClass({
            name: "me.bhamza.DisableSecureRunnable", implements: [Runnable], fields: {
                activity: "android.app.Activity",
            }, methods: {
                $init: [{
                    returnType: "void", argumentTypes: ["android.app.Activity"], implementation: function (activity) {
                        this.activity.value = activity;
                    }
                }], run: function () {
                    var flags = this.activity.value.getWindow().getAttributes().flags.value; // get current value
                    flags &= ~FLAG_SECURE; // toggle it
                    this.activity.value.getWindow().setFlags(flags, FLAG_SECURE); // disable it!
                    console.log("Done disabling SECURE flag...");
                }
            }
        });

        Java.choose("com.example.app.FlagSecureTestActivity", {
            "onMatch": function (instance) {
                var runnable = DisableSecureRunnable.$new(instance);
                instance.runOnUiThread(runnable);
            }, "onComplete": function () {
            }
        });
    });

}


//startActivity  hook
function hook31() {
    Java.perform(function () {
        var Activity = Java.use("android.app.Activity");
        //console.log(Object.getOwnPropertyNames(Activity));
        Activity.startActivity.overload('android.content.Intent').implementation = function (p1) {
            console.log("Hooking android.app.Activity.startActivity(p1) successfully,p1=" + p1);
            console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
            console.log(decodeURIComponent(p1.toUri(256)));
            this.startActivity(p1);
        }
        Activity.startActivity.overload('android.content.Intent', 'android.os.Bundle').implementation = function (p1, p2) {
            console.log("Hooking android.app.Activity.startActivity(p1,p2) successfully,p1=" + p1 + ",p2=" + p2);
            console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
            console.log(decodeURIComponent(p1.toUri(256)));
            this.startActivity(p1, p2);
        }
        Activity.startService.overload('android.content.Intent').implementation = function (p1) {
            console.log("Hooking android.app.Activity.startService(p1) successfully,p1=" + p1);
            console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
            console.log(decodeURIComponent(p1.toUri(256)));
            this.startService(p1);
        }
    });
}


//frida实现activity 跳转  hook
function hook32() {
    Java.perform(function () {
        var context = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext();
        var intentClazz = Java.use("android.content.Intent");
        var activityClazz = Java.use("ctrip.android.hotel.view.UI.inquire.HotelInquireActivity");
        var intentObj = intentClazz.$new(context, activityClazz.class);
        intentObj.setFlags(0x10000000);
        context.startActivity(intentObj);
        console.log("startActivity");
    });
}


//frida强制在主线程运行  hook
function hook34() {
    //针对使用一些方法的时候出现报错 on a thread that has not called Looper.prepare()
    // 强制让代码运行在主线程中
    Java.perform(function () {
        var Toast = Java.use('android.widget.Toast');
        var currentApplication = Java.use('android.app.ActivityThread').currentApplication();
        var context = currentApplication.getApplicationContext();

        Java.scheduleOnMainThread(function () {
            Toast.makeText(context, "Hello World", Toast.LENGTH_LONG.value).show();
        })
    });
}


//禁止APP推出  hook
function hook36() {
    Java.perform(function () {
        Java.perform(function () {
            console.log("[*] Starting hook exit");
            var exitClass = Java.use("java.lang.System");
            exitClass.exit.implementation = function () {
                console.log("[*] System.exit.called");
            }
            console.log("[*] hooking calls to System.exit");
        })
    });
}


//修改设备参数  hook
function hook37() {
    Java.perform(function () {

    });
}


//打印请求调用栈  hook
function hook38() {
    // frida hook 修改设备参数
    Java.perform(function () {
        var TelephonyManager = Java.use("android.telephony.TelephonyManager");

        //IMEI hook
        TelephonyManager.getDeviceId.overload().implementation = function () {
            console.log("[*]Called - getDeviceId()");
            var temp = this.getDeviceId();
            console.log("real IMEI: " + temp);
            return "867979021642856";
        };
        // muti IMEI
        TelephonyManager.getDeviceId.overload('int').implementation = function (p) {
            console.log("[*]Called - getDeviceId(int) param is" + p);
            var temp = this.getDeviceId(p);
            console.log("real IMEI " + p + ": " + temp);
            return "867979021642856";
        };

        //IMSI hook
        TelephonyManager.getSimSerialNumber.overload().implementation = function () {
            console.log("[*]Called - getSimSerialNumber(String)");
            var temp = this.getSimSerialNumber();
            console.log("real IMSI: " + temp);
            return "123456789";
        };
        //////////////////////////////////////

        //ANDOID_ID hook
        var Secure = Java.use("android.provider.Settings$Secure");
        Secure.getString.implementation = function (p1, p2) {
            if (p2.indexOf("android_id") < 0) return this.getString(p1, p2);
            console.log("[*]Called - get android_ID, param is:" + p2);
            var temp = this.getString(p1, p2);
            console.log("real Android_ID: " + temp);
            return "844de23bfcf93801";

        }

        //android的hidden API，需要通过反射调用
        var SP = Java.use("android.os.SystemProperties");
        SP.get.overload('java.lang.String').implementation = function (p1) {
            var tmp = this.get(p1);
            console.log("[*]" + p1 + " : " + tmp);

            return tmp;
        }
        SP.get.overload('java.lang.String', 'java.lang.String').implementation = function (p1, p2) {


            var tmp = this.get(p1, p2)
            console.log("[*]" + p1 + "," + p2 + " : " + tmp);
            return tmp;
        }
        // hook MAC
        var wifi = Java.use("android.net.wifi.WifiInfo");
        wifi.getMacAddress.implementation = function () {
            var tmp = this.getMacAddress();
            console.log("[*]real MAC: " + tmp);
            return tmp;
        }

    })

}


//hook ui thread 注入  hook
function hook39() {
    Java.perform(function () {
        var Toast = Java.use('android.widget.Toast');
        var currentApplication = Java.use('android.app.ActivityThread').currentApplication();
        var context = currentApplication.getApplicationContext();

        Java.scheduleOnMainThread(function () {
            Toast.makeText(context, "Hello World", Toast.LENGTH_LONG.value).show();
        })
    })

}


//frida 注册接口  hook
function hook42() {
    Java.perform(function () {
        // $接口
        var Frida9Interface = Java.use("com.github.lastingyang.androiddemo.Activity.FridaActivity9$Frida9Interface");
        console.log("Frida9Interface", Frida9Interface);
        var Frida9InterfaceImpl = Java.registerClass({
            name: "com.github.lastingyang.androiddemo.Activity.FridaActivity9.FridaInterfaceImpl",
            implements: [Frida9Interface],
            methods: {
                check() {
                    console.log("FridaInterfaceImpl.check");
                    return true;
                }
            }
        });
        var FridaActivity9 = Java.use("com.github.lastingyang.androiddemo.Activity.FridaActivity9");
        FridaActivity9.getInstance.implementation = function () {
            console.log("FridaActivity9.getInstance");
            return Frida9InterfaceImpl.$new();
        }

    })
}


function main() {
    hook17();
}

setImmediate(main)