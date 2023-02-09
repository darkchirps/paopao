import { AudioMg } from "../audio/AudioManage";
import gameScene from "../gameScene";
import bg from "./bg";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    noReliveBtnNode: cc.Node = null;
    @property(cc.Label)
    timeDown: cc.Label = null;

    restTime: number = 10;
    currentTime: number = 0;
    _timeIndex: any;

    start() {
        this.timeDown.string = 10 + "";
        this.begainTimeDown();
    }

    begainTimeDown() {
        if (this._timeIndex) {
            clearInterval(this._timeIndex);
        }
        this._timeIndex = setInterval(() => {
            this.currentTime++;
            if (!this.timeDown) {
                if (this._timeIndex) {
                    clearInterval(this._timeIndex);
                }
            }
            this.timeDown.string = (10 - this.currentTime) + "";
            if (this.currentTime == 3) {
                this.noReliveBtnNode.active = true;
            }

            if (this.currentTime == 10) {
                //  failed
                if (this._timeIndex) {
                    clearInterval(this._timeIndex);
                }
                this.gameFailed();
            }
        }, 1000);
    }

    /** 点击复活 */
    reliveBtnClick() {
        if (this._timeIndex && (gameScene.Data.FBReward || gameScene.Data.FBRewardInter)) {
            console.log('关闭定时器');
            clearInterval(this._timeIndex);
        }
        //看广告得奖励
        this.node.destroy();
        gameScene.rNode.getChildByName("bg").getComponent(bg).ReliveSuc();
    }

    /* 不复活*/
    nothanksBtnClick() {
        this.node.destroy();
        if (this._timeIndex) {
            clearInterval(this._timeIndex);
        }
        this.gameFailed();
    }

    /** gameFailed */

    gameFailed() {

        if (this._timeIndex) {
            clearInterval(this._timeIndex);
        }
        gameScene.rNode.getChildByName("bg").getComponent(bg).addFailPage();
        this.node.destroy();
    }



    // update (dt) {}
}
