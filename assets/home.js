(() => {
  'use strict';
  const story = document.getElementById('craftStory');
  const stage = document.getElementById('craftStage');
  const watch = document.getElementById('craftWatch');
  const button = document.getElementById('craftToggle');
  const hint = document.getElementById('craftHint');
  const images = [...watch.querySelectorAll('.craft-layer')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let media;
  const fallback = message => {
    media?.revert();
    document.body.classList.add('craft-static');
    story.classList.remove('is-animated');
    button.disabled = true;
    hint.textContent = message;
  };
  if (!window.gsap || !window.ScrollTrigger) {
    fallback('觀看模型外型示意');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const loadLayer = image => new Promise(resolve => {
    if (image.dataset.loaded === 'true') return resolve(true);
    image.onload = () => { image.dataset.loaded = 'true'; resolve(true); };
    image.onerror = () => resolve(false);
    image.src = image.dataset.src;
  });
  let request = 0;
  async function setup() {
    const token = ++request;
    media?.revert();
    story.classList.remove('is-animated');
    if (reduce.matches) { fallback('完整模型・靜態展示'); return; }
    const loaded = await Promise.all(images.map(loadLayer));
    if (token !== request) return;
    if (loaded.some(ok => !ok)) { fallback('分層圖片暫時無法載入，先看完整外型'); return; }
    document.body.classList.remove('craft-static');
    story.classList.add('is-animated');
    button.disabled = false;
    media = gsap.matchMedia();
    media.add({ mobile: '(max-width: 700px)', desktop: '(min-width: 701px)' }, context => {
      const size = () => watch.offsetHeight;
      const timeline = gsap.timeline({
        defaults: { duration: 1, ease: 'none' },
        scrollTrigger: {
          id: 'craft-exploded', trigger: story,
          start: 'top top',
          end: () => '+=' + (story.offsetHeight - stage.offsetHeight),
          scrub: true, invalidateOnRefresh: true,
          onUpdate: self => {
            const open = self.progress > 0.5;
            button.textContent = open ? '重新組合 ↑' : '一鍵拆解 ↓';
            button.setAttribute('aria-pressed', String(self.progress > 0.98));
            hint.textContent = self.progress < 0.08 ? '向下滑，逐層探索' : self.progress > 0.94 ? '向上滑，重新組合' : '向下滑，逐層展開';
          }
        }
      });
      timeline.fromTo(watch, { scale: 1.8, rotationX: 0, rotationZ: 0 }, { scale: 0.98, rotationX: 16, rotationZ: -5 }, 0);
      const layers = [
        ['glass', -2, 0.24, 1.25, 0],
        ['hands', -1, 0.12, 1.35, -5],
        ['dial',   0, 0,    1.15,  0],
        ['gears',  1, -0.12,1.50, 18],
        ['case',   2, -0.24,1.00,  0]
      ];
      layers.forEach(([part, y, z, scale, rotation]) => {
        timeline.fromTo(watch.querySelector('[data-part="' + part + '"]'),
          { y: 0, z: 0, scale: 1, rotation: 0 },
          { y: () => y * size() * 0.42, z: () => z * size(), scale, rotation }, 0);
      });
      timeline.fromTo('#craftProgress', { scaleX: 0 }, { scaleX: 1 }, 0);
      timeline.fromTo('.craft-legend', { opacity: 0 }, { opacity: 1, duration: 0.10 }, 0.88);
      if (context.conditions.mobile) timeline.fromTo('.craft-copy', { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.16 }, 0.025);
      button.onclick = () => {
        const trigger = timeline.scrollTrigger;
        window.scrollTo({ top: trigger.progress > 0.5 ? trigger.start : trigger.end, behavior: 'smooth' });
      };
      return () => { button.onclick = null; };
    });
    ScrollTrigger.refresh();
    ScrollTrigger.update();
  }
  reduce.addEventListener('change', setup);
  setup();
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
})();
