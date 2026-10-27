// Reproducible, original stylized sculpture based on the owner's portrait.
// This is an artistic approximation, not a scan or an inferred photoreal face.
import * as T from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }); }
};
const scene = new T.Scene();
scene.name = 'Ali_Nguyen_Stylized_Guide';
scene.userData = { reference: 'public/ali-nguyen-portrait-480.webp', style: 'Original procedural stylized likeness; not a scan', units: 'meters', forward: '+Z' };
const bones = [], byName = {}, parts = new Map();
function bone(name, parent, xyz) {
  const b = new T.Bone(); b.name = name; b.position.fromArray(xyz);
  (parent ?? scene).add(b); bones.push(b); byName[name] = b; return b;
}
const hips = bone('Hips', null, [0,.83,0]);
const spine = bone('Spine', hips, [0,.18,0]);
const chest = bone('Spine1', spine, [0,.19,0]);
const neck = bone('Neck', chest, [0,.17,0]);
const head = bone('Head', neck, [0,.15,0]);
bone('Head_Mouth_Node', head, [0,-.065,.18]);
for (const [side,s] of [['Left',1],['Right',-1]]) {
  const upper = bone(`${side}Arm`, chest, [s*.22,.025,0]);
  const fore = bone(`${side}ForeArm`, upper, [s*.045,-.23,0]);
  bone(`${side}Hand`, fore, [s*.012,-.21,0]);
  const thigh = bone(`${side}UpLeg`, hips, [s*.105,-.015,0]);
  const shin = bone(`${side}Leg`, thigh, [0,-.36,0]);
  bone(`${side}Foot`, shin, [0,-.35,.025]);
  bone(`${side}Eye`, head, [s*.081,.015,.155]);
}
scene.updateMatrixWorld(true);
const materials = {
  skin: new T.MeshStandardMaterial({color:0xc99478,roughness:.67}),
  hair: new T.MeshStandardMaterial({color:0x17191d,roughness:.56}),
  suit: new T.MeshStandardMaterial({color:0x242a34,roughness:.87}),
  shirt: new T.MeshStandardMaterial({color:0x10141c,roughness:.8}),
  shoe: new T.MeshStandardMaterial({color:0x14171d,roughness:.36}),
  white: new T.MeshStandardMaterial({color:0xf2eae1,roughness:.38}),
  iris: new T.MeshStandardMaterial({color:0x483029,roughness:.34}),
  lip: new T.MeshStandardMaterial({color:0x985f50,roughness:.75}),
  metal: new T.MeshStandardMaterial({color:0x868c96,metalness:.75,roughness:.3}),
};
function add(geo, material, joint) {
  // All vertices use bind-space coordinates. A single shared humanoid skeleton
  // drives the merged meshes, keeping the draw count bounded by material count.
  const count = geo.attributes.position.count;
  const indices = new Uint16Array(count*4), weights = new Float32Array(count*4);
  const index = bones.indexOf(joint);
  for(let i=0;i<count;i++) { indices[i*4]=index; weights[i*4]=1; }
  geo.setAttribute('skinIndex',new T.Uint16BufferAttribute(indices,4));
  geo.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));
  if(!parts.has(material)) parts.set(material,[]);
  parts.get(material).push(geo.index ? geo.toNonIndexed() : geo.clone()); geo.dispose();
}
function ellipsoid(material,joint,center,scale,rotation=0) {
  const geo = new T.SphereGeometry(1,20,14);
  geo.scale(...scale); geo.rotateZ(rotation); geo.translate(...center); add(geo,material,joint);
}
function tube(material,joint,points,radius,segments=20) {
  const curve = new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
  add(new T.TubeGeometry(curve,segments,radius,7,false),material,joint);
}
function limb(material,joint,x,top,bottom,radiusTop,radiusBottom,depth=1) {
  const geo = new T.CylinderGeometry(radiusTop,radiusBottom,top-bottom,16,4);
  geo.scale(1,1,depth); geo.translate(x,(top+bottom)/2,0); add(geo,material,joint);
  ellipsoid(material,joint,[x,top,0],[radiusTop,radiusTop*.6,radiusTop*depth]);
  ellipsoid(material,joint,[x,bottom,0],[radiusBottom,radiusBottom*.6,radiusBottom*depth]);
}
function plate(material,joint,points,depth=.012) {
  const shape = new T.Shape(points.map(p=>new T.Vector2(p[0],p[1])));
  const geo = new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.004,bevelThickness:.003,bevelSegments:2,steps:1});
  geo.translate(0,0,points[0][2]); add(geo,material,joint);
}
// Tailored silhouette, dark open collar and separate lapels.
ellipsoid('suit',spine,[0,1.045,0],[.205,.255,.115]);
ellipsoid('suit',chest,[0,1.19,0],[.235,.13,.12]);
ellipsoid('shirt',chest,[0,1.185,.091],[.095,.155,.04]);
ellipsoid('skin',neck,[0,1.39,0],[.071,.12,.066]);
for(const s of [-1,1]) {
  plate('suit',chest,[[s*.07,1.345,.128],[s*.19,1.22,.128],[s*.09,1.08,.128],[s*.015,1.17,.128]]);
  tube('shirt',chest,[[s*.075,1.345,.135],[s*.11,1.23,.14],[s*.015,1.17,.14]],.005);
  tube('shirt',spine,[[s*.10,.98,.107],[s*.17,.98,.09]],.005,5);
}
ellipsoid('shirt',hips,[0,.835,0],[.185,.083,.11]);
ellipsoid('metal',hips,[0,.864,.112],[.022,.016,.005]);
for(const y of [1.16,1.09,1.02]) ellipsoid('metal',spine,[0,y,.123],[.006,.006,.004]);
for(const [side,s] of [['Left',1],['Right',-1]]) {
  const upper=byName[`${side}Arm`],fore=byName[`${side}ForeArm`],hand=byName[`${side}Hand`];
  limb('suit',upper,s*.25,1.21,.997,.073,.061);
  limb('suit',fore,s*.271,1.0,.79,.061,.047);
  ellipsoid('shirt',fore,[s*.277,.79,0],[.056,.025,.06]);
  ellipsoid('skin',hand,[s*.279,.735,.006],[.044,.066,.027]);
  for(let f=0;f<4;f++) ellipsoid('skin',hand,[s*(.25+f*.018),.685,.014],[.009,.035-(f===3?.008:0),.012]);
  ellipsoid('skin',hand,[s*.235,.731,.027],[.017,.034,.018],s*-.4);
  limb('suit',byName[`${side}UpLeg`],s*.105,.82,.45,.089,.075,1.1);
  limb('suit',byName[`${side}Leg`],s*.105,.45,.115,.075,.062,1.08);
  tube('shirt',byName[`${side}Leg`],[[s*.105,.46,.079],[s*.105,.13,.077]],.0035,6);
  ellipsoid('shoe',byName[`${side}Foot`],[s*.105,.064,.062],[.077,.062,.135]);
  ellipsoid('shirt',byName[`${side}Foot`],[s*.105,.025,.064],[.078,.023,.136]);
}
// Sculpted head, jaw, cheek volumes, ears, nose and lips.
const face = new T.SphereGeometry(1,32,24);
for(let i=0;i<face.attributes.position.count;i++) {
  const p=face.attributes.position; const y=p.getY(i);
  p.setXYZ(i,p.getX(i)*.18*(y<0?1+y*.18:1),y*.224+1.55,p.getZ(i)*.155);
}
face.computeVertexNormals(); add(face,'skin',head);
for(const [side,s] of [['Left',1],['Right',-1]]) {
  ellipsoid('skin',head,[s*.177,1.52,-.002],[.033,.061,.025]);
  ellipsoid('lip',head,[s*.189,1.52,.017],[.012,.031,.007]);
  const eye=byName[`${side}Eye`];
  ellipsoid('white',eye,[s*.081,1.535,.155],[.046,.025,.017]);
  ellipsoid('iris',eye,[s*.081,1.535,.171],[.019,.021,.005]);
  ellipsoid('hair',eye,[s*.081,1.535,.176],[.010,.014,.003]);
  ellipsoid('white',eye,[s*.075,1.543,.18],[.0045,.0045,.002]);
  tube('hair',head,[[s*.038,1.584,.144],[s*.079,1.596,.152],[s*.123,1.58,.129]],.009,10);
}
ellipsoid('skin',head,[0,1.505,.149],[.024,.064,.033]);
ellipsoid('skin',head,[0,1.48,.171],[.034,.022,.026]);
tube('lip',head,[[-.045,1.43,.13],[0,1.433,.147],[.045,1.43,.13]],.007,12);
tube('lip',head,[[-.039,1.424,.132],[0,1.416,.146],[.039,1.424,.132]],.006,12);
// Short tapered sides and swept quiff matching the reference's silhouette.
const cap = new T.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI*.49);
cap.scale(.187,.207,.161); cap.translate(0,1.58,-.012); add(cap,'hair',head);
for(const s of [-1,1]) ellipsoid('hair',head,[s*.166,1.635,-.042],[.027,.09,.116]);
for(let i=0;i<9;i++) {
  const x=-.137+i*.031;
  const lift=.025*Math.sin(i/8*Math.PI);
  tube('hair',head,[[x,1.665,.125],[x-.035,1.745+lift,.095],[x-.013,1.77+lift,-.005],[x+.022,1.708,-.105]],.025,14);
}
const skeleton = new T.Skeleton(bones);
for(const [name,geos] of parts) {
  const merged=mergeGeometries(geos); const geo=mergeVertices(merged); merged.dispose(); const mesh=new T.SkinnedMesh(geo,materials[name]);
  mesh.name=`Ali_${name}`; scene.add(mesh); mesh.bind(skeleton);
  for(const g of geos)g.dispose();
}
// Every clip keys every animated joint, so transitions restore neutral limbs.
const animated=bones.filter(b=>!b.name.endsWith('Mouth_Node'));
function clip(name,duration,pose) {
  const tracks=[];const times=Array.from({length:Math.round(duration*30)+1},(_,i)=>Math.min(i/30,duration));
  for(const b of animated) {
    const values=[];
    for(const t of times) { const e=pose(t,b.name); const q=new T.Quaternion().setFromEuler(new T.Euler(...e)); values.push(q.x,q.y,q.z,q.w); }
    tracks.push(new T.QuaternionKeyframeTrack(`${b.name}.quaternion`,times,values));
  }
  // Authored deterministic blink timing, periodic across the 10-second idle.
  for(const side of ['Left','Right']) {
    const values=[];
    for(const t of times) {
      let openness=1;
      for(const blink of [2.1,5.3,5.65,8.4]) openness=Math.min(openness,1-.95*Math.max(0,1-Math.abs(t-blink)/.09));
      values.push(1,name==='idle_loop'?openness:1,1);
    }
    tracks.push(new T.VectorKeyframeTrack(`${side}Eye.scale`,times,values));
  }
  return new T.AnimationClip(name,duration,tracks).optimize();
}
function idle(t,n) {
  const s=Math.sin(t*Math.PI/5);
  if(n==='Spine')return [s*.012,0,s*.016];
  if(n==='Head')return [s*.018,Math.sin(t*Math.PI/5)*.035,0];
  return [0,0,0];
}
function gait(run) { return (t,n)=> {
  const phase=t*Math.PI*2/(run?.65:1.1),wave=Math.sin(phase),s=n.startsWith('Left')?1:-1;
  if(n.endsWith('UpLeg'))return [s*wave*(run?.75:.43),0,0];
  if(n.endsWith('Leg'))return [Math.max(0,-s*wave)*(run?1.05:.6),0,0];
  if(n.endsWith('Arm'))return [-s*wave*(run?.8:.43),0,s*.06];
  if(n.endsWith('ForeArm'))return [run?-1.0:-.17,0,0];
  if(n==='Spine')return [run?.13:.035,wave*.04,0];
  return [0,0,0];
}; }
function point(side) {return (t,n)=> {
  const a=Math.min(1,t/.6,(2.5-t)/.6),ease=Math.max(0,a*a*(3-2*a));
  if(n===`${side}Arm`)return [0,0,(side==='Left'?1:-1)*1.45*ease];
  if(n===`${side}ForeArm`)return [-.12*ease,0,0];
  if(n==='Head')return [0,(side==='Left'?.22:-.22)*ease,0];
  return [0,0,0];
};}
const clips=[clip('idle_loop',10,idle),clip('walk_forward',1.1,gait(false)),clip('sprint_forward',.65,gait(true)),clip('gesture_point_left',2.5,point('Right')),clip('gesture_point_right',2.5,point('Left')),
  clip('pose_proud',2.5,(t,n)=>n==='Spine'?[-.06*Math.sin(t/2.5*Math.PI),0,0]:[0,0,0]),
  clip('pose_bored',2.5,(t,n)=>n==='Head'?[.17*Math.sin(t/2.5*Math.PI),0,.08*Math.sin(t/2.5*Math.PI)]:[0,0,0])];
const buffer=await new GLTFExporter().parseAsync(scene,{binary:true,animations:clips,onlyVisible:true});
const destination=resolve('public/assets/tour_guide.glb');
await mkdir(resolve('public/assets'),{recursive:true}); await writeFile(destination,Buffer.from(buffer));
console.log(JSON.stringify({file:destination,bytes:buffer.byteLength,bones:bones.length,clips:clips.map(c=>({name:c.name,duration:c.duration})),materials:parts.size}));
