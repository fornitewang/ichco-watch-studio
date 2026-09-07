/* A second actor shares the traveler's public position events; it never captures page gestures. */
(() => {
  'use strict';
  const actor=document.getElementById('huskyActor'), art=document.getElementById('huskyArt'), pet=document.getElementById('huskyPet');
  if(!actor)return;
  let guide=null,ready=false,x=0,y=0,facing=1,frame=0,last=0,initialized=false;
  let gesture='',gestureUntil=0,backUntil=0,idleAt=0,idleWake=0,cycle=0,idleCycle=0,previous='';
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const setState=s=>{if(actor.dataset.state!==s)actor.dataset.state=s;};
  const paint=()=>{actor.style.transform='translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,0)';art.style.setProperty('--husky-facing',facing);};
  function stop(){cancelAnimationFrame(frame);frame=0;last=0;clearTimeout(idleWake);}
  function schedule(){if(!frame&&ready&&guide&&!guide.hidden&&!document.hidden)frame=requestAnimationFrame(tick);}
  function tick(time){
    frame=0;
    if(!ready||!guide)return;
    if(guide.hidden||document.hidden){stop();return;}
    const w=actor.offsetWidth,h=actor.offsetHeight,dt=Math.min(.032,(time-(last||time))/1000);last=time;
    const minX=guide.minX,maxX=Math.max(minX,guide.maxX-w);
    const ceiling=guide.minY,maxY=Math.max(ceiling,guide.bottom-h);
    const left=guide.x-w-12,right=guide.x+guide.width+12;
    let targetX=guide.facing>0?left:right;
    if(targetX<minX)targetX=right;
    if(targetX>maxX)targetX=left;
    targetX=clamp(targetX,minX,maxX);
    const held=guide.state==='held'||guide.state==='dragging';
    let targetY=clamp(guide.y+guide.height*.935-h*.935,ceiling,maxY);
    if(!initialized){x=targetX;y=targetY;initialized=true;idleAt=time+4500;}
    x=clamp(x,minX,maxX);y=clamp(y,ceiling,maxY);
    if(guide.paused){setState('paused');paint();return;}
    // Held characters can rise; the dog remains on its current walking lane and looks up.
    if(held||guide.state==='thrown')targetY=y;
    let state='waiting',moving=false;
    if(time<gestureUntil){
      state=gesture;
      facing=guide.x+guide.width*.6>x+w*.5?1:-1;
    }else if(time<backUntil){
      state='startled';x=clamp(x-facing*45*dt,minX,maxX);moving=true;
    }else{
      const dx=targetX-x,dy=targetY-y,distance=Math.hypot(dx,dy);
      if(distance>4){
        const speed=held||guide.state==='landing'?125:65;
        const step=Math.min(distance,speed*dt);
        x+=dx/distance*step;y+=dy/distance*step;
        if(Math.abs(dx)>3)facing=dx<0?-1:1;
        state=held?'chasing':'walking';moving=true;idleAt=time+4200;
      }else if(held){state='alert';facing=guide.x+guide.width*.65>x+w*.5?1:-1;}
      else if(guide.state==='thrown'){state='alert';}
      else if(guide.state==='greeting'){state='wagging';}
      else if(guide.state==='walking'){state='walking';facing=guide.facing;}
      else if(time>=idleAt){
        gesture=['sniffing','sitting','wagging'][idleCycle++%3];gestureUntil=time+1800;idleAt=time+6500;state=gesture;
      }
    }
    setState(state);paint();
    if(moving||time<gestureUntil||time<backUntil||held||guide.state==='walking'||guide.state==='thrown')schedule();
    else{
      clearTimeout(idleWake);
      idleWake=setTimeout(()=>{last=0;schedule();},Math.max(100,idleAt-time));
    }
  }
  addEventListener('ich:traveler',event=>{
    guide=event.detail;
    if(guide.state==='thrown'&&previous!=='thrown'){backUntil=performance.now()+430;gestureUntil=0;}
    previous=guide.state;
    actor.hidden=!ready||guide.hidden;
    if(guide.hidden||guide.paused){stop();setState('paused');if(ready&&!guide.hidden)schedule();return;}
    schedule();
  });
  pet.addEventListener('click',()=>{
    if(!guide||guide.hidden)return;
    if(guide.paused||guide.reduced){
      // A static happy pose acknowledges the click without violating a pause/motion preference.
      setState('happy');return;
    }
    gesture=['wagging','sitting','hopping'][cycle++%3];gestureUntil=performance.now()+1500;
    idleAt=gestureUntil+4200;setState(gesture);last=0;schedule();
    dispatchEvent(new CustomEvent('ich:companion-pet'));
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();setState('paused');}else schedule();});
  addEventListener('resize',()=>{last=0;schedule();});
  fetch('assets/husky-cel.svg?v=20260907b').then(r=>{if(!r.ok)throw Error('Husky artwork unavailable');return r.text();}).then(source=>{
    const svg=new DOMParser().parseFromString(source,'image/svg+xml').documentElement;
    if(svg.localName!=='svg')throw Error('Invalid husky artwork');
    art.append(document.importNode(svg,true));ready=true;
    dispatchEvent(new CustomEvent('ich:companion-ready'));
    if(guide){actor.hidden=guide.hidden;schedule();}
  }).catch(()=>{actor.hidden=true;});
})();
