import { HashMap } from "./HashMap";


export class Utils {
    public static Clone(obj: any) {
        var tempObj = JSON.stringify(obj);
        if (tempObj) {
            return JSON.parse(tempObj);
        } else {
            return tempObj;
        }
    }
    /**
     *
     * @param fileName 文件名
     * @param type     资源类型
     * @param callBack 回调
     */
    public static loadRes<T extends cc.Asset>(fileName: string, type: typeof cc.Asset, callBack: Function) {
        // if(Main.module.cacheRes.get(fileName)){
        //     callBack(Main.module.cacheRes.get(fileName));
        // }else{
        cc.resources.load(fileName, type, (err: Error, ass: T) => {
            if (err) {
                cc.warn("load res error ===========", fileName);
                return;
            }
            callBack(ass);
            // Main.module.cacheRes.set(fileName, ass);
        });
        // }
    }

    /** 获取把 node1移动到 node2位置后的坐标 */
    public static convertNodeSpaceAR(node1: cc.Node, node2: cc.Node): cc.Vec2 {
        return cc.v2(node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2.position)));
    }

    //弹窗动画跳入
    public static playPopupAniIn(target: cc.Node, duration: number, callback?: Function) {
        if (!target) {
            return;
        }
        target.scale = 0;
        cc.tween(target)
            .to(duration, { scale: 1 }, cc.easeBackOut())
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start();
    }
    /**
        * 把Node当前的节点树结构根据Node命名转成一个js对象,重名的组件会覆盖，
        * Node的name不应该包含空格键，否则将跳过
        * @param node 被遍历的Node组件
        * @param obj  绑定的js对象 (可选)
        * @param level 遍历层次数 (可选)  选择合适的层级可以提升效率
        */
    public static nodeTreeInfoLite(node: cc.Node, obj?: HashMap<string, cc.Node>, level?: number): HashMap<string, cc.Node> {
        let _level = level;
        if (isNaN(_level)) {
            _level = 99;
        }
        if (_level < 1) {
            return;
        }
        --_level;
        let treeInfo: HashMap<string, cc.Node> = obj || new HashMap<string, cc.Node>();
        let items = node.children;
        for (let i = 0; i < items.length; i++) {
            let _node = items[i];
            if (_node.name.indexOf(" ") < 0) {
                treeInfo.set(_node.name, _node);
            }
            Utils.nodeTreeInfoLite(items[i], treeInfo, _level);
        }
        return treeInfo;
    }
    static setStorage(key: string, value) {
        if (key != "") {
            cc.sys.localStorage.setItem(key, value);
        }
    }

    static getStorage(key) {
        if (key != "") {
            return cc.sys.localStorage.getItem(key);
        }
    }
    /**清空本地数据的保存*/
    static clearLocalStorage() {
        cc.sys.localStorage.clear();
    }

    static isIpad() {
        if ((cc.winSize.width - 1) / cc.winSize.height <= 16 / 9) {
            return true;
        }
        return false;
    }

    //数据转换成二进制数
    public static strToBinary(str) {
        let result = [];
        var list = str.split("");
        for (var i = 0; i < list.length; i++) {
            if (i != 0) {
                result.push(" ");
            }
            let item = list[i];
            let binaryStr = item.charCodeAt().toString(2);
            result.push(binaryStr);
        }
        return result.join("");
    }

    //二进制数据转换成字符串
    public static BinaryToStr(str) {
        var result = [];
        var list = str.split(" ");
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var asciiCode = parseInt(item, 2);
            var charValue = String.fromCharCode(asciiCode);
            result.push(charValue);
        }
        return result.join("");
    }

    //获取适配屏幕的当前正确的放缩比例
    public static GetViewAspetRatio(AdaptType: number) {
        //let SizeData = cc.view.getVisibleSize();
        let designSize = cc.v2(1280, 720);
        let ViewCurSize = cc.v2(cc.view.getCanvasSize().width, cc.view.getCanvasSize().height);
        //寻找一个能适配屏幕的宽度和高度的比值
        let ScaleHight = ViewCurSize.y / designSize.y;
        let ScaleWidget = ViewCurSize.x / designSize.x;
        let CurScaleNum = 1;
        if (AdaptType == 0) {
            //合适的适配
            CurScaleNum = ScaleHight >= ScaleWidget ? ScaleWidget : ScaleHight;
        } else if (AdaptType == 1) {
            //宽度适配(既使宽度保持为全屏显示不管理高度)
            CurScaleNum = ScaleWidget;
        } else {
            //高度适配
            CurScaleNum = ScaleHight;
        }
        return CurScaleNum;
    }

}