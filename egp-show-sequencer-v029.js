/* EGP Show Sequencer V0.29 — isolated visual editor, no DMX output */
(()=>{
'use strict';
const el=id=>document.getElementById(id);
const consoleEl=el('egpShowConsole'), stage=el('stagePage');
if(!consoleEl||!stage||el('egpSeq29'))return;
const css=document.createElement('style');css.id='egpSeq29Style';css.textContent=`
body.egp-show-mode #egpShowConsole,body.egp-show-mode #egpPresetStrip,body.egp-show-mode #egpFixturePicker,body.egp-show-mode #egpPresetModal{display:none!important}
body.egp-show-mode #stagePage .center{display:flex!important;flex-direction:column!important}
body.egp-show-mode #stagePage .canvasbox{order:1!important;flex:1 1 0!important;min-height:100px!important;width:100%!important}
body.egp-show-mode #egpSeq29{display:flex!important}
#egpSeq29{display:none;order:2;flex:0 0 clamp(240px,37dvh,420px);box-sizing:border-box;min-height:0;background:#0a111d;border-top:1px solid #35455e;color:#e8f1ff;flex-direction:column;font:12px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;user-select:none;overflow:hidden}
#egpSeq29 *{box-sizing:border-box}
#egpSeq29 .egp29bar{height:45px;flex:none;display:flex;align-items:center;gap:8px;padding:6px 14px;border-bottom:1px solid #263447;background:#101c2b}
#egpSeq29 button{border:1px solid #39516b;background:#192c41;color:#eaf4ff;border-radius:7px;min-width:66px;height:31px;font:650 12px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;cursor:pointer}
#egpSeq29 button:disabled{opacity:.35;cursor:default}
#egpSeq29 #egp29Play{background:#0a7770;border-color:#0dada1}
#egpSeq29 #egp29Time{margin-left:auto;font:650 13px ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums;color:#9eebdc}
#egpSeq29 .egp29trackarea{flex:1;min-height:0;overflow:hidden;position:relative;touch-action:none;cursor:crosshair}
#egpSeq29 canvas{display:block;width:100%;height:100%;touch-action:none}
#egpSeq29 .egp29scroll{height:13px;flex:none;overflow-x:auto;overflow-y:hidden;background:#101b29}
#egpSeq29 .egp29scroll div{height:1px}
#egpSeq29 .egp29trackarea:focus-visible{outline:2px solid #4de5d2;outline-offset:-2px}
@media(max-width:600px){#egpSeq29{flex-basis:42dvh}#egpSeq29 .egp29bar{padding:5px 7px;gap:4px}#egpSeq29 button{min-width:51px;height:30px;font-size:11px}#egpSeq29 #egp29Time{font-size:10px}}
`;document.head.appendChild(css);
const root=document.createElement('section');root.id='egpSeq29';root.innerHTML=`<div class="egp29bar"><button id="egp29Play" title="Play/Pausa · Espacio">▶ Play</button><button id="egp29Stop" title="Stop">■ Stop</button><button id="egp29Undo" title="Undo · ⌘Z" disabled>↶ Undo</button><button id="egp29Redo" title="Redo · ⇧⌘Z" disabled>↷ Redo</button><span id="egp29Time">00:00.000</span></div><div id="egp29Area" class="egp29trackarea" tabindex="0"><canvas id="egp29Canvas"></canvas></div><div id="egp29Scroll" class="egp29scroll"><div id="egp29ScrollContent"></div></div>`;
const center=stage.querySelector('.center');if(!center)return;
center.append(root);
const area=el('egp29Area'),canvas=el('egp29Canvas'),ctx=canvas.getContext('2d'),scr=el('egp29Scroll');
let audio=null,loadingAudio=false,peakMin=null,peakMax=null,peakStep=64,seconds=180,pxs=85,origin=0,playSec=0,raf=null,notes=[],past=[],future=[],drag=null,prevText='',lastFrame=performance.now();
const gutter=84;const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const fmt=s=>{s=Math.max(0,s||0);const m=Math.floor(s/60),sec=Math.floor(s%60),ms=Math.floor((s-Math.floor(s))*1000);return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')+'.'+String(ms).padStart(3,'0')};
const getW=()=>canvas.getBoundingClientRect().width;const getH=()=>canvas.getBoundingClientRect().height;
const visible=()=>Math.max(.1,(getW()-gutter)/pxs);
function limit(){origin=clamp(origin,0,Math.max(0,seconds-visible()))}
function scrollSync(){const total=Math.max(1,seconds*pxs);el('egp29ScrollContent').style.width=(total+gutter)+'px';if(Math.abs(scr.scrollLeft-origin*pxs)>2)scr.scrollLeft=origin*pxs;}
function draw(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;const dpr=Math.min(2,devicePixelRatio||1),w=r.width,h=r.height;if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#0b1523';ctx.fillRect(0,0,w,h);
const top=29,audioTop=top,audioBottom=Math.min(h-85,top+Math.max(75,(h-top)*.55)),midiTop=audioBottom+1,midiBottom=h;
ctx.fillStyle='#112234';ctx.fillRect(0,0,w,top);ctx.fillStyle='#0b1e2a';ctx.fillRect(0,audioTop,w,audioBottom-audioTop);ctx.fillStyle='#11192b';ctx.fillRect(0,midiTop,w,midiBottom-midiTop);
const step=pxs<20?10:pxs<45?5:pxs<100?2:pxs<220?1:pxs<450?.5:.25;const t0=Math.floor(origin/step)*step;
ctx.font='11px ui-monospace,SFMono-Regular,Menlo,monospace';ctx.textBaseline='middle';for(let t=t0;t<=Math.min(seconds,origin+visible()+step);t+=step){const x=gutter+(t-origin)*pxs;if(x<gutter-1||x>w+1)continue;const major=(Math.round(t/step)%5===0);ctx.strokeStyle=major?'#314458':'#203042';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(Math.round(x)+.5,top);ctx.lineTo(Math.round(x)+.5,h);ctx.stroke();if((x-gutter)>10){ctx.fillStyle=major?'#b3c3d6':'#7e92a7';ctx.fillText(fmt(t).slice(0,8),x+3,top/2)}}
ctx.strokeStyle='#41536a';ctx.beginPath();ctx.moveTo(0,audioBottom+.5);ctx.lineTo(w,audioBottom+.5);ctx.stroke();
if(peakMin&&audio){const cy=(audioTop+audioBottom)/2,amp=(audioBottom-audioTop)*.43;ctx.fillStyle='#58b6ef';ctx.beginPath();let started=false;const count=peakMin.length;for(let x=Math.round(gutter);x<w;x++){const ta=origin+(x-gutter)/pxs,tb=origin+(x+1-gutter)/pxs;let a=clamp(Math.floor(ta*audio.sampleRate/peakStep),0,count-1),b=clamp(Math.ceil(tb*audio.sampleRate/peakStep),a+1,count);let mn=1,mx=-1;for(let j=a;j<b;j++){mn=Math.min(mn,peakMin[j]);mx=Math.max(mx,peakMax[j])}if(!started){ctx.moveTo(x,cy-mx*amp);started=true}else ctx.lineTo(x,cy-mx*amp)}for(let x=Math.round(w-1);x>=gutter;x--){const ta=origin+(x-gutter)/pxs,tb=origin+(x+1-gutter)/pxs;let a=clamp(Math.floor(ta*audio.sampleRate/peakStep),0,count-1),b=clamp(Math.ceil(tb*audio.sampleRate/peakStep),a+1,count);let mn=1;for(let j=a;j<b;j++)mn=Math.min(mn,peakMin[j]);ctx.lineTo(x,cy-mn*amp)}ctx.closePath();ctx.fill()}else{ctx.strokeStyle='#40627c';ctx.beginPath();ctx.moveTo(gutter,(audioTop+audioBottom)/2);ctx.lineTo(w,(audioTop+audioBottom)/2);ctx.stroke()}
notes.forEach((n,i)=>{const x=gutter+(n.t-origin)*pxs,ww=n.d*pxs;if(x+ww<gutter||x>w)return;ctx.fillStyle='#27b89c';ctx.fillRect(Math.max(gutter,x),midiTop+19,Math.min(w,x+ww)-Math.max(gutter,x),Math.max(17,midiBottom-midiTop-35));ctx.strokeStyle=i===notes.length-1?'#d8fff7':'#70ddc9';ctx.strokeRect(Math.max(gutter,x)+.5,midiTop+19.5,Math.max(1,Math.min(w,x+ww)-Math.max(gutter,x))-1,Math.max(16,midiBottom-midiTop-36));});
const cursor=gutter+(playSec-origin)*pxs;if(cursor>=gutter&&cursor<=w){ctx.strokeStyle='#fff3aa';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cursor+.5,0);ctx.lineTo(cursor+.5,h);ctx.stroke();ctx.fillStyle='#fff3aa';ctx.beginPath();ctx.moveTo(cursor-5,0);ctx.lineTo(cursor+5,0);ctx.lineTo(cursor,8);ctx.fill()}
ctx.fillStyle='#101c2d';ctx.fillRect(0,0,gutter,h);ctx.strokeStyle='#3d5069';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gutter+.5,0);ctx.lineTo(gutter+.5,h);ctx.stroke();ctx.fillStyle='#9bb4ce';ctx.font='650 11px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';ctx.fillText('AUDIO',11,(audioTop+audioBottom)/2);ctx.fillText('LUZ 1',11,(midiTop+midiBottom)/2);ctx.fillStyle='#172b40';ctx.fillRect(0,0,gutter,top);ctx.fillStyle='#8fc7cc';ctx.fillText('TIEMPO',9,15);
}
function setView(next,focus=origin+visible()/2){const old=pxs;pxs=clamp(next,3,1600);origin=focus-(focus-origin)*old/pxs;limit();scrollSync();draw()}
function pan(dsec){origin+=dsec;limit();scrollSync();draw()}
function state(){return notes.map(n=>({...n}))}
function commit(){past.push(state());if(past.length>100)past.shift();future=[];buttons()}
function buttons(){el('egp29Undo').disabled=!past.length;el('egp29Redo').disabled=!future.length}
function undo(){if(!past.length)return;future.push(state());notes=past.pop();buttons();draw()}
function redo(){if(!future.length)return;past.push(state());notes=future.pop();buttons();draw()}
function hitTime(x){return clamp(origin+(x-gutter)/pxs,0,seconds)}
function snap(s){return Math.round(s*4)/4}
function nativeSeek(t){const seek=el('egpShowSeek');if(!seek)return;const max=Number(seek.max)||1000;seek.value=String(Math.round(clamp(t/Math.max(1,seconds),0,1)*max));seek.dispatchEvent(new Event('input',{bubbles:true}));seek.dispatchEvent(new Event('change',{bubbles:true}));playSec=t;draw()}
function nativePlay(){el('egpShowPlay')?.click()}
function nativeStop(){el('egpShowStop')?.click();playSec=0;draw()}
el('egp29Play').onclick=nativePlay;el('egp29Stop').onclick=nativeStop;el('egp29Undo').onclick=undo;el('egp29Redo').onclick=redo;
let audioCtx=null;async function decodeFile(file){if(!file||loadingAudio)return;loadingAudio=true;try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();const raw=await file.arrayBuffer();const buffer=await audioCtx.decodeAudioData(raw);audio=buffer;seconds=buffer.duration;const count=Math.ceil(buffer.length/peakStep);peakMin=new Float32Array(count);peakMax=new Float32Array(count);const ch=buffer.getChannelData(0),ch2=buffer.numberOfChannels>1?buffer.getChannelData(1):null;let group=0,mn=1,mx=-1;for(let i=0;i<buffer.length;i++){const a=ch2?(ch[i]+ch2[i])*.5:ch[i];mn=Math.min(mn,a);mx=Math.max(mx,a);if(++group===peakStep||i===buffer.length-1){let k=Math.floor(i/peakStep);peakMin[k]=mn;peakMax[k]=mx;group=0;mn=1;mx=-1}}origin=0;playSec=0;pxs=Math.max(3,(getW()-gutter)/Math.max(1,seconds));scrollSync();draw();}catch(e){console.error('[EGP Seq] No se pudo decodificar el audio:',e)}finally{loadingAudio=false}}
const fileInput=el('egpShowFile');if(fileInput)fileInput.addEventListener('change',()=>decodeFile(fileInput.files?.[0]));
const ptrs=new Map();let multitouch=false,gesture=null;
function point(e){const r=area.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
area.addEventListener('pointerdown',e=>{area.focus({preventScroll:true});const p=point(e);ptrs.set(e.pointerId,p);area.setPointerCapture(e.pointerId);if(ptrs.size>=2){multitouch=true;drag=null;const [a,b]=[...ptrs.values()];gesture={gap:Math.hypot(a.x-b.x,a.y-b.y)||1,mid:(a.x+b.x)/2,focus:hitTime((a.x+b.x)/2),initialPxs:pxs};return}if(p.x<gutter)return;if(e.shiftKey||e.button===1){drag={kind:'pan',x:p.x,origin};return}const h=getH(),mt=Math.min(h-85,29+Math.max(75,(h-29)*.55));if(p.y>mt){const t=snap(hitTime(p.x));commit();notes.push({t,d:.5});drag={kind:'note',idx:notes.length-1,t};draw()}else{drag={kind:'seek',x:p.x};nativeSeek(hitTime(p.x))}});
area.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,point(e));const p=point(e);if(ptrs.size>=2&&gesture){const [a,b]=[...ptrs.values()],gap=Math.hypot(a.x-b.x,a.y-b.y)||1,mid=(a.x+b.x)/2;pxs=clamp(gesture.initialPxs*gap/gesture.gap,3,1600);origin=gesture.focus-(mid-gutter)/pxs;limit();scrollSync();draw();return}if(!drag||multitouch)return;if(drag.kind==='pan'){origin=drag.origin+(drag.x-p.x)/pxs;limit();scrollSync();draw()}else if(drag.kind==='note'){const n=notes[drag.idx];if(n){let end=snap(hitTime(p.x));n.t=Math.min(drag.t,end);n.d=Math.max(.25,Math.abs(end-drag.t));draw()}}else if(drag.kind==='seek')nativeSeek(hitTime(p.x))});
const release=e=>{ptrs.delete(e.pointerId);if(!ptrs.size){gesture=null;multitouch=false;drag=null}else if(ptrs.size===1){gesture=null;drag=null}};area.addEventListener('pointerup',release);area.addEventListener('pointercancel',release);
area.addEventListener('wheel',e=>{if(!document.body.classList.contains('egp-show-mode'))return;e.preventDefault();const p=point(e);if(e.ctrlKey||e.metaKey){const factor=Math.exp(-e.deltaY*.012);const focus=hitTime(Math.max(gutter,p.x));pxs=clamp(pxs*factor,3,1600);origin=focus-(p.x-gutter)/pxs;limit();scrollSync();draw()}else{const dx=(Math.abs(e.deltaX)>1?e.deltaX:(e.shiftKey?e.deltaY:0));if(dx)pan(dx/pxs);else pan(e.deltaY/pxs)}},{passive:false});
scr.addEventListener('scroll',()=>{if(!document.body.classList.contains('egp-show-mode'))return;origin=scr.scrollLeft/pxs;limit();draw()});
area.addEventListener('dblclick',e=>{const p=point(e);if(p.y<30||p.y>getH()-35){const focus=hitTime(p.x);pxs=clamp(pxs*1.6,3,1600);origin=focus-(p.x-gutter)/pxs;limit();scrollSync();draw()}});
document.addEventListener('keydown',e=>{if(!document.body.classList.contains('egp-show-mode')||!root.isConnected)return;const tag=e.target?.tagName;if(/^(INPUT|TEXTAREA|SELECT)$/.test(tag||''))return;if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)redo();else undo()}else if(e.key===' '&&!e.repeat){e.preventDefault();e.stopImmediatePropagation();nativePlay()}else if(e.key==='Escape'){el('egpExitShow')?.click()}},true);
function tick(now){if(document.body.classList.contains('egp-show-mode')){let s=el('egpShowTime')?.textContent||'';const m=/^(\d+):(\d+)\.(\d+)/.exec(s.trim());if(m){const t=Number(m[1])*60+Number(m[2])+Number('0.'+m[3]);if(Number.isFinite(t)&&Math.abs(playSec-t)>.016){playSec=t;draw()}}el('egp29Time').textContent=fmt(playSec);const nativeBtn=el('egpShowPlay');if(nativeBtn){const t=nativeBtn.textContent||'';el('egp29Play').textContent=/pausa|pause|❚❚|Ⅱ/i.test(t)?'Ⅱ Pausa':'▶ Play'}if(!audio&&fileInput?.files?.length)decodeFile(fileInput.files[0]);if(!lastFrame||now-lastFrame>800){lastFrame=now;draw()}}requestAnimationFrame(tick)}requestAnimationFrame(tick);
const resizer=new ResizeObserver(()=>{limit();scrollSync();draw()});resizer.observe(area);
area.addEventListener('click',e=>{if(!audio&&e.detail===1){const p=point(e);const mt=Math.min(getH()-85,29+Math.max(75,(getH()-29)*.55));if(p.y<mt&&fileInput){fileInput.click()}}});
scrollSync();draw();
})();
