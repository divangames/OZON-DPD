// WebGL-скульптура соединения: два объёмных звена в цветах OZON и DPD.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
// Замкнутое звено с закруглёнными внешним и внутренним контурами.
function linkGeometry(size,band,depth){
 const shape=new THREE.Shape();
 const draw=(path,half,radius)=>{path.moveTo(-half+radius,-half);path.lineTo(half-radius,-half);path.quadraticCurveTo(half,-half,half,-half+radius);path.lineTo(half,half-radius);path.quadraticCurveTo(half,half,half-radius,half);path.lineTo(-half+radius,half);path.quadraticCurveTo(-half,half,-half,half-radius);path.lineTo(-half,-half+radius);path.quadraticCurveTo(-half,-half,-half+radius,-half);};
 draw(shape,size/2,.6);const hole=new THREE.Path();draw(hole,size/2-band,.33);shape.holes.push(hole);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:8,steps:1,bevelSize:.075,bevelThickness:.075,curveSegments:32});geometry.translate(0,0,-depth/2);geometry.computeVertexNormals();return geometry;
}
// Сцена останавливается вне экрана и в скрытой вкладке; reduced motion оставляет статичный кадр.
export function initScene(container){
 let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{return;}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0xf5f6f8,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.VSMShadowMap;renderer.domElement.setAttribute('aria-hidden','true');container.prepend(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(1.8,3.1,11.8);camera.lookAt(0,0,0);
 const pmrem=new THREE.PMREMGenerator(renderer),environment=new RoomEnvironment();scene.environment=pmrem.fromScene(environment,.04).texture;environment.dispose();pmrem.dispose();
 scene.environmentIntensity=.6;scene.add(new THREE.HemisphereLight(0xffffff,0x8190ad,.6));
 const key=new THREE.DirectionalLight(0xffffff,2.7);key.position.set(-4,7,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-7;key.shadow.camera.right=7;key.shadow.camera.top=7;key.shadow.camera.bottom=-7;key.shadow.normalBias=.04;key.shadow.radius=6;key.shadow.blurSamples=12;scene.add(key);
 const fill=new THREE.DirectionalLight(0xc8deff,.9);fill.position.set(5,1,2);scene.add(fill);
 const sculpture=new THREE.Group();sculpture.rotation.set(.05,-.2,-.22);scene.add(sculpture);
 const blue=new THREE.Mesh(linkGeometry(3.5,.7,.7),new THREE.MeshPhysicalMaterial({color:0x005bff,metalness:.16,roughness:.22,clearcoat:.65,clearcoatRoughness:.2}));blue.position.set(-1.15,.35,0);blue.rotation.set(-.12,-.12,.1);blue.castShadow=true;blue.receiveShadow=true;sculpture.add(blue);
 const red=new THREE.Mesh(linkGeometry(3.5,.7,.7),new THREE.MeshPhysicalMaterial({color:0xdc0032,metalness:.14,roughness:.23,clearcoat:.65,clearcoatRoughness:.2}));red.position.set(.65,-.3,.15);red.rotation.set(.72,1.05,.2);red.castShadow=true;red.receiveShadow=true;sculpture.add(red);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.ShadowMaterial({opacity:.13}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.7;floor.receiveShadow=true;scene.add(floor);
 let visible=true,frame=0,targetX=0,targetY=0,currentX=0,currentY=0;
 // Камера следует пропорциям контейнера, без скачков внешней разметки.
 function resize(){const width=container.clientWidth,height=container.clientHeight;if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.render(scene,camera);}
 new ResizeObserver(resize).observe(container);resize();container.classList.add('scene-ready');
 if(matchMedia('(hover:hover) and (pointer:fine)').matches){container.addEventListener('pointermove',event=>{const rect=container.getBoundingClientRect();targetX=((event.clientX-rect.left)/rect.width-.5)*.13;targetY=((event.clientY-rect.top)/rect.height-.5)*.1;});container.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});}
 function render(time){if(!visible||document.hidden||reduced.matches){frame=0;return;}currentX+=(targetX-currentX)*.045;currentY+=(targetY-currentY)*.045;sculpture.rotation.y=-.2+currentX;sculpture.rotation.x=.05+currentY;sculpture.position.y=Math.sin(time*.00065)*.075;renderer.render(scene,camera);frame=requestAnimationFrame(render);}
 function resume(){if(!frame&&!reduced.matches&&visible&&!document.hidden)frame=requestAnimationFrame(render);else renderer.render(scene,camera);}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}resume();},{threshold:.02}).observe(container);document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);resume();
}
