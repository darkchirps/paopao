import { AudioMg } from "../audio/AudioManage";
import { HashMap } from "../common/HashMap";
import { Utils } from "../common/Utils";
import Util from "../game/util";
import gameScene from "../gameScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class failPage extends cc.Component {
    @property(cc.Node) item: cc.Node[] = [];
    @property(cc.SpriteAtlas) robotHead: cc.SpriteAtlas = null
    //0-19包括0
    public FBRobotName = ["Jacky", "Pony", "Andy", "Leon", "Jay", "Felix", "Lisa", "Rose", "Tom",
        "Mike", "Mark", "Bill", "Cindy", "Chris", "Ken", "Elsa", "Harry", "Jim", "Linda", "Nancy"]

    mainNodes: HashMap<string, cc.Node> = new HashMap();

    protected start(): void {

        this.mainNodes = Utils.nodeTreeInfoLite(this.node);
        let score = gameScene.Data.score;
        this.mainNodes.get("failDefen").getComponent(cc.Label).string = score.toString();
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
