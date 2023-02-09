
import { Utils } from "../common/Utils";
import DataBase from "./DataBase";

export interface shareSpriteObj {
    share1: string;
    share2: string;
    share3: string;
    share4: string;
    share5: string;
}

let getShareSpriteObj = () => {
    let CurData: shareSpriteObj = {
        share1: "1",
        share2: "2",
        share3: "3",
        share4: "4",
        share5: "5",
    };
    return CurData;
};

export interface FriendObj {
    FriendId: Array<string>;
    FriendName: Array<string>;
    FriendHead: Array<string>;
}

let getFriendObjObj = () => {
    let CurData: FriendObj = {
        FriendId: [],
        FriendName: [],
        FriendHead: [],
    };
    return CurData;
};

export interface RankingObj {
    openTime: Array<number>;
    maxScore: Array<number>;
}

let getRankingObj = () => {
    let CurData: RankingObj = {
        openTime: [],
        maxScore: []
    };
    return CurData;
};

/** 全局数据单例 */
export default class DataManage extends DataBase {
    constructor() {
        super({
            FBShareSprite: Utils.getStorage("FBShareSprite") ? JSON.parse(Utils.getStorage("FBShareSprite")) : getShareSpriteObj(),
            FBUserId: Utils.getStorage("FBUserId") ? JSON.parse(Utils.getStorage("FBUserId")) : null,
            FBPlayerHead: Utils.getStorage("FBPlayerHead") ? JSON.parse(Utils.getStorage("FBPlayerHead")) : null,
            FBPause: Number(Utils.getStorage("FBPause")) || 1,
            FBReward: typeof (JSON.parse(Utils.getStorage("FBReward"))) === 'boolean' ? JSON.parse(Utils.getStorage("FBReward")) : false,
            FBRewardInter: typeof (JSON.parse(Utils.getStorage("FBRewardInter"))) === 'boolean' ? JSON.parse(Utils.getStorage("FBRewardInter")) : false,
            FBFriend: Utils.getStorage("FBFriend") ? JSON.parse(Utils.getStorage("FBFriend")) : getFriendObjObj(),
            FBRanking: Utils.getStorage("FBRanking") ? JSON.parse(Utils.getStorage("FBRanking")) : getRankingObj(),
        });
        this.watchSingle();
    }
    /** 排位的创建时间和相对应的最高分*/
    get FBRanking(): RankingObj {
        return this.mvvm.data.FBRanking;
    }
    /** 排位的创建时间和相对应的最高分*/
    set FBRanking(obj) {
        this.mvvm.data.FBRanking = obj;
    }
    /** 好友的id,name,head*/
    get FBFriend(): FriendObj {
        return this.mvvm.data.FBFriend;
    }
    /** 好友的id,name,head*/
    set FBFriend(obj) {
        this.mvvm.data.FBFriend = obj;
    }
    /** 分享图的base64数据*/
    get FBShareSprite(): shareSpriteObj {
        return this.mvvm.data.FBShareSprite;
    }
    /** 分享图的base64数据*/
    set FBShareSprite(obj) {
        this.mvvm.data.FBShareSprite = obj;
    }
    /** 用户id 用来区分是不是和本地的为同一个用户*/
    get FBUserId(): string {
        return this.mvvm.data.FBUserId;
    }
    /** 用户id 用来区分是不是和本地的为同一个用户*/
    set FBUserId(obj) {
        this.mvvm.data.FBUserId = obj;
    }
    /** 用户头像base64 */
    get FBPlayerHead(): string {
        return this.mvvm.data.FBPlayerHead;
    }
    /** 用户头像base64*/
    set FBPlayerHead(obj) {
        this.mvvm.data.FBPlayerHead = obj;
    }
    /**点击暂停 弹出分享和插屏 单分享双插屏 */
    get FBPause(): number {
        return this.mvvm.data.FBPause;
    }
    /**点击暂停 弹出分享和插屏 单分享双插屏*/
    set FBPause(obj) {
        this.mvvm.data.FBPause = obj;
    }
    //激励视频在播放前，需要做填充判断；如果无填充，改为播放激励插屏
    //如果激励插屏也没有填充，就像别的游戏一样提示用户广告还没准备好
    /**激励视频填充状态 */
    public get FBReward(): boolean {
        return this.mvvm.data.FBReward;
    }
    /**激励视频填充状态*/
    public set FBReward(val: boolean) {
        this.mvvm.data.FBReward = val;
    }
    /**激励插屏填充状态*/
    public get FBRewardInter(): boolean {
        return this.mvvm.data.FBRewardInter;
    }
    /**激励插屏填充状态*/
    public set FBRewardInter(val: boolean) {
        this.mvvm.data.FBRewardInter = val;
    }

    destory() {
        this.unwatchTargetAll(this);
    }
}
