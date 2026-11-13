/**
 * Interactive Background Canvas
 * Floating Microsoft Excel, Word, PowerPoint & Tally animations
 * Combined with high-performance constellation particles
 */

(function () {
  try {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let particles = [];
    let softwareElements = [];
    let snowflakes = [];
    let orbs = [];
    let mouse = { x: -1000, y: -1000, radius: 140 };
    let animationFrameId;
    let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Software icon badges configuration
    const SOFTWARE_ITEMS = [
      { name: 'Excel', symbol: 'XLS', sub: '=VLOOKUP()', color: 'rgba(34, 197, 94, ', glow: '#22c55e', bg: 'rgba(20, 83, 45, 0.55)' },
      { name: 'Word', symbol: 'DOC', sub: 'Audit Memos', color: 'rgba(59, 130, 246, ', glow: '#3b82f6', bg: 'rgba(30, 58, 138, 0.55)' },
      { name: 'PowerPoint', symbol: 'PPT', sub: 'Finance Decks', color: 'rgba(249, 115, 22, ', glow: '#f97316', bg: 'rgba(124, 45, 18, 0.55)' },
      { name: 'Tally ERP', symbol: 'TALLY', sub: 'Ledger Audit', color: 'rgba(245, 158, 11, ', glow: '#f59e0b', bg: 'rgba(120, 53, 15, 0.55)' },
      { name: 'Excel Formulas', symbol: 'fx', sub: '=SUMIFS()', color: 'rgba(16, 185, 129, ', glow: '#10b981', bg: 'rgba(6, 78, 59, 0.55)' },
      { name: 'Excel Pivot', symbol: 'PIVOT', sub: 'Reconciled ✓', color: 'rgba(52, 211, 153, ', glow: '#34d399', bg: 'rgba(6, 95, 70, 0.55)' },
      { name: 'Excel XLOOKUP', symbol: 'XLS', sub: '=XLOOKUP()', color: 'rgba(34, 197, 94, ', glow: '#22c55e', bg: 'rgba(20, 83, 45, 0.55)' },
      { name: 'MS Office 365', symbol: '365', sub: 'Finance Suite', color: 'rgba(168, 85, 247, ', glow: '#a855f7', bg: 'rgba(88, 28, 135, 0.55)' },
      { name: 'PowerPoint Slides', symbol: 'PPT', sub: 'P&L Visuals 📈', color: 'rgba(251, 146, 60, ', glow: '#fb923c', bg: 'rgba(154, 52, 18, 0.55)' },
      { name: 'Word Report', symbol: 'DOC', sub: 'SOP & Policies', color: 'rgba(96, 165, 250, ', glow: '#60a5fa', bg: 'rgba(29, 78, 216, 0.55)' },
      { name: 'Tally Vouchers', symbol: 'TALLY', sub: 'Dr / Cr Books', color: 'rgba(251, 191, 36, ', glow: '#fbbf24', bg: 'rgba(146, 64, 14, 0.55)' },
      { name: 'Excel Logic', symbol: 'IF', sub: 'Variance Check', color: 'rgba(16, 185, 129, ', glow: '#10b981', bg: 'rgba(6, 78, 59, 0.55)' }
    ];

    class SoftwareFloatingBadge {
      constructor(data, index) {
        this.data = data;
        this.index = index;
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * (width || window.innerWidth || 1200);
        this.y = init ? Math.random() * (height || window.innerHeight || 800) : (height || 800) + 40;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = -(Math.random() * 0.38 + 0.18); // float upward slowly
        this.width = 100;
        this.height = 38;
        this.alpha = Math.random() * 0.35 + 0.4;
        this.angle = (Math.random() - 0.5) * 0.15;
        this.rotationSpeed = (Math.random() - 0.5) * 0.002;
        this.floatPhase = Math.random() * Math.PI * 2;
      }

      update() {
        if (isReducedMotion) return;

        this.x += this.vx;
        this.y += this.vy;
        this.floatPhase += 0.02;
        this.angle += this.rotationSpeed;

        // Wrap around top
        if (this.y < -60) {
          this.reset(false);
        }
        if (this.x < -100) this.x = width + 50;
        if (this.x > width + 100) this.x = -50;

        // Mouse repelling
        const dx = mouse.x - (this.x + this.width / 2);
        const dy = mouse.y - (this.y + this.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius + 40) {
          const force = (mouse.radius + 40 - dist) / (mouse.radius + 40);
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle + Math.sin(this.floatPhase) * 0.05);

        const w = this.width;
        const h = this.height;
        const r = 8;

        // Draw rounded badge background
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, r);
        ctx.fillStyle = this.data.bg;
        ctx.fill();

        ctx.strokeStyle = `${this.data.color}${this.alpha * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Icon Pill on Left
        ctx.beginPath();
        ctx.roundRect(-w / 2 + 5, -h / 2 + 5, 28, h - 10, 5);
        ctx.fillStyle = `${this.data.color}0.25)`;
        ctx.fill();

        ctx.font = `bold 10px 'JetBrains Mono', monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.data.symbol, -w / 2 + 19, 0);

        // Subtext / Feature on Right
        ctx.font = `500 10px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = `${this.data.color}0.9)`;
        ctx.textAlign = 'left';
        ctx.fillText(this.data.sub, -w / 2 + 38, 0);

        ctx.restore();
      }
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * (width || window.innerWidth || 1200);
        this.y = Math.random() * (height || window.innerHeight || 800);
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.5 + 0.8;
        this.baseAlpha = Math.random() * 0.3 + 0.12;
        this.alpha = this.baseAlpha;
        this.isGlyph = Math.random() > 0.75;
        const glyphs = ['₹', '%', '∑', 'fx', 'Dr', 'Cr', 'XLS', 'PPT', 'DOC'];
        this.glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        this.fontSize = Math.floor(Math.random() * 4 + 9);
        this.color = Math.random() > 0.65
          ? 'rgba(192, 132, 252, ' // Lavender
          : Math.random() > 0.4
          ? 'rgba(56, 189, 248, '  // Cyan / Sky
          : Math.random() > 0.2
          ? 'rgba(34, 197, 94, '   // Excel Green
          : 'rgba(251, 191, 36, '; // Gold
      }

      update() {
        if (isReducedMotion) return;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.2;
          this.y -= Math.sin(angle) * force * 1.2;
        }
      }

      draw() {
        if (this.isGlyph) {
          ctx.font = `${this.fontSize}px 'Outfit', sans-serif`;
          ctx.fillStyle = `${this.color}${this.alpha * 0.75})`;
          ctx.fillText(this.glyph, this.x, this.y);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${this.color}${this.alpha})`;
          ctx.fill();
        }
      }
    }

    class GlowingOrb {
      constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.baseRadius = radius;
        this.radius = radius;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = (Math.random() * 0.003) + 0.002;
      }

      update() {
        if (isReducedMotion) return;
        this.angle += this.speed;
        this.radius = this.baseRadius + Math.sin(this.angle) * 35;
      }

      draw() {
        try {
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, Math.max(1, this.radius)
          );
          gradient.addColorStop(0, this.color);
          gradient.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(this.x, this.y, Math.max(1, this.radius), 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        } catch (_) {}
      }
    }

    class Snowflake {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * (width || window.innerWidth || 1200);
        this.y = init ? Math.random() * (height || window.innerHeight || 800) : -12;
        this.radius = Math.random() * 1.6 + 0.8; // Small delicate snowflake (0.8px to 2.4px)
        this.vy = Math.random() * 0.65 + 0.35;   // Gentle downward drift
        this.vx = (Math.random() - 0.5) * 0.25;  // Subtle horizontal breeze
        this.alpha = Math.random() * 0.45 + 0.35; // Soft translucent white
        this.swaySpeed = Math.random() * 0.02 + 0.008;
        this.swayDist = Math.random() * 1.1 + 0.5;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        if (isReducedMotion) return;

        this.phase += this.swaySpeed;
        this.x += this.vx + Math.sin(this.phase) * this.swayDist * 0.4;
        this.y += this.vy;

        // Wrap around bottom
        if (this.y > (height || 800) + 12) {
          this.reset(false);
        }
        // Wrap horizontally
        if (this.x < -12) this.x = (width || 1200) + 12;
        if (this.x > (width || 1200) + 12) this.x = -12;

        // Subtle mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) {
          const force = (70 - dist) / 70;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.3;
          this.y -= Math.sin(angle) * force * 1.3;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    function resize() {
      width = canvas.width = window.innerWidth || document.documentElement.clientWidth || 1200;
      height = canvas.height = window.innerHeight || document.documentElement.clientHeight || 800;

      initElements();
    }

    function initElements() {
      particles = [];
      const particleCount = width < 768 ? 26 : 55;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      softwareElements = [];
      const badgeCount = width < 768 ? 6 : 14;
      for (let i = 0; i < badgeCount; i++) {
        softwareElements.push(new SoftwareFloatingBadge(SOFTWARE_ITEMS[i % SOFTWARE_ITEMS.length], i));
      }

      snowflakes = [];
      const snowCount = width < 768 ? 40 : 85;
      for (let i = 0; i < snowCount; i++) {
        snowflakes.push(new Snowflake());
      }

      orbs = [
        new GlowingOrb(width * 0.15, height * 0.2, 240, 'rgba(34, 197, 94, 0.10)'), // Excel Green Orb
        new GlowingOrb(width * 0.85, height * 0.28, 260, 'rgba(59, 130, 246, 0.10)'), // Word Blue Orb
        new GlowingOrb(width * 0.75, height * 0.75, 250, 'rgba(249, 115, 22, 0.08)'), // PowerPoint Orange Orb
        new GlowingOrb(width * 0.22, height * 0.82, 270, 'rgba(245, 158, 11, 0.08)'), // Tally Gold Orb
        new GlowingOrb(width * 0.5, height * 0.5, 280, 'rgba(168, 85, 247, 0.09)')   // Royal Purple Center Orb
      ];
    }

    function drawConstellation() {
      const connectDist = 95;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Ambient Orbs
      for (let i = 0; i < orbs.length; i++) {
        orbs[i].update();
        orbs[i].draw();
      }

      // Gentle Snow Falling across Entire Background
      for (let i = 0; i < snowflakes.length; i++) {
        snowflakes[i].update();
        snowflakes[i].draw();
      }

      // Constellation Lines
      drawConstellation();

      // Floating Software Badges (Excel, Word, PowerPoint, Tally)
      for (let i = 0; i < softwareElements.length; i++) {
        softwareElements[i].update();
        softwareElements[i].draw();
      }

      // Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    });

    resize();
    render();
  } catch (err) {
    console.error('Canvas background error:', err);
  }
})();
