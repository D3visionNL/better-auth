import{getCurrentInstance as ye,getCurrentScope as me,onScopeDispose as ge,readonly as ve,shallowRef as Re}from"vue";function Se(e){let t=ye();if(t&&t.proxy){let r=t.proxy;("_nanostores"in r?r._nanostores:r._nanostores=[]).push(e)}}function M(e){let t=Re(),r=e.subscribe(n=>{t.value=n});return me()&&ge(r),process.env.NODE_ENV!=="production"?(Se(e),ve(t)):t}var be=Object.defineProperty,Te=Object.defineProperties,Pe=Object.getOwnPropertyDescriptors,G=Object.getOwnPropertySymbols,Oe=Object.prototype.hasOwnProperty,we=Object.prototype.propertyIsEnumerable,z=(e,t,r)=>t in e?be(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,R=(e,t)=>{for(var r in t||(t={}))Oe.call(t,r)&&z(e,r,t[r]);if(G)for(var r of G(t))we.call(t,r)&&z(e,r,t[r]);return e},b=(e,t)=>Te(e,Pe(t)),_e=class extends Error{constructor(e,t,r){super(t||e.toString(),{cause:r}),this.status=e,this.statusText=t,this.error=r}},Ee=async(e,t)=>{var r,n,s,a,o,u;let c=t||{},i={onRequest:[t?.onRequest],onResponse:[t?.onResponse],onSuccess:[t?.onSuccess],onError:[t?.onError],onRetry:[t?.onRetry]};if(!t||!t?.plugins)return{url:e,options:c,hooks:i};for(let l of t?.plugins||[]){if(l.init){let f=await((r=l.init)==null?void 0:r.call(l,e.toString(),t));c=f.options||c,e=f.url}i.onRequest.push((n=l.hooks)==null?void 0:n.onRequest),i.onResponse.push((s=l.hooks)==null?void 0:s.onResponse),i.onSuccess.push((a=l.hooks)==null?void 0:a.onSuccess),i.onError.push((o=l.hooks)==null?void 0:o.onError),i.onRetry.push((u=l.hooks)==null?void 0:u.onRetry)}return{url:e,options:c,hooks:i}},Q=class{constructor(e){this.options=e}shouldAttemptRetry(e,t){return this.options.shouldRetry?Promise.resolve(e<this.options.attempts&&this.options.shouldRetry(t)):Promise.resolve(e<this.options.attempts)}getDelay(){return this.options.delay}},xe=class{constructor(e){this.options=e}shouldAttemptRetry(e,t){return this.options.shouldRetry?Promise.resolve(e<this.options.attempts&&this.options.shouldRetry(t)):Promise.resolve(e<this.options.attempts)}getDelay(e){return Math.min(this.options.maxDelay,this.options.baseDelay*2**e)}};function Ue(e){if(typeof e=="number")return new Q({type:"linear",attempts:e,delay:1e3});switch(e.type){case"linear":return new Q(e);case"exponential":return new xe(e);default:throw new Error("Invalid retry strategy")}}var Ae=e=>{let t={},r=n=>typeof n=="function"?n():n;if(e?.auth){if(e.auth.type==="Bearer"){let n=r(e.auth.token);if(!n)return t;t.authorization=`Bearer ${n}`}else if(e.auth.type==="Basic"){let n=r(e.auth.username),s=r(e.auth.password);if(!n||!s)return t;t.authorization=`Basic ${btoa(`${n}:${s}`)}`}else if(e.auth.type==="Custom"){let n=r(e.auth.value);if(!n)return t;t.authorization=`${r(e.auth.prefix)} ${n}`}}return t},K=["get","post","put","patch","delete"];var Le=e=>({id:"apply-schema",name:"Apply Schema",version:"1.0.0",async init(t,r){var n,s,a,o;let u=((s=(n=e.plugins)==null?void 0:n.find(c=>{var i;return(i=c.schema)!=null&&i.config?t.startsWith(c.schema.config.baseURL||"")||t.startsWith(c.schema.config.prefix||""):!1}))==null?void 0:s.schema)||e.schema;if(u){let c=t;(a=u.config)!=null&&a.prefix&&c.startsWith(u.config.prefix)&&(c=c.replace(u.config.prefix,""),u.config.baseURL&&(t=t.replace(u.config.prefix,u.config.baseURL))),(o=u.config)!=null&&o.baseURL&&c.startsWith(u.config.baseURL)&&(c=c.replace(u.config.baseURL,""));let i=u.schema[c];if(i){let l=b(R({},r),{method:i.method,output:i.output});return r?.disableValidation||(l=b(R({},l),{body:i.input?i.input.parse(r?.body):r?.body,params:i.params?i.params.parse(r?.params):r?.params,query:i.query?i.query.parse(r?.query):r?.query})),{url:t,options:l}}}return{url:t,options:r}}}),Z=e=>{async function t(r,n){let s=b(R(R({},e),n),{plugins:[...e?.plugins||[],Le(e||{})]});if(e?.catchAllError)try{return await W(r,s)}catch(a){return{data:null,error:{status:500,statusText:"Fetch Error",message:"Fetch related error. Captured by catchAllError option. See error property for more details.",error:a}}}return await W(r,s)}return t},Ie=/^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;function Ne(e){let t=e.headers.get("content-type"),r=new Set(["image/svg","application/xml","application/xhtml","application/html"]);if(!t)return"json";let n=t.split(";").shift()||"";return Ie.test(n)?"json":r.has(n)||n.startsWith("text/")?"text":"blob"}function Ce(e){try{return JSON.parse(e),!0}catch{return!1}}function ee(e){if(e===void 0)return!1;let t=typeof e;return t==="string"||t==="number"||t==="boolean"||t===null?!0:t!=="object"?!1:Array.isArray(e)?!0:e.buffer?!1:e.constructor&&e.constructor.name==="Object"||typeof e.toJSON=="function"}function Y(e){try{return JSON.parse(e)}catch{return e}}function X(e){return typeof e=="function"}function ke(e){if(e?.customFetchImpl)return e.customFetchImpl;if(typeof globalThis<"u"&&X(globalThis.fetch))return globalThis.fetch;if(typeof window<"u"&&X(window.fetch))return window.fetch;throw new Error("No fetch implementation found")}function Be(e){let t=new Headers(e?.headers),r=Ae(e);for(let[n,s]of Object.entries(r||{}))t.set(n,s);if(!t.has("content-type")){let n=Fe(e?.body);n&&t.set("content-type",n)}return t}function Fe(e){return ee(e)?"application/json":null}function De(e){if(!e?.body)return null;let t=new Headers(e?.headers);return ee(e.body)&&!t.has("content-type")?JSON.stringify(e.body):e.body}function je(e,t){var r;if(t?.method)return t.method.toUpperCase();if(e.startsWith("@")){let n=(r=e.split("@")[1])==null?void 0:r.split("/")[0];return K.includes(n)?n.toUpperCase():t?.body?"POST":"GET"}return t?.body?"POST":"GET"}function qe(e,t){let r;return!e?.signal&&e?.timeout&&(r=setTimeout(()=>t?.abort(),e?.timeout)),{abortTimeout:r,clearTimeout:()=>{r&&clearTimeout(r)}}}function Me(e,t){let{baseURL:r,params:n,query:s}=t||{query:{},params:{},baseURL:""},a=e.startsWith("http")?e.split("/").slice(0,3).join("/"):r;if(!a)throw new TypeError(`Invalid URL ${e}. Are you passing in a relative URL but not setting the baseURL?`);if(e.startsWith("@")){let f=e.toString().split("@")[1].split("/")[0];K.includes(f)&&(e=e.replace(`@${f}/`,"/"))}a.endsWith("/")||(a+="/");let[o,u]=e.replace(a,"").split("?"),c=new URLSearchParams(u);for(let[f,p]of Object.entries(s||{}))c.set(f,String(p));if(n)if(Array.isArray(n)){let f=o.split("/").filter(p=>p.startsWith(":"));for(let[p,d]of f.entries()){let m=n[p];o=o.replace(d,m)}}else for(let[f,p]of Object.entries(n))o=o.replace(`:${f}`,String(p));o=o.split("/").map(encodeURIComponent).join("/"),o.startsWith("/")&&(o=o.slice(1));let i=c.size>0?`?${c}`.replace(/\+/g,"%20"):"";return new URL(`${o}${i}`,a)}var W=async(e,t)=>{var r,n,s,a,o,u,c,i;let{hooks:l,url:f,options:p}=await Ee(e,t),d=ke(p),m=new AbortController,_=(r=p.signal)!=null?r:m.signal,E=Me(f,p),C=De(p),A=Be(p),x=je(f,p),y=b(R({},p),{url:E,headers:A,body:C,method:x,signal:_});for(let v of l.onRequest)if(v){let g=await v(y);g instanceof Object&&(y=g)}("pipeTo"in y&&typeof y.pipeTo=="function"||typeof((n=t?.body)==null?void 0:n.pipe)=="function")&&("duplex"in y||(y.duplex="half"));let{clearTimeout:j}=qe(p,m),h=await d(y.url,y);j();let $={response:h,request:y};for(let v of l.onResponse)if(v){let g=await v(b(R({},$),{response:(s=t?.hookOptions)!=null&&s.cloneResponse?h.clone():h}));g instanceof Response?h=g:g instanceof Object&&(h=g.response)}if(h.ok){if(!(y.method!=="HEAD"))return{data:"",error:null};let g=Ne(h),T={data:"",response:h,request:y};if(g==="json"||g==="text"){let P=await h.text(),he=await((a=y.jsonParser)!=null?a:Y)(P);T.data=he}else T.data=await h[g]();y?.output&&y.output&&!y.disableValidation&&(T.data=y.output.parse(T.data));for(let P of l.onSuccess)P&&await P(b(R({},T),{response:(o=t?.hookOptions)!=null&&o.cloneResponse?h.clone():h}));return t?.throw?T.data:{data:T.data,error:null}}let de=(u=t?.jsonParser)!=null?u:Y,J=await h.text(),q=Ce(J)?await de(J):{},pe={response:h,request:y,error:b(R({},q),{status:h.status,statusText:h.statusText})};for(let v of l.onError)v&&await v(b(R({},pe),{response:(c=t?.hookOptions)!=null&&c.cloneResponse?h.clone():h}));if(t?.retry){let v=Ue(t.retry),g=(i=t.retryAttempt)!=null?i:0;if(await v.shouldAttemptRetry(g,h)){for(let P of l.onRetry)P&&await P($);let T=v.getDelay(g);return await new Promise(P=>setTimeout(P,T)),await W(e,b(R({},t),{retryAttempt:g+1}))}}if(t?.throw)throw new _e(h.status,h.statusText,q);return{data:null,error:b(R({},q),{status:h.status,statusText:h.statusText})}};var k=Object.create(null),L=e=>globalThis.process?.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?k:globalThis),O=new Proxy(k,{get(e,t){return L()[t]??k[t]},has(e,t){let r=L();return t in r||t in k},set(e,t,r){let n=L(!0);return n[t]=r,!0},deleteProperty(e,t){if(!t)return!1;let r=L(!0);return delete r[t],!0},ownKeys(){let e=L(!0);return Object.keys(e)}});function We(e){return e?e!=="false":!1}var Ve=typeof process<"u"&&process.env&&process.env.NODE_ENV||"";var ut=Ve==="test"||We(O.TEST);var B=class extends Error{constructor(t,r){super(t),this.name="BetterAuthError",this.message=t,this.cause=r,this.stack=""}};function He(e){try{return new URL(e).pathname!=="/"}catch{throw new B(`Invalid base URL: ${e}. Please provide a valid base URL.`)}}function V(e,t="/api/auth"){return He(e)?e:(t=t.startsWith("/")?t:`/${t}`,`${e}${t}`)}function te(e,t){if(e)return V(e,t);let r=O.BETTER_AUTH_URL||O.NEXT_PUBLIC_BETTER_AUTH_URL||O.PUBLIC_BETTER_AUTH_URL||O.NUXT_PUBLIC_BETTER_AUTH_URL||O.NUXT_PUBLIC_AUTH_URL||(O.BASE_URL!=="/"?O.BASE_URL:void 0);if(r)return V(r,t);if(typeof window<"u"&&window.location)return V(window.location.origin,t)}var I=Symbol("clean");var S=[],w=0,F=4,$e=0,N=e=>{let t=[],r={get(){return r.lc||r.listen(()=>{})(),r.value},lc:0,listen(n){return r.lc=t.push(n),()=>{for(let a=w+F;a<S.length;)S[a]===n?S.splice(a,F):a+=F;let s=t.indexOf(n);~s&&(t.splice(s,1),--r.lc||r.off())}},notify(n,s){$e++;let a=!S.length;for(let o of t)S.push(o,r.value,n,s);if(a){for(w=0;w<S.length;w+=F)S[w](S[w+1],S[w+2],S[w+3]);S.length=0}},off(){},set(n){let s=r.value;s!==n&&(r.value=n,r.notify(s))},subscribe(n){let s=r.listen(n);return n(r.value),s},value:e};return process.env.NODE_ENV!=="production"&&(r[I]=()=>{t=[],r.lc=0,r.off()}),r};var Je=5,U=6,D=10,Ge=(e,t,r,n)=>(e.events=e.events||{},e.events[r+D]||(e.events[r+D]=n(s=>{e.events[r].reduceRight((a,o)=>(o(a),a),{shared:{},...s})})),e.events[r]=e.events[r]||[],e.events[r].push(t),()=>{let s=e.events[r],a=s.indexOf(t);s.splice(a,1),s.length||(delete e.events[r],e.events[r+D](),delete e.events[r+D])});var re=1e3,H=(e,t)=>Ge(e,n=>{let s=t(n);s&&e.events[U].push(s)},Je,n=>{let s=e.listen;e.listen=(...o)=>(!e.lc&&!e.active&&(e.active=!0,n()),s(...o));let a=e.off;if(e.events[U]=[],e.off=()=>{a(),setTimeout(()=>{if(e.active&&!e.lc){e.active=!1;for(let o of e.events[U])o();e.events[U]=[]}},re)},process.env.NODE_ENV!=="production"){let o=e[I];e[I]=()=>{for(let u of e.events[U])u();e.events[U]=[],e.active=!1,o()}}return()=>{e.listen=s,e.off=a}});var ne={id:"redirect",name:"Redirect",hooks:{onSuccess(e){if(e.data?.url&&e.data?.redirect&&typeof window<"u"&&window.location&&window.location)try{window.location.href=e.data.url}catch{}}}},se={id:"add-current-url",name:"Add current URL",hooks:{onRequest(e){if(typeof window<"u"&&window.location&&window.location)try{let t=new URL(e.url);t.searchParams.set("currentURL",window.location.href),e.url=t}catch{}return e}}};var oe=(e,t,r,n)=>{let s=N({data:null,error:null,isPending:!0,isRefetching:!1}),a=()=>{let u=typeof n=="function"?n({data:s.get().data,error:s.get().error,isPending:s.get().isPending}):n;return r(t,{...u,async onSuccess(c){typeof window<"u"&&s.set({data:c.data,error:null,isPending:!1,isRefetching:!1}),await u?.onSuccess?.(c)},async onError(c){s.set({error:c.error,data:null,isPending:!1,isRefetching:!1}),await u?.onError?.(c)},async onRequest(c){let i=s.get();s.set({isPending:i.data===null,data:i.data,error:null,isRefetching:!0}),await u?.onRequest?.(c)}})};e=Array.isArray(e)?e:[e];let o=!1;for(let u of e)u.subscribe(()=>{o?a():H(s,()=>(a(),o=!0,()=>{s.off(),u.off()}))});return s};function ie(e){let t=N(!1);return{session:oe(t,"/get-session",e,{method:"GET"}),$sessionSignal:t}}var ze={proto:/"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,constructor:/"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,protoShort:/"__proto__"\s*:/,constructorShort:/"constructor"\s*:/},Qe=/^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/,ae={true:!0,false:!1,null:null,undefined:void 0,nan:Number.NaN,infinity:Number.POSITIVE_INFINITY,"-infinity":Number.NEGATIVE_INFINITY},Ye=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;function Xe(e){return e instanceof Date&&!isNaN(e.getTime())}function Ke(e){let t=Ye.exec(e);if(!t)return null;let[,r,n,s,a,o,u,c,i,l,f]=t,p=new Date(Date.UTC(parseInt(r,10),parseInt(n,10)-1,parseInt(s,10),parseInt(a,10),parseInt(o,10),parseInt(u,10),c?parseInt(c.padEnd(3,"0"),10):0));if(i){let d=(parseInt(l,10)*60+parseInt(f,10))*(i==="+"?-1:1);p.setUTCMinutes(p.getUTCMinutes()+d)}return Xe(p)?p:null}function Ze(e,t={}){let{strict:r=!1,warnings:n=!1,reviver:s,parseDates:a=!0}=t;if(typeof e!="string")return e;let o=e.trim();if(o[0]==='"'&&o.endsWith('"')&&!o.slice(1,-1).includes('"'))return o.slice(1,-1);let u=o.toLowerCase();if(u.length<=9&&u in ae)return ae[u];if(!Qe.test(o)){if(r)throw new SyntaxError("[better-json] Invalid JSON");return e}if(Object.entries(ze).some(([i,l])=>{let f=l.test(o);return f&&n&&console.warn(`[better-json] Detected potential prototype pollution attempt using ${i} pattern`),f})&&r)throw new Error("[better-json] Potential prototype pollution attempt detected");try{return JSON.parse(o,(l,f)=>{if(l==="__proto__"||l==="constructor"&&f&&typeof f=="object"&&"prototype"in f){n&&console.warn(`[better-json] Dropping "${l}" key to prevent prototype pollution`);return}if(a&&typeof f=="string"){let p=Ke(f);if(p)return p}return s?s(l,f):f})}catch(i){if(r)throw i;return e}}function le(e,t={strict:!0}){return Ze(e,t)}var ue=e=>{let t="credentials"in Request.prototype,r=te(e?.baseURL),n=e?.plugins?.flatMap(d=>d.fetchPlugins).filter(d=>d!==void 0)||[],s=Z({baseURL:r,...t?{credentials:"include"}:{},method:"GET",jsonParser(d){return le(d,{strict:!1})},customFetchImpl:async(d,m)=>{try{return await fetch(d,m)}catch{return Response.error()}},...e?.fetchOptions,plugins:e?.disableDefaultFetchPlugins?[...e?.fetchOptions?.plugins||[],...n]:[ne,se,...e?.fetchOptions?.plugins||[],...n]}),{$sessionSignal:a,session:o}=ie(s),u=e?.plugins||[],c={},i={$sessionSignal:a,session:o},l={"/sign-out":"POST","/revoke-sessions":"POST","/revoke-other-sessions":"POST","/delete-user":"POST"},f=[{signal:"$sessionSignal",matcher(d){return d==="/sign-out"||d==="/update-user"||d.startsWith("/sign-in")||d.startsWith("/sign-up")}}];for(let d of u)d.getAtoms&&Object.assign(i,d.getAtoms?.(s)),d.pathMethods&&Object.assign(l,d.pathMethods),d.atomListeners&&f.push(...d.atomListeners);let p={notify:d=>{i[d].set(!i[d].get())},listen:(d,m)=>{i[d].subscribe(m)},atoms:i};for(let d of u)d.getActions&&Object.assign(c,d.getActions?.(s,p));return{pluginsActions:c,pluginsAtoms:i,pluginPathMethods:l,atomListeners:f,$fetch:s,$store:p}};function ce(e){return e.charAt(0).toUpperCase()+e.slice(1)}function et(e,t,r){let n=t[e],{fetchOptions:s,query:a,...o}=r||{};return n||(s?.method?s.method:o&&Object.keys(o).length>0?"POST":"GET")}function fe(e,t,r,n,s){function a(o=[]){return new Proxy(function(){},{get(u,c){let i=[...o,c],l=e;for(let f of i)if(l&&typeof l=="object"&&f in l)l=l[f];else{l=void 0;break}return typeof l=="function"?l:a(i)},apply:async(u,c,i)=>{let l="/"+o.map(A=>A.replace(/[A-Z]/g,x=>`-${x.toLowerCase()}`)).join("/"),f=i[0]||{},p=i[1]||{},{query:d,fetchOptions:m,..._}=f,E={...p,...m},C=et(l,r,f);return await t(l,{...E,body:C==="GET"?void 0:{..._,...E?.body||{}},query:d||E?.query,method:C,async onSuccess(A){await E?.onSuccess?.(A);let x=s?.find(h=>h.matcher(l));if(!x)return;let y=n[x.signal];if(!y)return;let j=y.get();setTimeout(()=>{y.set(!j)},10)}})}})}return a()}function tt(e){return`use${ce(e)}`}function Yt(e){let{pluginPathMethods:t,pluginsActions:r,pluginsAtoms:n,$fetch:s,$store:a,atomListeners:o}=ue(e),u={};for(let[f,p]of Object.entries(n))u[tt(f)]=()=>M(p);function c(f){if(f){let p=M(n.$sessionSignal),d=e?.fetchOptions?.baseURL||e?.baseURL,m=d?new URL(d).pathname:"/api/auth";return m=m==="/"?"/api/auth":m,m=m.endsWith("/")?m.slice(0,-1):m,f(`${m}/get-session`,{ref:p}).then(_=>({data:_.data,isPending:!1,error:_.error}))}return u.useSession()}let i={...r,...u,useSession:c,$fetch:s,$store:a};return fe(i,s,t,n,o)}export{Yt as createAuthClient};