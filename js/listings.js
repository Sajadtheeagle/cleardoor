/* CLEARDOOR — LISTINGS
   Listings data · render · filter
================================================================ */

// ══ LISTINGS ══
const listings=[
  {id:1,price:589000,addr:"142 Maple St, Toronto, ON",beds:2,baths:1,sqft:750,type:"Condo/Apt",badge:"new",emoji:"🏢",city:"Toronto"},
  {id:2,price:749000,addr:"88 Willow Cres, Ottawa, ON",beds:3,baths:2,sqft:1400,type:"Townhouse",badge:"",emoji:"🏘️",city:"Ottawa"},
  {id:3,price:469000,addr:"33 Bay St #2210, Calgary, AB",beds:1,baths:1,sqft:620,type:"Condo/Apt",badge:"hot",emoji:"🏙️",city:"Calgary"},
  {id:4,price:875000,addr:"56 Oak Ave, Vancouver, BC",beds:2,baths:2,sqft:900,type:"Condo/Apt",badge:"",emoji:"🏢",city:"Vancouver"},
  {id:5,price:529000,addr:"19 Ridgeway Dr, Hamilton, ON",beds:3,baths:2,sqft:1200,type:"Semi-Detached",badge:"new",emoji:"🏡",city:"Hamilton"},
  {id:6,price:349000,addr:"44 Prairie View, Regina, SK",beds:4,baths:2,sqft:1800,type:"House",badge:"",emoji:"🏠",city:"Regina"},
];
// ══ REALTOR SEARCH ══
function openRealtor(){
  const city=document.getElementById('s-city').value.trim(),type=document.getElementById('s-type').value;
  const minp=document.getElementById('s-minp').value,maxp=document.getElementById('s-maxp').value;
  const beds=document.getElementById('s-beds').value;
  const p=[];
  if(city)p.push('locationValue='+encodeURIComponent(city));
  if(type)p.push('propertyTypeGroupID='+(type==='House'?'1':type==='Condo/Apt'?'3':type==='Townhouse'?'7':'1'));
  if(minp)p.push('PriceMin='+minp);
  if(maxp)p.push('PriceMax='+maxp);
  if(beds)p.push('BedroomsMin='+beds);
  window.open('https://www.realtor.ca/map#'+p.join('&'),'_blank','noopener');
}
function quickSearch(city,type,minp,maxp){
  document.getElementById('s-city').value=city;
  document.getElementById('s-type').value=type;
  document.getElementById('s-minp').value=minp;
  document.getElementById('s-maxp').value=maxp;
  openRealtor();
}
function renderListings(){
  document.getElementById('listingsGrid').innerHTML = listings.map(l=>`
    <div style="background:#fff;border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:all .2s;cursor:pointer" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 30px rgba(15,35,66,.1)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
      <div style="height:130px;background:var(--light);display:flex;align-items:center;justify-content:center;font-size:2.8rem;position:relative">
        ${l.emoji}
        ${l.badge?`<div style="position:absolute;top:.5rem;left:.5rem;background:${l.badge==='new'?'var(--green)':'var(--rose)'};color:#fff;border-radius:6px;padding:.15rem .45rem;font-size:.62rem;font-weight:700">${l.badge==='new'?'New':'🔥 Hot'}</div>`:''}
      </div>
      <div style="padding:.9rem">
        <div style="font-size:1.05rem;font-weight:800;color:var(--navy)">$${l.price.toLocaleString()}</div>
        <div style="font-size:.75rem;color:var(--gray);margin:.15rem 0 .45rem">📍 ${l.addr}</div>
        <div style="display:flex;gap:.7rem;font-size:.72rem;color:var(--gray)"><span>🛏 ${l.beds}</span><span>🚿 ${l.baths}</span><span>📐 ${l.sqft.toLocaleString()} sqft</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-top:.65rem">
          <a href="https://www.realtor.ca/map#locationValue=${encodeURIComponent(l.city)}" target="_blank" rel="noopener" style="background:var(--sky);color:#fff;border-radius:7px;padding:.38rem;font-size:.72rem;font-weight:700;text-align:center;text-decoration:none">Realtor.ca ↗</a>
          <button onclick="showPage('calculator')" style="background:var(--light);border:1px solid var(--border);color:var(--navy);border-radius:7px;padding:.38rem;font-size:.72rem;font-weight:600;cursor:pointer">🧮 Calculate</button>
        </div>
      </div>
    </div>`).join('');
}