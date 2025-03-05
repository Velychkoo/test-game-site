var gdjs;(function(a){const h=new a.Logger("Audio manager"),f=["audio"],_={preload:!0,onplayerror:(u,e)=>h.error("Can't play an audio file: "+e),onloaderror:(u,e)=>h.error("Error while loading an audio file: "+e)},d=u=>u>1?1:u<0?0:u;class g{constructor(e,s,t,o){this._id=null;this._oncePlay=[];this._onPlay=[];this._howl=e,this._initialVolume=d(s),this._loop=t,this._rate=o}isLoaded(){return this._howl.state()==="loaded"}play(){if(this.isLoaded()){const e=this._howl.play(this._id===null?"__default":this._id);this._id=e,this._howl.volume(this._initialVolume,e),this._howl.loop(this._loop,e),this._howl.rate(a.HowlerSoundManager.clampRate(this._rate),e),this._onPlay.forEach(s=>{this.on("play",s),s(e)}),this._oncePlay.forEach(s=>s(e)),this._onPlay=[],this._oncePlay=[]}else this._howl.once("load",()=>this.play());return this}pause(){return this._id!==null&&this._howl.pause(this._id),this}stop(){return this._id!==null&&this._howl.stop(this._id),this}playing(){return(this._id!==null?this._howl.playing(this._id):!0)||!this.isLoaded()}paused(){return!this.playing()}stopped(){return this.paused()&&this.getSeek()===0}getRate(){return this._rate}setRate(e){return this._rate=e,this._id!==null&&(e=a.HowlerSoundManager.clampRate(e),this._howl.rate(e,this._id)),this}getLoop(){return this._loop}setLoop(e){return this._loop=e,this._id!==null&&this._howl.loop(e,this._id),this}getVolume(){return this._id===null?this._initialVolume:this._howl.volume(this._id)}setVolume(e){return this._initialVolume=d(e),this._id!==null&&this._howl.volume(this._initialVolume,this._id),this}getMute(){return this._id===null?!1:this._howl.mute(this._id)}setMute(e){return this._id!==null&&this._howl.mute(e,this._id),this}getSeek(){return this._id===null?0:this._howl.seek(this._id)}setSeek(e){return this._id!==null&&this._howl.seek(e,this._id),this}getSpatialPosition(e){return this._id===null?0:this._howl.pos(this._id)[e==="x"?0:e==="y"?1:2]}setSpatialPosition(e,s,t){return this._id!==null&&this._howl.pos(e,s,t,this._id),this}fade(e,s,t){return this._id!==null&&this._howl.fade(d(e),d(s),t,this._id),this}on(e,s){return e==="play"?this._id===null?this._onPlay.push(s):this._howl.on(e,s,this._id):this._id===null?this.once("play",()=>this.on(e,s)):this._howl.on(e,s,this._id),this}once(e,s){return e==="play"?this._id===null?this._oncePlay.push(s):this.playing()?s(this._id):this._howl.once(e,s,this._id):this._id===null?this.once("play",()=>this.once(e,s)):this._howl.once(e,s,this._id),this}off(e,s){return this._id!==null&&this._howl.off(e,s,this._id),this}}a.HowlerSound=g;class p{constructor(e){this._loadedMusics=new a.ResourceCache;this._loadedSounds=new a.ResourceCache;this._availableResources={};this._globalVolume=100;this._sounds={};this._cachedSpatialPosition={};this._musics={};this._freeSounds=[];this._freeMusics=[];this._pausedSounds=[];this._paused=!1;this._getAudioResource=e=>{const s=this._resourceLoader.getResource(e);return s&&this.getResourceKinds().includes(s.kind)?s:{file:e,kind:"audio",metadata:"",name:e}};this._resourceLoader=e,a.registerRuntimeScenePostEventsCallback(this._clearCachedSpatialPosition.bind(this));const s=this;document.addEventListener("deviceready",function(){document.addEventListener("pause",function(){const t=s._freeSounds.concat(s._freeMusics);for(let o in s._sounds)s._sounds.hasOwnProperty(o)&&t.push(s._sounds[o]);for(let o in s._musics)s._musics.hasOwnProperty(o)&&t.push(s._musics[o]);for(let o=0;o<t.length;o++){const i=t[o];!i.paused()&&!i.stopped()&&(i.pause(),s._pausedSounds.push(i))}s._paused=!0},!1),document.addEventListener("resume",function(){try{for(let t=0;t<s._pausedSounds.length;t++){const o=s._pausedSounds[t];o.stopped()||o.play()}}catch(t){if(t.message&&typeof t.message=="string"&&t.message.startsWith("Maximum call stack size exceeded"))console.warn("An error occurred when resuming paused sounds while the game was in background:",t);else throw t}s._pausedSounds.length=0,s._paused=!1},!1)})}getResourceKinds(){return f}static clampRate(e){return e>4?4:e<.5?.5:e}_storeSoundInArray(e,s){for(let t=0,o=e.length;t<o;++t)if(!e[t]||e[t].stopped())return e[t]=s,s;return e.push(s),s}createHowlerSound(e,s,t,o,i){const l=s?this._loadedMusics:this._loadedSounds,r=this._getAudioResource(e);let n=l.get(r);if(!n){const c=r?r.file:e;n=new Howl(Object.assign({src:[this._resourceLoader.getFullUrl(c)],html5:s,xhr:{withCredentials:this._resourceLoader.checkIfCredentialsRequired(c)},volume:0},_)),l.set(r,n)}return new a.HowlerSound(n,t,o,i)}loadAudio(e,s){const t=s?this._loadedMusics:this._loadedSounds,o=this._getAudioResource(e);t.get(o)||t.set(o,new Howl(Object.assign({src:[this._resourceLoader.getFullUrl(o.file)],html5:s,xhr:{withCredentials:this._resourceLoader.checkIfCredentialsRequired(o.file)},volume:0},_)))}unloadAudio(e,s){const t=s?this._loadedMusics:this._loadedSounds,o=this._getAudioResource(e),i=t.get(o);if(!i)return;function l(r){for(let n in r)r[n]&&r[n]._howl===i&&(r[n].stop(),delete r[n])}l(this._freeMusics),l(this._freeSounds),l(Object.values(this._musics)),l(Object.values(this._sounds)),l(this._pausedSounds),i.unload(),t.delete(o)}unloadAll(){Howler.unload(),this._freeSounds.length=0,this._freeMusics.length=0,this._sounds={},this._musics={},this._pausedSounds.length=0,this._loadedMusics.clear(),this._loadedSounds.clear()}playSound(e,s,t,o){const i=this.createHowlerSound(e,!1,t/100,s,o);this._storeSoundInArray(this._freeSounds,i),i.once("play",()=>{this._paused&&(i.pause(),this._pausedSounds.push(i))}),i.play()}playSoundOnChannel(e,s,t,o,i){this._sounds[s]&&this._sounds[s].stop();const l=this.createHowlerSound(e,!1,o/100,t,i),r=this._cachedSpatialPosition[s];r&&l.once("play",()=>{l.setSpatialPosition(...r)}),this._sounds[s]=l,l.once("play",()=>{this._paused&&(l.pause(),this._pausedSounds.push(l))}),l.play()}getSoundOnChannel(e){return this._sounds[e]||null}playMusic(e,s,t,o){const i=this.createHowlerSound(e,!0,t/100,s,o);this._storeSoundInArray(this._freeMusics,i),i.once("play",()=>{this._paused&&(i.pause(),this._pausedSounds.push(i))}),i.play()}playMusicOnChannel(e,s,t,o,i){this._musics[s]&&this._musics[s].stop();const l=this.createHowlerSound(e,!0,o/100,t,i);this._musics[s]=l,l.once("play",()=>{this._paused&&(l.pause(),this._pausedSounds.push(l))}),l.play()}getMusicOnChannel(e){return this._musics[e]||null}setSoundSpatialPositionOnChannel(e,s,t,o){const i=this.getSoundOnChannel(e);i&&!i.paused()?i.setSpatialPosition(s,t,o):this._cachedSpatialPosition[e]=[s,t,o]}_clearCachedSpatialPosition(){this._cachedSpatialPosition={}}setGlobalVolume(e){this._globalVolume=e,this._globalVolume>100&&(this._globalVolume=100),this._globalVolume<0&&(this._globalVolume=0),Howler.volume(this._globalVolume/100)}getGlobalVolume(){return this._globalVolume}clearAll(){Howler.stop(),this._freeSounds.length=0,this._freeMusics.length=0,this._sounds={},this._musics={},this._pausedSounds.length=0}async processResource(e){}async loadResource(e){const s=this._resourceLoader.getResource(e);if(!s){h.warn('Unable to find audio for resource "'+e+'".');return}if(s.file){if(this._availableResources[s.name])return;this._availableResources[s.name]=s}const t=(i,l)=>new Promise((r,n)=>{const c=l?this._loadedMusics:this._loadedSounds;c[i]=new Howl(Object.assign({},_,{src:[this._resourceLoader.getFullUrl(i)],onload:r,onloaderror:(S,w)=>n(w),html5:l,xhr:{withCredentials:this._resourceLoader.checkIfCredentialsRequired(i)},volume:0}))}),o=s.file;if(s.preloadAsMusic)try{await t(o,!0)}catch(i){h.warn("There was an error while preloading an audio file: "+i)}if(s.preloadAsSound)try{await t(o,!1)}catch(i){h.warn("There was an error while preloading an audio file: "+i)}else if(s.preloadInCache||!s.preloadAsMusic)try{await new Promise((i,l)=>{const r=new XMLHttpRequest;r.withCredentials=this._resourceLoader.checkIfCredentialsRequired(o),r.addEventListener("load",i),r.addEventListener("error",n=>l("XHR error: "+o)),r.addEventListener("abort",n=>l("XHR abort: "+o)),r.open("GET",this._resourceLoader.getFullUrl(o)),r.send()})}catch(i){h.warn("There was an error while preloading an audio file: "+i)}}dispose(){this.unloadAll()}}a.HowlerSoundManager=p,a.SoundManager=p})(gdjs||(gdjs={}));
//# sourceMappingURL=howler-sound-manager.js.map
