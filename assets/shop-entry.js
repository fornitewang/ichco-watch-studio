/* The decorative orbit sleeps outside the shopping section and in background tabs. */
(() => {
  'use strict';
  const section=document.querySelector('.shop-destination');
  if(!section||!window.IntersectionObserver)return;
  let visible=false;
  // Warm the whole horizontal row before a touch swipe exposes the next photo.
  const preload=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    section.querySelectorAll('.shop-card img').forEach(img=>{img.loading='eager';img.decode().catch(()=>{});});
    preload.disconnect();
  },{rootMargin:'500px'});
  preload.observe(section);
  const sync=()=>section.classList.toggle('is-in-view',visible&&!document.hidden);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(section);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',()=>section.classList.remove('is-in-view'));
  window.addEventListener('pageshow',sync);
})();
