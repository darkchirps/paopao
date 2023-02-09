import { AudioMg } from "../audio/AudioManage";
import Util from "../game/util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class bombBall extends cc.Component {

    onBeginContact(contact, selfCollider, otherCollider) {
        AudioMg.bombAudio();
        if (otherCollider.node._name == "wall" && otherCollider.tag == 1) {
            Util.topBall = true;
            selfCollider.node.destroy();
        } else if (otherCollider.node._name == "ball") {
            selfCollider.node.getChildByName("ani").getComponent(cc.Animation).play();
            selfCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.scheduleOnce(() => {
                selfCollider.node.destroy();
            }, 0.5)
        }
    }
}
