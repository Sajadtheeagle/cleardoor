/* CLEARDOOR — NEW CONSTRUCTION
   Projects data · render · compare · modal
================================================================ */
// ══ TRIDEL LIVE FEED FROM N8N ══
// Add this at the TOP of your existing new-construction.js file
// It fetches live listings and merges them into your existing ncData array

const TRIDEL_WEBHOOK = 'https://sajadbahramian.app.n8n.cloud/webhook/tridel-listings';

async function loadTridelFromN8N() {
  try {
    const res = await fetch(TRIDEL_WEBHOOK);
    if (!res.ok) throw new Error('Network response was not ok');
    const listings = await res.json();

    // Convert n8n data to match your existing ncData object format
    const tridelProjects = listings.map((l, i) => ({
      id: 'tridel-' + i,
      name: l.name || 'Unnamed',
      builder: 'Tridel',
      city: mapTridelCity(l.location),        // maps neighbourhood → city
      neighbourhood: l.location || '',
      type: 'Condo',
      status: mapTridelStatus(l.status),      // maps to your 'pre' / 'ready'
      statusLabel: l.status || '',
      price: parseTridelPrice(l.price),       // converts "$1,099,000" → 1099000
      priceLabel: l.price || 'Price TBD',
      occupancy: l.occupancy || '',
      img: l.imgSrc || '',
      imgAlt: l.imgAlt || l.name,
      url: l.url || '#',
      desc: `${l.name} by Tridel — ${l.location}. ${l.status}.`,
      features: [],
      beds: null,
      baths: null,
    }));

    // Merge into your existing ncData array (avoids duplicates by id)
    const existingIds = new Set((window.ncData || []).map(p => p.id));
    const newItems = tridelProjects.filter(p => !existingIds.has(p.id));
    window.ncData = [...newItems, ...(window.ncData || [])];

    // Re-render the grid if the page is already showing
    if (typeof renderNC === 'function') renderNC();

  } catch (err) {
    console.warn('Tridel feed unavailable, using static data only.', err);
  }
}

// ── Helpers ──────────────────────────────────────────

function mapTridelCity(location) {
  if (!location) return 'Toronto';
  const l = location.toLowerCase();
  if (l.includes('north york') || l.includes('finch') || l.includes('yonge'))
    return 'North York';
  if (l.includes('etobicoke') || l.includes('islington') || l.includes('kingsway') ||
      l.includes('royal york') || l.includes('dundas'))
    return 'Etobicoke';
  if (l.includes('mississauga') || l.includes('lakeshore') || l.includes('lakeview'))
    return 'Mississauga';
  if (l.includes('thornhill') || l.includes('bayview') || l.includes('royal orchard'))
    return 'Thornhill';
  return 'Toronto';
}

function mapTridelStatus(status) {
  if (!status) return 'pre';
  const s = status.toLowerCase();
  if (s.includes('move in') || s.includes('final suites') || s.includes('tour model'))
    return 'ready';
  return 'pre';
}

function parseTridelPrice(priceStr) {
  if (!priceStr) return 0;
  const num = priceStr.replace(/[^0-9]/g, '');
  return parseInt(num, 10) || 0;
}

// ── Auto-run when DOM is ready ────────────────────────
document.addEventListener('DOMContentLoaded', loadTridelFromN8N);
// ══ DATA ══
const ncProjects = [
  {id:1,name:"King West Condos",builder:"Tridel",city:"Toronto",type:"Condo",status:"pre",price:649000,priceLabel:"From $649K",beds:"1–3",sqft:"520–1,100",occ:"2027",features:["Rooftop Terrace","Concierge","Gym","Underground Parking"],desc:"Luxury pre-construction condos in the heart of King West. Steps from the Entertainment District, world-class restaurants, and TTC.",emoji:"🏢",website:"https://tridel.com"},
  {id:2,name:"Harmony Towns",builder:"Mattamy Homes",city:"Brampton",type:"Townhouse",status:"pre",price:749000,priceLabel:"From $749K",beds:"3–4",sqft:"1,400–1,900",occ:"2026",features:["Attached Garage","Smart Home","Park Views","No Condo Fees"],desc:"Modern townhomes in master-planned Brampton community. Close to GO Transit, Bramalea City Centre, and top-rated schools.",emoji:"🏘️",website:"https://mattamyhomes.com"},
  {id:3,name:"The Park District",builder:"Great Gulf",city:"Ottawa",type:"Condo",status:"ready",price:519000,priceLabel:"From $519K",beds:"1–2",sqft:"600–950",occ:"2025",features:["Move-In Ready","Balcony","In-Suite Laundry","Pet Friendly"],desc:"Move-in ready suites in Westboro Village. Walk to the Ottawa River, boutique shops, and the O-Train LRT station.",emoji:"🌿",website:"https://greatgulf.com"},
  {id:4,name:"Beltline Urban Towns",builder:"Brookfield Residential",city:"Calgary",type:"Townhouse",status:"ready",price:589000,priceLabel:"From $589K",beds:"2–3",sqft:"1,100–1,500",occ:"2025",features:["Rooftop Deck","2-Car Garage","No Condo Fees","Downtown Views"],desc:"Modern inner-city townhomes in Calgary's Beltline. Steps from 17th Ave, C-Train, and a thriving urban lifestyle.",emoji:"🏙️",website:"https://brookfieldresidential.com"},
  {id:5,name:"Westshore Towers",builder:"Concert Properties",city:"Vancouver",type:"Condo",status:"pre",price:899000,priceLabel:"From $899K",beds:"1–3",sqft:"550–1,200",occ:"2028",features:["Ocean Views","LEED Certified","Concierge","EV Charging"],desc:"Landmark pre-construction towers on Vancouver's waterfront. Unobstructed ocean and mountain views with best-in-class amenities.",emoji:"🌊",website:"https://concertproperties.com"},
  {id:6,name:"Riverview Heights",builder:"Rohit Communities",city:"Edmonton",type:"Detached",status:"pre",price:479000,priceLabel:"From $479K",beds:"3–5",sqft:"1,600–2,400",occ:"2026",features:["Double Garage","Walkout Basement","Ravine Lots","Energy Star"],desc:"Single-family detached homes backing onto the North Saskatchewan River Valley. Premium lots with ravine and river views.",emoji:"🏡",website:"https://rohitcommunities.com"},
  {id:7,name:"Sullivan Station",builder:"Polygon Homes",city:"Surrey",type:"Townhouse",status:"ready",price:699000,priceLabel:"From $699K",beds:"3–4",sqft:"1,350–1,750",occ:"2025",features:["Move-In Ready","Tandem Garage","Clubhouse","Transit Nearby"],desc:"3 and 4 bedroom townhomes in the rapidly growing Sullivan neighbourhood. Quick access to Hwy 10 and future SkyTrain expansion.",emoji:"🏘️",website:"https://polygonhomes.com"},
  {id:8,name:"The Alexander",builder:"Armco Capital",city:"Halifax",type:"Condo",status:"pre",price:399000,priceLabel:"From $399K",beds:"1–2",sqft:"580–900",occ:"2027",features:["Harbour Views","Rooftop Patio","Gym","Secure Parking"],desc:"Pre-construction boutique condos on Halifax's North End. Walking distance to the waterfront boardwalk, breweries, and hospitals.",emoji:"🌊",website:"https://armcocapital.com"},
  {id:9,name:"Kingfisher Landing",builder:"Qualico Communities",city:"Winnipeg",type:"Detached",status:"pre",price:369000,priceLabel:"From $369K",beds:"3–4",sqft:"1,450–2,100",occ:"2026",features:["Double Garage","Large Lots","Pond Views","Near Schools"],desc:"Family-oriented detached homes in south Winnipeg. Large lots backing onto natural ponds, minutes from St. Vital Centre.",emoji:"🏠",website:"https://qualico.com"},
  {id:10,name:"Ion District",builder:"Hines",city:"Kitchener",type:"Condo",status:"pre",price:489000,priceLabel:"From $489K",beds:"1–3",sqft:"530–1,050",occ:"2027",features:["ION LRT Access","Co-working Space","Rooftop Terrace","Bike Storage"],desc:"Transit-oriented condos steps from the ION LRT in Kitchener's Innovation District. Perfect for tech workers and young professionals.",emoji:"🚇",website:"https://hines.com"},
  {id:11,name:"The Millhouse",builder:"National Homes",city:"Hamilton",type:"Semi-Detached",status:"ready",price:629000,priceLabel:"From $629K",beds:"3",sqft:"1,300–1,500",occ:"2025",features:["Move-In Ready","Finished Basement","EV Rough-in","Near GO Train"],desc:"Move-in ready semi-detached homes in Hamilton's Waterdown community. Quick GO Train access to Toronto and Burlington.",emoji:"🏡",website:"https://nationalhomes.com"},
  {id:12,name:"Cloverdale Towns",builder:"Clayton Homes",city:"Mississauga",type:"Townhouse",status:"pre",price:799000,priceLabel:"From $799K",beds:"3–4",sqft:"1,500–2,000",occ:"2026",features:["Attached Garage","Lakeview Trail","Top Schools","Close to Square One"],desc:"Premium townhomes in south Mississauga near Cloverdale Mall redevelopment. Steps from Hurontario LRT and Lake Ontario trails.",emoji:"🏘️",website:"https://claytonhomes.com"},
];
let ncFiltered = [...ncProjects];
let compareSet = new Set();
let ncTypeFilter = 'all';
function filterNC(){
  const city = document.getElementById('nc-city').value;
  const type = document.getElementById('nc-type').value;
  const price = +document.getElementById('nc-price').value;
  const occ = document.getElementById('nc-occ').value;
  ncFiltered = ncProjects.filter(p => {
    if(city && p.city !== city) return false;
    if(type && p.type !== type) return false;
    if(price && p.price > price) return false;
    if(occ && !p.occ.startsWith(occ.replace('+',''))) return false;
    if(ncTypeFilter === 'pre' && p.status !== 'pre') return false;
    if(ncTypeFilter === 'ready' && p.status !== 'ready') return false;
    return true;
  });
  renderNC();
}
function setNCToggle(val, el){
  ncTypeFilter = val;
  document.querySelectorAll('.nc-toggle button').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  filterNC();
}
function selectMapCity(city){
  document.getElementById('nc-city').value = city;
  document.getElementById('mapCityLabel').textContent = city || 'All Cities';
  filterNC();
}
function sortNC(val){
  if(val==='price-asc') ncFiltered.sort((a,b)=>a.price-b.price);
  else if(val==='price-desc') ncFiltered.sort((a,b)=>b.price-a.price);
  else if(val==='occ') ncFiltered.sort((a,b)=>a.occ.localeCompare(b.occ));
  renderNC();
}
function renderNC(){
  const grid = document.getElementById('ncGrid');
  document.getElementById('nc-showing').textContent = ncFiltered.length;
  if(!ncFiltered.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray)">No projects match your filters. Try adjusting.</div>';return;}
  grid.innerHTML = ncFiltered.map(p => {
    const statusColor = p.status==='pre' ? '#1a56a0' : '#10b981';
    const statusLabel = p.status==='pre' ? 'Pre-Construction' : '✓ Move-In Ready';
    const inCompare = compareSet.has(p.id);
    return `<div class="nc-card" onclick="openProject(${p.id})">
      <div class="nc-card-img" style="background:linear-gradient(135deg,${p.status==='pre'?'#e8f2ff,#d1e9ff':'#e0faf8,#ccf7f2'})">
        <span>${p.emoji}</span>
        <div class="nc-card-status" style="background:${statusColor}">${statusLabel}</div>
        <button class="nc-card-fav" onclick="toggleCompare(event,${p.id})" title="Compare">${inCompare?'📌':'📍'}</button>
      </div>
      <div class="nc-card-body">
        <div class="nc-card-builder">${p.builder}</div>
        <div class="nc-card-name">${p.name}</div>
        <div class="nc-card-loc">📍 ${p.city} · ${p.type} · Occupancy ${p.occ}</div>
        <div class="nc-card-price">${p.priceLabel}</div>
        <div class="nc-card-specs">
          <span class="nc-card-spec">🛏 ${p.beds} beds</span>
          <span class="nc-card-spec">📐 ${p.sqft} sqft</span>
          ${p.features.slice(0,2).map(f=>`<span class="nc-card-spec">${f}</span>`).join('')}
        </div>
        <div class="nc-card-btns">
          <button class="nc-btn nc-btn-p" onclick="openProject(${p.id});event.stopPropagation()">View Details</button>
          <button class="nc-btn nc-btn-s" onclick="toggleCompare(event,${p.id})">${inCompare?'✓ Added':'+ Compare'}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  // update counters
  document.getElementById('nc-count-pre').textContent = ncProjects.filter(p=>p.status==='pre').length;
  document.getElementById('nc-count-ready').textContent = ncProjects.filter(p=>p.status==='ready').length;
  document.getElementById('nc-count-city').textContent = [...new Set(ncProjects.map(p=>p.city))].length;
}
function toggleCompare(e, id){
  e.stopPropagation();
  if(compareSet.has(id)) compareSet.delete(id);
  else if(compareSet.size < 3) compareSet.add(id);
  else { alert('You can compare up to 3 projects at a time.'); return; }
  renderNC();
  renderCompareBar();
}
function renderCompareBar(){
  const bar = document.getElementById('compareBar');
  const chips = document.getElementById('compareChips');
  const cnt = document.getElementById('compareCount');
  if(compareSet.size === 0){ bar.classList.remove('visible'); cnt.textContent=''; return; }
  bar.classList.add('visible');
  cnt.textContent = compareSet.size + ' selected';
  chips.innerHTML = [...compareSet].map(id => {
    const p = ncProjects.find(x=>x.id===id);
    return `<div class="compare-chip">${p.emoji} ${p.name}<button onclick="toggleCompare(event,${id})">✕</button></div>`;
  }).join('');
}
function clearCompare(){ compareSet.clear(); renderNC(); renderCompareBar(); }
function openCompare(){
  if(compareSet.size < 2){ alert('Select at least 2 projects to compare.'); return; }
  const items = [...compareSet].map(id => ncProjects.find(p=>p.id===id));
  const rows = [
    ['','Project',...items.map(p=>`${p.emoji} ${p.name}`)],
    ['Builder',...items.map(p=>p.builder)],
    ['City',...items.map(p=>p.city)],
    ['Type',...items.map(p=>p.type)],
    ['Status',...items.map(p=>p.status==='pre'?'Pre-Construction':'Move-In Ready')],
    ['Starting Price',...items.map(p=>p.priceLabel)],
    ['Bedrooms',...items.map(p=>p.beds)],
    ['Size',...items.map(p=>p.sqft+' sqft')],
    ['Occupancy',...items.map(p=>p.occ)],
    ['Key Features',...items.map(p=>p.features.slice(0,3).join(', '))],
  ];
  const cols = items.length + 1;
  document.getElementById('compareTable').innerHTML = rows.map((row,ri) => `
    <div class="cmp-row" style="display:grid;grid-template-columns:120px repeat(${items.length},1fr)">
      <div class="${ri===0?'cmp-val header':'cmp-label'}">${row[0]}</div>
      ${items.map((_,ci)=>`<div class="${ri===0?'cmp-val header':'cmp-val'}">${row[ci+1]}</div>`).join('')}
    </div>`).join('');
  document.getElementById('cmodal').classList.add('open');
}
function openProject(id){
  const p = ncProjects.find(x=>x.id===id);
  document.getElementById('pmEmoji').textContent = p.emoji;
  document.getElementById('pmBuilder').textContent = p.builder;
  document.getElementById('pmName').textContent = p.name;
  document.getElementById('pmLoc').textContent = `📍 ${p.city} · ${p.type} · Occupancy ${p.occ}`;
  document.getElementById('pmPrice').textContent = p.priceLabel;
  document.getElementById('pmSpecs').innerHTML = `<div class="pmodal-spec">🛏 ${p.beds} beds</div><div class="pmodal-spec">📐 ${p.sqft} sqft</div><div class="pmodal-spec">${p.status==='pre'?'Pre-Construction':'✓ Move-In Ready'}</div>`;
  document.getElementById('pmDesc').textContent = p.desc;
  document.getElementById('pmFeatures').innerHTML = p.features.map(f=>`<div class="pmodal-feature">✓ ${f}</div>`).join('');
  document.getElementById('pmWebsite').href = p.website;
  document.getElementById('pmodal').classList.add('open');
}
function closePModal(e){ if(e.target===document.getElementById('pmodal')) document.getElementById('pmodal').classList.remove('open'); }
function closeCModal(e){ if(e.target===document.getElementById('cmodal')) document.getElementById('cmodal').classList.remove('open'); }
