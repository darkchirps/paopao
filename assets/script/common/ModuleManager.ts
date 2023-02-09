
import DataManage from "./DataManage";
import { HashMap } from "../common/HashMap";
/**此脚本用于控制游戏流程，弹窗等顺序*/
export class ModuleManager {
	/** 数据管理类 */
	public dataMg: DataManage = null;
	/** 游戏内缓存资源 load后的资源无需再次加载 */
	public cacheRes: HashMap<string, cc.Asset> = new HashMap();
}
