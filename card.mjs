import {cardEligible,clean,chars} from './state.mjs';
import {getLandmark,MAP_IMAGE} from './data.mjs';
const loadImage=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Illustration failed to load. Check your connection and retry.'));i.src=src;});
let fontPromise;
async function font(){if(!fontPromise)fontPromise=(async()=>{const f=new FontFace('CardSans','url(assets/fonts/NotoSansSC.ttf)',{weight:'100 900'});await f.load();document.fonts.add(f);})().catch(e=>{fontPromise=null;throw Error('Postcard font failed to load. Please retry.');});return fontPromise;}
function lines(ctx,text,width){let line='';const result=[];for(const token of String(text).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*|\s+|[^A-Za-z0-9\s]/gu)||[]){for(const c of ctx.measureText(token).width>width?chars(token):[token]){if(line&&ctx.measureText(line+c).width>width){result.push(line.trimEnd());line=c.trimStart();}else line+=c;}}if(line)result.push(line.trimEnd());return result;}
function cover(ctx,img,x,y,w,h){const s=Math.max(w/img.width,h/img.height);const sw=w/s,sh=h/s;ctx.drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,x,y,w,h);}
export async function renderCard(state){
 if(!cardEligible(state))throw Error('Complete all six stops before creating your postcard');
 let timer;
 try{
 const [,map,...art]=await Promise.race([Promise.all([font(),loadImage(MAP_IMAGE),...state.actual.map(id=>loadImage(`assets/journey-art-v2/${id}.png`))]),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Assets timed out. Please retry.')),30000);})]);
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;const c=canvas.getContext('2d');if(!c)throw Error('Postcard creation is not supported in this browser');
 c.fillStyle='#f5eddf';c.fillRect(0,0,1080,1440);c.strokeStyle='#cbb898';c.lineWidth=2;c.strokeRect(28,28,1024,1384);
 c.fillStyle='#a44935';c.font='500 21px CardSans';c.fillText('云游见筑   /   My Six-Stop Journey',62,78);
 c.fillStyle='#2b3d35';c.font='600 53px CardSans';c.fillText('My Story of 平遥',60,153);
 c.font='400 22px CardSans';c.fillStyle='#716b5e';const nick=state.postcard.hideNickname?'':`${state.nickname} · `;c.fillText(`${nick}Six stops completed ·  ${new Date(state.completedAt??state.startedAt).toLocaleDateString('en-GB',{timeZone:'Asia/Shanghai'})}`,64,198);
 // Keep the full map aspect ratio. Labels and numbers are independent of the painting.
 const mx=255,my=225,mw=570,mh=380;c.save();c.globalAlpha=.75;c.drawImage(map,mx,my,mw,mh);c.restore();
 const points=state.actual.map(id=>{const l=getLandmark(id);return {x:mx+l.map[0]*mw/100,y:my+l.map[1]*mh/100,l};});
 c.strokeStyle='#a44935';c.lineWidth=3;c.setLineDash([7,5]);c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();c.setLineDash([]);
 points.forEach((p,i)=>{c.fillStyle='#a44935';c.beginPath();c.arc(p.x,p.y,16,0,Math.PI*2);c.fill();c.textAlign='center';c.fillStyle='#fff8e9';c.font='600 17px CardSans';c.fillText(String(i+1),p.x,p.y+6);});c.textAlign='left';
 c.fillStyle='#716b5e';c.font='400 17px CardSans';c.textAlign='center';c.fillText('My actual visiting order · learning diagram, not navigation',540,635);c.textAlign='left';
 state.actual.forEach((id,i)=>{const l=getLandmark(id),x=60+(i%2)*492,y=666+Math.floor(i/2)*180;c.fillStyle='#fffaf0';c.fillRect(x,y,468,158);cover(c,art[i],x+8,y+8,142,142);c.fillStyle='#a44935';c.font='500 18px CardSans';c.fillText(`Stop ${i+1}`,x+168,y+32);c.fillStyle='#2b3d35';c.font='600 27px CardSans';c.fillText(l.name,x+168,y+76);c.fillStyle='#716b5e';c.font='400 18px CardSans';lines(c,l.theme,280).slice(0,2).forEach((line,j)=>c.fillText(line,x+168,y+110+j*25));});
 c.strokeStyle='#cbb898';c.beginPath();c.moveTo(62,1210);c.lineTo(1018,1210);c.stroke();
 const reflection=clean(state.postcard.reflection,40);c.fillStyle='#2b3d35';c.font='400 25px CardSans';
 if(reflection){lines(c,reflection,738).forEach((s,i)=>c.fillText(s,64,1260+i*38));}
 else{c.font='400 23px CardSans';c.fillText(`From ${getLandmark(state.actual[0]).short} to ${getLandmark(state.actual.at(-1)).short}: six stops completed.`,64,1272);}
 c.save();c.translate(936,1285);c.rotate(-.07);c.strokeStyle=c.fillStyle='#a44935';c.lineWidth=3;c.strokeRect(-63,-57,126,114);c.textAlign='center';c.font='600 24px CardSans';c.fillText('Six Stops',0,-8,112);c.font='400 18px CardSans';c.fillText('平遥 Journey',0,30,112);c.restore();
 c.fillStyle='#716b5e';c.font='400 18px CardSans';c.fillText('云游见筑 · Your recorded route · teaching illustrations, not photographs',64,1380);
 c.font='400 13px CardSans';c.fillText('Image credits: pingyao-exploration-v4.yzs-jordan.chatgpt.site/art-credits.html',64,1400);
 return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG export failed. Please retry.')),'image/png'));
 }finally{clearTimeout(timer);}
}
