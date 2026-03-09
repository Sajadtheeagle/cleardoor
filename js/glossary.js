/* CLEARDOOR — GLOSSARY
   Terms data · render · search
================================================================ */

// ══ GLOSSARY ══
const glossaryTerms = [
  {t:"FHSA",d:"First Home Savings Account. Save up to $40,000 tax-free for your first home. Contributions are tax-deductible; qualifying withdrawals are tax-free."},
  {t:"Home Buyers' Plan (HBP)",d:"Withdraw up to $60,000 per person from your RRSP tax-free to buy a first home. Must be repaid over 15 years."},
  {t:"CMHC Insurance",d:"Mandatory mortgage insurance when down payment is under 20%. Premiums of 2.8–4% are added to your mortgage balance."},
  {t:"Pre-Approval",d:"A lender's conditional commitment to lend you up to a specific amount based on income, credit, and debts. Valid 90–120 days."},
  {t:"Stress Test",d:"Canada requires qualifying at your contract rate +2% or 5.25% (whichever is higher). Protects against rate increases."},
  {t:"GDS Ratio",d:"Gross Debt Service ratio. Housing costs ÷ gross monthly income. Maximum 32% allowed by lenders."},
  {t:"TDS Ratio",d:"Total Debt Service ratio. All monthly debts ÷ gross monthly income. Maximum 44% allowed by lenders."},
  {t:"Amortization",d:"The full period to pay off your mortgage. Max 25 years for insured mortgages; 30 years for uninsured (20%+ down)."},
  {t:"Mortgage Term",d:"The current contract length — usually 1–5 years in Canada. You renew at current rates when the term ends."},
  {t:"Land Transfer Tax",d:"Provincial tax paid by buyers when property changes hands. First-time buyers get rebates in Ontario, BC, and PEI."},
  {t:"Closing Costs",d:"All fees beyond the purchase price — LTT, legal fees, title insurance, inspection, and more. Budget 3–5% of purchase price."},
  {t:"Title Insurance",d:"One-time insurance protecting against title defects, survey errors, and fraud. Typically $200–$400."},
  {t:"Conditional Offer",d:"An offer to purchase that includes conditions (financing, home inspection) that must be satisfied before it becomes firm."},
  {t:"Tarion Warranty",d:"Ontario's mandatory new home warranty: 1-yr defects, 2-yr systems, 7-yr structural. Deposits up to $100K protected."},
  {t:"Condo Status Certificate",d:"Document from a condo corporation revealing financial health, reserve fund, rules, and pending legal issues."},
  {t:"Reserve Fund",d:"Money a condo corporation saves for major repairs. A weak reserve fund risks costly special assessments for owners."},
  {t:"Assignment",d:"Selling your right to purchase a property before closing — common in pre-construction. HST implications may apply."},
  {t:"Bridge Financing",d:"Short-term loan covering the gap when you close your new home before proceeds from a sold property are received."},
  {t:"Occupancy Date",d:"In pre-construction, the date you can move in. This precedes final closing by weeks to months in Ontario."},
  {t:"Development Charges",d:"Fees municipalities charge builders for new infrastructure. Can be passed to buyers — always negotiate a cap in your contract."},
];
function renderGlossary(q=''){
  const terms = q ? glossaryTerms.filter(t=>t.t.toLowerCase().includes(q.toLowerCase())||t.d.toLowerCase().includes(q.toLowerCase())) : glossaryTerms;
  document.getElementById('glossaryGrid').innerHTML = terms.map(t=>`<dl class="gc"><dt>${t.t}</dt><dd>${t.d}</dd></dl>`).join('');
}
function filterGlossary(){ renderGlossary(document.getElementById('glossSearch').value); }