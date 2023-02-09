import { MVVM } from "./MVVM";

/*
 * MVVM桥接文件，提供接口的setter和getter访问
 */
export default class GameViewModel{

    protected mvvm:MVVM = null;

    constructor(data){
        this.mvvm = new MVVM();
        // 定义MVVM应该观察的数据属性
        this.mvvm.data =data;
    }

    /**
     * 观察属性变化
     * @param targetKey 观察的属性值，如果该值data当中未定义则会报错。
     * @param handler 属性变化回调，注意，调用watch方法，handler将自动执行一次。
     * @param target 观察回调对象
     */
    public watch(targetKey:string, handler:  (newvalue:any,oldvalue:any)=>void ,target :any = null ){
        return this.mvvm.watch(targetKey,handler,target)
    }
    
    /**
     * 取消data的属性变化监听
     * @param targetKey 观察的属性值
     * @param target 观察回调对象
     */
    public unwatch(targetKey:string, target:any){
        return this.mvvm.unwatch(targetKey,target)
    }

    unwatchTargetAll(target:any){
        this.mvvm.unwatchTargetAll(target);
    }

}