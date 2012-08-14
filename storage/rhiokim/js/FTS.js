/* Copyright (c) 2010-2012 Marcus Westin */
(function(){function u(){try{return r in t&&t[r]}catch(e){return!1}}function a(){try{return i in t&&t[i]&&t[i][t.location.hostname]}catch(e){return!1}}var e={},t=window,n=t.document,r="localStorage",i="globalStorage",s="__storejs__",o;e.disabled=!1,e.set=function(e,t){},e.get=function(e){},e.remove=function(e){},e.clear=function(){},e.transact=function(t,n,r){var i=e.get(t);r==null&&(r=n,n=null),typeof i=="undefined"&&(i=n||{}),r(i),e.set(t,i)},e.getAll=function(){},e.serialize=function(e){return JSON.stringify(e)},e.deserialize=function(e){return typeof e!="string"?undefined:JSON.parse(e)};if(u())o=t[r],e.set=function(t,n){if(n===undefined)return e.remove(t);o.setItem(t,e.serialize(n))},e.get=function(t){return e.deserialize(o.getItem(t))},e.remove=function(e){o.removeItem(e)},e.clear=function(){o.clear()},e.getAll=function(){var t={};for(var n=0;n<o.length;++n){var r=o.key(n);t[r]=e.get(r)}return t};else if(a())o=t[i][t.location.hostname],e.set=function(t,n){if(n===undefined)return e.remove(t);o[t]=e.serialize(n)},e.get=function(t){return e.deserialize(o[t]&&o[t].value)},e.remove=function(e){delete o[e]},e.clear=function(){for(var e in o)delete o[e]},e.getAll=function(){var t={};for(var n=0;n<o.length;++n){var r=o.key(n);t[r]=e.get(r)}return t};else if(n.documentElement.addBehavior){var f,l;try{l=new ActiveXObject("htmlfile"),l.open(),l.write('<script>document.w=window</script><iframe src="/favicon.ico"></frame>'),l.close(),f=l.w.frames[0].document,o=f.createElement("div")}catch(c){o=n.createElement("div"),f=n.body}function h(t){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(o),f.appendChild(o),o.addBehavior("#default#userData"),o.load(r);var i=t.apply(e,n);return f.removeChild(o),i}}function p(e){return"_"+e}e.set=h(function(t,n,i){n=p(n);if(i===undefined)return e.remove(n);t.setAttribute(n,e.serialize(i)),t.save(r)}),e.get=h(function(t,n){return n=p(n),e.deserialize(t.getAttribute(n))}),e.remove=h(function(e,t){t=p(t),e.removeAttribute(t),e.save(r)}),e.clear=h(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(r);for(var n=0,i;i=t[n];n++)e.removeAttribute(i.name);e.save(r)}),e.getAll=h(function(t){var n=t.XMLDocument.documentElement.attributes;t.load(r);var i={};for(var s=0,o;o=n[s];++s)i[o]=e.get(o);return i})}try{e.set(s,s),e.get(s)!=s&&(e.disabled=!0),e.remove(s)}catch(c){e.disabled=!0}e.enabled=!e.disabled,typeof module!="undefined"&&typeof module=="object"&&typeof module!="function"?module.exports=e:typeof define=="function"&&define.amd?define(e):this.store=e})()


/* Copyright (c) 2012-2012 Rhio Kim */

/**
 * load fucked rank data
 */
function toggle(status) {
	store.set('fuckthissite', status);
	store.set('fuckdate', new Date());
}

function fuckit(el, bool) {
	var status = store.get('fuckthissite') ? false : true;
	if(status) {
		el.innerHTML = 'Fuck It';
	} else {
		el.innerHTML = 'Un Fuck';
	}

	if(bool) {
		toggle(status);
	}	
}
/**
 * load fucked rank data
 */
function loadFuckRank() {
	alert('아직 구현되지 않는 기능입니다.');
}

function loadCss(url) {
	var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = url;

	document.getElementsByTagName("head")[0].appendChild(link);
}

function FTS(root) {

	var _temp = '<div id="__fuckthissite__" class="fts-navbar fts-fixed-top">' +
					'<div class="fts-inner">' +
						'<a id="fts-btn-fuckit" href="#" class="fts-btn fts-btn-primary" onclick="fuckit(this, true)">Fuck It</a>' +
						' ' +
						'<a href="#" class="fts-btn" onclick="loadFuckRank()">Rank</a>' +
						' ' +
						'<a href="#" class="fts-btn" onclick="clear()">clear</a>' +
						' ' +
						'<span id="fts-ment" class="fts-text"></span>' +
						'' +
						'<!--a class="brand" href="https://github.com/frends/FRENDS_Monthly_Hackathon/tree/master/storage/rhiokim" target="_blank">FuckThisSite.com</a-->' +
					'</div>' +
				'</div>';


	function clearStore() {
		store.set('fuckthissite', false);
	}

	function createUI() {
		var div;

		loadCss('http://localhost:8082/css/main.css');

		div = document.createElement('div');
		div.innerHTML = _temp;
		document.body.appendChild(div);
	}

	createUI();	
	fuckit(document.getElementById('fts-btn-fuckit'));

};

FTS(window)