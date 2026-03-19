/* CLEARDOOR — SEO
   Dynamic meta tag updater + JSON-LD structured data injection
================================================================ */

// ══ PAGE META DEFINITIONS ══
var SEO_PAGES = {
  home: {
    title: "ClearDoor – Canada's First-Time Home Buyer Platform | Ottawa",
    desc: "Everything first-time buyers need: mortgage rates from 22 lenders, FHSA & RRSP calculators, Ottawa listings, new construction, and government grant guides. Free."
  },
  rates: {
    title: "Today's Best Canadian Mortgage Rates 2026 | ClearDoor",
    desc: "Compare live mortgage rates from 22 lenders — nesto, Butler, RBC, TD, BMO, Scotiabank and more. Insured vs uninsured rates, 5yr fixed from 3.79%. Updated daily."
  },
  calculator: {
    title: "Mortgage Calculator Canada 2026 – Affordability, CMHC & LTT | ClearDoor",
    desc: "Free Canadian mortgage calculators: monthly payment, affordability, CMHC insurance, land transfer tax, savings planner, and rent vs buy. Instant results."
  },
  financial: {
    title: "Canadian First-Time Buyer Programs 2026 – FHSA, HBP, Rebates | ClearDoor",
    desc: "Complete guide to Canadian government programs for first-time buyers: FHSA ($40,000 tax-free), Home Buyers' Plan, First-Time Home Buyer Incentive, GST/HST rebates."
  },
  listings: {
    title: "Search Ottawa & Canada Home Listings | ClearDoor",
    desc: "Search all Canadian real estate listings through Realtor.ca. Filter by city, price, bedrooms, and property type. Find your first home faster."
  },
  newconstruction: {
    title: "New Construction & Pre-Construction Homes Canada 2026 | ClearDoor",
    desc: "Browse new construction and pre-construction homes across Canada. Filter by city, price, occupancy date, and developer. Ottawa, Toronto, Vancouver and more."
  },
  blog: {
    title: "Canadian Real Estate News & Mortgage Updates 2026 | ClearDoor",
    desc: "Latest Canadian real estate news from CBC, BNN Bloomberg, Bank of Canada, MPA Magazine, Better Dwelling and more. Mortgage rates, market analysis, and buyer tips."
  },
  market: {
    title: "Canadian Real Estate Market Reports 2026 | ClearDoor",
    desc: "Ottawa and Canadian real estate market data, price trends, neighbourhood reports, and housing market analysis for first-time buyers."
  },
  ottawaplan: {
    title: "Ottawa City Planning Map – Zoning & Development Plans | ClearDoor",
    desc: "Interactive Ottawa zoning and city development planning map. Find approved developments, transit-oriented communities, and neighbourhood plans near you."
  },
  glossary: {
    title: "Canadian Mortgage & Real Estate Glossary 2026 | ClearDoor",
    desc: "Clear definitions for 100+ Canadian mortgage and real estate terms. Amortization, CMHC, LTV, stress test, bridge financing, and more — explained simply."
  },
  checklist: {
    title: "First-Time Home Buyer Checklist Canada – 40 Steps | ClearDoor",
    desc: "Complete 40-item interactive checklist for Canadian first-time buyers. From pre-approval to closing day — never miss a step in your home purchase."
  },
  about: {
    title: "About ClearDoor – Canada's First-Time Buyer Platform | Ottawa",
    desc: "ClearDoor is Canada's most complete platform for first-time home buyers. Built in Ottawa to help Canadians navigate mortgages, programs, and their first purchase."
  }
};

// ══ DYNAMIC META UPDATER ══
function seoUpdate(pageId) {
  var data = SEO_PAGES[pageId] || SEO_PAGES['home'];
  var hash = pageId === 'home' ? '' : '#' + pageId;
  var url = 'https://cleardoor.ca/' + hash;

  // Title
  document.title = data.title;

  // Meta description
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', data.desc);

  // OG title
  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', data.title);

  // OG description
  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', data.desc);

  // OG URL
  var ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', url);

  // Canonical
  var canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', url);

  // Update URL in browser history (for bookmarking + crawlability)
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, data.title, '/' + hash);
  }
}

// ══ HASH CHANGE LISTENER ══
window.addEventListener('hashchange', function () {
  var hash = window.location.hash.replace('#', '') || 'home';
  seoUpdate(hash);
});

// ══ INITIAL META ON LOAD ══
document.addEventListener('DOMContentLoaded', function () {
  var hash = window.location.hash.replace('#', '') || 'home';
  seoUpdate(hash);

  // ══ JSON-LD STRUCTURED DATA ══
  var schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://cleardoor.ca/#website",
        "name": "ClearDoor",
        "url": "https://cleardoor.ca",
        "description": "Canada's most complete platform for first-time home buyers",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://cleardoor.ca/#listings?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://cleardoor.ca/#org",
        "name": "ClearDoor",
        "url": "https://cleardoor.ca",
        "logo": "https://cleardoor.ca/images/logo.png",
        "description": "Canada's first-time home buyer platform",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ottawa",
          "addressRegion": "Ontario",
          "addressCountry": "CA"
        },
        "sameAs": ["https://github.com/Sajadtheeagle/cleardoor"]
      },
      {
        "@type": ["FinancialService", "LocalBusiness"],
        "@id": "https://cleardoor.ca/#business",
        "name": "ClearDoor – First-Time Home Buyer Platform",
        "url": "https://cleardoor.ca",
        "description": "Free tools, mortgage rate comparisons, government program guides, and calculators for Canadian first-time home buyers",
        "areaServed": {"@type": "Country", "name": "Canada"},
        "serviceType": ["Mortgage Rate Comparison", "Home Buyer Education", "Real Estate Tools"],
        "priceRange": "Free",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ottawa",
          "addressRegion": "Ontario",
          "addressCountry": "CA"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the FHSA and how does it work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The First Home Savings Account (FHSA) lets first-time buyers save up to $8,000/year (max $40,000 lifetime) tax-free. Contributions are tax-deductible like an RRSP, and withdrawals for a qualifying home purchase are tax-free like a TFSA."
            }
          },
          {
            "@type": "Question",
            "name": "What are today's best mortgage rates in Canada?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "As of 2026, the best 5-year fixed insured rate in Canada is around 3.79% from brokers like nesto. Variable rates are near prime minus 1.00% (approximately 3.95%). Compare all lenders on ClearDoor's live mortgage rates page."
            }
          },
          {
            "@type": "Question",
            "name": "How much down payment do I need to buy a home in Canada?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In Canada, the minimum down payment is 5% for homes up to $500,000, and 10% for the portion between $500,000-$999,999. Homes over $1 million require 20% down. Putting down less than 20% requires CMHC mortgage insurance."
            }
          },
          {
            "@type": "Question",
            "name": "What is the Canadian mortgage stress test?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The mortgage stress test requires you to qualify at the greater of your contract rate plus 2%, or 5.25%. This ensures you can afford payments if rates rise. Use ClearDoor's affordability calculator to see how much you qualify for."
            }
          },
          {
            "@type": "Question",
            "name": "What government programs are available for first-time buyers in Canada?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "First-time buyers in Canada can access the FHSA (up to $40,000 tax-free savings), the Home Buyers' Plan (withdraw up to $60,000 from RRSP), the First-Time Home Buyers' Tax Credit ($10,000 credit = ~$1,500 back), and provincial land transfer tax rebates."
            }
          },
          {
            "@type": "Question",
            "name": "How do I calculate my mortgage in Canada?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use ClearDoor's free mortgage calculator to calculate your monthly payment, total interest, and amortization schedule. Enter your home price, down payment, interest rate, and amortization period. The calculator includes CMHC insurance and land transfer tax estimates."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Buy Your First Home in Canada",
        "description": "Complete step-by-step guide to buying your first home in Canada",
        "totalTime": "PT6M",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Open an FHSA",
            "text": "Open a First Home Savings Account to save up to $40,000 tax-free for your down payment."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Check government programs",
            "text": "Review all available grants, rebates, and incentives including the RRSP Home Buyers' Plan."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Calculate affordability",
            "text": "Use the stress-test calculator to determine how much you can afford including CMHC insurance."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Compare mortgage rates",
            "text": "Compare live rates from 22+ Canadian lenders to find the best insured and uninsured rates."
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Search listings",
            "text": "Search Canadian real estate listings and pre-construction projects filtered to your budget."
          },
          {
            "@type": "HowToStep",
            "position": 6,
            "name": "Close with confidence",
            "text": "Follow the 40-item buyer checklist to ensure nothing is missed from offer to closing day."
          }
        ]
      }
    ]
  };

  var ldScript = document.createElement('script');
  ldScript.type = 'application/ld+json';
  ldScript.textContent = JSON.stringify(schema);
  document.head.appendChild(ldScript);
});
