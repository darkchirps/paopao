/**
 * 音乐音效管理
 * Author      : zhljian
 * Create Time : 2017.9.4
 */
import { Utils } from "../common/Utils";
import { AudioImp } from "./AudioImp";
import AudioManage from "./AudioManage";

export class AudioManager  {
    /** 音效渐变时间 */
    public static FadeDuration: number = 0.1;

    private curMusic: any = {}; // 正在播放的音乐
    private effectDict: any = {}; // 正在播放的音效
    private todoMusicUrl: string = null;
    private _audioEngine: AudioImp = null;

    constructor() {
        let mSwitch = JSON.parse(Utils.getStorage("music"));
        let sSwitch = JSON.parse(Utils.getStorage("sound"));
        this.musicSwitch = mSwitch ? mSwitch : true;
        this.effectSwitch = sSwitch ? sSwitch : true;
    }

    public get audioEngine(): AudioImp {
        if (!this._audioEngine) {
            this._audioEngine = new AudioImp();
        }
        return this._audioEngine;
    }

    musicId: number = null;

    private _poping: boolean = false;
    set poping(val: boolean) {
        this._poping = val;
        if (this.musicSwitch) {
            this.setMusicVolume(val ? 0.3 : 1);
        }
    }

    get poping() {
        return this._poping;
    }

    /** 设置音乐音量 */
    public setMusicVolume(volume: number) {
        if (this.curMusic.id != null) {
            this.audioEngine.setVolume(this.curMusic.id, volume);
        }
    }

    AUDIO_VOLUME: number = 1;
    /** 获取音乐音量 */
    public getMusicVolume(): number {
        if (!this.musicSwitch) {
            return 0;
        }
        return this.AUDIO_VOLUME;
    }

    /** 获取音效音量 */
    public getEffectVolume(): number {
        if (!this.effectSwitch) {
            return 0;
        }
        return this.AUDIO_VOLUME;
    }

    /*** 同时设置音乐、有效开关 */
    public set musicSoundSwitch(val: boolean) {
        this.musicSwitch = val;
        this.effectSwitch = val;
    }

    /**
     * 音乐开关状态
     */
    private _musicSwitch: boolean = true;
    public set musicSwitch(val: boolean) {
        this._musicSwitch = val;
        if (val) {
            if (this.todoMusicUrl) {
                if (this.curMusic.id == null) {
                    this.playMusic(this.todoMusicUrl);
                }
            }
            let vol = this.getMusicVolume();
            this.setMusicVolume(vol);
        } else {
            this.todoMusicUrl = this.curMusic.url;
            this.setMusicVolume(0);
        }
    }
    public get musicSwitch(): boolean {
        return this._musicSwitch;
    }
    /**
     * 音效开关状态
     */
    private _effectSwitch: boolean = true;
    public set effectSwitch(val: boolean) {
        this._effectSwitch = val;
        if (val) {
            let vol = this.getEffectVolume();
            this.setEffectsVolume(vol);
        } else {
            this.setEffectsVolume(0);
        }
    }
    public get effectSwitch(): boolean {
        return this._effectSwitch;
    }

    /**
     * 播放音乐
     * @param url       音乐文件路径
     * @param loop      是否循环
     * @param volume    音乐声音
     * @return          音乐id
     */
    public playMusic(url: string, loop: boolean = true, callback: () => void = null) {
        // 背景音乐正在播放
        // if (this.curMusic.url == url && loop) {
        //     return -1;
        // }
        let play = () => {
            try {
                this.playMusicWithFade(
                    url,
                    loop,
                    this.getMusicVolume(),
                    AudioManager.FadeDuration,
                    (musicId) => {
                        this.curMusic = { id: musicId, url: url };
                    },
                    callback
                );
            } catch (e) {
                cc.warn(e);
            }
            return 0;
        };

        if (this.curMusic.id != null) {
            this.stopMusic();
        }
        cc.audioEngine.stopAll();
        play();
    }

    private playMusicWithFade(url: string, loop: boolean, volume: number, duration: number, returnId: (id) => void = null, callback: () => void = null) {
        this.audioEngine.play(url, loop, 0, (id) => {
            returnId && returnId(id);
            this.audioEngine.fade(id, 0, volume, duration, () => {
                callback && callback();
            });
        });
    }

    public stopMusicWithFade(duration: number, callback: () => void = null) {
        let id = this.curMusic.id;
        this.audioEngine.fade(id, this.getMusicVolume(), 0, duration, () => {
            callback && callback();
        });
    }

    public pauseMusictWithFade() {
        if (this.curMusic.id) {
            this.audioEngine.fade(this.curMusic.id, this.getMusicVolume(), 0, AudioManager.FadeDuration, () => {
                this.audioEngine.pause(this.curMusic.id);
                this.curMusic.paused = true;
            });
        }
    }

    public resumeMusicWithFade(url: string) {
        if (this.curMusic.id) {
            if (this.curMusic.paused) {
                this.audioEngine.resume(this.curMusic.id);
                this.audioEngine.fade(this.curMusic.id, 0, this.getMusicVolume(), AudioManager.FadeDuration);
                this.curMusic.paused = false;
            }
        } else {
            this.playMusic(url, true);
        }
    }

    /**
     * 暂停音乐
     */
    public pauseMusic() {
        if (this.curMusic.id != null) {
            this.audioEngine.pause(this.curMusic.id);
        }
    }

    /**
     * 恢复音乐
     */
    public resumeMusic(url: string) {
        if (this.curMusic.id != null) {
            this.audioEngine.resume(this.curMusic.id);
        } else if (url) {
            this.playMusic(url);
        }
    }

    /**
     * 停止音乐
     * @param cleanup   是否清楚缓存
     */
    public stopMusic() {
        this.todoMusicUrl = null;
        this.stopMusicWithFade(AudioManager.FadeDuration);
    }

    /**
     * 播放音效
     * @param url       音效文件路径
     * @param loop      是否循环
     * @param volume    音效声音
     * @return          音效id
     */
    public playEffect(url: string, loop: boolean = false, callback: (id: number) => void = null) {
        try {
            this.audioEngine.play(
                url,
                loop,
                this.getEffectVolume(),
                (effectId: number) => {
                    this.effectDict[effectId] = { id: effectId, url: url, timer: null };
                },
                (effectId) => {
                    callback && callback(effectId);
                    delete this.effectDict[effectId];
                }
            );
        } catch (e) {
            cc.warn(e);
        }
    }

    cacheAudioUrls: Array<string> = [];
    /** 播放音效 会防连点直到第一遍播完*/
    public playEffectOnce(url: string, loop: boolean = false) {
        let idx = this.cacheAudioUrls.indexOf(url);
        if (idx == -1) {
            this.cacheAudioUrls.push(url);
            this.playEffect(url, loop, () => {
                this.cacheAudioUrls.splice(idx, 1);
            });
        }
    }

    public setEffectVolume(url, volume) {
        let effectInfo = this.getEffectInfo(url);
        if (effectInfo) {
            this.audioEngine.setVolume(effectInfo.id, volume);
        }
    }

    public getEffectInfo(id) {
        for (let effectId in this.effectDict) {
            if (this.effectDict[effectId].url == id || this.effectDict[effectId].id == id) {
                return this.effectDict[effectId];
            }
        }
        return null;
    }

    /**
     * 停止音效
     * @param id        音效id或url
     * @param cleanup   是否清楚缓存
     */
    public stopEffect(id: any) {
        for (let effectId in this.effectDict) {
            let effectInfo = this.effectDict[effectId];

            if (effectInfo.id == id || effectInfo.url == id) {
                this.audioEngine.stop(effectInfo.id);
                delete this.effectDict[effectId];
            }
        }
    }

    /**
     * 停止所有音效
     * @param cleanup   是否清楚缓存
     */
    public stopAllEffects() {
        for (let effectId in this.effectDict) {
            let effectInfo = this.effectDict[effectId];

            this.audioEngine.stop(effectInfo.id);
        }
        this.effectDict = {};
    }

    /** 设置所有音效声音 */
    public setEffectsVolume(volume: number) {
        for (let effectId in this.effectDict) {
            this.audioEngine.setVolume(parseInt(effectId), volume);
        }
    }

    /** 设置一个音效的音量 */
    public setOneEffectVolume(id: number, volume: number) {
        for (let effectId in this.effectDict) {
            if (effectId == id.toString()) {
                this.audioEngine.setVolume(id, volume);
            }
        }
    }

    /**
     * 恢复所有的音乐音效
     */
    public resumeAll() {
        this.audioEngine.resumeAll();
    }

    public halfMusicVolmue() {
        if (this.curMusic.id != null) {
            this.audioEngine.setVolume(this.curMusic.id, this.getMusicVolume() / 2);
        }
    }

    public resumeMusicVolmue() {
        if (this.curMusic.id != null) {
            this.audioEngine.setVolume(this.curMusic.id, this.getMusicVolume());
        }
    }
    /**
     * 暂停所有的音乐音效
     */
    public pauseAll() {
        this.audioEngine.pauseAll();
    }

    public destroy() {
        this.stopAllEffects();
        if (this.curMusic.id) {
            this._audioEngine.stop(this.curMusic.id);
        }
        this.curMusic = null;
        this.effectDict = null;
        this._audioEngine = null;
    }
}
