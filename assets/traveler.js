/* ICH 小旅人：只接管人物本身的 Pointer Events，商品與頁面仍可正常點選／捲動。 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('traveler');
  if (!root) return;
  const actor = $('travelerActor'), grab = $('travelerGrab'), art = $('travelerArt');
  const menu = $('travelerMenu'), panel = $('travelerPanel'), hint = $('travelerHint');
  const pauseButton = $('travelerPause'), hideButton = $('travelerHide');
  const destination = panel.querySelector('a');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('ich-traveler') || '{}') || {}; } catch (_) {}
  let lastReduced = reduced.matches;
  let paused = !!saved.paused, concealed = !!saved.hidden, ready = false;
  let x = 0, y = 0, vx = 0, vy = 0, facing = 1, angle = 0;
  let bounds = {}, pointer = null, tap = null, thrown = false, hovering = false;
  let navigationUntil = 0, recoveryUntil = 0, greetingUntil = 0, recoveryTimer = 0;
  let suspended = false, frame = 0, lastFrame = 0, restUntil = 0, hintTimer = 0, suppressUntil = 0;
  const persist = () => { try { sessionStorage.setItem('ich-traveler', JSON.stringify({paused, hidden:concealed})); } catch (_) {} };
  const isStill = () => paused || reduced.matches || hovering || grab.matches(':focus-visible') || !panel.hidden;
  function state(value) {
    const now = performance.now();
    if (!pointer && value !== 'thrown' && !paused && !reduced.matches && !suspended) {
      if (now < recoveryUntil) value = 'landing';
      else if (now < greetingUntil) value = 'greeting';
    }
    if (actor.dataset.state !== value) actor.dataset.state = value;
    actor.dataset.face = ({held:'surprised',dragging:'effort',thrown:'air',landing:'landing',greeting:'wink'})[value] || 'calm';
  }
  function publish() {
    if (!ready) return;
    dispatchEvent(new CustomEvent('ich:traveler', {detail:{
      x,y,facing,width:bounds.width,height:actor.offsetHeight,state:actor.dataset.state,
      minX:bounds.minX,maxX:bounds.viewportWidth-10,minY:bounds.minY,
      bottom:bounds.maxY+actor.offsetHeight,paused:paused||reduced.matches,
      hidden:concealed||suspended,reduced:reduced.matches
    }}));
  }
  function recover() {
    recoveryUntil = performance.now() + 650;
    clearTimeout(recoveryTimer); recoveryTimer = setTimeout(wake, 680);
  }
  function paint() {
    actor.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) rotate(' + angle.toFixed(2) + 'deg)';
    art.style.setProperty('--facing', facing);
    art.style.setProperty('--case-sway', (pointer ? -angle*facing*.7 : thrown ? clamp(-vx*facing*.009,-11,11) : 0) + 'deg');
    hint.style.left = clamp(bounds.width / 2, 90 - x, bounds.viewportWidth - x - 90) + 'px';
    publish();
  }
  function measure(initial = false) {
    const viewport = window.visualViewport;
    const width = viewport ? viewport.width : innerWidth;
    const height = viewport ? viewport.height : innerHeight;
    const top = viewport ? viewport.offsetTop : 0;
    const left = viewport ? viewport.offsetLeft : 0;
    // offsetWidth/Height 不含拖曳旋轉，避免 resize 時碰撞框變形。
    const actorWidth = actor.offsetWidth, actorHeight = actor.offsetHeight;
    const header = document.querySelector('.site-header');
    const ceiling = Math.max(top + 8, (header ? header.getBoundingClientRect().bottom : 0) + 5);
    bounds = {minX:left + 10, maxX:Math.max(left + 10, left + width - actorWidth - 10),
      minY:ceiling, maxY:Math.max(ceiling, top + height - actorHeight - 66), width:actorWidth, viewportWidth:left + width};
    if (initial) { x = bounds.minX + (bounds.maxX - bounds.minX) * .7; y = bounds.maxY; facing = -1; }
    x = clamp(x, bounds.minX, bounds.maxX); y = clamp(y, bounds.minY, bounds.maxY);
    paint();
  }
  function showHint(duration = 4200) {
    if (concealed || suspended) return;
    hint.hidden = false;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => { hint.hidden = true; }, duration);
  }
  function updateControls() {
    const stopped = paused || reduced.matches;
    pauseButton.textContent = reduced.matches ? '已依系統減少動態' : stopped ? '繼續走動' : '暫停走動';
    pauseButton.disabled = reduced.matches;
    pauseButton.setAttribute('aria-pressed', String(stopped));
    hideButton.textContent = concealed ? '叫出人物' : '收起人物';
    menu.innerHTML = '<span aria-hidden="true">↟</span> ' + (concealed ? '叫出小旅人' : '小旅人');
    actor.hidden = concealed;
    if (stopped) state('paused');
    publish();
  }
  function schedule() { if (!frame && ready && !suspended && !concealed) frame = requestAnimationFrame(tick); }
  function tick(time) {
    frame = 0;
    // 同步檢查動態偏好：即使 change 事件延遲，拋擲也立即停止。
    if (lastReduced !== reduced.matches) {
      lastReduced = reduced.matches; thrown = false; angle = 0; updateControls();
    }
    if (reduced.matches) { thrown = false; angle = 0; }
    const dt = Math.min(.032, (time - (lastFrame || time)) / 1000);
    lastFrame = time;
    if (suspended || concealed) return;
    if (pointer) { state(pointer.moved ? 'dragging' : 'held'); }
    else if (thrown && !paused && !reduced.matches) {
      state('thrown');
      vy += 1450 * dt; x += vx * dt; y += vy * dt;
      vx *= Math.exp(-.65 * dt); angle = clamp(vx * .016, -18, 18);
      if (x <= bounds.minX || x >= bounds.maxX) { x = clamp(x, bounds.minX, bounds.maxX); vx *= -.5; facing = vx < 0 ? -1 : 1; }
      if (y < bounds.minY) { y = bounds.minY; vy = Math.abs(vy) * .3; }
      if (y >= bounds.maxY) {
        y = bounds.maxY; vy *= -.3; vx *= .65;
        if (Math.abs(vy) < 125) { thrown = false; angle = 0; restUntil = time + 800; recover(); state('landing'); }
      }
    } else if (isStill() || time < restUntil) { state('paused'); angle = 0; }
    else {
      state('walking'); angle = 0;
      x += facing * (innerWidth <= 700 ? 22 : 31) * dt;
      if (x <= bounds.minX || x >= bounds.maxX) {
        x = clamp(x, bounds.minX, bounds.maxX); facing *= -1; restUntil = time + 450;
      }
    }
    paint();
    if (pointer || thrown || (!isStill() && !concealed)) schedule();
  }
  function wake() { lastFrame = 0; schedule(); }
  function cancelPointer() {
    if (!pointer) return;
    const id = pointer.id; pointer = null; tap = null; thrown = false; angle = 0;
    if (grab.hasPointerCapture(id)) grab.releasePointerCapture(id);
    suppressUntil = performance.now() + 600; state('paused'); paint(); wake();
  }
  function syncSuspension() {
    suspended = document.hidden || !!$('productDialog')?.open || document.body.classList.contains('dialog-open');
    root.dataset.suspended = String(suspended);
    if (suspended) { cancelPointer(); state('paused'); thrown = false; angle = 0; tap = null; hint.hidden = true; cancelAnimationFrame(frame); frame = 0; publish(); }
    else if (ready) { if (!concealed) measure(); wake(); }
  }
  function visit() {
    const now = performance.now();
    if (now < navigationUntil) return;
    navigationUntil = now + 1000;
    greetingUntil = now + 900; state('greeting'); paint(); setTimeout(wake, 950);
    tap = null; thrown = false; restUntil = performance.now() + 800;
    // 使用真實連結開新分頁，保留使用者正在看的錶款。
    destination.click();
  }
  grab.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || pointer || suspended) return;
    event.preventDefault();
    thrown = false; angle = 0; hint.hidden = true; panel.hidden = true; menu.setAttribute('aria-expanded', 'false');
    const now = performance.now();
    pointer = {id:event.pointerId, startX:event.clientX, startY:event.clientY, offsetX:event.clientX - x, offsetY:event.clientY - y, moved:false, samples:[{x:event.clientX,y:event.clientY,t:now}]};
    recoveryUntil = 0; greetingUntil = 0;
    grab.setPointerCapture(event.pointerId); state('held'); paint(); wake();
  });
  grab.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const now = performance.now();
    if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 7) { pointer.moved = true; tap = null; }
    if (!pointer.moved) return;
    x = clamp(event.clientX - pointer.offsetX, bounds.minX, bounds.maxX);
    y = clamp(event.clientY - pointer.offsetY, bounds.minY, bounds.maxY);
    const previous = pointer.samples[pointer.samples.length - 1];
    angle = clamp((event.clientX - previous.x) * .35, -12, 12);
    pointer.samples.push({x:event.clientX,y:event.clientY,t:now});
    pointer.samples = pointer.samples.filter(sample => now - sample.t < 130);
    state('dragging'); paint();
  });
  grab.addEventListener('pointerup', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const now = performance.now(), drag = pointer;
    pointer = null;
    if (grab.hasPointerCapture(event.pointerId)) grab.releasePointerCapture(event.pointerId);
    angle = 0;
    if (drag.moved) {
      tap = null; suppressUntil = now + 650;
      const sample = drag.samples.find(sample => now - sample.t <= 130);
      const elapsed = sample ? Math.max(16, now - sample.t) / 1000 : 1;
      vx = sample ? clamp((event.clientX - sample.x) / elapsed, -1250, 1250) : 0;
      vy = sample ? clamp((event.clientY - sample.y) / elapsed, -1150, 1150) : 0;
      thrown = !paused && !reduced.matches && Math.hypot(vx, vy) > 230;
      if (vx) facing = vx < 0 ? -1 : 1;
      restUntil = now + 1200;
      if (!thrown) recover();
      state(thrown ? 'thrown' : 'paused');
    } else if (now >= suppressUntil) {
      if (tap && now - tap.time < 420 && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) < 28) visit();
      else { tap = {time:now,x:event.clientX,y:event.clientY}; restUntil = now + 1600; showHint(); }
    }
    paint(); wake();
  });
  grab.addEventListener('pointercancel', cancelPointer);
  grab.addEventListener('lostpointercapture', () => { if (pointer) cancelPointer(); });
  grab.addEventListener('dblclick', event => event.preventDefault());
  grab.addEventListener('click', event => { event.preventDefault(); if (event.detail === 0 && performance.now() >= suppressUntil) visit(); });
  grab.addEventListener('dragstart', event => event.preventDefault());
  grab.addEventListener('contextmenu', event => event.preventDefault());
  grab.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; wake(); } });
  grab.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovering = false; wake(); } });
  root.addEventListener('focusin', wake);
  root.addEventListener('focusout', () => setTimeout(wake, 0));
  root.addEventListener('keydown', event => {
    if (event.target === grab && event.repeat && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); return; }
    if (event.key === 'Escape') { cancelPointer(); panel.hidden = true; menu.setAttribute('aria-expanded', 'false'); hint.hidden = true; wake(); }
    if (event.target !== grab || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault(); thrown = false;
    x = clamp(x + (event.key === 'ArrowLeft' ? -20 : event.key === 'ArrowRight' ? 20 : 0), bounds.minX, bounds.maxX);
    y = clamp(y + (event.key === 'ArrowUp' ? -20 : event.key === 'ArrowDown' ? 20 : 0), bounds.minY, bounds.maxY);
    paint();
  });
  menu.addEventListener('click', () => {
    if (concealed) { concealed = false; persist(); updateControls(); measure(); showHint(); wake(); return; }
    panel.hidden = !panel.hidden; menu.setAttribute('aria-expanded', String(!panel.hidden)); hint.hidden = true; wake();
  });
  pauseButton.addEventListener('click', () => { paused = !paused; thrown = false; angle = 0; if (!paused) { panel.hidden = true; menu.setAttribute('aria-expanded', 'false'); } persist(); updateControls(); paint(); wake(); });
  hideButton.addEventListener('click', () => {
    concealed = !concealed; thrown = false; cancelPointer(); panel.hidden = true; menu.setAttribute('aria-expanded', 'false');
    persist(); updateControls(); menu.focus({preventScroll:true}); wake();
  });
  document.addEventListener('pointerdown', event => {
    if (!grab.contains(event.target)) tap = null;
    if (!root.contains(event.target)) { panel.hidden = true; menu.setAttribute('aria-expanded', 'false'); hint.hidden = true; wake(); }
  });
  document.addEventListener('visibilitychange', syncSuspension);
  new MutationObserver(syncSuspension).observe(document.body, {attributes:true,attributeFilter:['class']});
  if ($('productDialog')) new MutationObserver(syncSuspension).observe($('productDialog'), {attributes:true,attributeFilter:['open']});
  addEventListener('resize', () => { if (ready && !concealed) { measure(); wake(); } });
  window.visualViewport?.addEventListener('resize', () => { if (ready && !concealed) { measure(); wake(); } });
  reduced.addEventListener('change', () => { lastReduced = reduced.matches; thrown = false; angle = 0; updateControls(); wake(); });
  addEventListener('ich:companion-pet', () => {
    if (pointer || thrown || concealed || suspended || paused || reduced.matches) return;
    greetingUntil = performance.now()+1100; state('greeting'); paint(); wake(); setTimeout(wake,1150);
  });
  addEventListener('ich:companion-ready', publish);
  // 自有 SVG 同源載入，保留向量子部件，讓腿、手臂、輪子分別活動。
  fetch('assets/traveler-cel.svg?v=20260907b').then(response => {
    if (!response.ok) throw new Error('Traveler artwork unavailable');
    return response.text();
  }).then(source => {
    const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
    if (svg.localName !== 'svg') throw new Error('Invalid traveler artwork');
    art.append(document.importNode(svg, true));
    root.hidden = false; ready = true; updateControls();
    actor.hidden = false; measure(true); actor.hidden = concealed;
    syncSuspension(); showHint(5500);
  }).catch(() => { root.hidden = true; });
})();
