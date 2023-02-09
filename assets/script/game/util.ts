export default class Util {
    //屏幕宽
    public static readonly SCREEN_W: number = 715;
    public static readonly BUBBLE_R: number = 32.5;
    /** Y 方向偏差为 40 倍根号 3 */
    public static readonly BUBBLE_Y: number = 32.5 * Math.sqrt(3);

    /** 传入二维数组行列，返回泡泡对应位置坐标 */
    public static RowColToPos(row: number, col: number): cc.Vec3 {
        // 奇数行前方少一个半径宽
        // 如果为偶数行 row % 2 = 0;
        let posX: number = this.BUBBLE_R * ((row % 2) + 1) + col * this.BUBBLE_R * 2;
        let posY: number = (this.BUBBLE_R + row * this.BUBBLE_Y);
        return cc.v3(posX + 2.5, posY);
    }
    /**  传入泡泡对应位置坐标，返回二维数组行列 */
    public static PosToRowCol(posX: number, posY: number) {
        //奇数行前方少一个半径
        if (posX >= this.SCREEN_W) posX = 710;
        if (posX <= 2.5) posX = 10;
        posX = posX - 2.5;
        let row: number = Math.round((posY - this.BUBBLE_R) / this.BUBBLE_Y);
        let col: number = Math.round((posX - this.BUBBLE_R * ((row % 2) + 1)) / (this.BUBBLE_R * 2));
        if (row % 2 != 0) {
            if (col == -1) col = 0
            if (col == 10) col = 9
        }
        return cc.v3(row, col);
    }
    /**取商*/
    public static mathQuotient(a: number, b: number): number {
        return Math.trunc(a / b);
    }
    /**取余*/
    public static mathSurplus(a: number, b: number): number {
        return a % b;
    }

    /** 随机数 min - max */
    public static randNum(min: number, max: number): number {
        //包括 min, max
        return min + Math.floor((max - min + 1) * Math.random());
    }

    /**随机数,指定范围和个数 min取不到*/
    public static randNum2(min, max, num) {
        if (num > max - min) {
            return false;
        }
        var range = max - min,
            minV = min + 1, //实际上可以取的最小值
            arr = []
        function GenerateANum(i) {
            for (i; i < num; i++) {
                var rand = Math.random(); //  rand >=0  && rand < 1
                let tmp = Math.floor(rand * range + minV);

                if (arr.indexOf(tmp) == -1) {
                    arr.push(tmp)
                } else {
                    GenerateANum(i);
                    break;
                }
            }
        }
        GenerateANum(0);
        return arr;
    }

    /**Texture2D转base64*/
    public static getShareBase64(width: number, height: number, name): any {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;  //宽高看需求
        canvas.height = height;
        let texture = name.getTexture();
        let image = texture.getHtmlElementObj();
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL('image/png');
    }
    /**base64转spriteFarme且返回其*/
    public static Base64SpriteFarme(event: string) {
        let iconData = event;
        var playerImage = new Image();
        playerImage.crossOrigin = 'anonymous';
        playerImage.src = iconData;
        let texture = new cc.Texture2D();
        texture.initWithElement(playerImage);
        let spriteFarme = new cc.SpriteFrame();
        spriteFarme.setTexture(texture);
        return spriteFarme;
    }

    /*--------------------------------------------------------------------------------------------------*/

    /**是否处于射击状态 true是 如果是则会避免其他碰撞和再次射击*/
    public static shooting: boolean = false;
    /**是否已经点击过屏幕发射过球 true是 则地图开始掉落*/
    public static shooted: boolean = false;
    /**屏幕触摸中*/
    public static touching: boolean = false;

    /**使用了火球 使用完毕要悬空检测*/
    public static useFireBall: boolean = false;
    /**连击数*/
    public static count: number = 0;
    /**得分=5+连击数*5 */
    public static score: number = 0;

    /**游戏是否结束*/
    public static gameOver: boolean = false;
    /**游戏是否暂停*/
    public static gamePause: boolean = false;
    /**开启死亡线*/
    public static warning: boolean = false;
    /**最底下球距离死亡线多少开启死亡线*/
    public static warningY: number = 100;

    /**屏幕高度*/
    public static ScreenH: number = 0;
    /**屏幕宽度*/
    public static ScreenW: number = 0;
    /**相差高度一半*/
    public static XH: number = 0;


    /**基础球打到顶端 直接消失且直接生成下一个球*/
    public static topBall: boolean = false;
    /**降落速度*/
    public static speed: number = 0.6;
    /**ball数组初始总长度*/
    public static ballLength: number = 41;
    /**剩余排数*/
    public static surplusRow: number = 0;

    /**指示线的长度*/
    public static lineLength: number = 1000;
    /**指示线的长度1*/
    public static lineLength1: number = 1000;
    /**指示线的长度2*/
    public static lineLength2: number = 1000;

    /**复活次数*/
    public static reliveNum: number = 0;
    /**复活提升的高度*/
    public static reliveH: number = -400;

    /**复活中*/
    public static reliveIng: boolean = false;

    /**进游戏*/
    public static playGame: boolean = false;
    /**重玩*/
    public static chongwan: boolean = false;
    /** 是否开启中间空多了 然后速度变快逻辑 默认关闭*/
    public static moveOpen: boolean = true;
    /**清除数据 */
    public static clearData() {
        Util.shooting = false;
        Util.shooted = false;
        Util.touching = false;

        Util.useFireBall = false;
        Util.count = 0;
        Util.score = 0;

        Util.gameOver = false;
        Util.gamePause = false;
        Util.warning = false;

        Util.topBall = false;
        Util.speed = 0.38;
        Util.ballLength = 41;
        Util.surplusRow = 0;

        Util.lineLength = 1000;
        Util.lineLength1 = 1000;
        Util.lineLength2 = 1000;

        Util.reliveNum = 0;
        Util.testGm = false;
    }

    //刚体及其碰撞Tag说明
    //Tag=0 普通用处 发生刚体效果或者碰撞效果
    //Tag=1 顶端+一个球的直径 火球 炸弹 彩球 及其发射球 碰到直接消失
    /**测试功能 true开启测试*/
    public static testGm: boolean = false;

}
