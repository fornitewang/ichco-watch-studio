/* Flip -> horizontal lightning -> current on each card -> top-down powder. Disposable GSAP scene. */
(() => {
  'use strict';
  window.ICHPathChoice={create({section,cards,onStart,onReveal,onReset}){
    const deck=section.querySelector('.path-deck'),theatre=document.createElement('div');
    theatre.className='path-theatre';deck.before(theatre);theatre.append(deck);
    const actions=document.createElement('div');actions.className='path-choice-actions';actions.hidden=true;
    const status=document.createElement('p');status.className='path-choice-status';status.setAttribute('role','status');
    const resetButton=document.createElement('button');resetButton.type='button';resetButton.textContent='重新選牌';
    const skipButton=document.createElement('button');skipButton.type='button';skipButton.textContent='直接看推薦';
    actions.append(status,skipButton,resetButton);theatre.after(actions);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let selected=null,timeline=null,stage=null,savedScroll=0,lastWidth=innerWidth;
    section.dataset.choiceState='idle';
    function clean(){timeline?.kill();timeline=null;stage?.remove();stage=null;theatre.style.height='';}
    function refresh(){window.ScrollTrigger?.refresh();}
    function finish(){
      if(section.dataset.choiceState!=='busy')return;
      const hadActionFocus=actions.contains(document.activeElement);
      clean();section.dataset.choiceState='settled';
      cards.forEach(card=>{card.hidden=card!==selected;card.disabled=card!==selected;});
      deck.scrollLeft=0;deck.removeAttribute('aria-busy');skipButton.hidden=true;
      status.textContent='你的選錶方向已揭曉';onReveal(selected);refresh();
      if(hadActionFocus)section.querySelector('#path-result-title').focus({preventScroll:true});
    }
    function reset(){
      if(!selected)return;const previous=selected;clean();selected=null;section.dataset.choiceState='idle';
      cards.forEach(card=>{card.hidden=false;card.disabled=false;card.setAttribute('aria-pressed','false');});
      deck.removeAttribute('aria-busy');deck.scrollLeft=savedScroll;actions.hidden=true;status.textContent='';
      onReset();refresh();previous.focus({preventScroll:true});
    }
    resetButton.addEventListener('click',reset);skipButton.addEventListener('click',finish);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
    reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
    addEventListener('resize',()=>{if(Math.abs(innerWidth-lastWidth)>2){lastWidth=innerWidth;finish();}});
    function choose(card){
      if(section.dataset.choiceState!=='idle'||!cards.includes(card))return;
      // Read all geometry together, before hiding/rearranging the real buttons.
      const bounds=theatre.getBoundingClientRect(),w=bounds.width,h=bounds.height;
      const measures=cards.map(c=>{const r=c.getBoundingClientRect();return{x:r.left-bounds.left,y:r.top-bounds.top,w:c.offsetWidth,h:c.offsetHeight};});
      const index=cards.indexOf(card),hero=measures[index];selected=card;savedScroll=deck.scrollLeft;
      theatre.style.setProperty('--choice-card-w',hero.w+'px');theatre.style.setProperty('--choice-card-h',hero.h+'px');theatre.style.setProperty('--choice-stage-h',(h-48)+'px');
      const hadCardFocus=cards.includes(document.activeElement);
      onStart(card);section.dataset.choiceState='busy';deck.setAttribute('aria-busy','true');
      cards.forEach(c=>{c.setAttribute('aria-pressed',String(c===card));c.disabled=true;});
      actions.hidden=false;skipButton.hidden=false;status.textContent='讓你的方向，留下來。';
      if(hadCardFocus)skipButton.focus({preventScroll:true});
      if(reduced.matches||!window.gsap||w<180){finish();return;}
      theatre.style.height=h+'px';stage=document.createElement('div');stage.className='choice-stage';stage.setAttribute('aria-hidden','true');theatre.append(stage);
      const canvas=document.createElement('canvas');canvas.className='choice-discharge';
      const ratio=Math.min(devicePixelRatio||1,1.5,1280/w,640/h);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);stage.append(canvas);
      const ctx=canvas.getContext('2d');if(!ctx){finish();return;}ctx.setTransform(ratio,0,0,ratio,0,0);
      const mobile=w<700,heroWidth=Math.min(hero.w,w*.40),smallWidth=Math.min(hero.w*.82,w*.13);
      const inner=mobile?w*.285:heroWidth/2+Math.min(22,w*.02)+smallWidth/2;
      const outer=mobile?w*.435:inner+smallWidth+Math.min(22,w*.02);
      const offsets=[-outer,-inner,inner,outer],victims=[],clones=[];
      const particles=[],strikeAt=.56,strikeTravel=.16,chargeTime=.43,powderTime=.50;
      const reach=outer+smallWidth*.45-heroWidth/2;
      const seed=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
      cards.forEach((original,i)=>{
        const m=measures[i],clone=document.createElement('div');clone.className='choice-copy'+(i===index?' is-chosen':'');
        clone.innerHTML=original.innerHTML;clone.style.width=m.w+'px';clone.style.height=m.h+'px';clone.style.zIndex=i===index?'8':'2';stage.append(clone);clones.push(clone);
        const offset=i===index?0:offsets[victims.length],scale=(i===index?heroWidth:smallWidth)/m.w;
        const target={x:w/2+offset-m.w/2,y:h/2-m.h/2,scale};
        gsap.set(clone,{x:m.x,y:m.y,scale:1,opacity:1});
        gsap.set(clone.querySelector('.path-turn'),{rotationY:0});
        if(i!==index){
          const hit=strikeAt+strikeTravel*(Math.abs(offset)-heroWidth/2)/reach;
          const rect={x:w/2+offset-smallWidth/2,y:h/2-m.h*scale/2,w:smallWidth,h:m.h*scale};
          clone.dataset.struckAt=hit;clone.dataset.powderAt=hit+chargeTime;
          victims.push({clone,target,hit,rect,powderAt:hit+chargeTime,direction:Math.sign(offset)});
        }
      });
      victims.forEach((v,i)=>{
        const cols=mobile?8:12,rows=mobile?15:18,cw=v.rect.w/cols,ch=v.rect.h/rows;
        for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
          const s=i*300+row*cols+col+1,r=seed(s),px=(col+.15+seed(s+4)*.7)*cw,py=(row+.15+seed(s+9)*.7)*ch;
          const radius=Math.min(v.rect.w*.34,v.rect.h*.18),margin=py<radius?radius-Math.sqrt(radius*radius-(radius-py)**2):0;
          if(px<margin||px>v.rect.w-margin)continue;
          particles.push({born:v.powderAt+py/v.rect.h*powderTime,x:v.rect.x+px,y:v.rect.y+py,size:(mobile?.55:.7)+r*(mobile?1.1:1.6),vx:v.direction*(18+seed(s+7)*80),vy:-26+seed(s+19)*38,life:.30+seed(s+81)*.18,color:r>.72?'#c5eaff':r>.3?'#c6ae80':'#738386'});
        }
      });
      canvas.dataset.grains=String(particles.length);
      const clamp=n=>Math.max(0,Math.min(1,n));
      // Precompute bolt geometry. Motion only bends these small paths; no layout reads or filters.
      function bolt(x1,y1,x2,y2,steps,key,amplitude){return Array.from({length:steps+1},(_,n)=>{const p=n/steps;return{x:x1+(x2-x1)*p,y:y1+(y2-y1)*p+(n===0||n===steps?0:(seed(key+n)-.5)*amplitude),bend:n===0||n===steps?0:seed(key+n+51)*amplitude*.16};});}
      const bolts=[-1,1].map(side=>{
        const points=bolt(w/2+side*heroWidth/2,h/2,w/2+side*(outer+smallWidth*.45),h/2,18,side+5,mobile?12:23);
        return{points,branches:[5,10,14].map((n,i)=>bolt(points[n].x,points[n].y,points[n].x+side*(mobile?14:32),points[n].y+(i%2?1:-1)*(mobile?15:29),5,n+20,9))};
      });
      const traceA=[[.03,.52],[.22,.48],[.31,.39],[.24,.33],[.43,.25],[.39,.14],[.55,.06]];
      const traceB=[[.22,.48],[.39,.53],[.51,.47],[.64,.55],[.57,.65],[.73,.76],[.65,.92]];
      const traceC=[[.51,.47],[.68,.40],[.74,.28],[.65,.22],[.83,.12]];
      const traceD=[[.39,.53],[.24,.63],[.31,.72],[.21,.84]],traceE=[[.64,.55],[.82,.58],[.89,.70]];
      victims.forEach(v=>{v.traces=[traceA,traceB,traceC,traceD,traceE].map(trace=>trace.map(([x,y],i)=>({x:v.rect.x+(v.direction<0?1-x:x)*v.rect.w,y:v.rect.y+y*v.rect.h,bend:i%2?1.2:0})));});
      function stroke(points,alpha,time,progress=1,weight=1){
        if(alpha<=0||progress<=0)return;const span=(points.length-1)*clamp(progress),end=Math.floor(span);
        ctx.lineJoin='round';ctx.lineCap='round';
        for(const [width,color,opacity]of [[6,'#7e72f5',.14],[2.1,'#8ccfff',.8],[.75,'#f0f8ff',1]]){
          ctx.globalAlpha=alpha*opacity;ctx.strokeStyle=color;ctx.lineWidth=width*weight;ctx.beginPath();
          points.forEach((p,i)=>{if(i>end)return;const y=p.y+Math.sin(time*21+i*2.3)*p.bend;if(i===0)ctx.moveTo(p.x,y);else ctx.lineTo(p.x,y);});
          if(end<points.length-1){const a=points[end],b=points[end+1],f=span-end;ctx.lineTo(a.x+(b.x-a.x)*f,a.y+(b.y-a.y)*f);}
          ctx.stroke();
        }
      }
      function cardClip(r){
        const s=Math.min(r.w*.34,r.h*.18);ctx.beginPath();ctx.moveTo(r.x+s,r.y);ctx.lineTo(r.x+r.w-s,r.y);ctx.quadraticCurveTo(r.x+r.w,r.y,r.x+r.w,r.y+s);ctx.lineTo(r.x+r.w,r.y+r.h);ctx.lineTo(r.x,r.y+r.h);ctx.lineTo(r.x,r.y+s);ctx.quadraticCurveTo(r.x,r.y,r.x+s,r.y);ctx.closePath();ctx.clip();
      }
      function draw(time){
        ctx.clearRect(0,0,w,h);let visible=0,charged=0;
        const electricAge=time-strikeAt,boltAlpha=clamp(electricAge/.035)*clamp((.99-time)/.20);
        bolts.forEach(b=>{stroke(b.points,boltAlpha,time,electricAge/strikeTravel,mobile?.8:1);b.branches.forEach(points=>stroke(points,boltAlpha*.6,time,(electricAge-.05)/strikeTravel,.62));});
        victims.forEach(v=>{
          const age=time-v.hit,dissolve=clamp((time-v.powderAt)/powderTime),r=v.rect,edgeY=r.y+r.h*dissolve;
          if(age<0||dissolve>=1)return;charged++;
          ctx.save();cardClip(r);ctx.beginPath();ctx.rect(r.x,edgeY,r.w,r.h*(1-dissolve));ctx.clip();
          const alpha=clamp(age/.08)*(.82+.10*Math.sin(age*12))*(1-dissolve*.8);
          ctx.globalAlpha=alpha*.10;ctx.fillStyle='#9aafff';ctx.fillRect(r.x,r.y,r.w,r.h);
          v.traces.forEach((points,i)=>{
            stroke(points,alpha*(i>1?.65:1),time,clamp((age-i*.025)/.18),mobile?.65:.85);
            // A bright travelling charge follows each branch without flashing the whole card.
            const step=((age*1.8+i*.28)%1)*(points.length-1),n=Math.floor(step),f=step-n,a=points[n],b=points[Math.min(n+1,points.length-1)];
            ctx.globalAlpha=alpha;ctx.fillStyle='#e7f5ff';ctx.beginPath();ctx.arc(a.x+(b.x-a.x)*f,a.y+(b.y-a.y)*f,mobile?1.1:1.8,0,Math.PI*2);ctx.fill();
          });
          if(dissolve>0){
            const lip=Array.from({length:13},(_,n)=>({x:r.x+r.w*n/12,y:edgeY+Math.sin(n*3+time*17)*1.4,bend:0}));
            stroke(lip,(1-dissolve)*.8,time,1,mobile?.65:.8);
          }
          ctx.restore();
        });
        particles.forEach(p=>{
          const age=time-p.born;if(age<0||age>p.life)return;visible++;
          const f=age/p.life,size=p.size*(1-f*.5);
          ctx.globalAlpha=(1-f)*.9;ctx.fillStyle=p.color;ctx.fillRect(p.x+p.vx*age,p.y+p.vy*age+65*age*age,size,size);
        });
        ctx.globalAlpha=1;canvas.dataset.visibleGrains=String(visible);canvas.dataset.chargedCards=String(charged);
      }
      timeline=gsap.timeline({id:'path-choice',paused:true,onUpdate(){draw(this.time());},onComplete:finish});
      const chosen=clones[index],center=w/2-hero.w/2;
      timeline.addLabel('flip',0).addLabel('lightning',strikeAt).addLabel('current',.75).addLabel('powder',1.04).addLabel('clear',1.64).addLabel('reveal',2.45);
      timeline.to(chosen,{x:center,y:h/2-hero.h/2,scale:heroWidth/hero.w,duration:.45,ease:'power2.out'},0)
        .to(chosen.querySelector('.path-turn'),{rotationY:180,duration:.5,ease:'power2.inOut'},0);
      victims.forEach(v=>{
        timeline.to(v.clone,{...v.target,duration:.45,ease:'power2.out'},0)
          .fromTo(v.clone,{clipPath:'inset(0% 0% 0% 0%)'},{clipPath:'inset(100% 0% 0% 0%)',duration:powderTime,ease:'none'},v.powderAt)
          .set(v.clone,{opacity:0},v.powderAt+powderTime);
      });
      timeline.to(chosen,{y:h/2-hero.h/2-4,duration:.35,ease:'sine.out'},strikeAt)
        .to(chosen,{y:h/2-hero.h/2,scale:1,duration:.43,ease:'power2.out'},1.72)
        .to({hold:0},{hold:1,duration:.30},2.15);
      timeline.play(0);
    }
    return{choose,reset,finish};
  }};
})();
