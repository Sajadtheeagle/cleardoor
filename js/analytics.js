/* ═══════════════════════════════════════════════════════
   CLEARDOOR — CLIENT-SIDE ANALYTICS  (js/analytics.js)
   localStorage key: cd_analytics_v2  |  max 5000 events
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Constants ── */
  var STORE_KEY  = 'cd_analytics_v2';
  var MAX_EVENTS = 5000;
  var SID_KEY    = 'cd_sid';

  /* ── Session ID (per tab via sessionStorage) ── */
  function getSessionId() {
    var sid = sessionStorage.getItem(SID_KEY);
    if (!sid) {
      sid = Math.random().toString(16).slice(2, 10) +
            Math.random().toString(16).slice(2, 10);
      sid = sid.slice(0, 8);
      sessionStorage.setItem(SID_KEY, sid);
    }
    return sid;
  }

  /* ── Device Detection ── */
  function getDevice() {
    var w = window.innerWidth || document.documentElement.clientWidth;
    if (w < 768)  return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  /* ── Storage ── */
  function loadEvents() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function saveEvents(arr) {
    /* prune to max */
    if (arr.length > MAX_EVENTS) arr = arr.slice(arr.length - MAX_EVENTS);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  /* ══════════════════════════════════════
     ENHANCEMENT 2 — Traffic Source / Channel Parsing
     ══════════════════════════════════════ */
  function parseChannel() {
    var cached = sessionStorage.getItem('cd_channel');
    if (cached) return cached;

    var channel = 'Direct';
    try {
      /* Check UTM params first */
      var params = new URLSearchParams(window.location.search);
      var utmSource = params.get('utm_source');
      if (utmSource) {
        var utmMedium = params.get('utm_medium') || '';
        channel = 'UTM: ' + utmSource + '/' + utmMedium;
      } else {
        var ref = document.referrer;
        if (!ref) {
          channel = 'Direct';
        } else {
          /* Extract hostname from referrer */
          var refHost = '';
          try {
            refHost = new URL(ref).hostname.toLowerCase();
          } catch (e) {
            refHost = ref.toLowerCase();
          }
          var siteHost = window.location.hostname.toLowerCase();

          if (refHost === siteHost || refHost === 'www.' + siteHost || ('www.' + refHost) === siteHost) {
            channel = 'Internal';
          } else if (refHost.indexOf('google.') !== -1) {
            channel = 'Google';
          } else if (refHost.indexOf('bing.') !== -1) {
            channel = 'Bing';
          } else if (refHost.indexOf('facebook.') !== -1 || refHost.indexOf('fb.com') !== -1) {
            channel = 'Facebook';
          } else if (refHost.indexOf('instagram.') !== -1) {
            channel = 'Instagram';
          } else if (refHost.indexOf('linkedin.') !== -1) {
            channel = 'LinkedIn';
          } else if (refHost.indexOf('twitter.') !== -1 || refHost === 'x.com' || refHost === 'www.x.com' || refHost.indexOf('t.co') !== -1) {
            channel = 'X / Twitter';
          } else if (refHost.indexOf('youtube.') !== -1) {
            channel = 'YouTube';
          } else if (refHost.indexOf('mail.google.com') !== -1 || refHost.indexOf('outlook.') !== -1 ||
                     (refHost.indexOf('yahoo.') !== -1 && ref.indexOf('mail') !== -1)) {
            channel = 'Email';
          } else {
            /* Strip www. prefix for cleaner domain display */
            var domain = refHost.replace(/^www\./, '');
            channel = 'Referral: ' + domain;
          }
        }
      }
    } catch (e) {
      channel = 'Direct';
    }

    sessionStorage.setItem('cd_channel', channel);
    return channel;
  }

  /* ══════════════════════════════════════
     ENHANCEMENT 1 — Geolocation
     ══════════════════════════════════════ */
  var _geoData = null;

  function initGeo() {
    /* Check sessionStorage cache first */
    try {
      var cached = sessionStorage.getItem('cd_geo');
      if (cached) {
        _geoData = JSON.parse(cached);
        return;
      }
    } catch (e) {}

    /* Fetch from ipapi.co */
    try {
      fetch('https://ipapi.co/json/')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          try {
            _geoData = {
              country:      data.country_name || '',
              city:         data.city         || '',
              region:       data.region       || '',
              country_code: data.country_code || '',
              latitude:     data.latitude     || null,
              longitude:    data.longitude    || null
            };
            sessionStorage.setItem('cd_geo', JSON.stringify(_geoData));
            /* Retroactively patch the session_start event already stored */
            _patchSessionStartGeo(_geoData);
          } catch (e) {}
        })
        .catch(function () {});
    } catch (e) {}
  }

  /* Patch the most-recent session_start for this session with full geo */
  function _patchSessionStartGeo(geo) {
    try {
      var events = loadEvents();
      for (var i = events.length - 1; i >= 0; i--) {
        if (events[i].t === 'session_start' && events[i].session === _sessionId) {
          events[i].geo_full = geo;
          events[i].geo = { country: geo.country, city: geo.city };
          saveEvents(events);
          break;
        }
      }
    } catch (e) {}
  }

  /* ── Core Track ── */
  var _sessionId = getSessionId();
  var _channel   = parseChannel();
  var _isFirstEvent = (loadEvents().filter(function(e){ return e.session === _sessionId; }).length === 0);

  function cdTrack(type, data) {
    data = data || {};
    var events = loadEvents();
    var evt = {
      t:       type,
      page:    data.page || _currentPage || 'unknown',
      ts:      Date.now(),
      session: _sessionId,
      device:  getDevice(),
      channel: _channel
    };

    /* Attach geo short-form to every event (if available) */
    if (_geoData) {
      evt.geo = { country: _geoData.country, city: _geoData.city };
    }

    /* Attach extra fields */
    if (data.calc)     evt.calc     = data.calc;
    if (data.title)    evt.title    = data.title;
    if (data.source)   evt.source   = data.source;
    if (data.cta)      evt.cta      = data.cta;
    if (data.depth)    evt.depth    = data.depth;
    if (data.label)    evt.label    = data.label;
    if (data.duration_ms !== undefined) evt.duration_ms = data.duration_ms;
    if (data.section)  evt.section  = data.section;

    /* session_start gets full geo + referrer */
    if (type === 'session_start') {
      evt.ref = document.referrer || '';
      if (_geoData) {
        evt.geo_full = _geoData;
        evt.geo = { country: _geoData.country, city: _geoData.city };
      }
      _isFirstEvent = false;
    } else if (_isFirstEvent) {
      evt.ref = document.referrer || '';
      _isFirstEvent = false;
    }

    events.push(evt);
    saveEvents(events);
  }

  /* ── Public API ── */
  window.cdTrack = cdTrack;
  window.cdGetAnalytics = function () { return loadEvents(); };
  window.cdClearAnalytics = function () { localStorage.removeItem(STORE_KEY); };

  /* ── Current Page Tracking ── */
  var _currentPage = 'home';
  /* Try to detect the currently active page on load */
  function detectActivePage() {
    var active = document.querySelector('.page.active');
    if (active) {
      var id = active.id || '';
      _currentPage = id.replace('page-', '') || 'home';
    }
  }

  /* ══════════════════════════════════════
     ENHANCEMENT 3 — Time on Page
     ══════════════════════════════════════ */
  var _cdPageEnter = Date.now();
  var _cdLastPage  = _currentPage;

  /* Emit time_on_page for the page we're leaving */
  function _emitTimeOnPage(page, enterTime) {
    if (!page || enterTime === null) return;
    var elapsed = Date.now() - enterTime;
    if (elapsed > 0) {
      cdTrack('time_on_page', { page: page, duration_ms: elapsed });
    }
  }

  /* ── Scroll Depth Tracking ── */
  var _scrollMilestones = {};
  function initScrollTracking() {
    var milestones = [25, 50, 75, 100];
    function onScroll() {
      var scrollTop  = window.scrollY || document.documentElement.scrollTop;
      var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var pct = Math.round((scrollTop / docHeight) * 100);
      milestones.forEach(function (m) {
        var key = _currentPage + '_' + m;
        if (pct >= m && !_scrollMilestones[key]) {
          _scrollMilestones[key] = true;
          cdTrack('scroll', { page: _currentPage, depth: m });
        }
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ══════════════════════════════════════
     ENHANCEMENT 4 — Click Tracking (label) + Section Dwell
     ══════════════════════════════════════ */

  /* CTA Click Tracking — enhanced with label */
  function initClickTracking() {
    document.addEventListener('click', function (e) {
      var target = e.target;
      /* Walk up max 3 levels to find a button/a */
      for (var i = 0; i < 3; i++) {
        if (!target || target === document.body) break;
        var tag  = (target.tagName || '').toLowerCase();
        var text = (target.textContent || '').trim().slice(0, 60);
        var cls  = target.className || '';

        /* Calculator tab switches */
        if (cls && typeof cls === 'string' && cls.indexOf('tabbtn') !== -1) {
          var tab = target.getAttribute('data-tab') || text;
          cdTrack('calc', { page: _currentPage, calc: tab });
          return;
        }

        /* All buttons and links — capture label, plus flag CTA buttons */
        if (tag === 'button' || tag === 'a') {
          var label = (target.textContent || '').trim().slice(0, 40);
          var isCTA = (
            text.match(/get started|get rate|book a call|talk to a realtor|contact|subscribe|sign up/i) ||
            (cls && typeof cls === 'string' && (cls.indexOf('cta') !== -1 || cls.indexOf('rss-add-btn') !== -1))
          );
          if (isCTA) {
            cdTrack('click', { page: _currentPage, cta: text, label: label });
            return;
          }
          /* Track all button clicks with label */
          if (tag === 'button' && label) {
            cdTrack('click', { page: _currentPage, label: label });
            return;
          }
        }
        target = target.parentElement;
      }
    });
  }

  /* Section dwell tracking via IntersectionObserver */
  function initSectionDwellTracking() {
    if (!window.IntersectionObserver) return;

    var sectionIds = [
      'page-home', 'page-calculators', 'page-blog', 'page-rates',
      'page-new-construction', 'page-glossary', 'page-listings',
      'page-map', 'page-programs'
    ];

    var _sectionEnterTimes = {};
    var DWELL_THRESHOLD_MS = 3000;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        if (entry.isIntersecting) {
          /* Section entered viewport */
          _sectionEnterTimes[id] = Date.now();
        } else {
          /* Section left viewport — emit if dwell >= threshold */
          if (_sectionEnterTimes[id]) {
            var dwell = Date.now() - _sectionEnterTimes[id];
            if (dwell >= DWELL_THRESHOLD_MS) {
              cdTrack('section_view', { section: id, duration_ms: dwell, page: _currentPage });
            }
            _sectionEnterTimes[id] = null;
          }
        }
      });
    }, { threshold: 0.4 });

    /* Observe sections — try immediately and also after DOM is ready */
    function observeSections() {
      sectionIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeSections);
    } else {
      observeSections();
    }
  }

  /* ── Session Lifecycle ── */
  function initSessionTracking() {
    /* Track session start */
    cdTrack('session_start', { page: _currentPage });

    /* Track session end on visibility hide / unload */
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        /* Enhancement 3: emit time_on_page before session_end */
        _emitTimeOnPage(_currentPage, _cdPageEnter);
        _cdPageEnter = null;
        cdTrack('session_end', { page: _currentPage });
      } else if (document.visibilityState === 'visible') {
        /* Enhancement 3: reset page enter timer when tab becomes visible again */
        _cdPageEnter = Date.now();
      }
    });
    window.addEventListener('beforeunload', function () {
      if (_cdPageEnter !== null) {
        _emitTimeOnPage(_currentPage, _cdPageEnter);
      }
      cdTrack('session_end', { page: _currentPage });
    });
  }

  /* ── News Article Open Tracking ── */
  /* Expose a helper for blog/news code to call */
  window.cdTrackNews = function (title, source) {
    cdTrack('news', { page: _currentPage, title: title, source: source });
  };

  /* ── Page Change Hook ── */
  /* Called by showPage() in main.js and also internally */
  window.cdSetPage = function (id) {
    /* Enhancement 3: emit time_on_page when leaving current page */
    if (id !== _currentPage && _cdPageEnter !== null) {
      _emitTimeOnPage(_currentPage, _cdPageEnter);
      _cdPageEnter = Date.now();
    }
    _currentPage = id;
    /* Reset scroll milestones for the new page */
    Object.keys(_scrollMilestones).forEach(function (k) {
      if (k.indexOf(id + '_') === 0) _scrollMilestones[k] = false;
    });
  };

  /* ── Auto-Init on DOMContentLoaded ── */
  function init() {
    detectActivePage();
    _cdLastPage  = _currentPage;
    _cdPageEnter = Date.now();
    initScrollTracking();
    initClickTracking();
    initSectionDwellTracking();
    initSessionTracking();
    /* Initial pageview for whatever page is visible */
    cdTrack('pageview', { page: _currentPage });
    /* Enhancement 1: fetch geo data */
    initGeo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
