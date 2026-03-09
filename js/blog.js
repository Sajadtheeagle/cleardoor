/* ═══════════════════════════════════════════════════════
   CLEARDOOR — BLOG / INSIGHTS  (js/blog.js)
   Pure static — no RSS, no external fetch calls.
   ═══════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────
   ARTICLE DATA  (10 full articles)
   ─────────────────────────────────────────────────────── */
var BLOG_ARTICLES = [
  {
    id:'b1', cat:'market', badge:'new', emoji:'📊', bg:'bcbg-market',
    title:'Ottawa Housing Market Update: Spring 2026 Outlook',
    excerpt:'After a quieter winter, Ottawa\'s resale market is showing early signs of a spring rebound. Here\'s what the latest data means for buyers and sellers heading into the busiest season of the year.',
    readMin:5, date:'2026-03-01', author:'ClearDoor Research', featured:true,
    body:[
      'The Ottawa resale market is entering its traditionally busy spring season with cautious optimism. After the Bank of Canada\'s rate cuts through late 2025, buyers who were sitting on the sidelines are starting to return — but competition remains significantly lower than the frenzied peak of 2021–2022.',
      '<h2>Key Stats: February 2026</h2>',
      '<ul><li>Average resale price: <strong>$643,000</strong> — up 3.1% year-over-year</li><li>Sales volume: 842 units — down 8% vs. Feb 2025</li><li>Active listings: 2,140 — up 22% year-over-year</li><li>Average days on market: 31 days (up from 24 last year)</li></ul>',
      '<h2>What It Means for Buyers</h2>',
      'More inventory means more negotiating power than at any point in the past four years. In many neighbourhoods, conditional offers — once nearly impossible to get accepted — are now routinely included in deals. First-time buyers in the $550K–$700K range are finding the most opportunity.',
      '<div class="callout tip">💡 <strong>Buyer tip:</strong> With average days on market at 31 days, there\'s no need to rush. Budget time for a proper home inspection and, for condos, a full review of the status certificate before waiving conditions.</div>',
      '<h2>Neighbourhoods to Watch</h2>',
      'Kanata, Barrhaven, and Riverside South continue to attract families due to newer schools and lower per-square-foot prices. Downtown and Centretown condos have softened the most — offering real value for first-time buyers comfortable with urban living.',
      'If you\'re planning to buy this spring, getting pre-approved now and working with a buyer\'s agent who has full MLS access will give you a meaningful edge when the right property hits the market.'
    ]
  },
  {
    id:'b2', cat:'mortgage', badge:'trending', emoji:'🏦', bg:'bcbg-mortgage',
    title:'Bank of Canada Rate Hold: What It Means for Your Mortgage',
    excerpt:'The Bank of Canada held its overnight rate at 3.0% in March 2026. We break down the impact on variable-rate holders, where fixed rates are headed, and what borrowers should do now.',
    readMin:4, date:'2026-02-25', author:'ClearDoor Finance', featured:false,
    body:[
      'The Bank of Canada held its policy overnight rate at 3.0% at its March 2026 meeting, in line with market expectations. After a series of cuts from the 5.0% peak, the BoC is in a holding pattern as it monitors how the economy digests lower rates.',
      '<h2>Impact on Variable-Rate Holders</h2>',
      'Variable-rate mortgages are typically priced at Prime minus a discount. With Prime currently at 5.20%, a typical variable rate sits around 4.70%–4.95%. A hold means no immediate change to your monthly payment.',
      '<h2>Where Fixed Rates Stand</h2>',
      'Fixed mortgage rates are tied to Government of Canada bond yields — not the BoC policy rate directly. Bond markets have been relatively stable, keeping 5-year fixed rates in the <strong>4.39%–4.79%</strong> range across major lenders. Some brokers are offering insured 5-year fixed rates as low as 4.19% for well-qualified first-time buyers.',
      '<div class="callout">📌 <strong>Key takeaway:</strong> If you\'re renewing in 2026, now is a great time to shop around. The difference between lender offers can be 0.3%–0.5% — on a $500K mortgage, that\'s $1,500–$2,500 per year.</div>',
      '<h2>Outlook for the Rest of 2026</h2>',
      'Most economists and bond markets are pricing in one more 0.25% cut before year-end, though persistent core inflation could push that to 2027. Our recommendation: don\'t try to time the market. Lock in a great rate today and move forward with your life.',
      'If you\'re torn between fixed and variable, consider your personal risk tolerance. A fixed rate provides certainty; variable rates have historically saved borrowers money over full amortization periods — but come with monthly payment uncertainty if your mortgage isn\'t on a fixed-payment variable structure.'
    ]
  },
  {
    id:'b3', cat:'policy', badge:'', emoji:'🏛️', bg:'bcbg-policy',
    title:'Federal Budget 2026: Every Housing Measure Explained',
    excerpt:'The 2026 federal budget included expanded FHSA limits, extended 30-year amortizations for resale homes, and new supply-side measures. Here\'s a plain-English breakdown of what passed and who qualifies.',
    readMin:6, date:'2026-02-18', author:'ClearDoor Policy', featured:false,
    body:[
      'The 2026 federal budget included a number of housing-related announcements aimed at improving affordability for first-time buyers. Here\'s what actually matters for Canadians looking to buy in the next 12 months.',
      '<h2>FHSA Contribution Limits Increased</h2>',
      'The annual contribution limit for the First Home Savings Account has increased from <strong>$8,000 to $10,000</strong>, with the lifetime limit raised from $40,000 to $50,000. If you\'re saving for a first home, the FHSA is one of the most powerful tax-sheltered tools available — contributions are tax-deductible (like an RRSP) and qualifying withdrawals are completely tax-free (like a TFSA).',
      '<div class="callout tip">💡 Start contributing the maximum as early as possible. Every year of unused room is gone forever — you cannot carry forward more than one year of missed contributions.</div>',
      '<h2>30-Year Amortizations Extended to Resale Homes</h2>',
      'Previously, the 30-year amortization for insured mortgages only applied to new construction. The budget extends this to <strong>resale homes for first-time buyers</strong>. On a $600K purchase with 10% down, switching from 25 to 30 years reduces monthly payments by approximately $340 — though you\'ll pay significantly more total interest over the full term.',
      '<div class="callout warn">⚠️ <strong>Note:</strong> 30-year amortizations on insured mortgages require CMHC insurance (2.8%–4.0% added to the mortgage principal). Run the numbers carefully — lower monthly payments often mean higher total cost.</div>',
      '<h2>RRSP Home Buyers\' Plan</h2>',
      'The RRSP Home Buyers\' Plan withdrawal limit remains at $60,000 per person ($120,000 per couple). Combined with the FHSA, a couple can potentially access up to <strong>$220,000 tax-free</strong> toward a down payment — a substantial advantage in most Canadian cities.',
      '<h2>What Didn\'t Make It</h2>',
      'Calls for a capital gains tax exemption on primary residences were not included. Municipal zoning reform incentives were announced but require provincial agreements, which typically take 18–24 months to reach local implementation.'
    ]
  },
  {
    id:'b4', cat:'guide', badge:'guide', emoji:'📖', bg:'bcbg-guide',
    title:'Mortgage Pre-Approval: The Complete First-Time Buyer Guide',
    excerpt:'Pre-approval isn\'t just a formality — it sets your real budget, strengthens your offer, and often locks in a rate. Here\'s exactly how to get one and the key things to watch out for.',
    readMin:7, date:'2026-02-10', author:'ClearDoor Guides', featured:false,
    body:[
      'Getting a mortgage pre-approval is one of the first steps any serious home buyer should take — and one of the most misunderstood. Here\'s a complete walkthrough of the process, start to finish.',
      '<h2>Pre-Qualification vs. Pre-Approval: The Difference</h2>',
      'A <strong>pre-qualification</strong> is a quick, informal estimate based on what you tell a lender about your income and debts. No documents required, no credit check, no commitment from the lender. A <strong>pre-approval</strong> involves submitting actual documents — pay stubs, T4s, bank statements, employment letter — and the lender performs a hard credit pull. It results in a written commitment for a specific amount and usually includes a rate hold.',
      '<h2>What You\'ll Need to Provide</h2>',
      '<ul><li>Two years of T4s (or Notices of Assessment for self-employed buyers)</li><li>Recent pay stubs (last 30 days)</li><li>3–6 months of bank statements for chequing and savings accounts</li><li>Government-issued photo ID</li><li>A complete list of current assets and debts</li><li>If applicable: divorce decree, rental income statements, gift letters from family</li></ul>',
      '<h2>How the Stress Test Works</h2>',
      'All insured and most uninsured mortgages in Canada are subject to the federal mortgage stress test. Lenders must qualify you at the higher of: (a) your contracted rate + 2%, or (b) 5.25%. So if you\'re getting a 4.49% rate, you\'re qualified at 6.49%. This reduces your maximum purchase price but ensures you can still afford payments if rates rise.',
      '<div class="callout">📌 <strong>Rate hold:</strong> Most pre-approvals come with a 90–120 day rate hold. If rates rise before you close, you keep the lower rate. If rates fall, you typically get the lower rate at closing. Confirm this with your lender explicitly.</div>',
      '<h2>How Many Pre-Approvals Should You Get?</h2>',
      'Shopping around is smart — but be aware that each hard credit inquiry can slightly affect your credit score. Credit bureaus treat multiple mortgage inquiries within a 14–45 day window as a single inquiry, so it\'s safe to get 2–3 pre-approvals if you do them close together.',
      'Our recommendation: use a mortgage broker. They can shop multiple lenders simultaneously with a single credit pull, and their services are typically free to buyers since they\'re compensated by the lender.'
    ]
  },
  {
    id:'b5', cat:'ottawa', badge:'', emoji:'🏙️', bg:'bcbg-ottawa',
    title:'Kanata vs. Barrhaven: Which Ottawa Suburb Is Right for You?',
    excerpt:'Both are popular with first-time buyers and growing families. We compare current prices, commute times, school ratings, and neighbourhood feel to help you decide where to plant roots.',
    readMin:5, date:'2026-02-03', author:'ClearDoor Ottawa', featured:false,
    body:[
      'Kanata and Barrhaven are Ottawa\'s two most popular suburbs for first-time buyers. Both offer newer housing stock, strong schools, and lower prices than the urban core — but they have distinct personalities worth understanding before you commit to an offer.',
      '<h2>Kanata at a Glance</h2>',
      '<ul><li><strong>Average price (detached):</strong> $731,000</li><li><strong>Average price (townhome):</strong> $548,000</li><li><strong>Commute to downtown:</strong> 30–45 min by car | 55–70 min via OC Transpo</li><li><strong>Known for:</strong> Kanata North tech corridor, Canadian Tire Centre, Earl of March & Bell secondary schools</li></ul>',
      '<h2>Barrhaven at a Glance</h2>',
      '<ul><li><strong>Average price (detached):</strong> $688,000</li><li><strong>Average price (townhome):</strong> $519,000</li><li><strong>Commute to downtown:</strong> 35–50 min by car | 50–65 min via Transitway</li><li><strong>Known for:</strong> Family-friendly, newer elementary schools, Half Moon Bay, Strandherd Drive amenities</li></ul>',
      '<h2>Schools</h2>',
      'Both areas are well-served by public and Catholic schools. Kanata has a slight edge in secondary school reputation (A.Y. Jackson, Earl of March), while Barrhaven\'s newer elementary schools are highly rated. If a specific school catchment matters to you, always verify the address falls within the boundary before making an offer — school boards update boundaries regularly.',
      '<div class="callout tip">✅ <strong>Choose Kanata if:</strong> you work in Kanata North\'s tech sector, value more dining and entertainment options, or prioritize secondary school reputation.<br><br>✅ <strong>Choose Barrhaven if:</strong> you want slightly lower prices, newer builds, a quieter family-oriented feel, and don\'t mind a slightly longer downtown commute.</div>'
    ]
  },
  {
    id:'b6', cat:'market', badge:'', emoji:'📈', bg:'bcbg-market',
    title:'Condo vs. Freehold in 2026: An Honest Comparison for First-Time Buyers',
    excerpt:'Ottawa condos have softened 8–12% from peak. Is now the time to buy a condo, or should first-timers stretch for a freehold townhome? We break down the real numbers.',
    readMin:5, date:'2026-01-27', author:'ClearDoor Research', featured:false,
    body:[
      'One of the biggest decisions a first-time buyer faces in Ottawa is whether to start with a condo or stretch for a freehold townhome or detached. The answer depends heavily on your priorities — here\'s an honest look at both sides.',
      '<h2>The Case for Condos Right Now</h2>',
      'Condo prices in Ottawa have dropped 8–12% from their 2022 peak, making them more accessible than at any point since 2020. A well-located 2-bedroom condo in Centretown, Westboro, or Hintonburg can be found for $420K–$550K — a meaningful entry point for buyers who want to own in a walkable neighbourhood with great transit access.',
      'The trade-off: condo fees. Expect <strong>$400–$700/month</strong> depending on building age and amenities. These cover building maintenance, common area insurance, and reserve fund contributions — but they also reduce how much mortgage you qualify for under the stress test.',
      '<h2>The Case for Freehold</h2>',
      'Townhomes and detached homes offer more space, no monthly condo fees, and historically stronger long-term price appreciation. In suburban Ottawa — Barrhaven, Kanata, Riverside South — a 3-bedroom freehold townhome can still be found in the $540K–$620K range.',
      '<div class="callout">📌 <strong>Quick math:</strong> On a $560K purchase with 10% down + CMHC insurance, your total insured mortgage is roughly $537,000. At today\'s best 5-year fixed (≈4.39%), monthly payments are about $2,960 over 25 years. Add property tax ($400–$500/month) and you\'re looking at $3,350–$3,460/month total carrying cost.</div>',
      '<h2>Our Take</h2>',
      'In today\'s market, condos offer better value per square foot in urban neighbourhoods. Freehold townhomes in Ottawa\'s suburbs are excellent long-term holds. If you plan to upsize within 5–7 years, a well-located condo in a desirable neighbourhood — one you can rent out later — is a smart starting point. If you want to settle for the long term, go freehold.'
    ]
  },
  {
    id:'b7', cat:'mortgage', badge:'', emoji:'🔢', bg:'bcbg-mortgage',
    title:'CMHC Insurance Explained: The Real Cost of a Small Down Payment',
    excerpt:'CMHC insurance is required for down payments under 20% — and most buyers don\'t realize it\'s added to the mortgage, not paid upfront. Here\'s how to calculate the true impact on your purchase.',
    readMin:4, date:'2026-01-20', author:'ClearDoor Finance', featured:false,
    body:[
      'If your down payment is less than 20% of the purchase price, your mortgage must be insured by CMHC or one of two private insurers (Sagen or Canada Guaranty). This insurance protects the lender — not you — but the buyer pays for it.',
      '<h2>The Premium Rates</h2>',
      '<ul><li>5% down payment → premium = <strong>4.00%</strong> of the mortgage amount</li><li>10% down payment → premium = <strong>3.10%</strong> of the mortgage amount</li><li>15% down payment → premium = <strong>2.80%</strong> of the mortgage amount</li></ul>',
      '<h2>Real Example: $600,000 Purchase with 5% Down</h2>',
      '<ul><li>Purchase price: $600,000</li><li>Down payment (5%): $30,000</li><li>Mortgage before insurance: $570,000</li><li>CMHC premium (4.00%): <strong>$22,800</strong></li><li>Total insured mortgage: <strong>$592,800</strong></li></ul>',
      '<div class="callout warn">⚠️ The $22,800 premium is added directly to your mortgage and amortized over 25 years. At 4.49%, this ends up costing roughly <strong>$35,000</strong> over the full amortization — that\'s the true cost of a 5% down payment.</div>',
      '<h2>Does CMHC Insurance Get You a Better Rate?</h2>',
      'Yes — insured mortgages typically carry lower interest rates than uninsured ones (20%+ down). The spread is usually 0.10%–0.30%. On a $570K mortgage, a 0.20% rate advantage saves about $1,140/year — which helps offset the insurance cost over time.',
      '<h2>Can You Avoid It?</h2>',
      'Not legally if your down payment is under 20%. However, gifts from family members, FHSA withdrawals, and RRSP Home Buyers\' Plan draws all count toward your down payment and can help you reach or approach the 20% threshold to avoid insurance entirely.'
    ]
  },
  {
    id:'b8', cat:'guide', badge:'', emoji:'🔍', bg:'bcbg-guide',
    title:'Home Inspection 101: What Every First-Time Buyer Must Know',
    excerpt:'Skipping the home inspection to win a bidding war is a risk many buyers regret for years. Here\'s what inspectors look for, what they miss, and how to protect yourself in any market.',
    readMin:6, date:'2026-01-13', author:'ClearDoor Guides', featured:false,
    body:[
      'The home inspection is one of the most important steps in a real estate transaction — and one of the first casualties of a competitive market. Here\'s why it matters and how to approach it strategically.',
      '<h2>What a Home Inspector Does (and Doesn\'t Do)</h2>',
      'A licensed home inspector conducts a visual examination of accessible areas: roof, foundation, attic, electrical panel, plumbing, HVAC systems, windows, and more. Critically, they are <em>non-destructive</em> — they won\'t open walls, dig up foundations, or test concealed systems. They report on what they can see and test on the day of the inspection.',
      '<h2>What They\'re Looking For</h2>',
      '<ul><li><strong>Roof:</strong> Age, condition, missing shingles, flashing issues, signs of active leaking</li><li><strong>Foundation:</strong> Cracks, water infiltration, efflorescence (white mineral deposits indicating moisture)</li><li><strong>Electrical:</strong> Panel age and condition, knob-and-tube wiring, adequate GFCI protection</li><li><strong>Plumbing:</strong> Pipe material (polybutylene is a red flag), water pressure, drainage speed</li><li><strong>HVAC:</strong> Furnace and AC age and condition, ductwork, adequate ventilation</li><li><strong>Attic:</strong> Insulation R-value, ventilation, signs of mould or pest activity</li></ul>',
      '<div class="callout warn">🚩 <strong>Red flags that warrant serious negotiation or walking away:</strong> active water intrusion in the basement, structural foundation cracks, knob-and-tube wiring throughout the house, evidence of mould in the attic or crawl space, and a furnace or roof at end of life without a price reduction.</div>',
      '<h2>The Pre-Offer Inspection</h2>',
      'In competitive markets, many buyers arrange a "pre-offer inspection" — completed before submitting an offer — so they can make a clean unconditional offer with full confidence. Sellers sometimes allow this; ask your agent. Budget $400–$650 for a qualified inspector in Ottawa and 2–3 hours of your time.',
      '<h2>Finding a Qualified Inspector in Ontario</h2>',
      'Home inspectors in Ontario must be licensed under provincial legislation. Ask to see their license number, request a sample report, and confirm they carry Errors & Omissions (E&O) insurance. Find your own inspector independently — avoid inspectors exclusively referred by the listing agent, as this can create a conflict of interest.'
    ]
  },
  {
    id:'b9', cat:'policy', badge:'', emoji:'📜', bg:'bcbg-policy',
    title:'Ontario Land Transfer Tax: What Buyers Pay and the First-Time Buyer Rebate',
    excerpt:'Land transfer tax can add $8,000–$20,000 to your closing costs. Here\'s exactly how it\'s calculated for common Ottawa purchase prices, and the $4,000 rebate first-time buyers can claim.',
    readMin:3, date:'2026-01-06', author:'ClearDoor Policy', featured:false,
    body:[
      'Land Transfer Tax (LTT) is a provincial tax paid by the buyer on every real estate purchase in Ontario. It\'s calculated as a percentage of the purchase price and is due on closing day — it must be factored into your budget from day one.',
      '<h2>Ontario LTT Rates (2026)</h2>',
      '<ul><li>On the first $55,000: <strong>0.5%</strong></li><li>From $55,001 to $250,000: <strong>1.0%</strong></li><li>From $250,001 to $400,000: <strong>1.5%</strong></li><li>From $400,001 to $2,000,000: <strong>2.0%</strong></li><li>Over $2,000,000: <strong>2.5%</strong></li></ul>',
      '<h2>Real Calculation: $650,000 Purchase Price</h2>',
      '<ul><li>On $55,000: $275</li><li>On $195,000 ($55K–$250K): $1,950</li><li>On $150,000 ($250K–$400K): $2,250</li><li>On $250,000 ($400K–$650K): $5,000</li><li><strong>Total LTT: $9,475</strong></li></ul>',
      '<h2>The First-Time Buyer Rebate</h2>',
      'First-time buyers in Ontario can receive a <strong>rebate of up to $4,000</strong> on their provincial LTT. To qualify: you must be a Canadian citizen or permanent resident, be 18 or older, occupy the home as your principal residence within 9 months of closing, and have never owned a home anywhere in the world.',
      '<div class="callout tip">💡 On our $650,000 example: Total LTT = $9,475 → minus $4,000 rebate = <strong>$5,475 net</strong>. Budget this alongside legal fees ($1,500–$2,500), title insurance (~$300–$500), and your home inspection ($400–$650). Total closing costs typically run 2%–4% of the purchase price.</div>'
    ]
  },
  {
    id:'b10', cat:'ottawa', badge:'update', emoji:'🚇', bg:'bcbg-ottawa',
    title:'Ottawa LRT Expansion: How Trillium Line & Stage 3 Plans Affect Property Values',
    excerpt:'Ottawa\'s LRT network continues to reshape neighbourhood values. Research shows transit proximity drives consistent long-term appreciation. Here\'s which areas stand to benefit most.',
    readMin:4, date:'2025-12-30', author:'ClearDoor Ottawa', featured:false,
    body:[
      'Ottawa\'s LRT network has reshaped the city\'s real estate landscape more than any single development in decades. With Stage 2 fully operational and Stage 3 in planning, understanding the transit map is now essential for any serious buyer or investor.',
      '<h2>Stage 2: Already Changing Values</h2>',
      'Stage 2 extensions — Bayshore in the west, Trim Road in the east, and the Trillium Line extension south to Riverside South — are now fully operational. Communities along these corridors have seen above-average price appreciation since the announcements were made, well before construction finished.',
      '<h2>Stage 3: What\'s Proposed</h2>',
      'Stage 3 includes a western extension through Kanata and a northern extension through Orléans. Environmental Assessment work is underway, though construction timelines and funding remain subject to council approval. Properties within a 10-minute walk of proposed station locations represent speculative but historically rewarding long-term investments.',
      '<h2>The Data: Riverside South Case Study</h2>',
      'Since the Trillium Line extension to Riverside South opened, average condo prices near the new stations have increased <strong>7–11% faster</strong> than comparable properties farther from the line. Freehold townhomes within a 10-minute walk command a 3–5% premium over similar homes 20+ minutes away from any LRT station.',
      '<div class="callout">📌 <strong>Buyer strategy:</strong> When comparing two similarly-priced properties in Ottawa, the one closer to an LRT station is a stronger long-term hold — especially if Stage 3 proceeds. For investors, a 1-bedroom condo near a transit hub consistently attracts premium rents and lower vacancy rates than comparable units farther from the network.</div>',
      '<h2>What to Check Before You Buy</h2>',
      'Look up the Walk Score and Transit Score for any address you\'re seriously considering. A Transit Score above 60 (rated "Excellent Transit") has been shown in Canadian real estate research to translate into measurable price premiums. You can also check the City of Ottawa\'s interactive transit maps to see planned Stage 3 station locations.'
    ]
  },
  {
    id:'b11', cat:'canada', badge:'', emoji:'🍁', bg:'bcbg-canada',
    title:'Canada\'s Housing Supply Gap: What 3.5 Million Missing Homes Means for Buyers',
    excerpt:'CMHC says Canada needs 3.5 million more homes to restore affordability by 2030. New federal land releases and zoning reforms show early signs of progress — but the math is daunting.',
    readMin:5, date:'2025-12-22', author:'ClearDoor Research', featured:false,
    body:[
      'Canada\'s housing affordability crisis is fundamentally a supply problem. CMHC\'s 2025 Housing Supply Report estimated that Canada needs approximately 3.5 million additional housing units by 2030 — beyond what is currently planned — to restore affordability to 2003–2004 levels. For context, Canada builds roughly 220,000–250,000 units per year.',
      '<h2>Why Supply Is So Constrained</h2>',
      'The causes are structural and span multiple levels of government: restrictive single-family zoning in most urban areas, lengthy municipal approval processes (often 3–7 years for a new mid-rise), skilled trades shortages in the construction sector, high development charges and land costs, and a lack of purpose-built rental construction for over three decades.',
      '<h2>What the Federal Government Is Doing</h2>',
      'Recent federal initiatives include releasing surplus federal land for residential development, the Housing Accelerator Fund (incentivizing municipalities to speed up approvals), changes to allow higher density near transit, and the federal homes-on-demand rules requiring municipalities to permit 4-plexes by right on any residential lot.',
      '<div class="callout tip">💡 <strong>Silver lining for buyers:</strong> In the short term, more supply coming online in specific suburban markets is creating buying opportunities. New construction can be negotiated more aggressively in 2026 than at any point since 2019.</div>',
      '<h2>What This Means for First-Time Buyers</h2>',
      'The supply gap means that demand will likely continue to outpace supply over any 10-year horizon in most Canadian cities — supporting long-term price floors. While prices may fluctuate year-to-year with interest rate cycles, the structural case for homeownership as a long-term wealth-building strategy in Canada remains strong.',
      'The practical implication: buying now — even at today\'s prices — locks in a real asset in a market where the underlying supply shortage is unlikely to be resolved within the next decade.'
    ]
  }
];

/* ───────────────────────────────────────────────────────
   STATE
   ─────────────────────────────────────────────────────── */
var blogState = { filter:'all', currentId:null };

/* ───────────────────────────────────────────────────────
   HELPERS
   ─────────────────────────────────────────────────────── */
function blogCatLabel(cat){
  return {market:'📊 Market',mortgage:'🏦 Mortgage',policy:'🏛️ Policy',
          guide:'📖 Buyer Guide',ottawa:'🏙️ Ottawa',canada:'🍁 Canada'}[cat] || cat;
}
function blogFmt(d){
  var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var p=d.split('-'); return m[+p[1]-1]+' '+parseInt(p[2])+', '+p[0];
}
function blogBadgeClass(b){
  return {new:'bbadge-new',trending:'bbadge-trending',guide:'bbadge-guide',update:'bbadge-update'}[b]||'bbadge-new';
}

/* ───────────────────────────────────────────────────────
   FILTER
   ─────────────────────────────────────────────────────── */
function blogFilter(cat,btn){
  blogState.filter=cat;
  document.querySelectorAll('#blogFilters .blog-fpill').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  blogRenderList();
}
function blogGetFiltered(){
  if(blogState.filter==='all') return BLOG_ARTICLES;
  return BLOG_ARTICLES.filter(function(a){return a.cat===blogState.filter;});
}

/* ───────────────────────────────────────────────────────
   RENDER LIST VIEW
   ─────────────────────────────────────────────────────── */
function blogRenderList(){
  var arts = blogGetFiltered();
  var featWrap = document.getElementById('blog-featured-wrap');
  var grid = document.getElementById('blog-grid');
  var countEl = document.getElementById('blog-grid-count');
  if(!featWrap || !grid) return;

  // ── Featured (first article when showing all) ──
  var featured = (blogState.filter==='all') ? BLOG_ARTICLES.find(function(a){return a.featured;}) : null;
  var gridArts = featured ? arts.filter(function(a){return a.id!==featured.id;}) : arts;

  if(featured){
    featWrap.innerHTML =
      '<div class="blog-featured" onclick="blogOpen(\''+featured.id+'\')">' +
        '<div class="blog-feat-visual '+featured.bg+'">' +
          '<span>'+featured.emoji+'</span>' +
          '<div class="blog-feat-tag bcat-'+featured.cat+'-bg">'+blogCatLabel(featured.cat)+'</div>' +
          (featured.badge?'<div class="blog-feat-badge '+blogBadgeClass(featured.badge)+'">'+featured.badge.toUpperCase()+'</div>':'') +
        '</div>' +
        '<div class="blog-feat-body">' +
          '<div class="blog-feat-cat bcat-'+featured.cat+'">'+blogCatLabel(featured.cat)+'</div>' +
          '<div class="blog-feat-title">'+featured.title+'</div>' +
          '<div class="blog-feat-excerpt">'+featured.excerpt+'</div>' +
          '<div class="blog-feat-meta">' +
            '<span>✍️ '+featured.author+'</span>' +
            '<span>📅 '+blogFmt(featured.date)+'</span>' +
            '<span>⏱ '+featured.readMin+' min read</span>' +
          '</div>' +
          '<div class="blog-feat-cta">Read Full Article →</div>' +
        '</div>' +
      '</div>';
  } else {
    featWrap.innerHTML='';
  }

  // ── Update count ──
  if(countEl) countEl.textContent = gridArts.length + ' article' + (gridArts.length!==1?'s':'');

  // ── Grid ──
  if(!gridArts.length){
    grid.innerHTML = '<div class="blog-empty"><div class="blog-empty-emoji">📭</div><div class="blog-empty-txt">No articles in this category yet. Check back soon!</div></div>';
    return;
  }
  grid.innerHTML = gridArts.map(function(a){
    return '<div class="blog-card" onclick="blogOpen(\''+a.id+'\')">'+
      '<div class="blog-card-visual '+a.bg+'">'+
        '<span>'+a.emoji+'</span>'+
        '<div class="blog-card-tag bcat-'+a.cat+'-bg">'+blogCatLabel(a.cat)+'</div>'+
        (a.badge?'<div class="blog-card-badge '+blogBadgeClass(a.badge)+'">'+a.badge.toUpperCase()+'</div>':'')+
      '</div>'+
      '<div class="blog-card-body">'+
        '<div class="blog-card-cat bcat-'+a.cat+'">'+blogCatLabel(a.cat)+'</div>'+
        '<div class="blog-card-title">'+a.title+'</div>'+
        '<div class="blog-card-excerpt">'+a.excerpt+'</div>'+
        '<div class="blog-card-footer">'+
          '<span>'+blogFmt(a.date)+'</span>'+
          '<span class="blog-card-read">'+a.readMin+' min read →</span>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
}

/* ───────────────────────────────────────────────────────
   OPEN ARTICLE
   ─────────────────────────────────────────────────────── */
function blogOpen(id){
  var a = BLOG_ARTICLES.find(function(x){return x.id===id;});
  if(!a) return;
  blogState.currentId = id;

  // Build body HTML
  var bodyHtml = a.body.map(function(p){
    if(p.startsWith('<')) return p;
    return '<p>'+p+'</p>';
  }).join('');

  // Extract H2 headings for table of contents
  var h2s = [];
  a.body.forEach(function(p){
    var m = p.match(/^<h2>(.*?)<\/h2>$/);
    if(m) h2s.push(m[1]);
  });

  // Render article content
  var content = document.getElementById('blog-art-content');
  if(content){
    content.innerHTML =
      '<div class="blog-art-visual '+a.bg+'"><span>'+a.emoji+'</span></div>' +
      '<div class="blog-art-badges">' +
        '<span class="blog-art-badge bcat-'+a.cat+'-bg">'+blogCatLabel(a.cat)+'</span>' +
        (a.badge?'<span class="blog-art-badge '+blogBadgeClass(a.badge)+'">'+a.badge.toUpperCase()+'</span>':'') +
      '</div>' +
      '<h1 class="blog-art-h1">'+a.title+'</h1>' +
      '<div class="blog-art-meta">' +
        '<span>✍️ '+a.author+'</span>' +
        '<span>📅 '+blogFmt(a.date)+'</span>' +
        '<span>⏱ '+a.readMin+' min read</span>' +
      '</div>' +
      '<div class="blog-art-body">'+bodyHtml+'</div>';
  }

  // Render related articles (same cat first, then others; exclude current)
  var others = BLOG_ARTICLES.filter(function(x){return x.id!==id;});
  var sameCat = others.filter(function(x){return x.cat===a.cat;});
  var diff = others.filter(function(x){return x.cat!==a.cat;});
  var related = sameCat.concat(diff).slice(0,4);
  var relEl = document.getElementById('blog-related');
  if(relEl){
    relEl.innerHTML = related.map(function(r){
      return '<div class="blog-rel-item" onclick="blogOpen(\''+r.id+'\')">'+
        '<div class="blog-rel-thumb '+r.bg+'">'+r.emoji+'</div>'+
        '<div class="blog-rel-info">'+
          '<div class="blog-rel-title">'+r.title+'</div>'+
          '<div class="blog-rel-date">'+blogFmt(r.date)+'</div>'+
        '</div>'+
      '</div>';
    }).join('');
  }

  // Render table of contents
  var tocEl = document.getElementById('blog-sb-toc');
  var tocBox = document.getElementById('blog-sb-nav');
  if(tocEl && tocBox){
    if(h2s.length){
      tocEl.innerHTML = h2s.map(function(h){return '<div>• '+h+'</div>';}).join('');
      tocBox.style.display='block';
    } else {
      tocBox.style.display='none';
    }
  }

  // Switch views — hide all navigation chrome, show only article
  var listView = document.getElementById('blog-list-view');
  var artView = document.getElementById('blog-article-view');
  var np = document.getElementById('blog-news-panel');
  if(listView) listView.style.display='none';
  if(artView) artView.style.display='block';
  if(np) np.style.display='none';
  document.querySelectorAll('.blog-main-tabs,.blog-filters-bar').forEach(function(el){el.style.display='none';});

  // Scroll & start progress bar
  window.scrollTo({top:0,behavior:'smooth'});
  blogProgressBar(true);
}

/* ───────────────────────────────────────────────────────
   SHOW LIST
   ─────────────────────────────────────────────────────── */
function blogShowList(){
  var artView = document.getElementById('blog-article-view');
  if(artView) artView.style.display='none';
  blogState.currentId = null;
  blogProgressBar(false);
  window.scrollTo({top:0,behavior:'smooth'});
  // Restore main tabs bar and return to Guides tab
  var mainTabs = document.querySelector('.blog-main-tabs');
  if(mainTabs) mainTabs.style.display='';
  var guidesBtn = document.getElementById('tab-guides');
  blogSwitchMain('guides', guidesBtn);
}

/* ───────────────────────────────────────────────────────
   READING PROGRESS BAR
   ─────────────────────────────────────────────────────── */
function blogProgressBar(on){
  var bar = document.getElementById('blog-progress');
  if(!bar) return;
  if(!on){ bar.style.width='0%'; window.onscroll=null; return; }
  window.onscroll = function(){
    var el = document.getElementById('blog-art-content');
    if(!el){ bar.style.width='0%'; return; }
    var rect = el.getBoundingClientRect();
    var elH = el.offsetHeight;
    var scrolled = Math.max(0,-rect.top);
    var pct = Math.min(100, (scrolled/Math.max(1,elH-window.innerHeight))*100);
    bar.style.width = pct+'%';
  };
}

/* ───────────────────────────────────────────────────────
   SHARE ACTIONS
   ─────────────────────────────────────────────────────── */
function blogCopyLink(){
  var a = BLOG_ARTICLES.find(function(x){return x.id===blogState.currentId;});
  if(!a) return;
  var url = window.location.origin + window.location.pathname + '#blog/' + a.id;
  if(navigator.clipboard){ navigator.clipboard.writeText(url); }
  alert('Link copied! Share: ' + url);
}
function blogShareEmail(){
  var a = BLOG_ARTICLES.find(function(x){return x.id===blogState.currentId;});
  if(!a) return;
  var subj = encodeURIComponent('Check this out: '+a.title);
  var body = encodeURIComponent(a.excerpt+'\n\nRead more at cleardoor.ca');
  window.open('mailto:?subject='+subj+'&body='+body);
}

/* ───────────────────────────────────────────────────────
   NEWSLETTER
   ─────────────────────────────────────────────────────── */
function blogSubscribe(){
  var inp = document.getElementById('blog-nl-input');
  var thanks = document.getElementById('blog-nl-thanks');
  if(!inp || !inp.value.includes('@')){
    if(inp) inp.style.borderColor='#ef4444';
    return;
  }
  if(thanks){ thanks.style.display='block'; }
  var form = inp.parentElement;
  if(form) form.style.display='none';
  inp.value='';
}
function blogSubscribeSb(){
  var inp = document.getElementById('blog-sb-nl-input');
  var thanks = document.getElementById('blog-sb-nl-thanks');
  if(!inp || !inp.value.includes('@')) return;
  if(thanks){ thanks.style.display='block'; }
  inp.value='';
}

/* ───────────────────────────────────────────────────────
   LIVE NEWS  (RSS via rss2json.com)
   ─────────────────────────────────────────────────────── */
/* NEWS_SOURCES is populated at runtime from localStorage (managed by rss-admin.js).
   Falls back to built-in defaults if the admin module hasn't run yet. */
var NEWS_SOURCES=[];
function _getNewsSources(){
  try{
    var s=JSON.parse(localStorage.getItem('cd_rss_sources_v1'));
    if(Array.isArray(s)&&s.length)return s;
  }catch(e){}
  return[
    {id:'cbc', label:'CBC',                     url:'https://www.cbc.ca/cmlink/rss-canada-business'},
    {id:'bd',  label:'Better Dwelling',         url:'https://betterdwelling.com/feed/'},
    {id:'cmt', label:'Canadian Mortgage Trends',url:'https://www.canadianmortgagetrends.com/feed/'},
    {id:'fp',  label:'Financial Post',          url:'https://financialpost.com/category/real-estate/feed/'},
  ];
}
var ALLORIGINS='https://api.allorigins.win/get?url=';
var NEWS_CACHE_KEY='cd_news_v2';
var NEWS_TTL=15*60*1000;
var newsState={source:'all',items:[]};

function timeAgo(d){
  var diff=Date.now()-new Date(d).getTime();
  var m=Math.floor(diff/60000);
  if(m<1)return'Just now';
  if(m<60)return m+'m ago';
  var h=Math.floor(m/60);
  if(h<24)return h+'h ago';
  return Math.floor(h/24)+'d ago';
}
function stripHtml(h){
  return h.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').trim();
}
function renderNewsSkeleton(){
  var g=document.getElementById('news-grid');if(!g)return;
  g.innerHTML=Array(8).fill(0).map(function(){
    return'<div class="news-card sk-card"><div class="news-card-visual sk-vis"></div><div class="news-card-body"><div class="sk-line sk-line-w70"></div><div class="sk-line sk-line-w100"></div><div class="sk-line sk-line-w90"></div><div class="sk-line sk-line-w50"></div></div></div>';
  }).join('');
}
function renderNewsError(){
  var g=document.getElementById('news-grid');if(!g)return;
  g.innerHTML='<div class="blog-empty"><div class="blog-empty-emoji">📡</div><div class="blog-empty-txt">Could not load live news. Check your connection and try refreshing.</div></div>';
}
var NEWS_SRC_COLORS={
  cbc:'#d62c1a',bd:'#1a6b3a',cmt:'#1a4a8a',fp:'#0a2240'
};
function extractNewsImg(item){
  // 1. rss2json thumbnail field
  if(item.thumbnail&&item.thumbnail.indexOf('http')===0)return item.thumbnail;
  // 2. enclosure (podcast/image enclosure)
  if(item.enclosure&&item.enclosure.link&&item.enclosure.link.indexOf('http')===0){
    var t=item.enclosure.type||'';
    if(!t||t.indexOf('image')!==-1||/\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(item.enclosure.link))
      return item.enclosure.link;
  }
  // 3. first <img> in content
  var content=item.content||'';
  var m=content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if(m&&m[1]&&m[1].indexOf('http')===0)return m[1];
  // 4. first <img> in description
  var desc=item.description||'';
  var m2=desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  if(m2&&m2[1]&&m2[1].indexOf('http')===0)return m2[1];
  return'';
}
function renderNewsGrid(items){
  var g=document.getElementById('news-grid');if(!g)return;
  if(!items||!items.length){
    g.innerHTML='<div class="blog-empty"><div class="blog-empty-emoji">📭</div><div class="blog-empty-txt">No news found for this source.</div></div>';return;
  }
  g.innerHTML=items.map(function(item){
    var img=extractNewsImg(item);
    var src=NEWS_SOURCES.find(function(s){return s.id===item._src;})||{label:item._src||''};
    var clr=NEWS_SRC_COLORS[item._src]||'#1a3a6b';
    var ex=stripHtml(item.description||'').substring(0,160);
    if(ex.length===160)ex+='…';
    var visual=img
      ?'<img src="'+img+'" alt="" loading="lazy" onerror="this.parentNode.innerHTML=\'<span class=\\\"news-no-img\\\"><span>\'+encodeURIComponent(src.label)+\'</span></span>\'">'
      :'<span class="news-no-img" style="background:'+clr+'"><span>'+src.label+'</span></span>';
    return'<a class="news-card" href="'+item.link+'" target="_blank" rel="noopener noreferrer">'+
      '<div class="news-card-visual">'+visual+'</div>'+
      '<div class="news-card-body">'+
        '<div class="news-card-source-badge">'+src.label+'</div>'+
        '<div class="news-card-title">'+item.title+'</div>'+
        '<div class="news-card-excerpt">'+ex+'</div>'+
        '<div class="news-card-footer"><span>'+timeAgo(item.pubDate)+'</span></div>'+
      '</div>'+
    '</a>';
  }).join('');
}
function filterNewsSource(src,el){
  newsState.source=src;
  document.querySelectorAll('#blog-source-pills .blog-fpill').forEach(function(b){b.classList.remove('active');});
  if(el)el.classList.add('active');
  var items=src==='all'?newsState.items:newsState.items.filter(function(i){return i._src===src;});
  renderNewsGrid(items);
}
/* Fetch sources one-at-a-time to avoid rss2json free-tier rate limits */
function _fetchOneSource(sources, index, collected, done){
  if(index>=sources.length){ done(collected); return; }
  var s=sources[index];
  fetch(RSS2JSON+encodeURIComponent(s.url))
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.status==='ok'&&d.items){
        d.items.slice(0,8).forEach(function(i){i._src=s.id;collected.push(i);});
      }
    })
    .catch(function(){})
    .finally(function(){
      setTimeout(function(){_fetchOneSource(sources,index+1,collected,done);},700);
    });
}
function fetchNews(){
  try{
    var cached=JSON.parse(localStorage.getItem(NEWS_CACHE_KEY)||'null');
    if(cached&&cached.ts&&(Date.now()-cached.ts)<NEWS_TTL){
      newsState.items=cached.items;
      renderNewsGrid(newsState.source==='all'?newsState.items:newsState.items.filter(function(i){return i._src===newsState.source;}));
      return;
    }
  }catch(e){}
  renderNewsSkeleton();
  var activeSources=_getNewsSources();
  NEWS_SOURCES.length=0;activeSources.forEach(function(s){NEWS_SOURCES.push(s);});
  _fetchOneSource(activeSources,0,[],function(all){
    all.sort(function(a,b){return new Date(b.pubDate)-new Date(a.pubDate);});
    newsState.items=all;
    try{localStorage.setItem(NEWS_CACHE_KEY,JSON.stringify({ts:Date.now(),items:all}));}catch(e){}
    if(!all.length){renderNewsError();return;}
    renderNewsGrid(newsState.source==='all'?all:all.filter(function(i){return i._src===newsState.source;}));
  });
}
function blogSwitchMain(tab,btn){
  var np=document.getElementById('blog-news-panel');
  var fb=document.querySelector('.blog-filters-bar');
  var lv=document.getElementById('blog-list-view');
  document.querySelectorAll('.blog-main-tab').forEach(function(b){b.classList.remove('active');});
  if(btn)btn.classList.add('active');
  if(tab==='news'){
    if(np)np.style.display='';
    if(fb)fb.style.display='none';
    if(lv)lv.style.display='none';
    fetchNews();
  }else{
    if(np)np.style.display='none';
    if(fb)fb.style.display='';
    if(lv)lv.style.display='';
    blogRenderList();
  }
}

/* ───────────────────────────────────────────────────────
   INIT
   ─────────────────────────────────────────────────────── */
function blogInit(){
  blogState.filter = 'all';
  blogState.currentId = null;
  newsState.source = 'all';
  // Reset filter pills
  document.querySelectorAll('#blogFilters .blog-fpill').forEach(function(b,i){
    b.classList.toggle('active', i===0);
  });
  document.querySelectorAll('#blog-source-pills .blog-fpill').forEach(function(b,i){
    b.classList.toggle('active', i===0);
  });
  // Hide article view
  var artView = document.getElementById('blog-article-view');
  if(artView) artView.style.display='none';
  // Ensure main tabs bar is visible
  var mainTabs = document.querySelector('.blog-main-tabs');
  if(mainTabs) mainTabs.style.display='';
  // Default to news tab
  var newsBtn = document.getElementById('tab-news');
  blogSwitchMain('news', newsBtn);
}