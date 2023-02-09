import { AudioMg } from "../audio/AudioManage";
import { HashMap } from "../common/HashMap";
import { Utils } from "../common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class loading extends cc.Component {
    @property(cc.Node) loadimg: cc.Node = null;
    @property(cc.Label) load: cc.Label = null;
    @property(cc.Node) startBtn: cc.Node = null;
    private lastPercent = 0;
    mainNodes: HashMap<string, cc.Node> = new HashMap();

    start() {
        this.mainNodes = Utils.nodeTreeInfoLite(this.node);
        cc.resources.loadDir("", this.progressCallback.bind(this), this.completeCallBack.bind(this));
    }

    startBtnClick() {
        AudioMg.buttonAudio();
        this.scheduleOnce(() => {
            this.node.x = -1000;
        }, 0.15)
    }

    settingBtnClick() {
        AudioMg.buttonAudio();
        this.mainNodes.get("setting").active = true;
    }

    progressCallback(completedCount: number, totalCount: number, item: any) {
        var percent = (completedCount / totalCount) * 100;
        var finPercent = Math.floor(percent);
        if (finPercent > this.lastPercent) {
            this.lastPercent = finPercent;
        }
        this.load.string = this.lastPercent + '%';
    }

    completeCallBack(err, resources) {
        console.log("LOADING");
        this.loadimg.active = false;
        this.startBtn.active = true;
    }
}
