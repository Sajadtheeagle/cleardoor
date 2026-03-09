/* CLEARDOOR — OTTAWA MAP (Leaflet)
   Load AFTER leaflet.min.js + leaflet-heat.js CDN scripts
================================================================ */

// ════════════════════════════════════════════════
// OTTAWA MAPS — Complete data + interactivity
// ════════════════════════════════════════════════

// ─── NEIGHBOURHOOD DATA ─────────────────────────
const HOODS = [
  // ── INNER CITY ──
  {id:'downtown',name:'Downtown Core',area:'Central Ottawa',
   opType:'downtown',opLabel:'Central Area',color:'#c0392b',
   // Polygon: bounded by Ottawa River (N), King Edward/Nicholas (E), Queensway/Canal (S), Bronson (W)
   poly:[[45.438,-75.720],[45.434,-75.706],[45.434,-75.694],[45.432,-75.686],
         [45.417,-75.684],[45.409,-75.689],[45.409,-75.708],[45.414,-75.720]],
   newZone:'MC – Mixed-Use / High Density',
   currentState:'Ottawa\'s established urban core. Parliament Hill, ByWard Market, Centretown, Sandy Hill. Dense condos and apartments.',
   futureState:'Continued high-rise intensification. LeBreton Flats Phase 2 (arena + 6,000+ units). Federal lands being unlocked for housing. NCC Courthouse redevelopment.',
   priceRange:'$370K–$950K',medianPrice:620000,price5yr:28,rentYield:4.8,
   lrtDist:0.3,lrtStations:['Parliament','Rideau','Lyon','uOttawa'],
   bestFor:'Urban investors, rental income',types:['condo','apartment'],
   investScore:74,tScore:10,gScore:8,mScore:6,aScore:4,pScore:8,
   highlights:['Multiple LRT stations','Strong rental demand','Parliament + ByWard Market walkability'],
   risks:['High entry price','Condo fees','Market saturation risk'],
   proTip:'Best value: 1-bed condos in Sandy Hill near uOttawa for student rental income.'},

  {id:'centretown',name:'Centretown / Glebe',area:'Central Ottawa',
   opType:'innerurban',opLabel:'Inner Urban + Mainstreet (Bank St)',color:'#e74c3c',
   poly:[[45.414,-75.720],[45.414,-75.682],[45.393,-75.680],[45.388,-75.697],[45.393,-75.720]],
   newZone:'N3–N5 (Centretown) / Mainstreet — Bank Street in the Glebe',
   currentState:'Two distinct planning regimes. Centretown (north of Queensway) has higher-density N3-N5 zoning and greater intensification potential. Bank Street in the Glebe is governed by its own Secondary Plan (Plan): maximum 4 storeys on Bank St between Hwy 417 and Wilton Crescent, protecting the Glebe\'s heritage commercial character. Heritage Conservation District applies near Bank/Clemow intersection. No new curb cuts permitted on Bank Street. Notched corners encouraged for public gathering spaces.',
   futureState:'Lansdowne 2.0 redevelopment (Bank St & Queen Elizabeth Dr) brings 1,200+ new residential units, a new arena, and increased retail — will drive Bank St demand north toward Centretown. Centretown\'s N4/N5 parcels can redevelop to condo towers. Bank St in Glebe stays at 4-storey limit, preserving neighbourhood character. Main & Bank intersection is the key intensification nexus.',
   priceRange:'$450K–$1.1M',medianPrice:680000,price5yr:31,rentYield:4.2,
   lrtDist:1.0,lrtStations:['Parliament','Lyon'],
   bestFor:'Lifestyle buyers, long-term appreciation',types:['condo','townhouse','detached'],
   investScore:72,tScore:7,gScore:8,mScore:8,aScore:3,pScore:7,
   highlights:['Lansdowne 2.0 redevelopment (1,200+ units + arena)','Bank Street Glebe Secondary Plan: 4-storey heritage Mainstreet','Centretown N4/N5 allows condo towers','Rideau Canal + Dow\'s Lake walkability'],
   risks:['Glebe Bank St hard-capped at 4 storeys — no high-rise upside','Premium entry prices limit near-term yield','Heritage restrictions on ~50% of the corridor'],
   proTip:'In the Glebe: buy near Lansdowne for spillover appreciation but accept the 4-storey limit on Bank St. In Centretown: condos on Kent/Lyon/Elgin streets offer better yield with N4/N5 intensification potential.'},

  {id:'hintonburg',name:'Hintonburg / Mechanicsville / Scott Street',area:'West Central',
   opType:'innerurban',opLabel:'Hub (Tunney\'s) + Minor Corridor (Scott St) + Mainstreet (Wellington W)',color:'#e74c3c',
   poly:[[45.422,-75.740],[45.420,-75.718],[45.408,-75.718],[45.406,-75.740]],
   newZone:'N2–N3 / TM Wellington W / Hub at Tunney\'s Pasture',
   currentState:'Ottawa\'s arts and gentrification hotspot straddling three planning designations. Wellington St W is a Traditional Mainstreet with active retail/restaurants. Scott Street is designated a Minor Corridor connecting Hintonburg to Tunney\'s Pasture. The Scott Street Secondary Plan (Plan 15) designates Tunney\'s Pasture O-Train area as a Hub with intensification priority — mid and high-rise mixed-use buildings supported near the station. Pimisi LRT station is the current key transit access point. Mix of character homes, new infill townhouses, and condos.',
   futureState:'Tunney\'s Pasture federal land redevelopment plan proposes 5,000–10,000 new units on surplus government land (Health Canada, PHAC campus) — a transformative federal-City co-development. The Hub designation at Tunney\'s supports high-density mixed-use. Scott Street as a Minor Corridor allows graduated intensification linking Bayview to Tunney\'s. Wellington West Secondary Plan allows up to 9 storeys where community benefits are secured (general 6-storey limit on Wellington Street West Mainstreet). Lebreton Flats Phase 2 (NCC + partner) adds thousands of units nearby.',
   priceRange:'$480K–$870K',medianPrice:645000,price5yr:39,rentYield:4.6,
   lrtDist:0.4,lrtStations:['Pimisi','Tunney\'s Pasture'],
   bestFor:'First-time buyers, gentrification play, federal land release play',types:['townhouse','semi-detached','condo'],
   investScore:84,tScore:9,gScore:9,mScore:9,aScore:5,pScore:8,
   highlights:['Pimisi + Tunney\'s LRT (two stations)','Tunney\'s Pasture Hub — federal land redevelopment could add 5,000–10,000 units','Wellington West: up to 9 storeys where community benefits secured','Scott Street Secondary Plan: Tunney\'s Hub designation confirmed','Wellington Village walkability + arts community'],
   risks:['Federal land timelines unpredictable','Rising prices reducing entry opportunity','Construction on multiple fronts (Lebreton, Tunney\'s)'],
   proTip:'Two plays here: (1) Buy semi-detached on side streets for steady appreciation. (2) Look for condos near Tunney\'s Pasture — the federal land release will be transformative when it happens, and the OP Hub designation confirms the intent.'},

  {id:'westboro',name:'Westboro / Wellington West',area:'West Central',
   opType:'innerurban',opLabel:'Mainstreet (Richmond Rd & Wellington St W) + Neighbourhood',color:'#e74c3c',
   poly:[[45.408,-75.766],[45.406,-75.736],[45.390,-75.735],[45.388,-75.765]],
   newZone:'N2 / TM Richmond Road Mainstreet / Wellington West Mainstreet',
   currentState:'Ottawa\'s trendiest neighbourhood — premium prices reflect lifestyle demand, Ottawa River access, and Wellington Village/Westboro Village identity. Wellington West Secondary Plan (Plan 20) governs Wellington Street West with a Mainstreet designation: 6 storeys (20m) is the general maximum, with corner incentives up to 8 storeys (27.5m) at key intersections like Parkdale/Holland. Richmond Road also designated Mainstreet. No surface parking between building faces and the street. Heritage buildings protected. Churchill Avenue connection to Scott Street designated Minor Corridor.',
   futureState:'Wellington West allows up to 9 storeys where community benefits are secured — affordable housing, heritage retention, public realm improvements. Shared parking on underutilized rear surface lots encouraged. Parkdale/Holland gateway architecture improvements planned. Bayview Station LRT will continue to anchor eastern end. Westboro O-Train Station (future Lincoln Fields extension) adds another access point. Limited upward movement in prices due to premium already baked in — best value is on side streets.',
   priceRange:'$620K–$1.2M',medianPrice:845000,price5yr:34,rentYield:3.5,
   lrtDist:1.0,lrtStations:['Lincoln Fields','Bayview'],
   bestFor:'Premium lifestyle buyers, long-term hold',types:['detached','semi-detached'],
   investScore:63,tScore:6,gScore:7,mScore:8,aScore:2,pScore:4,
   highlights:['Wellington West Secondary Plan confirmed: 6–9 storeys on mainstreet','Richmond Road and Wellington Street W both Mainstreet designation','Ottawa River + Westboro Beach walkability','Two LRT stations within 1–1.5km'],
   risks:['Very high entry prices — appreciation mostly baked in','4-storey min. raises barrier on Mainstreet redevelopment','Heritage restrictions limit some intensification'],
   proTip:'Buy side streets 1–2 blocks off Wellington W or Richmond Rd for best value. Parkdale Avenue area near the Parkdale/Holland gateway intersection may see improvement. Don\'t overpay for front-street addresses — the premium is already there.'},

  {id:'vanier',name:'Vanier / McArthur',area:'East Central',
   opType:'innerurban',opLabel:'Inner Urban',color:'#e74c3c',
   poly:[[45.446,-75.665],[45.444,-75.637],[45.424,-75.637],[45.423,-75.665]],
   newZone:'N2–N3',
   currentState:'Ottawa\'s most affordable inner-city neighbourhood. Active revitalization. Multicultural character. Close to downtown but significant price discount.',
   futureState:'Aggressive gentrification expected 2025-2030. City of Ottawa Vanier Action Plan investing $50M+ in infrastructure. New N2/N3 zoning allows more density. Best value play in Ottawa.',
   priceRange:'$340K–$580K',medianPrice:450000,price5yr:42,rentYield:5.8,
   lrtDist:1.2,lrtStations:['St-Laurent'],
   bestFor:'Investors, budget-conscious first-time buyers',types:['semi-detached','condo','detached'],
   investScore:88,tScore:7,gScore:9,mScore:10,aScore:9,pScore:8,
   highlights:['Lowest prices in inner Ottawa','42% appreciation in 5 years','City revitalization investment','Strong rental demand'],
   risks:['Crime rate still elevated','Some blocks still rough','Slow revitalization timeline'],
   proTip:'#1 value play in Ottawa. Buy on McArthur Ave corridor or near St-Laurent Blvd for best combination of transit access and appreciation potential.'},

  {id:'byward',name:'ByWard Market / Lowertown',area:'Central Ottawa',
   opType:'downtown',opLabel:'Central Area',color:'#c0392b',
   poly:[[45.436,-75.698],[45.434,-75.672],[45.418,-75.672],[45.419,-75.698]],
   newZone:'MC / N4-N5',
   currentState:'Ottawa\'s historic market district. Tourism, nightlife, restaurants. Dense condos. Close to Parliament and federal government.',
   futureState:'Rideau-Sussex corridor intensification. Heritage preservation balanced with new condo towers. Rideau Street TM allowing significant new height.',
   priceRange:'$380K–$780K',medianPrice:540000,price5yr:25,rentYield:5.1,
   lrtDist:0.4,lrtStations:['Rideau'],
   bestFor:'Short-term rental investors (Airbnb), federal workers',types:['condo'],
   investScore:73,tScore:9,gScore:8,mScore:6,aScore:6,pScore:6,
   highlights:['Rideau LRT station','ByWard Market walkability','Strong tourism rental demand'],
   risks:['Airbnb regulations may tighten','Heritage restrictions limit some growth'],
   proTip:'Studio and 1-bed condos do best here. High Airbnb potential but check City of Ottawa STR regulations.'},

  // ── WEST OTTAWA ──
  {id:'kanata-res',name:'Kanata (Residential)',area:'West Ottawa',
   opType:'urban',opLabel:'General Urban',color:'#3498db',
   poly:[[45.380,-75.930],[45.378,-75.858],[45.327,-75.858],[45.325,-75.930]],
   newZone:'N1–N2',
   currentState:'Ottawa\'s largest tech suburb. Ericsson, Nokia, QNX campuses. Bridlewood, Beaverbrook, Morgan\'s Grant, Kanata Lakes. Predominantly detached homes, good schools.',
   futureState:'Stage 2 West LRT reaches Bells Corners (bordering Kanata) by 2025. Kanata Centrum MUC approved for significant intensification. Limited supply drives sustained demand.',
   priceRange:'$550K–$950K',medianPrice:720000,price5yr:36,rentYield:3.8,
   lrtDist:3.5,lrtStations:['Future: Bells Corners area'],
   bestFor:'Tech workers, family buyers',types:['detached','townhouse'],
   investScore:70,tScore:4,gScore:6,mScore:9,aScore:3,pScore:6,
   highlights:['Tech employment hub','Top school catchments','Kanata Lakes premium'],
   risks:['No direct LRT currently','High prices relative to transit access','Long commute without car'],
   proTip:'Bridlewood and Morgan\'s Grant offer best value in Kanata. Prices near Kanata North tech park command premium.'},

  {id:'kanata-north-emp',name:'Kanata North Tech Park',area:'West Ottawa',
   opType:'employment',opLabel:'Employment Area',color:'#27ae60',
   poly:[[45.378,-75.930],[45.375,-75.888],[45.348,-75.888],[45.347,-75.930]],
   newZone:'IL/IG – Industrial/Tech',
   currentState:'Ottawa\'s Silicon Valley North. 500+ tech companies. Ericsson, Nokia, BlackBerry QNX, L3Harris, Ciena. 30,000+ jobs. No residential permitted.',
   futureState:'Protected employment area. Federal gov\'t has invested in this corridor. Kanata North Business Association lobbying for some mixed-use at edges. Unlikely to see residential before 2030.',
   priceRange:'N/A (employment only)',medianPrice:0,price5yr:0,rentYield:0,
   lrtDist:4.0,lrtStations:['Future: Bells Corners extension'],
   bestFor:'Proximity buyers in adjacent residential areas',types:[],
   investScore:0,tScore:0,gScore:0,mScore:0,aScore:0,pScore:0,
   highlights:['30,000+ tech jobs','Protected employment zone','Drives premium for nearby residential'],
   risks:['No residential investment here','Commuter traffic congestion'],
   proTip:'Buy residential in Bridlewood (R1 homes ~$600K) to benefit from proximity to this employment zone without paying tech-premium prices.'},

  {id:'stittsville',name:'Stittsville Main Street',area:'West Ottawa',
   opType:'village',opLabel:'Village Mainstreet (4-Storey Max)',color:'#7f8c8d',
   poly:[[45.286,-75.960],[45.284,-75.885],[45.238,-75.885],[45.236,-75.960]],
   newZone:'N1 / Village Mainstreet (Stittsville Main Street Secondary Plan)',
   currentState:'Stittsville Main Street Secondary Plan (Plan 18) strictly protects the village character. Maximum building height on the Mainstreet is 4 storeys — no exceptions on most lots. Corner intersections (Carp Rd, Hobin, Beverly, Abbott, Orville, Carleton Cathcart) require 2-storey minimum. Buildings adjacent to front/corner lot lines capped at 3 storeys. Mixed-use buildings with non-residential ground floors encouraged but not mandated. Poole Creek is a protected natural feature. Key boundaries: Hazeldean Rd (north), Fernbank Rd (south).',
   futureState:'Stittsville is firmly a low-rise village — the OP and Secondary Plan both protect this. No high-rise is permitted or planned. Growth will come from new detached/townhouse subdivisions (Fernbank community) west and south of the existing village. The village main street will modestly intensify within 4-storey limits. Long-term: Ottawa\'s OP targets transit expansion to Stittsville (Stage 3 LRT), but no timeline confirmed.',
   priceRange:'$530K–$830K',medianPrice:660000,price5yr:33,rentYield:3.4,
   lrtDist:10.0,lrtStations:['No LRT — Stage 3 (future, unconfirmed timeline)'],
   bestFor:'Family buyers, car-dependent lifestyle',types:['detached'],
   investScore:55,tScore:1,gScore:5,mScore:8,aScore:4,pScore:4,
   highlights:['Good school catchments','Fernbank community new builds available','Larger lots than inner Ottawa','Protected village character (stable prices)'],
   risks:['4-storey hard maximum — no TOD upside','No LRT (Stage 3 timeline unknown)','Car-dependent — long commute to downtown without car'],
   proTip:'Stittsville is a family lifestyle buy, not an investor play. The OP explicitly limits this to village character. Best value in newer Fernbank subdivision (south). Don\'t expect rapid appreciation without transit.'},

  // ── SOUTH OTTAWA ──
  {id:'barrhaven',name:'Barrhaven Downtown Hub',area:'South Ottawa',
   opType:'muc',opLabel:'Hub (Barrhaven Downtown Secondary Plan)',color:'#7c3aed',
   poly:[[45.335,-75.778],[45.333,-75.706],[45.268,-75.706],[45.265,-75.778]],
   newZone:'Hub + Mixed-Use Corridor (Chapman Mills Dr)',
   currentState:'Barrhaven Downtown Secondary Plan covers ~165 hectares bounded by Strandherd Drive (north), Longfields Drive (east), Kennedy-Burnett SWM Facility (west), and Jock River (south). Currently has a grade-separated Transitway with Marketplace Station and Barrhaven Centre Station. Minimum densities: Station Area 150 units/net ha, Mixed-Use Corridor 75 units/net ha, Mixed-Use Neighbourhood 60 units/net ha, Neighbourhood 50 units/net ha. Buildings up to 30 storeys permitted within 400m of transit stations.',
   futureState:'O-Train Line 1 extension + Chapman Mills Transitway (four-lane road with centre-median transit) planned for Barrhaven Downtown. A new Civic Complex is envisioned at Barrhaven Centre Station. South of Chapman Mills Drive evolves to compact urban housing. Strandherd Retail District (power centres) must intensify surface parking over time. Tewin (35,000-home development south of Barrhaven, with Algonquins of Ontario) planned for 2027+.',
   priceRange:'$500K–$800K',medianPrice:645000,price5yr:40,rentYield:3.8,
   lrtDist:3.5,lrtStations:['Future: Marketplace Station','Barrhaven Centre Station (O-Train Line 1 extension)'],
   bestFor:'Family buyers, mid-term investors, transit-arrival plays',types:['detached','townhouse'],
   investScore:78,tScore:5,gScore:9,mScore:10,aScore:5,pScore:9,
   highlights:['Up to 30 storeys near Marketplace/Barrhaven Centre stations (OP-confirmed)','Station Area min. 150 units/net ha — highest density obligation south of greenbelt','O-Train Line 1 extension + Chapman Mills Transitway planned','Tewin development (35,000 homes) = massive long-term demand driver','Secondary Plan formally in place — development ready'],
   risks:['Car-dependent until O-Train extension opens','Tewin supply may moderate appreciation pace','Infrastructure charges and transit timing uncertainty'],
   proTip:'Buy near Marketplace Station or along Chapman Mills Drive corridor now — the OP formally mandates 30-storey heights and 150 units/ha. The O-Train extension is the catalyst. Townhouses near future station areas are the sweet spot for first-time buyers.'},

  {id:'barrhaven-south-future',name:'Barrhaven South (Tewin)',area:'South Ottawa',
   opType:'future',opLabel:'Future Urban Area',color:'#e67e22',
   poly:[[45.268,-75.778],[45.265,-75.706],[45.220,-75.706],[45.218,-75.778]],
   newZone:'Future – Residential',
   currentState:'Currently agricultural land south of Barrhaven. The Tewin development (Algonquins of Ontario + Trinity Development Group) approved for 35,000-home community. No services yet.',
   futureState:'Phase 1 infrastructure (roads, water, sewer) starting 2025-2026. First homes available ~2027-2028. Will be connected to Trillium Line extension. One of the largest new communities in Canadian history.',
   priceRange:'Future new builds: est. $530K–$720K',medianPrice:610000,price5yr:0,rentYield:0,
   lrtDist:0,lrtStations:['Planned new stations'],
   bestFor:'Pre-construction investors, early-phase new build buyers',types:['detached','townhouse'],
   investScore:79,tScore:6,gScore:10,mScore:7,aScore:7,pScore:10,
   highlights:['35,000-home mega-development','Indigenous partnership (unique)','First phases best pricing','Trillium Line connection planned'],
   risks:['Still agricultural — no homes yet','Infrastructure delays possible','Supply shock could slow appreciation'],
   proTip:'Register with builders like Mattamy, Minto, and Richcraft for priority access to Phase 1. Buy early phase for best pricing.'},

  // ── EAST OTTAWA ──
  {id:'orleans',name:'Orléans',area:'East Ottawa',
   opType:'urban',opLabel:'General Urban',color:'#3498db',
   poly:[[45.490,-75.560],[45.488,-75.488],[45.440,-75.488],[45.437,-75.560]],
   newZone:'N1–N2',
   currentState:'Bilingual (French/English) suburb in east Ottawa. Established community. Strong francophone services. Affordable relative to west Ottawa. Confederation Line east extension arrives.',
   futureState:'Massive growth driver: Trim LRT station (eastern terminus). Place d\'Orléans MUC intensification. New subdivisions in Chapel Hill area. East Ottawa becoming more attractive.',
   priceRange:'$450K–$720K',medianPrice:575000,price5yr:35,rentYield:3.9,
   lrtDist:1.5,lrtStations:['Trim','Place d\'Orléans','Convent Glen','Mer Bleue'],
   bestFor:'Value buyers, francophone community',types:['detached','townhouse','semi-detached'],
   investScore:75,tScore:7,gScore:7,mScore:9,aScore:6,pScore:6,
   highlights:['LRT eastern extension','4 LRT stations in community','Cheaper than west Ottawa','Bilingual community'],
   risks:['Less walkable than inner Ottawa','Limited employment locally'],
   proTip:'Chapel Hill South and Trim area offer best value with direct LRT access. Under $500K entry still possible for townhouses.'},

  {id:'trim-muc',name:'Trim LRT Station Area',area:'East Ottawa',
   opType:'muc',opLabel:'Mixed-Use Centre',color:'#7c3aed',
   poly:[[45.475,-75.532],[45.475,-75.510],[45.458,-75.510],[45.458,-75.532]],
   newZone:'MC – Mixed-Use Centre (TOD)',
   currentState:'Eastern terminus of Confederation Line. Trim station opened 2023. Surrounding area still predominantly detached residential with commercial emerging along Innes Road.',
   futureState:'Major TOD intensification planned. MC designation allows 15-30 storey condos within 800m of station. Development applications already submitted. First towers expected 2026-2028.',
   priceRange:'$350K–$580K (condos emerging)',medianPrice:440000,price5yr:32,rentYield:4.5,
   lrtDist:0.2,lrtStations:['Trim (terminus)'],
   bestFor:'Early-stage TOD investors',types:['condo','townhouse'],
   investScore:81,tScore:10,gScore:9,mScore:8,aScore:7,pScore:8,
   highlights:['LRT terminus station','MC designation = max density potential','Early stage = best prices','Eastern growth corridor'],
   risks:['Suburban area — urban amenities still developing','Dependent on development approvals'],
   proTip:'Best LRT-adjacent investment opportunity in east Ottawa. Buy now before towers change the market.'},

  {id:'gloucester-muc',name:'Gloucester Centre / St-Laurent',area:'East-Central Ottawa',
   opType:'muc',opLabel:'Mixed-Use Centre',color:'#7c3aed',
   poly:[[45.415,-75.628],[45.413,-75.608],[45.395,-75.608],[45.393,-75.628]],
   newZone:'MC / AM',
   currentState:'St-Laurent Shopping Centre area. Major LRT stop on Confederation Line. Established commercial hub. Surrounding residential is older N1 stock from 1970s-1980s.',
   futureState:'Major mall redevelopment planned (similar to Lansdowne). 2,000-3,000 new residential units in mixed-use towers. City of Ottawa has identified this as priority intensification node.',
   priceRange:'$360K–$620K',medianPrice:470000,price5yr:30,rentYield:4.6,
   lrtDist:0.5,lrtStations:['St-Laurent'],
   bestFor:'Investors seeking TOD upside',types:['condo','semi-detached'],
   investScore:78,tScore:9,gScore:9,mScore:7,aScore:7,pScore:7,
   highlights:['St-Laurent LRT station','Mall redevelopment potential','Undervalued relative to west LRT nodes'],
   risks:['Area still transitional','Mall redevelopment timeline uncertain'],
   proTip:'Semi-detached homes near St-Laurent Blvd offer great value — within walking distance of LRT but prices haven\'t caught up yet.'},

  {id:'south-keys',name:'South Keys / Greenboro',area:'South-East Ottawa',
   opType:'muc',opLabel:'Hub + Mainstreet (South Keys Secondary Plan)',color:'#7c3aed',
   poly:[[45.395,-75.660],[45.393,-75.635],[45.370,-75.635],[45.368,-75.660]],
   newZone:'Hub (Transit Plaza) + Mainstreet + Mixed-Use',
   currentState:'South Keys Secondary Plan governs this major south Ottawa transit node. South Keys O-Train Station and Greenboro Station are the twin multi-modal hubs. Height limits vary: 12 storeys on Hunt Club Road (west of Sawmill Creek), 15 storeys on Bank Street (Daze St to Hunt Club), and 21 storeys at the Transit Plaza areas near South Keys Station. Airport proximity (Ottawa International Airport Outer Surface at 151.79m) constrains heights in some areas. Sawmill Creek is a protected natural feature. Reduced parking requirements aligned to Downtown Core standards (no minimum in Transit Plaza areas).',
   futureState:'South Keys is evolving from a suburban power-centre corridor into a transit-oriented hub. The 21-storey Transit Plaza designation enables significant TOD. Bank Street mixed-use corridor (15 storeys) will gradually transition from car-oriented retail to mixed-use residential above commercial. Bicycle parking above Downtown Core standards mandated for all new residential. Long-term airport restriction may limit some sites from achieving full 21-storey potential.',
   priceRange:'$370K–$640K',medianPrice:490000,price5yr:32,rentYield:4.4,
   lrtDist:0.4,lrtStations:['South Keys','Greenboro'],
   bestFor:'Value investors, south Ottawa transit play',types:['condo','townhouse'],
   investScore:80,tScore:9,gScore:9,mScore:7,aScore:7,pScore:8,
   highlights:['21 storeys permitted at Transit Plaza near South Keys Station (OP-confirmed)','Two O-Train Trillium Line stations (South Keys + Greenboro)','Reduced parking requirements = lower development cost','Secondary Plan specifically governs area — development certainty'],
   risks:['Airport Outer Surface may limit some heights below 21 storeys','Area still transitional — suburban character predominates','Bank St commercial still car-dominated'],
   proTip:'South Keys is underrated. Two LRT stations, 21-storey TOD designation, and prices well below inner Ottawa. Look for condos within 500m of South Keys Station — the secondary plan is already in place and heights are confirmed.'},

  // ── SOUTHWEST OTTAWA ──
  {id:'bayshore-muc',name:'Bayshore MUC',area:'West-Central Ottawa',
   opType:'muc',opLabel:'Mixed-Use Centre',color:'#7c3aed',
   poly:[[45.368,-75.830],[45.366,-75.800],[45.344,-75.800],[45.342,-75.830]],
   newZone:'MC – Mixed-Use Centre (TOD)',
   currentState:'Bayshore Shopping Centre LRT node. Western Confederation Line terminus until Stage 2. Major bus terminal hub. Navaho Drive and Bayshore Drive residential around the mall.',
   futureState:'Stage 2 West LRT passes through, reducing Bayshore\'s terminus role but maintaining importance. Bayshore mall redevelopment scoped for 1,500-2,000 units. Active development applications.',
   priceRange:'$350K–$640K',medianPrice:480000,price5yr:33,rentYield:4.7,
   lrtDist:0.4,lrtStations:['Bayshore'],
   bestFor:'LRT investors, first-time condo buyers',types:['condo','townhouse'],
   investScore:80,tScore:9,gScore:9,mScore:8,aScore:7,pScore:7,
   highlights:['Bayshore LRT station','Mall redevelopment planned','Affordable entry vs. downtown condos'],
   risks:['Stage 2 reduces transit hub importance','Development timeline uncertain'],
   proTip:'Best value MUC in west Ottawa. Condos here significantly cheaper than downtown with similar LRT access.'},

  {id:'lincoln-fields-muc',name:'Lincoln Fields MUC',area:'West Ottawa',
   opType:'muc',opLabel:'Hub (Lines 1 & 3 Transfer)',color:'#7c3aed',
   poly:[[45.392,-75.798],[45.390,-75.772],[45.372,-75.772],[45.370,-75.798]],
   newZone:'Hub + Mainstreet Corridor (Carling Ave & Richmond Rd)',
   currentState:'Lincoln Fields is a Lines 1 and 3 O-Train transfer station — the only Lines 1/3 junction in Ottawa. The former shopping centre site is transitioning from a dead mall to a dense TOD. Secondary Plan designates a Hub (tallest buildings nearest station), Mainstreet Corridors on Carling and Richmond, and Neighbourhood areas. No minimum parking requirements across the entire Plan area.',
   futureState:'Up to 40 storeys permitted within 400m of Lincoln Fields Station (High-rise III category). High-rise II (30 storeys) and High-rise I (18 storeys) step down away from the station. The 2525 Carling Avenue district is the priority redevelopment site with a planned north-south collector street. Sewer capacity limited through 2034 (Pinecrest Trunk Sewer expansion underway) — first-come, first-served for development. City-owned lands at station primed for mixed-use towers + community hub.',
   priceRange:'$360K–$640K (condos incoming)',medianPrice:455000,price5yr:30,rentYield:4.5,
   lrtDist:0.3,lrtStations:['Lincoln Fields (Lines 1 & 3 transfer)'],
   bestFor:'Patient investors, Lines 1/3 TOD believers',types:['condo'],
   investScore:85,tScore:10,gScore:10,mScore:7,aScore:7,pScore:9,
   highlights:['Only Lines 1/3 transfer station in Ottawa','Up to 40 storeys near station (OP-confirmed)','No minimum parking anywhere in Plan area','2525 Carling Ave = priority redevelopment site','Hub designation with full range of uses permitted'],
   risks:['Sewer capacity limited until 2034 (Pinecrest Trunk expansion)','City-led TOD may be slower than private development','Surrounding N2 residential areas cap height away from Hub'],
   proTip:'Lincoln Fields is the most policy-backed TOD in west Ottawa. The Official Plan officially allows 40 storeys here. Buy within 800m of the station before tower approvals begin — sewer capacity is the only real constraint.'},

  {id:'nepean',name:'Nepean / Merivale',area:'Southwest Ottawa',
   opType:'urban',opLabel:'General Urban',color:'#3498db',
   poly:[[45.380,-75.800],[45.378,-75.730],[45.328,-75.730],[45.326,-75.800]],
   newZone:'N1–N2',
   currentState:'Established suburban area in southwest Ottawa. Mix of 1970s-1990s homes and newer subdivisions. Merivale Road commercial corridor. Near Algonquin College.',
   futureState:'Stage 2 West LRT (Baseline station, Algonquin station) brings transit within reach. Merivale Rd AM zoning intensification. Relatively affordable with improving transit access.',
   priceRange:'$490K–$780K',medianPrice:620000,price5yr:32,rentYield:3.8,
   lrtDist:2.0,lrtStations:['Future: Baseline','Algonquin'],
   bestFor:'Family buyers, students near Algonquin',types:['detached','semi-detached'],
   investScore:68,tScore:5,gScore:6,mScore:8,aScore:5,pScore:5,
   highlights:['Near Algonquin College','Stage 2 LRT approaching','Merivale commercial corridor'],
   risks:['Still car-dependent','Less distinctive than other areas'],
   proTip:'Properties near Baseline Rd and Woodroffe Ave will benefit most from Stage 2 LRT. Look for homes within 1km of planned stations.'},

  {id:'tunneys',name:'Tunney\'s Pasture Hub',area:'West-Central Ottawa',
   opType:'muc',opLabel:'Hub (Scott Street Secondary Plan) — Federal Lands',color:'#7c3aed',
   poly:[[45.412,-75.738],[45.410,-75.718],[45.397,-75.718],[45.396,-75.738]],
   newZone:'Hub designation (Scott Street Secondary Plan, Plan 15) / Federal Campus',
   currentState:'Tunney\'s Pasture is designated a Hub in the Scott Street Secondary Plan (Plan 15) — supporting mid- and high-rise mixed-use development near the O-Train station. Major federal government campus: Health Canada, PHAC, Statistics Canada. Tunney\'s Pasture O-Train Station (Stage 1 western terminus). The Scott Street Secondary Plan emphasizes intensification at transit nodes with the Neighbourhood Line providing a clear boundary between low-rise residential and the higher-density Hub area.',
   futureState:'Tunney\'s Pasture Master Plan (City + NCC + federal collaboration) proposes transformative redevelopment of surplus federal lands: 5,000–10,000 new residential units in mixed residential/office community by 2030–2035. The Hub designation in the Scott Street Secondary Plan supports this density ambition. If federal land release proceeds, this becomes one of Ottawa\'s largest inner-city development opportunities within 400m of LRT.',
   priceRange:'$370K–$680K',medianPrice:505000,price5yr:27,rentYield:4.4,
   lrtDist:0.4,lrtStations:['Tunney\'s Pasture (Line 1)'],
   bestFor:'Federal employees, investors banking on federal land release, Hub designation play',types:['condo','townhouse'],
   investScore:78,tScore:9,gScore:9,mScore:6,aScore:7,pScore:7,
   highlights:['Hub designation confirmed in Scott Street Secondary Plan','Federal land: 5,000–10,000 unit redevelopment potential','Tunney\'s Pasture LRT station (Stage 1)','Clear Neighbourhood Line separates Hub from low-rise areas'],
   risks:['Federal land release timelines unpredictable (government budget cycles)','Campus still dominated by office towers — residential supply absent','No development applications yet filed'],
   proTip:'Condos within 500m of Tunney\'s station are undervalued relative to other Hub-designated areas. The Hub designation is confirmed in the OP. Federal land release is the trigger event — it will likely happen 2030–2035 given housing pressure.'},

  // ── GREENBELT ──
  {id:'greenbelt',name:'NCC Greenbelt',area:'Ottawa (Protected)',
   opType:'greenbelt',opLabel:'NCC Greenbelt',color:'#1a5632',
   poly:[[45.340,-75.840],[45.340,-75.640],[45.265,-75.640],[45.265,-75.840]],
   newZone:'Rural / Protected',
   currentState:'16,000 hectares of protected green space managed by the National Capital Commission. Surrounds central Ottawa like a green ring. Includes farms, forests, nature trails.',
   futureState:'Permanently protected under federal NCC mandate. Some NCC greenbelt lands were released for development in 2022 (controversial) but most reversed by federal government in 2023. Development unlikely.',
   priceRange:'N/A – No residential',medianPrice:0,price5yr:0,rentYield:0,
   lrtDist:99,lrtStations:['No LRT'],
   bestFor:'N/A',types:[],
   investScore:0,tScore:0,gScore:0,mScore:0,aScore:0,pScore:0,
   highlights:['Permanent green space','Nature trails and farms','Quality of life for nearby residents'],
   risks:['No residential investment possible'],
   proTip:'Properties ADJACENT to the Greenbelt (like in Barrhaven or Stittsville) command premium prices for backing onto protected green space.'},

  // ── OUTER AREAS ──
  {id:'kanata-south-future',name:'Kanata South (Future Urban)',area:'West Ottawa',
   opType:'future',opLabel:'Future Urban Area',color:'#e67e22',
   poly:[[45.297,-75.930],[45.295,-75.858],[45.263,-75.858],[45.261,-75.930]],
   newZone:'Future – Residential',
   currentState:'Currently agricultural land south of Stittsville/Kanata. Part of Ottawa\'s new Urban Boundary expansion in the 2021 Official Plan. Active Aggregate Resource areas.',
   futureState:'Long-term growth node (2030-2040). City of Ottawa must approve Secondary Plans before any development. Earliest homes 2030+. Land banking opportunity for patient investors.',
   priceRange:'Current land: $2-5M/acre (future residential est. $570K–$780K)',medianPrice:650000,price5yr:0,rentYield:0,
   lrtDist:99,lrtStations:['No LRT planned'],
   bestFor:'Land banking, very long-term investors',types:[],
   investScore:55,tScore:1,gScore:9,mScore:5,aScore:6,pScore:5,
   highlights:['Part of Urban Boundary expansion','Long-term residential growth designation'],
   risks:['10-15 year timeline','No infrastructure','No LRT planned'],
   proTip:'Not for homebuyers — land banking only. Focus on Barrhaven/Kanata existing residential instead.'},

  {id:'riverside-south',name:'Riverside South',area:'South Ottawa',
   opType:'urban',opLabel:'General Urban',color:'#3498db',
   poly:[[45.327,-75.720],[45.325,-75.665],[45.285,-75.665],[45.283,-75.720]],
   newZone:'N1–N2',
   currentState:'Growing community south of Hunt Club. Relatively new development. Close to Rideau River. Bus transit only currently.',
   futureState:'Trillium Line (Line 2) extending south to Riverside South by 2025-2026. New station will drive TOD and price appreciation. Large undeveloped parcels adjacent to new station site.',
   priceRange:'$510K–$780K',medianPrice:630000,price5yr:37,rentYield:3.6,
   lrtDist:2.0,lrtStations:['Future: Riverside South (Trillium Line)'],
   bestFor:'Buyers anticipating Trillium Line uplift',types:['detached','townhouse'],
   investScore:74,tScore:5,gScore:7,mScore:9,aScore:5,pScore:7,
   highlights:['Trillium Line extension','New community infrastructure','River proximity'],
   risks:['Still developing amenities','Car-dependent until LRT arrives'],
   proTip:'Best time to buy in Riverside South is now, before the Trillium extension drives prices up. Look near the planned station location.'},

  {id:'old-ottawa-east',name:'Old Ottawa East / Main Street',area:'East Central',
   opType:'innerurban',opLabel:'Mainstreet (Main St) + Neighbourhood Low-Rise + Mid-Rise',color:'#e74c3c',
   poly:[[45.415,-75.680],[45.413,-75.658],[45.393,-75.658],[45.391,-75.680]],
   newZone:'Mainstreet (Main St) / N2–N3 / Neighbourhood Low-Rise & Mid-Rise',
   currentState:'Old Ottawa East Secondary Plan (Plan 12) governs this charming riverside neighbourhood. Main Street (Clegg to Echo Drive) is the primary Mainstreet with a 6-storey (20m) absolute cap. Neighbourhood Low-Rise areas limited to 4 storeys. Key policy areas: Hawthorne Ave west of Main St (150 units capacity), Oblate Fathers/Sacré-Coeur site (1,000 units — major redevelopment), and Main St core (350 units). Institutional designation applies to the Oblate Fathers site (St. Paul\'s University / Sacred Heart convent). Rideau Canal and Rideau River define western and eastern boundaries. Steps to Lansdowne Park.',
   futureState:'Oblate Fathers redevelopment (Sacred Heart convent site) = the big play: 1,000 units within this neighbourhood. Main Street intensification continues within 6-storey limit. Trillium Line Carleton station provides south-end transit. Lansdowne 2.0 (across Bank St canal bridge) will drive spillover demand for Main St commercial. Alta Vista Transportation Corridor (AVTC) will eventually improve east-west transit access.',
   priceRange:'$490K–$840K',medianPrice:650000,price5yr:31,rentYield:3.9,
   lrtDist:1.0,lrtStations:['Carleton (Trillium Line)'],
   bestFor:'Character home buyers, lifestyle investors, Oblate redevelopment play',types:['detached','semi-detached','condo'],
   investScore:71,tScore:7,gScore:7,mScore:7,aScore:3,pScore:6,
   highlights:['Oblate Fathers/Sacré-Coeur: 1,000-unit approved redevelopment site','Main Street 6-storey Mainstreet designation (OP-confirmed)','Rideau River waterfront access','Near Lansdowne 2.0 + Glebe spillover'],
   risks:['6-storey hard cap limits tall building investment','High character home prices — limited upside for new builds on residential streets','Main St supply constrained (350 units in core area)'],
   proTip:'Two opportunities: (1) Character home ownership on the pocket streets for lifestyle + long-term hold. (2) Watch for pre-construction condos near the Oblate Fathers redevelopment — 1,000 units in one of Ottawa\'s most desirable inner-city locations.'},
];

// ─── LRT DATA ────────────────────────────────────
const LRT_LINES = [
  {id:'line1-east',color:'#cc0000',weight:5,name:'O-Train Line 1 (East)',
   coords:[
    [45.4694,-75.5220],[45.4578,-75.5455],[45.4520,-75.5660],[45.4662,-75.5230],
    [45.4403,-75.5820],[45.4420,-75.6055],[45.4347,-75.6235],[45.4185,-75.6405],
    [45.4070,-75.6535],[45.4237,-75.6717],[45.4267,-75.6897],[45.4233,-75.6996],
    [45.4180,-75.7055],[45.4133,-75.7183],[45.4105,-75.7290]]},
  {id:'line1-west',color:'#cc0000',weight:5,name:'O-Train Line 1 (West)',
   coords:[
    [45.4105,-75.7290],[45.4042,-75.7285],[45.3902,-75.7875],
    [45.3713,-75.8080],[45.3630,-75.8220],[45.3558,-75.8370],
    [45.3478,-75.8512],[45.3378,-75.8635]]},
  {id:'line2',color:'#008000',weight:5,name:'O-Train Line 2 (Trillium)',
   coords:[
    [45.3040,-75.6725],[45.3290,-75.6565],[45.3505,-75.6455],
    [45.3695,-75.6355],[45.3785,-75.6458],[45.3920,-75.6855],
    [45.3827,-75.6967],[45.4023,-75.7085],[45.4105,-75.7290]]},
];

const LRT_STATIONS = [
  // Line 1 East
  {n:'Trim',lat:45.4694,lng:-75.5220,line:'line1',type:'terminus'},
  {n:'Mer Bleue',lat:45.4578,lng:-75.5455,line:'line1',type:'station'},
  {n:'Convent Glen',lat:45.4520,lng:-75.5660,line:'line1',type:'station'},
  {n:'Place d\'Orléans',lat:45.4662,lng:-75.5230,line:'line1',type:'station'},
  {n:'Blair',lat:45.4403,lng:-75.5820,line:'line1',type:'station'},
  {n:'Cyrville',lat:45.4420,lng:-75.6055,line:'line1',type:'station'},
  {n:'St-Laurent',lat:45.4347,lng:-75.6235,line:'line1',type:'station'},
  {n:'Tremblay',lat:45.4185,lng:-75.6405,line:'line1',type:'station'},
  {n:'Hurdman',lat:45.4070,lng:-75.6535,line:'line1',type:'transfer'},
  {n:'uOttawa',lat:45.4237,lng:-75.6717,line:'line1',type:'station'},
  {n:'Rideau',lat:45.4267,lng:-75.6897,line:'line1',type:'station'},
  {n:'Parliament',lat:45.4233,lng:-75.6996,line:'line1',type:'station'},
  {n:'Lyon',lat:45.4180,lng:-75.7055,line:'line1',type:'station'},
  {n:'Pimisi',lat:45.4133,lng:-75.7183,line:'line1',type:'station'},
  {n:'Bayview',lat:45.4105,lng:-75.7290,line:'line1',type:'transfer'},
  // Line 1 West
  {n:'Tunney\'s Pasture',lat:45.4042,lng:-75.7285,line:'line1',type:'station'},
  {n:'Lincoln Fields',lat:45.3902,lng:-75.7875,line:'line1',type:'station'},
  {n:'Iris',lat:45.3713,lng:-75.8080,line:'line1',type:'station'},
  {n:'Baseline',lat:45.3630,lng:-75.8220,line:'line1',type:'station'},
  {n:'Algonquin',lat:45.3558,lng:-75.8370,line:'line1',type:'station'},
  {n:'Woodroffe',lat:45.3478,lng:-75.8512,line:'line1',type:'station'},
  {n:'Bells Corners',lat:45.3378,lng:-75.8635,line:'line1',type:'terminus'},
  // Line 2
  {n:'Riverside South',lat:45.3040,lng:-75.6725,line:'line2',type:'terminus'},
  {n:'Leitrim',lat:45.3290,lng:-75.6565,line:'line2',type:'station'},
  {n:'Bowesville',lat:45.3505,lng:-75.6455,line:'line2',type:'station'},
  {n:'Greenboro',lat:45.3695,lng:-75.6355,line:'line2',type:'station'},
  {n:'South Keys',lat:45.3785,lng:-75.6458,line:'line2',type:'station'},
  {n:'Carling',lat:45.3920,lng:-75.6855,line:'line2',type:'station'},
  {n:'Carleton',lat:45.3827,lng:-75.6967,line:'line2',type:'station'},
  {n:'Dow\'s Lake',lat:45.4023,lng:-75.7085,line:'line2',type:'station'},
  {n:'Bayview',lat:45.4105,lng:-75.7290,line:'line2',type:'transfer'},
];

// ─── MAP STATE ────────────────────────────────────
let opMap=null,zoningMap=null,investMap=null;
let opInit=false,zoningInit=false,investInit=false;
let opView='current';
let opPolygons=[],zoningPolygons=[],lrtLayerGroup=null,stationLayerGroup=null;
let investHeat=null,investMarkers=null,lrtLayerGroups={};
let opLayerGroup=null,zoningLayerGroup=null;
const allMapGroups={opZones:null,lrt:null,stations:null,heatmap:null};
const zoningGroupMap={residential:null,mainstreet:null,mixed:null,employment:null,openspace:null,lrtZ:null};

// ─── COLOUR HELPERS ───────────────────────────────
function opColor(type){
  return{downtown:'#c0392b',innerurban:'#e74c3c',urban:'#3498db',muc:'#7c3aed',
         mainstreet:'#f39c12',arterial:'#d68910',future:'#e67e22',
         employment:'#27ae60',greenbelt:'#1a5632',village:'#7f8c8d'}[type]||'#999';
}
function scoreColor(s){
  if(s>=85)return'#059669';if(s>=75)return'#0ea5e9';
  if(s>=65)return'#f59e0b';if(s>0)return'#ef4444';return'#9ca3af';
}
function scoreLabel(s){
  if(s>=85)return'🟢 Excellent';if(s>=75)return'🔵 Strong';
  if(s>=65)return'🟡 Good';if(s>0)return'🔴 Moderate';return'—';
}

// ─── POPUP BUILDERS ──────────────────────────────
function makeOPPopup(h,view){
  const price=view==='future'?h.priceRange:h.priceRange;
  const state=view==='future'?h.futureState:h.currentState;
  const badge=view==='future'?'🔭 Future 2035':'📍 Current 2025';
  return`<div style="min-width:230px;max-width:290px;font-family:inherit;">
    <div style="font-weight:700;font-size:.95rem;margin-bottom:3px">${h.name}</div>
    <div style="display:flex;gap:5px;margin-bottom:8px;flex-wrap:wrap;">
      <span style="background:${opColor(h.opType)};color:#fff;padding:.1rem .5rem;border-radius:50px;font-size:.65rem;font-weight:700">${h.opLabel}</span>
      <span style="background:#f1f5f9;color:#334155;padding:.1rem .5rem;border-radius:50px;font-size:.65rem;font-weight:600">${badge}</span>
    </div>
    <table style="width:100%;font-size:.78rem;border-collapse:collapse;">
      <tr><td style="color:#666;padding:2px 0;width:85px">Zone</td><td style="padding:2px 0">${h.newZone}</td></tr>
      <tr><td style="color:#666;padding:2px 0">Price Range</td><td style="padding:2px 0">${h.priceRange}</td></tr>
      ${h.lrtStations&&h.lrtStations.length?`<tr><td style="color:#666;padding:2px 0">LRT</td><td style="padding:2px 0">${h.lrtStations.slice(0,2).join(', ')}</td></tr>`:''}
      ${h.investScore>0?`<tr><td style="color:#666;padding:2px 0">Invest Score</td><td style="padding:2px 0"><strong style="color:${scoreColor(h.investScore)}">${h.investScore}/100</strong></td></tr>`:''}
    </table>
    <div style="margin-top:7px;padding-top:7px;border-top:1px solid #eee;font-size:.76rem;color:#444;line-height:1.5">${state}</div>
    ${h.proTip&&h.investScore>0?`<div style="margin-top:6px;padding:5px 8px;background:#f0fdf4;border-radius:6px;font-size:.72rem;color:#166534">💡 ${h.proTip}</div>`:''}
  </div>`;
}

function makeZoningPopup(z){
  const colors={N1:'#fbbf24',N2:'#f97316',N3:'#ef4444',N4:'#dc2626',N5:'#991b1b',TM:'#f59e0b',AM:'#d97706',MC:'#7c3aed',IG:'#059669',OS:'#1a5632'};
  const c=colors[z.subtype]||'#888';
  return`<div style="min-width:220px;max-width:280px;font-family:inherit;">
    <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">${z.name}</div>
    <span style="background:${c};color:#fff;padding:.15rem .6rem;border-radius:50px;font-size:.7rem;font-weight:700;display:inline-block;margin-bottom:8px">${z.subtype}</span>
    <table style="width:100%;font-size:.78rem;border-collapse:collapse;">
      <tr><td style="color:#666;padding:2px 0;width:90px">Zone</td><td style="padding:2px 0">${z.zone}</td></tr>
      <tr><td style="color:#666;padding:2px 0">Permitted</td><td style="padding:2px 0">${z.permitted}</td></tr>
      <tr><td style="color:#666;padding:2px 0">Height</td><td style="padding:2px 0">${z.height}</td></tr>
    </table>
    <div style="margin-top:7px;padding-top:7px;border-top:1px solid #eee;font-size:.76rem;color:#444">${z.homebuyer}</div>
  </div>`;
}

function makeInvestPopup(h){
  const bars=`
    <div style="margin-top:8px;">
      ${[['🚇 Transit',h.tScore],['🗺️ OP',h.gScore],['📈 Momentum',h.mScore],['💰 Afford.',h.aScore],['🏗️ Pipeline',h.pScore]].map(([l,v])=>`
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:.72rem;">
        <span style="width:75px;color:#555">${l}</span>
        <div style="flex:1;background:#e5e7eb;border-radius:50px;height:7px;overflow:hidden"><div style="width:${v*10}%;background:${scoreColor(h.investScore)};height:100%;border-radius:50px;"></div></div>
        <span style="font-weight:700;color:${scoreColor(h.investScore)}">${v}</span>
      </div>`).join('')}
    </div>`;
  return`<div style="min-width:240px;max-width:300px;font-family:inherit;">
    <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">${h.name}</div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="width:42px;height:42px;border-radius:50%;background:${scoreColor(h.investScore)};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1rem">${h.investScore}</div>
      <div><div style="font-weight:700;font-size:.85rem">${scoreLabel(h.investScore)}</div><div style="font-size:.72rem;color:#666">${h.priceRange}</div></div>
    </div>
    ${bars}
    <div style="margin-top:8px;padding:5px 8px;background:#f0fdf4;border-radius:6px;font-size:.72rem;color:#166534">💡 ${h.proTip||'No tip available'}</div>
  </div>`;
}

// ─── INIT FUNCTIONS ──────────────────────────────
function addLRTToMap(map){
  const lineGroup=L.layerGroup();
  LRT_LINES.forEach(l=>{
    L.polyline(l.coords,{color:l.color,weight:l.weight,opacity:.85,
      dashArray:l.id==='line2'?'10,4':null})
     .bindTooltip(l.name,{direction:'top'})
     .addTo(lineGroup);
  });
  const stGroup=L.layerGroup();
  LRT_STATIONS.forEach(s=>{
    const col=s.line==='line2'?'#008000':'#cc0000';
    const icon=L.divIcon({className:'',html:`<div style="width:12px;height:12px;background:#fff;border:2.5px solid ${col};border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`,iconSize:[12,12],iconAnchor:[6,6]});
    L.marker([s.lat,s.lng],{icon})
     .bindTooltip(`<b>${s.n}</b><br><span style="font-size:.75rem">${s.type==='transfer'?'Transfer station':s.type==='terminus'?'Terminus':s.line==='line2'?'Trillium Line':'Confederation Line'}</span>`,{direction:'top'})
     .addTo(stGroup);
  });
  return{lineGroup,stGroup};
}

function initOPMap(){
  if(opInit){if(opMap)opMap.invalidateSize();return;}
  opMap=L.map('op-map',{zoomControl:true}).setView([45.390,-75.730],11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',maxZoom:19
  }).addTo(opMap);

  // Render neighbourhood polygons
  opLayerGroup=L.layerGroup().addTo(opMap);
  HOODS.forEach(h=>{
    if(!h.poly||h.investScore===0)return; // skip non-investment areas from OP polygon
    const poly=L.polygon(h.poly,{
      color:opColor(h.opType),fillColor:opColor(h.opType),
      fillOpacity:.3,weight:2,opacity:.8
    });
    poly.bindPopup(makeOPPopup(h,'current'),{maxWidth:310});
    poly.bindTooltip(`<b>${h.name}</b><br><span style="font-size:.75rem">${h.opLabel}</span>`,{sticky:true});
    poly.addTo(opLayerGroup);
    opPolygons.push({hood:h,poly});
  });
  // Also add greenbelt and future areas
  HOODS.filter(h=>h.poly&&h.investScore===0||h.opType==='greenbelt'||h.opType==='future').forEach(h=>{
    if(!h.poly)return;
    const poly=L.polygon(h.poly,{
      color:opColor(h.opType),fillColor:opColor(h.opType),
      fillOpacity:.2,weight:1.5,opacity:.6,dashArray:'6,3'
    });
    poly.bindPopup(makeOPPopup(h,'current'),{maxWidth:310});
    poly.bindTooltip(`<b>${h.name}</b><br><span style="font-size:.75rem">${h.opLabel}</span>`,{sticky:true});
    poly.addTo(opLayerGroup);
  });

  // LRT
  const {lineGroup,stGroup}=addLRTToMap(opMap);
  allMapGroups.lrt=lineGroup.addTo(opMap);
  allMapGroups.stations=stGroup.addTo(opMap);
  allMapGroups.opZones=opLayerGroup;

  opInit=true;
}

function initZoningMap(){
  if(zoningInit){if(zoningMap)zoningMap.invalidateSize();return;}
  zoningMap=L.map('zoning-map',{zoomControl:true}).setView([45.390,-75.730],11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',maxZoom:19
  }).addTo(zoningMap);

  // Map each hood to its primary zoning category
  const zoningData=[
    // ─── N1 ───
    {name:'Kanata Residential',area:'West Ottawa',subtype:'N1',ztype:'residential',
     zone:'N1 – Low Density Residential',permitted:'Detached, secondary suites as-of-right',
     height:'11m (3 storeys)',homebuyer:'Single detached homes. New bylaw allows secondary suites as-of-right — great for rental income. Typical suburban lot 500-800m².',
     poly:[[45.380,-75.930],[45.378,-75.858],[45.327,-75.858],[45.325,-75.930]],color:'#fbbf24'},
    {name:'Barrhaven N1',area:'South Ottawa',subtype:'N1',ztype:'residential',
     zone:'N1 – Low Density Residential',permitted:'Detached, secondary suites',
     height:'11m',homebuyer:'Barrhaven\'s predominantly detached housing stock. Good school catchments.',
     poly:[[45.335,-75.778],[45.333,-75.706],[45.268,-75.706],[45.265,-75.778]],color:'#fbbf24'},
    {name:'Orleans N1/N2',area:'East Ottawa',subtype:'N2',ztype:'residential',
     zone:'N1–N2 – Low/Medium Density',permitted:'Detached, semi-detached, secondary suites',
     height:'11m',homebuyer:'Orléans mix of detached and semi. Fourplex now permitted on larger lots under new bylaw.',
     poly:[[45.490,-75.560],[45.488,-75.488],[45.440,-75.488],[45.437,-75.560]],color:'#f97316'},
    {name:'Nepean N1',area:'Southwest Ottawa',subtype:'N1',ztype:'residential',
     zone:'N1 – Low Density',permitted:'Detached, secondary suites',
     height:'11m',homebuyer:'1970s-1990s suburban housing stock. Improving with LRT Stage 2.',
     poly:[[45.380,-75.800],[45.378,-75.730],[45.328,-75.730],[45.326,-75.800]],color:'#fbbf24'},
    {name:'Stittsville N1',area:'West Ottawa',subtype:'N1',ztype:'residential',
     zone:'N1 – Low Density',permitted:'Detached only',
     height:'11m',homebuyer:'Stittsville\'s quiet suburban streets. Limited intensification.',
     poly:[[45.286,-75.960],[45.284,-75.885],[45.238,-75.885],[45.236,-75.960]],color:'#fbbf24'},
    // ─── N2/N3 ───
    {name:'Centretown N2–N3',area:'Central Ottawa',subtype:'N3',ztype:'residential',
     zone:'N2–N3 – Ground-Oriented / Medium Density',permitted:'Semi, townhouses, triplexes, fourplexes',
     height:'14m (4 storeys)',homebuyer:'Centretown/Glebe mix of housing types. New bylaw allows fourplexes as-of-right on most lots. Great for investors.',
     poly:[[45.414,-75.720],[45.414,-75.682],[45.393,-75.680],[45.388,-75.697],[45.393,-75.720]],color:'#ef4444'},
    {name:'Hintonburg N2',area:'West Central',subtype:'N2',ztype:'residential',
     zone:'N2 – Ground-Oriented',permitted:'Semi, duplex, fourplex (new bylaw)',
     height:'11m',homebuyer:'Best "missing middle" area in Ottawa. Fourplexes now permitted. Character neighbourhood with new infill.',
     poly:[[45.422,-75.740],[45.420,-75.718],[45.408,-75.718],[45.406,-75.740]],color:'#f97316'},
    {name:'Vanier N2–N3',area:'East Central',subtype:'N3',ztype:'residential',
     zone:'N2–N3',permitted:'Semi, townhouse, triplex, fourplex',
     height:'11–14m',homebuyer:'Ottawa\'s best value inner-city zone. Active densification. Fourplexes now allowed.',
     poly:[[45.446,-75.665],[45.444,-75.637],[45.424,-75.637],[45.423,-75.665]],color:'#ef4444'},
    // ─── N4/N5 ───
    {name:'Downtown N4–N5',area:'Central Ottawa',subtype:'N5',ztype:'residential',
     zone:'N4–N5 – High Density Residential',permitted:'High-rise apartments, condos',
     height:'No maximum in some zones',homebuyer:'Downtown Ottawa\'s high-rise residential zone. Condos from $370K studio to $950K+ penthouse. Investor-grade rental demand.',
     poly:[[45.438,-75.720],[45.434,-75.706],[45.434,-75.694],[45.432,-75.686],[45.417,-75.684],[45.409,-75.689],[45.409,-75.708],[45.414,-75.720]],color:'#991b1b'},
    {name:'ByWard N4',area:'Central Ottawa',subtype:'N4',ztype:'residential',
     zone:'N4 – Mid-Rise Apartment',permitted:'Apartments, condos, mixed-use',
     height:'Up to 25m',homebuyer:'Dense urban condo zone. Strong student and professional rental market.',
     poly:[[45.436,-75.698],[45.434,-75.672],[45.418,-75.672],[45.419,-75.698]],color:'#dc2626'},
    // ─── MAINSTREETS ───
    {name:'Bank Street TM',area:'Central Ottawa',subtype:'TM',ztype:'mainstreet',
     zone:'TM – Traditional Mainstreet',permitted:'Ground floor commercial + residential above',
     height:'Up to 25m near LRT, 14m generally',homebuyer:'Ottawa\'s main shopping street. Excellent walkability. New TM zoning adds residential height.',
     poly:[[45.414,-75.688],[45.413,-75.683],[45.387,-75.680],[45.386,-75.688]],color:'#f59e0b'},
    {name:'Carling Ave AM',area:'West Ottawa',subtype:'AM',ztype:'mainstreet',
     zone:'AM – Arterial Mainstreet',permitted:'Commercial + residential above, auto-oriented',
     height:'Up to 35m near LRT',homebuyer:'Major intensification corridor with Stage 2 LRT. New AM heights permit 10+ storeys near Baseline station.',
     poly:[[45.408,-75.738],[45.406,-75.720],[45.394,-75.720],[45.393,-75.860],[45.395,-75.860],[45.396,-75.738]],color:'#d97706'},
    {name:'St-Laurent Blvd AM',area:'East Ottawa',subtype:'AM',ztype:'mainstreet',
     zone:'AM – Arterial Mainstreet',permitted:'Commercial + residential above',
     height:'Up to 30m',homebuyer:'North-south arterial. LRT adjacency. Growing residential intensification.',
     poly:[[45.448,-75.628],[45.446,-75.612],[45.390,-75.610],[45.389,-75.626]],color:'#d97706'},
    // ─── MIXED-USE ───
    {name:'Bayshore MC',area:'West Ottawa',subtype:'MC',ztype:'mixed',
     zone:'MC – Mixed-Use Centre',permitted:'High-rise residential, large retail, office',
     height:'No maximum (tower sites)',homebuyer:'Bayshore LRT node. Maximum density permitted. New towers approved.',
     poly:[[45.368,-75.830],[45.366,-75.800],[45.344,-75.800],[45.342,-75.830]],color:'#7c3aed'},
    {name:'Lincoln Fields MC',area:'West Ottawa',subtype:'MC',ztype:'mixed',
     zone:'MC – Mixed-Use Centre',permitted:'High-rise mixed-use',
     height:'No maximum',homebuyer:'Ottawa\'s largest upcoming TOD redevelopment. City-owned land being developed.',
     poly:[[45.392,-75.798],[45.390,-75.772],[45.372,-75.772],[45.370,-75.798]],color:'#7c3aed'},
    {name:'Gloucester MC',area:'East Ottawa',subtype:'MC',ztype:'mixed',
     zone:'MC – Mixed-Use Centre',permitted:'High-rise mixed-use, large retail',
     height:'No maximum at LRT node',homebuyer:'St-Laurent mall area. Redevelopment pending. LRT access.',
     poly:[[45.415,-75.628],[45.413,-75.608],[45.395,-75.608],[45.393,-75.628]],color:'#7c3aed'},
    {name:'Trim MC',area:'East Ottawa',subtype:'MC',ztype:'mixed',
     zone:'MC – Mixed-Use Centre',permitted:'Mixed-use tower development',
     height:'15-30 storeys',homebuyer:'Eastern LRT terminus TOD. Best emerging east Ottawa investment.',
     poly:[[45.475,-75.532],[45.475,-75.510],[45.458,-75.510],[45.458,-75.532]],color:'#7c3aed'},
    // ─── EMPLOYMENT ───
    {name:'Kanata North Tech',area:'West Ottawa',subtype:'IG',ztype:'employment',
     zone:'IL/IG – Industrial/Tech Employment',permitted:'Office, R&D, light industrial, tech campus',
     height:'Varies',homebuyer:'Ottawa\'s Silicon Valley North. No residential permitted. Proximity increases nearby residential values.',
     poly:[[45.378,-75.930],[45.375,-75.888],[45.348,-75.888],[45.347,-75.930]],color:'#059669'},
    // ─── OPEN SPACE ───
    {name:'NCC Greenbelt',area:'Ottawa',subtype:'OS',ztype:'openspace',
     zone:'Rural / NCC Protected',permitted:'Agriculture, conservation, recreation',
     height:'N/A',homebuyer:'Permanently protected. Properties adjacent to Greenbelt command premium. No residential development.',
     poly:[[45.340,-75.840],[45.340,-75.640],[45.265,-75.640],[45.265,-75.840]],color:'#1a5632'},
  ];

  const zGroups={residential:L.layerGroup(),mainstreet:L.layerGroup(),mixed:L.layerGroup(),employment:L.layerGroup(),openspace:L.layerGroup()};
  zoningData.forEach(z=>{
    const poly=L.polygon(z.poly,{
      color:z.color,fillColor:z.color,fillOpacity:.3,weight:2,opacity:.8
    });
    poly.bindPopup(makeZoningPopup(z),{maxWidth:300});
    poly.bindTooltip(`<b>${z.name}</b><br><span style="font-size:.74rem">${z.zone}</span>`,{sticky:true});
    poly.addTo(zGroups[z.ztype]);
  });
  Object.keys(zGroups).forEach(k=>{zoningGroupMap[k]=zGroups[k];zGroups[k].addTo(zoningMap);});
  const {lineGroup,stGroup}=addLRTToMap(zoningMap);
  zoningGroupMap.lrtZ=lineGroup;lineGroup.addTo(zoningMap);stGroup.addTo(zoningMap);
  zoningInit=true;
}

function initInvestMap(){
  if(investInit){if(investMap)investMap.invalidateSize();return;}
  investMap=L.map('invest-map',{zoomControl:true}).setView([45.390,-75.730],11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',maxZoom:19
  }).addTo(investMap);
  renderInvestMap();
  const {lineGroup,stGroup}=addLRTToMap(investMap);
  lrtLayerGroups.lineGroup=lineGroup.addTo(investMap);
  lrtLayerGroups.stGroup=stGroup.addTo(investMap);
  investInit=true;
}

function renderInvestMap(){
  if(!investMap)return;
  if(investHeat&&investMap.hasLayer(investHeat))investMap.removeLayer(investHeat);
  if(investMarkers&&investMap.hasLayer(investMarkers))investMap.removeLayer(investMarkers);
  const heatData=[];
  const markerGroup=L.layerGroup();
  HOODS.filter(h=>h.investScore>0).forEach(h=>{
    const center=getPolyCentroid(h.poly);
    if(!center)return;
    heatData.push([center[0],center[1],h.investScore/100]);
    const icon=L.divIcon({className:'',
      html:`<div style="width:${24+h.investScore/10}px;height:${24+h.investScore/10}px;background:${scoreColor(h.investScore)};border:2px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:.75rem;box-shadow:0 2px 6px rgba(0,0,0,.3)">${h.investScore}</div>`,
      iconSize:[34,34],iconAnchor:[17,17]
    });
    L.marker(center,{icon}).bindPopup(makeInvestPopup(h),{maxWidth:320}).addTo(markerGroup);
  });
  if(typeof L.heatLayer==='function'){
    investHeat=L.heatLayer(heatData,{radius:60,blur:40,maxZoom:13,gradient:{0.4:'#fef3c7',0.65:'#fbbf24',0.8:'#f97316',1.0:'#e11d48'}}).addTo(investMap);
  }
  investMarkers=markerGroup.addTo(investMap);
}

function getPolyCentroid(poly){
  if(!poly||!poly.length)return null;
  const lat=poly.reduce((s,p)=>s+p[0],0)/poly.length;
  const lng=poly.reduce((s,p)=>s+p[1],0)/poly.length;
  return[lat,lng];
}

// ─── INVESTMENT RANKINGS UI ──────────────────────
function renderInvestmentList(hoodies){
  const el=document.getElementById('investment-list');
  if(!el)return;
  const sorted=[...hoodies].filter(h=>h.investScore>0).sort((a,b)=>b.investScore-a.investScore);
  if(!sorted.length){el.innerHTML='<div class="card" style="text-align:center;color:var(--gray)">No results for these filters.</div>';return;}
  el.innerHTML=sorted.map((h,i)=>`
    <div class="card" style="margin-bottom:.8rem;padding:1rem 1.2rem;cursor:pointer;transition:box-shadow .2s;border-left:4px solid ${scoreColor(h.investScore)}" onclick="jumpToHood('${h.id}')">
      <div style="display:flex;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:.6rem;flex-shrink:0;">
          <div style="width:32px;height:32px;background:#f1f5f9;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#475569;font-size:.8rem">${i+1}</div>
          <div style="width:52px;height:52px;border-radius:50%;background:${scoreColor(h.investScore)};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1.1rem">${h.investScore}</div>
        </div>
        <div style="flex:1;min-width:180px;">
          <div style="font-weight:700;font-size:.97rem;color:var(--navy)">${h.name} <span style="font-size:.75rem;color:var(--gray);font-weight:500">${h.area}</span></div>
          <div style="font-size:.78rem;margin:.2rem 0;">${scoreLabel(h.investScore)} · <span style="color:var(--sky)">${h.opLabel}</span> · ${h.priceRange}</div>
          <div style="font-size:.77rem;color:#555;margin-top:.3rem;line-height:1.5">${h.currentState.substring(0,110)}…</div>
        </div>
        <div style="min-width:140px;">
          ${[['🚇 Transit',h.tScore,'#dbeafe','#1e40af'],['🗺️ OP Growth',h.gScore,'#ede9fe','#5b21b6'],['📈 Momentum',h.mScore,'#fef3c7','#92400e'],['💰 Affordability',h.aScore,'#dcfce7','#166534'],['🏗️ Pipeline',h.pScore,'#fce7f3','#9d174d']].map(([l,v,bg,tc])=>`
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
            <span style="font-size:.68rem;color:#666;width:72px">${l}</span>
            <div style="flex:1;background:#e5e7eb;border-radius:50px;height:6px;overflow:hidden;min-width:40px"><div style="width:${v*10}%;background:${scoreColor(h.investScore)};height:100%;border-radius:50px"></div></div>
            <span style="font-size:.72rem;font-weight:700;color:${scoreColor(h.investScore)}">${v}</span>
          </div>`).join('')}
        </div>
      </div>
      ${h.proTip?`<div style="margin-top:.6rem;padding:.4rem .7rem;background:#f0fdf4;border-radius:6px;font-size:.75rem;color:#166534">💡 ${h.proTip}</div>`:''}
      <div style="margin-top:.5rem;display:flex;gap:.4rem;flex-wrap:wrap;">
        ${h.highlights.map(hl=>`<span style="background:#f1f5f9;color:#334155;padding:.15rem .55rem;border-radius:50px;font-size:.68rem">${hl}</span>`).join('')}
      </div>
    </div>`).join('');
}

function jumpToHood(id){
  const h=HOODS.find(x=>x.id===id);if(!h)return;
  switchOttTab('invest',document.querySelector('.ott-tab:nth-child(3)'));
  setTimeout(()=>{
    if(!investInit)initInvestMap();
    const c=getPolyCentroid(h.poly);
    if(c)investMap.setView(c,13);
  },200);
}

function filterInvestment(){
  const budget=+document.getElementById('inv-budget')?.value||0;
  const type=document.getElementById('inv-type')?.value||'';
  const horizon=document.getElementById('inv-horizon')?.value||'';
  let filtered=HOODS.filter(h=>h.investScore>0);
  if(budget===400000)filtered=filtered.filter(h=>h.medianPrice<400000);
  else if(budget===550000)filtered=filtered.filter(h=>h.medianPrice>=400000&&h.medianPrice<550000);
  else if(budget===750000)filtered=filtered.filter(h=>h.medianPrice>=550000&&h.medianPrice<750000);
  else if(budget===999999)filtered=filtered.filter(h=>h.medianPrice>=750000);
  if(type)filtered=filtered.filter(h=>h.types&&h.types.some(t=>t.includes(type)));
  renderInvestmentList(filtered);
}

// ─── MAP CONTROLS ─────────────────────────────────
function toggleMapLayer(key,on){
  const g=allMapGroups[key];if(!g||!opMap)return;
  if(on)g.addTo(opMap);else if(opMap.hasLayer(g))opMap.removeLayer(g);
}
function toggleZLayer(key,on){
  const g=zoningGroupMap[key];if(!g||!zoningMap)return;
  if(on)g.addTo(zoningMap);else if(zoningMap.hasLayer(g))zoningMap.removeLayer(g);
}
function toggleILayer(key,on){
  if(key==='heat'&&investHeat){if(on)investHeat.addTo(investMap);else investMap.removeLayer(investHeat);}
  if(key==='markers'&&investMarkers){if(on)investMarkers.addTo(investMap);else investMap.removeLayer(investMarkers);}
  if(key==='lrtI'&&lrtLayerGroups.lineGroup){
    if(on){lrtLayerGroups.lineGroup.addTo(investMap);lrtLayerGroups.stGroup.addTo(investMap);}
    else{investMap.removeLayer(lrtLayerGroups.lineGroup);investMap.removeLayer(lrtLayerGroups.stGroup);}
  }
}

// ─── CURRENT / FUTURE TOGGLE ─────────────────────
function setOPView(view){
  opView=view;
  document.getElementById('op-btn-current').style.cssText='padding:.35rem 1rem;border-radius:50px;border:none;cursor:pointer;font-size:.8rem;font-weight:700;'+(view==='current'?'background:var(--sky);color:#fff;':'background:transparent;color:var(--gray);');
  document.getElementById('op-btn-future').style.cssText='padding:.35rem 1rem;border-radius:50px;border:none;cursor:pointer;font-size:.8rem;font-weight:700;'+(view==='future'?'background:#f97316;color:#fff;':'background:transparent;color:var(--gray);');
  document.getElementById('op-current-cards').style.display=view==='current'?'block':'none';
  document.getElementById('op-future-cards').style.display=view==='future'?'block':'none';
  // Update polygon popups and colours for future view
  if(opInit&&opMap){
    opPolygons.forEach(({hood:h,poly})=>{
      const futureColor=h.opType==='urban'&&h.futureState.includes('intensif')?'#7c3aed':opColor(h.opType);
      const newColor=view==='future'?futureColor:opColor(h.opType);
      poly.setStyle({fillColor:newColor,color:newColor});
      poly.setPopupContent(makeOPPopup(h,view));
    });
  }
}

// ─── SEARCH ──────────────────────────────────────
function searchOP(q){
  if(!opInit||!opMap)return;
  const term=q.trim().toLowerCase();
  opPolygons.forEach(({hood:h,poly})=>{
    const match=!term||h.name.toLowerCase().includes(term)||h.opLabel.toLowerCase().includes(term)||h.area.toLowerCase().includes(term);
    poly.setStyle({fillOpacity:match?.3:.05,opacity:match?.8:.2});
    if(match&&term&&opPolygons.filter(x=>x.hood.name.toLowerCase().includes(term)).length===1){
      const c=getPolyCentroid(h.poly);if(c)opMap.setView(c,13);poly.openPopup();
    }
  });
}
function searchZoning(q){
  if(!zoningInit||!zoningMap)return;
  // Reset if empty
}

// ─── TAB SWITCHER ─────────────────────────────────
function switchOttTab(tab,el){
  document.querySelectorAll('.ott-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.ott-pane').forEach(p=>p.classList.remove('active'));
  if(el)el.classList.add('active');
  else document.querySelector(`.ott-tab[onclick*="${tab}"]`)?.classList.add('active');
  document.getElementById('ott-'+tab)?.classList.add('active');
  if(tab==='op'){setTimeout(()=>{initOPMap();opMap?.invalidateSize();},80);}
  if(tab==='zoning'){setTimeout(()=>{initZoningMap();zoningMap?.invalidateSize();},80);}
  if(tab==='invest'){
    setTimeout(()=>{
      initInvestMap();investMap?.invalidateSize();
      renderInvestmentList(HOODS);
    },80);
  }
}