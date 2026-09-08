(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const money = n => 'NT$ ' + new Intl.NumberFormat('zh-TW').format(n);
  const state = {data:null, product:null, variant:null, favorites:new Set(), opener:null, choices:[], changeMessage:'', requests:new Map()};
  const saveKey = 'ichco-saved-watches-v1';
  const el = (tag, cls, text) => { const n=document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; };
  const watches = p => p.variants.filter(v=>!v.accessory);
  const optionValues=(p,index)=>[...new Set(watches(p).map(v=>v.options[index]))].filter(Boolean);
  const capability=p=>{const fields=p.options.map((o,i)=>({...o,index:i,values:optionValues(p,i)})).filter(o=>o.values.length>1);return {fields,label:watches(p).length===1?'官網單一款式':fields.length>1?'依項目選配':'官網款式可選'};};
  const resolveVariant=()=>state.choices.some(x=>x===null)?null:watches(state.product).find(v=>v.options.every((x,i)=>x===state.choices[i]))||null;
  function reconcileChoices(startIndex){
    const p=state.product,pool=watches(p),cleared=[];
    for(let j=startIndex+1;j<p.options.length;j++){
      const values=optionValues(p,j);
      if(values.length===1){state.choices[j]=values[0];continue;}
      const choice=state.choices[j],prefix=state.choices.slice(0,j);
      if(choice===null||prefix.some(x=>x===null)||!pool.some(v=>v.options[j]===choice&&prefix.every((x,k)=>v.options[k]===x))){
        if(choice!==null)cleared.push(p.options[j].name);state.choices[j]=null;
      }
    }
    state.variant=resolveVariant();return cleared;
  }
  const range = p => {const prices=watches(p).map(v=>v.price); return [Math.min(...prices),Math.max(...prices)];};
  const priceLabel = p => {const [min,max]=range(p); return money(min)+(min===max?'':' – '+money(max));};
  const safeRead = () => {try {const saved=JSON.parse(localStorage.getItem(saveKey)||'[]');return Array.isArray(saved)?saved.filter(x=>typeof x==='string'):[];}catch{return [];} };
  state.favorites=new Set(safeRead());
  function updateSave(button,slug) { const on=state.favorites.has(slug); button.setAttribute('aria-pressed',String(on)); button.textContent=on?'已收藏系列':'收藏系列'; button.setAttribute('aria-label',(on?'取消收藏 ':'收藏 ')+(state.data.products.find(p=>p.slug===slug)?.title||'')); }
  function toggleSave(slug) {
    state.favorites.has(slug)?state.favorites.delete(slug):state.favorites.add(slug);
    try {localStorage.setItem(saveKey,JSON.stringify([...state.favorites]));}catch{}
    document.querySelectorAll('[data-save]').forEach(b=>updateSave(b,b.dataset.save));
    if(state.product)updateSave($('saveProduct'),state.product.slug);
    if($('favoritesOnly').checked)renderGrid();
  }
  function imageNode(src,alt,cls) {
    const img=el('img',cls);img.src=src;img.alt=alt;img.loading='lazy';img.decoding='async';img.width=600;img.height=750;
    img.addEventListener('error',()=>{img.classList.add('image-unavailable');img.alt='圖片暫時無法載入，請查看官網實拍';},{once:true});return img;
  }
  function currentFilters() {return {q:$('catalogSearch').value.trim(),brand:$('brandFilter').value,type:$('typeFilter').value,sort:$('sortOrder').value,saved:$('favoritesOnly').checked};}
  function writeURL(replace=true) {
    const f=currentFilters(),url=new URL(location.href);url.search='';
    for(const [k,v]of Object.entries(f))if(v&&v!=='all'&&v!=='featured')url.searchParams.set(k,v);
    if(state.product){url.searchParams.set('product',state.product.slug);if(state.variant)url.searchParams.set('variant',state.variant.id);else url.searchParams.set('choices',JSON.stringify(state.choices));}
    history[replace?'replaceState':'pushState']({},'',url);
  }
  function readFilters() {
    const p=new URLSearchParams(location.search);
    $('catalogSearch').value=p.get('q')||'';
    for(const [id,key]of [['brandFilter','brand'],['typeFilter','type'],['sortOrder','sort']]){const n=$(id),v=p.get(key);n.value=[...n.options].some(o=>o.value===v)?v:n.options[0].value;}
    $('favoritesOnly').checked=p.get('saved')==='true';
  }
  function renderGrid() {
    if(!state.data)return;
    const f=currentFilters(),q=f.q.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let list=state.data.products.filter(p=>(!f.brand||f.brand==='all'||p.brand===f.brand)&&(!f.type||f.type==='all'||p.kind===f.type)&&(!f.saved||state.favorites.has(p.slug))&&q.every(t=>p.searchText.includes(t)));
    if(f.sort==='price-asc')list.sort((a,b)=>range(a)[0]-range(b)[0]);
    if(f.sort==='price-desc')list.sort((a,b)=>range(b)[1]-range(a)[1]);
    if(f.sort==='name')list.sort((a,b)=>a.title.localeCompare(b.title,'zh-Hant'));
    const grid=$('productGrid');grid.replaceChildren();const frag=document.createDocumentFragment();
    list.forEach((p,i)=>{
      const card=el('article','product-card');card.dataset.product=p.slug;
      const open=el('button','product-open');open.type='button';open.setAttribute('aria-label','查看 '+p.title);
      const media=el('div','product-media');const img=imageNode(p.cover,p.title);if(i<4){img.loading='eager';if(i===0)img.fetchPriority='high';}media.append(img);
      const info=el('div','product-info');info.append(el('span','product-kicker',p.brand+(p.kind==='custom'?' · 客製系列':'')),el('h2','product-name',p.displayName),el('p','product-price',priceLabel(p)),el('p','product-meta',watches(p).length+' 組完整配置 · '+capability(p).label+(watches(p).some(v=>v.available)?'':' · 售完')));
      open.append(media,info);open.onclick=()=>openProduct(p.slug,null,open);card.append(open);
      const save=el('button','save-button');save.type='button';save.dataset.save=p.slug;updateSave(save,p.slug);save.onclick=()=>toggleSave(p.slug);card.append(save);frag.append(card);
    });grid.append(frag);
    $('resultCount').textContent=list.length+' 個錶款系列';$('emptyState').hidden=!!list.length;
    $('resetFilters').hidden=!(f.q||(f.brand&&f.brand!=='all')||(f.type&&f.type!=='all')||f.saved||f.sort!=='featured');
  }
  let photoRequest=0;
  function setImage(image,caption,scope='selected') {
    const img=$('productImage'),badge=$('photoScope'),placeholder=$('photoUnavailable'),request=++photoRequest;
    const src=new URL(image.src,location.href).href;
    const alreadyReady=img.currentSrc===src&&img.complete&&img.naturalWidth>0;
    const label={selected:'所選款式照片',shared:'共用參考照片',gallery:'系列相簿 · 尚未更改搭配',incomplete:'搭配未選完 · 款式參考',unmatched:'此搭配沒有獨立照片'}[scope];
    img.style.opacity=alreadyReady?'1':'0';img.alt=state.product.title+' — '+caption;img.dataset.imageId=image.id;
    placeholder.hidden=alreadyReady;placeholder.textContent='正在載入官網照片…';
    $('imageCaption').textContent=caption;badge.dataset.scope=scope;badge.textContent=alreadyReady?label:'照片載入中';
    img.onload=()=>{
      if(request!==photoRequest||img.currentSrc!==src||!img.naturalWidth)return;
      img.style.opacity='1';placeholder.hidden=true;badge.dataset.scope=scope;badge.textContent=label;
    };
    img.onerror=()=>{
      if(request!==photoRequest)return;
      img.style.opacity='0';placeholder.hidden=false;placeholder.textContent='照片暫時無法載入，請至官網查看外觀。';
      badge.dataset.scope='unavailable';badge.textContent='照片暫時無法載入';
      $('imageCaption').textContent='照片載入失敗；下方已選搭配與售價沒有改變，請至官網確認外觀。';
    };
    if(alreadyReady)img.onload();else img.src=image.src;
    $('returnSelectedPhoto').hidden=scope!=='gallery';
    document.querySelectorAll('#imageThumbs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.imageId===String(image.id))));
  }
  function renderSelectedPhoto(){
    const p=state.product,v=state.variant,reference=v||watches(p).find(item=>state.choices.every((x,j)=>x===null||item.options[j]===x));
    const matched=p.images.find(i=>i.id===reference?.imageId),photo=matched||p.images[0];if(!photo)return;
    if(!v)setImage(photo,'請先完成下方選項；這張照片只供查看型號外觀。','incomplete');
    else if(!matched)setImage(photo,'此搭配沒有獨立照片，現顯示系列參考圖；請至官網確認外觀。所選：'+v.title,'unmatched');
    else if(v.sharedImage)setImage(photo,'多種配置共用此照片，未呈現所有錶帶／加購差異。所選：'+v.title,'shared');
    else setImage(photo,'官網對應款式：'+v.title,'selected');
  }
  function renderVariant() {
    const p=state.product,v=state.variant,options=$('variantOptions');options.replaceChildren();
    const pool=watches(p),cap=capability(p);$('capabilityBadge').textContent=cap.label;
    $('capabilityText').textContent=pool.length===1?'官網目前僅列一組配置，沒有其他款式選單。':cap.fields.length>1?'官網可選：'+cap.fields.map(o=>o.name).join('、')+'。依序選擇；灰色項目是官網未列的組合。':'官網可選：'+cap.fields.map(o=>o.name).join('、')+'。每個選項對應一組完整商品，並不代表所有零件都能互換。';
    p.options.forEach((option,index)=>{
      const values=optionValues(p,index);if(!values.length||(values.length===1&&/default title/i.test(values[0])))return;
      const field=el('fieldset');field.dataset.optionIndex=index;field.append(el('legend',null,option.name));
      if(values.length===1){field.append(el('p','fixed-option',values[0]+'（官網此欄僅一種）'));options.append(field);return;}
      const row=el('div','option-values'),prefix=state.choices.slice(0,index),ready=prefix.every(x=>x!==null);
      values.forEach(value=>{
        const b=el('button','option-chip');b.type='button';b.dataset.optionValue=value;b.dataset.optionIndex=index;b.append(el('span','option-label',value));b.setAttribute('aria-pressed',String(state.choices[index]===value));
        const candidates=ready?pool.filter(item=>item.options[index]===value&&prefix.every((x,j)=>x===item.options[j])):[];
        b.disabled=!candidates.length;
        if(!candidates.length){const reason=ready?'未列此組合':'先選前一項';b.title=reason;b.append(el('span','option-state',reason));b.setAttribute('aria-label',value+'（'+reason+'）');}
        else if(!candidates.some(c=>c.available)){b.append(el('span','option-state','官網標示售完'));b.setAttribute('aria-label',value+'（官網標示售完，可查看）');}
        b.onclick=()=>{
          state.choices[index]=value;const cleared=reconcileChoices(index);
          state.changeMessage=cleared.length?'新選項沒有原先的對應組合，請重新選擇：'+cleared.join('、')+'。':state.variant?'已更新所選款式；照片與售價同步更新。':'請完成剩下的選項，才會顯示這組整錶售價。';
          const pane=$('productDialog').querySelector('.product-content'),before=b.getBoundingClientRect().top,oldScroll=pane.scrollTop;
          renderVariant();writeURL();const next=[...document.querySelectorAll('#variantOptions button')].find(n=>n.dataset.optionIndex===String(index)&&n.dataset.optionValue===value);
          // 保持點擊位置，避免上方說明換行後把正在選的規格推走。
          if(next){const delta=next.getBoundingClientRect().top-before;if(pane.scrollHeight>pane.clientHeight)pane.scrollTop=oldScroll+delta;next.focus({preventScroll:true});}
        };row.append(b);
      });field.append(row);options.append(field);
    });
    const missing=p.options.filter((o,i)=>state.choices[i]===null).map(o=>o.name);
    $('selectionChange').textContent=state.changeMessage||(!v?'請選擇：'+missing.join('、'):'');$('selectionChange').hidden=!$('selectionChange').textContent;
    $('priceLabel').textContent=v?.requiresClarification?'官網標示整錶價 · 內容需再確認':'這組整錶售價';
    $('productPrice').textContent=v?money(v.price):'請先完成選擇';$('productPrice').classList.toggle('price-pending',!v);
    $('selectedVariantTitle').textContent=v?'已選：'+v.title:'待選：'+missing.join('、');
    $('comparePrice').textContent=v&&v.compareAtPrice>v.price?money(v.compareAtPrice):'';$('comparePrice').hidden=!(v&&v.compareAtPrice>v.price);
    $('stockStatus').textContent=!v?'選項尚未完成':v.requiresClarification?'此選項需要補充款式或錶帶內容，請先詢問客服。':v.available?'官網標示可訂購':'官網標示售完，可向客服詢問';$('stockStatus').dataset.available=String(!!v?.available);
    const summary=$('selectedConfiguration');summary.replaceChildren();
    p.options.forEach((o,i)=>{summary.append(el('dt',null,o.name),el('dd',null,state.choices[i]||'尚未選擇'));});summary.hidden=p.options.length<2;
    $('variantNotice').textContent=p.accessoryCount?'本頁價格為整錶。單獨購買的配件不列入整錶選項，請至官網配件項目查看。':'';$('variantNotice').hidden=!$('variantNotice').textContent;
    renderSelectedPhoto();$('copyStatus').textContent='';$('requestCopyStatus').textContent='';
    $('copyProduct').disabled=!v;$('copyRequest').disabled=!v;
    $('copyProduct').textContent=v?.requiresClarification?'複製此款詢問客服':'複製已選款式給客服';
    $('productSource').textContent='資料核對：'+state.data.checkedDate+' · 價格與庫存依官網當下資訊為準';
    $('officialLink').href=p.officialUrl;$('officialLink').textContent=v?.available&&!v.requiresClarification?'至官網確認與訂購 ↗':'至官網查看與詢問 ↗';
    const preview=$('previewLink');preview.hidden=!(v&&p.previewSeries&&p.previewVariantIds?.includes(v.id));
    if(!preview.hidden)preview.href='studio.html?series='+encodeURIComponent(p.previewSeries);
    if(v?.requiresClarification)$('customRequest').closest('details').open=true;
  }

  function openProduct(slug,variantId,opener,updateURL=true) {
    const p=state.data.products.find(x=>x.slug===slug);if(!p)return false;
    state.product=p;const pool=watches(p);state.variant=pool.find(v=>String(v.id)===String(variantId))||pool.find(v=>v.available)||pool[0];state.choices=[...state.variant.options];state.changeMessage='';
    const params=new URLSearchParams(location.search);
    if(!variantId&&params.get('product')===slug&&params.has('choices')){
      try{const choices=JSON.parse(params.get('choices'));if(Array.isArray(choices)&&choices.length===p.options.length){state.choices=choices.map((x,i)=>optionValues(p,i).includes(x)?x:null);reconcileChoices(-1);}}catch{}
    }
    $('customRequest').value=state.requests.get(slug)||'';$('customRequest').closest('details').open=false;
    state.opener=opener||state.opener;
    $('productBrand').textContent=p.brand+(p.kind==='custom'?' · 客製系列':'');$('productTitle').textContent=p.displayName;
    const specs=$('productSpecs');specs.replaceChildren();p.specs.forEach(({label,value})=>{specs.append(el('dt',null,label),el('dd',null,value));});
    if(!p.specs.length)specs.append(el('dt',null,'詳細規格'),el('dd',null,'請見官網商品說明'));
    $('customizeNote').textContent='錶殼、錶面、指針或其他未列出的變更，請先詢問是否能製作與費用；並不包含在已選整錶的售價內。';
    const description=$('productDescription');description.replaceChildren();
    p.descriptionLines.forEach(line=>description.append(el('p',null,line)));
    (p.descriptionImages||[]).forEach((src,i)=>{const im=imageNode(src,'官網款式說明圖 '+(i+1),'spec-graphic');im.width=1000;im.height=1200;description.append(im);});
    const details=description.closest('details');if(details){details.open=false;details.hidden=!description.childNodes.length;}

    $('saveProduct').dataset.save=p.slug;updateSave($('saveProduct'),p.slug);
    const thumbs=$('imageThumbs');thumbs.replaceChildren();
    p.images.forEach((im,i)=>{const b=el('button','image-thumb');b.type='button';b.dataset.imageId=im.id;b.setAttribute('aria-label','查看第 '+(i+1)+' 張官網照片');b.append(imageNode(im.thumb||im.src,''));b.onclick=()=>{if(im.id===state.variant?.imageId)renderSelectedPhoto();else setImage(im,'正在查看系列相簿；這張照片不代表目前所選搭配，下方選項與售價尚未更改。','gallery');};thumbs.append(b);});
    renderVariant();const dialog=$('productDialog');if(!dialog.open){dialog.showModal();document.body.classList.add('dialog-open');}$('closeProduct').focus({preventScroll:true});dialog.scrollTop=0;$('productDialog').querySelector('.product-content').scrollTop=0;
    if(updateURL)writeURL(false);return true;
  }
  function closeProduct(updateURL=true) {
    const closingSlug=state.product?.slug;const dialog=$('productDialog');if(dialog.open)dialog.close();state.product=null;state.variant=null;document.body.classList.remove('dialog-open');
    if(updateURL&&state.data)writeURL();const opener=state.opener?.isConnected?state.opener:(closingSlug?document.querySelector('[data-product="'+CSS.escape(closingSlug)+'"] .product-open'):null);if(opener)opener.focus({preventScroll:true});
  }
  function syncLocation() {if(!state.data)return;readFilters();renderGrid();const p=new URLSearchParams(location.search);if(p.get('product')){if(!openProduct(p.get('product'),p.get('variant'),null,false))closeProduct(false);}else closeProduct(false);}
  function validate(data) {
    if(!data.products?.length)throw new Error('No products');
    const ids=new Set();data.products.forEach(p=>{
      if(!p.slug||ids.has(p.slug)||!p.variants?.length||!p.images?.length)throw new Error('Invalid product');ids.add(p.slug);
      if(!p.officialUrl.startsWith('https://www.ichco.com.tw/products/'))throw new Error('Invalid source');
      if(!watches(p).length||watches(p).some(v=>!Number.isFinite(v.price)||v.price<=0))throw new Error('Invalid price');
      p.searchText=[p.title,p.brand,...p.variants.map(v=>v.title),...p.specs.map(s=>s.value)].join(' ').toLocaleLowerCase();
    });return data;
  }
  async function load() {
    $('loadingState').hidden=false;$('errorState').hidden=true;
    try {
      const response=await fetch('assets/catalog-data.json?v=20260907b');if(!response.ok)throw new Error('Catalog load');state.data=validate(await response.json());
      const brands=[...new Set(state.data.products.map(p=>p.brand))].sort((a,b)=>a.localeCompare(b));const select=$('brandFilter');select.replaceChildren(new Option('全部品牌','all'),...brands.map(b=>new Option(b,b)));
      $('catalogStats').textContent=state.data.products.length+' 個錶款系列 · '+state.data.products.reduce((sum,p)=>sum+watches(p).length,0)+' 款搭配 · '+brands.length+' 個品牌';
      readFilters();renderGrid();const params=new URLSearchParams(location.search);if(params.get('product'))openProduct(params.get('product'),params.get('variant'),null,false);
    }catch(error){console.error('無法載入錶款目錄',error);$('errorState').hidden=false;}
    finally{$('loadingState').hidden=true;}
  }
  let debounce;
  $('catalogSearch').addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>{renderGrid();writeURL();},150);});
  ['brandFilter','typeFilter','sortOrder','favoritesOnly'].forEach(id=>$(id).addEventListener('change',()=>{renderGrid();writeURL();}));
  $('resetFilters').onclick=()=>{$('catalogSearch').value='';$('brandFilter').value='all';$('typeFilter').value='all';$('sortOrder').value='featured';$('favoritesOnly').checked=false;renderGrid();writeURL();};
  $('saveProduct').onclick=()=>{if(state.product)toggleSave(state.product.slug);};
  $('closeProduct').onclick=()=>closeProduct();$('productDialog').addEventListener('cancel',e=>{e.preventDefault();closeProduct();});
  $('productDialog').addEventListener('click',e=>{if(e.target===$('productDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeProduct();}});
  async function copySelection(request=false){
    if(!state.product||!state.variant)return;const p=state.product,v=state.variant,extra=$('customRequest').value.trim(),status=$(request?'requestCopyStatus':'copyStatus');
    if(request&&!extra){status.textContent='請先填寫希望變更的內容。';$('customRequest').focus();return;}
    const message=[request?'ICHco 額外變更需求（待確認）':'ICHco 官網款式詢問',p.title,'已選完整配置：'+v.title,'官網整錶售價：'+money(v.price)+(request?'（不含下列額外需求）':''),...(v.requiresClarification?['此官網選項的實際款式／錶帶內容仍需補充確認。']:[]),...(request?['希望變更：'+extra,'請確認是否適用、能否製作、供貨及最終報價。']:[]),'資料核對：'+state.data.checkedDate,p.officialUrl,'款式連結：'+location.href].join('\n');
    try{await navigator.clipboard.writeText(message);status.textContent=request?'已複製待確認需求，尚未確認能製作或報價。':'已複製官網款式與整錶售價。';}
    catch{const area=el('textarea');area.value=message;area.setAttribute('aria-label','可複製的錶款資料');area.style.cssText='width:100%;min-height:180px';status.replaceChildren(el('p',null,'請選取下方文字複製：'),area);area.focus();area.select();}
  }
  $('copyProduct').onclick=()=>copySelection(false);$('copyRequest').onclick=()=>copySelection(true);
  $('customRequest').oninput=()=>{if(state.product)state.requests.set(state.product.slug,$('customRequest').value);$('requestCopyStatus').textContent='';};
  $('returnSelectedPhoto').onclick=renderSelectedPhoto;

  $('retryLoad').onclick=load;window.addEventListener('popstate',syncLocation);load();
})();
