import { AudioMg } from "../audio/AudioManage";
import Util from "../game/util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class pause extends cc.Component {

    @property(cc.Label) versionLab: cc.Label = null;

    start() {
        this.versionLab.string = '2023011200';
    }
    continueBtn() {
        AudioMg.buttonAudio();
        Util.gamePause = false;
        this.node.destroy();
    }

    //重玩
    replayBtn() {
        AudioMg.buttonAudio();
        Util.clearData();
        Util.chongwan = true;
        this.scheduleOnce(() => {
            cc.director.loadScene("game");
        }, 0.1)
    }
    //邀请
    inviteBtn() {
        AudioMg.buttonAudio();
    }
    //挑战
    challengeBtn() {
        AudioMg.buttonAudio();
    }
    //分享
    shareBtn() {
        AudioMg.buttonAudio();
    }
}
