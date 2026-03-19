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

  /* ── Core Track ── */
  var _sessionId = getSessionId();
  var _isFirstEvent = (loadEvents().filter(function(e){ return e.session === _sessionId; }).length === 0);

  function cdTrack(type, data) {
    data = data || {};
    var events = loadEvents();
    var evt = {
      t:       type,
      page:    data.page || _currentPage || 'unknown',
      ts:      Date.now(),
      session: _sessionId,
      device:  getDevice()
    };
    /* Attach extra fields */
    if (data.calc)   evt.calc   = data.calc;
    if (data.title)  evt.title  = data.title;
    if (data.source) evt.source = data.source;
    if (data.cta)    evt.cta    = data.cta;
    if (data.depth)  evt.depth  = data.depth;
    /* Referrer only on first event of session */
    if (_isFirstEvent) {
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

  /* ── CTA Click Tracking ── */
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

        /* CTA buttons: Get Started Free, Get Rate, etc. */
        if (tag === 'button' || tag === 'a') {
          var isCTA = (
            text.match(/get started|get rate|book a call|talk to a realtor|contact|subscribe|sign up/i) ||
            (cls && typeof cls === 'string' && (cls.indexOf('cta') !== -1 || cls.indexOf('rss-add-btn') !== -1))
          );
          if (isCTA) {
            cdTrack('click', { page: _currentPage, cta: text });
            return;
          }
        }
        target = target.parentElement;
      }
    });
  }

  /* ── Session Lifecycle ── */
  function initSessionTracking() {
    /* Track session start */
    cdTrack('session_start', { page: _currentPage });

    /* Track session end on visibility hide / unload */
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        cdTrack('session_end', { page: _currentPage });
      }
    });
    window.addEventListener('beforeunload', function () {
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
    _currentPage = id;
    /* Reset scroll milestones for the new page */
    Object.keys(_scrollMilestones).forEach(function (k) {
      if (k.indexOf(id + '_') === 0) _scrollMilestones[k] = false;
    });
  };

  /* ── Auto-Init on DOMContentLoaded ── */
  function init() {
    detectActivePage();
    initScrollTracking();
    initClickTracking();
    initSessionTracking();
    /* Initial pageview for whatever page is visible */
    cdTrack('pageview', { page: _currentPage });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
