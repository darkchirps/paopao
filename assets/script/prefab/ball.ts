import { AudioMg } from "../audio/AudioManage";
import ListSpfs from "../common/ListSpfs";
import bg from "../game/bg";
import bubbleNode from "../game/bubbleNode";
import { ballObject } from "../game/interface";
import Util from "../game/util";
import gameScene from "../gameScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ball extends cc.Component {
    @property(cc.Node) ani: cc.Node = null;
    @property(cc.Node) er: cc.Node = null;

    parent: bubbleNode;
    aniName = ["hongbomb", "huangbomb", "lanbomb", "lvbomb", "zibomb"]
    /** 初始化 */
    public init(parent: bubbleNode, position: cc.Vec3, color: number): void {
        parent.node.addChild(this.node);
        this.parent = parent;
        this.node.position = position;
        let yi = Util.mathSurplus(color, 10);
        let er = Util.mathQuotient(color, 10);
        if (yi == 0) {
            this.node.getComponent(cc.CircleCollider).enabled = false;
            this.node.getComponent(cc.RigidBody).active = false;
            this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
        } else {
            this.node.getComponent(cc.CircleCollider).enabled = true;
            this.node.getComponent(cc.RigidBody).active = true;
            this.node.getComponent(cc.PhysicsCircleCollider).enabled = true;
        }
        if (er == 0) {
            this.er.active = false;
        }
        this.node.getComponent(ListSpfs).setSpf(yi);
        this.er.getComponent(ListSpfs).setSpf1(er);
    }
    /** 消除动画 */
    public playDeathAnimation(colorID): void {
        if (colorID < 6) {
            var anim = this.ani.getComponent(cc.Animation);
            var deathAnimationFinish = function () {
                this.ani.getComponent(cc.Sprite).spriteFrame = null;
            };

            anim.getComponent(cc.Animation).on('finished', deathAnimationFinish, this);
            anim.getComponent(cc.Animation).play(this.aniName[colorID - 1]);
        }
    }

    /** 消除自身dian */
    public removeDian() {
        if (this.node) {
            this.scheduleOnce(() => {
                this.node.getComponent(cc.RigidBody).active = false;
                this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
            }, 0.1)
            this.node.getComponent(ListSpfs).setSpf(0);
            this.er.getComponent(ListSpfs).setSpf1(0);
            this.node.getComponent(cc.CircleCollider).enabled = false;
        }
    }

    /** 消除自身 */
    public removeSelf(event: string = "") {
        if (this.node) {
            if (event == "bomb") {
                this.scheduleOnce(() => {
                    this.node.getComponent(cc.RigidBody).active = false;
                    this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
                }, 0.3)
            } else {
                this.node.getComponent(cc.RigidBody).active = false;
                this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
            }
            if (event == "下落动画") {
                this.node.getComponent(cc.CircleCollider).enabled = false;
                this.scheduleOnce(() => {
                    this.node.getComponent(ListSpfs).setSpf(0);
                    this.er.getComponent(ListSpfs).setSpf1(0);
                }, 0.2)
            } else {
                this.node.getComponent(ListSpfs).setSpf(0);
                this.er.getComponent(ListSpfs).setSpf1(0);
                this.node.getComponent(cc.CircleCollider).enabled = false;
            }
        }
    }

    /** 下落动画 */
    public playDownAnimation(index: cc.Vec2): void {
        this.removeSelf("下落动画");
        this.node.runAction(
            // 渐隐下落
            cc.spawn(
                cc.moveBy(0.2, 0, -150),
                cc.fadeOut(0.2)
            )
        );
    }
    failStart: number = 0;
    warningStart: number = 0;
    onCollisionEnter(other, self) {
        if (other.node._name == "fail") {
            //触碰到失败警告线（不是死亡红线，处于死亡红线上面一点）
            if (other.tag == 101) {
                this.failStart = 1;
                this.scheduleOnce(() => {
                    this.failStart = 0;
                }, 2.6)
            }
            //触碰到了失败警告线且触碰到了死亡线 失败
            if (other.tag == 100 && this.failStart == 1 && !Util.gameOver) {
                Util.gameOver = true;
                gameScene.rNode.getChildByName("bg").getComponent(bg).addRelivePage();
            }
        } else if (other.node._name == "warning" && other.tag == 44) {
            //死亡线的显示
            Util.warning = true;
        } else if (other.node._name == "warning" && Util.speed != 0.6 && other.tag == 51 && Util.moveOpen) {
            Util.speed = 0.6;
        } else if (other.node._name == "shootBall" && other.tag == 9) {
            //地图球的颜色
            let selfCol = self.node.getComponent(ListSpfs).idx;
            let selfPox = Util.PosToRowCol(self.node.x, self.node.y);
            if (!Util.shooting) {
                other.node.destroy();
                //发射球坐标转换
                let otherPos = other.node.convertToWorldSpaceAR(cc.v2(0, -640 - Util.XH / 2));
                //发射球坐标转换的二维数组
                let otherPox = Util.PosToRowCol(otherPos.x, otherPos.y);
                //发射球的颜色
                let otherCol = other.node.getComponent(ListSpfs).idx;
                Util.shooting = true;
                let parent = self.node.parent.getComponent(bubbleNode);
                let b = cc.instantiate(self.node);
                let pos = Util.RowColToPos(otherPox.x, otherPox.y);
                b.getComponent(ListSpfs).setSpf(otherCol);
                b.getComponent(ball).er.active = false;
                b.position = pos;
                self.node.parent.addChild(b);
                let obj: ballObject = Object.create(null);
                obj.node = b;
                obj.color = Util.mathSurplus(otherCol, 10);
                obj.second = 0;
                obj.isVisited = false;
                obj.isLinked = false;
                if (obj.color == 0) {
                    obj.isBall = false;
                } else {
                    obj.isBall = true;
                }
                parent.ballArray[otherPox.x][otherPox.y].node.opacity = 0;
                parent.ballArray[otherPox.x][otherPox.y] = obj;
                parent.getDianBall(otherPox);
                parent.mapColor(otherPox, otherCol);
            }
        }
    }

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider) {
        //地图球坐标转换的二维数组
        let selfPox = Util.PosToRowCol(selfCollider.node.x, selfCollider.node.y);
        //地图球的颜色
        let selfCol = selfCollider.node.getComponent(ListSpfs).idx;
        if (otherCollider.node._name == "fireBall") {
            let parent = selfCollider.node.parent.getComponent(bubbleNode);
            let b = parent.ballArray[selfPox.x][selfPox.y];
            //selfCollider.node.getComponent(ball).playDeathAnimation(selfCol);
            parent.showscore(b.node);
            b.color = 0;
            b.node.getComponent(ListSpfs).setSpf(0);
            b.node.getComponent(ball).er.active = false;
            b.isVisited = false;
            b.second = 0;
            b.isBall = false;
            b.isLinked = false;
            this.scheduleOnce(() => {
                this.node.getComponent(cc.RigidBody).active = false;
                this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
                this.node.getComponent(cc.CircleCollider).enabled = false;
            }, 0.1)
        } else if (otherCollider.node._name == "bombBall") {
            //发射球坐标转换
            let otherPos = otherCollider.node.convertToWorldSpaceAR(cc.v2(0, -640 - Util.XH / 2));
            //发射球坐标转换的二维数组
            let otherPox = Util.PosToRowCol(otherPos.x, otherPos.y);
            let parent = selfCollider.node.parent.getComponent(bubbleNode);
            parent.mapBomb(otherPox);
        } else if (otherCollider.node._name == "caiBall") {
            otherCollider.node.destroy();
            //发射球坐标转换
            let otherPos = otherCollider.node.convertToWorldSpaceAR(cc.v2(0, -640 - Util.XH / 2));
            //发射球坐标转换的二维数组
            let otherPox = Util.PosToRowCol(otherPos.x, otherPos.y);
            let parent = selfCollider.node.parent.getComponent(bubbleNode);
            parent.getDianBall(otherPox);
            parent.mapCaiqiu(otherPox);
        }
    }
}
