import ListSpfs from "../common/ListSpfs";
import Util from "../game/util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class shootBall extends cc.Component {

    /** 初始化 */
    public init(parent: cc.Node, color: number): void {
        parent.addChild(this.node);
        this.node.getComponent(ListSpfs).setSpf(color);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node._name == "wall" && otherCollider.tag == 1) {
            Util.topBall = true;
            selfCollider.node.destroy();
        }
    }
}
