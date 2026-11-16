/* Pop's Bingo - theme switch.
 * ?theme=thanksgiving (or ?theme=christmas) picks a theme and remembers it on this device.
 * No parameter and nothing stored = Christmas (the default). Voice/number logic is untouched. */
(function () {
  var theme = 'christmas';
  try {
    var q = new URLSearchParams(location.search).get('theme');
    if (q === 'thanksgiving' || q === 'christmas') {
      localStorage.setItem('popsBingoTheme', q);
    }
    theme = localStorage.getItem('popsBingoTheme') || 'christmas';
  } catch (e) {
    var m = /[?&]theme=(thanksgiving|christmas)/.exec(location.search);
    if (m) theme = m[1];
  }
  if (theme !== 'thanksgiving') return;
  document.documentElement.setAttribute('data-theme', 'thanksgiving');
  window.POPS_THEME = 'thanksgiving';
  window.POPS_EMOJI = '🦃';

  // Home-screen / tab icons and manifest (read by the browser when adding to home screen)
  function relink(rel, href, type) {
    var els = document.querySelectorAll('link[rel="' + rel + '"]');
    if (!els.length) return;
    els.forEach(function (l) { l.href = href; if (type) l.type = type; });
  }
  relink('icon', 'assets/icon-thanksgiving.svg', 'image/svg+xml');
  relink('apple-touch-icon', 'assets/apple-touch-icon-thanksgiving.png');
  relink('manifest', 'manifest-thanksgiving.json');

  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Sansita+Swashed:wght@500;700&display=swap';
  document.head.appendChild(font);

  function swap(sel, text) {
    var el = document.querySelector(sel);
    if (el) el.textContent = text;
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.title = document.title.indexOf('Card') > -1 ? '🦃 Your Bingo Card' : "Pop's Thanksgiving Bingo";
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute('content', '#2a160a');
    // caller page
    swap('.logo__icon', '🦃');
    swap('.logo__subtitle', 'Thanksgiving Bingo');
    swap('#nextBtn .btn__icon', '🍂');
    var cl = document.getElementById('currentLetter');
    if (cl && cl.textContent === '🎄') cl.textContent = '🦃';
    document.querySelectorAll('.story-footer__hint').forEach(function (e) {
      e.textContent = '🦃 Happy Thanksgiving from the DeMarco family 🦃';
    });
    // card page
    var h1 = document.querySelector('.card-header h1');
    if (h1) h1.textContent = '🦃 Your Bingo Card 🦃';
    swap('#storyLink', "Pop's Thanksgiving Bingo");
    // QR code on caller page carries the theme to players' phones
    var qr = document.querySelector('.qr-code img');
    if (qr) {
      // point at the page actually being served (preview channel etc.); keep production URL on localhost
      var base = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'https://pops-bingo.web.app' : location.origin;
      qr.src = qr.src.replace(/data=[^&]*/, 'data=' + encodeURIComponent(base + '/card.html?theme=thanksgiving'))
        .replace('bgcolor=0d1f0d', 'bgcolor=2a160a').replace('color=ffd700', 'color=f4b13a');
    }
  });
})();
