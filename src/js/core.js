(()=>{
/* ===== personaggi ===== */
const BASE_CHARS={
  pietro:{name:'Pietro',img:'__PIETRO__'},
  zibi:{name:'Zibi',img:'__ZIBI__'},
  vecio:{name:'Il Vecio',img:'__VECIO__'}
};
let CHARS={};
function loadChars(){
  CHARS=Object.assign({},BASE_CHARS);
  try{const a=JSON.parse(localStorage.getItem('mg-players')||'[]');a.forEach(p=>{if(p&&p.id&&p.img)CHARS[p.id]={name:p.name||'Giocatore',img:p.img,custom:true};});}catch(e){}
}
function saveCustom(){try{localStorage.setItem('mg-players',JSON.stringify(Object.entries(CHARS).filter(([k,v])=>v.custom).map(([id,v])=>({id,name:v.name,img:v.img}))));}catch(e){}}
loadChars();
const LEVELS=[
  {n:1,name:'Principiante',N:20,na:2.6,np:12,top:5,ref:0},
  {n:2,name:'Dilettante',N:45,na:1.5,np:8,top:3,ref:0},
  {n:3,name:'Giocatore',N:90,na:0.8,np:5,top:2,ref:0},
  {n:4,name:'Esperto',N:150,na:0.4,np:3,top:1,ref:6},
  {n:5,name:'Maestro',N:240,na:0.15,np:1.5,top:1,ref:12}
];

/* ===== misure reali (1 unità = 2,84 mm: piano 2840 x 1420 mm = 1000 x 500) ===== */
const MM=2.84,PW=1000,PH=500,DIA=PW/8;
const RB=30.5/MM;            /* biglia 61 mm */
const PR=5/MM;               /* birillo: base 10 mm */
const DPIN=66/MM;            /* interasse birilli 66 mm */
const SPOT=100/MM;           /* bollini a 10 cm dalla sponda corta */
const CUSH=50/MM,WOOD=95/MM, RW=CUSH+WOOD; /* sponda: gomma + legno = 14,5 cm */
const FR=270,DT=1/240,KEYS=['w','y','r'];
const GAMES={
  gor:{id:'gor',name:'Goriziana',full:'Goriziana · 9 birilli',reg:'regolamento FIBIS',col:{w:'#f3ecdc',y:'#dfae3a',r:'#b3262a'},pr:RB,
    bn:{w:'bianca',y:'gialla',r:'pallino rosso'},targets:[100,200,300,400],def:400},
  ita:{id:'ita',name:'Italiana',full:'Italiana · 5 birilli',reg:'regolamento FIBIS',col:{w:'#f3ecdc',y:'#dfae3a',r:'#b3262a'},pr:RB,
    bn:{w:'bianca',y:'gialla',r:'pallino rosso'},targets:[40,60,80,100],def:60}
};
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
cv.width=Math.round(PW+2*RW);cv.height=Math.round(PH+2*RW);
const $=id=>document.getElementById(id);
const fmt=(n,d=1)=>n.toFixed(d).replace('.',',');
const C0={x:PW/2,y:PH/2};

/* ===== stato ===== */
let mode='train',S=null,trainS=null,trainSnap=null,match=null,trainGame='gor';
let angle=0,power=40,sx=0,sy=0,moving=false,cueAnim=null,acc=0,thinking=false;
let inHand=null,dragBall=null,aiming=false,pred=null,predKey='',tipKey='',advKey='',adv=null;
let setupSel={me:'zibi',opp:'pietro',level:3,game:'gor',target:400};
const gid=()=>S?S.game:(mode==='match'&&match?match.game:trainGame);
const GM=()=>GAMES[gid()];
const COL=k=>GM().col[k];
const BN=k=>GM().bn[k];

function makePins(g){
  const p=[{x:C0.x,y:C0.y,t:'red',up:true}];
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{
    if(g==='gor'){p.push({x:C0.x+a*DPIN,y:C0.y+b*DPIN,t:'int',up:true});p.push({x:C0.x+a*2*DPIN,y:C0.y+b*2*DPIN,t:'ext',up:true});}
    else p.push({x:C0.x+a*DPIN,y:C0.y+b*DPIN,t:'ext',up:true});
  });
  return p;
}
const ball=(x,y,r)=>({x,y,r,vx:0,vy:0,side:0,fol:0});
function freshTable(g){
  const G=GAMES[g];
  return{game:g,balls:{w:ball(230,340,RB),y:ball(PW-SPOT,PH/2,RB),r:ball(PW*0.75,PH/2,G.pr)},pins:makePins(g),ev:null};
}
const turnIdx=()=>mode==='match'&&match?match.turn:0;
const me=()=>turnIdx()?'y':'w', opp=()=>turnIdx()?'w':'y';
const isCpuTurn=()=>mode==='match'&&match&&!match.over&&match.players[match.turn].cpu;
const busy=()=>moving||!!cueAnim||thinking;

function setAngle(deg){angle=((deg%360)+360)%360;$('ang').value=angle.toFixed(1);$('angOut').textContent=fmt(angle)+'°';}
function setPower(p){power=Math.max(5,Math.min(100,Math.round(p)));$('pow').value=power;$('powOut').textContent=power;}
function setSpin(a,b){sx=Math.round(a*20)/20;sy=Math.round(b*20)/20;
  const m=Math.hypot(sx,sy),k=m>1?1/m:1;
  $('spDot').setAttribute('cx',sx*k*43);$('spDot').setAttribute('cy',-sy*k*43);
  $('spH').value=Math.round(sx*100);$('spV').value=Math.round(sy*100);
  const p=[];if(sy>0.04)p.push('alto '+Math.round(sy*100)+'%');if(sy<-0.04)p.push('basso '+Math.round(-sy*100)+'%');if(sx>0.04)p.push('destra '+Math.round(sx*100)+'%');if(sx<-0.04)p.push('sinistra '+Math.round(-sx*100)+'%');
  $('spinOut').textContent=p.length?p.join(', '):'centro';}
function aimAtOpp(){const a=S.balls[me()],b=S.balls[opp()];setAngle(Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI);}
function msg(h){$('msg').innerHTML=h;}
const halfOf=x=>x<PW/2?0:1;

/* ===== fisica: un solo motore per tiro, previsione, consigli e computer ===== */
const speedOf=p=>150+p/100*2250;
function launch(st,P){
  const b=st.balls[P.shooter],a=P.angle*Math.PI/180,v=speedOf(P.power),o=P.shooter==='w'?'y':'w';
  b.vx=Math.cos(a)*v;b.vy=Math.sin(a)*v;b.side=P.sx;b.fol=P.sy;
  st.ev={shooter:P.shooter,opp:o,first:null,firstContact:null,railsBefore:[],pins:[],pinsBeforeFirst:false,
    oppRail:false,oppPal:false,palBy:null,palFirstLegit:null,palRail:false,palTouched:false,
    half0:{w:halfOf(st.balls.w.x),y:halfOf(st.balls.y.x)},crossed:{w:false,y:false},castleStop:false};
}
function step(st){
  const e=st.ev;
  for(const k of KEYS){const b=st.balls[k],s=Math.hypot(b.vx,b.vy);
    if(s>0){const d=FR*DT;if(s<=d){b.vx=b.vy=0;}else{b.vx*=(s-d)/s;b.vy*=(s-d)/s;}}
    else continue;
    b.side*=1-0.25*DT;b.fol*=1-0.35*DT;
    b.x+=b.vx*DT;b.y+=b.vy*DT;
    let hit=null;const r=b.r;
    if(b.x<r){b.x=r;if(rail(b,-1,0))hit='short';} if(b.x>PW-r){b.x=PW-r;if(rail(b,1,0))hit='short';}
    if(b.y<r){b.y=r;if(rail(b,0,-1))hit='long';} if(b.y>PH-r){b.y=PH-r;if(rail(b,0,1))hit='long';}
    if(hit){if(k===e.shooter&&!e.first)e.railsBefore.push(hit);if(k===e.opp&&e.first)e.oppRail=true;if(k==='r')e.palRail=true;}
    if(k!=='r'&&halfOf(b.x)!==e.half0[k])e.crossed[k]=true;
    for(const p of st.pins){if(p.up&&Math.abs(p.x-b.x)<r+PR&&Math.hypot(p.x-b.x,p.y-b.y)<r+PR){p.up=false;
      let cls='ok';
      if(k===e.shooter){cls='own';if(!e.first)e.pinsBeforeFirst=true;}
      else if(k===e.opp){if(!e.oppRail&&!e.oppPal)cls='fisso';}
      else if(e.palBy===e.opp&&!e.palRail)cls='falsofisso';
      e.pins.push({t:p.t,by:k,cls});b.vx*=0.97;b.vy*=0.97;}}
  }
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)collide(st,KEYS[i],KEYS[j]);
}
function rail(b,nx,ny){
  const vn=b.vx*nx+b.vy*ny;if(vn<=0)return false;
  b.vx-=(1+0.78)*vn*nx;b.vy-=(1+0.78)*vn*ny;
  const k=0.5*b.side*vn;b.vx+=-k*ny;b.vy+=k*nx;b.side*=0.55;return true;
}
function collide(st,ka,kb){
  const a=st.balls[ka],b=st.balls[kb],rs=a.r+b.r;let dx=b.x-a.x,dy=b.y-a.y;
  if(Math.abs(dx)>=rs||Math.abs(dy)>=rs)return;
  const d=Math.hypot(dx,dy);if(d>=rs||d===0)return;const nx=dx/d,ny=dy/d,ov=rs-d;
  a.x-=nx*ov/2;a.y-=ny*ov/2;b.x+=nx*ov/2;b.y+=ny*ov/2;
  const rel=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(rel<=0)return;
  const pre={a:{vx:a.vx,vy:a.vy},b:{vx:b.vx,vy:b.vy}};
  const j=rel*(1+0.96)/2;a.vx-=j*nx;a.vy-=j*ny;b.vx+=j*nx;b.vy+=j*ny;
  const sTot=a.side+b.side;
  if(Math.abs(sTot)>0.01){const tx=ny,ty=-nx,tk=0.07*Math.max(-1,Math.min(1,sTot))*j;
    b.vx+=tk*tx;b.vy+=tk*ty;a.vx-=tk*tx;a.vy-=tk*ty;const T=0.2*sTot;a.side-=T;b.side-=T;}
  for(const [o,k] of [[a,'a'],[b,'b']]){if(Math.abs(o.fol)>0.02){const s=Math.hypot(pre[k].vx,pre[k].vy);if(s>1){o.vx+=pre[k].vx*o.fol*0.36;o.vy+=pre[k].vy*o.fol*0.36;}o.fol=0;}}
  const e=st.ev,pair=[ka,kb];
  if(!e.firstContact&&pair.includes(e.shooter))e.firstContact={x:st.balls[e.shooter].x,y:st.balls[e.shooter].y};
  if(pair.includes(e.shooter)&&!e.first)e.first=pair.find(x=>x!==e.shooter);
  if(pair.includes('r')){const other=pair.find(x=>x!=='r');e.palTouched=true;if(!e.palBy)e.palBy=other;
    if(e.first===e.opp&&!e.palFirstLegit)e.palFirstLegit=other;if(other===e.opp)e.oppPal=true;}
}
const still=st=>KEYS.every(k=>Math.abs(st.balls[k].vx)+Math.abs(st.balls[k].vy)<3);
function stopAll(st){KEYS.forEach(k=>{st.balls[k].vx=st.balls[k].vy=0;});}
function finishEv(st){const e=st.ev;e.castleStop=['w','y'].some(k=>Math.hypot(st.balls[k].x-C0.x,st.balls[k].y-C0.y)<2*DPIN+RB&&e.pins.some(p=>p.by===k));}
function cloneTable(st){return{game:st.game,balls:{w:{...st.balls.w},y:{...st.balls.y},r:{...st.balls.r}},pins:st.pins.map(p=>({...p})),ev:null};}
function simulate(P,place,record){
  const st=cloneTable(S);if(place){st.balls[P.shooter].x=place.x;st.balls[P.shooter].y=place.y;}
  launch(st,P);
  const paths=record?{w:[[st.balls.w.x,st.balls.w.y]],y:[[st.balls.y.x,st.balls.y.y]],r:[[st.balls.r.x,st.balls.r.y]]}:null,moved={w:false,y:false,r:false};
  let n=0;
  while(n<240*25){step(st);n++;
    if(record&&n%3===0)KEYS.forEach(k=>{const b=st.balls[k];if(b.vx||b.vy){moved[k]=true;paths[k].push([b.x,b.y]);}});
    if(still(st))break;}
  stopAll(st);finishEv(st);
  if(record)KEYS.forEach(k=>paths[k].push([st.balls[k].x,st.balls[k].y]));
  return{st,paths,moved,ev:st.ev,fallen:st.pins.filter(p=>!p.up)};
}
const curParams=()=>({shooter:me(),angle,power,sx,sy});

/* ===== regole ===== */
const plural=(n,a,b)=>n+' '+(n>1?b:a);
function pinCount(list,g){
  const ext=list.filter(p=>p.t==='ext').length,int=list.filter(p=>p.t==='int').length,red=list.some(p=>p.t==='red');
  let pts=0;const parts=[];
  if(g==='gor'){
    if(ext){pts+=ext*2;parts.push(plural(ext,'esterno da 2','esterni da 2'));}
    if(int){pts+=int*8;parts.push(plural(int,'interno da 8','interni da 8'));}
    if(red){const v=(ext+int)?10:30;pts+=v;parts.push('rosso '+v+((ext+int)?'':' da solo'));}
  }else{
    if(ext){pts+=ext*2;parts.push(plural(ext,'birillo bianco da 2','birilli bianchi da 2'));}
    if(red){const v=ext?4:10;pts+=v;parts.push('rosso '+v+(ext?'':' da solo'));}
  }
  return{pts,parts};
}
/* Goriziana e Italiana: regolamento FIBIS per la stecca. */
/* punti negativi: si spiega chi ha abbattuto cosa, perché il totale del tiro va tutto all'avversario */
function pinNames(list,g){const ext=list.filter(p=>p.t==='ext').length,int=list.filter(p=>p.t==='int').length,red=list.some(p=>p.t==='red'),o=[];
  if(ext)o.push(plural(ext,g==='gor'?'esterno':'bianco',g==='gor'?'esterni':'bianchi'));if(int)o.push(plural(int,'interno','interni'));if(red)o.push('il rosso');return o.join(', ');}
function negResult(e,g,pts,parts){
  const mine=e.pins.filter(p=>p.by===e.shooter),other=e.pins.filter(p=>p.by!==e.shooter);
  const det=['con la tua bilia: '+pinNames(mine,g)];
  if(other.length)det.push('con le altre bilie: '+pinNames(other,g));
  det.push('valore: '+parts.join(', '));
  const text=other.length?'Punti all\'avversario: la tua bilia ha abbattuto birilli, e quando un tiro fa punti buoni e cattivi insieme il totale va all\'avversario':'Punti all\'avversario: la tua bilia ha abbattuto birilli';
  return{to:'opp',pts,parts:det,text,foul:'neg',pen:0};
}
function evaluate(e,g){
  g=g||gid();
  const pc=pinCount(e.pins,g);
  if(g==='gor'){
    /* FIBIS, stecca: art. 24 (falli), 29 (tiro indiretto), 30 (birilli), 31 (pallino) */
    /* indiretto solo se la tua bilia tocca una sponda e POI colpisce l'avversaria, senza aver prima abbattuto birilli */
    const ind=e.first===e.opp&&e.railsBefore.length>0&&!e.pinsBeforeFirst,mult=ind?2:1;
    let f=null;
    if(!e.first)f={code:'miss',pen:2,text:'Fallo: bilia avversaria mancata'};
    else if(e.first==='r')f={code:'pal',pen:4,text:'Fallo: prima il pallino'};
    else if(e.pinsBeforeFirst)f={code:'pins',pen:2,text:'Fallo: birilli abbattuti prima della bilia avversaria'};
    let pts=pc.pts*mult;const parts=pc.parts.slice();
    if(f){if(ind&&pc.pts)parts.push('birilli doppi di sponda');
      if(e.palTouched&&f.code!=='pal'){pts+=2;parts.push('pallino 2');}
      return{to:'opp',pts:pts+f.pen,parts:['penalità '+f.pen].concat(parts),text:f.text,foul:f.code,pen:f.pen,inHand:true,offer:true};}
    if(e.palFirstLegit){const v=6*mult;pts+=v;parts.push('pallino '+v);}
    if(ind&&(pc.pts||e.palFirstLegit))parts.push('doppio: tiro indiretto');
    if(e.pins.some(p=>p.cls==='own'))return negResult(e,g,pts,parts);
    const kind=ind?'Tiro indiretto':'Tiro diretto';
    return{to:'me',pts,parts,text:pts?kind+': '+parts.join(', '):'Tiro valido, nessun punto',kind};
  }
  /* italiana */
  let f=null;
  if(!e.first)f={code:'miss',pen:2,text:'Fallo: bilia avversaria mancata'};
  else if(e.first==='r')f={code:'pal',pen:4,text:'Fallo: prima il pallino'};
  else if(e.pinsBeforeFirst)f={code:'pins',pen:2,text:'Fallo: birilli abbattuti prima della bilia avversaria'};
  if(f){let pts=pc.pts+f.pen;const parts=['penalità '+f.pen].concat(pc.parts);if(e.palTouched){pts+=2;parts.push('pallino 2');}
    return{to:'opp',pts,parts,text:f.text,foul:f.code,pen:f.pen,inHand:true,offer:true};}
  let pts=pc.pts;const parts=pc.parts.slice();
  if(e.palFirstLegit){const v=e.palFirstLegit===e.shooter?4:3;pts+=v;parts.push('pallino '+v);}
  if(e.pins.some(p=>p.cls==='own'))return negResult(e,g,pts,parts);
  const kind=e.railsBefore.length?'Tiro di sponda':'Tiro diretto';
  return{to:'me',pts,parts,text:pts?kind+': '+parts.join(', '):'Tiro valido, nessun punto',kind};
}
const cpuValue=r=>r.to==='me'?r.pts+(r.pts?0:0.2):-(r.pts+(r.inHand||r.offer?3:0));

/* ===== input mira e trascinamento ===== */
function toPlay(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*cv.width-RW,y:(e.clientY-r.top)/r.height*cv.height-RW};}
function freeSpot(k,x,y){
  const rk=S.balls[k].r;
  for(const q of KEYS)if(q!==k&&Math.hypot(x-S.balls[q].x,y-S.balls[q].y)<rk+S.balls[q].r+1)return false;
  for(const pn of S.pins)if(Math.hypot(x-pn.x,y-pn.y)<rk+PR+2)return false;
  return true;}
const clampHalf=(x,h)=>h?Math.max(PW/2+RB,Math.min(PW-RB,x)):Math.max(RB,Math.min(PW/2-RB,x));
const allowedHalf=()=>1-halfOf(S.balls[inHand.op].x);
cv.addEventListener('pointerdown',e=>{
  if(busy()||isCpuTurn()||(mode==='match'&&(!match||match.over)))return;
  cv.setPointerCapture(e.pointerId);const p=toPlay(e);
  const grab=mode==='train'?KEYS:(inHand?[inHand.me]:[]);
  let best=null,bd=RB*2.8;for(const k of grab){const d=Math.hypot(p.x-S.balls[k].x,p.y-S.balls[k].y);if(d<bd){bd=d;best=k;}}
  if(best){dragBall=best;return;}
  aiming=true;aimTo(e);});
cv.addEventListener('pointermove',e=>{if(dragBall)dragTo(e);else if(aiming)aimTo(e);});
cv.addEventListener('pointerup',()=>{aiming=false;dragBall=null;});
cv.addEventListener('pointercancel',()=>{aiming=false;dragBall=null;});
function aimTo(e){const p=toPlay(e),b=S.balls[me()];if(Math.hypot(p.x-b.x,p.y-b.y)<4)return;setAngle(Math.atan2(p.y-b.y,p.x-b.x)*180/Math.PI);}
function dragTo(e){const p=toPlay(e),r=S.balls[dragBall].r;let x=Math.max(r,Math.min(PW-r,p.x)),y=Math.max(r,Math.min(PH-r,p.y));
  if(mode==='match')x=clampHalf(x,allowedHalf());
  if(!freeSpot(dragBall,x,y))return;S.balls[dragBall].x=x;S.balls[dragBall].y=y;
  if(dragBall===me()||dragBall===opp())aimAtOpp();}
$('ang').addEventListener('input',e=>setAngle(+e.target.value));
$('aL').onclick=()=>setAngle(angle-0.2);$('aR').onclick=()=>setAngle(angle+0.2);
$('pow').addEventListener('input',e=>setPower(+e.target.value));
$('spH').addEventListener('input',e=>setSpin(+e.target.value/100,sy));
$('spV').addEventListener('input',e=>setSpin(sx,+e.target.value/100));
$('spC').onclick=()=>setSpin(0,0);

/* ===== tiro ===== */
$('shoot').onclick=()=>{if(busy()||isCpuTurn())return;if(mode==='match'&&(!match||match.over))return;fire();};
function fire(){
  if(mode==='train')trainSnap={w:{...S.balls.w},y:{...S.balls.y},r:{...S.balls.r},angle,power,sx,sy};
  if(match)match.offer=null;showOffer();
  inHand=null;dragBall=null;cueAnim={t:0};
}
function strike(){launch(S,curParams());moving=true;acc=0;if(mode==='train')msg('…');}

/* ===== fine tiro ===== */
function settle(){
  moving=false;finishEv(S);const g=S.game,r=evaluate(S.ev,g);S.pins=makePins(g);
  if(mode==='train'){
    if(r.to==='me'){msg(r.pts?'<b>+'+r.pts+' punti</b> · '+r.text+'.':r.text+'.');if(r.pts)popup(CHARS.zibi.img,'+'+r.pts,'punti',r.parts);}
    else{msg('<b>'+r.text+':</b> '+r.pts+' punti all\'avversario ('+r.parts.join(', ')+').');popup(CHARS.vecio.img,'Cin cin!','+'+r.pts+' all\'avversario',r.parts,true);}
    tipKey='';advKey='';aimAtOpp();setSpin(0,0);return;
  }
  const t=match.turn,o=1-t,P=match.players,nm=i=>CHARS[P[i].char].name;
  if(r.to==='me'){match.score[t]+=r.pts;msg(r.pts?'<b>+'+r.pts+' a '+nm(t)+'</b> · '+r.text+'.':nm(t)+': '+r.text.toLowerCase()+'.');
    if(r.pts)popup(CHARS[P[t].char].img,'+'+r.pts,'punti a '+nm(t),r.parts);}
  else{match.score[o]+=r.pts;msg('<b>'+r.text+':</b> '+r.pts+' punti a '+nm(o)+' ('+r.parts.join(', ')+').');
    popup(CHARS.vecio.img,'Cin cin!',nm(t)+' beve: +'+r.pts+' a '+nm(o),r.parts,true);}
  match.turn=o;match.offer=null;
  const mk={me:o?'y':'w',op:t?'y':'w'};
  if(r.inHand){inHand=mk;placeInHand();match.offer='bollino';}
  else inHand=null;
  if(!P[o].cpu){
    if(inHand)msg($('msg').innerHTML+' '+nm(o)+' ha la bilia libera: mettila nella metà illuminata.');
  }
  updateScore();showOffer();
  const win=match.score.findIndex(s=>s>=match.target);
  if(win>=0){match.over=true;showWin(win);return;}
  aimAtOpp();setSpin(0,0);
  if(isCpuTurn())laterCpu(700);
}
function placeInHand(){
  const m=S.balls[inHand.me],h=allowedHalf();if(halfOf(m.x)===h&&freeSpot(inHand.me,m.x,m.y))return;
  const xs=h?PW*0.75:PW*0.25;
  for(const [a,b] of [[PW-m.x,m.y],[xs,PH*0.68],[xs,PH*0.32],[xs,PH/2],[h?PW*0.9:PW*0.1,PH*0.68]]){const x=clampHalf(a,h);if(freeSpot(inHand.me,x,b)){m.x=x;m.y=b;return;}}
}
/* penitenze: goriziana art. 12 (centrale del quadrante opposto al pallino), italiana art. 18.5 (bollino di partenza) */
function showOffer(){
  const bar=$('offerBar');const ok=mode==='match'&&match&&match.offer&&!match.over&&!isCpuTurn()&&!busy();
  bar.hidden=!ok;if(!ok)return;
  $('offerBtn').textContent=match.offer==='centrale'?'Bersaglio in penitenza centrale':'Bilia avversaria sul bollino';
  $('offerTxt').textContent=match.offer==='centrale'?'Dopo il fallo puoi spostare la biglia avversaria nella penitenza centrale del quadrante opposto al pallino (art. 12).':'Dopo il fallo puoi far mettere la bilia avversaria sul bollino di partenza (art. 18).';
}
$('offerBtn').onclick=()=>{
  if(!match||!match.offer||busy())return;
  const tk=inHand?inHand.op:opp(),pal=S.balls.r,b=S.balls[tk];
  let x,y=PH/2;
  if(match.offer==='centrale')x=halfOf(pal.x)?PW*0.25:PW*0.75;else x=PW-SPOT;
  for(const dy of [0,30,-30,60,-60]){if(freeSpot(tk,x,y+dy)){b.x=x;b.y=y+dy;break;}}
  match.offer=null;showOffer();if(inHand)placeInHand();aimAtOpp();predKey='';
  msg('Biglia avversaria spostata in penitenza.');
};

/* ===== cin cin ===== */
let cinT=null;
function popup(img,title,line,parts,foul){const c=$('cin');$('cinImg').src=img;$('cinT').textContent=title;$('cinPts').textContent=line;$('cinD').textContent=(parts||[]).join(' · ');c.classList.toggle('foul',!!foul);c.classList.add('show');clearTimeout(cinT);cinT=setTimeout(()=>c.classList.remove('show'),foul?2800:2300);}

/* ===== computer ===== */
let gen=0;
function laterCpu(ms){const g=gen;setTimeout(()=>{if(g===gen)cpuPlay();},ms);}
function cancelAll(){gen++;moving=false;cueAnim=null;thinking=false;acc=0;dragBall=null;aiming=false;predKey='';tipKey='';advKey='';if(V3.ok){V3.hintKey='';V3.aimKey='';V3.snap=true;}}
function finishNow(){
  gen++;thinking=false;
  if(cueAnim){cueAnim=null;strike();}
  let n=0;while(moving&&n<240*40){step(S);n++;if(still(S)){stopAll(S);settle();}}
  if(moving){stopAll(S);settle();}
  gen++;
}
function cpuPlay(){
  const g=gen;
  if(!isCpuTurn()||busy())return;
  const L=LEVELS[match.players[match.turn].level-1],sh=me(),op=opp();thinking=true;showOffer();
  $('turn').innerHTML=GM().name+' a '+match.target+'<b>'+CHARS[match.players[match.turn].char].name+' studia il tiro…</b>';
  let places=[null];
  if(inHand){const h=allowedHalf();places=[];for(let i=0;i<8;i++){const x=clampHalf(PW*(h?0.55:0.05)+Math.random()*PW*0.4,h),y=RB+Math.random()*(PH-2*RB);if(freeSpot(sh,x,y))places.push({x,y});}if(!places.length)places=[null];}
  const cands=[];
  for(let i=0;i<L.N;i++){
    const place=places[i%places.length],W=place||S.balls[sh],O=S.balls[op];
    let a;
    if(Math.random()<0.7){const dx=O.x-W.x,dy=O.y-W.y,d=Math.hypot(dx,dy),mx=Math.asin(Math.min(1,2*RB/d));a=Math.atan2(dy,dx)+(Math.random()*1.9-0.95)*mx;}
    else a=Math.random()*Math.PI*2;
    const spin=Math.random()<0.5;
    cands.push({place,P:{shooter:sh,angle:a*180/Math.PI,power:20+Math.random()*70,sx:spin?(Math.random()*1.2-0.6):0,sy:spin?(Math.random()*1.2-0.6):0}});
  }
  if(L.n>=2)for(const place of places){const W=place||S.balls[sh];for(const so of plans(sh,W)){
    for(let k=0;k<(L.n>=4?6:3);k++)cands.push({place,P:{shooter:sh,angle:so.ang+(Math.random()-0.5)*0.8,power:Math.max(10,Math.min(100,so.pow+(Math.random()-0.5)*16)),sx:0,sy:k%2?-0.3:0}});}}
  let i=0;const scored=[];
  function chunk(){
    if(g!==gen)return;
    const end=Math.min(cands.length,i+8);
    for(;i<end;i++){const c=cands[i];c.v=cpuValue(evaluate(simulate(c.P,c.place,false).ev));scored.push(c);}
    if(i<cands.length){setTimeout(chunk,0);return;}
    scored.sort((a,b)=>b.v-a.v);
    if(L.ref){const top=scored.slice(0,4);for(const c of top)for(let k=0;k<L.ref;k++){
      const P={...c.P,angle:c.P.angle+(Math.random()-0.5)*1.2,power:Math.max(10,Math.min(100,c.P.power+(Math.random()-0.5)*10))};
      const v=cpuValue(evaluate(simulate(P,c.place,false).ev));scored.push({place:c.place,P,v});}
      scored.sort((a,b)=>b.v-a.v);}
    const pick=scored[Math.floor(Math.random()*Math.min(L.top,scored.length))];
    if(pick.place){S.balls[sh].x=pick.place.x;S.balls[sh].y=pick.place.y;}
    const gauss=()=>{let u=0;for(let q=0;q<4;q++)u+=Math.random();return (u-2)/0.58;};
    setAngle(pick.P.angle+gauss()*L.na);setPower(pick.P.power*(1+gauss()*L.np/100));setSpin(pick.P.sx,pick.P.sy);
    thinking=false;setTimeout(()=>{if(g===gen&&isCpuTurn()&&!busy())fire();},650);
  }
  setTimeout(chunk,30);
}

/* ===== geometria per i consigli ===== */
function segDist(p,a,b){const vx=b.x-a.x,vy=b.y-a.y,L=vx*vx+vy*vy;let t=L?((p.x-a.x)*vx+(p.y-a.y)*vy)/L:0;t=Math.max(0,Math.min(1,t));return Math.hypot(p.x-a.x-vx*t,p.y-a.y-vy*t);}
function blocked(a,b,skip,rad,ignoreCastle){
  for(const pn of S.pins){if(ignoreCastle&&Math.hypot(pn.x-C0.x,pn.y-C0.y)<2*DPIN+1)continue;if(segDist(pn,a,b)<rad+PR+1)return 'pin';}
  for(const k of KEYS){if(skip.includes(k))continue;if(segDist(S.balls[k],a,b)<rad+S.balls[k].r+0.5)return k;}
  return null;}
const degOf=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
const unit=(x,y)=>{const m=Math.hypot(x,y)||1;return{x:x/m,y:y/m};};
function cutDeg(dirIn,u){const d=unit(dirIn.x,dirIn.y);return Math.acos(Math.max(-1,Math.min(1,d.x*u.x+d.y*u.y)))*180/Math.PI;}
function powerFor(travel,cut,objDist,rails){
  const vo=Math.sqrt(2*FR*(objDist+60));
  let vw=vo/(Math.max(0.25,Math.cos(cut*Math.PI/180))*0.98);
  if(rails)vw/=Math.pow(0.85,rails);
  const v0=Math.sqrt(vw*vw+2*FR*travel);
  return Math.max(15,Math.min(100,Math.round(((v0-150)/2250*100)/5)*5));
}
/* sponde: linea del centro biglia (a un raggio dal becco). Lettura dei diamanti in perpendicolare: lunghe 0-8 da sinistra, corte 0-4 dall'alto */
const RAILS=[
  {id:'top',name:'sponda lunga in alto',type:'long',axis:'y',v:RB,read:p=>p.x/DIA},
  {id:'bot',name:'sponda lunga in basso',type:'long',axis:'y',v:PH-RB,read:p=>p.x/DIA},
  {id:'lft',name:'sponda corta a sinistra',type:'short',axis:'x',v:RB,read:p=>p.y/DIA},
  {id:'rgt',name:'sponda corta a destra',type:'short',axis:'x',v:PW-RB,read:p=>p.y/DIA}
];
/* specchio corretto per la sponda del gioco: restituisce il 78% della velocità perpendicolare, quindi il punto virtuale sta a d/0,78 oltre la sponda */
const ERAIL=0.78;
const mirror=(p,rl)=>rl.axis==='y'?{x:p.x,y:rl.v+(rl.v-p.y)/ERAIL}:{x:rl.v+(rl.v-p.x)/ERAIL,y:p.y};
function railHit(a,b,rl){/* segmento a->b (b specchiato) incontra la sponda */
  const dd=rl.axis==='y'?b.y-a.y:b.x-a.x;if(Math.abs(dd)<1e-6)return null;
  const t=rl.axis==='y'?(rl.v-a.y)/dd:(rl.v-a.x)/dd;if(t<=0.002||t>=0.9995)return null;
  const P={x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)};
  if(P.x<RB-0.5||P.x>PW-RB+0.5||P.y<RB-0.5||P.y>PH-RB+0.5)return null;return P;}
const diaTxt=(rl,P)=>{const d=rl.read(P);return 'diamante '+fmt(d)+' ('+Math.round(d*10)+' punti)';};
/* piani di tiro: percorso della bersaglio verso il castello + percorso della battente verso il punto d'impatto */
function plans(sh,W){
  const g=gid(),op=sh==='w'?'y':'w',O=S.balls[op];W=W||S.balls[sh];
  const tpaths=[];
  {const u=unit(C0.x-O.x,C0.y-O.y);if(!blocked(O,C0,[op,sh],O.r,true))tpaths.push({via:null,u,dist:Math.hypot(C0.x-O.x,C0.y-O.y)});}
  for(const rl of RAILS){const A=mirror(C0,rl),P2=railHit(O,A,rl);if(!P2)continue;
    if(blocked(O,P2,[op,sh],O.r,false)||blocked(P2,C0,[op,sh],O.r,true))continue;
    tpaths.push({via:rl,P2,u:unit(A.x-O.x,A.y-O.y),dist:Math.hypot(P2.x-O.x,P2.y-O.y)+Math.hypot(C0.x-P2.x,C0.y-P2.y)});}
  const out=[];
  for(const tp of tpaths){
    const G={x:O.x-tp.u.x*(O.r+W.r),y:O.y-tp.u.y*(O.r+W.r)};
    const v={x:G.x-W.x,y:G.y-W.y},cut=cutDeg(v,tp.u);
    if(cut<70&&!blocked(W,G,[sh,op],W.r,false)){const tr=Math.hypot(v.x,v.y);out.push({kind:'dir',tp,G,cut,travel:tr,ang:degOf(W,G),pow:powerFor(tr,cut,tp.dist,0)});}
    for(const rl of RAILS){const P=railHit(W,mirror(G,rl),rl);if(!P)continue;
      if(blocked(W,P,[sh],W.r,false)||blocked(P,G,[sh,op],W.r,false))continue;
      const c=cutDeg({x:G.x-P.x,y:G.y-P.y},tp.u);if(c>65)continue;
      const tr=Math.hypot(P.x-W.x,P.y-W.y)+Math.hypot(G.x-P.x,G.y-P.y);
      out.push({kind:'rail',rl,P,tp,G,cut:c,travel:tr,ang:degOf(W,P),pow:powerFor(tr,c,tp.dist,1)});}
    /* due sponde: doppio specchio */
    for(const r1 of RAILS)for(const r2 of RAILS){if(r1===r2)continue;
      const G2=mirror(G,r2),G1=mirror(G2,r1),P1=railHit(W,G1,r1);if(!P1)continue;const Q=railHit(P1,G2,r2);if(!Q)continue;
      if(blocked(W,P1,[sh],W.r,false)||blocked(P1,Q,[sh],W.r,false)||blocked(Q,G,[sh,op],W.r,false))continue;
      const c=cutDeg({x:G.x-Q.x,y:G.y-Q.y},tp.u);if(c>65)continue;
      const tr=Math.hypot(P1.x-W.x,P1.y-W.y)+Math.hypot(Q.x-P1.x,Q.y-P1.y)+Math.hypot(G.x-Q.x,G.y-Q.y);
      out.push({kind:'rail2',rl:r1,rl2:r2,P:P1,Q,tp,G,cut:c,travel:tr,ang:degOf(W,P1),pow:powerFor(tr,c,tp.dist,2)});}
  }
  return out;
}
function refine(o){/* aggiusta mira e forza con la stessa fisica del gioco, senza cambiare il tipo di colpo */
  const sh=me();let best=null;
  for(let da=-2;da<=2.01;da+=0.25)for(const dp of[-10,0,10]){
    const P={shooter:sh,angle:o.ang+da,power:Math.max(10,Math.min(100,o.pow+dp)),sx:0,sy:0};
    const ev=simulate(P,null,false).ev;
    const sameKind=o.kind==='dir'?ev.railsBefore.length===0:(ev.railsBefore[0]===o.rl.type&&(o.kind==='rail'?ev.railsBefore.length===1:ev.railsBefore.length>=2));
    if(!sameKind||ev.first!==opp())continue;
    const r=evaluate(ev),v=r.to==='me'?r.pts:-r.pts-1;
    if(!best||v>best.v||(v===best.v&&Math.abs(da)<Math.abs(best.da)))best={v,da,P,r};
  }
  return best;
}

/* ===== consigli: due colpi + testi dai manuali ===== */
const MANUAL={
  dirGor:'<b>Regolamento FIBIS, art. 30 e 31:</b> birilli esterni 2, interni 8, rosso 10 con altri o 30 da solo, anche a castello incompleto; il pallino vale sempre 6, che lo tocchi la bilia avversaria o la tua dopo averla colpita. <b>Margutti, lezione 1:</b> per mandare la bersaglio sul castello passando da una sponda si mira il punto speculare del castello oltre la sponda: le traiettorie si cercano fuori dal biliardo.',
  dirIta:'<b>Regolamento FIBIS, art. 8:</b> birilli bianchi 2 punti, rosso 4 con altri o 10 da solo; pallino 4 se lo prende la tua bilia dopo l\'avversaria, 3 se lo prende l\'avversaria. <b>Margutti, lezione 5:</b> se colpisci in pienezza, con il colpo frenato la battente dopo l\'urto tende ad arrestarsi; con effetto in testa segue la bersaglio.',
  calcio:'<b>FIBIS, art. 29:</b> il tiro è <i>indiretto</i> quando la tua bilia tocca almeno una sponda prima dell\'avversaria: birilli e pallino raddoppiano (il rosso da solo vale 60, il pallino 12); la penalità dei falli invece resta 2. <b>Margutti, lezione 2:</b> la sponda non è uno specchio perfetto; dopo l\'urto la biglia plana e slitta (scivolamento), più sul biliardo nuovo che sul battuto, quindi la mira geometrica va corretta con prova o con un filo d\'effetto a favore.',
  spondaBiglia:'<b>ENDAS, art. 7:</b> se la battente tocca prima la sponda lunga si chiama <i>sponda e biglia</i> e conta come tiro diretto, quindi i birilli non raddoppiano. Attenzione al <i>traversino</i>: se dopo la sponda laterale la bersaglio va dritta sui birilli, i punti vanno all\'avversario. <b>Margutti, lezione 3:</b> conviene prendere i riferimenti sulla linea dei diamanti, che anticipa un poco l\'impatto e recupera parte dello scivolamento.',
  dueSponde:'<b>Bibbia del biliardo, due sponde a scendere:</b> dal punto fisso 10 della corta si traguarda la bersaglio nel punto da colpire e si trova l\'uscita in corta; poi si traguarda quell\'uscita con il centro della battente e si aggiunge lo scarto letto sulla sponda di partenza. Il risultato è il punto di battuta per un tiro di misura; un punto in meno per un tiro a scendere, due per un tiro al volo. <b>Margutti, lezione 9:</b> più sponde si leggono come un biliardo virtuale ruotato o scalato.',
  railIta:'<b>Margutti, lezione 1, teoria del triangolo isoscele:</b> l\'angolo d\'uscita dalla sponda è uguale a quello d\'entrata; per raggiungere un punto si mira a metà della base tra partenza e arrivo, cioè al punto speculare oltre la sponda. <b>Bibbia del biliardo:</b> se le sponde "mollano", accompagna il tiro con una carezza di effetto a favore.'
};
function advice(){
  const sh=me(),op=opp(),g=gid(),W=S.balls[sh],O=S.balls[op],oN=BN(op);
  const all=plans(sh);
  const hasShort=o=>o.rl&&(o.rl.type==='short'||(o.rl2&&o.rl2.type==='short'));
  const score=o=>o.cut+o.travel/80+(o.tp.via?6:0)+(o.kind==='rail2'?10:0)+(g==='gor'&&o.kind!=='dir'?-15:0);
  const dirs=all.filter(o=>o.kind==='dir').sort((a,b)=>score(a)-score(b));
  const rails=all.filter(o=>o.kind!=='dir').sort((a,b)=>score(a)-score(b));
  const cards=[];
  const describe=(o,label)=>{
    const best=refine(o);const P=best?best.P:{angle:o.ang,power:o.pow};
    let type,how=[];
    if(o.kind==='dir')type=g==='gor'?'Tiro diretto':'Colpo diretto';
    else if(o.kind==='rail')type=g==='gor'?'Tiro indiretto · punti doppi':'Tiro di sponda';
    else type=g==='gor'?'Indiretto a due sponde · punti doppi':'Due sponde';
    if(o.kind!=='dir')how.push('Mira la '+o.rl.name+' al '+diaTxt(o.rl,o.P)+'.');
    if(o.kind==='rail2')how.push('La tua biglia prende poi la '+o.rl2.name+' al '+diaTxt(o.rl2,o.Q)+'.');
    how.push('Prendi la '+oN+' con un taglio di circa '+Math.round(o.cut)+'° '+(o.cut<12?'(quasi pieno)':o.cut<35?'(mezza biglia abbondante)':'(fine)')+'.');
    how.push(o.tp.via?'La '+oN+' tocca la '+o.tp.via.name+' al '+diaTxt(o.tp.via,o.tp.P2)+' e rientra sul castello.':'La '+oN+' va dritta sul birillo rosso.');
    how.push('Forza '+Math.round(P.power)+', biglia colpita al centro.');
    let res;
    if(best&&best.r.to==='me'&&best.r.pts)res='In simulazione: <b>+'+best.r.pts+'</b> ('+best.r.parts.join(', ')+').';
    else if(best&&best.r.to==='opp')res='In simulazione questo tiro fa bere: '+best.r.text.toLowerCase()+'. Provalo per capire il rischio.';
    else res='In simulazione il tiro tocca la '+oN+' ma non fa punti: aggiusta forza o taglio.';
    const man=o.kind==='dir'?(g==='gor'?MANUAL.dirGor:MANUAL.dirIta):(g==='gor'?MANUAL.calcio:(o.kind==='rail2'?MANUAL.dueSponde:MANUAL.railIta));
    return{h:label,type,how:how.join(' '),res,man,ang:P.angle,pow:P.power,fig:shotSVG(o,simulate({shooter:me(),angle:P.angle,power:P.power,sx:0,sy:0},null,true))};
  };
  if(dirs.length)cards.push(describe(dirs[0],'1 · Diretto'));
  else cards.push({h:'1 · Diretto',type:'Non disponibile',how:'La linea diretta è chiusa da birilli o pallino, oppure il taglio sarebbe troppo fino.',man:g==='gor'?MANUAL.dirGor:MANUAL.dirIta});
  const railPick=rails[0];
  if(railPick)cards.push(describe(railPick,'2 · Di sponda'));
  else cards.push({h:'2 · Di sponda',type:'Non disponibile',how:'Né una né due sponde portano la battente sulla '+oN+' con un taglio giocabile. Prova a cambiare posizione o a giocare di difesa, toccando la '+oN+' piano.',man:g==='gor'?MANUAL.calcio:MANUAL.railIta});
  const warns=[];
  const pal=S.balls.r;
  if(segDist(pal,W,O)<W.r+pal.r+14)warns.push('Il pallino è vicino alla linea di tiro: se lo prendi per primo è fallo, 4 punti di penalità più i punti del tiro all\'avversario.');
  return{cards,warns};
}
/* schema del tiro consigliato: percorsi simulati, punti di sponda e diamanti */
function shotSVG(o,Q){
  const m=58,W=PW+2*m,H=PH+2*m,X=x=>(x+m).toFixed(1),Y=y=>(y+m).toFixed(1),sh=me(),op=opp();
  let s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Schema del tiro consigliato">';
  s+='<rect x="2" y="2" width="'+(W-4)+'" height="'+(H-4)+'" rx="14" fill="#7f1b1e"/><rect x="'+(m-8)+'" y="'+(m-8)+'" width="'+(PW+16)+'" height="'+(PH+16)+'" fill="#2f8a6b"/><rect x="'+m+'" y="'+m+'" width="'+PW+'" height="'+PH+'" fill="#2e7a62"/>';
  for(let i=0;i<=8;i++){s+=svgDm(+X(i*DIA),m/2-4,true,9,4,'#f4eedf')+svgDm(+X(i*DIA),H-m/2+4,true,9,4,'#f4eedf');}
  for(let j=0;j<=4;j++){s+=svgDm(m/2-4,+Y(j*DIA),false,9,4,'#f4eedf')+svgDm(W-m/2+4,+Y(j*DIA),false,9,4,'#f4eedf');}
  for(const p of S.pins)s+='<circle cx="'+X(p.x)+'" cy="'+Y(p.y)+'" r="4" fill="'+(p.t==='red'?'#c23a2c':'#f3ecdc')+'"/>';
  const path=(pts,c,dash,w)=>pts.length>1?'<polyline points="'+pts.map(q=>X(q[0])+','+Y(q[1])).join(' ')+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" stroke-dasharray="'+dash+'" stroke-linejoin="round" stroke-linecap="round"/>':'';
  for(const k of KEYS)if(k!==sh&&Q.moved[k])s+=path(Q.paths[k],COL(k),'14 8',5);
  s+=path(Q.paths[sh],'#ffffff','16 9',5);
  const mark=(P,rl)=>{if(!P)return '';const d=rl.read(P);
    const lx=rl.axis==='y'?P.x:(rl.id==='lft'?-29:PW+29),ly=rl.axis==='y'?(rl.id==='top'?-20:PH+40):P.y+10;
    return '<circle cx="'+X(P.x)+'" cy="'+Y(P.y)+'" r="10" fill="none" stroke="#c9a25a" stroke-width="4"/><text x="'+X(lx)+'" y="'+Y(ly)+'" font-size="28" fill="#f3d58f" text-anchor="middle" font-weight="bold" font-family="Georgia,serif">'+fmt(d)+'</text>';};
  if(o.kind!=='dir')s+=mark(o.P,o.rl);if(o.kind==='rail2')s+=mark(o.Q,o.rl2);
  if(Q.ev.firstContact)s+='<circle cx="'+X(Q.ev.firstContact.x)+'" cy="'+Y(Q.ev.firstContact.y)+'" r="'+RB.toFixed(1)+'" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="4 4"/>';
  for(const k of ['r',op,sh]){const b=S.balls[k];s+='<circle cx="'+X(b.x)+'" cy="'+Y(b.y)+'" r="'+b.r.toFixed(1)+'" fill="'+COL(k)+'" stroke="rgba(0,0,0,.5)" stroke-width="1.5"/>';}
  for(const p of Q.fallen)s+='<circle cx="'+X(p.x)+'" cy="'+Y(p.y)+'" r="9" fill="none" stroke="#ffd23f" stroke-width="3"/>';
  return s+'</svg>';
}
function nowLine(){
  const res=evaluate(simulate(curParams(),null,false).ev);
  if(res.to==='me')return res.pts?{ok:true,t:'Con la mira attuale: <b>+'+res.pts+'</b> ('+res.parts.join(', ')+').'}:{ok:true,t:'Con la mira attuale il tiro è valido ma non fa punti.'};
  return{ok:false,t:'Con la mira attuale: '+res.text.toLowerCase()+', '+res.pts+' punti all\'avversario.'};
}
function renderTips(){
  const posKey=[gid(),KEYS.map(k=>Math.round(S.balls[k].x)+','+Math.round(S.balls[k].y)).join()].join('|');
  if(posKey!==advKey){advKey=posKey;adv=advice();
    const list=$('tipList');list.innerHTML='';
    adv.cards.forEach(t=>{const li=document.createElement('li');
      li.innerHTML='<strong>'+t.h+'</strong><em class="ttype">'+t.type+'</em>'+(t.fig?'<div class="shotfig">'+t.fig+'</div>':'')+'<p>'+t.how+'</p>'+(t.res?'<p class="res">'+t.res+'</p>':'')+'<details class="man"><summary>Dal manuale</summary><p>'+t.man+'</p></details>';
      if(t.ang!=null){const b=document.createElement('button');b.textContent='Prova questo tiro';b.onclick=()=>{setAngle(t.ang);setPower(t.pow);setSpin(0,0);};li.appendChild(b);}
      list.appendChild(li);});
    const wl=$('warnList');wl.innerHTML='';adv.warns.forEach(w=>{const li=document.createElement('li');li.textContent=w;wl.appendChild(li);});
  }
  const key=posKey+'|'+[angle,power,sx,sy].join();
  if(key===tipKey)return;tipKey=key;
  const n=nowLine();$('nowLine').innerHTML=n.t;$('nowLine').className='now '+(n.ok?'ok':'bad');
}
let tipTimer=null;
function scheduleTips(){if(mode!=='train'||busy())return;clearTimeout(tipTimer);tipTimer=setTimeout(renderTips,160);}

/* ===== disegno in pianta ===== */
function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath();}
/* diamante a rombo con il lato lungo rivolto verso il tavolo, come sui biliardi veri */
function dm(x,y){const longRail=y<RW||y>RW+PH;cx.beginPath();if(longRail){cx.moveTo(x,y-5.5);cx.lineTo(x+2.4,y);cx.lineTo(x,y+5.5);cx.lineTo(x-2.4,y);}else{cx.moveTo(x-5.5,y);cx.lineTo(x,y-2.4);cx.lineTo(x+5.5,y);cx.lineTo(x,y+2.4);}cx.closePath();cx.fill();}
const svgDm=(x,y,longRail,a,b,c)=>'<polygon points="'+(longRail?[[x,y-a],[x+b,y],[x,y+a],[x-b,y]]:[[x-a,y],[x,y-b],[x+a,y],[x,y+b]]).map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')+'" fill="'+c+'"/>';
function drawTable(){
  const W=cv.width,H=cv.height,c0=RW-CUSH;cx.clearRect(0,0,W,H);
  /* legno di mogano con giunti a 45° agli angoli */
  cx.fillStyle='#7f1b1e';rr(0,0,W,H,6);cx.fill();
  cx.strokeStyle='rgba(255,190,170,.18)';cx.lineWidth=1.2;cx.strokeRect(2.5,2.5,W-5,H-5);
  cx.strokeStyle='rgba(0,0,0,.45)';cx.lineWidth=1.2;cx.beginPath();
  for(const [ax,ay,bx,by] of [[0,0,c0,c0],[W,0,W-c0,c0],[0,H,c0,H-c0],[W,H,W-c0,H-c0]]){cx.moveTo(ax,ay);cx.lineTo(bx,by);}cx.stroke();
  /* gomma delle sponde, rivestita di panno */
  cx.fillStyle='#2f8a6b';cx.fillRect(c0,c0,PW+2*CUSH,PH+2*CUSH);
  cx.strokeStyle='rgba(0,0,0,.35)';cx.lineWidth=1;cx.beginPath();
  for(const [ax,ay,bx,by] of [[c0,c0,RW,RW],[W-c0,c0,W-RW,RW],[c0,H-c0,RW,H-RW],[W-c0,H-c0,W-RW,H-RW]]){cx.moveTo(ax,ay);cx.lineTo(bx,by);}cx.stroke();
  cx.fillStyle='#2e7a62';cx.fillRect(RW,RW,PW,PH);
  cx.strokeStyle='#4fae8a';cx.lineWidth=1.5;cx.strokeRect(RW-0.75,RW-0.75,PW+1.5,PH+1.5);
  /* mezzeria e bollini */
  cx.strokeStyle='rgba(255,255,255,.07)';cx.lineWidth=1;cx.beginPath();cx.moveTo(RW+PW/2,RW);cx.lineTo(RW+PW/2,RW+PH);cx.stroke();
  cx.fillStyle='rgba(255,255,255,.35)';for(const [x,y] of [[PW*0.25,PH/2],[PW*0.75,PH/2],[SPOT,PH/2],[PW-SPOT,PH/2]]){cx.beginPath();cx.arc(RW+x,RW+y,1.5,0,7);cx.fill();}
  /* diamanti: 9 sulle lunghe e 5 sulle corte, a 1/8 del piano, angoli compresi, al centro del legno */
  const dy=c0/2;cx.fillStyle='#f4eedf';
  for(let i=0;i<=8;i++){dm(RW+i*DIA,dy);dm(RW+i*DIA,H-dy);}
  for(let j=0;j<=4;j++){dm(dy,RW+j*DIA);dm(W-dy,RW+j*DIA);}
}
function drawPins(){for(const p of S.pins){if(!p.up)continue;cx.fillStyle='rgba(0,0,0,.3)';cx.beginPath();cx.arc(p.x+1.6,p.y+1.6,2.9,0,7);cx.fill();
  cx.fillStyle=p.t==='red'?'#c23a2c':'#f3ecdc';cx.beginPath();cx.arc(p.x,p.y,2.9,0,7);cx.fill();cx.strokeStyle='rgba(0,0,0,.45)';cx.lineWidth=0.8;cx.stroke();}}
function drawBall(k){const b=S.balls[k],r=b.r;cx.fillStyle='rgba(0,0,0,.28)';cx.beginPath();cx.arc(b.x+2.5,b.y+3.5,r,0,7);cx.fill();
  cx.fillStyle=COL(k);cx.beginPath();cx.arc(b.x,b.y,r,0,7);cx.fill();cx.strokeStyle='rgba(0,0,0,.35)';cx.lineWidth=1;cx.stroke();
  cx.fillStyle='rgba(255,255,255,.5)';cx.beginPath();cx.arc(b.x-r*0.35,b.y-r*0.35,r*0.28,0,7);cx.fill();}
function drawCue(pull){
  const b=S.balls[me()],a=angle*Math.PI/180,dx=Math.cos(a),dy=Math.sin(a),px=-dy,py=dx,off=sx*b.r*0.8;
  const g=b.r+4+pull,L=620,ox=b.x+px*off,oy=b.y+py*off;
  const t0={x:ox-dx*g,y:oy-dy*g},t1={x:ox-dx*(g+L),y:oy-dy*(g+L)};
  const poly=(s,e,w0,w1,c)=>{cx.fillStyle=c;cx.beginPath();cx.moveTo(s.x+px*w0,s.y+py*w0);cx.lineTo(e.x+px*w1,e.y+py*w1);cx.lineTo(e.x-px*w1,e.y-py*w1);cx.lineTo(s.x-px*w0,s.y-py*w0);cx.closePath();cx.fill();};
  const at=f=>({x:t0.x+(t1.x-t0.x)*f,y:t0.y+(t1.y-t0.y)*f});
  cx.save();cx.globalAlpha=.25;cx.translate(5,7);poly(t0,t1,3.5,9,'#000');cx.restore();
  poly(t0,at(.015),3.3,3.5,'#3b6fb6');poly(at(.015),at(.035),3.5,3.6,'#f2efe6');
  poly(at(.035),at(.62),3.6,6.5,'#dcc08e');poly(at(.62),at(.645),6.5,6.7,'#c9a25a');poly(at(.645),at(.8),6.7,7.6,'#4a1a10');poly(at(.8),at(.81),7.6,7.7,'#c9a25a');poly(at(.81),t1,7.7,9,'#1a0f0b');
}
function getPred(){const P=curParams(),key=[S.game,P.shooter,angle,power,sx,sy,KEYS.map(k=>S.balls[k].x+','+S.balls[k].y).join()].join('|');
  if(key!==predKey){pred=simulate(P,null,true);predKey=key;}return pred;}
function drawPred(){
  const Q=getPred(),sh=me();
  const line=(pts,color,w,dash,alpha)=>{if(pts.length<2)return;cx.save();cx.globalAlpha=alpha;cx.strokeStyle=color;cx.lineWidth=w;cx.setLineDash(dash);cx.lineJoin='round';cx.beginPath();pts.forEach((q,i)=>i?cx.lineTo(q[0],q[1]):cx.moveTo(q[0],q[1]));cx.stroke();cx.restore();};
  line(Q.paths[sh],'#ffffff',2.4,[10,8],.8);
  for(const k of KEYS){if(k===sh||!Q.moved[k])continue;line(Q.paths[k],COL(k)==='#2f5bbf'?'#7fa4ff':COL(k),3,[6,6],.95);}
  if(Q.ev.firstContact){const q=Q.ev.firstContact;cx.save();cx.strokeStyle='rgba(255,255,255,.9)';cx.lineWidth=2;cx.beginPath();cx.arc(q.x,q.y,RB,0,7);cx.stroke();cx.restore();}
  for(const k of KEYS){if(!Q.moved[k])continue;const f=Q.st.balls[k];cx.save();cx.globalAlpha=.5;cx.strokeStyle=COL(k);cx.lineWidth=2;cx.setLineDash([3,3]);cx.beginPath();cx.arc(f.x,f.y,f.r,0,7);cx.stroke();cx.restore();}
  for(const p of Q.fallen){cx.save();cx.strokeStyle='#ffd23f';cx.lineWidth=2;cx.beginPath();cx.arc(p.x,p.y,7,0,7);cx.stroke();cx.restore();}
}
function baseRay(){
  const S0=me(),b=S.balls[S0],a=angle*Math.PI/180,d={x:Math.cos(a),y:Math.sin(a)},r=b.r;
  let t=Infinity;
  if(d.x>1e-9)t=Math.min(t,(PW-r-b.x)/d.x);if(d.x<-1e-9)t=Math.min(t,(r-b.x)/d.x);
  if(d.y>1e-9)t=Math.min(t,(PH-r-b.y)/d.y);if(d.y<-1e-9)t=Math.min(t,(r-b.y)/d.y);
  let hit=null;
  for(const k of KEYS){if(k===S0)continue;const o=S.balls[k],rs=r+o.r,fx=b.x-o.x,fy=b.y-o.y,bb=fx*d.x+fy*d.y,cc=fx*fx+fy*fy-rs*rs,disc=bb*bb-cc;
    if(disc>=0){const tt=-bb-Math.sqrt(disc);if(tt>0&&tt<t){t=tt;hit=k;}}}
  return{q:{x:b.x+d.x*t,y:b.y+d.y*t},hit};
}
function drawBase(){
  const b=S.balls[me()],{q,hit}=baseRay();
  cx.save();cx.setLineDash([9,8]);cx.lineWidth=2.2;cx.strokeStyle='rgba(243,236,220,.8)';
  cx.beginPath();cx.moveTo(b.x,b.y);cx.lineTo(q.x,q.y);cx.stroke();
  cx.setLineDash([]);cx.lineWidth=2;cx.strokeStyle=hit?COL(hit):'rgba(243,236,220,.9)';
  cx.beginPath();cx.arc(q.x,q.y,b.r,0,7);cx.stroke();cx.restore();
}
let last=performance.now(),lastTipSig='',pullNow=0;
const showCue=()=>!moving&&!(mode==='match'&&(!match||match.over))&&mode!=='school';
const humanAim=()=>!busy()&&!isCpuTurn()&&!(mode==='match'&&(!match||match.over));
function frame(now){
  const dt=Math.min(0.05,(now-last)/1000);last=now;
  if(S&&mode!=='school'){
    if(moving){acc+=dt;while(acc>=DT&&moving){step(S);acc-=DT;if(still(S)){stopAll(S);settle();}}}else acc=0;
    const pre=10+power*0.6;pullNow=pre;
    if(!moving&&cueAnim){cueAnim.t+=dt;const t=cueAnim.t;
      if(t<0.22)pullNow=pre+t/0.22*40;else if(t<0.3)pullNow=(pre+40)*(1-(t-0.22)/0.08);else{cueAnim=null;pullNow=0;strike();}}
    if(mode==='train'&&!busy()){const sig=[S.game,KEYS.map(k=>S.balls[k].x+','+S.balls[k].y).join(),angle,power,sx,sy].join('|');if(sig!==lastTipSig){lastTipSig=sig;scheduleTips();}}
    if(view==='3d'&&V3.ok)render3D();else draw2D();
  }
  requestAnimationFrame(frame);
}
function draw2D(){
  cx.setTransform(1,0,0,1,0,0);drawTable();cx.translate(RW,RW);if(!S)return;
  if(inHand&&!busy()&&mode==='match'){const h=allowedHalf();cx.save();cx.fillStyle='rgba(201,162,90,.10)';cx.fillRect(h?PW/2:0,0,PW/2,PH);
    cx.setLineDash([8,8]);cx.strokeStyle='rgba(201,162,90,.7)';cx.lineWidth=2;cx.beginPath();cx.moveTo(PW/2,0);cx.lineTo(PW/2,PH);cx.stroke();
    cx.setLineDash([]);const b=S.balls[inHand.me];cx.beginPath();cx.arc(b.x,b.y,b.r+6,0,7);cx.stroke();cx.restore();}
  drawPins();
  if(humanAim()){if($('hFull').checked)drawPred();else if($('hBase').checked)drawBase();}
  ['r','y','w'].forEach(drawBall);
  if(showCue())drawCue(pullNow);
}
