import { Utils } from "../common/Utils";
import GameViewModel from "../mvvm/GameViewModel";

export default class DataBase extends GameViewModel {

	protected specialWatch = [];

	constructor(data) {
		super(
			Object.assign(
				data,
				{
					isFirst: typeof (JSON.parse(Utils.getStorage("isFirst"))) === 'boolean' ? JSON.parse(Utils.getStorage("isFirst")) : true,
					music: typeof JSON.parse(Utils.getStorage("music")) != "boolean" ? true : JSON.parse(Utils.getStorage("music")),
					sound: typeof JSON.parse(Utils.getStorage("sound")) != "boolean" ? true : JSON.parse(Utils.getStorage("sound")),
					replay: typeof JSON.parse(Utils.getStorage("replay")) != "boolean" ? false : JSON.parse(Utils.getStorage("replay")),
					score: Number(Utils.getStorage("score")) || -1, //最高分数
				},
			)
		)
	}

	/** 是否是第一次进入 */
	public get isFirst(): boolean {
		return this.mvvm.data.isFirst;
	}
	/** 是否是第一次进入 */
	public set isFirst(val: boolean) {
		this.mvvm.data.isFirst = val;
	}
	/** 音乐开关 */
	public get music(): boolean {
		return this.mvvm.data.music;
	}
	/** 音乐开关 */
	public set music(val: boolean) {
		this.mvvm.data.music = val;
	}
	/** 音效开关 */
	public get sound(): boolean {
		return this.mvvm.data.sound;
	}
	/** 音效开关 */
	public set sound(val: boolean) {
		this.mvvm.data.sound = val;
	}
	/** 重玩开关 */
	public get replay(): boolean {
		return this.mvvm.data.replay;
	}
	/** 重玩开关 */
	public set replay(val: boolean) {
		this.mvvm.data.replay = val;
	}
	/** 重玩开关 */
	public get score(): number {
		return this.mvvm.data.score;
	}
	/** 重玩开关 */
	public set score(val: number) {
		this.mvvm.data.score = val;
	}

	/** 对mvvm.data每一个属性做简单监听
	 ** 特殊处理的放在specialWatch单独去做监听 */
	watchSingle() {
		let obj = this.mvvm.data;
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)
				&& this.specialWatch.indexOf(key) == -1) {
				this.watch(key, (val: any) => {
					Utils.setStorage(key, JSON.stringify(val))
				}, this);
			}
		}
	}


}