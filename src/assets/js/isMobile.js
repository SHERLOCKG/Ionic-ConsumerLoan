function browserRedirect() {
    var tablet = ["ipad","xoom","sch-i800","playbook","tablet","kindle"];
    var mobile = ["mobile","iphone","ipod","blackberry","windows phone","palm","smartphone","iemobile","nokia"];
    var IOS = ["iphone","ipod","ipad"];
    var isTablet = false, isMobile = false, isIOS = false;
    var sUserAgent = navigator.userAgent.toLowerCase();
    for(index in tablet){                            
        isTablet = sUserAgent.indexOf(tablet[index]) != -1;
        if(isTablet)break;
    }
    for(index in mobile){                          
        isMobile = sUserAgent.indexOf(mobile[index]) != -1;
        if(isMobile)break;
    }
    for(index in IOS){                                
        isIOS = sUserAgent.indexOf(IOS[index]) != -1;
        if(isIOS)break;
    }
    if (!(isTablet || isMobile || isIOS)) {
        window.location.href = customConfig.redirectURL;
    }
}

browserRedirect();
window.onload = function() {
    var lastTime  = new Date();
    document.addEventListener('touchstart', function(event) {
        var data = new Date();
        if ((data - lastTime) > customConfig.pageTimeout*60*1000) {
            window.location.reload();
            event.returnValue=false;
        }
        lastTime = data;
    }, false);
};