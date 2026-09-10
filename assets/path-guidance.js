/* Curated shopping directions. Product names, photographs and official links are unchanged. */
(() => {
  'use strict';
  const section=document.querySelector('#path-cards');if(!section)return;
  const cards=[...section.querySelectorAll('.path-card')],base=new URL('../',document.currentScript.src);
  const products={
    datejust:{slug:'ichco-datejust-seikomod',name:'Datejust系列日誌款機械錶',image:'100680595-t.webp'},
    polar:{slug:'ichco-polar-prospector-customized-watch-',name:'Polar-Prospector 極地探勘者',image:'92949885-t.webp'},
    santos:{slug:'ich-co-santos',name:'Santos 山度士系列 Seikomod',image:'69436752-t.webp'},
    carbon:{slug:'ichco-customize-carbon-tattoo-seikomod',name:'Carbon Tattoo 碳紋系列',image:'99056418-t.webp'},
    royal:{slug:'ichco-seikomod-royal-skeleton',name:'SeikoMod Royal skeleton',image:'77085755-t.webp'},
    samurai:{slug:'ichco-samurai',name:'Samurai 日本武士酒桶系列',image:'109435162-t.webp'}
  };
  const directions={
    dawn:{label:'第一只錶',hint:'日常經典・運動輪廓',back:'從天天想戴的開始',backHint:'日誌款 / 極地系列',title:'第一只錶，先找到你的日常。',copy:'喜歡經典感，先看日誌款；偏愛運動輪廓，再比較極地系列。把尺寸與預算一起放進選擇裡。',picks:[['datejust','想要日常經典感，可先比較日誌系列的面色與鏈帶型號。'],['polar','偏愛運動輪廓，可從 43mm 極地系列開始比較錶徑與腕圍。']]},
    muse:{label:'穿搭風格',hint:'俐落方形・鮮明酒桶',back:'找到你的輪廓',backHint:'Santos / Samurai',title:'讓手腕，接上你的穿搭。',copy:'俐落方形與鮮明酒桶，是兩種不同的風格起點。先選輪廓，再比較實際面色與錶帶。',picks:[['santos','喜歡俐落線條，可看看 38mm Santos 的方形輪廓。'],['samurai','想讓手錶成為造型焦點，可比較酒桶錶殼與矽膠錶帶的搭配。']]},
    maker:{label:'專屬客製',hint:'從各款可選配置出發',back:'由你定下細節',backHint:'日誌款 / 碳紋系列',title:'在真正可選的搭配裡，找到你的不同。',copy:'先挑一個系列，再依該款提供的型號與選項搭配。每款能選的面色、機芯與錶帶都不同。',picks:[['datejust','可比較不同面色與鏈帶的完整型號，再查看官網客製化選項。'],['carbon','先選碳紋系列型號，再確認該型號的機芯與可加選項。']]},
    pulse:{label:'機械細節',hint:'鏤空視野・自動機芯',back:'走近時間的心',backHint:'Royal / Samurai',title:'喜歡剛才的機械細節？從這兩款看起。',copy:'想欣賞鏤空結構，先看 Royal；想比較機械錶的不同造型，再看 Samurai。開場拆解為概念展示，各款結構以商品資訊為準。',picks:[['royal','NH70 自動機芯搭配鏤空設計，適合從面盤欣賞機械細節。'],['samurai','酒桶輪廓搭配 I2801-A 自動機械機芯，提供另一種機械錶造型。']]},
    bond:{label:'送禮心意',hint:'從對方的日常挑選',back:'記下一個時刻',backHint:'Santos / 日誌款',title:'先想起那個人，再挑這只錶。',copy:'喜歡俐落線條，可先看 Santos；偏愛經典面盤，可比較日誌系列。送出前先確認對方腕圍、交期與售後資訊。',picks:[['santos','若對方偏愛俐落方形設計，可從 38mm Santos 開始比較。'],['datejust','若對方喜歡經典風格，可比較日誌系列的面色與鏈帶型號。']]}
  };
  const make=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el;};
  const picks=make('div','path-picks');picks.hidden=true;picks.setAttribute('aria-label','依選錶方向挑選的 ICH 系列');
  const note=make('p','path-picks-note','系列實品參考；價格、庫存與可選搭配請以 ICH 商品頁為準。');note.hidden=true;
  const result=section.querySelector('#path-result'),more=section.querySelector('#path-result-link');result.insertBefore(picks,more);result.insertBefore(note,more);
  const toolbar=make('div','path-tools');toolbar.append(make('p','','看見想要的方向，輕觸翻牌。'));
  const effectsButton=make('button','path-effects','微光：開啟');effectsButton.type='button';effectsButton.setAttribute('aria-label','切換牌面微光動畫');effectsButton.setAttribute('aria-pressed','true');toolbar.append(effectsButton);
  section.querySelector('.path-deck').before(toolbar);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let enabled=true,visible=false,reveal=null;
  function syncEffects(){
    const allow=enabled&&!reduced.matches;
    section.dataset.awake=String(visible&&!document.hidden);section.dataset.effects=String(allow);
    effectsButton.disabled=reduced.matches;effectsButton.setAttribute('aria-pressed',String(allow));
    effectsButton.textContent=reduced.matches?'已減少動態':enabled?'微光：開啟':'微光：關閉';
  }
  effectsButton.addEventListener('click',()=>{enabled=!enabled;syncEffects();});
  reduced.addEventListener('change',syncEffects);document.addEventListener('visibilitychange',syncEffects);
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncEffects();},{threshold:0}).observe(section.querySelector('.path-deck'));
  else visible=true;
  syncEffects();
  cards.forEach((card,i)=>{
    const d=directions[card.dataset.path],front=card.querySelector('.path-front'),back=card.querySelector('.path-back');
    card.style.setProperty('--glint-delay',(-i*1.7)+'s');
    const myth=front.querySelector('.path-name').textContent;
    front.querySelector('.path-name').textContent=d.label;front.querySelector('.path-motive').textContent=d.hint;
    front.querySelector('.path-numeral').textContent=['I','II','III','IV','V'][i]+' / '+myth;
    const invitation=make('span','path-invitation','輕觸翻牌 ↗'),sparks=make('span','path-sparks');sparks.setAttribute('aria-hidden','true');front.append(invitation,sparks);
    back.querySelector('strong').textContent=d.back;back.querySelector('span:last-child').textContent=d.backHint;
    back.append(make('span','path-back-cue','下方查看推薦錶款 ↓'));
    card.setAttribute('aria-label',d.label+'：'+d.hint+'，翻牌查看推薦');
    card.dataset.title=d.title;card.dataset.copy=d.copy;
    card.addEventListener('click',()=>{
      picks.replaceChildren();
      d.picks.forEach(([key,why])=>{
        const p=products[key],article=make('article','path-pick'),link=make('a','path-pick-main');
        link.href='https://www.ichco.com.tw/products/'+p.slug;link.target='_blank';link.rel='noopener noreferrer';
        const photo=make('img');photo.src=new URL('assets/catalog/images/'+p.image,base);photo.alt=p.name+' 官網實品參考';photo.width=180;photo.height=180;photo.decoding='async';
        const info=make('div','path-pick-info');info.append(make('span','path-pick-kicker','ICHco / 為你挑選'),make('h4','',p.name),make('p','',why),make('span','path-pick-cta','前往 ICH 官網選購 ↗'));
        link.append(photo,info);
        const compare=make('a','path-pick-compare','先在本站查看規格與搭配 →');compare.href=new URL('catalog.html?product='+encodeURIComponent(p.slug),base);
        article.append(link,compare);picks.append(article);
      });
      picks.hidden=false;note.hidden=false;
      reveal?.cancel();if(!reduced.matches)reveal=picks.animate([{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out'});
    });
  });
})();
