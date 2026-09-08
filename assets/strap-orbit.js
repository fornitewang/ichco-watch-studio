/* Concept carousel: front/back depth, pointer capture, vertical page scrolling, keyboard and reduced motion. */
(() => {
  'use strict';
  const orbit=document.querySelector('#strap-orbit');
  if(!orbit)return;
  const items=[...orbit.querySelectorAll('.strap-item')];
  const names=['米蘭網帶','橄欖綠膠帶','黑色壓紋皮帶'];
  const descriptions=['細密的金屬編織，讓光沿著紋理流動。','柔和的霧面與深綠色調，留下安靜的輪廓。','壓紋與縫線交錯，讓細節在暗處浮現。'];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const pause=document.querySelector('#strap-pause');
  let angle=0,manualPause=reduced.matches,hover=false,focused=false,pointer=null,visible=false,raf=0,last=0,front=-1;
  let radiusX=0,radiusZ=0;
  const stopped=()=>manualPause||hover||focused||pointer!==null||document.hidden||!visible;
  function render(){
    let nearest=-2,index=0;
    items.forEach((item,i)=>{
      const a=angle+i*Math.PI*2/items.length,c=Math.cos(a),s=Math.sin(a);
      const x=s*radiusX,z=c*radiusZ,y=-c*14;
      // All straps stay straight. Their centres orbit through real Z depth; slight yaw reveals the turn.
      item.style.transform='translate(-50%,0) translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,'+z.toFixed(2)+'px) rotateY('+(s*-18).toFixed(2)+'deg)';
      item.style.zIndex=String(Math.round((c+1)*100)+1);
      item.style.opacity=String(.56+(c+1)*.22);
      if(c>nearest){nearest=c;index=i;}
    });
    if(index!==front){
      front=index;
      document.querySelector('#strap-name').textContent=names[index];
      document.querySelector('#strap-description').textContent=descriptions[index];
      document.querySelector('#strap-count').textContent='0'+(index+1)+' / 03';
    }
  }
  function tick(time){
    raf=0;
    if(stopped()){last=0;return;}
    const dt=last?Math.min((time-last)/1000,.05):0;
    last=time;angle=(angle+dt*.105)%(Math.PI*2);render();
    raf=requestAnimationFrame(tick);
  }
  function sync(){
    pause.textContent=manualPause?'繼續自轉':'暫停自轉';
    pause.setAttribute('aria-pressed',String(manualPause));
    if(stopped()){cancelAnimationFrame(raf);raf=0;last=0;}
    else if(!raf){last=0;raf=requestAnimationFrame(tick);}
  }
  function measure(){radiusX=orbit.clientWidth*.28;radiusZ=Math.min(150,orbit.clientWidth*.16);render();}
  const observer=new ResizeObserver(measure);observer.observe(orbit);
  // Decode all three nearby assets before they enter the orbit; a paused orbit must still repaint a loaded image.
  const preload=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    items.forEach(item=>{const img=item.querySelector('img');img.loading='eager';img.decode().then(()=>requestAnimationFrame(render)).catch(()=>{});});
    preload.disconnect();
  },{rootMargin:'600px'});
  preload.observe(orbit);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.08}).observe(orbit);
  orbit.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;sync();}});
  orbit.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hover=false;sync();}});
  orbit.addEventListener('pointerdown',e=>{
    if(!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0)||pointer!==null)return;
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY,angle,dragging:false,type:e.pointerType};
    orbit.setPointerCapture(e.pointerId);sync();
  });
  orbit.addEventListener('pointermove',e=>{
    if(!pointer||e.pointerId!==pointer.id)return;
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
    if(!pointer.dragging&&Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)*1.1){
      pointer.dragging=true;orbit.classList.add('is-dragging');
    }
    if(pointer.dragging){
      angle=pointer.angle+dx/(orbit.clientWidth*.58)*Math.PI;render();
    }
  });
  function release(e){
    if(!pointer||e.pointerId!==pointer.id)return;
    const id=pointer.id;
    pointer=null;orbit.classList.remove('is-dragging');
    if(orbit.hasPointerCapture(id))orbit.releasePointerCapture(id);
    sync();
  }
  ['pointerup','pointercancel','lostpointercapture'].forEach(name=>orbit.addEventListener(name,release));
  orbit.addEventListener('dragstart',e=>e.preventDefault());
  // Only keyboard focus pauses rotation; a touch-induced focus must not leave it stuck after release.
  orbit.addEventListener('focus',()=>{focused=orbit.matches(':focus-visible');sync();});
  orbit.addEventListener('blur',()=>{focused=false;sync();});
  function step(direction){angle+=direction*Math.PI*2/3;render();}
  orbit.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1);}
    else if(e.key===' '){e.preventDefault();manualPause=!manualPause;sync();}
  });
  document.querySelector('#strap-prev').addEventListener('click',()=>step(-1));
  document.querySelector('#strap-next').addEventListener('click',()=>step(1));
  pause.addEventListener('click',()=>{manualPause=!manualPause;sync();});
  reduced.addEventListener('change',e=>{manualPause=e.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;last=0;});
  window.addEventListener('pageshow',sync);
  measure();sync();
})();
