import { AudioMg } from "../audio/AudioManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class closeBtn extends cc.Component {

    closeBtnClick() {
        AudioMg.buttonAudio();
        this.node.parent.destroy();
    }

}
