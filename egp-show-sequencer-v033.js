/* EGP Show Sequencer V0.33 — isolated visual editor, no DMX output */
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
#egpSeq29 .egp33tools{display:none;align-items:center;gap:5px;padding:4px 12px;min-height:43px;background:#122033;border-bottom:1px solid #2c4055;flex-wrap:wrap}
#egpSeq29 .egp33tools.active{display:flex}
#egpSeq29 .egp33swatch{width:25px;min-width:25px;height:25px;border:1px solid #9bafbf;border-radius:5px;padding:0;cursor:pointer}
#egpSeq29 .egp33tools select{background:#1b3145;border:1px solid #42596c;color:#e8f5fb;border-radius:7px;padding:6px;font-size:12px}
#egpSeq29 #egp33Rec.armed{background:#9e252e;border-color:#fd5664;color:#fff}
#egpSeq29 .egp29trackarea{flex:1;min-height:0;overflow:hidden;position:relative;touch-action:none;cursor:crosshair}
#egpSeq29 canvas{display:block;width:100%;height:100%;touch-action:none}
#egpSeq29 .egp29scroll{height:13px;flex:none;overflow-x:auto;overflow-y:hidden;background:#101b29}
#egpSeq29 .egp29scroll div{height:1px}
#egpSeq29 .egp29trackarea:focus-visible{outline:2px solid #4de5d2;outline-offset:-2px}
@media(max-width:600px){#egpSeq29{flex-basis:42dvh}#egpSeq29 .egp29bar{padding:5px 7px;gap:4px}#egpSeq29 button{min-width:51px;height:30px;font-size:11px}#egpSeq29 #egp29Time{font-size:10px}}

/* V0.30: 3D siempre arriba; secuenciador abajo */
body.egp-show-mode #stagePage .center > .canvasbox{
  order:0!important;position:relative!important;top:auto!important;bottom:auto!important;
  flex:1 1 auto!important;height:0!important;min-height:120px!important;
  transform:none!important;
}
body.egp-show-mode #stagePage .center > #egpSeq29{
  order:99!important;position:relative!important;top:auto!important;bottom:auto!important;
  left:auto!important;right:auto!important;transform:none!important;
  flex:0 0 clamp(245px,36dvh,430px)!important;max-height:48dvh!important;
  z-index:5!important;
}
body.egp-show-mode #stagePage .center > #egpSeq29 .egp29trackarea{min-height:0!important}
@media(max-height:650px){
 body.egp-show-mode #stagePage .center > #egpSeq29{flex-basis:43dvh!important}
}

/* V0.31: anular el posicionamiento ABSOLUTO del antiguo inspector V0.25 */
body.egp-show-mode #stagePage .center{
 display:flex!important;flex-direction:column!important;align-items:stretch!important;
 height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;
}
body.egp-show-mode #stagePage #box{
 position:relative!important;inset:auto!important;left:auto!important;right:auto!important;
 top:auto!important;bottom:auto!important;display:block!important;
 width:100%!important;max-width:none!important;height:0!important;
 min-width:0!important;min-height:0!important;margin:0!important;
 flex:1 1 0%!important;order:0!important;
 transform:none!important;background:#010309!important;
}
body.egp-show-mode #stagePage #egpSeq29{
 position:relative!important;inset:auto!important;display:flex!important;
 width:100%!important;min-width:0!important;max-width:none!important;
 height:clamp(240px,39dvh,420px)!important;
 flex:0 0 clamp(240px,39dvh,420px)!important;order:10!important;
 margin:0!important;transform:none!important;z-index:3!important;
}
body.egp-show-mode #stagePage #box canvas{display:block!important;width:100%!important;height:100%!important}
`;document.head.appendChild(css);
const root=document.createElement('section');root.id='egpSeq29';root.innerHTML=`<div class="egp29bar"><button id="egp29Play" title="Play/Pausa · Espacio">▶ Play</button><button id="egp29Stop" title="Stop">■ Stop</button><button id="egp33Rec" title="REC">● REC</button><button id="egp29Undo" title="Undo · ⌘Z" disabled>↶ Undo</button><button id="egp29Redo" title="Redo · ⇧⌘Z" disabled>↷ Redo</button><span id="egp29Time">00:00.000</span></div><div id="egp33Tools" class="egp33tools"><button id="egp33Quant" type="button">Cuantizar ▾</button><select id="egp33Figures" aria-label="Figura" hidden><option value="1">♩ Negra</option><option value="0.5">♫ Corchea</option><option value="0.25">♬ Semicorchea</option><option value="2">𝅗𝅥 Blanca</option><option value="4">𝅝 Redonda</option><option value="0">Libre</option></select><span id="egp33Colors"></span></div><div id="egp29Area" class="egp29trackarea" tabindex="0"><canvas id="egp29Canvas"></canvas></div><div id="egp29Scroll" class="egp29scroll"><div id="egp29ScrollContent"></div></div>`;
const center=stage.querySelector('.center');if(!center)return;
center.append(root);

let cutMode=false;
const cutButton=document.createElement('button');
cutButton.id='egp36Cut';
cutButton.type='button';
cutButton.textContent='✂ Cortar';
cutButton.title='C = herramienta de corte; V = selección';
el('egp29Redo').after(cutButton);

cutButton.onclick=()=>{
 cutMode=!cutMode;
 cutButton.classList.toggle('active',cutMode);
 cutButton.style.background=cutMode?'#af6124':'';
 area.style.cursor=cutMode?'crosshair':'';
};

function egp36Split(index,time){
 const n=notes[index];
 if(!n)return;

 const split=Math.round(time*4)/4;
 const end=n.t+n.d;

 if(split<=n.t+.05||split>=end-.05)return;

 commit();

 const right={...n,t:split,d:end-split};
 n.d=split-n.t;
 notes.splice(index+1,0,right);

 selected.clear();
 selected.add(index+1);
 syncEditor();
 draw();
}

function egp36Geometry(){
 const height=getH();
 const bottom=Math.min(
  height-85,
  29+Math.max(75,(height-29)*.55)
 );
 const count=Math.max(1,lightCount());
 return {
  bottom,
  laneHeight:(height-bottom-1)/count
 };
}

function egp36LineY(n){
 const g=egp36Geometry();
 const top=g.bottom+1+n.lane*g.laneHeight;
 const inset=Math.min(4,g.laneHeight*.15);
 const hh=Math.max(
  3,g.laneHeight-Math.min(8,g.laneHeight*.3)
 );
 const level=clamp(Number(n.level??100),0,100);
 return top+inset+4+
        (1-level/100)*Math.max(1,hh-8);
}

function egp36SetLevel(n,y){
 const g=egp36Geometry();
 const top=g.bottom+1+n.lane*g.laneHeight;
 const inset=Math.min(4,g.laneHeight*.15);
 const hh=Math.max(
  3,g.laneHeight-Math.min(8,g.laneHeight*.3)
 );
 const ratio=1-(y-top-inset-4)/
                 Math.max(1,hh-8);
 n.level=Math.round(clamp(ratio*100,0,100));
}

const area=el('egp29Area'),canvas=el('egp29Canvas'),ctx=canvas.getContext('2d'),scr=el('egp29Scroll');
let audio=null,loadingAudio=false,peakMin=null,peakMax=null,peakStep=64,seconds=180,pxs=85,origin=0,playSec=0,raf=null,notes=[],past=[],future=[],selected=new Set(),recArmed=false,recFrom=-1,drag=null,prevText='',lastFrame=performance.now();
const gutter=84;const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const fmt=s=>{s=Math.max(0,s||0);const m=Math.floor(s/60),sec=Math.floor(s%60),ms=Math.floor((s-Math.floor(s))*1000);return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')+'.'+String(ms).padStart(3,'0')};
const getW=()=>canvas.getBoundingClientRect().width;const getH=()=>canvas.getBoundingClientRect().height;
const visible=()=>Math.max(.1,(getW()-gutter)/pxs);
function lightCount(){
 const label=el('dimensions')?.textContent||'';
 const m=label.match(/(\d+)\s+luces/i);
 if(m)return clamp(Number(m[1]),0,512);
 try{const data=JSON.parse(localStorage.getItem('EGP_LUCES_STAGE_MAPPER_3D_V01')||'{}');if(Array.isArray(data.fixtures))return Math.min(512,data.fixtures.length)}catch(_){}
 return 0;
}

function limit(){origin=clamp(origin,0,Math.max(0,seconds-visible()))}
function scrollSync(){const total=Math.max(1,seconds*pxs);el('egp29ScrollContent').style.width=(total+gutter)+'px';if(Math.abs(scr.scrollLeft-origin*pxs)>2)scr.scrollLeft=origin*pxs;}
function draw(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;const dpr=Math.min(2,devicePixelRatio||1),w=r.width,h=r.height;if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#0b1523';ctx.fillRect(0,0,w,h);
const top=29,audioTop=top,audioBottom=Math.min(h-85,top+Math.max(75,(h-top)*.55)),midiTop=audioBottom+1,midiBottom=h;
const lights=lightCount();const laneH=(midiBottom-midiTop)/Math.max(1,lights);
ctx.fillStyle='#112234';ctx.fillRect(0,0,w,top);ctx.fillStyle='#0b1e2a';ctx.fillRect(0,audioTop,w,audioBottom-audioTop);ctx.fillStyle='#11192b';ctx.fillRect(0,midiTop,w,midiBottom-midiTop);
for(let k=1;k<lights;k++){ctx.strokeStyle='#2c3b4f';ctx.beginPath();ctx.moveTo(0,midiTop+k*laneH+.5);ctx.lineTo(w,midiTop+k*laneH+.5);ctx.stroke()}
const candidateSteps=[.1,.2,.25,.5,1,2,5,10,15,30,60,120,300,600,1200,3600];const step=candidateSteps.find(v=>v*pxs>=94)||3600;const t0=Math.ceil((origin-0.000001)/step)*step;
ctx.font='11px ui-monospace,SFMono-Regular,Menlo,monospace';ctx.textBaseline='middle';for(let t=t0;t<=Math.min(seconds,origin+visible()+step);t+=step){const x=gutter+(t-origin)*pxs;if(x<gutter-1||x>w+1)continue;const major=(Math.round(t/step)%5===0);ctx.strokeStyle=major?'#314458':'#203042';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(Math.round(x)+.5,top);ctx.lineTo(Math.round(x)+.5,h);ctx.stroke();if((x-gutter)>10){ctx.fillStyle=major?'#b3c3d6':'#7e92a7';ctx.fillText(fmt(t).slice(0,8),x+3,top/2)}}
ctx.strokeStyle='#41536a';ctx.beginPath();ctx.moveTo(0,audioBottom+.5);ctx.lineTo(w,audioBottom+.5);ctx.stroke();
if(peakMin&&audio){const cy=(audioTop+audioBottom)/2,amp=(audioBottom-audioTop)*.43;ctx.fillStyle='#58b6ef';ctx.beginPath();let started=false;const count=peakMin.length;for(let x=Math.round(gutter);x<w;x++){const ta=origin+(x-gutter)/pxs,tb=origin+(x+1-gutter)/pxs;let a=clamp(Math.floor(ta*audio.sampleRate/peakStep),0,count-1),b=clamp(Math.ceil(tb*audio.sampleRate/peakStep),a+1,count);let mn=1,mx=-1;for(let j=a;j<b;j++){mn=Math.min(mn,peakMin[j]);mx=Math.max(mx,peakMax[j])}if(!started){ctx.moveTo(x,cy-mx*amp);started=true}else ctx.lineTo(x,cy-mx*amp)}for(let x=Math.round(w-1);x>=gutter;x--){const ta=origin+(x-gutter)/pxs,tb=origin+(x+1-gutter)/pxs;let a=clamp(Math.floor(ta*audio.sampleRate/peakStep),0,count-1),b=clamp(Math.ceil(tb*audio.sampleRate/peakStep),a+1,count);let mn=1;for(let j=a;j<b;j++)mn=Math.min(mn,peakMin[j]);ctx.lineTo(x,cy-mn*amp)}ctx.closePath();ctx.fill()}else{ctx.strokeStyle='#40627c';ctx.beginPath();ctx.moveTo(gutter,(audioTop+audioBottom)/2);ctx.lineTo(w,(audioTop+audioBottom)/2);ctx.stroke()}
notes.forEach((n,i)=>{const x=gutter+(n.t-origin)*pxs,ww=n.d*pxs;if(x+ww<gutter||x>w||lights<1)return;const lane=clamp(n.lane||0,0,lights-1),y=midiTop+lane*laneH+Math.min(4,laneH*.15),hh=Math.max(3,laneH-Math.min(8,laneH*.3));ctx.fillStyle=n.color||'#27b89c';ctx.fillRect(Math.max(gutter,x),y,Math.min(w,x+ww)-Math.max(gutter,x),hh);ctx.strokeStyle=selected.has(i)?'#ffffff':'#70ddc9';ctx.lineWidth=selected.has(i)?2:1;ctx.strokeRect(Math.max(gutter,x)+.5,y+.5,Math.max(1,Math.min(w,x+ww)-Math.max(gutter,x))-1,Math.max(1,hh-1));});



// V0.42 — líneas de pulso sobre la línea de tiempo.
if(egp42Beats.length>=2){
 ctx.save();

 const divisions=egp42Divisions;
 const first=origin;
 const last=origin+visible();

 for(let k=0;k<egp42Beats.length-1;k++){
  const a=egp42Beats[k];
  const b=egp42Beats[k+1];

  if(b<first||a>last)continue;

  for(let d=0;d<divisions;d++){
   const time=a+(b-a)*d/divisions;
   const x=gutter+(time-origin)*pxs;

   if(x<gutter||x>w)continue;

   ctx.strokeStyle=d===0?
    'rgba(252,190,93,.75)':
    'rgba(252,190,93,.30)';

   ctx.lineWidth=d===0?1.5:1;

   ctx.beginPath();
   ctx.moveTo(x,29);
   ctx.lineTo(x,h);
   ctx.stroke();
  }
 }

 ctx.restore();
}

// V0.37 — tiradores de inicio y final.
notes.forEach((n,i)=>{
 if(!selected.has(i))return;

 const g=egp36Geometry();
 const x=gutter+(n.t-origin)*pxs;
 const right=x+n.d*pxs;
 const top=g.bottom+1+n.lane*g.laneHeight;
 const bottom=top+g.laneHeight;

 ctx.save();
 ctx.strokeStyle='#ffffff';
 ctx.lineWidth=2.5;

 for(const edge of [x,right]){
  if(edge<gutter||edge>getW())continue;

  ctx.beginPath();
  ctx.moveTo(edge,top+3);
  ctx.lineTo(edge,bottom-3);
  ctx.stroke();

  ctx.fillStyle='#ffffff';
  ctx.fillRect(edge-3,top+3,6,7);
  ctx.fillRect(edge-3,bottom-10,6,7);
 }
 ctx.restore();
});

// V0.36 — línea de intensidad por región.
notes.forEach((n,i)=>{
 const x=gutter+(n.t-origin)*pxs;
 const right=x+n.d*pxs;
 if(right<gutter||x>w)return;

 const y=egp36LineY(n);
 const a=Math.max(gutter,x);
 const b=Math.min(w,right);

 if(b<=a)return;

 ctx.save();
 ctx.beginPath();
 ctx.rect(a,0,b-a,h);
 ctx.clip();

 ctx.strokeStyle='#ffffff';
 ctx.globalAlpha=.92;
 ctx.lineWidth=selected.has(i)?2.5:1.6;
 ctx.beginPath();
 ctx.moveTo(a,y);
 ctx.lineTo(b,y);
 ctx.stroke();

 if(selected.has(i)&&b-a>35){
  ctx.fillStyle='#ffffff';
  ctx.beginPath();
  ctx.arc((a+b)/2,y,3.5,0,Math.PI*2);
  ctx.fill();

  ctx.font='bold 10px sans-serif';
  ctx.textAlign='center';
  ctx.fillStyle='#ffffff';
  ctx.fillText(
   Math.round(clamp(n.level??100,0,100))+'%',
   (a+b)/2,
   Math.min(getH()-3,y+13)
  );
 }
 ctx.restore();
});


// V0.37 — recuadro de selección estilo DAW.
if(drag?.kind==='marquee'){
 const x=Math.min(drag.x1,drag.x2);
 const y=Math.min(drag.y1,drag.y2);
 const ww=Math.abs(drag.x2-drag.x1);
 const hh=Math.abs(drag.y2-drag.y1);

 ctx.save();
 ctx.fillStyle='rgba(76,168,255,.14)';
 ctx.strokeStyle='#79bdff';
 ctx.lineWidth=1.5;
 ctx.setLineDash([5,3]);
 ctx.fillRect(x,y,ww,hh);
 ctx.strokeRect(x,y,ww,hh);
 ctx.restore();
}

const cursor=gutter+(playSec-origin)*pxs;if(cursor>=gutter&&cursor<=w){ctx.strokeStyle='#fff3aa';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cursor+.5,0);ctx.lineTo(cursor+.5,h);ctx.stroke();ctx.fillStyle='#fff3aa';ctx.beginPath();ctx.moveTo(cursor-5,0);ctx.lineTo(cursor+5,0);ctx.lineTo(cursor,8);ctx.fill()}
ctx.fillStyle='#101c2d';ctx.fillRect(0,0,gutter,h);ctx.strokeStyle='#3d5069';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gutter+.5,0);ctx.lineTo(gutter+.5,h);ctx.stroke();ctx.fillStyle='#9bb4ce';ctx.font='650 11px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';ctx.fillText('AUDIO',11,(audioTop+audioBottom)/2);for(let k=0;k<lights;k++){if(laneH>=13)ctx.fillText('LUZ '+(k+1),11,midiTop+(k+.5)*laneH);}ctx.fillStyle='#172b40';ctx.fillRect(0,0,gutter,top);ctx.fillStyle='#8fc7cc';ctx.fillText('TIEMPO',9,15);
}
function setView(next,focus=origin+visible()/2){const old=pxs;pxs=clamp(next,3,1600);origin=focus-(focus-origin)*old/pxs;limit();scrollSync();draw()}
function pan(dsec){origin+=dsec;limit();scrollSync();draw()}
function state(){return notes.map(n=>({...n}))}
function commit(){past.push(state());if(past.length>100)past.shift();future=[];buttons()}
function buttons(){el('egp29Undo').disabled=!past.length;el('egp29Redo').disabled=!future.length}
function undo(){if(!past.length)return;future.push(state());notes=past.pop();selected.clear();buttons();syncEditor();draw()}
function redo(){if(!future.length)return;past.push(state());notes=future.pop();selected.clear();buttons();syncEditor();draw()}

// EGP V0.35 — borrar regiones seleccionadas.
function deleteSelectedNotes(){
 if(!selected.size)return false;

 commit();

 notes=notes.filter((n,i)=>!selected.has(i));
 selected.clear();

 syncEditor();
 draw();

 return true;
}
function hitTime(x){return clamp(origin+(x-gutter)/pxs,0,seconds)}
function snap(s){return Math.round(s*4)/4}
// V0.33 — Edición de regiones, color por selección y cuantización provisional en tiempo.
const editor=el('egp33Tools'),figure=el('egp33Figures');
const swatches=['#f7f7f4','#e5ae28','#e3484a','#35c76b','#409bf5','#b27af2','#33bfc6','#ff7b37'];
for(const color of swatches){const b=document.createElement('button');b.type='button';b.className='egp33swatch';b.title=color;b.style.background=color;b.onclick=()=>{if(!selected.size)return;commit();for(const i of selected){if(notes[i])notes[i].color=color}draw()};el('egp33Colors').appendChild(b)}
function syncEditor(){editor.classList.toggle('active',selected.size>0);figure.hidden=true}
function findNote(p){const h=getH(),mt=Math.min(h-85,29+Math.max(75,(h-29)*.55)),lights=lightCount();if(p.y<=mt||lights<1)return -1;const lane=clamp(Math.floor((p.y-mt)/((h-mt)/lights)),0,lights-1),t=hitTime(p.x);for(let i=notes.length-1;i>=0;i--){const n=notes[i];if(n.lane===lane&&t>=n.t&&t<=n.t+n.d)return i}return -1}
function choose(i,multi){if(i<0){if(!multi)selected.clear()}else if(multi){if(selected.has(i))selected.delete(i);else selected.add(i)}else{selected.clear();selected.add(i)}syncEditor();draw()}
el('egp33Quant').onclick=()=>{if(selected.size)figure.hidden=!figure.hidden};
figure.onchange=()=>{const ratio=Number(figure.value);if(ratio<=0||!selected.size)return;const bpm=Number(el('v27LiveBpm')?.textContent?.match(/[\d.]+/)?.[0])||120;const unit=60/bpm*ratio;commit();for(const i of selected){const n=notes[i];if(n){n.t=clamp(Math.round(n.t/unit)*unit,0,seconds);n.d=Math.max(unit,Math.round(n.d/unit)*unit)}}figure.hidden=true;draw()};
el('egp33Rec').onclick=()=>{recArmed=!recArmed;el('egp33Rec').classList.toggle('armed',recArmed);el('egp33Rec').textContent=recArmed?'● REC ON':'● REC';if(recArmed&&!selected.size&&lightCount()>0){/* Elige pista mediante clic; no se graba sin interacción */}};
function recordTouch(lane){if(!recArmed)return;const t=clamp(playSec,0,seconds);if(!Number.isFinite(t))return;commit();notes.push({t,d:.25,lane,color:'#f7f7f4'});choose(notes.length-1,false)}
function nativeSeek(t){const seek=el('egpShowSeek');if(!seek)return;const max=Number(seek.max)||1000;seek.value=String(Math.round(clamp(t/Math.max(1,seconds),0,1)*max));seek.dispatchEvent(new Event('input',{bubbles:true}));seek.dispatchEvent(new Event('change',{bubbles:true}));playSec=t;draw()}
function nativePlay(){el('egpShowPlay')?.click()}
function nativeStop(){el('egpShowStop')?.click();playSec=0;draw()}
el('egp29Play').onclick=nativePlay;el('egp29Stop').onclick=nativeStop;el('egp29Undo').onclick=undo;el('egp29Redo').onclick=redo;
let audioCtx=null;async function decodeFile(file){if(!file||loadingAudio)return;loadingAudio=true;try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();const raw=await file.arrayBuffer();const buffer=await audioCtx.decodeAudioData(raw);audio=buffer;seconds=buffer.duration;const count=Math.ceil(buffer.length/peakStep);peakMin=new Float32Array(count);peakMax=new Float32Array(count);const ch=buffer.getChannelData(0),ch2=buffer.numberOfChannels>1?buffer.getChannelData(1):null;let group=0,mn=1,mx=-1;for(let i=0;i<buffer.length;i++){const a=ch2?(ch[i]+ch2[i])*.5:ch[i];mn=Math.min(mn,a);mx=Math.max(mx,a);if(++group===peakStep||i===buffer.length-1){let k=Math.floor(i/peakStep);peakMin[k]=mn;peakMax[k]=mx;group=0;mn=1;mx=-1}}origin=0;playSec=0;pxs=Math.max(3,(getW()-gutter)/Math.max(1,seconds));scrollSync();draw();}catch(e){console.error('[EGP Seq] No se pudo decodificar el audio:',e)}finally{loadingAudio=false}}
const fileInput=el('egpShowFile');if(fileInput)fileInput.addEventListener('change',()=>decodeFile(fileInput.files?.[0]));

// EGP V0.42 — audio musical, click y grid magnético.
let egp42Beats=[];
let egp42SnapEnabled=true;
let egp42Divisions=1;
let egp42ClickName='';

const egp42Panel=document.createElement('div');
egp42Panel.id='egp42Panel';
egp42Panel.style.cssText=`
 flex:none;display:flex;align-items:center;gap:9px;
 flex-wrap:wrap;padding:6px 12px;
 background:#102237;border-bottom:1px solid #335069;
 font:12px system-ui;color:#d8ebff;
`;

egp42Panel.innerHTML=`
 <label style="cursor:pointer">
  🎵 Audio
  <input id="egp42Music" type="file"
   accept="audio/*,.wav,.mp3,.m4a,.aac,.ogg"
   style="max-width:150px;font-size:10px">
 </label>
 <label style="cursor:pointer">
  🥁 Click
  <input id="egp42Click" type="file"
   accept="audio/*,.wav,.mp3,.m4a,.aac,.ogg"
   style="max-width:150px;font-size:10px">
 </label>
 <label style="white-space:nowrap">
  <input id="egp42Snap" type="checkbox" checked>
  Snap click
 </label>
 <select id="egp42Division"
  style="background:#19374f;color:#fff;border-radius:5px">
  <option value="1">Pulso</option>
  <option value="2">1/2 pulso</option>
  <option value="4">1/4 pulso</option>
 </select>
 <span id="egp42Status"
  style="color:#9ebed6">Sin click</span>
`;

root.insertBefore(egp42Panel,editor);

const egp42Music=el('egp42Music');
const egp42Click=el('egp42Click');
const egp42Status=el('egp42Status');

el('egp42Snap').onchange=e=>{
 egp42SnapEnabled=e.target.checked;
 draw();
};

el('egp42Division').onchange=e=>{
 egp42Divisions=Number(e.target.value)||1;
 draw();
};

function egp42Nearest(t){
 if(!egp42SnapEnabled||egp42Beats.length<2)
  return t;

 const beats=egp42Beats;
 let lo=0,hi=beats.length;

 while(lo<hi){
  const m=(lo+hi)>>1;
  if(beats[m]<t)lo=m+1;
  else hi=m;
 }

 const segment=Math.max(
  0,Math.min(beats.length-2,lo-1)
 );

 const a=beats[segment];
 const b=beats[segment+1];
 const step=(b-a)/egp42Divisions;

 if(step<=0)return t;

 // Fuera de los pulsos detectados: extrapolar
 // desde el tramo más cercano.
 let snapped=a+Math.round((t-a)/step)*step;

 if(lo===0){
  const firstStep=(beats[1]-beats[0])/egp42Divisions;
  snapped=beats[0]+
   Math.round((t-beats[0])/firstStep)*firstStep;
 }else if(lo>=beats.length){
  const last=beats.length-1;
  const lastStep=(beats[last]-beats[last-1])/
   egp42Divisions;
  snapped=beats[last]+
   Math.round((t-beats[last])/lastStep)*lastStep;
 }else{
  const left=beats[lo-1];
  const right=beats[lo];

  const division=(right-left)/egp42Divisions;

  snapped=left+
   Math.round((t-left)/division)*division;
 }

 return clamp(snapped,0,seconds);
}

async function egp42LoadClick(file){
 if(!file)return;

 egp42Status.textContent='Analizando click...';

 try{
  if(!audioCtx)
   audioCtx=new (
    window.AudioContext||window.webkitAudioContext
   )();

  const data=await file.arrayBuffer();
  const buffer=await audioCtx.decodeAudioData(data);

  const sampleRate=buffer.sampleRate;
  const step=Math.max(1,Math.floor(sampleRate*.005));
  const count=Math.ceil(buffer.length/step);
  const envelope=new Float32Array(count);

  const channels=Array.from(
   {length:buffer.numberOfChannels},
   (_,i)=>buffer.getChannelData(i)
  );

  let max=0;

  for(let i=0;i<count;i++){
   const start=i*step;
   const end=Math.min(buffer.length,start+step);
   let peak=0;

   for(let j=start;j<end;j++){
    let value=0;
    for(const ch of channels){
     value=Math.max(value,Math.abs(ch[j]));
    }
    peak=Math.max(peak,value);
   }

   envelope[i]=peak;
   max=Math.max(max,peak);
  }

  const threshold=Math.max(.006,max*.23);
  const minDistance=.12;
  const beats=[];
  let last=-100;

  for(let i=1;i<count-1;i++){
   const value=envelope[i];
   const t=i*step/sampleRate;

   if(value<threshold||t-last<minDistance)
    continue;

   // Tomar el inicio del transiente y no
   // cada muestra de su envolvente.
   if(value>=envelope[i-1] ||
      envelope[i-1]<threshold){
    let onset=i;
    while(onset>0 &&
      envelope[onset-1]>=threshold*.45 &&
      (i-onset)*step/sampleRate<.035){
      onset--;
    }
    const onsetTime=onset*step/sampleRate;
    if(onsetTime-last>=minDistance){
     beats.push(onsetTime);
     last=onsetTime;
    }
   }
  }

  if(beats.length<2){
   throw Error(
    'No se detectaron suficientes golpes. '+
    'Usa un archivo con el click aislado.'
   );
  }

  egp42Beats=beats;
  egp42ClickName=file.name;

  egp42Status.textContent=
   `✓ ${beats.length} pulsos · ${file.name}`;

  egp42Status.style.color='#75ebc4';

  draw();

 }catch(error){
  egp42Beats=[];
  egp42Status.textContent='Error: '+error.message;
  egp42Status.style.color='#ff9c9c';
  console.error('[EGP Click]',error);
 }
}

egp42Music.addEventListener('change',async()=>{
 const file=egp42Music.files?.[0];
 if(!file)return;

 const key=showKey();

 try{
  if(key)await saveAudio(key,file);
  await loadToNative(file);
 }catch(error){
  alert('No se pudo cargar el audio: '+error.message);
 }
});

egp42Click.addEventListener('change',async()=>{
 const file=egp42Click.files?.[0];
 if(!file)return;

 const key=showKey();

 try{
  if(key)await saveAudio('CLICK::'+key,file);
  await egp42LoadClick(file);
 }catch(error){
  alert('No se pudo guardar el click: '+error.message);
 }
});

const ptrs=new Map();let multitouch=false,gesture=null;
function point(e){const r=area.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}


// V0.37 — herramienta Dibujar y selección por recuadro.
let egp37DrawMode=false;

const egp37DrawButton=document.createElement('button');
egp37DrawButton.id='egp37Draw';
egp37DrawButton.type='button';
egp37DrawButton.textContent='✎ Dibujar';
egp37DrawButton.title='D = dibujar · V = seleccionar';

cutButton.after(egp37DrawButton);

egp37DrawButton.onclick=()=>{
 egp37DrawMode=!egp37DrawMode;
 cutMode=false;
 cutButton.style.background='';
 egp37DrawButton.style.background=
  egp37DrawMode?'#176b62':'';
 area.style.cursor=egp37DrawMode?
  egp46PencilCursor:'default';
 canvas.style.cursor=area.style.cursor;
};

function egp37MarqueeContains(n,box){
 const g=egp36Geometry();

 const x1=gutter+(n.t-origin)*pxs;
 const x2=x1+n.d*pxs;

 const y1=g.bottom+1+n.lane*g.laneHeight;
 const y2=y1+g.laneHeight;

 const left=Math.min(box.x1,box.x2);
 const right=Math.max(box.x1,box.x2);
 const top=Math.min(box.y1,box.y2);
 const bottom=Math.max(box.y1,box.y2);

 return x2>=left&&x1<=right&&
        y2>=top&&y1<=bottom;
}


// V0.46 — cursores profesionales.
const egp46SvgCursor=svg=>
 'url("data:image/svg+xml,'+
 encodeURIComponent(svg)+
 '") 16 16, auto';

const egp46ResizeCursor=egp46SvgCursor(
 '<svg xmlns="http://www.w3.org/2000/svg" '+
 'width="32" height="32" viewBox="0 0 32 32">'+
 '<path d="M4 16 H28 M4 16 L10 10 M4 16 L10 22 '+
 'M28 16 L22 10 M28 16 L22 22" '+
 'stroke="white" stroke-width="4" fill="none"/>'+
 '<path d="M4 16 H28 M4 16 L10 10 M4 16 L10 22 '+
 'M28 16 L22 10 M28 16 L22 22" '+
 'stroke="#101722" stroke-width="2" fill="none"/>'+
 '</svg>'
);

const egp46PencilCursor=egp46SvgCursor(
 '<svg xmlns="http://www.w3.org/2000/svg" '+
 'width="32" height="32" viewBox="0 0 32 32">'+
 '<path d="M7 24 L9 17 L21 5 L27 11 L15 23 Z" '+
 'fill="#f5c767" stroke="#102030" stroke-width="2"/>'+
 '<path d="M9 17 L15 23 M19 7 L25 13" '+
 'stroke="#102030" stroke-width="1.6"/>'+
 '</svg>'
);

function egp46Cursor(p,e){
 if(cutMode)return 'crosshair';
 if(egp37DrawMode)return egp46PencilCursor;

 const hit=egp36Hit(p);

 if(!hit)return 'default';
 if(e.altKey)return 'copy';

 if(hit.kind==='left'||hit.kind==='right'){
  return egp46ResizeCursor;
 }

 if(hit.kind==='level')return 'ns-resize';
 return 'default';
}

function egp36Hit(p){
 const i=findNote(p);
 if(i<0)return null;
 const n=notes[i];
 const x=gutter+(n.t-origin)*pxs;
 const right=x+n.d*pxs;
 const edge=Math.min(11,Math.max(3,(right-x)/3));

 let kind='move';

 const dl=Math.abs(p.x-x);
 const dr=Math.abs(p.x-right);

 if(dl<=edge&&dl<=dr)kind='left';
 else if(dr<=edge)kind='right';
 else if(Math.abs(p.y-egp36LineY(n))<=7)
  kind='level';

 return {i,kind};
}


area.addEventListener('pointerenter',e=>{
 const p=point(e);
 area.style.cursor=egp46Cursor(p,e);
 canvas.style.cursor=area.style.cursor;
});

area.addEventListener('pointerleave',()=>{
 if(!drag){
  area.style.cursor='default';
  canvas.style.cursor='default';
 }
});

area.addEventListener('pointerdown',e=>{
 area.focus({preventScroll:true});
 const p=point(e);
 ptrs.set(e.pointerId,p);
 area.setPointerCapture(e.pointerId);

 if(ptrs.size>=2){
  multitouch=true;
  drag=null;
  const [a,b]=[...ptrs.values()];
  gesture={
   gap:Math.hypot(a.x-b.x,a.y-b.y)||1,
   mid:(a.x+b.x)/2,
   focus:hitTime((a.x+b.x)/2),
   initialPxs:pxs
  };
  return;
 }

 if(p.x<gutter)return;

 if(e.shiftKey&&e.button===1){
  drag={kind:'pan',x:p.x,origin};
  return;
 }

 const g=egp36Geometry();

 // Solo la regla superior mueve el cabezal.
 // AUDIO y espacios vacíos permiten seleccionar
 // mediante un rectángulo, como en Logic.
 if(p.y<29){
  drag={kind:'seek'};
  nativeSeek(hitTime(p.x));
  return;
 }

 const hit=egp36Hit(p);
 const multi=e.metaKey||e.ctrlKey;

 if(cutMode){
  if(hit)egp36Split(hit.i,hitTime(p.x));
  return;
 }

 if(hit){
  let i=hit.i;

  if(multi&&!e.altKey){
   choose(i,true);
   return;
  }

  const already=selected.has(i);

  if(!already)choose(i,false);

  if(e.altKey){
   commit();

   const indices=[...selected].sort((a,b)=>a-b);
   const copies=indices.map(j=>({...notes[j]}));
   const first=notes.length;

   notes.push(...copies);
   selected.clear();

   for(let j=0;j<copies.length;j++)
    selected.add(first+j);

   i=first+indices.indexOf(hit.i);
  }else{
   commit();
  }

  const indices=[...selected];
  const originals=indices.map(j=>({
   index:j,
   t:notes[j].t,
   d:notes[j].d,
   lane:notes[j].lane
  }));

  drag={
   kind:e.altKey?'move':hit.kind,
   index:i,
   x:p.x,
   y:p.y,
   originals,
   lockTime:e.shiftKey
  };

  if(hit.kind==='level'&&!e.altKey){
   egp36SetLevel(notes[i],p.y);
   draw();
  }

  area.style.cursor=e.altKey
   ?'copy':egp46Cursor(p,e);
  canvas.style.cursor=area.style.cursor;
  return;
 }

 if(!egp37DrawMode){
  const base=e.metaKey||e.ctrlKey||e.shiftKey
   ?new Set(selected):new Set();

  selected=new Set(base);

  drag={
   kind:'marquee',
   x1:p.x,
   y1:p.y,
   x2:p.x,
   y2:p.y,
   base
  };

  syncEditor();
  draw();
  return;
 }

 commit();

 const t=egp42Nearest(hitTime(p.x));
 const lane=clamp(
  Math.floor((p.y-g.bottom-1)/g.laneHeight),
  0,
  Math.max(0,lightCount()-1)
 );

 if(recArmed){
  recordTouch(lane);
  return;
 }

 notes.push({
  t,d:.5,lane,
  color:'#27b89c',
  level:100
 });

 choose(notes.length-1,false);
 drag={kind:'create',index:notes.length-1,t};
 draw();
});

area.addEventListener('pointermove',e=>{
 const p=point(e);

 if(!ptrs.has(e.pointerId)){
  area.style.cursor=egp46Cursor(p,e);
  canvas.style.cursor=area.style.cursor;
  return;
 }

 ptrs.set(e.pointerId,p);

 if(ptrs.size>=2&&gesture){
  const [a,b]=[...ptrs.values()];
  const gap=Math.hypot(a.x-b.x,a.y-b.y)||1;
  const mid=(a.x+b.x)/2;

  pxs=clamp(
   gesture.initialPxs*gap/gesture.gap,
   3,1600
  );

  origin=gesture.focus-(mid-gutter)/pxs;
  limit();scrollSync();draw();
  return;
 }

 if(!drag||multitouch)return;

 if(drag?.kind==='marquee'){
  drag.x2=p.x;
  drag.y2=p.y;

  selected=new Set(drag.base);

  notes.forEach((note,i)=>{
   if(egp37MarqueeContains(note,drag))
    selected.add(i);
  });

  syncEditor();
  draw();
  return;
 }

 const n=notes[drag?.index];
 const delta=drag?(p.x-drag.x)/pxs:0;

 if(drag.kind==='pan'){
  origin=drag.origin+(drag.x-p.x)/pxs;
  limit();scrollSync();draw();
  return;
 }

 if(drag.kind==='seek'){
  nativeSeek(hitTime(p.x));
  return;
 }

 if(drag.kind==='create'){
  if(!n)return;
  const finish=egp42Nearest(hitTime(p.x));
  n.t=Math.min(drag.t,finish);
  n.d=Math.max(.03,Math.abs(finish-drag.t));
  draw();
  return;
 }

 if(!n)return;

 if(drag.kind==='level'){
  egp36SetLevel(n,p.y);
  draw();
  return;
 }

 if(drag.kind==='left'){
  const ref=drag.originals.find(
   x=>x.index===drag.index
  );
  if(!ref)return;

  const wanted=egp42Nearest(ref.t+delta)-ref.t;
  const minimum=-Math.min(...drag.originals.map(x=>x.t));
  const maximum=Math.min(
   ...drag.originals.map(x=>x.d-.03)
  );
  const shared=clamp(wanted,minimum,maximum);

  for(const o of drag.originals){
   const item=notes[o.index];
   if(!item)continue;
   item.t=o.t+shared;
   item.d=o.d-shared;
  }
 }

 if(drag.kind==='right'){
  const ref=drag.originals.find(
   x=>x.index===drag.index
  );
  if(!ref)return;

  const wanted=
   egp42Nearest(ref.t+ref.d+delta)-
   (ref.t+ref.d);

  const minimum=-Math.min(
   ...drag.originals.map(x=>x.d-.03)
  );
  const maximum=Math.min(
   ...drag.originals.map(
    x=>seconds-x.t-x.d
   )
  );

  const shared=clamp(wanted,minimum,maximum);

  for(const o of drag.originals){
   const item=notes[o.index];
   if(!item)continue;
   item.d=o.d+shared;
  }
 }

 if(drag.kind==='move'){
  const earliest=Math.min(
   ...drag.originals.map(x=>x.t)
  );
  const latest=Math.max(
   ...drag.originals.map(x=>x.t+x.d)
  );

  const reference=drag.originals.find(
   x=>x.index===drag.index
  )||drag.originals[0];

  const targetDelta=egp42SnapEnabled &&
    egp42Beats.length>=2
   ?egp42Nearest(reference.t+delta)-reference.t
   :delta;

  const safeDelta=
   (drag.lockTime||e.shiftKey)
   ?0
   :clamp(targetDelta,-earliest,seconds-latest);

  const g=egp36Geometry();
  const laneDelta=Math.round(
   (p.y-drag.y)/g.laneHeight
  );

  const minLane=Math.min(
   ...drag.originals.map(x=>x.lane)
  );
  const maxLane=Math.max(
   ...drag.originals.map(x=>x.lane)
  );

  const safeLane=clamp(
   laneDelta,-minLane,
   lightCount()-1-maxLane
  );

  for(const o of drag.originals){
   const item=notes[o.index];
   if(!item)continue;
   item.t=o.t+safeDelta;
   item.lane=o.lane+safeLane;
  }
 }

 draw();
});

const egp36Release=e=>{
 ptrs.delete(e.pointerId);

 if(!ptrs.size){
  gesture=null;
  multitouch=false;
  drag=null;
 }else if(ptrs.size===1){
  gesture=null;
  drag=null;
 }
};

area.addEventListener('pointerup',egp36Release);
area.addEventListener('pointercancel',egp36Release);

area.addEventListener('wheel',e=>{if(!document.body.classList.contains('egp-show-mode'))return;e.preventDefault();const p=point(e);if(e.ctrlKey||e.metaKey){const factor=Math.exp(-e.deltaY*.012);const focus=hitTime(Math.max(gutter,p.x));pxs=clamp(pxs*factor,3,1600);origin=focus-(p.x-gutter)/pxs;limit();scrollSync();draw()}else{const dx=(Math.abs(e.deltaX)>1?e.deltaX:(e.shiftKey?e.deltaY:0));if(dx)pan(dx/pxs);else pan(e.deltaY/pxs)}},{passive:false});
scr.addEventListener('scroll',()=>{if(!document.body.classList.contains('egp-show-mode'))return;origin=scr.scrollLeft/pxs;limit();draw()});
area.addEventListener('dblclick',e=>{const p=point(e);if(p.y<30||p.y>getH()-35){const focus=hitTime(p.x);pxs=clamp(pxs*1.6,3,1600);origin=focus-(p.x-gutter)/pxs;limit();scrollSync();draw()}});
document.addEventListener('keydown',e=>{
 if(!document.body.classList.contains('egp-show-mode'))return;
 if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||''))return;
 if(e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.key.toLowerCase()==='c'&&!e.repeat){
  cutMode=true;
  cutButton.style.background='#af6124';
  e.preventDefault();
 }
 if(e.key.toLowerCase()==='v'&&!e.repeat){
  cutMode=false;
  egp37DrawMode=false;
  cutButton.style.background='';
  egp37DrawButton.style.background='';
  area.style.cursor='default';
  canvas.style.cursor='default';
  e.preventDefault();
 }
 if(e.key.toLowerCase()==='d'&&!e.repeat){
  cutMode=false;
  egp37DrawMode=true;
  cutButton.style.background='';
  egp37DrawButton.style.background='#176b62';
  area.style.cursor=egp46PencilCursor;
  canvas.style.cursor=egp46PencilCursor;
  e.preventDefault();
 }
},true);

document.addEventListener('keydown',e=>{if(!document.body.classList.contains('egp-show-mode')||!root.isConnected)return;const tag=e.target?.tagName;if(/^(INPUT|TEXTAREA|SELECT)$/.test(tag||''))return;if((e.key==='Backspace'||e.key==='Delete')&&!e.metaKey&&!e.ctrlKey&&!e.altKey){
 if(selected.size){
  e.preventDefault();
  e.stopImmediatePropagation();
  deleteSelectedNotes();
 }
 return;
}
if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)redo();else undo()}else if(e.key===' '&&!e.repeat){e.preventDefault();e.stopImmediatePropagation();nativePlay()}else if(e.key==='Escape'){el('egpExitShow')?.click()}},true);

// EGP V0.35 — estado de los clips activos.
function egp35Preview(){
 const active=document.body.classList.contains('egp-show-mode');
 const lights={};

 if(active){
  const count=lightCount();

  for(let lane=0;lane<count;lane++){
   let current=null;

   for(const n of notes){
    if(n.lane!==lane)continue;
    if(playSec<n.t||playSec>=n.t+n.d)continue;
    if(!current||n.t>=current.t)current=n;
   }

   // Si esta pista tiene bloques, los espacios vacíos
   // representan oscuridad.
   const hasClips=notes.some(n=>n.lane===lane);

   if(hasClips){
    lights[lane]=current?{
     color:current.color||'#27b89c',
     level:clamp(Number(current.level??100),0,100)
    }:{
     color:null,
     level:0
    };
   }
  }
 }

 window.__EGP_SEQ_3D_V035={active,lights};
}


// V0.40 — evaluación sincronizada de luces.
window.__EGP_SEQ_GET_FRAME_V040=function(time){
 const lights={};
 const count=lightCount();

 if(!document.body.classList.contains('egp-show-mode')){
  return {active:false,lights};
 }

 const t=Number(time);
 const position=Number.isFinite(t)?t:playSec;

 for(let lane=0;lane<count;lane++){
  let hasRegions=false;
  let current=null;

  for(const n of notes){
   if(n.lane!==lane)continue;

   hasRegions=true;

   if(position>=n.t &&
      position<n.t+n.d &&
      (!current||n.t>=current.t)){
    current=n;
   }
  }

  if(!hasRegions)continue;

  lights[lane]=current?{
   color:current.color||'#27b89c',
   level:clamp(Number(current.level??100),0,100)
  }:{
   color:null,
   level:0
  };
 }

 return {active:true,lights};
};

// V0.38 — Grabación momentánea con ArrowDown.
let egp38Hold=null;
let egp38LastLane=0;
let egp38LastColor='#27b89c';

function egp38Start(){
 if(egp38Hold || !recArmed)return;
 if(!document.body.classList.contains('egp-show-mode'))return;
 if(lightCount()<1)return;

 // No crear regiones inmóviles si la canción está detenida.
 const playButton=el('egp29Play');
 if(!/pausa|pause|❚❚|Ⅱ/i.test(playButton?.textContent||'')){
  return;
 }

 const index=[...selected].find(i=>notes[i]);
 const previous=index===undefined?null:notes[index];

 const lane=clamp(
  previous?.lane??egp38LastLane,
  0,lightCount()-1
 );

 const color=previous?.color||egp38LastColor;
 const level=previous?.level??100;
 const start=egp42Nearest(clamp(playSec,0,seconds));

 commit();

 notes.push({
  t:start,
  d:.001,
  lane,
  color,
  level
 });

 const newIndex=notes.length-1;
 egp38Hold={index:newIndex,start};

 selected.clear();
 selected.add(newIndex);
 syncEditor();

 egp38LastLane=lane;
 egp38LastColor=color;
 el('egp33Rec').textContent='● GRABANDO ↓';
 draw();
}

function egp38Advance(){
 if(!egp38Hold)return;

 const n=notes[egp38Hold.index];
 if(!n)return;

 const end=clamp(playSec,egp38Hold.start,seconds);
 n.d=Math.max(.001,end-egp38Hold.start);
 draw();
}

function egp38End(){
 if(!egp38Hold)return;

 egp38Advance();

 const n=notes[egp38Hold.index];

 if(n){
  const ending=egp42Nearest(n.t+n.d);
  n.d=Math.max(.01,ending-n.t);
  egp38LastLane=n.lane;
  egp38LastColor=n.color;
 }

 egp38Hold=null;

 el('egp33Rec').textContent=
  recArmed?'● REC ON':'● REC';

 draw();
}

document.addEventListener('keydown',e=>{
 if(e.key!=='ArrowDown')return;
 if(!document.body.classList.contains('egp-show-mode'))return;
 if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||''))return;
 if(e.metaKey||e.ctrlKey||e.altKey)return;

 e.preventDefault();
 e.stopImmediatePropagation();

 if(!e.repeat)egp38Start();
},true);

document.addEventListener('keyup',e=>{
 if(e.key!=='ArrowDown')return;
 if(!egp38Hold)return;

 e.preventDefault();
 e.stopImmediatePropagation();
 egp38End();
},true);

window.addEventListener('blur',egp38End);
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)egp38End();
});

el('egp29Stop')?.addEventListener(
 'click',egp38End,{capture:true}
);
el('egpExitShow')?.addEventListener(
 'click',egp38End,{capture:true}
);

function tick(now){if(document.body.classList.contains('egp-show-mode')){let s=el('egpShowTime')?.textContent||'';const m=/^(\d+):(\d+)\.(\d+)/.exec(s.trim());if(m){const t=Number(m[1])*60+Number(m[2])+Number('0.'+m[3]);if(Number.isFinite(t)&&Math.abs(playSec-t)>.016){playSec=t;draw()}}egp38Advance();egp35Preview();el('egp29Time').textContent=fmt(playSec);const nativeBtn=el('egpShowPlay');if(nativeBtn){const t=nativeBtn.textContent||'';el('egp29Play').textContent=/pausa|pause|❚❚|Ⅱ/i.test(t)?'Ⅱ Pausa':'▶ Play'}if(!audio&&fileInput?.files?.length)decodeFile(fileInput.files[0]);if(!lastFrame||now-lastFrame>800){lastFrame=now;draw()}}requestAnimationFrame(tick)}requestAnimationFrame(tick);
const resizer=new ResizeObserver(()=>{limit();scrollSync();draw()});resizer.observe(area);


// V0.32 · Carga robusta en Nuevo/Editar show; audio local por nombre de show.
const newPanel=el('newShowPanel'), showTitle=el('newShowTitle'), configCreate=el('createShow');
const audioPicker=document.createElement('div');
audioPicker.className='field egp32AudioField';
audioPicker.innerHTML='<label for="egp32ConfigAudio">Canción · Audio</label><input id="egp32ConfigAudio" type="file" accept="audio/*,.wav,.mp3,.m4a,.aac,.ogg" style="width:100%;max-width:100%;padding:10px;border:1px solid #36546a;border-radius:8px;background:#0a1928;color:#e9f8ff"/>';
const nameField=showTitle?.closest('.field');
if(nameField&&!el('egp32ConfigAudio'))nameField.insertAdjacentElement('afterend',audioPicker);
const configAudio=el('egp32ConfigAudio');

// V0.43 — click separado en Nuevo show.
const egp43ClickField=document.createElement('div');
egp43ClickField.className='field egp43ClickField';
egp43ClickField.innerHTML=
 '<label for="egp43ConfigClick">Click · Grid</label>'+
 '<input id="egp43ConfigClick" type="file" '+
 'accept="audio/*,.wav,.mp3,.m4a,.aac,.ogg" '+
 'style="width:100%;max-width:100%;padding:10px;'+
 'border:1px solid #36546a;border-radius:8px;'+
 'background:#0a1928;color:#e9f8ff"/>';

if(audioPicker.parentNode)
 audioPicker.insertAdjacentElement('afterend',egp43ClickField);

const configClick=el('egp43ConfigClick');
let pendingClick=null;

configClick?.addEventListener('change',()=>{
 pendingClick=configClick.files?.[0]||null;
});

let pendingFile=null,loadedShow='',storeDB=null,lastLoadToken=0;
function showKey(){return (el('showName')?.value||showTitle?.value||'').trim()}
function openAudioDB(){
 if(storeDB)return storeDB;
 storeDB=new Promise((resolve,reject)=>{
  const req=indexedDB.open('EGP_SHOW_LOCAL_AUDIO_V030',1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('audio'))req.result.createObjectStore('audio')};
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error);
 });return storeDB;
}
async function saveAudio(key,file){
 const db=await openAudioDB();return new Promise((resolve,reject)=>{
  const tx=db.transaction('audio','readwrite');tx.objectStore('audio').put(file,key);
  tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
 });
}
async function readAudio(key){
 const db=await openAudioDB();return new Promise((resolve,reject)=>{
  const req=db.transaction('audio','readonly').objectStore('audio').get(key);
  req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
 });
}
async function loadToNative(file){
 if(!file||!fileInput)return false;
 try{
  const dt=new DataTransfer();dt.items.add(file);
  fileInput.files=dt.files;
  // El reproductor oficial del Show escucha el cambio de este campo oculto.
  fileInput.dispatchEvent(new Event('change',{bubbles:true}));
  // El canvas analiza el mismo archivo para generar una onda detallada.
  await decodeFile(file);
  return true;
 }catch(error){console.error('[EGP Seq] No se pudo cargar la canción:',error);return false}
}
configAudio?.addEventListener('change',()=>{
 const file=configAudio.files?.[0]||null;
 if(file&&!file.type.startsWith('audio/')&&!/\.(mp3|wav|m4a|ogg|aac)$/i.test(file.name)){
  configAudio.value='';pendingFile=null;alert('Utiliza WAV, MP3, M4A, AAC u OGG.');return;
 }
 pendingFile=file;
});
configCreate?.addEventListener('click',()=>{
 const file=pendingFile;
 const click=pendingClick;
 if(!file&&!click)return;

 const enteredTitle=showTitle?.value.trim()||'';

 setTimeout(async()=>{
  const actual=showKey();

  if(!actual||
     (enteredTitle&&actual!==enteredTitle))return;

  try{
   if(file){
    await saveAudio(actual,file);
    loadedShow=actual;
    const ok=await loadToNative(file);
    if(ok){
     pendingFile=null;
     configAudio.value='';
    }
   }

   if(click){
    await saveAudio('CLICK::'+actual,click);
    await egp42LoadClick(click);
    pendingClick=null;
    configClick.value='';
   }

  }catch(e){
   console.error('[EGP] Error guardando audio o click',e);
   alert('No se pudo guardar uno de los archivos.');
  }
 },160);
},false);
async function restoreForCurrentShow(){
 const key=showKey();if(!key)return;
 const token=++lastLoadToken;
 try{
  const file=await readAudio(key);
  if(token!==lastLoadToken||showKey()!==key)return;
  if(file){loadedShow=key;await loadToNative(file)}
  else if(loadedShow!==key){
   audio=null;peakMin=null;peakMax=null;draw()
  }

  const clickFile=await readAudio('CLICK::'+key);

  if(token!==lastLoadToken||showKey()!==key)return;

  if(clickFile){
   if(egp42ClickName!==clickFile.name ||
      !egp42Beats.length)
    await egp42LoadClick(clickFile);
  }else{
   egp42Beats=[];
   egp42ClickName='';
   egp42Status.textContent='Sin click';
   draw();
  }
 }catch(e){console.warn('[EGP Seq] No se pudo recuperar el audio local:',e)}
}
// Cada entrada al modo Show restaura el audio porque su propio motor puede
// liberar previamente la URL de la canción durante el cambio de show.
const showObserver=new MutationObserver(()=>{
 if(document.body.classList.contains('egp-show-mode'))restoreForCurrentShow();
});
showObserver.observe(document.body,{attributes:true,attributeFilter:['class']});

syncEditor();scrollSync();draw();
})();
