/* CLEARDOOR — NEW CONSTRUCTION
   Projects data · render · compare · modal
================================================================ */

// ══════════════════════════════════════════════════════════════
// DEVELOPER UNIT DATA TEMPLATE
// Use this as a reference when scraping / mapping any developer.
// Field coverage: project-level + suite-level + marketing data.
// ══════════════════════════════════════════════════════════════
/*
const UNIT_TEMPLATE = {
  // ── Identity ──────────────────────────────────────────────
  id:            '',          // unique id, e.g. 'tridel-6080-401'
  builder:       '',          // developer name, e.g. 'Tridel'
  name:          '',          // project/community name
  suiteName:     '',          // suite/unit label, e.g. 'Suite 401 - The York'
  suiteNumber:   '',          // raw unit number, e.g. '401'
  floorPlan:     '',          // floor plan name/label
  floorNumber:   null,        // floor number (int)
  tower:         '',          // tower label if multi-tower

  // ── Location ──────────────────────────────────────────────
  address:       '',          // full street address
  city:          '',          // city name
  province:      '',          // province abbreviation, e.g. 'ON'
  postalCode:    '',
  neighbourhood: '',          // neighbourhood / community name
  lat:           null,        // latitude
  lng:           null,        // longitude

  // ── Property Details ──────────────────────────────────────
  type:          '',          // 'Condo' | 'Townhouse' | 'Detached' | 'Semi-Detached' | 'Stacked'
  style:         '',          // e.g. 'Corner Suite', 'Penthouse', 'Garden Suite'
  beds:          null,        // number or range string e.g. '1+Den', '2'
  baths:         null,        // number, e.g. 1, 1.5, 2
  parking:       null,        // number of parking spots
  lockers:       null,        // number of lockers
  sqft:          null,        // interior sqft (number)
  exteriorSqft:  null,        // balcony/terrace sqft
  totalSqft:     null,        // interior + exterior
  exposure:      '',          // e.g. 'South', 'North-East'
  view:          '',          // e.g. 'Lake View', 'City View', 'Park View'
  level:         '',          // e.g. 'High Floor', 'Mid Floor'
  ceilingHeight: '',          // e.g. '9 ft', '10 ft'
  den:           false,       // has den

  // ── Pricing ───────────────────────────────────────────────
  price:         0,           // numeric price in CAD
  priceLabel:    '',          // display string, e.g. 'From $649,000'
  pricePerSqft:  null,        // numeric $/sqft
  maintenanceFee: null,       // monthly maintenance fee (condo)
  depositStructure: '',       // e.g. '5% on signing, 5% in 90 days'
  incentives:    [],          // e.g. ['Free Assignment', 'Capped Levies']
  priceHistory:  [],          // [{date, price}] for price change tracking

  // ── Availability ──────────────────────────────────────────
  status:        '',          // 'pre' | 'ready' | 'sold' | 'sold-out' | 'vip'
  availability:  '',          // 'Available' | 'Sold' | 'Platinum Access'
  occ:           '',          // occupancy year/quarter, e.g. '2027 Q4'
  occupancy:     '',          // full occupancy date string
  launchDate:    '',          // VIP/public launch date
  closingDate:   '',

  // ── Media ─────────────────────────────────────────────────
  img:           '',          // primary image URL
  imgAlt:        '',
  images:        [],          // additional image URLs
  floorPlanImg:  '',          // floor plan image URL
  videoUrl:      '',          // promo/walkthrough video URL
  virtualTour:   '',          // 3D tour URL
  brochureUrl:   '',          // PDF brochure URL

  // ── Links ─────────────────────────────────────────────────
  url:           '',          // listing page URL on developer site
  communityUrl:  '',          // community/project page URL
  registerUrl:   '',          // registration/interest form URL

  // ── Building Amenities ────────────────────────────────────
  features:      [],          // array of feature strings
  amenities:     [],          // building amenities
  buildingFeatures: [],       // e.g. ['Rooftop Terrace', 'Concierge', '24hr Security']
  suiteFeatures: [],          // e.g. ['Kitchen Island', 'Engineered Hardwood', 'Quartz Counters']
  parking_type:  '',          // 'Underground' | 'Surface'
  evCharging:    false,
  storage:       false,

  // ── Developer / Marketing ─────────────────────────────────
  category:      '',          // developer's internal category/tag
  community:     '',          // community/master-plan name
  phase:         '',          // development phase, e.g. 'Phase 2'
  totalUnits:    null,        // total units in building
  storeys:       null,        // number of storeys
  architect:     '',
  interiorDesigner: '',
  greenCert:     '',          // e.g. 'LEED Gold', 'Energy Star'

  // ── Metadata ──────────────────────────────────────────────
  sourceWebhook: '',          // which n8n webhook provided this
  fetchedAt:     '',          // ISO timestamp of when data was fetched
  emoji:         '🏗️',
  desc:          '',
};
*/

// ── Field name aliases: map any developer field → canonical field
// Extend this when adding a new developer whose API uses different names.
const FIELD_MAP = {
  // name / identity
  name:         ['name','projectName','communityName','planName','floorPlanName'],
  suiteName:    ['suiteName','suiteLabel','unitName','planLabel'],
  suiteId:      ['suiteId','unitId','suiteNumber','unitNumber','listingId'],
  category:     ['category','suiteType','planType','unitType','homeType'],
  builder:      ['builder','developer','builderName','developerName','company'],
  community:    ['community','communityName','project','projectName'],
  // location
  city:         ['city','municipality','cityName'],
  neighbourhood:['neighbourhood','neighborhood','location','area','district'],
  address:      ['address','streetAddress','fullAddress'],
  // property
  type:         ['type','propertyType','buildingType'],
  beds:         ['beds','bedrooms','bedroom','numBedrooms','bedroomCount','bd'],
  baths:        ['baths','bathrooms','bathroom','numBathrooms','bathroomCount','ba'],
  sqft:         ['sqft','squareFeet','interiorSqft','size','floorArea','area','suiteSize'],
  floor:        ['floor','floorNumber','level','storey'],
  exposure:     ['exposure','orientation','facing'],
  view:         ['view','viewDescription','viewType','viewDirection'],
  parking:      ['parking','parkingSpots','numParking','parkingCount'],
  // pricing
  price:        ['price','listPrice','unitPrice','startingPrice','askingPrice','salePrice'],
  priceLabel:   ['priceLabel','priceDisplay','priceText','formattedPrice'],
  maintenanceFee:['maintenanceFee','condoFee','maintenance','monthlyFee','maint'],
  // availability
  status:       ['status','availability','unitStatus','listingStatus','saleStatus'],
  occ:          ['occ','occupancy','occupancyDate','occupancyYear','completion','completionDate'],
  // media
  img:          ['imgSrc','img','image','imageUrl','thumbnail','photo','heroImage','primaryImage','imgUrl'],
  imgAlt:       ['imgAlt','imageAlt','altText'],
  url:          ['url','listingUrl','suiteUrl','link','href'],
  communityUrl: ['communityUrl','projectUrl','builderUrl','websiteUrl'],
  floorPlanImg: ['floorPlanImg','floorPlanImage','floorPlanUrl','planImage'],
  // extras
  features:     ['features','amenities','highlights','tags','keyFeatures'],
  desc:         ['desc','description','summary','details','overview'],
};

/** Pick first truthy value from an object using a list of possible field names */
function pickField(obj, fieldNames) {
  for (const key of fieldNames) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
  }
  return undefined;
}

// ══ LIVE FEEDS FROM N8N ══
const N8N_WEBHOOKS = [
  { url: 'https://sajadbahramian.app.n8n.cloud/webhook/tridel-listings',   builder: 'Tridel' },
  { url: 'https://sajadbahramian.app.n8n.cloud/webhook/tridel_6080_young', builder: 'Tridel' },
  // Add more developers here:
  // { url: 'https://...', builder: 'Menkes' },
];

async function loadAllDevelopers() {
  try {
    const results = await Promise.allSettled(
      N8N_WEBHOOKS.map(w => fetch(w.url).then(r => r.json()))
    );

    let allListings = [];
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        const raw = result.value;
        // handle both array responses and single-object responses
        const listings = Array.isArray(raw) ? raw : (raw && typeof raw === 'object' ? [raw] : []);
        console.log(`✅ ${N8N_WEBHOOKS[i].builder} [${N8N_WEBHOOKS[i].url.split('/').pop()}]: ${listings.length} listings`);
        if (listings[0]) console.log('Sample item:', JSON.stringify(listings[0], null, 2));
        // tag each item with its source builder
        listings.forEach(l => { l._sourceBuilder = N8N_WEBHOOKS[i].builder; l._sourceUrl = N8N_WEBHOOKS[i].url; });
        allListings.push(...listings);
      } else {
        console.warn(`⚠️ ${N8N_WEBHOOKS[i].builder} failed:`, result.reason);
      }
    });

    if (!allListings.length) return;

    const liveProjects = allListings.map((l, i) => {
      // ── resolve all fields using FIELD_MAP aliases ──
      const rawCommunity = pickField(l, FIELD_MAP.community) || '';
      const rawCategory  = pickField(l, FIELD_MAP.category) || '';
      const rawSuiteName = pickField(l, FIELD_MAP.suiteName) || '';
      const rawSuiteId   = pickField(l, FIELD_MAP.suiteId) || '';
      // Build a human-readable name: prefer explicit name, then community+category
      const rawNameField = pickField(l, FIELD_MAP.name);
      const rawName = rawNameField || (rawCommunity && rawCategory ? `${rawCommunity} — ${rawCategory}` : rawCommunity || rawCategory || rawSuiteName) || null;
      const rawBuilder = pickField(l, FIELD_MAP.builder) || l._sourceBuilder || 'Unknown';
      const rawCity    = pickField(l, FIELD_MAP.city) || 'Toronto';
      const rawType    = pickField(l, FIELD_MAP.type) || 'Condo';
      const rawBeds    = pickField(l, FIELD_MAP.beds);
      const rawBaths   = pickField(l, FIELD_MAP.baths);
      const rawSqft    = pickField(l, FIELD_MAP.sqft);
      const rawFloor   = pickField(l, FIELD_MAP.floor) || '';
      const rawImg     = pickField(l, FIELD_MAP.img) || '';
      const rawUrl     = pickField(l, FIELD_MAP.url) || pickField(l, FIELD_MAP.communityUrl) || '#';
      const rawOcc     = pickField(l, FIELD_MAP.occ) || '';
      const rawDesc    = pickField(l, FIELD_MAP.desc) || '';
      const rawFeatures = pickField(l, FIELD_MAP.features);
      const rawNeighbourhood = pickField(l, FIELD_MAP.neighbourhood) || rawCommunity || '';
      const rawStatus  = pickField(l, FIELD_MAP.status) || '';

      // ── price resolution ──
      const rawPrice = pickField(l, FIELD_MAP.price);
      const numPrice = typeof rawPrice === 'number'
        ? rawPrice
        : parseInt(String(rawPrice || '0').replace(/[^0-9]/g, '')) || 0;
      const rawPriceLabel = pickField(l, FIELD_MAP.priceLabel);
      const priceLabel = rawPriceLabel
        ? String(rawPriceLabel)
        : (numPrice ? `From $${numPrice.toLocaleString()}` : 'Price TBD');

      // ── status normalization ──
      const statusNorm = (rawStatus === 'pre' || /pre.?construction/i.test(rawStatus) || /vip/i.test(rawStatus))
        ? 'pre' : 'ready';

      // ── view direction (expand single letter to full word) ──
      const VIEW_DIRS = { N:'North', S:'South', E:'East', W:'West', NE:'North-East', NW:'North-West', SE:'South-East', SW:'South-West' };
      const rawViewRaw = pickField(l, FIELD_MAP.view) || pickField(l, FIELD_MAP.exposure) || '';
      const rawView = rawViewRaw ? (VIEW_DIRS[rawViewRaw.toUpperCase()] || rawViewRaw) : '';

      // ── features array ──
      let features = [];
      if (Array.isArray(rawFeatures)) {
        features = rawFeatures;
      } else if (typeof rawFeatures === 'string' && rawFeatures) {
        features = rawFeatures.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        // build from individual fields
        if (rawCategory) features.push(rawCategory);
        if (rawFloor)    features.push(`Floor ${rawFloor}`);
        if (rawView)     features.push(`${rawView} View`);
        const parking = pickField(l, FIELD_MAP.parking);
        if (parking)     features.push(`${parking} Parking`);
      }

      // ── description fallback ──
      const desc = rawDesc || [
        rawCategory || rawType,
        rawSqft ? `${rawSqft} sqft` : null,
        rawView ? `${rawView} View` : null,
        rawFloor ? `Floor ${rawFloor}` : null,
      ].filter(Boolean).join(' · ');

      // ── unique id: prefer suiteId, then url-based, then index ──
      const uid = rawSuiteId
        ? `live-${rawBuilder.replace(/\s+/g,'')}-${rawSuiteId}`
        : `live-${i}-${String(rawUrl !== '#' ? rawUrl : rawName || i).slice(-20).replace(/[^a-z0-9]/gi, '')}`;

      return {
        id:           uid,
        name:         rawName || rawNeighbourhood || 'Unnamed',
        builder:      rawBuilder,
        city:         rawCity,
        neighbourhood: rawNeighbourhood,
        type:         rawType,
        status:       statusNorm,
        statusLabel:  rawStatus,
        price:        numPrice,
        priceLabel,
        occ:          rawOcc,
        occupancy:    rawOcc,
        img:          rawImg,
        imgAlt:       pickField(l, FIELD_MAP.imgAlt) || rawName || '',
        url:          rawUrl,
        communityUrl: pickField(l, FIELD_MAP.communityUrl) || rawUrl,
        floorPlanImg: pickField(l, FIELD_MAP.floorPlanImg) || '',
        emoji:        '🏗️',
        desc,
        features,
        beds:         rawBeds != null ? String(rawBeds) : null,
        baths:        rawBaths != null ? String(rawBaths) : null,
        sqft:         rawSqft != null ? String(rawSqft) : null,
        suiteName:    rawSuiteName,
        suiteId:      rawSuiteId,
        category:     rawCategory,
        floor:        rawFloor,
        view:         rawView,
        exposure:     pickField(l, FIELD_MAP.exposure) || rawView,
        maintenanceFee: pickField(l, FIELD_MAP.maintenanceFee) || null,
        website:      pickField(l, FIELD_MAP.communityUrl) || '#',
        _source:      l._sourceUrl,
      };
    });

    // ── deduplicate: skip IDs already present ──
    const existingIds = new Set(ncProjects.map(p => String(p.id)));
    const newItems = liveProjects.filter(p => !existingIds.has(p.id));
    ncProjects.unshift(...newItems);
    ncFiltered = [...ncProjects];
    if (typeof renderNC === 'function') renderNC();

  } catch (err) {
    console.warn('Developer feed error:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadAllDevelopers);

// ══ STATIC DATA ══
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

// ══ FILTER / SORT ══
function filterNC() {
  const city  = document.getElementById('nc-city').value;
  const type  = document.getElementById('nc-type').value;
  const price = +document.getElementById('nc-price').value;
  const occ   = document.getElementById('nc-occ').value;
  ncFiltered = ncProjects.filter(p => {
    if (city  && p.city !== city) return false;
    if (type  && p.type !== type) return false;
    if (price && p.price > price) return false;
    if (occ   && !(p.occ||'').startsWith(occ.replace('+',''))) return false;
    if (ncTypeFilter === 'pre'   && p.status !== 'pre')   return false;
    if (ncTypeFilter === 'ready' && p.status !== 'ready') return false;
    return true;
  });
  renderNC();
}
function setNCToggle(val, el) {
  ncTypeFilter = val;
  document.querySelectorAll('.nc-toggle button').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  filterNC();
}
function selectMapCity(city) {
  document.getElementById('nc-city').value = city;
  document.getElementById('mapCityLabel').textContent = city || 'All Cities';
  filterNC();
}
function sortNC(val) {
  if (val === 'price-asc')       ncFiltered.sort((a,b) => a.price - b.price);
  else if (val === 'price-desc') ncFiltered.sort((a,b) => b.price - a.price);
  else if (val === 'occ')        ncFiltered.sort((a,b) => (a.occ||'').localeCompare(b.occ||''));
  renderNC();
}

// ══ RENDER ══
function renderNC() {
  const grid = document.getElementById('ncGrid');
  document.getElementById('nc-showing').textContent = ncFiltered.length;
  if (!ncFiltered.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray)">No projects match your filters. Try adjusting.</div>';
    return;
  }
  grid.innerHTML = ncFiltered.map(p => {
    const sid         = String(p.id);
    const statusColor = p.status === 'pre' ? '#1a56a0' : '#10b981';
    const statusLabel = p.status === 'pre' ? 'Pre-Construction' : '✓ Move-In Ready';
    const inCompare   = compareSet.has(sid);
    const imgHtml     = p.img
      ? `<img src="${p.img}" alt="${p.imgAlt || p.name}" style="width:100%;height:100%;object-fit:cover;">`
      : `<span>${p.emoji || '🏗️'}</span>`;
    return `<div class="nc-card" onclick="openProjectPage('${sid}')">
      <div class="nc-card-img" style="background:linear-gradient(135deg,${p.status==='pre'?'#e8f2ff,#d1e9ff':'#e0faf8,#ccf7f2'})">
        ${imgHtml}
        <div class="nc-card-status" style="background:${statusColor}">${statusLabel}</div>
        <button class="nc-card-fav" onclick="toggleCompare(event,'${sid}')" title="Compare">${inCompare?'📌':'📍'}</button>
      </div>
      <div class="nc-card-body">
        <div class="nc-card-builder">${p.builder}</div>
        <div class="nc-card-name">${p.name}</div>
        <div class="nc-card-loc">📍 ${p.city} · ${p.type}${p.occ ? ' · Occupancy ' + p.occ : ''}</div>
        <div class="nc-card-price">${p.priceLabel}</div>
        <div class="nc-card-specs">
          ${p.beds ? `<span class="nc-card-spec">🛏 ${p.beds} beds</span>` : ''}
          ${p.sqft ? `<span class="nc-card-spec">📐 ${p.sqft} sqft</span>` : ''}
          ${(p.features||[]).slice(0,2).map(f=>`<span class="nc-card-spec">${f}</span>`).join('')}
        </div>
        <div class="nc-card-btns">
          <button class="nc-btn nc-btn-p" onclick="openProjectPage('${sid}');event.stopPropagation()">View Details</button>
          <button class="nc-btn nc-btn-s" onclick="toggleCompare(event,'${sid}')">${inCompare?'✓ Added':'+ Compare'}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('nc-count-pre').textContent   = ncProjects.filter(p=>p.status==='pre').length;
  document.getElementById('nc-count-ready').textContent = ncProjects.filter(p=>p.status==='ready').length;
  document.getElementById('nc-count-city').textContent  = [...new Set(ncProjects.map(p=>p.city))].length;
}

// ══ DEVELOPER INFO ══
const DEVELOPER_INFO = {
  'Tridel':              { founded:'1934', homes:'90,000+',  hq:'Toronto, ON',   bio:'Tridel is Canada\'s leading developer of condominium residences with over 90 years of experience and 90,000+ homes built.',                                                              awards:['BILD Award Winner','Tarion Warranty Excellence','Green Building Certified'], website:'https://tridel.com' },
  'Mattamy Homes':       { founded:'1978', homes:'100,000+', hq:'Toronto, ON',   bio:'Mattamy Homes is North America\'s largest privately owned homebuilder with over 100,000 homes built across Canada and the US.',                                                           awards:['BILD GTA Builder of the Year','JD Power Award'],                            website:'https://mattamyhomes.com' },
  'Great Gulf':          { founded:'1975', homes:'50,000+',  hq:'Toronto, ON',   bio:'Great Gulf is one of North America\'s most diversified real estate companies with over 45 years of experience.',                                                                           awards:['BILD Award Winner','SAM Award Winner'],                                     website:'https://greatgulf.com' },
  'Brookfield Residential':{ founded:'1956', homes:'65,000+',hq:'Calgary, AB',   bio:'Brookfield Residential is a leading North American land developer and homebuilder creating master-planned communities across Canada and the US.',                                          awards:['BILD Award Winner','SAM Award Winner','Avid Diamond Award'],               website:'https://brookfieldresidential.com' },
  'Concert Properties':  { founded:'1989', homes:'6,000+',   hq:'Vancouver, BC', bio:'Concert Properties is a Canadian real estate company known for transit-oriented and sustainable developments across BC and Ontario.',                                                      awards:['UDI Award Winner','GVHBA Award'],                                           website:'https://concertproperties.com' },
  'Polygon Homes':       { founded:'1980', homes:'25,000+',  hq:'Vancouver, BC', bio:'Polygon Homes is one of BC\'s most established homebuilders with over 40 years building communities across the Lower Mainland.',                                                           awards:['Georgie Award Winner','GVHBA Award'],                                       website:'https://polygonhomes.com' },
  'Rohit Communities':   { founded:'1986', homes:'15,000+',  hq:'Edmonton, AB',  bio:'Rohit Communities is an Edmonton-based developer known for innovative design and quality construction across Alberta.',                                                                     awards:['CHBA Award Winner','SAM Award Winner'],                                     website:'https://rohitcommunities.com' },
};
const DEFAULT_DEVELOPER = {
  founded:'N/A', homes:'N/A', hq:'Canada',
  bio:'A reputable Canadian homebuilder committed to quality construction and excellent customer service.',
  awards:[], website:'#',
};

// ══ OPEN PROJECT PAGE (new tab blob) ══
function openProjectPage(id) {
  const p = ncProjects.find(x => String(x.id) === String(id));
  if (!p) return;
  const dev         = DEVELOPER_INFO[p.builder] || DEFAULT_DEVELOPER;
  const statusColor = p.status === 'pre' ? '#1a56a0' : '#10b981';
  const statusLabel = p.status === 'pre' ? 'Pre-Construction' : '✓ Move-In Ready';
  const externalUrl = p.url || p.website || dev.website || '#';
  const nearby      = ncProjects.filter(x => String(x.id) !== String(id) && x.city === p.city).slice(0,3);
  const defaultPrice = p.price || 700000;
  const defaultRate  = 5.5;
  const defaultAmort = 25;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.name} — ClearDoor</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#f0f4f8;color:#0f2342;min-height:100vh;}
a{color:inherit;text-decoration:none;}
.topbar{background:#0f2342;padding:.8rem 5%;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;position:sticky;top:0;z-index:100;}
.logo{color:#fff;font-size:1.1rem;font-weight:800;}.logo span{color:#3b9eff;}
.back{background:rgba(255,255,255,.12);color:#fff;border:none;padding:.4rem 1rem;border-radius:8px;font-size:.8rem;font-weight:600;cursor:pointer;}
.hero{position:relative;height:340px;overflow:hidden;background:linear-gradient(135deg,#0a1f3d,#1a3d72);}
.hero img{width:100%;height:100%;object-fit:cover;}
.hero-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:6rem;}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,15,35,.9) 0%,rgba(5,15,35,.3) 60%,transparent 100%);padding:2rem 5%;display:flex;flex-direction:column;justify-content:flex-end;}
.badge{display:inline-block;background:${statusColor};color:#fff;border-radius:6px;padding:.2rem .65rem;font-size:.68rem;font-weight:700;margin-bottom:.5rem;width:fit-content;}
.hero h1{color:#fff;font-size:clamp(1.4rem,4vw,2rem);font-weight:800;line-height:1.2;margin-bottom:.3rem;}
.hero-sub{color:rgba(255,255,255,.7);font-size:.9rem;}
.hero-price{position:absolute;top:1.2rem;right:5%;background:rgba(0,0,0,.55);border-radius:12px;padding:.7rem 1.1rem;text-align:center;color:#fff;}
.hero-price .pl{font-size:.65rem;opacity:.7;margin-bottom:.1rem;}.hero-price .pv{font-size:1.3rem;font-weight:800;}
.container{max-width:980px;margin:0 auto;padding:1.5rem 4%;}
.layout{display:grid;grid-template-columns:1fr 300px;gap:1.2rem;align-items:start;}
.card{background:#fff;border-radius:14px;border:1px solid #e2eaf5;padding:1.3rem;margin-bottom:1rem;}
.card h2{font-size:.82rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:1rem;padding-bottom:.6rem;border-bottom:1px solid #f0f4f8;}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;}
.info-box{background:#f8fafc;border-radius:8px;padding:.65rem .8rem;}
.info-box .il{font-size:.7rem;color:#64748b;margin-bottom:.15rem;}.info-box .iv{font-size:.88rem;font-weight:700;color:#0f2342;}
.dev-header{display:flex;align-items:center;gap:.9rem;margin-bottom:.9rem;}
.dev-avatar{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#0f2342,#1a3d72);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:.9rem;flex-shrink:0;}
.dev-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:.8rem;}
.dev-stat{background:#f8fafc;border-radius:8px;padding:.5rem;text-align:center;}
.dev-stat .dsn{font-size:1rem;font-weight:800;color:#0f2342;}.dev-stat .dsl{font-size:.68rem;color:#64748b;}
.awards{display:flex;flex-wrap:wrap;gap:.4rem;}
.award{background:#fef3c7;color:#92400e;border-radius:6px;padding:.2rem .6rem;font-size:.68rem;font-weight:600;}
.nearby-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.6rem;}
.nearby-card{background:#f8fafc;border-radius:10px;border:1px solid #e2eaf5;padding:.8rem;cursor:pointer;transition:all .2s;}
.nearby-card:hover{border-color:#3b9eff;transform:translateY(-2px);}
.calc-row{display:flex;align-items:center;gap:.8rem;margin-bottom:.9rem;}
.calc-row label{font-size:.78rem;color:#64748b;width:130px;flex-shrink:0;}
.calc-row input[type=range]{flex:1;accent-color:#3b9eff;}
.calc-row .val{font-size:.82rem;font-weight:700;color:#0f2342;width:90px;text-align:right;}
.calc-result{background:linear-gradient(135deg,#0f2342,#1a3d72);border-radius:12px;padding:1.1rem;color:#fff;display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin-top:.5rem;}
.cr-item .crl{font-size:.68rem;opacity:.65;margin-bottom:.15rem;}.cr-item .crv{font-size:1.1rem;font-weight:800;}
.cr-item.big{grid-column:1/-1;border-top:1px solid rgba(255,255,255,.15);padding-top:.7rem;}.cr-item.big .crv{font-size:1.4rem;}
.score-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;}
.score-box{background:#f8fafc;border-radius:10px;padding:.7rem .5rem;text-align:center;}
.score-bar{height:4px;border-radius:2px;background:#e2eaf5;margin-top:.4rem;overflow:hidden;}
.score-fill{height:100%;border-radius:2px;}
.nl-box{background:linear-gradient(135deg,#0f2342,#1a56a0);border-radius:14px;padding:1.3rem;color:#fff;margin-bottom:1rem;}
.nl-box h3{font-size:1rem;font-weight:700;margin-bottom:.3rem;}
.nl-box p{font-size:.8rem;opacity:.75;margin-bottom:.9rem;line-height:1.5;}
.nl-input{width:100%;padding:.55rem .8rem;border-radius:8px;border:none;font-size:.85rem;margin-bottom:.5rem;}
.nl-btn{width:100%;padding:.55rem;background:#3b9eff;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:.85rem;cursor:pointer;}
.nl-thanks{display:none;background:rgba(255,255,255,.15);border-radius:8px;padding:.5rem;text-align:center;font-size:.82rem;}
.cta-btn{display:block;width:100%;padding:.75rem;border-radius:10px;font-size:.85rem;font-weight:700;cursor:pointer;text-align:center;margin-bottom:.5rem;border:none;transition:all .18s;}
.cta-primary{background:#3b9eff;color:#fff;}.cta-secondary{background:#fff;color:#0f2342;border:1.5px solid #e2eaf5;}
.cta-ghost{background:#f8fafc;color:#64748b;border:1px solid #e2eaf5;font-size:.8rem;}
.tip-item{display:flex;gap:.7rem;padding:.6rem 0;border-bottom:1px solid #f0f4f8;font-size:.82rem;}
.tip-item:last-child{border-bottom:none;}
.tip-tag{display:inline-block;border-radius:4px;padding:.1rem .4rem;font-size:.65rem;font-weight:700;margin-right:.3rem;}
.tag-red{background:#fee2e2;color:#991b1b;}.tag-amber{background:#fef3c7;color:#92400e;}.tag-blue{background:#dbeafe;color:#1e40af;}
.share-row{display:flex;gap:.5rem;margin-top:.6rem;}
.share-btn{flex:1;background:#f8fafc;border:1px solid #e2eaf5;border-radius:8px;padding:.45rem;font-size:.75rem;font-weight:600;cursor:pointer;text-align:center;color:#0f2342;}
.disclaimer{font-size:.7rem;color:#94a3b8;line-height:1.5;margin-top:.6rem;text-align:center;}
@media(max-width:700px){.layout{grid-template-columns:1fr;}.hero{height:240px;}.hero-price{display:none;}.score-grid{grid-template-columns:repeat(2,1fr);}}
</style>
</head>
<body>
<div class="topbar">
  <div class="logo">clear<span>door</span></div>
  <button class="back" onclick="window.close()">← Back to listings</button>
</div>
<div class="hero">
  ${p.img ? `<img src="${p.img}" alt="${p.imgAlt||p.name}">` : `<div class="hero-fallback">${p.emoji||'🏗️'}</div>`}
  <div class="hero-overlay">
    <div class="badge">${statusLabel}</div>
    <h1>${p.name}</h1>
    <div class="hero-sub">by ${p.builder}${p.neighbourhood?' · '+p.neighbourhood:''}</div>
  </div>
  <div class="hero-price">
    <div class="pl">Starting from</div>
    <div class="pv">${p.priceLabel||'TBD'}</div>
    ${p.occ?`<div style="font-size:.68rem;opacity:.6;margin-top:.1rem">Occupancy ${p.occ}</div>`:''}
  </div>
</div>
<div class="container">
<div class="layout">
<div>
  <div class="card">
    <h2>Project Overview</h2>
    <div class="info-grid">
      <div class="info-box"><div class="il">City</div><div class="iv">${p.city}</div></div>
      <div class="info-box"><div class="il">Property type</div><div class="iv">${p.type}</div></div>
      <div class="info-box"><div class="il">Status</div><div class="iv" style="color:${statusColor}">${statusLabel}</div></div>
      <div class="info-box"><div class="il">Occupancy</div><div class="iv">${p.occ||'TBD'}</div></div>
      ${p.beds?`<div class="info-box"><div class="il">Bedrooms</div><div class="iv">${p.beds}</div></div>`:''}
      ${p.sqft?`<div class="info-box"><div class="il">Suite size</div><div class="iv">${p.sqft} sqft</div></div>`:''}
      ${p.baths?`<div class="info-box"><div class="il">Bathrooms</div><div class="iv">${p.baths}</div></div>`:''}
      ${p.exposure?`<div class="info-box"><div class="il">Exposure</div><div class="iv">${p.exposure}</div></div>`:''}
      ${p.maintenanceFee?`<div class="info-box"><div class="il">Maint. fee</div><div class="iv">$${Number(p.maintenanceFee).toLocaleString()}/mo</div></div>`:''}
      ${p.neighbourhood?`<div class="info-box" style="grid-column:1/-1"><div class="il">Neighbourhood</div><div class="iv">${p.neighbourhood}</div></div>`:''}
    </div>
    ${(p.features||[]).length?`<div style="margin-top:.9rem;display:flex;flex-wrap:wrap;gap:.4rem;">${p.features.map(f=>`<span style="background:#f0f4f8;border-radius:6px;padding:.2rem .55rem;font-size:.72rem;font-weight:600;color:#0f2342;">✓ ${f}</span>`).join('')}</div>`:''}
    ${p.desc?`<p style="margin-top:.9rem;font-size:.86rem;line-height:1.7;color:#475569;">${p.desc}</p>`:''}
  </div>
  <div class="card">
    <h2>About the Developer</h2>
    <div class="dev-header">
      <div class="dev-avatar">${p.builder.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
      <div><div style="font-size:1rem;font-weight:700;">${p.builder}</div><div style="font-size:.75rem;color:#64748b;">Est. ${dev.founded} · ${dev.hq}</div></div>
    </div>
    <p style="font-size:.85rem;line-height:1.7;color:#475569;margin-bottom:.8rem;">${dev.bio}</p>
    <div class="dev-stats">
      <div class="dev-stat"><div class="dsn">${dev.homes}</div><div class="dsl">Homes built</div></div>
      <div class="dev-stat"><div class="dsn">${new Date().getFullYear()-parseInt(dev.founded)||'—'}+</div><div class="dsl">Years active</div></div>
      <div class="dev-stat"><div class="dsn">${dev.awards.length}</div><div class="dsl">Awards</div></div>
    </div>
    ${dev.awards.length?`<div class="awards">${dev.awards.map(a=>`<span class="award">🏆 ${a}</span>`).join('')}</div>`:''}
    <a href="${dev.website}" target="_blank" rel="noopener" style="display:inline-block;margin-top:.9rem;font-size:.82rem;color:#3b9eff;font-weight:600;">Visit ${p.builder} website ↗</a>
  </div>
  <div class="card">
    <h2>Other Projects in ${p.city}</h2>
    ${nearby.length?`<div class="nearby-grid">${nearby.map(n=>`<div class="nearby-card" onclick="window.opener&&window.opener.openProjectPage('${n.id}')"><div style="font-size:.65rem;color:#3b9eff;font-weight:700;text-transform:uppercase;margin-bottom:.2rem;">${n.builder}</div><div style="font-size:.85rem;font-weight:700;margin-bottom:.2rem;">${n.name}</div><div style="font-size:.72rem;color:#64748b;margin-bottom:.3rem;">📍 ${n.city} · ${n.type}</div><div style="font-size:.88rem;font-weight:800;">${n.priceLabel}</div></div>`).join('')}</div>`:`<p style="font-size:.85rem;color:#94a3b8;">No other tracked projects in ${p.city} yet.</p>`}
  </div>
  <div class="card">
    <h2>Mortgage Calculator</h2>
    <div class="calc-row"><label>Home price</label><input type="range" id="mc-price" min="200000" max="2000000" step="10000" value="${defaultPrice}" oninput="calcMC()"><span class="val" id="mc-price-v">$${Math.round(defaultPrice/1000)}K</span></div>
    <div class="calc-row"><label>Down payment</label><input type="range" id="mc-down" min="5" max="40" step="1" value="10" oninput="calcMC()"><span class="val" id="mc-down-v">10%</span></div>
    <div class="calc-row"><label>Interest rate</label><input type="range" id="mc-rate" min="1" max="12" step="0.1" value="${defaultRate}" oninput="calcMC()"><span class="val" id="mc-rate-v">${defaultRate}%</span></div>
    <div class="calc-row"><label>Amortization</label><input type="range" id="mc-amort" min="5" max="30" step="5" value="${defaultAmort}" oninput="calcMC()"><span class="val" id="mc-amort-v">${defaultAmort} yrs</span></div>
    <div class="calc-result">
      <div class="cr-item"><div class="crl">Mortgage amount</div><div class="crv" id="mc-mortgage">—</div></div>
      <div class="cr-item"><div class="crl">Down payment</div><div class="crv" id="mc-downamt">—</div></div>
      <div class="cr-item"><div class="crl">Total interest</div><div class="crv" id="mc-interest">—</div></div>
      <div class="cr-item"><div class="crl">Total cost</div><div class="crv" id="mc-total">—</div></div>
      <div class="cr-item big"><div class="crl">Monthly payment</div><div class="crv" id="mc-monthly">—</div></div>
    </div>
    <p style="font-size:.7rem;color:#94a3b8;margin-top:.5rem;">Estimate only. Canadian mortgages compound semi-annually.</p>
  </div>
  <div class="card">
    <h2>Neighbourhood Snapshot — ${p.city}</h2>
    <div class="score-grid">
      <div class="score-box"><div style="font-size:1.3rem;color:#10b981;">🚇</div><div style="font-size:.68rem;color:#64748b;">Transit</div><div class="score-bar"><div class="score-fill" style="width:${p.city==='Toronto'||p.city==='North York'?88:p.city==='Vancouver'?85:p.city==='Ottawa'?78:65}%;background:#10b981;"></div></div></div>
      <div class="score-box"><div style="font-size:1.3rem;color:#3b9eff;">🚶</div><div style="font-size:.68rem;color:#64748b;">Walkability</div><div class="score-bar"><div class="score-fill" style="width:${p.city==='Toronto'?92:p.city==='Vancouver'?88:p.city==='Ottawa'?72:60}%;background:#3b9eff;"></div></div></div>
      <div class="score-box"><div style="font-size:1.3rem;color:#f59e0b;">🏫</div><div style="font-size:.68rem;color:#64748b;">Schools</div><div class="score-bar"><div class="score-fill" style="width:${p.city==='Toronto'||p.city==='North York'?75:p.city==='Ottawa'?80:70}%;background:#f59e0b;"></div></div></div>
      <div class="score-box"><div style="font-size:1.3rem;color:#8b5cf6;">🛍️</div><div style="font-size:.68rem;color:#64748b;">Amenities</div><div class="score-bar"><div class="score-fill" style="width:${p.city==='Toronto'?90:p.city==='Vancouver'?85:p.city==='Calgary'?78:70}%;background:#8b5cf6;"></div></div></div>
    </div>
  </div>
</div>
<div>
  <div class="card" style="text-align:center;">
    <div style="font-size:.7rem;color:#94a3b8;margin-bottom:.2rem;">Starting from</div>
    <div style="font-size:1.6rem;font-weight:800;color:#0f2342;margin-bottom:.2rem;">${p.priceLabel||'TBD'}</div>
    ${p.occ?`<div style="font-size:.78rem;color:#64748b;margin-bottom:.9rem;">Occupancy ${p.occ}</div>`:'<div style="margin-bottom:.9rem;"></div>'}
    <a class="cta-btn cta-primary" href="${externalUrl}" target="_blank" rel="noopener">View on ${p.builder} site ↗</a>
    <button class="cta-btn cta-secondary" onclick="document.getElementById('nl-section').scrollIntoView({behavior:'smooth'})">📬 Get neighbourhood updates</button>
    <button class="cta-btn cta-ghost" onclick="copyLink()">🔗 Copy link</button>
    <div class="share-row"><button class="share-btn" onclick="shareEmail()">📧 Email</button><button class="share-btn" onclick="shareTwitter()">𝕏 Share</button></div>
  </div>
  <div class="nl-box" id="nl-section">
    <h3>📬 ${p.city} Market Updates</h3>
    <p>New listings, price changes, and buyer tips for ${p.city} — free every Friday.</p>
    <input class="nl-input" type="email" id="nl-email" placeholder="your@email.com">
    <button class="nl-btn" onclick="subscribeNL()">Get updates →</button>
    <div class="nl-thanks" id="nl-thanks">✅ You're in! See you Friday.</div>
  </div>
  <div class="card">
    <h2>Before you sign</h2>
    <div class="tip-item"><span style="font-size:1rem;flex-shrink:0;width:20px;">⚠️</span><span style="color:#475569;line-height:1.5;font-size:.82rem;"><span class="tip-tag tag-red">Critical</span>You have <strong>10 days</strong> to cancel a new condo agreement in Ontario.</span></div>
    <div class="tip-item"><span style="font-size:1rem;flex-shrink:0;width:20px;">🛡️</span><span style="color:#475569;line-height:1.5;font-size:.82rem;"><span class="tip-tag tag-blue">Protection</span>Tarion warranty: defects 1yr, systems 2yr, structural 7yr.</span></div>
    <div class="tip-item"><span style="font-size:1rem;flex-shrink:0;width:20px;">💸</span><span style="color:#475569;line-height:1.5;font-size:.82rem;"><span class="tip-tag tag-amber">Tax</span>New Ontario homes include 13% HST. Confirm builder includes the rebate.</span></div>
    <div class="tip-item"><span style="font-size:1rem;flex-shrink:0;width:20px;">🚩</span><span style="color:#475569;line-height:1.5;font-size:.82rem;"><span class="tip-tag tag-red">Watch out</span>Negotiate a <strong>cap on development charges</strong> — can add $20K–$60K.</span></div>
    <div class="tip-item"><span style="font-size:1rem;flex-shrink:0;width:20px;">⏰</span><span style="color:#475569;line-height:1.5;font-size:.82rem;"><span class="tip-tag tag-amber">Risk</span>Builder delays of 1–3 years are common. Budget for bridge financing.</span></div>
    <div class="tip-item"><span style="font-size:1rem;flex-shrink:0;width:20px;">🔧</span><span style="color:#475569;line-height:1.5;font-size:.82rem;"><span class="tip-tag tag-blue">Strategy</span>Builder upgrades carry 30–50% margins. Do upgrades after closing.</span></div>
  </div>
  <div style="background:#f0f4f8;border-radius:12px;padding:.9rem;text-align:center;font-size:.78rem;color:#64748b;line-height:1.6;">
    <strong style="color:#0f2342;">🇨🇦 ClearDoor</strong><br>Canada's first-time buyer platform. All tools free — always.
    <br><button class="cta-btn cta-ghost" style="margin-top:.6rem;" onclick="window.close()">← Back to ClearDoor</button>
  </div>
  <p class="disclaimer">* Prices, specs & occupancy subject to change. Always verify with the builder. Not financial or legal advice.</p>
</div>
</div>
</div>
<script>
function fmt(n){return '$'+Math.round(n).toLocaleString();}
function calcMC(){
  const price=+document.getElementById('mc-price').value;
  const downPct=+document.getElementById('mc-down').value;
  const rate=+document.getElementById('mc-rate').value;
  const amort=+document.getElementById('mc-amort').value;
  document.getElementById('mc-price-v').textContent=price>=1000000?'$'+(price/1000000).toFixed(2)+'M':'$'+(price/1000).toFixed(0)+'K';
  document.getElementById('mc-down-v').textContent=downPct+'%';
  document.getElementById('mc-rate-v').textContent=rate.toFixed(1)+'%';
  document.getElementById('mc-amort-v').textContent=amort+' yrs';
  const downAmt=price*downPct/100;
  const mortgage=price-downAmt;
  const monthlyRate=Math.pow(1+rate/200,1/6)-1;
  const n=amort*12;
  const monthly=mortgage*monthlyRate/(1-Math.pow(1+monthlyRate,-n));
  const totalPaid=monthly*n;
  document.getElementById('mc-mortgage').textContent=fmt(mortgage);
  document.getElementById('mc-downamt').textContent=fmt(downAmt);
  document.getElementById('mc-interest').textContent=fmt(totalPaid-mortgage);
  document.getElementById('mc-total').textContent=fmt(totalPaid+downAmt);
  document.getElementById('mc-monthly').textContent=fmt(monthly)+'/mo';
}
calcMC();
function subscribeNL(){
  const email=document.getElementById('nl-email').value;
  if(!email||!email.includes('@')){alert('Please enter a valid email.');return;}
  document.getElementById('nl-email').style.display='none';
  document.querySelector('.nl-btn').style.display='none';
  document.getElementById('nl-thanks').style.display='block';
}
function copyLink(){navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!')).catch(()=>alert('Copy the URL from your address bar.'));}
function shareEmail(){window.open('mailto:?subject='+encodeURIComponent('${p.name} — ClearDoor')+'&body='+encodeURIComponent('Check out ${p.name} by ${p.builder}: ${externalUrl}'));}
function shareTwitter(){window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('Checking out ${p.name} by ${p.builder} on ClearDoor 🇨🇦')+'&url='+encodeURIComponent('${externalUrl}'),'_blank');}
</script>
</body>
</html>`;
  const blob = new Blob([html], {type:'text/html'});
  window.open(URL.createObjectURL(blob), '_blank');
}

// ══ COMPARE ══
function toggleCompare(e, id) {
  e.stopPropagation();
  const sid = String(id);
  if (compareSet.has(sid)) compareSet.delete(sid);
  else if (compareSet.size < 3) compareSet.add(sid);
  else { alert('You can compare up to 3 projects at a time.'); return; }
  renderNC();
  renderCompareBar();
}
function renderCompareBar() {
  const bar   = document.getElementById('compareBar');
  const chips = document.getElementById('compareChips');
  const cnt   = document.getElementById('compareCount');
  if (compareSet.size === 0) { bar.classList.remove('visible'); cnt.textContent = ''; return; }
  bar.classList.add('visible');
  cnt.textContent = compareSet.size + ' selected';
  chips.innerHTML = [...compareSet].map(sid => {
    const p = ncProjects.find(x => String(x.id) === sid);
    if (!p) return '';
    return `<div class="compare-chip">${p.emoji||'🏗️'} ${p.name}<button onclick="toggleCompare(event,'${sid}')">✕</button></div>`;
  }).join('');
}
function clearCompare() { compareSet.clear(); renderNC(); renderCompareBar(); }
function openCompare() {
  if (compareSet.size < 2) { alert('Select at least 2 projects to compare.'); return; }
  const items = [...compareSet].map(sid => ncProjects.find(p => String(p.id) === sid));
  const rows = [
    ['','Project',...items.map(p=>`${p.emoji||'🏗️'} ${p.name}`)],
    ['Builder',...items.map(p=>p.builder)],
    ['City',...items.map(p=>p.city)],
    ['Type',...items.map(p=>p.type)],
    ['Status',...items.map(p=>p.status==='pre'?'Pre-Construction':'Move-In Ready')],
    ['Starting Price',...items.map(p=>p.priceLabel)],
    ['Bedrooms',...items.map(p=>p.beds||'—')],
    ['Size',...items.map(p=>p.sqft?p.sqft+' sqft':'—')],
    ['Occupancy',...items.map(p=>p.occ||'—')],
    ['Key Features',...items.map(p=>(p.features||[]).slice(0,3).join(', ')||'—')],
  ];
  document.getElementById('compareTable').innerHTML = rows.map((row,ri) => `
    <div class="cmp-row" style="display:grid;grid-template-columns:120px repeat(${items.length},1fr)">
      <div class="${ri===0?'cmp-val header':'cmp-label'}">${row[0]}</div>
      ${items.map((_,ci)=>`<div class="${ri===0?'cmp-val header':'cmp-val'}">${row[ci+1]}</div>`).join('')}
    </div>`).join('');
  document.getElementById('cmodal').classList.add('open');
}
function closePModal(e){if(e.target===document.getElementById('pmodal'))document.getElementById('pmodal').classList.remove('open');}
function closeCModal(e){if(e.target===document.getElementById('cmodal'))document.getElementById('cmodal').classList.remove('open');}
