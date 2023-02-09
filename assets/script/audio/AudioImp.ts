
export class AudioImp {
    private tag: string = "AudioImp"

    /** 播放音乐 */
    play(url: string, loop: boolean, volume: number,returnId:(id: number) => void = null, callback: (id) => void = null) {
        cc.resources.load(url, cc.AudioClip,(err,audio:cc.AudioClip)=>{
            if (err) {
                cc.error(`[${this.tag}] play ${url} 音乐资源不存在！`);
                return;
            }
            let audioId = cc.audioEngine.play(audio,loop,volume);
            returnId && returnId(audioId);
            if(callback){
                cc.audioEngine.setFinishCallback(audioId,()=>{
                    callback && callback(audioId);
                });
            }
        }) ;
    }

    cacheAudioUrls:Array<string> = [];
    /** 播放音效 会防连点直到第一遍播完*/
    public playOnce(url:string,volume:number){
        let idx = this.cacheAudioUrls.indexOf(url);
        if(idx == -1){
            this.cacheAudioUrls.push(url);
            this.play(url,false,volume,()=>{
                this.cacheAudioUrls.splice(idx,1);
            })
        }
    }

    /** 设置音量 */
    setVolume(id: number, volume: number, callback: (id: number) => void = null) {
        cc.audioEngine.setVolume(id, volume);
        callback && callback(id);
    }

    getVolume(id: number): number {
        return cc.audioEngine.getVolume(id);
    }

    /** 停止音乐 */
    stop(id: number, callback: (id: number) => void = null) {
        cc.audioEngine.stop(id);
        callback && callback(id);
    }

    /** 声音渐变 */
    fade(id: number, from: number, to: number, duration: number, callback: () => void = null) {
        let progressFunc = (start, end, current, ratio) => {
            let vv = start + (end - start) * ratio;
            cc.audioEngine.setVolume(id, vv);
        }
        cc.tween({ volume: from })
            .to(duration, { volume: to }, { progress: progressFunc })
            .start()
            .call(() => {
                cc.log(`[${this.tag}] ${id} fade from = ${from} to = ${to} 完成 `)
                callback && callback();
            })
    }

    /** 暂停音乐 */
    pause(id: number) {
        cc.audioEngine.pause(id);
    }

    /** 恢复音乐 */
    resume(id: number) {
        cc.audioEngine.resume(id);
    }

    /** 音乐是否在播放 */
    isPlaying(id: number) {
        return cc.audioEngine.getState(id) === cc.audioEngine.AudioState.PLAYING;
    }

    pauseAll() {
        cc.audioEngine.pauseAll();
    }

    resumeAll() {
        cc.audioEngine.resumeAll();
    }
}