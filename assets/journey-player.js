/* User-started playback of the existing reversible scroll journey. */
(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  const assetBase=new URL('.',document.currentScript.src);
  const soft=document.createElement('div');
  soft.className='watch-soft-focus';soft.setAttribute('aria-hidden','true');
  const still=new Image();still.src=new URL('watch-assembled.webp',assetBase);still.alt='';still.decoding='async';
  soft.append(still);$('.watch-position').before(soft);
  // Shopping motives are choices, not personality diagnoses or product specifications.
  const icons={
    dawn:'<path d="M35 119H125M46 128H114M58 137H102"/><path d="M48 114A32 32 0 0 1 112 114M80 54V70M39 71L50 82M121 71L110 82M26 100L42 104M134 100L118 104"/><circle cx="80" cy="44" r="3"/>',
    muse:'<path d="M80 40C55 54 48 74 51 96C54 115 67 127 80 137C93 127 106 115 109 96C112 74 105 54 80 40Z"/><path d="M80 45V136M80 114L57 93M80 99L102 77M80 77L65 64M80 128L102 107"/><circle cx="80" cy="91" r="44" stroke-dasharray="1 7"/>',
    maker:'<path d="M59 44L103 124M52 51L96 131M100 44L57 126M108 50L64 134M48 143H112M60 151H100M43 38H117"/><circle cx="80" cy="89" r="38"/><path d="M80 78V100M69 89H91"/>',
    pulse:'<circle cx="80" cy="92" r="39"/><circle cx="80" cy="92" r="26"/><circle cx="80" cy="92" r="9"/><path d="M80 45V64M80 120V139M33 92H52M108 92H127M47 59L60 72M100 112L113 125M47 125L60 112M100 72L113 59M80 73V89L92 98"/>',
    bond:'<path d="M80 130C66 117 41 98 41 76C41 51 70 48 80 69C90 48 119 51 119 76C119 98 94 117 80 130ZM50 145H110M65 152H95M80 37V46M40 45L47 53M120 45L113 53"/><circle cx="80" cy="92" r="9"/>'
  };
  document.querySelectorAll('.path-card').forEach(card=>{
    card.querySelector('.path-art').innerHTML='<svg viewBox="0 0 160 184" aria-hidden="true"><ellipse cx="80" cy="92" rx="62" ry="78"/><path class="art-faint" d="M18 92H142M80 14V170M31 38L129 146M31 146L129 38"/>'+icons[card.dataset.path]+'<path d="M80 8L84 14L80 20L76 14ZM80 164L84 170L80 176L76 170Z"/></svg>';
    card.disabled=false;
    card.addEventListener('click',()=>{
      if($('#path-cards').dataset.choiceEnhanced==='true')return;
      document.querySelectorAll('.path-card').forEach(other=>other.setAttribute('aria-pressed',String(other===card)));
      $('#path-result-title').textContent=card.dataset.title;
      $('#path-result-copy').textContent=card.dataset.copy;
      const link=$('#path-result-link');link.href=card.dataset.href;link.querySelector('span').textContent=card.dataset.cta;
      $('#path-result').classList.add('has-choice');
    });
  });
  const bottle=`<svg class="perfume-art" viewBox="0 0 220 205" aria-hidden="true">
    <defs>
      <linearGradient id="perfumeGlass" x1="0" x2="1"><stop stop-color="#a15c7370"/><stop offset=".13" stop-color="#fff4f7b0"/><stop offset=".25" stop-color="#f0b2ce25"/><stop offset=".58" stop-color="#eaa8c52e"/><stop offset=".83" stop-color="#ffe7f699"/><stop offset="1" stop-color="#d482a259"/></linearGradient>
      <linearGradient id="perfumeGold" x1="0" x2="1"><stop stop-color="#79603b"/><stop offset=".24" stop-color="#f6dfaa"/><stop offset=".48" stop-color="#b48d50"/><stop offset=".72" stop-color="#ecd097"/><stop offset="1" stop-color="#785834"/></linearGradient>
      <linearGradient id="perfumeRose" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fadbea18"/><stop offset=".66" stop-color="#f7b3d34a"/><stop offset="1" stop-color="#e699bb8f"/></linearGradient>
      <radialGradient id="perfumeHaze"><stop stop-color="#fff0f9" stop-opacity=".65"/><stop offset=".45" stop-color="#efc1d8" stop-opacity=".22"/><stop offset="1" stop-color="#efc1d8" stop-opacity="0"/></radialGradient>
    </defs>
    <g class="bottle-body">
      <ellipse cx="110" cy="187" rx="52" ry="4" fill="#000" opacity=".5"/>
      <path d="M85 71C63 69 54 82 58 96C61 108 74 111 83 105M135 71C157 69 166 82 162 96C159 108 146 111 137 105" fill="none" stroke="url(#perfumeGold)" stroke-width="4"/>
      <path d="M94 51H126L128 65C128 78 144 83 148 103L143 159Q141 178 121 182H99Q79 178 77 159L72 103C76 83 92 78 92 65Z" fill="url(#perfumeGlass)" stroke="#f9dae9a6" stroke-width="1"/>
      <path d="M78 114Q110 119 142 114L137 158Q135 173 119 176H101Q85 173 83 158Z" fill="url(#perfumeRose)" stroke="#ffdbec30"/>
      <path d="M83 104C86 86 98 86 99 70M83 114L88 157Q90 168 99 169" fill="none" stroke="#fff8fcad" stroke-width="3" stroke-linecap="round"/>
      <path d="M135 97L133 149" stroke="#ffe9f6b8" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M110 57V161" stroke="#f6ddeb4d" stroke-width="1.5"/>
      <path d="M94 52H126V66H94Z" fill="url(#perfumeGold)" stroke="#f6dfaa" stroke-width=".6"/>
      <path d="M97 55V63M102 55V63M107 55V63M112 55V63M117 55V63M122 55V63" stroke="#6d502f" stroke-width=".7"/>
      <path d="M83 158H137M87 166H133" stroke="#dbbd89" stroke-width=".9" opacity=".8"/>
      <path d="M90 160V164H96V160H102V164H108V160H114V164H120V160H126V164H130" stroke="#ecd3a0" fill="none" stroke-width=".6"/>
      <ellipse cx="110" cy="124" rx="19" ry="23" fill="#2a1d2438" stroke="#e0c4919e" stroke-width=".65"/>
      <path d="M111 108C102 115 104 126 110 136C114 127 119 119 111 108ZM110 136V113" fill="none" stroke="#f2dca8" stroke-width=".9"/>
      <path d="M95 180H125L131 185H89Z" fill="url(#perfumeGold)" stroke="#f6d8a0" stroke-width=".6"/>
    </g>
    <g class="bottle-pump">
      <path d="M104 40H116V52H104Z" fill="url(#perfumeGold)"/>
      <path d="M94 27Q94 24 98 24H135Q139 24 139 28V39H97Q94 39 94 36Z" fill="url(#perfumeGold)" stroke="#f5dfac" stroke-width=".8"/>
      <path d="M98 27H132" stroke="#fff1cc" stroke-width=".8"/><rect x="134" y="30" width="5" height="4" rx="1" fill="#493523"/>
    </g>
    <g class="perfume-spray" opacity="0">
      <ellipse class="mist-cloud" cx="163" cy="31" rx="34" ry="20" fill="url(#perfumeHaze)"/>
      <g class="mist-drops" fill="#ffe9f5"><circle cx="146" cy="30" r=".7"/><circle cx="152" cy="26" r=".9"/><circle cx="155" cy="35" r=".6"/><circle cx="161" cy="24" r=".6"/><circle cx="164" cy="38" r=".8"/><circle cx="172" cy="30" r="1"/><circle cx="178" cy="19" r=".6"/><circle cx="180" cy="40" r=".6"/></g>
    </g>
  </svg>`;
  // A consumed bottle stays consumed across scroll reversal and media-query rebuilds.
  let used=false;
  function create(timeline){
    const st=timeline.scrollTrigger,intro=$('.introduction');
    const dock=document.createElement('div');dock.className='perfume-dock';
    dock.innerHTML='<button class="perfume-play" type="button" aria-label="按下香水瓶，播放時間之旅">'+bottle+'<span class="perfume-label">開啟時間之旅 <span aria-hidden="true">▷</span></span><small>按下香水瓶，慢慢欣賞</small></button><button class="journey-reset" type="button" hidden><span aria-hidden="true">↺</span> 恢復預設</button>';
    intro.insertBefore(dock,$('.concept'));intro.classList.add('has-player');
    const play=dock.querySelector('.perfume-play'),reset=dock.querySelector('.journey-reset');
    const bar=document.createElement('div');bar.className='journey-controls';bar.hidden=true;
    bar.innerHTML='<span class="journey-playing">時間之旅 · 自動播放</span><button type="button" class="journey-pause" aria-label="暫停自動播放，改為手動瀏覽">Ⅱ 暫停</button><span class="journey-play-track" aria-hidden="true"><i></i></span>';
    document.body.append(bar);
    const live=document.createElement('span');live.className='journey-status';live.setAttribute('role','status');document.body.append(live);
    const pause=bar.querySelector('button'),track=bar.querySelector('i');
    const beats=window.ICHJourneyBeats;
    const showBeat=beat=>{
      if(!beat)return;
      bar.querySelector('.journey-playing').textContent=beat.id+' / '+beat.name;
      bar.dataset.beat=beat.id;bar.dataset.beatSeconds=beat.seconds;
    };
    let tour=null,press=null,active=false,maxY=0,lastProgress=-1,viewportWidth=innerWidth;
    const touchViewport=matchMedia('(pointer: coarse)').matches;
    function updateBar(p){const n=Math.round(p*100);if(n!==lastProgress){track.style.transform='scaleX('+p+')';lastProgress=n;}}
    const state=s=>document.body.dataset.journeyPlayback=s;
    function showDefault(){play.hidden=used;play.disabled=false;reset.hidden=!used||scrollY>st.start+30;}
    showDefault();state(used?'manual':'idle');
    const sectionTop=selector=>Math.max(0,Math.min(maxY,$(selector).getBoundingClientRect().top+scrollY-$('.masthead').offsetHeight-12));
    function setScroll(y){window.scrollTo({top:Math.max(0,Math.min(maxY,Math.round(y))),behavior:'instant'});}
    function stop(reason='manual'){
      if(!active)return;
      active=false;tour?.kill();press?.kill();tour=null;press=null;
      const p=timeline.totalProgress();
      st.enable(false,false);st.update();st.getTween()?.pause();timeline.totalProgress(p);
      bar.hidden=true;state(reason);showDefault();
      live.textContent=reason==='complete'?'旅程已抵達選牌區，請選擇你的選錶方向。':'已暫停，可上下滑動回看。';
    }
    function begin(){
      if(active||used)return;
      used=true;active=true;play.disabled=true;reset.hidden=true;
      maxY=document.documentElement.scrollHeight-innerHeight;
      st.disable(false);timeline.totalProgress(0);setScroll(st.start);state('spraying');
      updateBar(0);bar.hidden=false;pause.focus({preventScroll:true});
      showBeat(beats?.[0]);
      live.textContent='開始自動播放。滾動、觸碰畫面或按暫停，即可改為手動瀏覽。';
      const art=play.querySelector('.perfume-art');
      // Local mist uses transforms and alpha. There is no idle animation loop.
      press=gsap.timeline({id:'journey-perfume',onComplete(){
        if(!active)return;
        play.hidden=true;state('playing');
        const clock={p:0},travel={y:st.end},hold={p:0};
        tour=gsap.timeline({id:'journey-autoplay',onUpdate(){updateBar(this.progress());},onComplete(){
          stop('complete');$('#path-title').focus({preventScroll:true});
        }});
        const render=()=>{
          timeline.totalProgress(clock.p);
          setScroll(st.start+(st.end-st.start)*clock.p);
        };
        if(beats){
          // Each chapter owns its seconds; the reversible scroll scene retains its original timing.
          beats.slice(1).forEach(beat=>{
            const timing={duration:beat.seconds,onStart:()=>showBeat(beat)};
            if(beat.kind==='scene')tour.to(clock,{...timing,p:beat.end/timeline.duration(),ease:'none',onUpdate:render});
            else if(beat.kind==='travel')tour.to(travel,{...timing,y:()=>sectionTop(beat.target),ease:'power1.inOut',onUpdate:()=>setScroll(travel.y)});
            else if(beat.kind==='hold')tour.to(hold,{...timing,p:1});
          });
        }else{
          // Preserve playback if the optional chapter map is unavailable.
          tour.to(clock,{p:.42/timeline.duration(),duration:1.8,ease:'none',onUpdate:render});
          tour.to(clock,{p:1,duration:38.2,ease:'none',onUpdate:render});
          tour.to(travel,{y:()=>sectionTop('#strap-study'),duration:2.4,ease:'power1.inOut',onUpdate:()=>setScroll(travel.y)});
          tour.to(hold,{p:1,duration:3});
          tour.to(travel,{y:()=>sectionTop('#path-cards'),duration:2.8,ease:'power1.inOut',onUpdate:()=>setScroll(travel.y)});
        }
      }});
      press.to(art.querySelector('.bottle-pump'),{y:7,duration:.18,ease:'power2.in'})
        .to(art.querySelector('.bottle-pump'),{y:0,duration:.3,ease:'power2.out'},.18)
        .fromTo(art.querySelector('.perfume-spray'),{opacity:0},{opacity:1,duration:.12},.12)
        .to(art.querySelector('.mist-cloud'),{x:23,y:-9,scale:1.6,svgOrigin:'139 32',duration:.66,ease:'power1.out'},.14)
        .to(art.querySelector('.mist-drops'),{x:30,y:-6,scale:1.5,svgOrigin:'139 32',duration:.6,ease:'power1.out'},.14)
        .to(art.querySelector('.perfume-spray'),{opacity:0,duration:.46},.35)
        .to(play,{opacity:0,y:-8,duration:.38},.56);
      if(beats)press.timeScale(press.duration()/beats[0].seconds);
    }
    function restore(){
      stop();used=false;showDefault();state('idle');
      gsap.set(play,{clearProps:'all'});
      gsap.set(play.querySelector('.bottle-pump'),{y:0});
      gsap.set(play.querySelectorAll('.mist-cloud,.mist-drops'),{x:0,y:0,scale:1});
      gsap.set(play.querySelector('.perfume-spray'),{opacity:0});
      st.getTween()?.pause();window.scrollTo({top:st.start,behavior:'instant'});st.update();st.getTween()?.pause();timeline.totalProgress(0);
      live.textContent='已恢復開場，可重新按下香水瓶。';play.focus({preventScroll:true});
    }
    const wheel=()=>stop(),touch=()=>stop();
    const pointer=e=>{if(!dock.contains(e.target)&&!bar.contains(e.target))stop();};
    const key=e=>{
      if(e.key==='Escape'&&active){stop();$('.journey-stage').focus({preventScroll:true});}
      else if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)&&!dock.contains(e.target)&&!bar.contains(e.target))stop();
    };
    // Native scrolling can settle after scrollTo on mobile. Only direct input cancels playback.
    const visibility=()=>{if(document.hidden)stop();};
    const resize=()=>{
      const widthChanged=Math.abs(innerWidth-viewportWidth)>2;
      viewportWidth=innerWidth;
      // Browser bars change a phone's height during our own scrolling; that is not a pause request.
      if(!touchViewport||widthChanged)stop();
      else if(active)maxY=Math.max(0,document.documentElement.scrollHeight-innerHeight);
    };
    const orientation=()=>stop();
    play.addEventListener('click',begin);reset.addEventListener('click',restore);
    pause.addEventListener('click',()=>{stop();$('.journey-stage').focus({preventScroll:true});});
    $('.journey-stage').setAttribute('tabindex','-1');
    window.addEventListener('wheel',wheel,{passive:true});window.addEventListener('touchstart',touch,{passive:true});
    window.addEventListener('pointerdown',pointer,{passive:true});window.addEventListener('keydown',key);
    window.addEventListener('resize',resize);window.addEventListener('orientationchange',orientation);
    document.addEventListener('visibilitychange',visibility);
    return {stop,update(p){
      // Avoid reading scrollY after transform writes, and do not mutate unchanged attributes.
      const hideReset=!used||active||p>.0001;
      if(reset.hidden!==hideReset)reset.hidden=hideReset;
    },
      destroy(){
        stop();dock.remove();bar.remove();live.remove();intro.classList.remove('has-player');
        window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',touch);window.removeEventListener('pointerdown',pointer);
        window.removeEventListener('keydown',key);window.removeEventListener('resize',resize);window.removeEventListener('orientationchange',orientation);
        document.removeEventListener('visibilitychange',visibility);
      }};
  }
  window.ICHJourneyPlayer={create,softFocus:soft};
})();
