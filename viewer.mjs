import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {PLYLoader} from 'three/addons/loaders/PLYLoader.js';
import {plyKind,MAX_MODEL_BYTES} from './model-format.mjs';

export async function mountViewer(host,config,onStatus){
 let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{throw Error('This device cannot start  WebGL.  Switch to the scene photo to keep exploring.');}
 const scene=new T.Scene();scene.background=new T.Color('#e8e0cc');
 const camera=new T.PerspectiveCamera(40,1,.01,500);camera.position.set(...config.initialCamera);
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','Exterior white model; drag to rotate or use the view and zoom buttons below');host.append(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=2;controls.maxDistance=60;controls.maxPolarAngle=Math.PI*.88;
 scene.add(new T.HemisphereLight(0xffffff,0x7e858c,2.2));const sun=new T.DirectionalLight(0xffffff,2.4);sun.position.set(4,10,8);scene.add(sun);
 let object=new T.Group(),disposed=false,frame=0,anim=null,local=false,busy=false,variantIndex=0,placement=null;scene.add(object);
 function release(o){scene.remove(o);if(o?.dispose){Promise.resolve(o.dispose()).catch(()=>{});}o?.traverse(x=>{x.geometry?.dispose();const m=Array.isArray(x.material)?x.material:[x.material];m.filter(Boolean).forEach(m=>{Object.values(m).forEach(v=>v?.isTexture&&v.dispose());m.dispose();});});}
 function replace(o){if(disposed){release(o);return;}release(object);object=o;scene.add(o);}
 const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(host);
 let frames=0,start=performance.now(),warned=false;
 function tick(){if(disposed)return;frame=requestAnimationFrame(tick);if(anim){camera.position.lerp(anim.position,.09);controls.target.lerp(anim.target,.09);if(camera.position.distanceTo(anim.position)<.02)anim=null;}controls.update();renderer.render(scene,camera);frames++;if(!warned&&frames===90&&performance.now()-start>6000){warned=true;onStatus('Rendering is slow on this device. Switch to the scene photo to continue.');}}
 tick();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onStatus('3D view interrupted. Switch to the photo or retry the model.');});
 function fit(o,builtin=false){const b=new T.Box3().setFromObject(o);const size=b.getSize(new T.Vector3());if(!Number.isFinite(size.length())||size.length()===0)throw Error('The model has no displayable geometry');const wrapper=new T.Group();wrapper.add(o);o.position.sub(b.getCenter(new T.Vector3()));const scale=8/Math.max(size.x,size.y,size.z);wrapper.scale.setScalar(scale);if(builtin)placement={center:b.getCenter(new T.Vector3()),scale};return wrapper;}
 function pose(index){
  const v=config.views[index];if(!v)return null;
  if(local)return {position:new T.Vector3(index===2?-12:index===3?12:10,8,index===1?-12:12),target:new T.Vector3()};
  if(!placement)return null;
  let raw=v;
  const variant=config.variants?.[variantIndex];
  if(variant?.detail && index===config.views.length-1)raw={position:variant.detail[0],target:variant.detail[1]};
  const transform=a=>new T.Vector3(...a).sub(placement.center).multiplyScalar(placement.scale);
  const target=transform(raw.target),position=transform(raw.position);
  // Local acceptance cameras were designed for a full window. Fit the wider
  // standard views into this page's narrower embedded canvas too.
  if(index<config.views.length-1){const aspect=host.clientWidth/Math.max(1,host.clientHeight);position.sub(target).multiplyScalar(Math.max(1,1.25/aspect)).add(target);}
  return {position,target};
 }
 function setView(index,immediate=false){const v=pose(index);if(!v)return;if(immediate){anim=null;camera.position.copy(v.position);controls.target.copy(v.target);controls.update();}else anim=v;}
 async function loadBuiltin(index=0){
  if(busy)throw Error('Please wait for the current model to finish loading');
  const item=config.variants?.[index]||config;if(!item.modelUrl)throw Error('Model is not configured');
  busy=true;onStatus('Loading exterior white model…');
  try{const gltf=await new GLTFLoader().loadAsync(item.modelUrl);if(disposed){release(gltf.scene);return;}
   const next=fit(gltf.scene,true);replace(next);local=false;variantIndex=index;setView(0,true);
   let meshes=0;gltf.scene.traverse(o=>{if(o.isMesh)meshes++;});
   onStatus(`${item.scope||config.scope} · ${meshes} components`);
   const caption=document.querySelector('.scene-caption');if(caption)caption.textContent=item.scope||config.scope;
  }catch(e){if(!disposed)onStatus('White model could not be loaded. Retry or switch to the scene photo.');throw e;}
  finally{busy=false;}
 }
 const api={
  view(index){setView(index);},
  focus(index){if(local||config.type==='white-model')return;const h=config.hotspots[index];if(h)anim={position:new T.Vector3(h.focus[0]+5,h.focus[1]+4,h.focus[2]+7),target:new T.Vector3(...h.focus)};},
  zoom(factor){anim=null;camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);},
  async reset(){if(local)await loadBuiltin(variantIndex);else setView(0);},
  async variant(index){if(!config.variants?.[index])throw Error('Unknown model selection');await loadBuiltin(index);},
  rotate(){anim=null;camera.position.sub(controls.target).applyAxisAngle(new T.Vector3(0,1,0),Math.PI/6).add(controls.target);controls.update();},
  async load(files){
   if(busy)return;const list=Array.from(files);const file=list.find(f=>/\.(ply|gltf|glb)$/i.test(f.name));if(!file)throw Error('Please select  PLY, GLB  or  GLTF  file');
   if(list.reduce((s,f)=>s+f.size,0)>MAX_MODEL_BYTES)throw Error('This demo loads up to 64  MB,  Please compress the model first.');
   busy=true;const urls=[];onStatus('Parsing model locally. No files are uploaded…');
   try{
    const b=await file.arrayBuffer();let o;
    if(/\.ply$/i.test(file.name)){
     if(plyKind(b)==='gaussian'){
      const G=await import('./vendor/gaussian-splats-3d.module.js');if(disposed)return;
      const u=URL.createObjectURL(file);urls.push(u);const splat=new G.DropInViewer({gpuAcceleratedSort:false,sharedMemoryForWorkers:false,integerBasedSort:false});
      try{await splat.addSplatScene(u,{format:G.SceneFormat.Ply,progressiveLoad:false,showLoadingUI:false});}catch(e){await splat.dispose();throw e;}
      o=splat;onStatus(`${file.name} · 3D Gaussian rendering · file origin used; adjust the viewpoint as needed`);
     }else{
      const geometry=new PLYLoader().parse(b);if(!geometry.getAttribute('position')?.count)throw Error('Point cloud has no coordinates');
      const color=Boolean(geometry.getAttribute('color'));o=fit(new T.Points(geometry,new T.PointsMaterial({size:.025,sizeAttenuation:true,vertexColors:color,color:color?0xffffff:0x8b5e38})));
      onStatus(`${file.name} · Standard  PLY  point cloud${color?'':' · No colours; using a uniform ochre tone'}`);
     }
    }else{
     const manager=new T.LoadingManager();const byName=new Map(list.map(f=>[f.name,f]));
     manager.setURLModifier(url=>{if(url.startsWith('data:')||url.startsWith('blob:'))return url;const name=decodeURIComponent(url).split('/').at(-1);const f=byName.get(name);if(!f)throw Error('Missing  GLTF  supporting file: '+name+'; select the model and its  .bin/textures, or use a single-file  GLB');const u=URL.createObjectURL(f);urls.push(u);return u;});
     const gltf=await new GLTFLoader(manager).parseAsync(b,'');o=fit(gltf.scene);onStatus(`${file.name} · Local 3D model · teaching hotspots do not apply to this asset`);
    }
    replace(o);local=true;api.view(0);
   }catch(e){if(!disposed)onStatus('Load failed: '+(e.message||'incompatible file')+'.  The previous scene remains available.');throw e;}
   finally{busy=false;urls.forEach(u=>URL.revokeObjectURL(u));}
  },
  destroy(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();controls.dispose();release(object);renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
 };
 try{await loadBuiltin(0);}catch(e){api.destroy();throw e;}
 return api;
}
