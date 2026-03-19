/* CLEARDOOR — CALCULATORS
   Mortgage · Savings · Rent-vs-Buy · Tabs
================================================================ */

// ══ CALC TABS ══
function showCalc(id,el){
  document.querySelectorAll('.tabpane').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tabbtn').forEach(b=>b.classList.remove('active'));
  var pane=document.getElementById('calc-'+id);
  if(pane)pane.classList.add('active');
  if(el)el.classList.add('active');
  if(id==='mortgage')calcMortgageMain();
  if(id==='affordability')calcAffordability();
  if(id==='cmhc')calcCMHC();
  if(id==='ltt')calcLTT();
  if(id==='savings')calcSave();
  if(id==='rvb')calcRvB();
}
// ══ CALCS ══
const fmt=n=>'$'+Math.round(n).toLocaleString();
function calcMortgageMain(){
  const P=+document.getElementById('mpPrice').value,dp=+document.getElementById('mpDp').value/100;
  const r=+document.getElementById('mpRate').value/100/12,n=+document.getElementById('mpTerm').value*12,loan=P*(1-dp);
  document.getElementById('mpPriceVal').textContent=fmt(P);
  document.getElementById('mpDpVal').textContent=document.getElementById('mpDp').value+'% ('+fmt(P*dp)+')';
  document.getElementById('mpRateVal').textContent=document.getElementById('mpRate').value+'%';
  document.getElementById('mpTermVal').textContent=document.getElementById('mpTerm').value+' years';
  const m=r===0?loan/n:loan*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
  document.getElementById('mpResult').textContent=fmt(m)+'/mo';
  document.getElementById('mpInterest').textContent=fmt(m*n-loan);
  document.getElementById('mpTotal').textContent=fmt(m*n);
}
function calcAffordability(){
  const inc=+document.getElementById('affInc').value,debt=+document.getElementById('affDebt').value;
  const down=+document.getElementById('affDown').value,rate=+document.getElementById('affRate').value;
  document.getElementById('affIncVal').textContent=fmt(inc);document.getElementById('affDebtVal').textContent=fmt(debt);
  document.getElementById('affDownVal').textContent=fmt(down);document.getElementById('affRateVal').textContent=rate+'%';
  const sr=Math.max(rate+2,5.25)/100/12,mi=inc/12,mp=Math.min(mi*.32,mi*.44-debt),n=25*12;
  const loan=mp*(Math.pow(1+sr,n)-1)/(sr*Math.pow(1+sr,n));
  document.getElementById('affResult').textContent=fmt(loan+down);
  const r=rate/100/12,m=r===0?loan/n:loan*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
  document.getElementById('affGDS').textContent=((m*12/inc)*100).toFixed(1)+'%';
  document.getElementById('affTDS').textContent=(((m+debt)*12/inc)*100).toFixed(1)+'%';
}
function calcCMHC(){
  const p=+document.getElementById('cmhcPrice').value,dp=+document.getElementById('cmhcDp').value;
  document.getElementById('cmhcPriceVal').textContent=fmt(p);document.getElementById('cmhcDpVal').textContent=dp+'%';
  const loan=p*(1-dp/100),pr=dp<10?.04:dp<15?.031:.028,prem=loan*pr;
  document.getElementById('cmhcPremium').textContent=fmt(prem);
  document.getElementById('cmhcRate').textContent=(pr*100).toFixed(1)+'%';
  document.getElementById('cmhcMortgage').textContent=fmt(loan+prem);
}
function calcLTT(){
  const p=+document.getElementById('lttPrice').value,prov=document.getElementById('lttProv').value,ftb=document.getElementById('lttFTB').checked;
  document.getElementById('lttPriceVal').textContent=fmt(p);
  function ltt(price,bk){let t=0,prev=0;for(const[lim,r]of bk){const top=Math.min(price,lim);if(top>prev)t+=(top-prev)*r;prev=lim;if(price<=lim)break;}return t;}
  let tax=0,rebate=0;
  if(prov==='ON'||prov==='ON-TO'){tax=ltt(p,[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[Infinity,.025]]);if(ftb)rebate=Math.min(tax,4000);}
  if(prov==='ON-TO'){const c=ltt(p,[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[Infinity,.025]]);tax+=c;if(ftb)rebate+=Math.min(c,4475);}
  if(prov==='BC'){tax=ltt(p,[[200000,.01],[2000000,.02],[3000000,.03],[Infinity,.05]]);if(ftb&&p<=860000)rebate=Math.min(tax,8000);}
  if(prov==='QC')tax=ltt(p,[[50000,.005],[250000,.01],[500000,.015],[1000000,.02],[Infinity,.025]]);
  if(prov==='MB')tax=ltt(p,[[30000,0],[90000,.005],[150000,.01],[200000,.015],[Infinity,.02]]);
  if(prov==='NS')tax=p*.015;
  document.getElementById('lttGross').textContent=fmt(tax);
  document.getElementById('lttRebate').textContent=ftb?fmt(rebate):'N/A';
  document.getElementById('lttResult').textContent=fmt(Math.max(0,tax-rebate));
}
function calcSave(){
  const hp=+document.getElementById('hp').value,pct=+document.getElementById('dpPct').value/100;
  const cur=+document.getElementById('curSav').value,ms=+document.getElementById('mSav').value;
  document.getElementById('hpVal').textContent=fmt(hp);document.getElementById('dpPctVal').textContent=document.getElementById('dpPct').value+'%';
  document.getElementById('curSavVal').textContent=fmt(cur);document.getElementById('mSavVal').textContent=fmt(ms);
  const needed=hp*pct,rem=Math.max(0,needed-cur),months=rem/ms;
  const y=Math.floor(months/12),m=Math.round(months%12);
  document.getElementById('dpNeeded').textContent=fmt(needed);
  document.getElementById('timeNeeded').textContent=rem<=0?'You\'re ready!':(y>0?y+' yr'+(y>1?'s ':' '):'')+(m>0?m+' mo':'');
  [['dp5',.05],['dp10',.10],['dp20',.20],['cc',.04]].forEach(([id,r])=>{
    const t=hp*r;document.getElementById(id).textContent=fmt(t);
    document.getElementById(id+'Bar').style.width=Math.min(100,cur/t*100)+'%';
  });
}
function calcRvB(){
  const P=+document.getElementById('bp').value,dp=+document.getElementById('bdp').value/100;
  const r=+document.getElementById('br').value/100/12,rent=+document.getElementById('rent').value;
  document.getElementById('bpVal').textContent=fmt(P);document.getElementById('bdpVal').textContent=document.getElementById('bdp').value+'%';
  document.getElementById('brVal').textContent=document.getElementById('br').value+'%';document.getElementById('rentVal').textContent=fmt(rent)+'/mo';
  const loan=P*(1-dp),n=25*12,m=r===0?loan/n:loan*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
  document.getElementById('rvbMortgage').textContent=fmt(m)+'/mo';
  let be='10+ yrs';
  for(let y=1;y<=12;y++){if(P*.04*y>(m-rent)*12*y+P*dp*.04*y){be=y+' yr'+(y>1?'s':'');break;}}
  document.getElementById('rvbBreak').textContent=be;
}