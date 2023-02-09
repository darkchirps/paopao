/** 球对象 */
export interface ballObject {
    node: cc.Node,
    /**基础五色球id 1红2黄3蓝4绿5紫*/
    color: number,
    /**覆盖层球id 1单锁链 2双锁链*/
    second: number,
    /**是否访问，初始false*/
    isVisited: boolean,
    /**是否是球，初始false*/
    isBall: boolean,
    /**默认false 悬空检测用 检测附近有球则变为true */
    isLinked: boolean
}
