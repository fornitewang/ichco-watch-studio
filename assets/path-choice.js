/* Flip -> sweep -> four cube bursts -> one direction. A bounded, disposable GSAP scene. */
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
      const canvas=document.createElement('canvas');canvas.className='choice-fragments';
      const ratio=Math.min(devicePixelRatio||1,1.5,1280/w,640/h);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);stage.append(canvas);
      const ctx=canvas.getContext('2d');if(!ctx){finish();return;}ctx.setTransform(ratio,0,0,ratio,0,0);
      const mobile=w<700,heroWidth=Math.min(hero.w,w*.40),smallWidth=Math.min(hero.w*.82,w*.13);
      const inner=mobile?w*.285:heroWidth/2+Math.min(22,w*.02)+smallWidth/2;
      const outer=mobile?w*.435:inner+smallWidth+Math.min(22,w*.02);
      const offsets=[-outer,-inner,inner,outer],victims=[],clones=[];
      const first=index<2?1:-1,amplitude=w/2-heroWidth/2-5,particles=[];
      const seed=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
      cards.forEach((original,i)=>{
        const m=measures[i],clone=document.createElement('div');clone.className='choice-copy'+(i===index?' is-chosen':'');
        clone.innerHTML=original.innerHTML;clone.style.width=m.w+'px';clone.style.height=m.h+'px';clone.style.zIndex=i===index?'8':'2';stage.append(clone);clones.push(clone);
        const offset=i===index?0:offsets[victims.length],scale=(i===index?heroWidth:smallWidth)/m.w;
        const target={x:w/2+offset-m.w/2,y:h/2-m.h/2,scale};
        gsap.set(clone,{x:m.x,y:m.y,scale:1,opacity:1});
        gsap.set(clone.querySelector('.path-turn'),{rotationY:0});
        if(i!==index){
          const hit=Math.sign(offset)===first ? .62+.40*Math.max(0,(Math.abs(offset)-heroWidth/2)/amplitude) : 1.04+.64*(amplitude+Math.abs(offset)-heroWidth/2)/(2*amplitude);
          const rect={x:w/2+offset-smallWidth/2,y:h/2-m.h*scale/2,w:smallWidth,h:m.h*scale};
          victims.push({clone,target,hit,rect,direction:Math.sign(offset)});
        }
      });
      victims.forEach((v,i)=>{
        const cols=mobile?4:6,rows=mobile?7:10,cw=v.rect.w/cols,ch=v.rect.h/rows;
        for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
          const s=i*100+row*cols+col+1,r=seed(s),edge=col===0||col===cols-1||row===0||row===rows-1;
          particles.push({hit:v.hit,x:v.rect.x+(col+.5)*cw,y:v.rect.y+(row+.5)*ch,size:Math.min(cw,ch)*(.62+r*.35),vx:v.direction*(55+seed(s+7)*145),vy:-70+seed(s+19)*95,spin:(seed(s+41)-.5)*9,life:.48+seed(s+81)*.22,bright:edge||r>.76});
        }
      });
      canvas.dataset.pieces=String(particles.length);
      function draw(time){
        ctx.clearRect(0,0,w,h);let visible=0;
        particles.forEach(p=>{
          const age=time-p.hit;if(age<0||age>p.life)return;visible++;
          const f=age/p.life,size=p.size*(1-f*.5),depth=size*.24;
          ctx.save();ctx.globalAlpha=Math.min(1,(1-f)*2);ctx.translate(p.x+p.vx*age,p.y+p.vy*age+190*age*age);ctx.rotate(p.spin*age);
          ctx.fillStyle=p.bright?'#bc9b66':'#394342';ctx.fillRect(-size/2,-size/2,size,size);
          ctx.fillStyle=p.bright?'#f1d5a0':'#849083';ctx.beginPath();ctx.moveTo(-size/2,-size/2);ctx.lineTo(-size/2+depth,-size/2-depth);ctx.lineTo(size/2+depth,-size/2-depth);ctx.lineTo(size/2,-size/2);ctx.closePath();ctx.fill();
          ctx.fillStyle=p.bright?'#755c3b':'#182423';ctx.beginPath();ctx.moveTo(size/2,-size/2);ctx.lineTo(size/2+depth,-size/2-depth);ctx.lineTo(size/2+depth,size/2-depth);ctx.lineTo(size/2,size/2);ctx.closePath();ctx.fill();ctx.restore();
        });
        canvas.dataset.visiblePieces=String(visible);
      }
      timeline=gsap.timeline({id:'path-choice',paused:true,onUpdate(){draw(this.time());},onComplete:finish});
      const chosen=clones[index],center=w/2-hero.w/2;
      timeline.to(chosen,{x:center,y:h/2-hero.h/2,scale:heroWidth/hero.w,duration:.45,ease:'power2.out'},0)
        .to(chosen.querySelector('.path-turn'),{rotationY:180,duration:.5,ease:'power2.inOut'},0);
      victims.forEach(v=>{timeline.to(v.clone,{...v.target,duration:.45,ease:'power2.out'},0).to(v.clone,{opacity:0,duration:.055,ease:'none'},v.hit);});
      timeline.to(chosen,{x:center+first*amplitude,rotation:first*10,duration:.40,ease:'none'},.62)
        .to(chosen,{x:center-first*amplitude,rotation:-first*12,duration:.64,ease:'none'},1.04)
        .to(chosen,{x:center,rotation:0,scale:1,duration:.50,ease:'power2.out'},1.68)
        .to({hold:0},{hold:1,duration:.4},2.18);
      timeline.play(0);
    }
    return{choose,reset,finish};
  }};
})();
