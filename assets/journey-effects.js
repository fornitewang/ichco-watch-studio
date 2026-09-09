/* Shared-stage meteor and bounded, deterministic ash. No continuous particle loop or SVG noise. */
(() => {
  'use strict';
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const mix=(a,b,t)=>a+(b-a)*t;
  const seed=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};

  // A drawn side elevation: shallow bevels and restrained shading, not a faceted 3D cylinder.
  function buildCrown(target){
    if(!target)return;
    const flutes=Array.from({length:7},(_,i)=>{const x=511+i*4;return '<path d="M'+x+' 283V317" stroke="#655036" stroke-width="1.2"/><path d="M'+(x+1)+' 284V316" stroke="#dac599" stroke-width=".8"/>';}).join('');
    target.innerHTML='<svg class="surface crown-illustration" viewBox="0 0 600 600" aria-hidden="true"><defs><linearGradient id="drawnCrownGold" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#cfb783"/><stop offset=".2" stop-color="#bfa575"/><stop offset=".68" stop-color="#a88c5c"/><stop offset="1" stop-color="#705738"/></linearGradient></defs><path d="M452 296H510V304H452Z" fill="#99855d" stroke="#514532" stroke-width=".8"/><path d="M454 297H507" stroke="#d2bf92" stroke-width="1"/><path d="M458 297V303M466 297V303M474 297V303M482 297V303M490 297V303" stroke="#67563d" stroke-width="1"/><path d="M509 278H541L547 284V316L541 322H509Q505 322 505 318V282Q505 278 509 278Z" fill="url(#drawnCrownGold)" stroke="#584832" stroke-width="1.2"/><path d="M541 278L547 284V316L541 322Z" fill="#6d5636"/><path d="M509 278H541L544 282H509Q508 282 508 285V315L505 318V282Z" fill="#d8c392" opacity=".65"/>'+flutes+'<path d="M509 321H541M543 284V316" fill="none" stroke="#dbc28e" stroke-width=".7"/><path d="M510 280H539" stroke="#e2cfaa" stroke-width=".8"/></svg>';
  }

  function create(canvas,setCamera){
    const ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx)return null;
    const names=['glass','bezel','hands','dial','gears','crown','case'];
    const pieces=names.map(name=>({name,el:document.querySelector('[data-layer="'+name+'"]')}));
    let scene,particles=[],progress=0;
    const getPath=p=>{
      const h=scene.h;
      if(p<=.64){
        const y=mix(-h*.24,scene.endY,clamp(p/.64));
        const points=scene.points;
        let i=0;while(i<points.length-2&&y>points[i+1].y)i++;
        const a=points[i],b=points[i+1],t=smooth((y-a.y)/Math.max(1,b.y-a.y));
        return{x:mix(a.x,b.x,t),y,camera:0};
      }
      const q=smooth((p-.64)/.18);
      return{x:mix(scene.points.at(-1).x,scene.w/2,q),y:mix(scene.endY,h*1.7,q),camera:q*h};
    };
    function resize(layout){
      scene=layout;
      // Sparks are soft imagery: bound the backing store even on a 4K desktop.
      const dpr=Math.min(devicePixelRatio||1,1.5,1920/scene.w,1440/scene.h);
      canvas.width=Math.round(scene.w*dpr);canvas.height=Math.round(scene.h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      scene.endY=Math.min(scene.h*.92,Math.max(...scene.rows.map(r=>r.bottom))+35);
      scene.points=[{x:scene.rows[0].cx-18,y:-scene.h*.24},...scene.rows.filter(r=>r.name!=='crown').map(r=>({x:r.cx,y:(r.top+r.bottom)/2})),{x:scene.rows.at(-1).cx,y:scene.endY}];
      particles=[];
      const count=scene.w<700?30:48;
      scene.rows.forEach((row,k)=>{
        pieces[k].row=row;
        for(let i=0;i<count;i++){
          const n=k*83+i,ry=seed(n+2),half=(row.right-row.left)/2;
          const x=row.cx+(seed(n+8)*2-1)*half*Math.sqrt(Math.max(.12,1-Math.pow(ry*2-1,2)));
          const y=mix(row.top,row.bottom,ry);
          particles.push({x,y,birth:.64*(y+scene.h*.24)/(scene.endY+scene.h*.24),life:.20+seed(n+7)*.13,
            vx:(seed(n+17)-.5)*(scene.w<700?175:340),vy:-25-seed(n+23)*95,size:1.1+seed(n+11)*3.1,
            spin:seed(n+19)*Math.PI,color:n%5===0?'#ff646e':n%4===0?'#62bbff':n%3===0?'#b6bbc0':'#cfb991'});
        }
      });
      render(progress);
    }
    function glow(x,y,r,alpha){
      if(alpha<=0)return;
      const g=ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,'rgba(255,151,167,'+(alpha*.52)+')');
      g.addColorStop(.15,'rgba(234,49,87,'+(alpha*.36)+')');
      g.addColorStop(.43,'rgba(38,125,254,'+(alpha*.25)+')');
      g.addColorStop(1,'rgba(12,63,146,0)');
      ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
    }
    function drawMeteor(p,head,alpha){
      if(alpha<=0)return;
      const y=head.y-head.camera;
      glow(head.x,y,scene.w<700?78:128,alpha);
      const tail=[];
      for(let j=0;j<=12;j++){const at=getPath(Math.max(0,p-.115+j*.115/12));tail.push({x:at.x,y:at.y-head.camera});}
      const first=tail[0],g=ctx.createLinearGradient(first.x,first.y,head.x,y);
      g.addColorStop(0,'#1b57bf00');g.addColorStop(.40,'#2878ff60');g.addColorStop(.8,'#51c4ffdd');g.addColorStop(1,'#a0eaff');
      ctx.globalAlpha=alpha;ctx.lineCap='round';
      const stroke=(width,color)=>{ctx.beginPath();tail.forEach((pt,i)=>i?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y));ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke();};
      stroke(scene.w<700?13:20,g);stroke(scene.w<700?5:8,g);
      const core=ctx.createLinearGradient(first.x,first.y,head.x,y);
      core.addColorStop(0,'#e42c5500');core.addColorStop(.4,'#f3386b30');core.addColorStop(.8,'#ff416ada');core.addColorStop(1,'#ffdad7');
      stroke(scene.w<700?2:3.5,core);
      ctx.fillStyle='#ffe3da';ctx.beginPath();ctx.ellipse(head.x,y,2.4,7,0,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
    }
    function render(p){
      progress=p;if(!scene)return;
      ctx.clearRect(0,0,scene.w,scene.h);
      const head=getPath(Math.min(p,.82));
      setCamera(head.camera);
      canvas.style.opacity=p>0&&p<1?'1':'0';
      pieces.forEach(({el,row})=>{
        const q=clamp((head.y-row.top)/(row.bottom-row.top));
        if(p<=0||q<=0){el.style.removeProperty('clip-path');el.style.removeProperty('visibility');}
        else if(q>=1){el.style.visibility='hidden';el.style.removeProperty('clip-path');}
        else{
          el.style.visibility='visible';
          const cut=mix(row.clipTop,row.clipBottom,q);
          const jitter=Math.min(1.6,(row.clipBottom-row.clipTop)*.12);
          el.style.clipPath='polygon(0% '+cut+'%,12% '+(cut-jitter)+'%,27% '+(cut+jitter)+'%,41% '+(cut-jitter*.7)+'%,56% '+(cut+jitter*.8)+'%,72% '+(cut-jitter)+'%,87% '+(cut+jitter*.5)+'%,100% '+cut+'%,100% 100%,0% 100%)';
        }
      });
      if(p<=0||p>=1)return;
      particles.forEach(a=>{
        const age=(p-a.birth)/a.life;if(age<=0||age>=1)return;
        const x=a.x+a.vx*age,y=a.y+a.vy*age+70*age*age-head.camera;
        if(y<-10||y>scene.h+10)return;
        ctx.globalAlpha=Math.pow(1-age,1.3)*.85;ctx.fillStyle=a.color;
        ctx.save();ctx.translate(x,y);ctx.rotate(a.spin+age*3);
        ctx.beginPath();ctx.moveTo(-a.size,0);ctx.lineTo(a.size*.4,-a.size);ctx.lineTo(a.size,1);ctx.lineTo(0,a.size*.8);ctx.fill();ctx.restore();
      });
      ctx.globalAlpha=1;
      drawMeteor(Math.min(p,.82),head,smooth(p/.035)*(1-smooth((p-.815)/.045)));
      const impact=clamp((p-.82)/.18);
      if(impact>0){
        const x=scene.w/2,y=scene.h*.7,strength=Math.pow(1-impact,.85);
        glow(x,y,(scene.w<700?130:240)*(1+impact),strength);
        ctx.save();ctx.translate(x,y);ctx.scale(1,.28);
        ctx.strokeStyle='rgba(78,171,255,'+(strength*.65)+')';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(0,0,10+impact*Math.min(340,scene.w*.7),0,Math.PI*2);ctx.stroke();
        ctx.restore();
        const count=scene.w<700?46:78;
        for(let i=0;i<count;i++){
          const a=seed(i+613)*Math.PI*2,speed=40+seed(i+223)*Math.min(350,scene.w*.62);
          const dx=Math.cos(a)*speed*impact,dy=Math.sin(a)*speed*impact*.7-55*Math.sin(impact*Math.PI)+75*impact*impact;
          const size=(1+seed(i+37)*3)*(1-impact*.65);
          ctx.globalAlpha=strength;ctx.fillStyle=i%3===0?'#ff657f':i%3===1?'#6bcaff':'#d2c8b5';
          ctx.save();ctx.translate(x+dx,y+dy);ctx.rotate(a+impact*4);
          ctx.beginPath();ctx.moveTo(-size,-size);ctx.lineTo(size*1.8,0);ctx.lineTo(-size*.4,size);ctx.fill();ctx.restore();
        }
        ctx.globalAlpha=1;
      }
    }
    function destroy(){
      pieces.forEach(({el})=>{el.style.removeProperty('clip-path');el.style.removeProperty('visibility');});
      canvas.style.removeProperty('opacity');ctx.clearRect(0,0,canvas.width,canvas.height);setCamera(0);
    }
    return{resize,render,destroy};
  }
  window.ICHJourneyEffects={buildCrown,create};
})();
