/* ===================================
   SOLARICUS — JavaScript v2
   Nav-Scroll, Reveal, Counter, FAQ, Sticky CTA
   =================================== */

/* --- Navigation: Shrink bei Scroll --- */
(function() {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  var scrolled = false;
  function checkScroll() {
    var shouldShrink = window.scrollY > 60;
    if (shouldShrink !== scrolled) {
      scrolled = shouldShrink;
      nav.classList.toggle('is-scrolled', scrolled);
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
})();

/* --- Scroll-Reveal mit IntersectionObserver --- */
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });
})();

/* --- Counter-Animation --- */
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Sofort Endwert anzeigen
    document.querySelectorAll('[data-ziel]').forEach(function(el) {
      var ziel = parseInt(el.dataset.ziel, 10);
      var suffix = el.dataset.suffix || '+';
      el.textContent = ziel + suffix;
    });
    return;
  }

  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var ziel = parseInt(el.dataset.ziel, 10);
      var suffix = el.dataset.suffix || '+';
      var start = null;
      var dauer = 2000;

      function animate(time) {
        if (!start) start = time;
        var p = Math.min((time - start) / dauer, 1);
        // Ease-out cubic
        var wert = Math.floor(ziel * (1 - Math.pow(1 - p, 3)));
        el.textContent = wert + (p < 1 ? '' : suffix);
        if (p < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-ziel]').forEach(function(c) {
    counterObserver.observe(c);
  });
})();

/* --- FAQ Accordion --- */
(function() {
  var items = document.querySelectorAll('.faq__item');
  items.forEach(function(item) {
    var btn = item.querySelector('.faq__frage');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var isOpen = item.classList.contains('is-open');
      // Alle anderen schliessen
      items.forEach(function(other) {
        other.classList.remove('is-open');
        var otherBtn = other.querySelector('.faq__frage');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      // Aktuelles oeffnen (wenn vorher geschlossen)
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* --- Stepper-Animation --- */
(function() {
  var stepper = document.querySelector('.prozess__stepper');
  if (!stepper) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stepper.classList.add('is-visible');
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        stepper.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(stepper);
})();

/* --- Sticky Mobile CTA Bar --- */
(function() {
  var stickyCta = document.querySelector('.sticky-cta');
  if (!stickyCta) return;

  var shown = false;
  function checkSticky() {
    var shouldShow = window.scrollY > 400;
    if (shouldShow !== shown) {
      shown = shouldShow;
      stickyCta.classList.toggle('is-visible', shown);
    }
  }

  window.addEventListener('scroll', checkSticky, { passive: true });
  checkSticky();
})();

/* --- Smooth Scroll fuer Anker-Links --- */
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var offset = 100; // Nav + Banner Hoehe
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* --- Einzugsgebiet: Staedte radial platzieren (JS) --- */
(function() {
  var geoMap = document.getElementById('geoMap');
  var geoLines = document.getElementById('geoLines');
  if (!geoMap || !geoLines) return;

  /* Echte Himmelsrichtungen ab Kirchhain (angle: 0=rechts/Ost, -90=Nord, 90=Sued, 180=West)
     dist: Prozent vom Zentrum (50/50) */
  var cities = [
    { name: 'Amöneburg',      angle: 160,  dist: 22 },
    { name: 'Rauschenberg',   angle: -60,  dist: 25 },
    { name: 'Wohratal',       angle: -100, dist: 22 },
    { name: 'Neustadt',       angle: 20,   dist: 28 },
    { name: 'Cölbe',          angle: -150, dist: 26 },
    { name: 'Lahntal',        angle: -170, dist: 30 },
    { name: 'Stadtallendorf', angle: -30,  dist: 36 },
    { name: 'Marburg',        angle: -155, dist: 40 },
    { name: 'Wetter',         angle: 170,  dist: 42 },
    { name: 'Schwalmstadt',   angle: -75,  dist: 44 },
    { name: 'Alsfeld',        angle: 35,   dist: 46 }
  ];

  var centerX = 50;
  var centerY = 50;

  cities.forEach(function(city, i) {
    var rad = (city.angle * Math.PI) / 180;
    var x = centerX + Math.cos(rad) * city.dist;
    var y = centerY + Math.sin(rad) * city.dist;

    // Stadt-Element erstellen
    var el = document.createElement('div');
    el.className = 'geo-city';
    el.style.left = x + '%';
    el.style.top = y + '%';
    el.style.transitionDelay = (i * 0.12) + 's';
    el.innerHTML = '<div class="geo-city-dot"></div><div class="geo-city-name">' + city.name + '</div>';
    geoMap.appendChild(el);

    // SVG-Verbindungslinie
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', centerX + '%');
    line.setAttribute('y1', centerY + '%');
    line.setAttribute('x2', x + '%');
    line.setAttribute('y2', y + '%');
    geoLines.appendChild(line);
  });

  // Bei Scroll einblenden
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var geoObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var geoCities = entry.target.querySelectorAll('.geo-city');
        if (reducedMotion) {
          geoCities.forEach(function(c) { c.classList.add('visible'); });
        } else {
          geoCities.forEach(function(c) { c.classList.add('visible'); });
        }
        geoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  geoObserver.observe(geoMap);
})();

/* --- Problem/Solution Toggle --- */
(function() {
  var section = document.querySelector('.ps-section');
  var toggle = document.querySelector('.ps-toggle');
  var labelProblems = document.querySelector('.ps-label-problems');
  var labelSolutions = document.querySelector('.ps-label-solutions');

  if (!section || !toggle || !labelProblems || !labelSolutions) return;

  function toggleState(forceState) {
    if (typeof forceState === 'boolean') {
      if (forceState) section.classList.add('is-solution');
      else section.classList.remove('is-solution');
    } else {
      section.classList.toggle('is-solution');
    }
    var isSolution = section.classList.contains('is-solution');
    labelProblems.classList.toggle('ps-label-active', !isSolution);
    labelSolutions.classList.toggle('ps-label-active', isSolution);
  }

  toggle.addEventListener('click', function() { toggleState(); });
  labelProblems.addEventListener('click', function() { toggleState(false); });
  labelSolutions.addEventListener('click', function() { toggleState(true); });
})();
