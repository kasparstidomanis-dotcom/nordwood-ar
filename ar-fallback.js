/* Nordwood AR launcher: model-viewer first, then a direct native launch so AR always opens on a phone.
   iPhone -> AR Quick Look (usdz).  Android -> Google Scene Viewer (uncompressed glb). */
(function () {
  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  var inApp = /FBAN|FBAV|FB_IAB|Instagram|Messenger|Line\/|TikTok|Snapchat|LinkedInApp|Pinterest/i.test(ua);

  window.nwMobile = function () { return isIOS || isAndroid; };

  function abs(u) { return new URL(u, location.href).href; }

  function quickLook(usdz) {
    var a = document.createElement('a');
    a.setAttribute('rel', 'ar');
    a.href = abs(usdz) + '#allowsContentScaling=0';
    a.appendChild(document.createElement('img')); // Safari needs an <img> child to open Quick Look
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.remove(); }, 1000);
  }

  function sceneViewer(glb, title) {
    var file = abs(glb);
    var params = 'file=' + encodeURIComponent(file) + '&mode=ar_preferred&resizable=false&disable_occlusion=true' +
      (title ? '&title=' + encodeURIComponent(title) : '');
    location.href = 'intent://arvr.google.com/scene-viewer/1.0?' + params +
      '#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;' +
      'S.browser_fallback_url=' + encodeURIComponent(location.href) + ';end;';
  }

  window.nwAR = function (mv) {
    var glb = mv.getAttribute('src'), usdz = mv.getAttribute('ios-src');
    if (inApp) {
      if (isAndroid && glb) {
        sceneViewer(glb, mv.alt || mv.getAttribute('alt'));
        setTimeout(function () { if (document.visibilityState === 'visible') showInAppNote(); }, 2500);
      } else showInAppNote();
      return;
    }
    if (mv.canActivateAR) { mv.activateAR(); return; }
    if (isIOS && usdz) { quickLook(usdz); return; }
    if (isAndroid && glb) { sceneViewer(glb, mv.alt || mv.getAttribute('alt')); return; }
  };

  function showInAppNote() {
    if (document.getElementById('nwInApp')) { document.getElementById('nwInApp').hidden = false; return; }
    var d = document.createElement('div');
    d.id = 'nwInApp';
    d.setAttribute('role', 'alert');
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;padding:16px 18px;border-radius:12px;' +
      'background:#1f3d2b;color:#fff;font:500 16px/1.4 system-ui,-apple-system,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.35)';
    d.innerHTML = '<b style="display:block;font-size:17px;margin-bottom:4px">Open in ' + (isIOS ? 'Safari' : 'Chrome') + ' to see it in your yard</b>' +
      'This app\'s browser can\'t open AR. Tap <b>&middot;&middot;&middot;</b> (top right) and choose <b>Open in ' + (isIOS ? 'Safari' : 'browser') + '</b>.' +
      '<button type="button" aria-label="Close" style="position:absolute;top:6px;right:8px;background:none;border:0;color:#fff;font-size:24px;line-height:1;padding:6px;cursor:pointer">&times;</button>';
    d.querySelector('button').onclick = function () { d.hidden = true; };
    document.body.appendChild(d);
  }
  /* Android backup: if Google's viewer won't open, run AR inside Chrome instead */
  window.nwARBackup = function (mv) {
    mv.setAttribute('ar-modes', 'webxr');
    setTimeout(function () { if (mv.canActivateAR) mv.activateAR(); else sceneViewer(mv.getAttribute('src'), mv.alt); }, 300);
  };
  if (isAndroid) document.addEventListener('DOMContentLoaded', function () {
    var go = document.getElementById('arGo'), mv = document.getElementById('mv');
    if (!go || !mv) return;
    var a = document.createElement('button');
    a.type = 'button';
    a.textContent = "Didn't open? Try the backup viewer";
    a.style.cssText = 'display:block;margin:12px auto 0;background:none;border:0;color:inherit;font:600 15px/1.3 inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;opacity:.85';
    a.onclick = function () { nwARBackup(mv); };
    go.insertAdjacentElement('afterend', a);
  });
})();
