/* EGP Art-Net Live V0.41 */
(()=>{
'use strict';

const API=(
 location.port==='8767' &&
 ['127.0.0.1','localhost'].includes(location.hostname)
) ? '/api/dmx' : 'http://127.0.0.1:8766';
const bar=document.querySelector('#egpSeq29 .egp29bar');

if(!bar)return;

const arm=document.createElement('button');
const off=document.createElement('button');
const status=document.createElement('span');

arm.type='button';
off.type='button';
arm.textContent='DMX ARMAR';
off.textContent='BLACKOUT';
status.textContent='DMX OFF';
status.style.cssText=
 'color:#9cb5cd;font:600 11px system-ui';

bar.append(arm,off,status);

// V0.50 — compensación anticipada.
const latencyBox=document.createElement('label');
latencyBox.style.cssText=
 'display:flex;align-items:center;gap:5px;'+
 'white-space:nowrap;font:11px system-ui;color:#cce3ed';

const latencyText=document.createElement('span');
latencyText.textContent='Anticipar DMX';

const latencyInput=document.createElement('input');
latencyInput.type='range';
latencyInput.min='0';
latencyInput.max='400';
latencyInput.step='10';
latencyInput.style.width='90px';
latencyInput.title='Anticipación de comandos DMX';

let leadMs=120;

try{
 const saved=Number(
  localStorage.getItem('EGP_DMX_LEAD_MS_V050')
 );
 if(Number.isFinite(saved)&&saved>=0&&saved<=400)
  leadMs=saved;
}catch(_){}

latencyInput.value=String(leadMs);

const latencyValue=document.createElement('strong');
latencyValue.textContent=leadMs+' ms';

latencyInput.addEventListener('input',()=>{
 leadMs=Number(latencyInput.value);
 latencyValue.textContent=leadMs+' ms';

 try{
  localStorage.setItem(
   'EGP_DMX_LEAD_MS_V050',
   String(leadMs)
  );
 }catch(_){}
});

latencyBox.append(
 latencyText,latencyInput,latencyValue
);
bar.append(latencyBox);

const mapping=document.createElement('span');
mapping.textContent='DMX: LUZ 1–2';
mapping.style.cssText=
 'font:10px system-ui;color:#a8bfd7;'+
 'white-space:nowrap';
mapping.title=
 'LUZ 1 → d001; LUZ 2 → d005. '+
 'Las pistas adicionales son solo virtuales.';
bar.append(mapping);


// V0.52: asignación de pistas a los dos PAR físicos.
let egp52Map=[0,1];

try{
 const stored=JSON.parse(
  localStorage.getItem('EGP_DMX_PAR_MAP_V052')||'null'
 );
 if(Array.isArray(stored)&&stored.length===2)
  egp52Map=stored.map(v=>
   Math.max(0,Math.min(15,Number(v)||0))
  );
}catch(_){}

// V0.53 — asignación compartida con el escenario 3D.
window.__EGP_DMX_PAR_MAPPING_V053=()=>{
 return egp52Map.slice();
};

const egp52Selectors=[];

for(let par=0;par<2;par++){
 const label=document.createElement('label');
 label.style.cssText=
  'display:flex;align-items:center;gap:3px;'+
  'white-space:nowrap;font:10px system-ui';

 label.textContent='PAR '+(par+1)+' ← ';

 const select=document.createElement('select');

 select.style.cssText=
  'background:#19344c;color:white;'+
  'border:1px solid #526a83;border-radius:5px;'+
  'padding:3px;max-width:90px';

 for(let lane=0;lane<16;lane++){
  select.add(new Option('LUZ '+(lane+1),String(lane)));
 }

 select.value=String(egp52Map[par]);

 select.onchange=()=>{
  egp52Map[par]=Number(select.value);
  localStorage.setItem(
   'EGP_DMX_PAR_MAP_V052',
   JSON.stringify(egp52Map)
  );
 };

 egp52Selectors.push(select);
 label.append(select);
 bar.append(label);
}

bar.style.overflowX='auto';
bar.style.flexWrap='nowrap';

let armed=false;
let busy=false;

const el=id=>document.getElementById(id);

function playing(){
 const clock=window.__EGP_SHOW_CLOCK_V050?.();
 if(clock)return !!clock.playing;

 return /pausa|pause|❚❚|Ⅱ/i.test(
  el('egp29Play')?.textContent||''
 );
}

function time(){
 const clock=window.__EGP_SHOW_CLOCK_V050?.();

 if(clock){
  return Math.max(0,clock.time);
 }

 const m=/^(\d+):(\d+)\.(\d+)/.exec(
  el('egp29Time')?.textContent||''
 );

 if(!m)return 0;

 return Number(m[1])*60+
        Number(m[2])+
        Number('0.'+m[3]);
}

function color(clip){
 if(!clip || clip.level<=0)return [0,0,0,0];

 const hex=clip.color||'#000000';

 if(!/^#[a-f0-9]{6}$/i.test(hex)){
  return [0,0,0,0];
 }

 const intensity=Math.max(
  0,Math.min(1,clip.level/100)
 )*.45;

 const r=parseInt(hex.slice(1,3),16);
 const g=parseInt(hex.slice(3,5),16);
 const b=parseInt(hex.slice(5,7),16);

 if(r===255&&g===255&&b===255){
  return [0,0,0,Math.round(255*intensity)];
 }

 return [
  Math.round(r*intensity),
  Math.round(g*intensity),
  Math.round(b*intensity),
  0
 ];
}

function channels(){
 const output=Array(8).fill(0);

 if(!playing())return output;

 const clock=window.__EGP_SHOW_CLOCK_V050?.();
 const rate=clock?.rate||1;

 const ahead=time()+leadMs/1000*rate;
 const previewTime=clock?.duration
  ?Math.min(ahead,clock.duration)
  :ahead;

 const frame=window.__EGP_SEQ_GET_FRAME_V040?.(
  previewTime
 );

 if(!frame?.active)return output;

 for(let lane=0;lane<2;lane++){
  const values=color(frame.lights[egp52Map[lane]]);

  for(let i=0;i<4;i++){
   output[lane*4+i]=values[i];
  }
 }

 return output;
}

async function send(path,body){
 const r=await fetch(API+path,{
  method:'POST',
  mode:'cors',
  cache:'no-store',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify(body),
  signal:AbortSignal.timeout(750)
 });

 if(!r.ok)throw Error('HTTP '+r.status);
 return r.json();
}

async function blackout(){
 armed=false;
 arm.textContent='DMX ARMAR';
 arm.style.background='';
 status.textContent='DMX OFF';

 try{
  await send('/blackout',{});
 }catch(e){
  status.textContent='SIN CONEXIÓN';
 }
}

arm.onclick=async(event)=>{
 event.preventDefault();
 event.stopPropagation();

 if(armed){
  await blackout();
  return;
 }

 arm.disabled=true;

 try{
  const r=await fetch(API+'/health',{
   cache:'no-store',
   signal:AbortSignal.timeout(1500)
  });

  if(!r.ok)throw Error('Sin puente');

  armed=true;
  arm.textContent='DMX DESARMAR';
  arm.style.background='#a35020';
  status.textContent='ARMADO';

 }catch(e){
  armed=false;
  status.textContent='SIN PUENTE';
  status.style.color='#ffb778';
  status.title='No se pudo conectar con '+API+
   ' · '+String(e.message||e);
  console.error('[EGP DMX ARMAR]',e);
 }finally{
  arm.disabled=false;
 }
};

off.onclick=blackout;

setInterval(async()=>{
 if(!armed||busy)return;

 if(!document.body.classList.contains('egp-show-mode')){
  await blackout();
  return;
 }

 busy=true;

 try{
  const output=channels();

  await send('/frame',{
   channels:output
  });

  const nonzero=output.filter(v=>v>0).length;

  status.textContent=playing()
   ?'DMX +'+leadMs+' ms · '+nonzero+'/8 canales'
   :'ARMADO · STOP';

  status.title=
   'PAR 1: LUZ 1, canales DMX 1–4. '+
   'PAR 2: LUZ 2, canales DMX 5–8. '+
   'LUZ 3–8 sin salida física configurada.';

 }catch(e){
  armed=false;
  arm.textContent='DMX ARMAR';
  arm.style.background='';
  status.textContent='CONEXIÓN PERDIDA';
  status.style.color='#ff9e9e';
  status.title='Puente local: '+API+
   ' · '+String(e.name||'Error')+
   ' · '+String(e.message||e);
  console.error('[EGP Art-Net]',e);
 }finally{
  busy=false;
 }
},25);

window.addEventListener('pagehide',()=>{
 if(armed){
  navigator.sendBeacon(
   API+'/blackout',
   new Blob(['{}'],{
    type:'application/json'
   })
  );
 }
});

})();
