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
// ══ INIT ══
calcMortgageMain();calcSave();calcRvB();renderGlossary();renderListings();renderNC();