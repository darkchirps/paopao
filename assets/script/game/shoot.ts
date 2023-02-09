import Util from "./util";
import ListSpfs from "../common/ListSpfs";
import { AudioMg } from "../audio/AudioManage";
import { HashMap } from "../common/HashMap";
import { Utils } from "../common/Utils";
import bubbleNode from "./bubbleNode";
import gameScene from "../gameScene";
import bg from "./bg";
const { ccclass, property } = cc._decorator;

@ccclass
export default class shoot extends cc.Component {
    @property(cc.Node) bubbleNode: cc.Node = null;
    /** 彩球 */
    @property(cc.Prefab) caiBall: cc.Prefab = null;
    /** 火球 */
    @property(cc.Prefab) fireBall: cc.Prefab = null;
    /** 炸弹 */
    @property(cc.Prefab) bombBall: cc.Prefab = null;
    /** 发射线 */
    @property(cc.Graphics) graphic_line: cc.Graphics = null;
    /** 发射球 */
    @property(cc.Prefab) shootBall: cc.Prefab = null;
    /** 发射点 */
    @property(cc.Node) shoot1: cc.Node = null;
    /** 代发射点 */
    @property(cc.Node) shoot2: cc.Node = null;
    /** 交换球按钮 */
    @property(cc.Node) exchangeBtn: cc.Node = null;
    /** 道具火球 */
    @property(cc.Node) fireBallNode: cc.Node = null;
    /** 道具彩色球 */
    @property(cc.Node) colorBallNode: cc.Node = null;
    /** 道具炸弹球 */
    @property(cc.Node) bombBallNode: cc.Node = null;

    /** 道具火球 */
    @property(cc.Node) fireBallNodeAdd: cc.Node = null;
    /** 道具彩色球 */
    @property(cc.Node) colorBallNodeAdd: cc.Node = null;
    /** 道具炸弹球 */
    @property(cc.Node) bombBallNodeAdd: cc.Node = null;


    @property(cc.Label) fireBallLab: cc.Label = null;
    /** 道具彩色球 */
    @property(cc.Label) colorBalLab: cc.Label = null;
    /** 道具炸弹球 */
    @property(cc.Label) bombBalLab: cc.Label = null;
    /**发射球颜色id*/
    color1: number = 0;
    /**待发射球颜色id*/
    color2: number = 0;
    /**彩球数量*/
    colorBallNum: number = 1;
    /**火球数量*/
    fireBallNum: number = 1;
    /**炸弹球数量*/
    bombBallNum: number = 1;
    /**线条颜色  红黄绿蓝紫*/
    lineColor = ["#D80a07", "#E3C90a", "#187AF8", "#4CC606", "#D633E4", "#FF5800", "#000000", "#FFFD23"];
    /** 火 炸 彩*/ //特殊球id 100 101 102
    lineColor1 = ["#FF5800", "#000000", "#FFFD23"];
    mainNodes: HashMap<string, cc.Node> = new HashMap();

    start() {
        this.mainNodes = Utils.nodeTreeInfoLite(this.node);
        this.initShoot();
        this.openTouch();
    }
    openTouch() {
        this.graphic_line.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.graphic_line.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.graphic_line.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.graphic_line.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    closeTouch() {
        this.graphic_line.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.graphic_line.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.graphic_line.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.graphic_line.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    /** 生成发射球*/
    public initShoot(): void {
        Util.shooting = false;
        //每连击7次有次特殊球 炸弹 火球 彩球 随机
        if (Util.count != 0 && Util.count % 10 == 0) {
            this.caiqiuAni();
            this.color1 = 102;
            this.mainNodes.get("ballSprite1").active = false;
            this.mainNodes.get("specialBall1").active = true;
            this.mainNodes.get("specialBall1").getComponent(ListSpfs).setSpf(2);
        } else {
            if (this.color2 != 0) {
                this.color1 = this.color2;
                this.color2 = 0;
            } else {
                this.color1 = this.bubbleNode.getComponent(bubbleNode).getsecond();
            }
            this.basicsAni();
            this.mainNodes.get("specialBall1").active = false;
            this.mainNodes.get("ballSprite1").active = true;
            this.mainNodes.get("ballSprite1").getComponent(ListSpfs).setSpf(this.color1);
        }
        if (this.color1 != 0) {
            this.initShoot1();
        }
        this.openTouch();
    }

    /**基础球发射球动画圈*/
    basicsAni() {
        this.shootNull();
        let basicsAni = this.mainNodes.get("basicsAni");
        basicsAni.getComponent(ListSpfs).setSpf(this.color1);
        cc.tween(basicsAni)
            .by(3, { angle: 360 })
            .repeatForever()
            .start()
    }
    /**彩球发射球动画圈*/
    caiqiuAni() {
        this.shootNull();
        let caiqiuAni = this.mainNodes.get("caiqiuAni");
        let caiqiuAni1 = this.mainNodes.get("caiqiuAni1");
        let caiqiuAni2 = this.mainNodes.get("caiqiuAni2");
        caiqiuAni.getComponent(ListSpfs).setSpf(0);
        caiqiuAni1.getComponent(ListSpfs).setSpf(0);
        caiqiuAni2.getComponent(ListSpfs).setSpf(0);
        cc.tween(caiqiuAni)
            .by(4, { angle: -360 })
            .repeatForever()
            .start()
        cc.tween(caiqiuAni1)
            .by(5, { angle: 360 })
            .repeatForever()
            .start()
        cc.tween(caiqiuAni2)
            .by(6, { angle: -360 })
            .repeatForever()
            .start()
    }

    /** 生成待发射球*/
    public initShoot1(): void {
        this.color2 = this.bubbleNode.getComponent(bubbleNode).getsecond();
        this.mainNodes.get("ballSprite2").getComponent(ListSpfs).setSpf(this.color2);
    }

    /**发射出去发射位所有相关置空*/
    shootNull(show: boolean = true) {
        if (show) {
            this.mainNodes.get("basicsAni").getComponent(cc.Sprite).spriteFrame = null;
        }
        this.mainNodes.get("caiqiuAni").getComponent(cc.Sprite).spriteFrame = null;
        this.mainNodes.get("caiqiuAni1").getComponent(cc.Sprite).spriteFrame = null;
        this.mainNodes.get("caiqiuAni2").getComponent(cc.Sprite).spriteFrame = null;
    }

    /**发射球 球图置空 添加进刚体球然后发射出去*/
    shootPlay(d) {
        //发射速度
        let speedV2 = cc.v2(d.x * 1500, d.y * 1500);
        this.closeTouch();
        Util.shooted = true;
        if (!Util.shooting && !Util.gameOver) {
            this.mainNodes.get("ballSprite1").getComponent(cc.Sprite).spriteFrame = null;
            this.shootNull();
            //100 火球 101炸弹 102彩球
            if (this.color1 > 99) {
                this.mainNodes.get("ballSprite1").getComponent(ListSpfs).setSpf(0);
                this.mainNodes.get("main_shoot_3").getComponent(cc.Button).enabled = true;
                this.mainNodes.get("ballSprite1").active = false;
                this.mainNodes.get("specialBall1").active = false;
                if (this.color1 == 100) {
                    AudioMg.fireAudio();
                    this.shoot1.addChild(cc.instantiate(this.fireBall));
                    this.shoot1.getChildByName("fireBall").getComponent(cc.RigidBody).linearVelocity = speedV2;
                } else if (this.color1 == 101) {
                    AudioMg.shootAudio();
                    this.shoot1.addChild(cc.instantiate(this.bombBall));
                    this.shoot1.getChildByName("bombBall").getComponent(cc.RigidBody).linearVelocity = speedV2;
                } else if (this.color1 == 102) {
                    AudioMg.shootAudio();
                    this.shoot1.addChild(cc.instantiate(this.caiBall));
                    this.shoot1.getChildByName("caiBall").getComponent(cc.RigidBody).linearVelocity = speedV2;
                }
            } else {
                this.mainNodes.get("ballSprite1").active = true;
                this.mainNodes.get("specialBall1").active = false;
                AudioMg.shootAudio();
                this.shoot1.addChild(cc.instantiate(this.shootBall));
                this.shoot1.getChildByName("shootBall").active = true;
                this.shoot1.getChildByName("shootBall").getComponent(ListSpfs).setSpf(this.color1);
                this.shoot1.getChildByName("shootBall").getComponent(cc.RigidBody).linearVelocity = speedV2;
            }
        }
    }

    //交换发射球与发射球
    exchangeBall(e) {
        if (this.color1 > 99) return;
        AudioMg.exchangeButtonAudio();
        this.exchangeBtn.runAction(cc.rotateBy(0.2, 180));
        e.target.getComponent(cc.Button).enabled = false;
        this.mainNodes.get("ballSprite1").runAction(cc.moveTo(0.1, cc.v2(-35, -55)));
        this.mainNodes.get("ballSprite2").runAction(cc.moveTo(0.1, cc.v2(35, 55)));
        let exchange = this.color1;
        this.color1 = this.color2;
        this.color2 = exchange;
        this.mainNodes.get("ballSprite1").getComponent(ListSpfs).setSpf(this.color1);
        this.mainNodes.get("ballSprite2").getComponent(ListSpfs).setSpf(this.color2);
        this.scheduleOnce(() => {
            this.mainNodes.get("ballSprite1").runAction(cc.moveTo(0.1, cc.v2(0, 0)));
            this.mainNodes.get("ballSprite2").runAction(cc.moveTo(0.1, cc.v2(0, 0)));
        }, 0.1)
        this.scheduleOnce(() => {
            this.basicsAni();
            e.target.getComponent(cc.Button).enabled = true;
        }, 0.2)
    }

    /**获取发射点 即发射球的球心点*/
    getShootV2(): cc.Vec2 {
        return this.shoot1.children[0].convertToWorldSpaceAR(cc.v2(0, 0));
    }

    /**获取触点位置*/
    getTouch(touch: cc.Event.EventTouch) {
        let camera = cc.Camera.main;
        let pos: cc.Vec2 = touch.getLocation().addSelf(camera.node.getPosition());//获取点击的世界坐标
        return pos;
    }

    /**检测*/
    getTouchVoid(touchEvent) {
        //触摸点低于发射球位置则发射线透明度为0
        if (this.getTouch(touchEvent).y < this.getShootV2().y + 40) {
            this.graphic_line.node.opacity = 0;
        } else {
            this.graphic_line.node.opacity = 255;
        }
        this.graphic_line.clear();

        this._cur_length = 0;
        this._cur_length1 = 0;
        this._cur_length2 = 0;
        const startLocation = this.getShootV2();
        const location = this.getTouch(touchEvent);//获取点击的世界坐标;
        const startLocation1 = cc.v2(startLocation.x - 32.5, startLocation.y)
        const location1 = cc.v2(location.x - 32.5, location.y)
        const startLocation2 = cc.v2(startLocation.x + 32.5, startLocation.y)
        const location2 = cc.v2(location.x + 32.5, location.y)

        this.drawRayCast2(startLocation2, location2.subSelf(startLocation2).normalizeSelf());
        this.drawRayCast1(startLocation1, location1.subSelf(startLocation1).normalizeSelf());
        this.drawRayCast(startLocation, location.subSelf(startLocation).normalizeSelf());
        this.graphic_line.stroke();
    }

    hex2color(hexColor) {
        const hex = hexColor.replace(/^#?/, "0x");
        const c = parseInt(hex);
        const r = c >> 16;
        const g = (65280 & c) >> 8;
        const b = 255 & c;
        return cc.color(r, g, b, 255);
    }
    private onTouchStart(touch: cc.Event.EventTouch) {
        Util.touching = true;
        this.touchV = touch;
        this.graphic_line.clear();
        //指示线颜色
        let color;
        if (this.color1 >= 100) {
            color = this.hex2color(this.lineColor1[this.color1 - 100]);
        } else {
            color = this.hex2color(this.lineColor[this.color1 - 1])
        }
        this.graphic_line.strokeColor = color;
        this.graphic_line.fillColor = color;

        this.getTouchVoid(touch)
    }
    private _cur_length: number = 0;
    private _cur_length1: number = 0;
    private _cur_length2: number = 0;
    /**处于点击中时 则update一直检测 传入触点touch*/
    private touchV;
    private onTouchMove(touch: cc.Event.EventTouch) {
        this.getTouchVoid(touch)
    }
    private onTouchEnd(touch: cc.Event.EventTouch) {
        Util.touching = false;
        let pos: cc.Vec2 = this.getTouch(touch);//获取点击的世界坐标;
        let x = pos.x - this.getShootV2().x;
        let y = pos.y - this.getShootV2().y;
        let radian = Math.atan2(y, x);
        // 弧度转角度 0 - 2π -> 0 - 360
        let degree = cc.misc.radiansToDegrees(radian);
        // angle 与原版 rotation 差 90
        degree -= 90;
        let r = cc.misc.degreesToRadians(degree);
        // 分量 x - sin  y - cos
        let a = cc.v2(-Math.sin(r), Math.cos(r));
        //触摸点低于发射球位置则发射线透明度为0
        if (pos.y < this.getShootV2().y + 40) {
            //低于发射点y值+40则无法发射
        } else {
            this.shootPlay(a);
        }
        this.graphic_line.clear();
    }
    // /**
    //  * @description 计算射线
    //  * @param startLocation 起始位置 世界坐标系
    //  * @param vector_dir 单位方向向量
    //  */
    private drawRayCast(startLocation: cc.Vec2, vector_dir: cc.Vec2) {
        var a;

        let length;
        if (Util.lineLength1 != 0 && Util.lineLength2 != 0) {
            length = Util.lineLength;
            if (length > Util.lineLength1) {
                length = Util.lineLength1;
                if (length > Util.lineLength2) {
                    length = Util.lineLength2;
                }
            } else {
                length = Util.lineLength2;
            }
        }
        const left_length = length - this._cur_length;
        Util.lineLength = length;
        if (left_length <= 0) return;
        //计算线的终点位置
        const endLocation = startLocation.add(vector_dir.mul(left_length));
        //检测给定的线段穿过哪些碰撞体，可以获取到碰撞体在线段穿过碰撞体的那个点的法线向量和其他一些有用的信息。 
        const results = cc.director.getPhysicsManager().rayCast(startLocation, endLocation, cc.RayCastType.Closest);
        if (results.length > 0) {
            const result = results[0];
            a = result.collider.tag;
            //指定射线与穿过的碰撞体在哪一点相交。
            result.point.y += 4;
            const point = result.point;
            //画入射线段
            this.drawAimLine(startLocation, point, true);
            //计算长度
            const line_length = point.sub(startLocation).mag();
            //计算已画长度
            this._cur_length += line_length;
            //指定碰撞体在相交点的表面的法线单位向量。
            const vector_n = result.normal;
            //入射单位向量
            const vector_i = vector_dir;
            //反射单位向量
            const vector_r = vector_i.sub(vector_n.mul(2 * vector_i.dot(vector_n)));
            if (a == 99) {
                Util.lineLength = this._cur_length;
                return;
            }
            //接着计算下一段
            this.drawRayCast(point, vector_r);
        } else {
            //画剩余线段
            this.drawAimLine(startLocation, endLocation, true);
        }
    }
    // /**
    //  * @description 计算射线
    //  * @param startLocation 起始位置 世界坐标系
    //  * @param vector_dir 单位方向向量
    //  */
    private drawRayCast1(startLocation: cc.Vec2, vector_dir: cc.Vec2) {
        var a;
        //剩余长度
        const left_length = 1000 - this._cur_length1;
        if (left_length <= 0) return;
        //计算线的终点位置
        const endLocation = startLocation.add(vector_dir.mul(left_length));
        //射线测试
        //检测给定的线段穿过哪些碰撞体，可以获取到碰撞体在线段穿过碰撞体的那个点的法线向量和其他一些有用的信息。 
        const results = cc.director.getPhysicsManager().rayCast(startLocation, endLocation, cc.RayCastType.Closest);
        if (results.length > 0) {
            const result = results[0];
            a = result.collider.tag;
            //指定射线与穿过的碰撞体在哪一点相交。
            const point = result.point;
            //画入射线段
            this.drawAimLine(startLocation, point);
            //计算长度
            const line_length = point.sub(startLocation).mag();
            //计算已画长度
            this._cur_length1 += line_length;
            //指定碰撞体在相交点的表面的法线单位向量。
            const vector_n = result.normal;
            //入射单位向量
            const vector_i = vector_dir;
            //反射单位向量
            const vector_r = vector_i.sub(vector_n.mul(2 * vector_i.dot(vector_n)));
            if (a == 99) {
                Util.lineLength1 = this._cur_length1;
                return;
            }
            //接着计算下一段
            this.drawRayCast1(point, vector_r);
        } else {
            //画剩余线段
            this.drawAimLine(startLocation, endLocation);
        }
    }
    // /**
    //  * @description 计算射线
    //  * @param startLocation 起始位置 世界坐标系
    //  * @param vector_dir 单位方向向量
    //  */
    private drawRayCast2(startLocation: cc.Vec2, vector_dir: cc.Vec2) {
        var a;
        //剩余长度
        const left_length = 1000 - this._cur_length2;
        if (left_length <= 0) return;
        //计算线的终点位置
        const endLocation = startLocation.add(vector_dir.mul(left_length));
        //射线测试
        //检测给定的线段穿过哪些碰撞体，可以获取到碰撞体在线段穿过碰撞体的那个点的法线向量和其他一些有用的信息。 
        const results = cc.director.getPhysicsManager().rayCast(startLocation, endLocation, cc.RayCastType.Closest);
        if (results.length > 0) {
            const result = results[0];
            a = result.collider.tag;
            //指定射线与穿过的碰撞体在哪一点相交。
            const point = result.point;
            //画入射线段
            this.drawAimLine(startLocation, point);
            //计算长度
            const line_length = point.sub(startLocation).mag();
            //计算已画长度
            this._cur_length2 += line_length;
            //指定碰撞体在相交点的表面的法线单位向量。
            const vector_n = result.normal;
            //入射单位向量
            const vector_i = vector_dir;
            //反射单位向量
            const vector_r = vector_i.sub(vector_n.mul(2 * vector_i.dot(vector_n)));
            if (a == 99) {
                Util.lineLength2 = this._cur_length2;
                return;
            }
            //接着计算下一段
            this.drawRayCast2(point, vector_r);
        } else {
            //画剩余线段
            this.drawAimLine(startLocation, endLocation);
        }
    }
    /**
     * @description 画瞄准线
     * @param startLocation 起始位置 世界坐标系
     * @param endLocation 结束位置 世界坐标系
     */
    private drawAimLine(startLocation: cc.Vec2, endLocation: cc.Vec2, show: boolean = false) {
        // 转换坐标        
        const graphic_startLocation = this.graphic_line.node.convertToNodeSpaceAR(startLocation);
        this.graphic_line.moveTo(graphic_startLocation.x, graphic_startLocation.y);
        // 间隔
        const delta = 25;
        // 方向
        const vector_dir = endLocation.sub(startLocation);
        // 数量
        const total_count = Math.round(vector_dir.mag() / delta);
        // 每次间隔向量​
        vector_dir.normalizeSelf().mulSelf(delta);
        for (let index = 0; index < total_count; index++) {
            graphic_startLocation.addSelf(vector_dir)
            if (show) {
                this.graphic_line.circle(graphic_startLocation.x, graphic_startLocation.y, 4);
            }
        }
    }

    updateTime: number = 0;
    protected update(dt: number): void {
        this.updateTime += dt;
        if (Util.touching && this.updateTime > 1) {
            this.updateTime = 0;
            this.getTouchVoid(this.touchV);
        }
    }

    fireButton(err, data) {
        console.log('====>');
        if (this.fireBallLab.string == "0") {
            //看广告得奖励
            this.fireBallNodeAdd.active = false;
            this.fireBallLab.string = "1"
            this.fireBallNode.color = cc.color(255, 255, 255);
        } else {
            this.mainNodes.get("ballSprite1").active = false;
            this.mainNodes.get("specialBall1").active = true;
            this.fireBallNodeAdd.active = true;
            this.addAni(this.fireBallNodeAdd);

            this.fireBallLab.string = "0"
            this.fireBallNode.color = cc.color(99, 99, 99);
            let d = parseInt(data);
            this.color1 = d;
            this.mainNodes.get("fireAni").active = true;
            this.mainNodes.get("fireAni").getComponent(cc.Animation).play();
        }

    }
    bombButton(err, data) {
        this.mainNodes.get("fireAni").active = false;
        if (this.bombBalLab.string == "0") {
            //看广告得奖励
            this.bombBallNodeAdd.active = false;
            this.bombBalLab.string = "1"
            this.bombBallNode.color = cc.color(255, 255, 255);
        } else {
            this.mainNodes.get("ballSprite1").active = false;
            this.mainNodes.get("specialBall1").active = true;
            this.mainNodes.get("specialBall1").getComponent(ListSpfs).setSpf(1);
            this.bombBallNodeAdd.active = true;
            this.addAni(this.bombBallNodeAdd);
            this.bombBalLab.string = "0"
            this.bombBallNode.color = cc.color(99, 99, 99);
            let d = parseInt(data);
            this.color1 = d;
        }

    }
    caiqiuButton(err, data) {
        this.mainNodes.get("fireAni").active = false;
        if (this.colorBalLab.string == "0") {
            //看广告得奖励
            this.colorBallNodeAdd.active = false;
            this.colorBalLab.string = "1"
            this.colorBallNode.color = cc.color(255, 255, 255);
        } else {
            this.colorBalLab.string = "0"
            this.colorBallNode.color = cc.color(99, 99, 99);
            this.colorBallNodeAdd.active = true;
            this.addAni(this.colorBallNodeAdd);
            let d = parseInt(data);
            this.color1 = d;
            this.mainNodes.get("ballSprite1").active = false;
            this.mainNodes.get("specialBall1").active = true;
            this.mainNodes.get("specialBall1").getComponent(ListSpfs).setSpf(d - 100);
            this.caiqiuAni();
        }

    }
    gm(err, data) {
        let d = parseInt(data);
        this.color1 = d;
        this.mainNodes.get("ballSprite1").getComponent(ListSpfs).setSpf(d);
    }

    addAni(aniNode: cc.Node) {
        aniNode.stopAllActions();
        aniNode.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.1, 1.1),
                cc.scaleTo(0.1, 1),
                cc.scaleTo(0.1, 1.1),
                cc.scaleTo(0.1, 1),
                cc.delayTime(0.8)
            )
        ));
    }
}
