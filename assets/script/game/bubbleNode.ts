import ball from "../prefab/ball";
import ListSpfs from "../common/ListSpfs";
import { ballObject } from "./interface";
import shoot from "./shoot";
import Util from "./util";
import { AudioMg } from "../audio/AudioManage";
const { ccclass, property } = cc._decorator;
@ccclass
export default class bubbleNode extends cc.Component {
    /** count */
    @property(cc.Node) comboPage: cc.Node = null;
    /** 分数 */
    @property(cc.Label) defen: cc.Label = null;
    /** shoot */
    @property(cc.Node) shoot: cc.Node = null;
    /** 分数预制体 */
    @property(cc.Prefab) score: cc.Prefab = null;
    /** 测试地图 */
    @property(cc.JsonAsset) mapDataTest: cc.JsonAsset = null;
    /** 地图数据 */
    @property(cc.JsonAsset) mapData: cc.JsonAsset[] = [];
    /** 地图中球预制体 */
    @property(cc.Prefab) ballPre: cc.Prefab = null;

    /** 装载场景中所有泡泡，注意 s 这是二维数组 */
    public ballArray: ballObject[][] = [];
    /** 复用地图数据，注意 s 这是二维数组 */
    public ballArraySec: ballObject[][] = [];

    /** 根据数据初始化生成地图*/
    public init(): void {
        // 获取到关卡数据
        let data: [][];
        if (Util.testGm) {
            data = this.mapDataTest.json["data"];
        } else {
            let a = Util.randNum(0, 1);
            if (a == 0) {
                data = this.mapData[0].json["data"];
            } else {
                data = this.mapData[2].json["data"];
            }
        }
        Util.ballLength = data.length;
        for (let row = 0; row < data.length; row++) {
            this.ballArray[row] = [];
            for (let col = 0; col < data[row].length; col++) {
                let Pre = cc.instantiate(this.ballPre);
                let pos = Util.RowColToPos(row, col);
                Pre.getComponent(ball).init(this, pos, data[row][col]);
                let color = data[row][col];

                let obj: ballObject = Object.create(null);
                obj.node = Pre;
                obj.color = Util.mathSurplus(color, 10);
                obj.second = Util.mathQuotient(color, 10);
                obj.isVisited = false;
                obj.isLinked = false;
                if (obj.color == 0) {
                    obj.isBall = false;
                } else {
                    obj.isBall = true;
                }
                this.ballArray[row][col] = obj;
            }
        }
    }

    /**连击显示*/
    comboShow() {
        this.comboPage.getChildByName("countNum").getComponent(cc.Label).string = Util.count.toString();
        this.comboPage.runAction(
            // 渐隐下落
            cc.sequence(
                cc.scaleTo(0.3, 0.7),
                cc.scaleTo(0.7, 0.7),
                cc.fadeOut(0.7),
                cc.scaleTo(0.1, 0),
                cc.fadeTo(0.1, 255),
            )
        );
    }

    /** 检查球消除 5种普通球发射触发*/
    mapColor(index, color): void {
        if (this.dianBallRemove) {
            this.mapDian();
        } else {
            //检测消除的方法
            let test: Function = (row: number, col: number, color: number) => {
                //获取泡泡数据
                let b: ballObject = this.ballArray[row][col];
                //如果被访问过
                if (!this.ballArray[row] || !this.ballArray[row][col]) return;
                if (b.isVisited || !b.isBall) return;
                //如果颜色不同
                if (b.color !== color) return;
                b.isVisited = true;
                //根据不同的行做偏移
                test(row - 1, col, color);
                test(row, col - 1, color);
                test(row, col + 1, color);
                test(row + 1, col, color);
                if (row % 2 == 0) {
                    test(row - 1, col - 1, color);
                    test(row + 1, col - 1, color);
                } else {
                    test(row - 1, col + 1, color);
                    test(row + 1, col + 1, color);
                }
            }
            //执行
            test(index.x, index.y, color);
            //看看有几个相同的
            let count: number = 0;
            //记录消除行列值
            let record: cc.Vec2[] = [];
            for (let row = this.ballArray.length - 1; row > 0; row--) {
                for (let col = 0; col < this.ballArray[row].length; col++) {
                    if (!this.ballArray[row][col]) continue;
                    if (this.ballArray[row][col].color == 0) continue;
                    if (this.ballArray[row][col].isVisited) {
                        //记录要进行消除的泡泡的行列值
                        count++;
                        record.push(cc.v2(row, col));
                    }
                }
            }
            //相连球大于3，且不包含污渍的相连大于3
            if (count >= 3) {
                Util.count++;
                this.comboShow();
                let num: number = 0;
                //执行消除
                for (let i in record) {
                    num++;
                    this.scheduleOnce(() => {
                        AudioMg.eliminateAudio();
                    }, num / count / 2.8)
                    //获取到该位置泡泡，进行消除
                    let b = this.ballArray[record[i].x][record[i].y];
                    if (b.second == 0) {
                        b.isVisited = false;
                        b.second = 0;
                        b.isBall = false;
                        b.node.getComponent(ball).playDeathAnimation(b.color);
                        this.scheduleOnce(() => {
                            b.color = 0;
                        }, 0.2)
                        b.node.getComponent(ball).removeSelf();
                    }
                    if (b.second == 1) {//一级锁链 add2
                        b.node.getChildByName("suo").active = true;
                        b.node.getChildByName("suo").getComponent(sp.Skeleton).setAnimation(0, "add2", false);
                        this.scheduleOnce(() => {
                            b.isVisited = false;
                            b.second = 0;
                            b.node.getChildByName("2").getComponent(ListSpfs).setSpf1(0);
                            b.node.getChildByName("suo").active = false;
                        }, 0.2)
                    }
                    if (b.second == 2) { //二级锁链 add
                        b.node.getChildByName("suo").active = true;
                        b.node.getChildByName("suo").getComponent(sp.Skeleton).setAnimation(0, "add", false);
                        this.scheduleOnce(() => {
                            b.isVisited = false;
                            b.second = 1;
                            b.node.getChildByName("2").getComponent(ListSpfs).setSpf1(1);
                            b.node.getChildByName("suo").active = false;
                        }, 0.2)
                    }
                    this.showscore(b.node);
                }
            } else {
                Util.count = 0;
                AudioMg.strikeAudio();
                for (let i in record) {
                    let b = this.ballArray[record[i].x][record[i].y];
                    b.isVisited = false;
                }
            }
            this.scheduleOnce(this.emptyDetection, 0.4);
        }
    }


    /**中间空了很多后 下降速度变快，一定位置后恢复*/
    moveMapData() {
        //shoot节点
        let a = this.shoot.convertToWorldSpaceAR(cc.v2(0, 0));
        let LeastRow = this.getLeastRow();
        //最下一排的node
        let v = this.ballArray[LeastRow][0].node;
        let b = v.convertToWorldSpaceAR(cc.v2(0, 0));
        if (a.y + 500 < b.y) {
            Util.speed = 3;
        }
    }

    /**悬空检测*/
    emptyDetection(): void {
        this.dianBallRemove = false;
        this.scheduleOnce(() => {
            this.addRowData();
        }, 0.5)
        let test: Function = (row: number, col: number) => {
            //从刚刚加入的泡泡为起点,递归寻找相连的
            if (!this.ballArray[row] || !this.ballArray[row][col]) return;
            if (this.ballArray[row][col].color == 0) return;
            let b = this.ballArray[row][col];
            if (b.isVisited) return;
            // 符合条件
            b.isVisited = true;
            b.isLinked = true;
            test(row - 1, col);
            test(row, col - 1);
            test(row, col + 1);
            test(row + 1, col);
            if (row % 2 == 0) {
                test(row - 1, col - 1);
                test(row + 1, col - 1);
            } else {
                test(row - 1, col + 1);
                test(row + 1, col + 1);
            }
        }
        let leng = this.ballArray.length;
        let length: number = 0;
        if (leng % 2 === 0) {
            length = 10;
        } else {
            length = 11;
        }
        // 执行
        for (let i = 0; i < length; i++) {
            // 执行最上的一排泡泡
            if (this.ballArray[leng - 1][i].color == 0) continue;
            test(this.ballArray.length - 1, i);
        }
        // 局部标志，是否执行过下落
        for (let row = 0; row < this.ballArray.length; row++) {
            for (let col = 0; col < this.ballArray[row].length; col++) {
                let b = this.ballArray[row][col];
                if (!b.isLinked && b.color != 0) {
                    b.node.getComponent(ball).playDownAnimation(cc.v2(row, col));
                    b.color = 0;
                    b.second = 0;
                    b.isBall = false;
                    this.showscore(b.node);
                }
                this.scheduleOnce(() => {
                    b.isVisited = false;
                    b.isLinked = false;
                }, 0.4)
            }
        }
        this.shoot.getComponent(shoot).initShoot();
        this.moveMapData();
    }

    /*————————————————————————————————————————— 电球逻辑 ——————————————————————————————————————————*/
    dianBallRemove: boolean = false;
    dianBallPos = cc.v2(0, 0);
    /**判断是电球*/
    examineDian(rowS, colS) {
        if (!this.ballArray[rowS] || !this.ballArray[rowS][colS]) return;
        if (this.ballArray[rowS][colS].color == 7) {
            this.dianBallRemove = true;
            this.dianBallPos.x = rowS;
            this.dianBallPos.y = colS;
        }
    }
    /**获取周围有无电球*/
    getDianBall(index) {
        let row = index.x;
        let col = index.y;
        this.examineDian(row + 1, col);
        this.examineDian(row, col - 1);
        this.examineDian(row, col + 1);
        this.examineDian(row - 1, col);
        if (row % 2 == 0) {
            this.examineDian(row - 1, col - 1);
            this.examineDian(row + 1, col - 1);
        } else {
            this.examineDian(row - 1, col + 1);
            this.examineDian(row + 1, col + 1);
        }
    }
    /**电球消除逻辑*/
    mapDian() {
        let selfPox = this.dianBallPos;
        let b = this.ballArray[selfPox.x][selfPox.y];
        let self = Util.RowColToPos(selfPox.x, selfPox.y);
        let animPos = b.node.convertToNodeSpaceAR(cc.v2(360, self.y));

        b.node.zIndex = 100;
        let anim = b.node.getChildByName('ani');
        anim.x = animPos.x;
        var deathAnimationFinish = function () {
            anim.getComponent(cc.Sprite).spriteFrame = null;
        };
        anim.getComponent(cc.Animation).on('finished', deathAnimationFinish, this);
        anim.getComponent(cc.Animation).play("dianAni");
        Util.count++;
        for (let col = 0; col < this.ballArray[selfPox.x].length; col++) {
            let ba = this.ballArray[selfPox.x][col];
            if (ba.color != 0) {
                ba.isVisited = false;
                ba.second = 0;
                ba.isBall = false;
                ba.color = 0;
                ba.node.getComponent(ball).removeDian();
                this.showscore(ba.node);
            }
        }
        AudioMg.dianAudio();
        this.scheduleOnce(this.emptyDetection, 0.3);
    }

    /*————————————————————————————————————————— 彩球逻辑 ——————————————————————————————————————————*/
    /**彩球检测消除
     * 数组位 自己颜色 地图球颜色
     * 消除十排内碰撞的颜色color1
    */
    mapCaiqiu(index) {
        AudioMg.eliminateAudio();
        //彩球撞电球
        if (this.dianBallRemove) {
            this.mapDian();
        } else {
            //检测消除的方法
            let test: Function = (row: number, col: number, color: number) => {
                //获取泡泡数据
                //如果被访问过
                if (!this.ballArray[row] || !this.ballArray[row][col]) return;
                let b = this.ballArray[row][col];
                if (b.isVisited || !b.isBall || b.color == 0) return;
                //如果颜色不同
                if (b.color !== color) return;
                //符合条件
                b.isVisited = true;
                if (row % 2 == 0) {
                    test(row - 1, col - 1, color);
                    test(row - 1, col, color);
                    test(row, col - 1, color);
                    test(row, col + 1, color);
                    test(row + 1, col - 1, color);
                    test(row + 1, col, color);
                } else {
                    test(row - 1, col, color);
                    test(row - 1, col + 1, color);
                    test(row, col - 1, color);
                    test(row, col + 1, color);
                    test(row + 1, col, color);
                    test(row + 1, col + 1, color);
                }
            }
            //执行
            this.ballArray[index.x][index.y].isVisited = true;
            let row = index.x;
            let col = index.y;
            //根据不同的行做偏移
            if (row % 2 == 0) {
                if (col == 0) {
                    test(row - 1, col, this.ballArray[row - 1][col].color);
                    test(row, col + 1, this.ballArray[row][col + 1].color);
                    test(row + 1, col, this.ballArray[row + 1][col].color);
                } else if (col == 10) {
                    test(row - 1, col - 1, this.ballArray[row - 1][col - 1].color);
                    test(row, col - 1, this.ballArray[row][col - 1].color);
                    test(row + 1, col - 1, this.ballArray[row + 1][col - 1].color);
                } else {
                    test(row - 1, col - 1, this.ballArray[row - 1][col - 1].color);
                    test(row - 1, col, this.ballArray[row - 1][col].color);
                    test(row, col - 1, this.ballArray[row][col - 1].color);
                    test(row, col + 1, this.ballArray[row][col + 1].color);
                    test(row + 1, col - 1, this.ballArray[row + 1][col - 1].color);
                    test(row + 1, col, this.ballArray[row + 1][col].color);
                }
            } else {
                test(row - 1, col, this.ballArray[row - 1][col].color);
                test(row - 1, col + 1, this.ballArray[row - 1][col + 1].color);
                test(row + 1, col, this.ballArray[row + 1][col].color);
                test(row + 1, col + 1, this.ballArray[row + 1][col + 1].color);
                if (col == 0) {
                    test(row, col + 1, this.ballArray[row][col + 1].color);
                } else if (col == 9) {
                    test(row, col - 1, this.ballArray[row][col - 1].color);
                } else {
                    test(row, col - 1, this.ballArray[row][col - 1].color);
                    test(row, col + 1, this.ballArray[row][col + 1].color);
                }
            }
            //看看有几个相同的
            let count: number = 0;
            //记录消除行列值
            let record: cc.Vec2[] = [];
            for (let row = 0; row < this.ballArray.length; row++) {
                for (let col = 0; col < this.ballArray[row].length; col++) {
                    let b = this.ballArray[row][col];
                    if (b.color == 0) continue;
                    if (this.ballArray[row][col].isVisited) {
                        this.ballArray[row][col].isVisited = false;
                        count++;
                        //记录要进行消除的泡泡的行列值
                        record.push(cc.v2(row, col));
                    }
                }
            }
            if (count >= 1) {
                Util.count++;
                //执行消除
                for (let i in record) {
                    //获取到该位置泡泡，进行消除
                    let b = this.ballArray[record[i].x][record[i].y]
                    this.showscore(b.node);
                    b.isVisited = false;
                    b.second = 0;
                    b.isBall = false;
                    b.node.getComponent(ball).playDeathAnimation(b.color);
                    this.scheduleOnce(() => {
                        b.color = 0;
                    }, 0.15)
                    this.scheduleOnce(() => {
                        b.node.getComponent(ball).removeSelf();
                    }, 0.15)
                }
                //启动悬空检测
                this.scheduleOnce(this.emptyDetection, 0.2);
            }
        }
    }
    /*————————————————————————————————————————— 炸弹逻辑 ——————————————————————————————————————————*/
    /**炸弹消除*/
    openzhadan(x, y) {
        //爆炸动画快完再消除
        if (!this.ballArray[x] || !this.ballArray[x][y]) return;
        if (this.ballArray[x][y].color != 0) {
            this.showscore(this.ballArray[x][y].node);
            let b = this.ballArray[x][y];
            if (b.color != 0) {
                b.color = 0;
                b.node.getComponent(ball).removeSelf("bomb");
                b.isVisited = false;
                b.second = 0;
                b.isBall = false;
            }
        }
    }
    //消除周围两圈球
    /** 炸弹检测消除*/
    mapBomb(index): void {
        Util.count++;
        this.comboShow();
        let x = index.x;
        let y = index.y;
        //根据不同的行做偏移
        this.openzhadan(x - 2, y - 1);
        this.openzhadan(x - 2, y);
        this.openzhadan(x - 2, y + 1);
        this.openzhadan(x - 1, y - 1);
        this.openzhadan(x - 1, y);
        this.openzhadan(x - 1, y + 1);
        this.openzhadan(x, y - 2);
        this.openzhadan(x, y - 1);
        this.openzhadan(x, y + 1);
        this.openzhadan(x, y + 2);
        this.openzhadan(x + 1, y - 1);
        this.openzhadan(x + 1, y);
        this.openzhadan(x + 1, y + 1);
        this.openzhadan(x + 2, y - 1);
        this.openzhadan(x + 2, y);
        this.openzhadan(x + 2, y + 1);
        if (x % 2 == 0) {
            this.openzhadan(x + 1, y - 2);
            this.openzhadan(x - 1, y - 2);
        } else {
            this.openzhadan(x + 1, y + 2);
            this.openzhadan(x - 1, y + 2);
        }
        this.scheduleOnce(this.emptyDetection, 0.4);
    }


    /**在泡泡消除时显示得分 */
    showscore(event) {
        let sum = Util.count * 5 + 5;
        var score = cc.instantiate(this.score);
        this.node.addChild(score);
        score.position = event.position;
        score.getChildByName("add").getComponent(cc.Label).string = sum + "";
        Util.score = parseInt(this.defen.string) + sum;
        this.defen.string = Util.score.toString();
    }

    /**获取发射球 */
    getsecond() {
        let b = this.getLeastRow();
        //最底下颜色
        let num = [];
        for (let col = 0; col < this.ballArray[b].length; col++) {
            let color = this.ballArray[b][col].color;
            if (color != 0 && color < 6) {
                if (num.length == 0) {
                    num.push(color);
                } else {
                    let numColor = 0;
                    for (let i = 0; i < num.length; i++) {
                        if (num[i] != color) {
                            numColor++;
                        }
                    }
                    if (numColor == num.length) {
                        num.push(color);
                    }
                }
            }
        }
        let suiji = Util.randNum(1, 10);

        if (num.length == 0) {
            return Util.randNum(1, 5);
        }
        if (Util.score < 50) {
            return num[Util.randNum(0, num.length - 1)];
        } else if (Util.score < 5000) {
            if (suiji <= 1) {
                return Util.randNum(1, 5);
            }
        } else if (Util.score < 15000) {
            if (suiji <= 2) {
                return Util.randNum(1, 5);
            }
        } else if (Util.score < 25000) {
            if (suiji <= 3) {
                return Util.randNum(1, 5);
            }
        } else if (Util.score < 35000) {
            if (suiji <= 4) {
                return Util.randNum(1, 5);
            }
        } else {
            if (suiji <= 5) {
                return Util.randNum(1, 5);
            }
        }
        return num[Util.randNum(0, num.length - 1)];
    }

    /**获取最底下一排为数组第几排 从0开始*/
    getLeastRow() {
        let a, b = 0;
        for (let row = 0; row < this.ballArray.length; row++) {
            a = 0;
            for (let col = 0; col < this.ballArray[row].length; col++) {
                if (this.ballArray[row][col].color != 0) {
                    a++;
                }
                if (a != 0) {
                    if (b == 0) b = row;
                }
            }
        }
        return b;
    }

    /**获取剩余排数*/
    getRow(): number {
        let RowNum: number = 0;
        for (let row = 0; row < this.ballArray.length; row++) {
            let a = 0;
            for (let col = 0; col < this.ballArray[row].length; col++) {
                let b = this.ballArray[row][col];
                if (b.color == 0) {
                    a++;
                }
                if (a >= this.ballArray[row].length) {
                    RowNum++;
                    break;
                }
            }
        }
        return Util.ballLength - RowNum;
    }
    /**地图mapData组 id 
     * 第一份 41排 后面9份每份都是18排
     * 第一份地图数据前10排得空着 即数据为0 
    */
    /**增加排数*/
    addRowData() {
        Util.surplusRow = this.getRow();
        //剩余排数小于30排 加图
        if (Util.surplusRow < 30) {
            //前面1张用完后 则开始随机取后面9张的1张
            let rand = Util.randNum(0, 1);
            let mapNum;
            if (rand == 0) {
                mapNum = 1;
            } else {
                mapNum = 3;
            }
            Util.surplusRow += this.mapData[mapNum].json["data"].length;
            Util.ballLength = Util.ballLength + this.mapData[mapNum].json["data"].length;
            let leng = this.ballArray.length;
            let data: [][] = this.mapData[mapNum].json["data"];
            for (let row = 0; row < data.length; row++) {
                this.ballArraySec[row] = [];
                for (let col = 0; col < data[row].length; col++) {
                    let Pre = cc.instantiate(this.ballPre);
                    let pos = Util.RowColToPos(row + leng, col);
                    Pre.getComponent(ball).init(this, pos, data[row][col]);
                    let color = data[row][col];

                    let obj: ballObject = Object.create(null);
                    obj.node = Pre;
                    obj.color = Util.mathSurplus(color, 10);
                    obj.second = Util.mathQuotient(color, 10);
                    obj.isVisited = false;
                    obj.isLinked = false;
                    if (obj.color == 0) {
                        obj.isBall = false;
                    } else {
                        obj.isBall = true;
                    }
                    this.ballArraySec[row][col] = obj;
                }
            }
            var al = this.ballArray.concat(this.ballArraySec);
            this.ballArray = al;
        }
    }

    protected update(dt: number): void {
        if (Util.useFireBall) {//使用了火球后悬空检测一次
            Util.count++;
            this.comboShow();
            Util.useFireBall = false;
            this.scheduleOnce(() => {
                this.emptyDetection();
            }, 0.1)
        }
        if (Util.topBall) {
            Util.topBall = false;
            this.shoot.getComponent(shoot).initShoot();
        }
    }
}
