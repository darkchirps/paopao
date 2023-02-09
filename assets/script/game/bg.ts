import { AudioMg } from "../audio/AudioManage";
import { HashMap } from "../common/HashMap";
import { Utils } from "../common/Utils";
import gameScene from "../gameScene";
import bubbleNode from "./bubbleNode";
import Util from "./util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class bg extends cc.Component {
    @property(cc.Node) camera: cc.Node = null;
    @property(cc.Node) bubbleNode: cc.Node = null;
    @property(cc.Node) shoot: cc.Node = null;
    @property(cc.Node) wall: cc.Node = null;
    @property(cc.Node) warning: cc.Node = null;
    @property(cc.Node) fail: cc.Node = null;
    @property(cc.Node) top: cc.Node = null;
    @property(cc.Node) bottom: cc.Node = null;
    @property(cc.Node) loading: cc.Node = null;

    /**弹窗节点*/
    @property(cc.Node) page: cc.Node = null;
    @property(cc.Prefab) guide: cc.Prefab = null;
    @property(cc.Prefab) pause: cc.Prefab = null;
    @property(cc.Prefab) relive: cc.Prefab = null;
    @property(cc.Prefab) failPage: cc.Prefab = null;
    @property(cc.Prefab) tipsNode: cc.Prefab = null;

    @property(cc.Node) countPage: cc.Node = null;
    juli: number = 800;

    mainNodes: HashMap<string, cc.Node> = new HashMap();

    onLoad() {
        var ScreenH = cc.view.getVisibleSize().height;
        var ScreenW = cc.view.getVisibleSize().width;
        Util.ScreenH = ScreenH;
        Util.ScreenW = ScreenW;
        Util.XH = Util.ScreenH - 1280;

        this.top.y = Util.XH / 2 + this.top.y;
        this.bottom.y = this.bottom.y - Util.XH / 2;
        this.shoot.y = this.shoot.y - Util.XH / 2;
        this.fail.y = this.fail.y - Util.XH / 2;
        this.wall.y = this.wall.y + Util.XH / 2;
        this.warning.y = this.warning.y - Util.XH / 2 + Util.warningY;

        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;

        cc.director.getPhysicsManager().enabledAccumulator = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit
        //     ;
        this.bubbleNode.getComponent(bubbleNode).init();
        if (gameScene.Data.isFirst) {
            this.page.addChild(cc.instantiate(this.guide));
        }

        this.node.y += this.juli;
        this.camera.y += this.juli;
        this.shoot.y += this.juli;
        this.wall.y += this.juli;
        this.warning.y += this.juli;
        this.fail.y += this.juli;
        this.top.y += this.juli;
        this.bottom.y += this.juli;
        this.loading.y += this.juli;
        this.page.y += this.juli;
        this.countPage.y += this.juli;
    }
    protected start(): void {
        this.mainNodes = Utils.nodeTreeInfoLite(this.node);
    }
    /**暂停功能实现*/
    pauseBtn() {
        AudioMg.buttonAudio();
        Util.gamePause = true;
        this.page.addChild(cc.instantiate(this.pause));

        this.node.stopAllActions();
        this.camera.stopAllActions();
        this.shoot.stopAllActions();
        this.wall.stopAllActions();
        this.warning.stopAllActions();
        this.fail.stopAllActions();
        this.top.stopAllActions();
        this.bottom.stopAllActions();
        this.page.stopAllActions();
        this.countPage.stopAllActions();
    }
    showNoAds() {
        let tip = cc.instantiate(this.tipsNode);
        this.page.addChild(tip)
        tip.getComponent('tipsNode').onWaringAdsNotReady(null);
    }
    /**显示复活页面*/
    addRelivePage() {
        if (Util.reliveNum >= 2 && !Util.reliveIng) {
            this.addFailPage();
        } else {
            this.page.addChild(cc.instantiate(this.relive))
        }
    }
    /**复活功能实现*/
    ReliveSuc() {
        Util.reliveIng = true;
        Util.reliveNum++;
        Util.gameOver = false;
        this.node.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        this.camera.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        this.shoot.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        this.wall.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        this.warning.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        this.fail.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        this.top.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        this.bottom.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        this.page.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        this.countPage.runAction(cc.moveBy(2, cc.v2(0, Util.reliveH)));
        Util.shooted = false;
        this.scheduleOnce(() => {
            Util.reliveIng = false;
        }, 2)
    }
    /**失败页面*/
    addFailPage() {
        this.page.addChild(cc.instantiate(this.failPage))
    }
    num: number = 0;
    update(dt) {
        // 物理步长，默认 FIXED_TIME_STEP 是 1/60
        cc.PhysicsManager.FIXED_TIME_STEP = 1 / 60;
        // 每次更新物理系统处理速度的迭代次数，默认为 10
        cc.PhysicsManager.VELOCITY_ITERATIONS = 10;
        // 每次更新物理系统处理位置的迭代次数，默认为 10
        cc.PhysicsManager.POSITION_ITERATIONS = 10;
        this.num += dt;
        if (this.num > 0.033) {
            this.num = 0;
            if (Util.shooted && !Util.gameOver && !Util.gamePause) {
                gameScene.Data.isFirst = false;
                if (this.page.getChildByName("guide")) {
                    this.page.getChildByName("guide").destroy();
                }
                this.node.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
                this.camera.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
                this.shoot.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
                this.wall.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
                this.warning.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
                this.fail.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
                this.top.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
                this.bottom.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
                this.page.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
                this.countPage.runAction(cc.moveBy(0.03, cc.v2(0, Util.speed)));
            }
            if (Util.warning) {
                //避免多此触发
                this.scheduleOnce(() => {
                    Util.warning = false;
                }, 0.5);
                let Sprite = this.fail.getChildByName("Sprite");
                Sprite.runAction(
                    cc.sequence(
                        cc.fadeTo(0.25, 200),
                        cc.fadeTo(0.25, 80),
                        cc.fadeTo(0.25, 200),
                        cc.fadeTo(0.25, 80),
                        cc.fadeTo(0.25, 0),
                    )
                );
            }
        }
    }
}
