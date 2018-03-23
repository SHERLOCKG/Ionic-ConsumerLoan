function getTrustevJS() {
    var tv = document.createElement('script');
    tv.type = 'text/javascript';tv.async = true;
    tv.src = 'https://app.trustev.com/api/v2.0/TrustevJS?key=d26bcae8c7aa47cf81bdcde419bf43a8';
    // tv.src = 'https://app.trustev.com/api/v2.0/TrustevJS?key=68bda4d018c34b38977812b7a7367310';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(tv,s);
    }
if(window.addEventListener)
    window.addEventListener("load",getTrustevJS,false);
else if(window.attachEvent)
    window.attachEvent("onload",getTrustevJS);
else window.onload = getTrustevJS();
