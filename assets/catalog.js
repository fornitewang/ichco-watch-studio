(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const money = n => 'NT$ ' + new Intl.NumberFormat('zh-TW').format(n);
  const state = {data:null, product:null, variant:null, favorites:new Set(), opener:null};
  const saveKey = 'ichco-saved-watches-v1';
  const el = (tag, cls, text) => { const n=document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; };
  const watches = p => p.variants.filter(v=>!v.accessory);
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
    if(state.product){url.searchParams.set('product',state.product.slug);if(state.variant)url.searchParams.set('variant',state.variant.id);}
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
      const info=el('div','product-info');info.append(el('span','product-kicker',p.brand+(p.kind==='custom'?' · 客製系列':'')),el('h2','product-name',p.displayName),el('p','product-price',priceLabel(p)),el('p','product-meta',watches(p).length+' 款搭配 · '+(watches(p).some(v=>v.available)?'查看款式':'官網標示售完')));
      open.append(media,info);open.onclick=()=>openProduct(p.slug,null,open);card.append(open);
      const save=el('button','save-button');save.type='button';save.dataset.save=p.slug;updateSave(save,p.slug);save.onclick=()=>toggleSave(p.slug);card.append(save);frag.append(card);
    });grid.append(frag);
    $('resultCount').textContent=list.length+' 個錶款系列';$('emptyState').hidden=!!list.length;
    $('resetFilters').hidden=!(f.q||(f.brand&&f.brand!=='all')||(f.type&&f.type!=='all')||f.saved||f.sort!=='featured');
  }
  function setImage(image,caption) {
    const img=$('productImage');img.src=image.src;img.alt=state.product.title+' — '+caption;img.dataset.imageId=image.id;
    $('imageCaption').textContent=caption;
    document.querySelectorAll('#imageThumbs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.imageId===String(image.id))));
  }
  function renderVariant() {
    const p=state.product,v=state.variant;const options=$('variantOptions');options.replaceChildren();
    const pool=watches(p);
    p.options.forEach((option,index)=>{
      const values=[...new Set(pool.map(item=>item.options[index]))].filter(Boolean);
      if(values.length===1&&/default title/i.test(values[0]))return;
      const field=el('fieldset');field.append(el('legend',null,option.name));const row=el('div','option-values');
      values.forEach(value=>{
        const b=el('button','option-chip',value);b.type='button';b.setAttribute('aria-pressed',String(v.options[index]===value));
        const candidates=pool.filter(item=>item.options[index]===value&&item.options.slice(0,index).every((x,j)=>x===v.options[j]));
        b.disabled=!candidates.length;
        if(candidates.length&&!candidates.some(c=>c.available))b.title='官網標示此搭配售完';
        b.onclick=()=>{state.variant=candidates.find(c=>c.options.every((x,j)=>j<=index||x===v.options[j]))||candidates.find(c=>c.available)||candidates[0];renderVariant();writeURL();const field=document.querySelectorAll('#variantOptions fieldset')[index];const next=field&&[...field.querySelectorAll('button')].find(n=>n.textContent===value);if(next)next.focus({preventScroll:true});};row.append(b);
      });field.append(row);options.append(field);
    });
    $('productPrice').textContent=money(v.price);
    $('comparePrice').textContent=v.compareAtPrice>v.price?money(v.compareAtPrice):'';$('comparePrice').hidden=!(v.compareAtPrice>v.price);
    $('stockStatus').textContent=v.available?'官網標示可訂購':'官網標示售完';$('stockStatus').dataset.available=String(v.available);
    $('variantNotice').textContent=p.accessoryCount?'此頁列出整錶搭配；單買配件請至官網選購。':(p.options.length>1?'選項依官網提供的搭配連動。':'');
    $('variantNotice').hidden=!$('variantNotice').textContent;
    const photo=p.images.find(i=>i.id===v.imageId)||p.images[0];
    if(photo)setImage(photo,v.sharedImage?'官網共用款式照；錶帶與加購內容依所選搭配：'+v.title:'官網對應款式：'+v.title);
    $('copyStatus').textContent='';
    $('productSource').textContent='資料核對：'+state.data.checkedDate+' · 價格與庫存依官網當下資訊為準';
    $('officialLink').href=p.officialUrl;
    const preview=$('previewLink');preview.hidden=!p.previewSeries;
    if(p.previewSeries)preview.href='index.html?series='+encodeURIComponent(p.previewSeries)+'#configHead';
  }
  function openProduct(slug,variantId,opener,updateURL=true) {
    const p=state.data.products.find(x=>x.slug===slug);if(!p)return false;
    state.product=p;const pool=watches(p);state.variant=pool.find(v=>String(v.id)===String(variantId))||pool.find(v=>v.available)||pool[0];
    state.opener=opener||state.opener;
    $('productBrand').textContent=p.brand+(p.kind==='custom'?' · 客製系列':'');$('productTitle').textContent=p.displayName;
    const specs=$('productSpecs');specs.replaceChildren();p.specs.forEach(({label,value})=>{specs.append(el('dt',null,label),el('dd',null,value));});
    if(!p.specs.length)specs.append(el('dt',null,'詳細規格'),el('dd',null,'請見官網商品說明'));
    $('customizeNote').textContent=p.customizeNote;
    const description=$('productDescription');description.replaceChildren();
    p.descriptionLines.forEach(line=>description.append(el('p',null,line)));
    (p.descriptionImages||[]).forEach((src,i)=>{const im=imageNode(src,'官網款式說明圖 '+(i+1),'spec-graphic');im.width=1000;im.height=1200;description.append(im);});
    const details=description.closest('details');if(details){details.open=false;details.hidden=!description.childNodes.length;}

    $('saveProduct').dataset.save=p.slug;updateSave($('saveProduct'),p.slug);
    const thumbs=$('imageThumbs');thumbs.replaceChildren();
    p.images.forEach((im,i)=>{const b=el('button','image-thumb');b.type='button';b.dataset.imageId=im.id;b.setAttribute('aria-label','查看第 '+(i+1)+' 張官網照片');b.append(imageNode(im.thumb||im.src,''));b.onclick=()=>setImage(im,'官網系列照片 '+(i+1)+' / '+p.images.length+'；所選搭配：'+state.variant.title);thumbs.append(b);});
    renderVariant();const dialog=$('productDialog');if(!dialog.open){dialog.showModal();document.body.classList.add('dialog-open');}$('closeProduct').focus({preventScroll:true});dialog.scrollTop=0;
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
      const response=await fetch('assets/catalog-data.json?v=20260907');if(!response.ok)throw new Error('Catalog load');state.data=validate(await response.json());
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
  $('copyProduct').onclick=async()=>{
    if(!state.product)return;const p=state.product,v=state.variant;
    const message=['ICHco 錶款詢問',p.title,'搭配：'+v.title,'官網標示售價：'+money(v.price),'資料核對：'+state.data.checkedDate,p.officialUrl,'我的選擇：'+location.href].join('\n');
    try {await navigator.clipboard.writeText(message);$('copyStatus').textContent='已複製款式與價格，可貼給客服確認。';}
    catch {const area=el('textarea');area.value=message;area.setAttribute('aria-label','可複製的錶款資料');area.style.cssText='width:100%;min-height:180px';$('copyStatus').replaceChildren(el('p',null,'請選取下方文字複製：'),area);area.focus();area.select();}
  };
  $('retryLoad').onclick=load;window.addEventListener('popstate',syncLocation);load();
})();
