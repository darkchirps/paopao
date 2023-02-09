import { AudioMg } from "../audio/AudioManage";
import { HashMap } from "./HashMap";
import { Utils } from "./Utils";
import gameScene from "../gameScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class voice extends cc.Component {
    mainNodes: HashMap<string, cc.Node> = new HashMap();
    start() {
        this.mainNodes = Utils.nodeTreeInfoLite(this.node);
        this.musicState();
        this.soundState();
    }

    musicState() {
        if (gameScene.Data.music) {
            this.mainNodes.get("music_on").active = true;
            this.mainNodes.get("music_off").active = false;
            this.mainNodes.get("btn_music").x = 65;
        } else {
            this.mainNodes.get("music_on").active = false;
            this.mainNodes.get("music_off").active = true;
            this.mainNodes.get("btn_music").x = 165;
        }
    }
    musicBtnClick(e, data) {
        AudioMg.buttonAudio();
        if (data == "on") {
            this.mainNodes.get("music_on").active = false;
            this.mainNodes.get("music_off").active = true;
            this.moveWay(this.mainNodes.get("btn_music"), 100);
            gameScene.Data.music = false;
            gameScene.Data.music = Utils.Clone(gameScene.Data.music);
            AudioMg.gameCloseBgm();
        } else {
            this.mainNodes.get("music_on").active = true;
            this.mainNodes.get("music_off").active = false;
            this.moveWay(this.mainNodes.get("btn_music"), -100);
            gameScene.Data.music = true;
            gameScene.Data.music = Utils.Clone(gameScene.Data.music);
            AudioMg.gamePlayBgm();
        }

    }
    soundState() {
        if (gameScene.Data.sound) {
            this.mainNodes.get("sound_on").active = true;
            this.mainNodes.get("sound_off").active = false;
            this.mainNodes.get("btn_sound").x = 65;
        } else {
            this.mainNodes.get("sound_on").active = false;
            this.mainNodes.get("sound_off").active = true;
            this.mainNodes.get("btn_sound").x = 165;
        }
    }
    soundBtnClick(e, data) {
        AudioMg.buttonAudio();
        if (data == "on") {
            this.mainNodes.get("sound_on").active = false;
            this.mainNodes.get("sound_off").active = true;
            this.moveWay(this.mainNodes.get("btn_sound"), 100);
            gameScene.Data.sound = false;
            gameScene.Data.sound = Utils.Clone(gameScene.Data.sound);
        } else {
            this.mainNodes.get("sound_on").active = true;
            this.mainNodes.get("sound_off").active = false;
            this.moveWay(this.mainNodes.get("btn_sound"), -100);
            gameScene.Data.sound = true;
            gameScene.Data.sound = Utils.Clone(gameScene.Data.sound);
        }

    }
    /**开关移动*/
    moveWay(Node: cc.Node, x: number) {
        Node.runAction(cc.moveBy(0.1, cc.v2(x, 0)));
    }

}
