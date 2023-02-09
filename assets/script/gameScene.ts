import { AudioManager } from "./audio/Audio";
import { AudioMg } from "./audio/AudioManage";
import DataManage from "./common/DataManage";
import { HashMap } from "./common/HashMap";
import { ModuleManager } from "./common/ModuleManager";
import { Utils } from "./common/Utils";
import Util from "./game/util";
const { ccclass, property } = cc._decorator;

@ccclass
export default class gameScene extends cc.Component {
    @property(cc.SpriteFrame) rankingSprite: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) inviteSprite: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) challengeSprite: cc.SpriteFrame[] = [];
    /** 音频 */
    public static audio: AudioManager = null;
    public static module: ModuleManager = null;

    /** 数据管理类 */
    static get Data() {
        return gameScene.module.dataMg;
    }

    mainNodes: HashMap<string, cc.Node> = new HashMap();
    /** 根节点 */
    public static get rNode(): cc.Node {
        return cc.find("Canvas");
    }
    onLoad() {
        //cc.game.setFrameRate(60);
        this.mainNodes = Utils.nodeTreeInfoLite(this.node);

        gameScene.audio = new AudioManager();
        gameScene.module = new ModuleManager();
        if (gameScene.module.dataMg) {
            gameScene.module.dataMg.destory();
            gameScene.module.dataMg.unwatchTargetAll(this);
            gameScene.module.dataMg = null;
        }
        gameScene.module.dataMg = new DataManage();
        //this.node.getChildByName("loading").x = 0;
        if (!Util.chongwan) {
            if (gameScene.Data.music) {
                AudioMg.gamePlayBgm();
            } else {
                AudioMg.gameCloseBgm();
            }
        }
    }

    protected start(): void {
        this.mainNodes.get("speedNum").getComponent(cc.Label).string = (Util.speed * 100).toString();
    }

    speedBtn(e, data) {
        let d = parseInt(data);
        Util.speed = Util.speed + (d / 100);
        let a = Util.speed * 100;
        this.mainNodes.get("speedNum").getComponent(cc.Label).string = (a.toPrecision(3)).toString();
    }
}
