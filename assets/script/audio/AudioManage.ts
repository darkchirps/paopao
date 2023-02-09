import gameScene from "../gameScene";
export default class AudioManage {
    public static Instance = new AudioManage();

    static getInstance(): AudioManage {
        if (!AudioManage.Instance) {
            AudioManage.Instance = new AudioManage();
        }
        return AudioManage.Instance;
    }


    //暂停音乐
    pauseMusic() {
        gameScene.audio.pauseMusic();
    }
    //恢复音乐
    resumeMusic() {
        gameScene.audio.resumeMusic("");
    }
    /**播放游戏的bgm*/
    gamePlayBgm() {
        gameScene.audio.playMusic("sound/bg_music", true);
    }
    /**关闭游戏的bgm*/
    gameCloseBgm() {
        gameScene.audio.stopMusic();

    }
    /**普通按钮音效*/
    buttonAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.playEffect("sound/button");
        }
    }
    /**交换球按钮音效*/
    exchangeButtonAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.playEffect("sound/exchange");
        }
    }
    /**球发射音效*/
    shootAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.playEffect("sound/shoot");
        }
    }
    /**球撞击没有发生消除音效*/
    strikeAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.playEffect("sound/strike");
        }
    }
    /**球撞击发生消除音效*/
    eliminateAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.playEffect("sound/eliminate");
        }
    }
    /**火球音效*/
    fireAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.playEffect("sound/fire");
        }
    }
    /**关闭火球音效*/
    fireCloseAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.stopEffect("sound/fire");
        }
    }
    /**炸弹音效*/
    bombAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.playEffect("sound/bomb");
        }
    }
    /**关闭炸弹音效*/
    bombCloseAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.stopEffect("sound/bomb");
        }
    }
    /**电球音效*/
    dianAudio() {
        if (gameScene.Data.sound) {
            gameScene.audio.playEffect("sound/lightning");
        }
    }

}
/** 全局数据单例 */
export const AudioMg = AudioManage.getInstance();

