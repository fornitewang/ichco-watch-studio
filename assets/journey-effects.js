/* Shared-stage meteor and bounded, deterministic ash. No continuous particle loop or SVG noise. */
(() => {
  'use strict';
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const mix=(a,b,t)=>a+(b-a)*t;
  const seed=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};

  function buildCrown(target){
    if(!target)return;
    const cylinder=(name,x,length,radius,count)=>{
      const chord=2*radius*Math.tan(Math.PI/count)+.35;
      const sides=Array.from({length:count},(_,i)=>{
        const a=i*360/count,light=Math.round(28+43*Math.max(0,Math.cos((a-38)*Math.PI/180)));
        return '<i class="crown-facet" style="--face-angle:'+a+'deg;--facet-height:'+chord/600+';--metal-light:'+light+'%"></i>';
      }).join('');
      const cap='<span class="crown-cap"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="#f2d7a2" stroke-width="2"/><circle cx="50" cy="50" r="34" fill="none" stroke="#5e482b" stroke-width="3"/><path d="M50 25L62 50L50 75L38 50Z" fill="none" stroke="#d6bf8a" stroke-width="3"/></svg></span>';
      return '<div class="crown-cylinder '+name+'" style="--crown-x:'+x/600+';--crown-length:'+length/600+';--crown-radius:'+radius/600+'">'+sides+cap+'</div>';
    };
    target.innerHTML='<div class="crown-assembly">'+cylinder('crown-stem',182,62,5,12)+cylinder('crown-head',228,47,23,28)+'</div>';
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
      const dpr=Math.min(devicePixelRatio||1,1.5);
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
