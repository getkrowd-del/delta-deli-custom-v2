var chatOpen = false;
  var dismissed = false;

  function dismissPopout() {
    var p = document.getElementById('delta-chat-popout');
    p.classList.add('hide');
    setTimeout(function(){ p.style.display = 'none'; }, 250);
    dismissed = true;
  }

  function toggleDeltaChat() {
    if (!dismissed) dismissPopout();
    var panel = document.getElementById('delta-chat-panel');
    if (chatOpen) {
      panel.classList.remove('open');
      chatOpen = false;
    } else {
      panel.classList.add('open');
      chatOpen = true;
    }
  }

  // Close chat if user clicks outside
  document.addEventListener('click', function(e) {
    if (!chatOpen) return;
    var wrapper = document.getElementById('delta-chat-wrapper');
    var panel = document.getElementById('delta-chat-panel');
    if (!wrapper.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
      chatOpen = false;
    }
  });

  // Kill any platform default bubble that tries to inject
  function nukeDefault() {
    ['#paymegpt-bubble-btn','[id*="paymegpt-bubble"]','[class*="paymegpt-bubble"]',
     '[id*="pmgpt-launcher"]','[class*="pmgpt-launcher"]','div[data-paymegpt-launcher]',
     '[class*="widget-launcher"]','[class*="widget-bubble"]'].forEach(function(s){
      try { document.querySelectorAll(s).forEach(function(el){
        el.style.cssText='display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;position:absolute!important;top:-9999px!important;left:-9999px!important;';
      }); } catch(e){}
    });
    // Also scan for any injected fixed round bubble we don't own
    document.querySelectorAll('body > div').forEach(function(el){
      if (el.id==='delta-chat-wrapper'||el.id==='delta-chat-panel') return;
      var cs=window.getComputedStyle(el), attr=el.getAttribute('style')||'';
      if ((cs.position==='fixed'||attr.includes('fixed'))&&!el.id.startsWith('delta')) {
        var r=el.getBoundingClientRect();
        if (r.width<130&&r.height<130&&r.width>0) {
          var bg=cs.backgroundColor||'', br=cs.borderRadius||'';
          if (br.includes('50%')||bg.includes('245, 166')||attr.includes('border-radius: 50%')) {
            el.style.cssText='display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;';
          }
        }
      }
    });
  }
  nukeDefault();
  setInterval(nukeDefault, 200);
  new MutationObserver(nukeDefault).observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['style','class','id']});
  window.addEventListener('load', nukeDefault);