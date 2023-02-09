
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("常用组件/ListSpfs")
export default class ListSpfs extends cc.Component {

  @property(cc.SpriteFrame)
  spfs: Array<cc.SpriteFrame> = [];

  idx: number = 0;
  idx1: number = 0;
  onLoad() {

  }

  getSpf(idx) {
    return this.spfs[idx];
  }

  setSpf(idx: number) {
    this.idx = idx;
    let spr = this.node.getComponent(cc.Sprite)
    if (spr) {
      spr.spriteFrame = this.spfs[idx];
    }
  }

  setSpf1(idx: number) {
    this.idx1 = idx;
    let spr = this.node.getComponent(cc.Sprite)
    if (spr) {
      spr.spriteFrame = this.spfs[idx];
    }
  }

}
