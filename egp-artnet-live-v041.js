/* EGP Art-Net Live V0.41 */
(()=>{
'use strict';

const API='http://127.0.0.1:8766';
const bar=document.querySelector('#egpSeq29 .egp29bar');

if(!bar)return;

const arm=document.createElement('button');
const off=document.createElement('button');
const status=document.createElement('span');

arm.textContent='DMX ARMAR';
off.textContent='BLACKOUT';
status.textContent='DMX OFF';
status.style.cssText=
 'color:#9cb5cd;font:600 11px system-ui';

bar.append(arm,off,status);

let armed=false;
let busy=false;

const el=id=>document.getElementById(id);

function playing(){
 return /pausa|pause|❚❚|Ⅱ/i.test(
  el('egp29Play')?.textContent||''
 );
}

function time(){
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

 const frame=window.__EGP_SEQ_GET_FRAME_V040?.(
  time()
 );

 if(!frame?.active)return output;

 for(let lane=0;lane<2;lane++){
  const values=color(frame.lights[lane]);

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

arm.onclick=async()=>{
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
  status.textContent='SIN PUENTE';
  alert(
   'No se pudo conectar con el puente local Art-Net.'
  );
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
  await send('/frame',{
   channels:channels()
  });

  status.textContent=playing()
   ?'DMX EN VIVO'
   :'ARMADO · STOP';

 }catch(e){
  armed=false;
  arm.textContent='DMX ARMAR';
  arm.style.background='';
  status.textContent='CONEXIÓN PERDIDA';
  console.error('[EGP Art-Net]',e);
 }finally{
  busy=false;
 }
},100);

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
