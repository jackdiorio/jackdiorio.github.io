/* ==========================================================================
   Jack D'Iorio — Portfolio Scripts
     1. Ambient network-graph animation (hero background)
     2. Scroll-reveal on section entry
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Ambient network-graph animation
   -------------------------------------------------------------------------- */
(function initNetworkAnimation() {
  const canvas = document.getElementById('net');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CONFIG = {
    minNodes: 18,
    nodeSpacing: 90,     // fewer/more nodes as hero width changes
    maxLinkDistance: 170,
    nodeSpeed: 0.25,
    nodeColor: 'rgba(177, 80, 47, 0.55)',   // --rust
    linkColor: '107, 112, 80',              // --olive (rgb components)
    linkOpacity: 0.35,
  };

  let width, height, nodes = [];

  function resize() {
    const hero = document.querySelector('.hero');
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function createNodes() {
    const count = Math.max(CONFIG.minNodes, Math.floor(width / CONFIG.nodeSpacing));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.nodeSpeed,
      vy: (Math.random() - 0.5) * CONFIG.nodeSpeed,
      r: Math.random() * 1.6 + 1.2,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      if (!prefersReduced) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;
      }

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxLinkDistance) {
          const opacity = (1 - dist / CONFIG.maxLinkDistance) * CONFIG.linkOpacity;
          ctx.strokeStyle = `rgba(${CONFIG.linkColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      ctx.fillStyle = CONFIG.nodeColor;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReduced) requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });

  resize();
  createNodes();
  step();
})();


/* --------------------------------------------------------------------------
   2. Scroll-reveal on section entry
   -------------------------------------------------------------------------- */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => observer.observe(el));
})();
