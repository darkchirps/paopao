const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.SpriteFrame) noAds: cc.SpriteFrame = null;
    @property(cc.Prefab) noAdsPrefab: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }


    onWaringAdsNotReady(aniStopCallBack: Function) {
        var onStop = function () {
            this.destroy();
            if (aniStopCallBack) aniStopCallBack();
        };
        var pop = cc.instantiate(this.noAdsPrefab);
        this.node.addChild(pop);
        pop.getComponent(cc.Sprite).spriteFrame = this.noAds;
        var anim = pop.getComponent(cc.Animation);
        anim.on('stop', onStop, pop);
        anim.play();
    }
    // update (dt) {}
}
