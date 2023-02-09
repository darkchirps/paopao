const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start() {
        cc.tween(this.node)
            .to(0, { scale: 0 })
            .to(0.3, { scale: 1.2 })
            .to(0.1, { scale: 1 })
            .parallel(
                cc.tween().by(1, { position: cc.v2(0, 60) }),
                cc.tween().to(1, { opacity: 0 })
            )
            .call(() => { this.node.destroy() })
            .start()
    }
}
