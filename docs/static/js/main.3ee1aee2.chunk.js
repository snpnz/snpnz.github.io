(this.webpackJsonpsnpnz=this.webpackJsonpsnpnz||[]).push([[0],{15:function(t,e,n){},17:function(t,e,n){},27:function(t,e,n){"use strict";n.r(e);var c=n(1),r=n.n(c),a=n(7),o=n.n(a),s=(n(15),n(2)),i=n.n(s),u=n(4),l=n(3),h=(n(17),n(10),"73436");function j(){return(j=Object(u.a)(i.a.mark((function t(){return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return"",t.next=3,fetch("https://www.strava.com/oauth/deauthorize?".concat(new URLSearchParams({access_token:""}).toString()),{method:"POST"}).then((function(t){return t.json()}));case 3:return localStorage.clear(),t.abrupt("return",Promise.resolve({success:!0}));case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var d=n(8),p=n.n(d),f=n(0),b=function(t){var e=t.onChange,n=r.a.useState("environment"),c=Object(l.a)(n,2),a=c[0],o=c[1],s=r.a.useState(null),i=Object(l.a)(s,2),u=i[0],h=i[1];return Object(f.jsxs)("div",{children:[Object(f.jsx)("button",{onClick:function(){return o((function(t){return"user"===a?"environment":"user"}))},children:"\u041f\u043e\u043c\u0435\u043d\u044f\u0442\u044c \u043a\u0430\u043c\u0435\u0440\u0443"}),Object(f.jsx)(p.a,{delay:600,onError:function(t){console.log(t)},onScan:function(t){t!==u&&(e(t),h(t))},style:{width:"100%"},facingMode:a})]})};var v=function(){var t=Object(c.useState)(null),e=Object(l.a)(t,2),n=e[0],r=e[1],a=Object(c.useState)(!0),o=Object(l.a)(a,2),s=(o[0],o[1],Object(c.useState)("")),d=Object(l.a)(s,2),p=d[0],v=d[1];return Object(c.useEffect)((function(){(function(){var t=Object(u.a)(i.a.mark((function t(){var e,n;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch("/api/user/",{credentials:"include"});case 3:return e=t.sent,t.next=6,e.json();case 6:!1===(n=t.sent).success?r(void 0):r(n.data),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0),v(t.t0.message);case 13:case"end":return t.stop()}}),t,null,[[0,10]])})));return function(){return t.apply(this,arguments)}})()().then()}),[]),null===n?Object(f.jsx)("div",{children:"Loading..."}):void 0===n?Object(f.jsx)("div",{className:"App",children:Object(f.jsx)("button",{className:"bigButton",onClick:function(){return window.location.href=function(){var t={client_id:h,redirect_uri:"http://localhost/oauth/?redir="+window.location.origin,response_type:"code",approval_prompt:"auto",scope:"activity:read"},e=new URLSearchParams;return Object.entries(t).forEach((function(t){var n=Object(l.a)(t,2),c=n[0],r=n[1];return e.append(c,r)})),"https://www.strava.com/oauth/authorize?".concat(e.toString())}()},children:"\u0412\u043e\u0439\u0442\u0438 \u0432 Strava"})}):Object(f.jsxs)("div",{className:"App",children:[p&&Object(f.jsx)("p",{children:p}),Object(f.jsxs)("div",{style:{textAlign:"left",lineHeight:"15px",padding:"8px"},children:[Object(f.jsx)("button",{style:{float:"right"},onClick:function(){return function(){return j.apply(this,arguments)}()},children:"\u0412\u044b\u0439\u0442\u0438"}),Object(f.jsx)("img",{src:n.photo,style:{float:"left"},width:40}),Object(f.jsxs)("div",{children:[n.name,Object(f.jsx)("br",{}),n.surname]})]}),"\u041e\u043b\u043e\u043b\u043e",Object(f.jsx)(b,{onChange:function(t){return console.log(t)}})]})},O=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,28)).then((function(e){var n=e.getCLS,c=e.getFID,r=e.getFCP,a=e.getLCP,o=e.getTTFB;n(t),c(t),r(t),a(t),o(t)}))};o.a.render(Object(f.jsx)(r.a.StrictMode,{children:Object(f.jsx)(v,{})}),document.getElementById("root")),O()}},[[27,1,2]]]);
//# sourceMappingURL=main.3ee1aee2.chunk.js.map