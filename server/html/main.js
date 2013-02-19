//Some lib...
function $(id) {
	return document.getElementById(id);
}

function cE(type) {
	return document.createElement(type);
}

function addEvent(e, func, obj) {
	if(obj.addEventListener) {
		obj.addEventListener(e, func, false);
	} else {
		obj.attachEvent('on' + e, func);
	}
}

function removeEvent(event, func, element) {
    if(element.removeEventListener) {
        element.removeEventListener(event, func, false);
    } else {
        element.detachEvent("on" + event, func);
    }
}

function str_replace(string, find, replace) {
    var i = string.indexOf(find),
        len;

    if(i !== -1) {
        len = find.length;
        do {
            string = string.substr(0, i) + replace + string.substr(i + len);

            i = string.indexOf(find);
        } while(i !== -1);
    }

    return string;
}

function hasClass(element, classname) {
    return element.className && element.className.indexOf(classname) !== -1;
}

function addClass(e, classname) {
    if(!e.style) e = $(e);
    if(e && !hasClass(e, classname)) e.className = (e.className + ' ' + classname).trim();
}

function removeClass(e, classname) {
    if(!e.style) e = $(e);
    if(e && e.className) e.className = str_replace(e.className, classname, '').trim();
}

function addZero(str) {
	str = str + '';
	if(str.length < 2) str = '0' + str;
	return str;
}

function getWindowSize() {
	var wS = {};
	if(document.documentElement && document.documentElement.clientHeight) {
		wS.width = document.documentElement.clientWidth;
		wS.height = document.documentElement.clientHeight;
		wS.scroll_left = (window.devicePixelRatio ? document.body.scrollLeft : document.documentElement.scrollLeft);
		wS.scroll_top = (window.devicePixelRatio ? document.body.scrollTop : document.documentElement.scrollTop);
	} else {
		wS.width = document.body.clientWidth;
		wS.height = document.body.clientHeight;
		wS.scroll_left = document.body.scrollLeft;
		wS.scroll_top = document.body.scrollTop;
	}
	wS.scroll_width = document.body.scrollWidth;
	wS.scroll_height = (document.body.scrollHeight >= wS.height ? document.body.scrollHeight : wS.height);

	return wS;
}

if (!Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]" ||
               (obj instanceof Array);
    };
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach =  function(block, thisObject) {
        var len = this.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                block.call(thisObject, this[i], i, this);
            }
        }
    };
}
if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        var res = new Array(len);
        var thisp = arguments[1];

        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(thisp, this[i], i, this);
            }
        }
        return res;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function (block /*, thisp */) {
        var values = [];
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++) {
            if (block.call(thisp, this[i])) {
                values.push(this[i]);
            }
        }
        return values;
    };
}
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        var i = 0;

        if (len === 0 && arguments.length === 1) throw new TypeError();

        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }
                if (++i >= len) throw new TypeError();
            } while (true);
        }
        for (; i < len; i++) {
            if (i in this) {
                rv = fun.call(null, rv, this[i], i, this);
            }
        }
        return rv;
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (value /*, fromIndex */ ) {
        var length = this.length;
        var i = arguments[1] || 0;

        if (!length)     return -1;
        if (i >= length) return -1;
        if (i < 0)       i += length;

        for (; i < length; i++) {
            if (!Object.prototype.hasOwnProperty.call(this, i)) { continue }
            if (value === this[i]) return i;
        }
        return -1;
    };
}

if (!Object.keys) {
    Object.keys = function (object) {
        var keys = [];
        for (var name in object) {
            if (Object.prototype.hasOwnProperty.call(object, name)) {
                keys.push(name);
            }
        }
        return keys;
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
}

(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

//Main Stuff
var socket, pattern = [],
    numSteps = 46;

function req(func, params) {
	if(!socket.socket.connected) return;
	socket.emit('req', {func: func, params: params});
}

function onResize() {
	var wS = getWindowSize();
	
}

function output() {
    var out = [];
    for(var x=numSteps - 1; x>=0; x--) {
        var offset = 0;
        for(var y=0; y<10; y++) {
            out.push(pattern[(y * numSteps) + x] ? 1 : 0);
        }
    }
    console.log(out.toString());
}

function drawPattern(clear) {
    var div = $('pattern').firstChild;
    while(div.firstChild !== null) div.removeChild(div.firstChild);
    for(var x=0; x<numSteps * 10; x++) {
        var sp = cE('span');
        x % 46 == 0 && (sp.className = 'c');
        clear && (pattern[x] = false);
        pattern[x] && (sp.className += ' a');
        
        div.appendChild(sp);
    }
}
		
addEvent('load', function() {
	var t = [
			'websocket',
			'flashsocket',
			'htmlfile',
			'xhr-polling',
			'jsonp-polling'
		];

	socket = io.connect('http://' + document.location.host, {transports : t, 'connect timeout': 5000});
	socket.on('connect', function() {
		
	});
	socket.on('disconnect', function() {
		
	});
	socket.on('dump', function(dump) {
		pattern = dump;
        drawPattern();
	});
	socket.on('reset', function() {
		
	});

    drawPattern(true);    

    var div = $('pattern').firstChild,
        check = $('clearOnDrag'),
        lastSp,
        mousemove = function(e) {
            if(e.target != lastSp) {
                var sp = e.target,
                    x = 0;
                
                while((sp = sp.previousSibling) !== null) x++;
                pattern[x] = lastSp ? !check.checked : !pattern[x];
                window[(pattern[x] ? 'add' : 'remove') + 'Class'](e.target, 'a');
                lastSp = e.target;
            }
        };

    addEvent('mousedown', function(e) {
        addEvent('mousemove', mousemove, div);
        addEvent('mouseup', function() {
            removeEvent('mousemove', mousemove, div);
        }, window);
        mousemove(e);
    }, div);

    addEvent('mouseup', function() {
        removeEvent('mousemove', mousemove, div);
        lastSp = null;
    }, div);

    //addEvent('resize', onResize, window);
    //onResize();
}, window);


(function() {
	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.src = 'http://' + window.location.host + '/socket.io/socket.io.js';
	document.getElementsByTagName('head')[0].appendChild(s);
}());
