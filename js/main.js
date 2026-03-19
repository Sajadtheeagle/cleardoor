/* CLEARDOOR — MAIN
   Page Nav · Drawer · Dropdown · FAQ · Init (load LAST)
================================================================ */

// ══ PAGE NAV ══
function showPage(id){
  // Redirect legacy page IDs to unified calculator tabs
  if(id==='saving'){showCalcTab('savings');return;}
  if(id==='compare'){showCalcTab('rvb');return;}
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nl,.di').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(ni=>ni.classList.remove('active'));
  var pg = document.getElementById('page-'+id);
  if(pg) pg.classList.add('active');
  // Highlight matching nav items
  document.querySelectorAll('.nl,.di').forEach(b=>{ if(b.getAttribute('onclick')?.includes("'"+id+"'")) b.classList.add('active'); });
  // Highlight parent nav-item dropdown if child page is active
  document.querySelectorAll('.nav-item[data-pages]').forEach(ni=>{
    var pages = ni.getAttribute('data-pages').split(',');
    if(pages.includes(id)){ ni.querySelector('.nl')?.classList.add('active'); }
  });
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='calculator'){calcMortgageMain();calcAffordability();calcCMHC();calcLTT();}
  if(id==='rates'){initRates();}
  if(id==='home'){setTimeout(initHomeStats,100);}
  if(id==='listings')renderListings();
  if(id==='glossary')renderGlossary();
  if(id==='blog'){blogInit();}
  if(id==='newconstruction')renderNC();
  if(id==='ottawaplan'){setTimeout(()=>{initOPMap();},100);}
  if(id==='rss-admin'){rssAdminInit();}
  if(id==='dashboard'){if(typeof dashCheckAuth==='function')dashCheckAuth();}
  closeDrawer();
  // Analytics: update current page and fire pageview
  if(typeof cdSetPage==='function') cdSetPage(id);
  if(typeof cdTrack==='function') cdTrack('pageview',{page:id});
  if(typeof seoUpdate!=='undefined') seoUpdate(id);
}
// Open calculator with a specific tab active
function showCalcTab(tab){
  showPage('calculator');
  var btn=document.querySelector('.tabbtn[data-tab="'+tab+'"]');
  showCalc(tab,btn);
}
// ══ DRAWER ══
function openDrawer(){ document.getElementById('drawer').classList.add('open'); document.getElementById('doverlay').classList.add('open'); }
function closeDrawer(){ document.getElementById('drawer').classList.remove('open'); document.getElementById('doverlay').classList.remove('open'); }
// ══ DROPDOWN HOVER FIX ══
(function(){
  var timers={};
  document.querySelectorAll('.nav-item').forEach(function(ni,i){
    if(!ni.querySelector('.dropdown')) return;
    ni.addEventListener('mouseenter',function(){
      clearTimeout(timers[i]);
      document.querySelectorAll('.nav-item').forEach(function(x){x.classList.remove('dd-open');});
      ni.classList.add('dd-open');
    });
    ni.addEventListener('mouseleave',function(){
      timers[i]=setTimeout(function(){ ni.classList.remove('dd-open'); },200);
    });
  });
  // Close dropdowns when clicking outside
  document.addEventListener('click',function(e){
    if(!e.target.closest('.nav-item')) document.querySelectorAll('.nav-item').forEach(function(x){x.classList.remove('dd-open');});
  });
})();

// ══ NEWSLETTER ══
function insNewsletter(page){
  var inp=document.getElementById(page+'-nl-email');
  if(!inp||!inp.value.includes('@')){if(inp)inp.style.borderColor='#ef4444';return;}
  if(typeof dashSaveSubscriber==='function')dashSaveSubscriber(inp.value.trim(),'home-'+page);
  var strip=inp.closest('.nl-cta-strip');
  if(strip)strip.innerHTML='<div style="color:var(--green);font-weight:700;padding:.8rem 0">✓ You\'re subscribed! Watch your inbox 📬</div>';
}
// ══ FAQ ══
function toggleFAQ(el){ el.classList.toggle('open'); }
// ══ HOME STATS — auto-populate from live data ══
function initHomeStats() {
  // Pull best rates from RATES_LENDERS array (rates.js)
  if (typeof RATES_LENDERS !== 'undefined' && RATES_LENDERS.length) {
    // 5yr fixed insured: nested as fixed['5'].ins
    var fixedInsured = RATES_LENDERS.filter(function(l){ return l.fixed && l.fixed['5'] && l.fixed['5'].ins > 0; });
    fixedInsured.sort(function(a,b){ return a.fixed['5'].ins - b.fixed['5'].ins; });
    // 5yr variable insured: prime + variable['5'].ins offset
    var prime = (typeof RATES_META !== 'undefined' && RATES_META.prime) ? RATES_META.prime : 4.95;
    var varInsured = RATES_LENDERS.filter(function(l){ return l.variable && l.variable['5'] && typeof l.variable['5'].ins === 'number'; });
    varInsured.sort(function(a,b){ return a.variable['5'].ins - b.variable['5'].ins; });
    if (fixedInsured.length) {
      var bestFixed = fixedInsured[0].fixed['5'].ins.toFixed(2) + '%';
      ['h-best-rate','h-stat-rate'].forEach(function(id){
        var el = document.getElementById(id); if (el) el.textContent = bestFixed;
      });
      // Update first glassmorphism tile
      var tiles = document.querySelectorAll('.hgt-val');
      if (tiles[0]) tiles[0].textContent = bestFixed;
      // Update snapshot rates panel
      var ratesList = document.getElementById('home-rates-preview');
      if (ratesList) {
        ratesList.innerHTML = fixedInsured.slice(0,3).map(function(l,i){
          return '<div class="snap-rate-row">' +
            '<div class="snap-rate-lender">' + l.name + '</div>' +
            '<div class="snap-rate-type">5yr Fixed &middot; Insured</div>' +
            '<div class="snap-rate-num' + (i===0?' best':'') + '">' + l.fixed['5'].ins.toFixed(2) + '%</div>' +
          '</div>';
        }).join('');
      }
    }
    if (varInsured.length) {
      var bestVarRate = (prime + varInsured[0].variable['5'].ins).toFixed(2) + '%';
      var bv = document.getElementById('h-best-var'); if (bv) bv.textContent = bestVarRate;
    }
  }
  // Pull latest news headlines from cache
  var newsPreview = document.getElementById('home-news-preview');
  if (newsPreview) {
    try {
      var nc = JSON.parse(localStorage.getItem('cd_news_cache') || localStorage.getItem('cd_news_v2') || 'null');
      var items = nc && nc.items ? nc.items : (Array.isArray(nc) ? nc : null);
      if (items && items.length) {
        newsPreview.innerHTML = items.slice(0,4).map(function(item) {
          var src = item._publisher || item._src || '';
          return '<div class="snap-news-item">' +
            (src ? '<div class="snap-news-source">' + src + '</div>' : '') +
            '<div>' + (item.title || '') + '</div>' +
          '</div>';
        }).join('');
      }
    } catch(e) {}
  }
}
// ══ INIT ══
calcMortgageMain();calcSave();calcRvB();renderGlossary();renderListings();renderNC();initHomeStats();
// Navigate to ?p= page on direct load (e.g. shared links, Google clicks)
(function(){
  try {
    var p = new URLSearchParams(window.location.search).get('p')
         || (window.location.hash ? window.location.hash.replace('#','') : null);
    if (p && p !== 'home') showPage(p);
  } catch(e) {}
})();