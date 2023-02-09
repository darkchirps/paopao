import { AudioMg } from "../audio/AudioManage";
import Util from "../game/util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class fireBall extends cc.Component {

    protected start(): void {
        this.node.getChildByName("ani").getComponent(cc.Animation).play();
    }
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node._name == "wall" && otherCollider.tag == 1) {
            selfCollider.node.getChildByName("bombAni").getComponent(cc.Animation).play();
            Util.useFireBall = true;
            AudioMg.fireCloseAudio();
            this.scheduleOnce(() => {
                selfCollider.node.destroy();
            }, 0.05)
        }
    }
}
