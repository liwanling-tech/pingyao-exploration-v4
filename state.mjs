import {ids} from './data.mjs';
export const STORAGE_KEY='yunjian:exploration:v4:journey';
const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('zh',{granularity:'grapheme'}):null;
export const chars=text=>{
 const value=String(text??'');
 if(segmenter)return Array.from(segmenter.segment(value),x=>x.segment);
 // Conservative fallback for Chinese text, combining marks and joined emoji.
 const result=[];let join=false,regional=false;
 for(const c of Array.from(value)){
  const code=c.codePointAt(0),flag=code>=0x1f1e6&&code<=0x1f1ff;
  const attached=/[\u0300-\u036f\ufe00-\ufe0f\u20d0-\u20ff]/.test(c)||(code>=0x1f3fb&&code<=0x1f3ff);
  if(result.length&&(join||attached||c==='\u200d'||(flag&&regional)))result[result.length-1]+=c;else result.push(c);
  join=c==='\u200d';regional=flag&&!regional;
 }
 return result;
};
export const clean=(text,limit=160)=>chars(String(text??'').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g,'').trim()).slice(0,limit).join('');
export const validNickname=name=>{const n=chars(clean(name,100)).length;return n>=2&&n<=12;};
export function recommended(start){const i=ids.indexOf(start);if(i<0)throw Error('Choose a valid landmark');return [...ids.slice(i),...ids.slice(0,i)];}
export function initial(){return {version:4,nickname:'小遥',startedAt:null,completedAt:null,start:'gate',plan:recommended('gate'),actual:[],stops:{},postcard:{hideNickname:false,reflection:''}};}
export function nextId(s){return s.plan.find(id=>!s.actual.includes(id))??null;}
export function cardEligible(s){return ids.length===s.actual.length&&new Set(s.actual).size===ids.length&&ids.every(id=>s.actual.includes(id)&&s.stops[id]?.completedAt&&clean(s.stops[id]?.discovery));}
const clone=s=>JSON.parse(JSON.stringify(s));
export function reduce(s,action){
 const n=clone(s);
 if(action.type==='nickname'){if(!validNickname(action.value))throw Error('Nickname must contain 2–12 characters');n.nickname=clean(action.value,12);}
 else if(action.type==='startpoint'){if(s.startedAt)throw Error('Journey started; the starting point is fixed. You may reorder unvisited stops.');n.start=action.id;n.plan=recommended(action.id);}
 else if(action.type==='reorder'){
  const p=action.plan;
  if(!Array.isArray(p)||p.length!==6||new Set(p).size!==6||!p.every(id=>ids.includes(id)))throw Error('The route must contain exactly six different places');
  if(!s.actual.every((id,i)=>p[i]===id))throw Error('Completed order cannot change');
  if(!s.actual.length&&p[0]!==s.start)throw Error('Keep your selected starting point');n.plan=[...p];
 }
 else if(action.type==='start'){if(!n.startedAt)n.startedAt=action.at??new Date().toISOString();}
 else if(action.type==='visit'){
  if(!n.startedAt||(!s.actual.includes(action.id)&&action.id!==nextId(s)))throw Error('Enter this stop from your current route');
  n.stops[action.id]={...n.stops[action.id],visitedAt:n.stops[action.id]?.visitedAt??new Date().toISOString()};
 }
 else if(action.type==='draft'){
  if(!ids.includes(action.id))throw Error('Landmark not found');n.stops[action.id]={...n.stops[action.id],draft:clean(action.value)};
 }
 else if(action.type==='complete'){
  const id=action.id;const discovery=clean(action.discovery);
  if(!s.startedAt||!s.stops[id]?.visitedAt)throw Error('Explore this stop first');
  if(!discovery)throw Error('Choose a discovery or write an observation');
  if(!s.actual.includes(id)&&id!==nextId(s))throw Error('Complete your current stop or adjust the route on the map');
  n.stops[id]={...s.stops[id],discovery,draft:discovery,completedAt:s.stops[id]?.completedAt??action.at??new Date().toISOString()};
  if(!s.actual.includes(id))n.actual.push(id);
  if(cardEligible(n)&&!n.completedAt)n.completedAt=action.at??new Date().toISOString();
 }
 else if(action.type==='postcard'){n.postcard={hideNickname:Boolean(action.hideNickname),reflection:clean(action.reflection,40)};}
 else throw Error('Unknown action');
 return n;
}
export function restore(raw){
 try{
  const s=JSON.parse(raw);if(s?.version!==4||!validNickname(s.nickname))return null;
  if(!ids.includes(s.start)||!Array.isArray(s.plan)||s.plan.length!==6||new Set(s.plan).size!==6||!s.plan.every(x=>ids.includes(x)))return null;
  if(!Array.isArray(s.actual)||new Set(s.actual).size!==s.actual.length||s.actual.length>6||!s.actual.every((id,i)=>id===s.plan[i]))return null;
  if(s.plan[0]!==s.start||(!s.startedAt&&s.actual.length))return null;
  const stops={};for(const id of ids){const t=s.stops?.[id];if(t)stops[id]={visitedAt:typeof t.visitedAt==='string'?t.visitedAt:null,completedAt:typeof t.completedAt==='string'?t.completedAt:null,discovery:clean(t.discovery),draft:clean(t.draft)};}
  if(!s.actual.every(id=>stops[id]?.visitedAt&&stops[id]?.completedAt&&stops[id]?.discovery))return null;
  return {...initial(),nickname:clean(s.nickname,12),startedAt:typeof s.startedAt==='string'?s.startedAt:null,completedAt:typeof s.completedAt==='string'?s.completedAt:null,start:s.start,plan:s.plan,actual:s.actual,stops,postcard:{hideNickname:Boolean(s.postcard?.hideNickname),reflection:clean(s.postcard?.reflection,40)}};
 }catch{return null;}
}
