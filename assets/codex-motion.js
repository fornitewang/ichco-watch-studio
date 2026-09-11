/* Shared scroll choreography for / and /codex/. Concept mechanics only; no product data. */
(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  const unitSVG=content=>'<svg class="surface" viewBox="0 0 600 600" aria-hidden="true">'+content+'</svg>';
  const spiral=(cx,cy,r,turns)=>Array.from({length:200},(_,i)=>{
    const t=i/199,angle=t*turns*Math.PI*2,rr=7+t*(r-7);
    return (i?'L':'M')+(cx+Math.cos(angle)*rr).toFixed(2)+' '+(cy+Math.sin(angle)*rr).toFixed(2);
  }).join(' ');
  // These three subassemblies belong to the concept movement from the first assembled frame.
  const rotor=unitSVG('<path d="M117 300A183 183 0 0 0 483 300L441 300A141 141 0 0 1 159 300Z" fill="url(#mechWall)" transform="translate(0 6)"/><path d="M117 300A183 183 0 0 0 483 300L441 300A141 141 0 0 1 159 300Z" fill="url(#mechBridge)" stroke="#e4cc9c" stroke-width="2"/><path d="M156 332L284 287Q300 280 316 287L444 332L439 351L314 316Q300 312 286 316L161 351Z" fill="url(#mechSteel)" stroke="#6f735e"/><path d="M135 317A166 166 0 0 0 465 317" fill="none" stroke="#e1cfa6" stroke-width="1"/><circle cx="300" cy="300" r="23" fill="url(#mechSteel)" stroke="#1b2520" stroke-width="3"/><circle cx="300" cy="300" r="12" fill="url(#mechJewel)" stroke="#e6c18c"/><path d="M294 300H306" stroke="#2e1820" stroke-width="2"/>');
  const barrel=unitSVG('<circle cx="385" cy="225" r="64" fill="url(#mechWall)"/><circle cx="385" cy="217" r="64" fill="url(#mechWheel)" stroke="#e1c995" stroke-width="2"/><circle cx="385" cy="217" r="55" fill="url(#mechCavity)" stroke="#b99b65" stroke-width="3"/><path d="'+spiral(385,217,48,6)+'" fill="none" stroke="#dbceab" stroke-width="2.2"/><circle cx="385" cy="217" r="8" fill="url(#mechSteel)"/><circle cx="385" cy="217" r="62" fill="none" stroke="#4a3823" stroke-width="4" stroke-dasharray="2 5"/>');
  const balance=unitSVG('<circle cx="209" cy="357" r="61" fill="none" stroke="#5d4126" stroke-width="10"/><circle cx="209" cy="350" r="61" fill="none" stroke="url(#mechWheel)" stroke-width="8"/><path d="M209 289V411M148 350H270" stroke="url(#mechSteel)" stroke-width="5"/><path d="'+spiral(209,350,49,5)+'" fill="none" stroke="#b7c9c8" stroke-width="1.3"/><path d="M156 293Q210 272 261 297L253 310Q216 295 211 341L201 341Q196 306 160 309Z" fill="url(#mechBridge)" stroke="#d5bc88"/><circle cx="209" cy="350" r="10" fill="url(#mechJewel)" stroke="#d8bd80" stroke-width="3"/>');
  const additions={rotor,barrel,balance};
  const core=$('[data-layer="gears"] .rotor');
  // The old illustration embedded its balance in two decks. Remove that assembly before adding
  // the separable one, so an exploded balance never leaves a second balance behind on the plate.
  function removeBalanceTail(depth,selector){
    let node=core.querySelector('.mechanism-deck[data-depth="'+depth+'"] '+selector);
    while(node){const next=node.nextElementSibling;node.remove();node=next;}
  }
  removeBalanceTail('-14','circle[cx="216"][cy="362"][r="46"]');
  removeBalanceTail('-5','circle[cx="216"][cy="355"][r="46"]');
  core.querySelectorAll('.mechanism-deck[data-depth="17"] circle[cx="216"],.mechanism-deck[data-depth="17"] path[d^="M212.2 353.2"]').forEach(node=>node.remove());
  const plate=core.innerHTML;
  // In the full watch these are nested inside the movement, concealed naturally beneath the dial.
  Object.entries(additions).reverse().forEach(([name,html])=>{
    const part=document.createElement('div');part.className='mechanism-core';
    part.style.cssText='position:absolute;inset:0;transform:translateZ(12px);transform-style:preserve-3d';
    part.dataset.mechanism=name;part.innerHTML=html;core.append(part);
  });
  const visual=$('#movement-visual');
  const leaders=document.createElementNS('http://www.w3.org/2000/svg','svg');
  leaders.classList.add('movement-leaders');leaders.setAttribute('aria-hidden','true');
  leaders.innerHTML=['rotor','barrel','balance'].map(name=>'<g class="movement-pointer mp-'+name+'"><path/><circle r="3"/></g>').join('');
  visual.before(leaders);
  window.ICHJourneyEffects?.buildCrown($('[data-layer="crown"] .rotor'));
  visual.innerHTML=['plate','balance','barrel','rotor'].map(name=>'<div class="movement-layer movement-'+name+'" data-mechanism-part="'+name+'"><div class="mechanism-core">'+(name==='plate'?plate:additions[name])+'</div></div>').join('');
  // Cloned SVGs only reference the shared definitions; never duplicate identifiers.
  visual.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  if(!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ignoreMobileResize:true});
  const mm=gsap.matchMedia(),button=$('#toggle');
  const hud={progress:$('#progress'),percent:$('#percent'),phase:$('#phase'),note:$('.dynamic-note')};
  let timeline,player;
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
    document.documentElement.classList.add('motion');document.body.classList.remove('static');button.disabled=false;
    const parts=[
      {name:'glass',range:[-211,211],x:[-211,211],depth:[-4,0],size:1},
      {name:'bezel',range:[-222,222],x:[-222,222],depth:[-8,0],size:1},
      {name:'hands',range:[-182,182],x:[-182,182],depth:[0,2],size:1},
      {name:'dial',range:[-205,205],x:[-205,205],depth:[-8,0],size:1},
      {name:'gears',range:[-213,213],x:[-213,213],depth:[-30,30],size:1},
      {name:'case',range:[-252,252],x:[-232,232],depth:[-30,0],size:1}
    ];
    let layout,effects;
    function project(p,unit,angle){
      const ys=[],xs=[],a=angle*Math.PI/180,k=unit/600;
      p.range.forEach(y=>p.depth.forEach(z=>{
        const yy=(y*Math.cos(a)-z*Math.sin(a))*k,zz=(y*Math.sin(a)+z*Math.cos(a))*k;
        const perspective=1/(1-zz/1400);
        ys.push(yy*perspective);p.x.forEach(x=>xs.push(x*k*perspective));
      }));
      return{min:Math.min(...ys),max:Math.max(...ys),left:Math.min(...xs),right:Math.max(...xs)};
    }
    function measure(){
      const stage=$('.stage').getBoundingClientRect(),unit=$('#watch').offsetWidth,w=stage.width;
      const mobile=w<=700,short=stage.height<581&&w>=600;
      const top=$('.masthead').offsetHeight+(short?10:28);
      const bottom=$('.stage-bottom').getBoundingClientRect().top-stage.top-(short?14:26);
      const angle=short?69:62,gap=short?10:Math.max(15,Math.min(25,stage.height*.025));
      const labelWidth=mobile?Math.max(58,Math.min(78,(w-320)*.2+58)):(short?126:155);
      const edge=mobile?14:Math.max(30,w*.07),spread=mobile?Math.min(80,w*.19):Math.min(240,w*.2);
      const bounds=parts.map(p=>project(p,unit,angle)),height=bounds.reduce((n,b)=>n+b.max-b.min,0);
      const sideRoom=w/2-edge-labelWidth-14-spread/2;
      const half=Math.max(...bounds.map(b=>Math.max(-b.left,b.right)));
      const scale=Math.max(.15,Math.min(1.05,(bottom-top-gap*5)/height,sideRoom/half));
      const used=height*scale+gap*5,center=(top+bottom)/2;
      let cursor=center-used/2;
      const rows=bounds.map((b,i)=>{
        const x=(i/5-.5)*spread,origin=cursor-b.min*scale;
        const row={name:parts[i].name,x,y:origin-center,scale,top:cursor,bottom:cursor+(b.max-b.min)*scale,left:w/2+x+b.left*scale,right:w/2+x+b.right*scale};
        cursor=row.bottom+gap;return row;
      });
      $('.watch-position').style.top=center+'px';
      if(window.ICHJourneyPlayer?.softFocus)window.ICHJourneyPlayer.softFocus.style.top=center+'px';
      document.documentElement.style.setProperty('--label-width',labelWidth+'px');
      const crownScale=scale*1.6,crownY=(rows[4].bottom+rows[5].top)/2;
      const crownCenter=Math.min(w-edge-labelWidth-28,w/2+spread/2+half*scale);
      const crownX=crownCenter-w/2-(218*unit/600*crownScale);
      const cb=project({range:[-23,23],x:[151,248],depth:[0,0]},unit,18);
      const crown={x:crownX,y:crownY-center,scale:crownScale,top:crownY+cb.min*crownScale,bottom:crownY+cb.max*crownScale,left:w/2+crownX+cb.left*crownScale,right:w/2+crownX+cb.right*crownScale};
      const calls=[['glass',rows[0],false],['bezel',rows[1],true],['hands',rows[2],false],['dial',rows[3],true],['gears',rows[4],false],['crown',crown,true],['case',rows[5],false]];
      calls.forEach(([name,row,right])=>{
        const label=$('.a-'+name),end=right?row.right+10:row.left-10;
        label.style.left=(right?w-edge-labelWidth:edge)+'px';label.style.right='auto';
        label.style.setProperty('--leader-width',Math.max(12,right?w-edge-end:end-edge)+'px');
        const leaderOffset=label.querySelector('strong').offsetHeight+(mobile?7:8);
        label.style.top=((row.top+row.bottom)/2-leaderOffset)+'px';
      });
      const ashRows=calls.map(([name,row])=>{
        const b=name==='crown'?cb:bounds[parts.findIndex(p=>p.name===name)];
        return{...row,name,cx:(row.left+row.right)/2,clipTop:50+b.min/unit*100-1,clipBottom:50+b.max/unit*100+1};
      });
      layout={angle,rows,crown,w,unit,h:stage.height,ashRows};
      effects?.resize({w,h:stage.height,unit,rows:ashRows});
    }
    measure();ScrollTrigger.addEventListener('refreshInit',measure);
    const moveScene=gsap.quickSetter('.stage','y','px');
    effects=window.ICHJourneyEffects?.create($('#meteor-canvas'),y=>moveScene(-y));
    effects?.resize({w:layout.w,h:layout.h,unit:layout.unit,rows:layout.ashRows});
    const meteor={progress:0};
    let lastEffectProgress=-1;
    function renderEffectsAt(time,force=false){
      const progress=Math.max(0,Math.min(1,(time-1.30)/1.05));
      if(effects&&(force||progress!==lastEffectProgress)){
        effects.render(progress);lastEffectProgress=progress;
      }
    }
    const refreshEffects=()=>{
      if(!timeline)return;
      // An enabled trigger owns the scroll position; auto-play owns the clock while disabled.
      // A paused scrub tween can otherwise restore its old frame when manual control resumes.
      const trigger=timeline.scrollTrigger;
      if(trigger?.enabled){trigger.getTween()?.pause();timeline.totalProgress(trigger.progress);}
      renderEffectsAt(timeline.time(),true);
    };
    let lastPercent=-1,lastPhase=-1,lastNote=-1,lastExpanded=null;
    timeline=gsap.timeline({
      defaults:{ease:'power2.inOut'},
      scrollTrigger:{id:'watch-anatomy',trigger:'#journey',start:'top top',end:'bottom bottom',scrub:1.15,invalidateOnRefresh:true},
      onUpdate(){
        const p=this.progress(),n=Math.round(p*100),t=this.time();
        // Derive imperative canvas, camera and visibility from the master scene, even on reverse seeks.
        renderEffectsAt(t);
        player?.update(p);
        // Labels change only when their value changes, never on every animation frame.
        if(n!==lastPercent){hud.progress.value=n;hud.percent.textContent=String(n).padStart(3,'0')+' / 100';lastPercent=n;}
        const phase=t<.16?0:t<.42?1:t<.95?2:t<1.3?3:t<2.3?4:5;
        if(phase!==lastPhase){hud.phase.textContent=['I / THE DARK WOOD','I / THE WHOLE','I / THE UNFOLDING','I / THE INNER ORDER','II / THE FALLING STAR','III / THE INNER FIRE'][phase];lastPhase=phase;}
        const note=t<.42?0:t<.95?1:2;
        if(note!==lastNote){hud.note.textContent=['向下滑動，展開細節','循斜向軌跡，逐層展開','繼續向下，循星光而行'][note];lastNote=note;}
        const expanded=t>.7;
        if(expanded!==lastExpanded){button.textContent=expanded?'重看旅程 ↥':'展開零件 ↧';lastExpanded=expanded;}
      }
    });
    // Keep the distant temple cached. Foreground statues, paper wings and mist retain parallax.
    timeline.fromTo('.sanctuary-statue-left',{xPercent:0,yPercent:0},{xPercent:-8,yPercent:4,duration:.8},.40);
    timeline.fromTo('.sanctuary-statue-right',{xPercent:0,yPercent:0},{xPercent:8,yPercent:4,duration:.8},.40);
    timeline.fromTo('.sanctuary-mist',{xPercent:-3,yPercent:5,opacity:.4},{xPercent:4,yPercent:-5,opacity:.75,duration:1.24,ease:'none'},0);
    timeline.fromTo('.sanctuary-cut-left',{xPercent:0},{xPercent:-2,duration:.8},.35);
    timeline.fromTo('.sanctuary-cut-right',{xPercent:0},{xPercent:2,duration:.8},.35);
    timeline.fromTo('.sanctuary-lintel',{yPercent:0},{yPercent:-3,duration:.9},.2);
    timeline.fromTo('.temple-caption',{opacity:1},{opacity:0,duration:.25},.35);
    timeline.fromTo('.introduction',{autoAlpha:1,y:0},{autoAlpha:0,y:-18,duration:.14},0);
    timeline.fromTo('.reading-veil',{opacity:1},{opacity:0,duration:.12},.16);
    if(window.ICHJourneyPlayer?.softFocus){
      // Crossfade the already-rendered soft assembly instead of re-blurring dozens of SVG decks.
      gsap.set('.watch-position',{filter:'none'});
      timeline.fromTo('.watch-position',{opacity:0},{opacity:1,duration:.12},.16);
      timeline.fromTo('.watch-soft-focus',{autoAlpha:1},{autoAlpha:0,duration:.12},.16);
      timeline.set('.cosmos',{filter:'none'},.281);
    }else{
      timeline.fromTo('.watch-position,.cosmos',{filter:'blur(14px)'},{filter:'blur(0px)',duration:.12},.16);
      timeline.set('.watch-position,.cosmos',{filter:'none'},.281);
    }
    // .281–.42 is a clear, fully assembled hold. All pieces share the same lift before separating.
    timeline.fromTo('.cosmos,.frame',{opacity:1},{opacity:0,duration:.30},.42);
    parts.forEach((part,i)=>{
      const selector='[data-layer="'+part.name+'"]';
      timeline.fromTo(selector,{x:0,y:0,scale:1.18},{x:()=>layout.rows[i].x,y:()=>layout.rows[i].y,scale:()=>layout.rows[i].scale,duration:.53},.42);
      timeline.fromTo(selector+' .part',{rotationX:0},{rotationX:()=>layout.angle,duration:.53},.42);
    });
    timeline.fromTo('[data-layer="crown"]',{x:0,y:0,scale:1.18},{x:()=>layout.crown.x,y:()=>layout.crown.y,scale:()=>layout.crown.scale,duration:.53},.42);
    timeline.fromTo('[data-layer="crown"] .part',{rotationX:0},{rotationX:18,duration:.53},.42);
    timeline.fromTo('[data-layer="hands"] .rotor',{rotation:0},{rotation:32,duration:.29},.65);
    timeline.fromTo('[data-layer="gears"] .rotor',{rotation:0},{rotation:-30,duration:.30},.65);
    timeline.fromTo('.astrolabe',{rotation:0,svgOrigin:'400 400'},{rotation:30,duration:1.2,ease:'none'},0);
    timeline.fromTo('.constellations',{rotation:0,svgOrigin:'400 400'},{rotation:-20,duration:1.2,ease:'none'},0);
    timeline.fromTo('.golden-grid',{rotation:0,svgOrigin:'400 400'},{rotation:-8,duration:1.2,ease:'none'},0);
    timeline.fromTo('.annotation',{opacity:0},{opacity:1,duration:.10,stagger:.012},.98);
    timeline.fromTo('.leader',{scaleX:0},{scaleX:1,duration:.10,stagger:.012,ease:'power1.out'},.99);
    timeline.to({hold:0},{hold:1,duration:.08},1.16);
    timeline.addLabel('watch-open',1.14);
    timeline.addLabel('meteor-entry',1.30);
    timeline.fromTo('.annotations,.stage-bottom',{autoAlpha:1},{autoAlpha:0,duration:.12},1.29);
    timeline.to('.sanctuary,.marble,.grain',{opacity:0,duration:.22},1.75);
    timeline.to(meteor,{progress:1,duration:1.05,ease:'none'},1.30);
    if(!effects)timeline.to('.stage',{autoAlpha:0,duration:.45},1.9);
    timeline.fromTo('#movement-study',{autoAlpha:0},{autoAlpha:1,duration:.30},2.32);
    timeline.fromTo('#movement-visual',{xPercent:-50,yPercent:-50,x:0,y:28,scale:.93},{y:0,scale:1,duration:.30},2.32);
    timeline.addLabel('meteor-impact',2.161);
    timeline.addLabel('movement-reveal',2.32);
    timeline.addLabel('movement-whole',2.62);
    // A second chapter reveals the movement's nested assemblies at a larger scale.
    const deep=gsap.timeline({id:'movement-chapter',defaults:{ease:'power2.inOut'}});
    let deepLayout;
    function measureDeep(){
      const stage=$('.movement-stage'),w=stage.clientWidth,u=visual.offsetWidth,k=u/600;
      const dx=Math.min(150,u*.36),dy=Math.min(125,u*.34);
      deepLayout={plate:{x:dx*.3,y:dy*.95,scale:.76},rotor:{x:-dx*.2,y:-dy*1.16,scale:.78},barrel:{x:dx*.67,y:-dy*.14,scale:1.25},balance:{x:-dx*.53,y:dy*.1,scale:1.24}};
      ['rotor','barrel','balance'].forEach(name=>{const label=$('.mc-'+name);['top','left','right'].forEach(prop=>label.style.removeProperty(prop));});
      if(w>700){
        // Anchor the reading to each final assembly, independent of the monitor's outer edges.
        leaders.setAttribute('viewBox','0 0 '+w+' '+stage.clientHeight);
        const angle=48*Math.PI/180;
        const anchors=[{name:'rotor',point:[157,351],turn:-30,right:false},{name:'barrel',point:[442,214],turn:0,right:true},{name:'balance',point:[151,353],turn:0,right:false}];
        anchors.forEach(({name,point,turn,right})=>{
          const l=deepLayout[name],rz=turn*Math.PI/180,x=(point[0]-300)*k,y=(point[1]-300)*k;
          const yy=y*Math.cos(angle),z=y*Math.sin(angle),perspective=1/(1-z/1400);
          const ax=w/2+l.x+(x*Math.cos(rz)-yy*Math.sin(rz))*perspective*l.scale;
          const ay=visual.offsetTop+l.y+(x*Math.sin(rz)+yy*Math.cos(rz))*perspective*l.scale;
          const label=$('.mc-'+name),gap=w<1100?32:52,edge=Math.max(24,w*.02);
          const left=Math.max(edge,Math.min(w-edge-label.offsetWidth,right?ax+gap:ax-gap-label.offsetWidth));
          label.style.left=left+'px';label.style.right='auto';
          label.style.top=(ay-label.querySelector('strong').offsetTop)+'px';
          const start=right?left-10:left+label.offsetWidth+10,end=ax+(right?6:-6);
          const group=leaders.querySelector('.mp-'+name);
          group.querySelector('path').setAttribute('d','M'+start.toFixed(2)+' '+ay.toFixed(2)+'H'+end.toFixed(2));
          group.querySelector('circle').setAttribute('cx',ax.toFixed(2));
          group.querySelector('circle').setAttribute('cy',ay.toFixed(2));
        });
        return;
      }
      const heading=$('.chapter-heading'),top=heading.offsetTop+heading.offsetHeight+25;
      const bottom=stage.clientHeight-$('.movement-footnote').offsetHeight-40;
      const rowHeight=(bottom-top)/4;
      const shapes=[
        {name:'rotor',x:w*.65,cx:35,cy:53,scale:Math.min(.90,w*.39/(366*k))},
        {name:'barrel',x:w*.28,cx:85,cy:-56,scale:Math.min(1.25,w*.24/(128*k))},
        {name:'balance',x:w*.68,cx:-91,cy:34,scale:Math.min(1.24,w*.25/(122*k))},
        {name:'plate',x:w*.52,cx:0,cy:4,scale:Math.min(.8,w*.50/(426*k))}
      ];
      shapes.forEach((shape,i)=>{
        const cy=top+rowHeight*(i+.5);
        deepLayout[shape.name]={x:shape.x-w/2-shape.cx*k*shape.scale,y:cy-visual.offsetTop-shape.cy*k*shape.scale,scale:shape.scale};
        const label=$('.mc-'+shape.name);
        if(label)label.style.top=(cy-Math.min(32,label.offsetHeight/2))+'px';
      });
    }
    measureDeep();ScrollTrigger.addEventListener('refreshInit',measureDeep);
    ['plate','rotor','barrel','balance'].forEach(name=>{
      deep.fromTo('.movement-'+name,{x:0,y:0,scale:1},{x:()=>deepLayout[name].x,y:()=>deepLayout[name].y,scale:()=>deepLayout[name].scale,duration:.53},.24);
    });
    deep.fromTo('.movement-layer > .mechanism-core',{rotationX:22},{rotationX:48,duration:.53},.24);
    deep.fromTo('.movement-rotor > .mechanism-core',{rotation:0},{rotation:-30,duration:.30},.50);
    ['rotor','barrel','balance'].forEach((name,i)=>deep.fromTo('.mc-'+name+',.mp-'+name,{opacity:0},{opacity:1,duration:.15},.79+i*.045));
    deep.to({hold:0},{hold:1,duration:.1},1.05);
    timeline.add(deep,2.70);
    timeline.addLabel('movement-unfold',2.94);
    timeline.fromTo('.nav-collection',{autoAlpha:0},{autoAlpha:1,duration:.20},3.65);
    timeline.to({hold:0},{hold:1,duration:.1},3.85);
    // Short product reveals use only transform/opacity. No new scroll pin or heavy filter.
    gsap.from('.shop-card',{y:42,opacity:0,duration:.8,stagger:.12,ease:'power2.out',
      scrollTrigger:{trigger:'.shop-grid',start:'top 92%',once:true},
      onComplete(){gsap.set('.shop-card',{clearProps:'transform,opacity'});}
    });
    gsap.from('.path-card',{y:28,opacity:0,duration:.7,stagger:.09,ease:'power2.out',
      scrollTrigger:{trigger:'#path-cards',start:'top 82%',once:true},
      onComplete(){gsap.set('.path-card',{clearProps:'transform,opacity'});}
    });
    player=window.ICHJourneyPlayer?.create(timeline);
    // Refresh rewinds/restores timelines with callbacks suppressed. Reapply the restored scene
    // after that transaction, including completed meteor tweens and disabled auto-play triggers.
    ScrollTrigger.addEventListener('refresh',refreshEffects);
    ScrollTrigger.refresh();
    return()=>{
      player?.destroy();player=null;
      ScrollTrigger.removeEventListener('refreshInit',measure);
      ScrollTrigger.removeEventListener('refreshInit',measureDeep);
      ScrollTrigger.removeEventListener('refresh',refreshEffects);
      effects?.destroy();
      timeline=null;document.documentElement.classList.remove('motion');document.body.classList.add('static');button.disabled=true;
      $('.watch-position').style.removeProperty('top');
    };
  });
  button.addEventListener('click',()=>{
    if(!timeline)return;
    player?.stop();
    const t=timeline.scrollTrigger,target=timeline.time()>.7?0:timeline.labels['watch-open']/timeline.duration();
    window.scrollTo({top:t.start+(t.end-t.start)*target,behavior:'smooth'});
  });
  if(document.fonts)document.fonts.ready.then(()=>ScrollTrigger.refresh());
  window.addEventListener('pageshow',()=>ScrollTrigger.refresh());
})();
