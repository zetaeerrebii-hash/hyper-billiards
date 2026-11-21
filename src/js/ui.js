
/* ===== vista giocatore 3D ===== */
let view='plan';const V3={ok:false};
function P3(x,y,h){return new THREE.Vector3(x-PW/2,h||0,y-PH/2);}
function init3D(){
  if(V3.ok)return true;if(!window.THREE)return false;
  const T=THREE,el=$('v3');
  let r;try{r=new T.WebGLRenderer({antialias:true});}catch(e){return false;}
  r.setPixelRatio(Math.min(2,window.devicePixelRatio||1));r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.outputEncoding=T.sRGBEncoding;
  Object.assign(r.domElement.style,{width:'100%',height:'100%',display:'block',touchAction:'none'});el.appendChild(r.domElement);
  const sc=new T.Scene();sc.background=new T.Color(0x150e0b);sc.fog=new T.Fog(0x150e0b,1600,3400);
  const cam=new T.PerspectiveCamera(50,1.6,1,6000);
  sc.add(new T.HemisphereLight(0xfff0dc,0x2a170e,0.55));
  const lin=c=>new T.Color(c).convertSRGBToLinear();
  const std=(c,ro,me)=>new T.MeshStandardMaterial({color:lin(c),roughness:ro==null?.8:ro,metalness:me||0});
  const lamps=[];
  for(const x of[-260,260]){
    const L=new T.SpotLight(0xffe2b0,1.1,0,0.95,0.55,1);L.position.set(x,600,0);L.target.position.set(x*0.5,0,0);
    L.castShadow=true;L.shadow.mapSize.set(1024,1024);L.shadow.bias=-0.0006;sc.add(L);sc.add(L.target);
    const shade=new T.Mesh(new T.ConeGeometry(110,70,32,1,true),new T.MeshStandardMaterial({color:lin(0x1f4a33),side:T.DoubleSide,roughness:.55,metalness:.25}));shade.position.set(x,620,0);sc.add(shade);lamps.push(shade);
    const bulb=new T.Mesh(new T.SphereGeometry(18,16,12),new T.MeshBasicMaterial({color:0xfff2cc}));bulb.position.set(x,595,0);sc.add(bulb);lamps.push(bulb);
    const rod=new T.Mesh(new T.CylinderGeometry(2,2,600,8),std(0xc9a25a,.3,.8));rod.position.set(x,955,0);sc.add(rod);lamps.push(rod);
  }
  const box=(w,h,d,m,x,y,z)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.receiveShadow=true;sc.add(o);return o;};
  const felt=new T.Mesh(new T.PlaneGeometry(PW+60,PH+60),std(0x1f5f4b,.95));felt.rotation.x=-Math.PI/2;felt.receiveShadow=true;sc.add(felt);
  /* sponde regolamentari: becco a 37 mm, larghezza totale 14,5 cm */
  const CU=CUSH,CH=37/MM,FW=WOOD,FH=CH+12,TOP=CH+2,cush=std(0x246f59,.9),wood=std(0x5a1114,.45,.05),woodDk=std(0x2b130c,.6),brass=std(0xe6d3a3,.35,.4);
  for(const s of[-1,1]){
    box(PW+2*CU,CH,CU,cush,0,CH/2,s*(PH/2+CU/2));box(CU,CH,PH,cush,s*(PW/2+CU/2),CH/2,0);
    box(PW+2*CU+2*FW,FH,FW,wood,0,TOP-FH/2,s*(PH/2+CU+FW/2));box(FW,FH,PH+2*CU,wood,s*(PW/2+CU+FW/2),TOP-FH/2,0);
  }
  const dg=new T.CylinderGeometry(5.5,5.5,1,4);
  for(let i=0;i<=8;i++)for(const s of[-1,1]){const d=new T.Mesh(dg,brass);d.position.set(-PW/2+i*DIA,TOP+0.5,s*(PH/2+CU+FW/2));d.scale.set(0.45,1,1);sc.add(d);}
  for(let j=0;j<=4;j++)for(const s of[-1,1]){const d=new T.Mesh(dg,brass);d.position.set(s*(PW/2+CU+FW/2),TOP+0.5,-PH/2+j*DIA);d.scale.set(1,1,0.45);sc.add(d);}
  box(PW+2*CU+2*FW,110,PH+2*CU+2*FW,woodDk,0,TOP-FH-55,0);
  for(const a of[-1,1])for(const b of[-1,1])box(70,330,70,woodDk,a*(PW/2+CU+FW-40),TOP-FH-110-165,b*(PH/2+CU+FW-40));
  const floor=new T.Mesh(new T.PlaneGeometry(8000,8000),std(0x24150e,.9));floor.rotation.x=-Math.PI/2;floor.position.y=TOP-FH-440;floor.receiveShadow=true;sc.add(floor);
  const balls={},bg=new T.SphereGeometry(RB,32,24);
  for(const k of KEYS){const m=new T.Mesh(bg,new T.MeshStandardMaterial({color:0xffffff,roughness:.18,metalness:.02}));m.castShadow=true;sc.add(m);balls[k]=m;}
  /* birillo: alto 25 mm, base 10 mm, testa 6-7 mm */
  const prof=[[0,0],[5,0],[5,1.2],[4.4,5],[2.8,11],[2.5,14],[3.3,18],[3.4,21],[2.3,24.3],[0,25]].map(p=>new T.Vector2(p[0]/MM,p[1]/MM));
  const pg=new T.LatheGeometry(prof,18),pmW=std(0xf3ecdc,.35),pmR=std(0xc23a2c,.35);
  const pins=[];for(let i=0;i<9;i++){const m=new T.Mesh(pg,pmW);m.castShadow=true;sc.add(m);pins.push(m);}
  const cue=new T.Group();let z=0;
  for(const [len,r0,r1,c,ro,me] of [[5,3.2,3.3,0x3b6fb6,.9],[12,3.3,3.4,0xf2efe6,.4],[360,3.4,5.8,0xdcc08e,.45],[8,5.8,6,0xc9a25a,.3,.8],[120,6,7,0x4a1a10,.35],[4,7,7.1,0xc9a25a,.3,.8],[111,7.1,8.6,0x1a0f0b,.4]]){
    const g=new T.CylinderGeometry(r1,r0,len,20);g.rotateX(Math.PI/2);const m=new T.Mesh(g,std(c,ro,me));m.position.z=z+len/2;m.castShadow=true;cue.add(m);z+=len;}
  sc.add(cue);
  const hints=new T.Group();sc.add(hints);
  Object.assign(V3,{ok:true,lamps,T,r,sc,cam,balls,pins,pmW,pmR,cue,hints,el,lin,pos:new T.Vector3(),look:new T.Vector3(),snap:true,hintKey:'',game:''});
  const rs=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();};
  rs();if(window.ResizeObserver)new ResizeObserver(rs).observe(el);else window.addEventListener('resize',rs);
  /* comandi: in «Mira» trascinare in orizzontale ruota la stecca, in verticale alza o abbassa la camera (zoom);
     in «Osserva» un dito ruota attorno al tavolo, due dita avvicinano e spostano, la rotella avvicina */
  let drag=null;const pts=new Map();let pinch=null,lastTap=0;
  const mid=()=>{const [a,b]=[...pts.values()];return{x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.hypot(a.x-b.x,a.y-b.y)};};
  el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);$('camHelp').classList.add('off');pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size===2){const m=mid();pinch={d:m.d,x:m.x,y:m.y,z:zoom3D,dist:ORB.dist};drag=null;return;}
    if(ORB.on){const t=performance.now();if(t-lastTap<300){orbReset();lastTap=0;return;}lastTap=t;drag={x:e.clientX,y:e.clientY,orb:true};return;}
    if(busy()||isCpuTurn()||(mode==='match'&&(!match||match.over)))return;drag={x:e.clientX,y:e.clientY,a:angle,z:zoom3D};});
  el.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pinch&&pts.size>=2){const m=mid(),f=m.d/pinch.d;
      if(ORB.on){ORB.dist=clampD(pinch.dist/f);orbPan(m.x-pinch.x,m.y-pinch.y);pinch.x=m.x;pinch.y=m.y;}
      else setZoom(pinch.z+(f-1)*0.9);return;}
    if(!drag)return;const ddx=e.clientX-drag.x,ddy=e.clientY-drag.y;
    if(drag.orb){V3.dragging=performance.now();ORB.yaw-=ddx*0.006;ORB.pitch=Math.max(PMIN,Math.min(PMAX,ORB.pitch+ddy*0.005));drag.x=e.clientX;drag.y=e.clientY;return;}
    /* diagonale: direzione e altezza cambiano insieme, senza blocco su un asse */
    V3.dragging=performance.now();setAngle(drag.a+ddx*0.15);setZoom(drag.z-ddy*0.004);});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(!pts.size)drag=null;};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  el.addEventListener('wheel',e=>{e.preventDefault();if(ORB.on)ORB.dist=clampD(ORB.dist*Math.exp(e.deltaY*0.0012));else setZoom(zoom3D-e.deltaY*0.0012);},{passive:false});
  return true;
}
function clearHints3D(){const g=V3.hints;while(g.children.length){const c=g.children.pop();c.geometry&&c.geometry.dispose();c.material&&c.material.dispose();}}
function dots3D(pts,color,spacing,opacity){
  const T=V3.T,out=[];let carry=0;
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);let t=carry;
    while(t<=L){out.push([a[0]+(b[0]-a[0])*t/L,a[1]+(b[1]-a[1])*t/L]);t+=spacing;}carry=t-L;}
  if(!out.length)return;
  const g=new T.CircleGeometry(2.1,10);g.rotateX(-Math.PI/2);
  const m=new T.InstancedMesh(g,new T.MeshBasicMaterial({color,transparent:true,opacity:opacity||.9}),out.length);
  const o=new T.Object3D();out.forEach((p,i)=>{o.position.copy(P3(p[0],p[1],0.8));o.updateMatrix();m.setMatrixAt(i,o.matrix);});V3.hints.add(m);
}
function ring3D(x,y,r0,r1,color,h){const T=V3.T,g=new T.RingGeometry(r0,r1,32);g.rotateX(-Math.PI/2);const m=new T.Mesh(g,new T.MeshBasicMaterial({color,transparent:true,opacity:.9}));m.position.copy(P3(x,y,h||0.9));V3.hints.add(m);}
const hex=c=>new THREE.Color(c).getHex();
function hints3D(){
  let key='none';const full=$('hFull').checked,base=$('hBase').checked;
  if(humanAim()&&(full||base)){
    if(full){getPred();key='F'+predKey;}else key='B'+[S.game,angle,KEYS.map(k=>S.balls[k].x+','+S.balls[k].y).join()].join('|');
  }
  if(key===V3.hintKey)return;V3.hintKey=key;clearHints3D();if(key==='none')return;
  if(full){const Q=pred,sh=me();
    dots3D(Q.paths[sh],0xffffff,12,.85);
    for(const k of KEYS){if(k!==sh&&Q.moved[k])dots3D(Q.paths[k],hex(COL(k)),10,.95);}
    if(Q.ev.firstContact)ring3D(Q.ev.firstContact.x,Q.ev.firstContact.y,RB-1.5,RB+0.5,0xffffff);
    for(const k of KEYS){if(Q.moved[k]){const f=Q.st.balls[k];ring3D(f.x,f.y,f.r-1,f.r+0.8,hex(COL(k)));}}
    for(const p of Q.fallen)ring3D(p.x,p.y,4.5,6.5,0xffd23f,0.7);
  }else{const b=baseRay(),s=S.balls[me()];dots3D([[s.x,s.y],[b.q.x,b.q.y]],0xf3ecdc,12,.85);ring3D(b.q.x,b.q.y,s.r-1.5,s.r+0.5,b.hit?hex(COL(b.hit)):0xf3ecdc);}
}
function render3D(){
  const T=V3.T;
  if(V3.game!==S.game){V3.game=S.game;for(const k of KEYS){V3.balls[k].material.color=V3.lin(COL(k));const s=S.balls[k].r/RB;V3.balls[k].scale.set(s,s,s);}V3.hintKey='';}
  for(const k of KEYS){const b=S.balls[k];V3.balls[k].position.set(b.x-PW/2,b.r,b.y-PH/2);}
  V3.pins.forEach((m,i)=>{const p=S.pins[i];if(!p){m.visible=false;return;}m.visible=p.up;m.position.set(p.x-PW/2,0,p.y-PH/2);m.material=p.t==='red'?V3.pmR:V3.pmW;});
  const b=S.balls[me()],a=angle*Math.PI/180,dx=Math.cos(a),dy=Math.sin(a);
  V3.cue.visible=showCue();
  if(V3.cue.visible){const e=6*Math.PI/180,g=b.r+4+pullNow,off=sx*b.r*0.8;
    const tip=P3(b.x-dx*g*Math.cos(e)-dy*off,b.y-dy*g*Math.cos(e)+dx*off,b.r+sy*b.r*0.6+g*Math.sin(e));
    V3.cue.position.copy(tip);V3.cue.lookAt(tip.x-dx*Math.cos(e),tip.y+Math.sin(e),tip.z-dy*Math.cos(e));}
  const now=performance.now();
  if(!moving){const key=[angle,b.x,b.y,V3.cam.aspect,zoom3D].join('|');if(key!==V3.aimKey){V3.aimKey=key;const f=aimPose(b,dx,dy);V3.aimPos=f.pos;V3.aimLook=f.look;}V3.standPos=null;}
  else{V3.lastMove=now;if(!V3.standPos){const f=standPose(b,dx,dy);V3.standPos=f.pos;V3.standLook=f.look;}}
  let tp=moving?V3.standPos:V3.aimPos,tl=moving?V3.standLook:V3.aimLook;
  let k=moving?0.04:(now-(V3.lastMove||0)<1500?0.05:0.15);
  if(ORB.on){const o=orbPose();tp=o.pos;tl=o.look;k=now-(V3.dragging||0)<250?0.45:0.25;}
  else if(!moving&&now-(V3.dragging||0)<250)k=0.3; /* mentre il dito si muove la camera segue subito */
  if(V3.snap){V3.pos.copy(tp);V3.look.copy(tl);V3.snap=false;}else{V3.pos.lerp(tp,k);V3.look.lerp(tl,k);}
  /* la camera non deve mai finire dentro o sotto la stecca: resta sempre sopra la sua linea */
  if(V3.cue.visible&&!ORB.on){const bx=b.x-PW/2,bz=b.y-PH/2,d=-((V3.pos.x-bx)*dx+(V3.pos.z-bz)*dy),lat=Math.abs((V3.pos.x-bx)*(-dy)+(V3.pos.z-bz)*dx);
    if(d>0&&d<b.r+4+pullNow+640&&lat<40){const cueH=b.r+(d)*Math.tan(6*Math.PI/180)+12;if(V3.pos.y<cueH+30)V3.pos.y=cueH+30;}}
  V3.cam.position.copy(V3.pos);V3.cam.lookAt(V3.look);
  const showLamps=V3.pos.y<430;V3.lamps.forEach(m=>m.visible=showLamps);
  hints3D();
  V3.r.render(V3.sc,V3.cam);
}
/* tutto il tavolo in quadro, sponde di legno comprese, lasciando libero lo spazio dei comandi sovrapposti (in alto) */
function tableInView(c){const T=V3.T,v=V3.tv||(V3.tv=new T.Vector3()),ex=PW/2+RW+8,ez=PH/2+RW+8,h=37/MM+2;
  const H=V3.el.clientHeight||400,top=1-2*58/H;
  for(const [x,z] of [[-ex,-ez],[ex,-ez],[ex,ez],[-ex,ez]]){v.set(x,h,z).project(c);if(!(v.z<1&&Math.abs(v.x)<0.94&&v.y>-0.9&&v.y<top))return false;}
  return true;}
function fitPose(look,ux,uz,k,dmin){
  const T=V3.T,c=V3.fitCam||(V3.fitCam=new T.PerspectiveCamera());c.fov=V3.cam.fov;c.aspect=V3.cam.aspect;c.near=2;c.far=6000;c.updateProjectionMatrix();
  const ex=PW/2+40,ez=PH/2+40,cs=[[-ex,-ez],[ex,-ez],[ex,ez],[-ex,ez]],v=new T.Vector3();let d=dmin;
  for(let i=0;i<60;i++){
    c.position.set(look.x-ux*d,d*k,look.z-uz*d);c.lookAt(look);c.updateMatrixWorld();
    if(cs.every(([x,z])=>{v.set(x,0,z).project(c);return v.z<1&&Math.abs(v.x)<0.97&&Math.abs(v.y)<0.94;}))break;
    d+=35;}
  return{pos:c.position.clone(),look:look.clone()};
}
/* dove sta in piedi chi tira: dietro la biglia, appena fuori dal bordo del tavolo */
function standSpot(b,dx,dy){
  /* dietro la biglia lungo la linea di mira, fino a uscire dal tavolo: chi tira sta sempre fuori dal piano,
     così la camera vede tutto il tavolo davanti a sé (prima si fermava a 900 e poteva restare sopra il panno) */
  const ex=PW/2+RW+45,ez=PH/2+RW+45;let t=120;
  for(;t<2400;t+=10){const x=b.x-dx*t-PW/2,z=b.y-dy*t-PH/2;if(Math.abs(x)>ex||Math.abs(z)>ez)break;}
  return{x:b.x-dx*t,y:b.y-dy*t};
}
/* spigoli esterni delle sponde proiettati sullo schermo */
function tableBox(c){const T=V3.T,v=V3.tv||(V3.tv=new T.Vector3()),ex=PW/2+RW+8,ez=PH/2+RW+8,h=37/MM+2;
  const r={front:true,x0:9,x1:-9,y0:9,y1:-9};
  for(const [x,z] of [[-ex,-ez],[ex,-ez],[ex,ez],[-ex,ez]]){v.set(x,h,z).project(c);if(!(v.z<1))r.front=false;
    r.x0=Math.min(r.x0,v.x);r.x1=Math.max(r.x1,v.x);r.y0=Math.min(r.y0,v.y);r.y1=Math.max(r.y1,v.y);}
  return r;}
/* sale in verticale finché vede tutto il tavolo, senza allontanarsi; a ogni altezza inclina lo sguardo
   in modo che il tavolo stia al centro della fascia libera (niente cielo vuoto sopra o sotto) */
function fitHeight(hx,hz,look,h0){
  const T=V3.T,c=V3.fitCam||(V3.fitCam=new T.PerspectiveCamera());c.fov=V3.cam.fov;c.aspect=V3.cam.aspect;c.near=2;c.far=6000;c.updateProjectionMatrix();
  const H=V3.el.clientHeight||400,top=1-2*58/H,bot=-0.9,mid=(top+bot)/2,lk=new T.Vector3(),q=new T.Vector3(),dir=new T.Vector3();let h=h0;
  for(let i=0;i<260;i++){c.position.set(hx,h,hz);lk.copy(look);
    for(let j=0;j<4;j++){c.lookAt(lk);c.updateMatrixWorld();const r=tableBox(c);if(!r.front)break;
      const d=(r.y0+r.y1)/2-mid;if(Math.abs(d)<0.01)break;
      q.set(0,d,0.5).unproject(c);dir.copy(q).sub(c.position);if(dir.y>=-1e-3)break;
      const t=-c.position.y/dir.y;lk.copy(c.position).addScaledVector(dir,t);}
    c.lookAt(lk);c.updateMatrixWorld();if(tableInView(c))break;h+=12;}
  return{pos:c.position.clone(),look:lk.clone()};
}
function aimPose(b,dx,dy){
  const st=standSpot(b,dx,dy),lk0=P3((b.x+dx*220+PW/2)/2,(b.y+dy*220+PH/2)/2,0);
  const far=fitHeight(st.x-PW/2,st.y-PH/2,lk0,180);
  const near={pos:P3(b.x-dx*210,b.y-dy*210,60),look:P3(b.x+dx*300,b.y+dy*300,0)};
  const z=zoom3D,pos=far.pos.clone().lerp(near.pos,z),look=far.look.clone().lerp(near.look,z);
  /* la stecca deve restare in quadro: se il tratto vicino alla biglia esce dal basso, l'inquadratura si inclina verso la biglia */
  const T=V3.T,c=V3.fitCam||(V3.fitCam=new T.PerspectiveCamera());c.fov=V3.cam.fov;c.aspect=V3.cam.aspect;c.near=2;c.far=6000;c.updateProjectionMatrix();
  const bp=P3(b.x,b.y,b.r),q=new T.Vector3(),tgt=P3(b.x-dx*110,b.y-dy*110,b.r+110*Math.tan(6*Math.PI/180));
  const cueH=b.r+Math.max(0,-((pos.x-(b.x-PW/2))*dx+(pos.z-(b.y-PH/2))*dy))*Math.tan(6*Math.PI/180)+42;if(pos.y<cueH)pos.y=cueH;
  for(let i=0;i<14;i++){c.position.copy(pos);c.lookAt(look);c.updateMatrixWorld();q.copy(tgt).project(c);if(q.z<1&&q.y>-0.88)break;look.lerp(bp,0.18);}
  return{pos,look};
}
let zoom3D=0;try{const zz=parseFloat(localStorage.getItem('hb-zoom'));if(zz>=0&&zz<=1)zoom3D=zz;}catch(e){}
let zSave=0;function setZoom(z){zoom3D=Math.max(0,Math.min(1,z));V3.aimKey='';clearTimeout(zSave);zSave=setTimeout(()=>{try{localStorage.setItem('hb-zoom',String(zoom3D));}catch(e){}},300);}
/* ===== modalità «Osserva»: camera libera attorno al tavolo ===== */
const PMIN=8*Math.PI/180,PMAX=89*Math.PI/180,DMIN=180,DMAX=3400;
const ORB={on:false,yaw:-Math.PI/2,pitch:0.6,dist:1500,tx:0,tz:0};
const clampD=d=>Math.max(DMIN,Math.min(DMAX,d));
function orbPose(){const T=V3.T,c=Math.cos(ORB.pitch);
  return{pos:new T.Vector3(ORB.tx+ORB.dist*c*Math.cos(ORB.yaw),ORB.dist*Math.sin(ORB.pitch),ORB.tz+ORB.dist*c*Math.sin(ORB.yaw)),look:new T.Vector3(ORB.tx,0,ORB.tz)};}
/* lo spostamento con due dita trascina il piano del tavolo sotto le dita */
function orbPan(px,py){const s=ORB.dist*0.0016,cy=Math.cos(ORB.yaw),sy=Math.sin(ORB.yaw),k=s/Math.max(.4,Math.sin(ORB.pitch));
  ORB.tx=Math.max(-PW/2,Math.min(PW/2,ORB.tx-px*s*sy-py*k*cy));ORB.tz=Math.max(-PH/2,Math.min(PH/2,ORB.tz+px*s*cy-py*k*sy));}
/* parte da dove sta la camera adesso, guardando il centro del tavolo */
function orbFromCam(){const p=V3.pos;ORB.tx=0;ORB.tz=0;const h=Math.hypot(p.x,p.z);
  ORB.yaw=Math.atan2(p.z,p.x);ORB.dist=clampD(Math.hypot(h,p.y));ORB.pitch=Math.max(PMIN,Math.min(PMAX,Math.atan2(p.y,h)));}
function orbReset(){const b=S.balls[me()],a=angle*Math.PI/180;ORB.tx=0;ORB.tz=0;ORB.yaw=Math.atan2(-Math.sin(a),-Math.cos(a));ORB.pitch=0.62;ORB.dist=fitDist(ORB.pitch);}
function orbTop(){ORB.tx=0;ORB.tz=0;ORB.pitch=PMAX;ORB.yaw=Math.PI/2;ORB.dist=fitDist(PMAX);}
/* distanza minima perché tutto il tavolo, sponde comprese, stia in quadro */
function fitDist(pitch){const T=V3.T,c=V3.fitCam||(V3.fitCam=new T.PerspectiveCamera());c.fov=V3.cam.fov;c.aspect=V3.cam.aspect;c.near=2;c.far=6000;c.updateProjectionMatrix();
  const ex=PW/2+RW+20,ez=PH/2+RW+20,cs=[[-ex,-ez],[ex,-ez],[ex,ez],[-ex,ez]],v=new T.Vector3(),o=new T.Vector3();let d=400;
  for(let i=0;i<200;i++){const cp=Math.cos(pitch);c.position.set(ORB.tx+d*cp*Math.cos(ORB.yaw),d*Math.sin(pitch),ORB.tz+d*cp*Math.sin(ORB.yaw));c.lookAt(o.set(ORB.tx,0,ORB.tz));c.updateMatrixWorld();
    if(tableInView(c))break;d+=25;}
  return clampD(d);}
function setCam(m){const was=ORB.on;ORB.on=m==='orb';if(ORB.on&&!was&&V3.ok)orbReset();V3.aimKey='';
  $('cAim').setAttribute('aria-pressed',String(!ORB.on));$('cOrb').setAttribute('aria-pressed',String(ORB.on));$('vTop').hidden=!ORB.on;
  $('v3').classList.toggle('orb',ORB.on);showHelp();$('camHelp').textContent=ORB.on?(coarse()?'Un dito: gira attorno · due dita: avvicina e sposta · doppio tocco: riparti':'Trascina: gira attorno · rotella: avvicina · doppio clic: riparti'):(coarse()?'Trascina di lato: mira · in su o in giù: alza o abbassa la camera':'Trascina di lato: mira · in su o in giù o rotella: alza o abbassa la camera');}
let helpT=0;function showHelp(){const h=$('camHelp');h.classList.remove('off');clearTimeout(helpT);helpT=setTimeout(()=>h.classList.add('off'),4500);}
const coarse=()=>window.matchMedia&&matchMedia('(pointer:coarse)').matches;
function standPose(b,dx,dy){
  const st=standSpot(b,dx,dy);return fitHeight(st.x-PW/2,st.y-PH/2,new V3.T.Vector3(0,0,0),260);
}
function setView(v){
  if(v==='3d'&&!init3D()){msg('La vista giocatore non è disponibile su questo dispositivo.');v='plan';}
  view=v;$('vPlan').setAttribute('aria-pressed',String(v==='plan'));$('vPlayer').setAttribute('aria-pressed',String(v==='3d'));
  $('cv').hidden=v==='3d';$('v3').hidden=v!=='3d';$('zoomBox').hidden=v!=='3d';$('camSeg').hidden=v!=='3d';$('camHelp').hidden=v!=='3d';$('stageBox').classList.toggle('is3d',v==='3d');
  if(v==='3d'){V3.snap=true;V3.hintKey='';V3.game='';window.dispatchEvent(new Event('resize'));
    setCam(ORB.on?'orb':'aim');if(inHand||mode==='train')msg(mode==='train'?'Vista giocatore: «Mira» per tirare, «Osserva» per girare attorno al tavolo. Per spostare le biglie torna alla pianta.':'Per posizionare la biglia in mano torna alla vista in pianta.');}
  try{localStorage.setItem('mg-view',v);}catch(e){}
}
$('zIn').onclick=()=>{if(ORB.on)ORB.dist=clampD(ORB.dist*0.8);else setZoom(zoom3D+0.15);};
$('zOut').onclick=()=>{if(ORB.on)ORB.dist=clampD(ORB.dist*1.25);else setZoom(zoom3D-0.15);};
$('cAim').onclick=()=>setCam('aim');$('cOrb').onclick=()=>setCam('orb');$('vTop').onclick=()=>{if(!ORB.on)setCam('orb');orbTop();};
/* schermo intero e orizzontale: il blocco dell'orientamento funziona solo a schermo intero (Android);
   su iPhone il sito non può ruotare lo schermo: basta girare il telefono con la rotazione automatica attiva */
const fsOK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
$('fsBtn').hidden=!fsOK;
$('fsBtn').onclick=async()=>{
  const d=document,inFs=d.fullscreenElement||d.webkitFullscreenElement;
  try{if(inFs){(d.exitFullscreen||d.webkitExitFullscreen).call(d);return;}
    const el=d.documentElement;await (el.requestFullscreen||el.webkitRequestFullscreen).call(el);
    if(screen.orientation&&screen.orientation.lock&&coarse())await screen.orientation.lock('landscape').catch(()=>{});
  }catch(e){msg('Lo schermo intero non è disponibile qui: gira il telefono per la vista orizzontale.');}};
const fsSync=()=>{const on=!!(document.fullscreenElement||document.webkitFullscreenElement);$('fsBtn').setAttribute('aria-pressed',String(on));$('fsBtn').title=on?'Esci dallo schermo intero':'Schermo intero';};
document.addEventListener('fullscreenchange',fsSync);document.addEventListener('webkitfullscreenchange',fsSync);
let rotClosed=false;try{rotClosed=sessionStorage.getItem('hb-rot')==='1';}catch(e){}
const rotSync=()=>{$('rotChip').hidden=rotClosed||!coarse()||!matchMedia('(orientation:portrait)').matches||$('gameUI').hidden;};
$('rotX').onclick=()=>{rotClosed=true;try{sessionStorage.setItem('hb-rot','1');}catch(e){}rotSync();};
window.addEventListener('resize',rotSync);rotSync();if(screen.orientation)screen.orientation.addEventListener('change',rotSync);
$('vPlan').onclick=()=>setView('plan');$('vPlayer').onclick=()=>setView('3d');

/* ===== regole in breve (riusate in pagina e nella scuola) ===== */
const RULES={
  gor:'<h4>Goriziana · 9 birilli <small>regolamento FIBIS, stecca</small></h4><ul>'+
    '<li>Tre bilie da 61 mm: bianca, gialla e pallino rosso. Nove birilli in croce con interasse di 66 mm.</li>'+
    '<li>Apertura: gialla sul bollino a 10 cm dalla sponda corta del quadrato superiore, pallino al centro dello stesso quadrato; la bianca apre dal quadrato inferiore.</li>'+
    '<li>Birilli: esterni 2, interni 8, rosso 10 con altri o 30 da solo, anche a castello incompleto (art. 30).</li>'+
    '<li>Pallino: sempre 6 punti, toccato dalla bilia avversaria o dalla tua dopo averla colpita (art. 31).</li>'+
    '<li>Tiro indiretto: se la tua bilia tocca almeno una sponda prima dell\'avversaria, birilli e pallino raddoppiano (art. 29).</li>'+
    '<li>Falli (art. 24): bilia avversaria mancata 2, pallino colpito per primo 4, birilli abbattuti prima dell\'avversaria 2. All\'avversario vanno penalità e punti del tiro, con bilia libera. La penalità non raddoppia mai.</li>'+
    '<li>Se la tua bilia abbatte birilli dopo aver colpito l\'avversaria, i punti vanno all\'avversario ma senza bilia libera. Se un tiro fa punti positivi e negativi insieme, va tutto all\'avversario.</li>'+
    '<li>Bilia libera: si piazza nel quadrato opposto alla bilia del fallo; chi batte può far mettere l\'avversaria sul bollino di partenza.</li></ul>',
  ita:'<h4>Italiana · 5 birilli <small>regolamento FIBIS, stecca</small></h4><ul>'+
    '<li>Tre bilie da 61 mm: bianca, gialla e il pallino rosso. Birilli a croce con interasse di 66 mm.</li>'+
    '<li>Apertura: gialla sul bollino a 10 cm dalla sponda corta del quadrato superiore, pallino al centro dello stesso quadrato; la bianca apre dal quadrato inferiore.</li>'+
    '<li>Birilli bianchi 2 punti, rosso 4 con altri o 10 da solo. Niente raddoppio di sponda.</li>'+
    '<li>Pallino: 4 se lo tocca la tua bilia dopo l\'avversaria, 3 se lo tocca l\'avversaria. Conta la prima che lo tocca.</li>'+
    '<li>Falli con bilia libera: bilia avversaria mancata (2), pallino colpito per primo (4), birilli abbattuti prima dell\'avversaria (2). All\'avversario vanno penalità, punti del tiro e pallino a 2.</li>'+
    '<li>Se la tua bilia abbatte birilli dopo aver colpito l\'avversaria, perdi i punti ma non c\'è bilia libera.</li>'+
    '<li>Bilia libera: si piazza nel quadrato opposto alla bilia del fallo; chi batte può far mettere l\'avversaria sul bollino di partenza.</li></ul>'
};
function renderRules(){$('rulesNow').innerHTML=RULES[gid()];$('rulesSum').textContent='Regole: '+GM().full;}

/* ===== scuola: schemi dai manuali ===== */
function tbl(ox,oy,s,inner,o){o=o||{};
  const w=8*s,h=4*s;let svg='<rect x="'+(ox-9)+'" y="'+(oy-9)+'" width="'+(w+18)+'" height="'+(h+18)+'" rx="6" fill="#7f1b1e"/><rect x="'+ox+'" y="'+oy+'" width="'+w+'" height="'+h+'" fill="#2e7a62"/>';
  for(let i=0;i<=8;i++)svg+=svgDm(ox+i*s,oy-4.5,true,2.6,1.1,'#f4eedf')+svgDm(ox+i*s,oy+h+4.5,true,2.6,1.1,'#f4eedf');
  for(let j=0;j<=4;j++)svg+=svgDm(ox-4.5,oy+j*s,false,2.6,1.1,'#f4eedf')+svgDm(ox+w+4.5,oy+j*s,false,2.6,1.1,'#f4eedf');
  if(o.castle){const c=[ox+4*s,oy+2*s],d=s*0.19;svg+='<g fill="#f3ecdc">';for(const [a,b] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2]].slice(0,o.castle))svg+='<circle cx="'+(c[0]+a*d)+'" cy="'+(c[1]+b*d)+'" r="1.6" '+(a||b?'':'fill="#c23a2c"')+'/>';svg+='</g>';}
  return svg+inner;
}
const SV=(vb,body,label)=>'<svg viewBox="'+vb+'" role="img" aria-label="'+label+'">'+body+'</svg>';
const ln=(a,b,c,dash,w)=>'<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+(c||'#c9a25a')+'" stroke-width="'+(w||1.6)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linecap="round"/>';
const pl=(pts,c,dash,w)=>'<polyline points="'+pts.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="'+(c||'#c9a25a')+'" stroke-width="'+(w||1.6)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linejoin="round" stroke-linecap="round"/>';
const bl=(p,c,r)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(r||4)+'" fill="'+(c||'#f3ecdc')+'" stroke="rgba(0,0,0,.4)" stroke-width=".6"/>';
const tx=(p,t,o)=>{o=o||{};return '<text x="'+p[0]+'" y="'+p[1]+'" font-size="'+(o.s||9)+'" fill="'+(o.c||'#e8dcc2')+'" text-anchor="'+(o.a||'middle')+'" font-family="EB Garamond,Georgia,serif"'+(o.i?' font-style="italic"':'')+'>'+t+'</text>';};
function schoolCards(){
  const s=30,ox=22,oy=24;const P=(dx,dy,yo)=>[ox+dx*s,(yo==null?oy:yo)+dy*s];
  const cards=[];
  /* 1 diamanti */
  {let b=tbl(ox,oy,s,'');for(let i=0;i<=8;i++)b+=tx([ox+i*s,oy-13],i,{s:8});for(let j=0;j<=4;j++)b+=tx([ox-15,oy+j*s+3],j,{s:8});
   b+=ln(P(3,0),P(3,4),'#c9a25a','2 3',1);b+=ln(P(3,4),P(3.1,4),'#c9a25a');b+=tx(P(3.5,2.1),'1 diamante = 35,5 cm',{s:8.5});b+=tx(P(3.5,2.6),'1 punto = 3,55 cm',{s:8.5,i:1});
   cards.push({t:'Diamanti, punti e misure',src:'FIBIS art. 2 · Margutti, lezione 1',svg:SV('0 0 286 160',b,'Tavolo con i diamanti numerati da 0 a 8 e da 0 a 4'),
    p:'Il piano regolamentare misura 2,84 × 1,42 m e i diamanti stanno a 1/8 della lunghezza, cioè 35,5 cm l\'uno dall\'altro. Margutti ragiona in <b>punti</b>: un punto è 1/10 di diamante, 3,55 cm, circa due dita. Una biglia misura 61 mm, quasi due punti: per questo nessun conteggio è perfetto e serve a capire il tiro, non a sostituire la sensibilità. In questa app le sponde lunghe si leggono da 0 a 8 da sinistra, le corte da 0 a 4 dall\'alto, sempre in perpendicolare dal diamante.'});}
  /* 2 specchio */
  {const yo=64,S0=P(1.2,1.5,yo),A=P(6.2,1.5,yo),M=P(3.7,0,yo),Am=[A[0],yo-1.5*s];
   let b='<rect x="'+(ox-9)+'" y="'+(yo-9)+'" width="258" height="138" rx="6" fill="#7f1b1e"/><rect x="'+ox+'" y="'+yo+'" width="240" height="120" fill="#2e7a62"/>';
   b+=ln([ox-9,yo],[ox+249,yo],'#e6d3a3','',1);
   b+=pl([S0,M,A],'#f3ecdc','',1.8)+ln(M,Am,'#c9a25a','4 3')+ln(A,Am,'#c9a25a','1 3',1)+ln(M,[M[0],yo+60],'#c9a25a','2 3',1)+bl(S0)+bl(A,'#b3262a')+'<circle cx="'+Am[0]+'" cy="'+Am[1]+'" r="4" fill="none" stroke="#c9a25a" stroke-dasharray="2 2"/>';
   b+=tx([Am[0]+6,Am[1]-6],'punto speculare',{s:8.5,a:'start',i:1})+tx([M[0],yo+72],'altezza = bisettrice',{s:8,i:1})+tx([S0[0],S0[1]+16],'partenza',{s:8})+tx([A[0],A[1]+16],'arrivo',{s:8});
   cards.push({t:'Lo specchio: il triangolo isoscele',src:'Margutti, lezione 1',svg:SV('0 0 286 196',b,'Traiettoria a una sponda con il punto speculare oltre la sponda'),
    p:'Se la biglia fosse un punto senza rotazione, uscirebbe dalla sponda con lo stesso angolo con cui è entrata, come la luce in uno specchio. Partenza e arrivo sono la base di un triangolo isoscele: si mira a metà della base. Prolungando tutte le traiettorie che arrivano nello stesso punto, si incontrano nel suo <b>punto speculare</b> oltre la sponda. Da qui la frase di Margutti: le traiettorie sul biliardo vanno cercate fuori dal biliardo. È il motivo per cui c\'è chi mira un gessetto o un segno sul muro.'});}
  /* 3 fisica della sponda */
  {const R0=[40,30],I=[150,30];let b='<rect x="20" y="16" width="250" height="10" fill="#2f8a6b"/><rect x="20" y="6" width="250" height="10" fill="#7f1b1e"/><rect x="20" y="26" width="250" height="130" fill="#2e7a62"/>';
   b+=ln([60,140],I,'#f3ecdc','',1.8)+ln(I,[240,140],'#e8dcc2','4 3',1.2)+pl([I,[205,80],[226,140]],'#6fbf8f','',1.6)+pl([I,[200,74],[212,140]],'#dfae3a','',1.6)+pl([I,[196,70],[196,140]],'#e06d5b','',1.6);
   b+=tx([248,150],'geometria',{s:8,i:1})+tx([226,152],'battuto',{s:8,c:'#6fbf8f'})+tx([206,128],'semi',{s:8,c:'#dfae3a',a:'end'})+tx([188,148],'nuovo',{s:8,c:'#e06d5b',a:'end'})+tx([60,152],'entrata',{s:8});
   cards.push({t:'La sponda non è uno specchio',src:'Margutti, lezione 2',svg:SV('0 0 286 166',b,'Tre uscite dalla sponda per biliardo nuovo, semi-nuovo e battuto'),
    p:'Le biglie saltano, slittano e curvano. La sponda ha un becco più alto del centro della biglia: la biglia ci si insacca e viene respinta, ma una parte della spinta diventa effetto naturale di sponda e calore. Subito dopo l\'urto la biglia <b>plana e slitta</b> sul panno, poi riprende la direzione data dalla propria rotazione: è lo <b>scivolamento</b>. Sul biliardo nuovo scivola di più, su quello battuto meno. La traiettoria dipende da angolo d\'entrata, forza, rotazione, ma anche da temperatura, umidità e pulizia del panno.'});}
  /* 4 centri multipli */
  {const yo=20;let b=tbl(ox,yo,s,'');const CM=[ox+2*s,yo+4*s+60];
   for(const st of [[0.6,0.6],[5.5,0.9],[7.2,2.2]]){const a=P(st[0],st[1],yo),t=(yo+4*s-a[1])/(CM[1]-a[1]),hit=[a[0]+(CM[0]-a[0])*t,yo+4*s];b+=ln(a,hit,'#f3ecdc','',1.4)+ln(hit,CM,'#c9a25a','3 3',1)+bl(a,'#f3ecdc',3.5);}
   for(let i=-1;i<=7;i++)b+='<circle cx="'+(ox+i*s)+'" cy="'+CM[1]+'" r="'+(i===2?3.5:2)+'" fill="'+(i===2?'#c9a25a':'#8f6d33')+'"/>';
   b+=tx([CM[0]+8,CM[1]+14],'CentroMultiplo: tutte le diagonali convergono qui',{s:8.5,a:'start',i:1})+tx([ox+250,CM[1]-6],'asse dei CM, uno ogni diamante',{s:8,a:'end'});
   cards.push({t:'I Centri Multipli',src:'Margutti, lezioni 3, 4 e 8',svg:SV('0 0 286 222',b,'Diagonali da posizioni diverse che convergono in un punto esterno al tavolo'),
    p:'Margutti porta lo specchio fuori dal tavolo. Il CentroMultiplo dell\'angolo si trova a circa 160 cm dal diamante 0 della sponda di mira, in perpendicolare; i CentriMultipli fondamentali stanno su un asse a 320 cm, uno ogni diamante. Mirando lo stesso CentroMultiplo da qualunque posizione, con circa ⅔ d\'effetto (zona B4), la biglia arriva sempre nello stesso punto in terza sponda: 10, 15, circa 20, 24, 28, 31 punti per i CM successivi. L\'insieme di queste corrispondenze è la <b>mappatura</b> del biliardo, la sua impronta digitale: cambia tra biliardo nuovo e battuto, e perfino tra pomeriggio e sera.'});}
  /* 5 effetti zonali */
  {const c=[70,120],R=95;let b='<path d="M'+c[0]+' '+c[1]+' L'+c[0]+' '+(c[1]-R)+' A'+R+' '+R+' 0 0 1 '+(c[0]+R)+' '+c[1]+' Z" fill="#f3ecdc" stroke="#8f6d33"/>';
   for(let i=1;i<6;i++){const d=R*i/6;b+=ln([c[0]+d,c[1]],[c[0]+d,c[1]-Math.sqrt(R*R-d*d)],'#cdbf9f','',0.7)+ln([c[0],c[1]-d],[c[0]+Math.sqrt(R*R-d*d),c[1]-d],'#cdbf9f','',0.7);}
   const cell=(col,row,f,l)=>{const x=c[0]+R*(col-1)/6,y=c[1]-R*row/6;return '<rect x="'+x+'" y="'+y+'" width="'+(R/6)+'" height="'+(R/6)+'" fill="'+f+'" opacity=".85"/>'+tx([x+R/12,y+R/12+3],l,{s:7.5,c:'#2a1b16'});};
   b+=cell(4,2,'#c9a25a','B4')+cell(2,4,'#6fbf8f','D2');
   'ABCDEF'.split('').forEach((L,i)=>{b+=tx([c[0]-8,c[1]-R*(i+0.5)/6+3],L,{s:8});});for(let i=1;i<=6;i++)b+=tx([c[0]+R*(i-0.5)/6,c[1]+12],i,{s:8});
   b+=tx([185,40],'D2 ≈ ⅓ d\'effetto',{s:9,a:'start',c:'#6fbf8f'})+tx([185,56],'B4 ≈ ⅔ d\'effetto',{s:9,a:'start',c:'#c9a25a'})+tx([185,72],'A6 quasi massimo',{s:9,a:'start'})+tx([185,96],'schema indicativo',{s:8,a:'start',i:1});
   cards.push({t:'Gli effetti zonali',src:'Margutti, lezioni 5 e 6',svg:SV('0 0 286 140',b,'Quarto di biglia diviso in zone da A a F e da 1 a 6'),
    p:'Invece di dire «mezzo effetto» o «due terzi», Margutti divide il quarto di biglia in sei archi e ottiene una griglia di zone: lettere da A a F e numeri da 1 a 6. Una zona tollera piccole variazioni da biliardo a biliardo. I due effetti principali del tre sponde sono <b>D2</b>, circa ⅓, e <b>B4</b>, circa ⅔, il «taglio principe»: stabilizza la traiettoria anche con diagonali larghe e conserva la rotazione per tutto il percorso. L\'A6, quasi massimo, è troppo sensibile a forza e distanza. Il colpo va dato appena sopra la pancia, non in testa.'});}
  /* 6 garuffa */
  {const yo=24;let b=tbl(ox,yo,s,'',{castle:9});const pin=P(4,2,yo);
   const refs=[[0,2],[1,3],[2,4.2]];refs.forEach(([cy,lx],i)=>{const a=P(0,cy,yo),m=P(lx,0,yo);b+=ln(a,m,i===1?'#f3ecdc':'#c9a25a',i===1?'':'3 3',1.4)+tx([m[0],m[1]-12],lx===4.2?'4+':lx,{s:8});b+=tx([a[0]-14,a[1]+3],cy,{s:8});});
   const a=P(0,3,yo),m=P(3,0,yo);b+=pl([P(1.2,3.4,yo),a,m,pin],'#f3ecdc','',1.6)+bl(P(1.2,3.4,yo));
   cards.push({t:'Garuffa e mezze garuffe',src:'Margutti, lezione 7',svg:SV('0 0 286 172',b,'Due sponde, corta e lunga, al birillo rosso con effetto contro'),
    p:'La garuffa, dall\'ingegner Giuseppe Garuffa, porta la battente al birillo rosso in due sponde, prima la corta poi la lunga, con effetto <b>contro</b>. Con il massimo effetto contro le diagonali di riferimento sono tre: dal diamante immaginario della corta al 2° della lunga, dal 1° della corta al 3° della lunga, dal 2° della corta a poco più del 4°. Fra il centro multiplo del senza effetto e quello del massimo contro stanno tutte le mezze garuffe; il mezzo effetto non sta a metà, perché il rapporto è esponenziale. Sul biliardo battuto le diagonali che sul nuovo vogliono mezzo effetto chiedono almeno ⅔.'});}
  /* 7 biliardi virtuali */
  {let b='';const mini=(x,y,w,h,f,st)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'" stroke="'+(st||'none')+'" stroke-dasharray="3 2"/>';
   b+=mini(12,40,72,36,'#2e7a62')+mini(30,52,72,36,'none','#c9a25a')+tx([56,112],'traslato',{s:9});
   b+=mini(110,40,72,36,'#2e7a62')+mini(128,22,36,72,'none','#c9a25a')+tx([146,112],'ruotato',{s:9});
   b+=mini(206,40,72,36,'#2e7a62')+mini(224,49,36,18,'none','#c9a25a')+tx([242,112],'scalato',{s:9});
   cards.push({t:'I biliardi virtuali',src:'Margutti, lezione 9',svg:SV('0 0 286 124',b,'Tre biliardi virtuali: traslato, ruotato e scalato'),
    p:'Un sistema imparato per arrivare in angolo si può riusare spostando idealmente il biliardo. <b>Traslato</b>: l\'angolo virtuale coincide con un altro punto, per esempio la mezzeria, come nell\'accosto lunga-lunga a zig-zag. <b>Ruotato</b> di 90°: è la base di candela, bricolle e tiri di più sponde. <b>Scalato</b>: un biliardo più piccolo per traversino, sponda al volo e due a mo\' di tre; anche il birillo rosso di tre sponde si legge come una scalatura. In fondo a essere spostati sono sempre i Centri Multipli.'});}
  /* 8 bricolla */
  {const yo=24;let b=tbl(ox,yo,s,'',{castle:9});const pin=P(4,2,yo);
   for(let k=1;k<=7;k++){const a=P(8,k*0.5,yo);}
   const W=P(1.3,3.3,yo),cor=P(8,1.2,yo),lng=P(6.2,0,yo);b+=ln(W,cor,'#f3ecdc','',1.6)+pl([cor,lng,pin],'#f3ecdc','',1.6)+ln(lng,pin,'#c9a25a','3 3',1)+bl(W);
   b+=tx([cor[0]+12,cor[1]+3],'5',{s:9})+tx([lng[0],lng[1]-12],'diagonale lunga/corta',{s:8,i:1});
   cards.push({t:'La bricolla',src:'Bibbia del biliardo · Margutti, lezioni 10 e 11',svg:SV('0 0 286 172',b,'Bricolla: corta, poi lunga, poi birillo centrale'),
    p:'Nel sistema della Bibbia le diagonali lunga/corta portano tutte al birillo centrale. Si cerca quella che passa per la battente (per esempio 5): dopo aver battuto a 5 in corta, la biglia percorre la diagonale dal 5 della lunga al centrale. Poi si aggiunge lo scarto, un punto e mezzo per ogni birillo in orizzontale (es. 3): battuta 5 + 3 = 8 per incastellare la bersaglio. Partenza e mira si contano sul legno, l\'arrivo in seconda sponda sulla gomma. Margutti la spiega con un biliardo ruotato: senza effetto o con massimo effetto buono esiste un centro multiplo preciso; bricolla sul largo e ricciolo sullo stretto sono lo stesso tiro. Per la goriziana, rispetto al rosso: birillo da 2 sul largo −3÷4 unità, da 8 sul largo −2, da 8 sullo stretto +2, da 2 sullo stretto +4÷5.'});}
  /* 9 angolo 50 */
  {const yo=30;let b=tbl(ox,yo,s,'');const mira=[0,10,20,30,40,50,70,90],part=['',15,20,25,30,35,40,45,50];
   mira.forEach((v,i)=>{b+=tx([ox+i*s,yo-14],v,{s:8,c:'#e8dcc2'});});part.forEach((v,i)=>{if(v!=='')b+=tx([ox+i*s,yo+4*s+20],v,{s:8,c:'#7fa4ff'});});
   const Pp=P(7.8,4,yo),M=P(3.1,0,yo),L=P(0,2.1,yo),A=P(1.8,4,yo);b+=pl([Pp,M,L,A],'#f3ecdc','',1.6)+bl([Pp[0],Pp[1]-6])+'<circle cx="'+A[0]+'" cy="'+A[1]+'" r="4" fill="none" stroke="#e06d5b"/>';
   b+=tx([M[0]+4,M[1]+14],'mira 31',{s:8.5,a:'start'})+tx([A[0]+6,A[1]-8],'arrivo 18',{s:8.5,a:'start',c:'#e06d5b'})+tx([Pp[0]-4,Pp[1]-14],'partenza 49',{s:8.5,a:'end'})+tx([ox+120,yo+4*s+32],'blu: numeri di partenza · in alto: numeri di mira',{s:8,i:1});
   cards.push({t:'Angolo 50: tre sponde di calcio',src:'Bibbia del biliardo · Margutti, lezioni 12 e 13',svg:SV('0 0 286 200',b,'Numerazione dell\'Angolo 50 con un esempio a tre sponde'),
    p:'Si trova l\'<b>arrivo</b> sulla palla avversaria in terza sponda con le diagonali (es. 14), si aggiunge lo scarto della battente (+4) e si calcola: <b>partenza − arrivo = mira</b>. Nell\'esempio della Bibbia 49 − 18 = 31: si mira il 31 in prima sponda. Effetto: mezzo effetto («2 in pancia»), ⅔ per le uscite 0 e 30; sbracciata accompagnata morbida. Perché funziona? Sulla sponda di partenza ogni diamante vale 5, su quella di mira 10: il rapporto 1:2 è una similitudine fra triangoli (Talete) e tutte le diagonali con la stessa differenza convergono nello stesso Centro Multiplo. Partendo dalla corta però la numerazione perde convergenza: il 60 che guarda il 50 non è una diagonale 10 ma 7,5, quindi si tolgono 2 punti. Sono le <b>compensazioni</b>.'});}
  /* 10 due sponde a scendere */
  {const yo=24;let b=tbl(ox,yo,s,'',{castle:5});const W=P(0,1.9,yo),B=P(4.6,0,yo),U=P(8,1.4,yo),T=P(6.4,2.7,yo),F=P(8,0.33,yo);
   b+=pl([W,B,U,T],'#f3ecdc','',1.6)+bl(W,'#f3ecdc')+bl(T,'#dfae3a')+ln(F,T,'#c9a25a','3 3',1);
   b+=tx([B[0],B[1]-12],'battuta 12 + 6 = 18',{s:8.5})+tx([U[0]+10,U[1]+3],'12',{s:8.5,a:'start'})+tx([F[0]+10,F[1]+3],'fisso 10',{s:8,a:'start',i:1});
   cards.push({t:'Due sponde a scendere',src:'Bibbia del biliardo',svg:SV('0 0 286 172',b,'Due sponde: lunga, poi corta, poi la bersaglio'),
    p:'Dal punto fisso 10 della corta si traguarda la bersaglio nel punto dove vogliamo colpirla e si prolunga la retta: si trova l\'uscita in corta (es. 12). Poi si traguarda il 12 con il centro della battente fino alla sponda di partenza e si legge lo scarto (es. 6). Battuta: 12 + 6 = 18 per un tiro di misura (di solito per incastellare la bersaglio), 17 per un tiro a scendere, 16 per un tiro al volo. Effetto 0 in CPS, sbracciata allungata morbida. Con la variante dei <b>4 zeri</b> si parte dal punto fisso centrale 0 (es. 5 + 3 = 8 a scendere, 7 di misura, 9 al volo): è utile quando le biglie sono lontane dalle sponde. Se le sponde «mollano», una carezza di effetto a favore.'});}
  /* 11 garuffa X */
  {const yo=24;let b=tbl(ox,yo,s,'',{castle:9});const pin=P(4,2,yo),O=P(5.6,1.2,yo),U=P(8,-0.3,yo);
   b+=ln(pin,[ox+8*s,yo+0.0*s+3],'#c9a25a','3 3',1)+bl(O,'#dfae3a');
   const W=P(2,3.4,yo),M=P(3,4,yo);b+=pl([W,M,[ox+8*s,yo+0.25*s],O],'#f3ecdc','',1.4)+bl(W);
   b+=tx([M[0],M[1]+16],'diamante «3» × 4 = 12',{s:8.5})+tx([ox+8*s-4,yo-12],'uscita 12',{s:8.5,a:'end'});
   cards.push({t:'Garuffa X',src:'Bibbia del biliardo',svg:SV('0 0 286 178',b,'Garuffa X: il punto in corta si trova moltiplicando'),
    p:'Si traguarda il birillo rosso con il centro della bilia avversaria e si prolunga la retta fino alla sponda corta: è il punto di battuta in corta (es. 12). Memorizzando le battute di partenza e di prima sponda, con una moltiplicazione si trova il punto di mira: il diamante «3» di prima sponda, perché 4 × 3 = 12. Attenzione: il conteggio ha un errore sul diamante 1, dove 4 × 1 vale 5 e 5 × 1 vale 7. Effetto variabile, sbracciata affondata morbida.'});}
  /* 12 misure */
  cards.push({t:'Misure regolamentari usate nel gioco',src:'FIBIS art. 2 e 3 · ENDAS art. 3',svg:'',
    p:'<span class="meas"><b>Piano</b> 2840 × 1420 mm · <b>Diamanti</b> ogni 355 mm · <b>Sponde</b> larghe 12,5–15 cm, becco a 37 mm · <b>Biglie</b> 61 mm · <b>Pallino</b> 61 mm (59 mm nella goriziana ENDAS, giocata a mano) · <b>Birilli</b> alti 25 mm, base 10 mm, testa 6–7 mm, interasse 66 mm · <b>Bollini</b> a 10 cm dalla sponda corta.</span> Nella pianta i birilli sono disegnati un poco più grandi del vero per vederli sul telefono; nella fisica e nella vista giocatore hanno la misura reale.'});
  return cards;
}
function renderSchool(){
  const el=$('schoolCards');if(el.dataset.done)return;el.dataset.done='1';
  el.innerHTML=schoolCards().map(c=>'<article class="card"><h3>'+c.t+'</h3><div class="srcl">'+c.src+'</div>'+(c.svg?'<div class="fig">'+c.svg+'</div>':'')+'<p>'+c.p+'</p></article>').join('')+
    '<article class="card wide"><h3>Le regole a confronto</h3><div class="rules2"><div>'+RULES.gor+'</div><div>'+RULES.ita+'</div></div><p class="small">Entrambe le specialità seguono il regolamento FIBIS per la stecca. Nella goriziana del regolamento ENDAS, giocata a mano, alcuni valori cambiano: pallino 3 o 6, falli da 6, regola della mezzeria e tiro di fisso.</p></article>';
}

/* ===== selfie → giocatore pixel ===== */
let selfieImg=null,selfieOut=null;
function pixelate(){
  if(!selfieImg){$('npPrev').hidden=true;return;}
  const N=+$('npPx').value,H=Math.round(N*1.27),iw=selfieImg.naturalWidth||selfieImg.width,ih=selfieImg.naturalHeight||selfieImg.height;
  const ar=N/H;let cw=iw,ch=iw/ar;if(ch>ih){ch=ih;cw=ih*ar;}const cx0=(iw-cw)/2,cy0=Math.max(0,(ih-ch)*0.3);
  const c=document.createElement('canvas');c.width=N;c.height=H;const g=c.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  g.drawImage(selfieImg,cx0,cy0,cw,ch,0,0,N,H);
  const d=g.getImageData(0,0,N,H),a=d.data;
  const lv=7,q=v=>Math.round(Math.max(0,Math.min(255,(v-128)*1.15+128))/255*(lv-1))*(255/(lv-1));
  for(let i=0;i<a.length;i+=4){a[i]=q(a[i]);a[i+1]=q(a[i+1]);a[i+2]=q(a[i+2]);}
  if($('npBg').checked){
    const idx=(x,y)=>(y*N+x)*4,seen=new Uint8Array(N*H),st=[];
    for(let x=0;x<N;x++)st.push([x,0]);for(let y=0;y<Math.round(H*0.55);y++){st.push([0,y]);st.push([N-1,y]);}
    const ref=st.map(([x,y])=>{const i=idx(x,y);return[a[i],a[i+1],a[i+2]];});
    const near=(i)=>ref.some(r=>Math.abs(a[i]-r[0])+Math.abs(a[i+1]-r[1])+Math.abs(a[i+2]-r[2])<70);
    while(st.length){const [x,y]=st.pop();if(x<0||y<0||x>=N||y>=H)continue;const k=y*N+x;if(seen[k])continue;seen[k]=1;const i=k*4;if(!near(i))continue;a[i+3]=0;st.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}
  }
  g.putImageData(d,0,0);selfieOut=c.toDataURL('image/png');
  $('npPrev').src=selfieOut;$('npPrev').hidden=false;$('npSave').disabled=false;
}
function readFile(f){if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{selfieImg=im;pixelate();};im.onerror=()=>msg('Non riesco a leggere questa immagine. Prova con un\'altra foto.');im.src=r.result;};r.readAsDataURL(f);}
$('npCam').onchange=e=>readFile(e.target.files[0]);$('npFile').onchange=e=>readFile(e.target.files[0]);
$('npPx').oninput=pixelate;$('npBg').onchange=pixelate;
$('npCancel').onclick=()=>{$('newp').hidden=true;};
$('npSave').onclick=()=>{
  const name=($('npName').value||'').trim();if(!name){$('npErr').textContent='Scrivi un nome per il giocatore.';$('npName').focus();return;}
  if(!selfieOut){$('npErr').textContent='Scatta o scegli prima una foto.';return;}
  const id='u'+Date.now().toString(36);CHARS[id]={name:name.slice(0,16),img:selfieOut,custom:true};saveCustom();
  setupSel.me=id;$('newp').hidden=true;selfieImg=null;selfieOut=null;$('npName').value='';$('npPrev').hidden=true;
  rebuildChars();renderSetup();msg('Nuovo giocatore: '+name+'.');
};
$('npName').oninput=()=>{$('npErr').textContent='';};
function openNew(){$('newp').hidden=false;$('npErr').textContent='';$('npSave').disabled=!selfieOut;$('newp').scrollIntoView({block:'nearest',behavior:'smooth'});}

/* ===== modalità e schermate ===== */
function charCard(id,group){const b=document.createElement('div');b.className='char';b.dataset.id=id;
  b.innerHTML='<button class="pick" aria-pressed="false"><img alt="" src="'+CHARS[id].img+'"><span></span></button>'+(CHARS[id].custom?'<button class="del" aria-label="Elimina '+CHARS[id].name+'">×</button>':'');
  b.querySelector('span').textContent=CHARS[id].name;
  b.querySelector('.pick').onclick=()=>{const other=group==='me'?'opp':'me';if(setupSel[other]===id)setupSel[other]=setupSel[group];setupSel[group]=id;renderSetup();};
  const del=b.querySelector('.del');if(del)del.onclick=()=>{delete CHARS[id];saveCustom();if(setupSel.me===id)setupSel.me='zibi';if(setupSel.opp===id)setupSel.opp='pietro';rebuildChars();renderSetup();};
  return b;}
function rebuildChars(){for(const [el,g] of [['cMe','me'],['cOpp','opp']]){const c=$(el);c.innerHTML='';Object.keys(CHARS).forEach(id=>c.appendChild(charCard(id,g)));
  if(g==='me'){const n=document.createElement('div');n.className='char';n.innerHTML='<button class="pick newbtn"><span class="plus">+</span><span>Nuovo da foto</span></button>';n.querySelector('button').onclick=openNew;c.appendChild(n);}}}
function chipRow(el,items,cur,onPick){const c=$(el);c.innerHTML='';items.forEach(([v,l])=>{const b=document.createElement('button');b.textContent=l;b.setAttribute('aria-pressed',String(v===cur));b.onclick=()=>onPick(v);c.appendChild(b);});}
function renderSetup(){
  if(!$('cMe').children.length)rebuildChars();
  for(const [el,g] of [['cMe','me'],['cOpp','opp']])[...$(el).children].forEach(b=>{const p=b.querySelector('.pick');if(b.dataset.id)p.setAttribute('aria-pressed',String(b.dataset.id===setupSel[g]));});
  chipRow('gSel',[['gor','Goriziana · 9 birilli'],['ita','Italiana · 5 birilli']],setupSel.game,v=>{setupSel.game=v;setupSel.target=GAMES[v].def;S=freshTable(v);renderSetup();renderRules();});
  chipRow('lvl',LEVELS.map(L=>[L.n,L.n+' · '+L.name]).concat([[0,'Amico (2 giocatori)']]),setupSel.level,v=>{setupSel.level=v;renderSetup();});
  chipRow('tgt',GAMES[setupSel.game].targets.map(n=>[n,String(n)]),setupSel.target,v=>{setupSel.target=v;renderSetup();});
  $('labOpp').textContent='Avversario con la '+GAMES[setupSel.game].bn.y;
}
function updateScore(){
  if(!match)return;const P=match.players;
  [0,1].forEach(i=>{$('s'+i).textContent=match.score[i];$('n'+i).textContent=CHARS[P[i].char].name+(P[i].cpu?' · liv. '+P[i].level:'');$('i'+i).src=CHARS[P[i].char].img;$('p'+i).classList.toggle('on',match.turn===i&&!match.over);$('b'+i).style.background=GAMES[match.game].col[i?'y':'w'];});
  $('turn').innerHTML=GAMES[match.game].name+' a '+match.target+'<b>'+(match.over?'Fine':'Tocca a '+CHARS[P[match.turn].char].name)+'</b>';
}
function startMatch(){
  cancelAll();const cpu=setupSel.level>0;
  if(!CHARS[setupSel.me])setupSel.me='zibi';if(!CHARS[setupSel.opp])setupSel.opp='pietro';
  match={game:setupSel.game,players:[{char:setupSel.me,cpu:false},{char:setupSel.opp,cpu,level:setupSel.level||0}],score:[0,0],turn:0,target:setupSel.target,over:false,offer:null,S:freshTable(setupSel.game)};
  S=match.S;inHand={me:'w',op:'y'};$('win').hidden=true;applyMode();aimAtOpp();setSpin(0,0);setPower(40);
  msg('Inizia '+CHARS[setupSel.me].name+': metti la bianca dove vuoi nella metà sinistra, poi tira sulla '+GM().bn.y+'.');
}
function showWin(i){const c=CHARS[match.players[i].char];$('winImg').src=c.img;$('winTxt').textContent='Vince '+c.name;$('winScore').textContent=match.score[0]+' a '+match.score[1];$('win').hidden=false;updateScore();showOffer();}
function applyMode(){
  const tr=mode==='train',sc=mode==='school';
  $('tabTrain').setAttribute('aria-pressed',String(tr));$('tabMatch').setAttribute('aria-pressed',String(mode==='match'));$('tabSchool').setAttribute('aria-pressed',String(sc));
  $('gameUI').hidden=sc;$('school').hidden=!sc;
  $('setup').hidden=mode!=='match'||!!match;
  const setupOnly=mode==='match'&&!match;['viewRow','stageBox','shootRow','msg','ctrlBox','offerBar'].forEach(id=>{$(id).hidden=setupOnly||(id==='offerBar'&&$(id).hidden);});$('scoreBar').hidden=mode!=='match'||!match;
  $('trainBar').hidden=!tr;$('tips').hidden=!tr;$('win').hidden=mode!=='match'||!(match&&match.over);
  $('newg').textContent=tr?'Ripeti tiro':'Nuova partita';
  if(tr)chipRow('gTrain',[['gor','Goriziana'],['ita','Italiana']],trainGame,v=>{if(v===trainGame)return;cancelAll();trainGame=v;trainS=freshTable(v);S=trainS;trainSnap=null;applyMode();aimAtOpp();msg(GAMES[v].full+': trascina le biglie e prova i tiri.');});
  if(sc)renderSchool();else renderRules();
  updateScore();showOffer();
}
$('tabTrain').onclick=()=>{if(mode==='train')return;if(mode==='match'){finishNow();if(match)match.inHandSaved=inHand;}cancelAll();mode='train';S=trainS;inHand=null;applyMode();aimAtOpp();msg('Allenamento: trascina le biglie e prova i tiri.');};
$('tabMatch').onclick=()=>{if(mode==='match')return;if(mode==='train')finishNow();cancelAll();mode='match';S=match?match.S:freshTable(setupSel.game);if(!match){renderSetup();inHand=null;}else inHand=match.inHandSaved||null;applyMode();if(match)aimAtOpp();msg(match?'Partita in corso.':'Scegli gioco, personaggi e livello, poi inizia.');if(isCpuTurn())laterCpu(500);};
$('tabSchool').onclick=()=>{if(mode==='school')return;if(mode==='match'||mode==='train')finishNow();if(mode==='match'&&match)match.inHandSaved=inHand;cancelAll();mode='school';applyMode();};
$('startMatch').onclick=startMatch;
$('again').onclick=()=>{cancelAll();match=null;inHand=null;S=freshTable(setupSel.game);$('win').hidden=true;renderSetup();applyMode();msg('Scegli gioco, personaggi e livello, poi inizia.');};
$('newg').onclick=()=>{if(mode==='train'){if(busy())return;redo();return;}cancelAll();match=null;S=freshTable(setupSel.game);inHand=null;renderSetup();applyMode();msg('Scegli gioco, personaggi e livello, poi inizia.');};
function redo(){if(!trainSnap||busy())return;KEYS.forEach(k=>Object.assign(S.balls[k],trainSnap[k],{vx:0,vy:0,side:0,fol:0}));setAngle(trainSnap.angle);setPower(trainSnap.power);setSpin(trainSnap.sx,trainSnap.sy);msg('Posizione del tiro precedente ripristinata.');}
$('redo').onclick=redo;
$('resetTrain').onclick=()=>{cancelAll();trainS=freshTable(trainGame);S=trainS;aimAtOpp();msg('Posizione iniziale.');};

trainS=freshTable(trainGame);S=trainS;setPower(40);setSpin(0,0);aimAtOpp();applyMode();
try{if(localStorage.getItem('mg-view')==='3d')setView('3d');}catch(e){}
requestAnimationFrame(frame);
})();
