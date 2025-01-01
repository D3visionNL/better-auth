var q=(e,a="ms")=>new Date(Date.now()+(a==="sec"?e*1e3:e));import{z as h}from"zod";import{APIError as we}from"better-call";var be=h.object({id:h.string(),providerId:h.string(),accountId:h.string(),name:h.string().nullish(),userId:h.string(),accessToken:h.string().nullish(),refreshToken:h.string().nullish(),idToken:h.string().nullish(),accessTokenExpiresAt:h.date().nullish(),refreshTokenExpiresAt:h.date().nullish(),scope:h.string().nullish(),password:h.string().nullish(),image:h.string().nullish(),createdAt:h.date().default(()=>new Date),updatedAt:h.date().default(()=>new Date)}),ve=h.object({id:h.string(),email:h.string().transform(e=>e.toLowerCase()),emailVerified:h.boolean().default(!1),name:h.string(),image:h.string().nullish(),createdAt:h.date().default(()=>new Date),updatedAt:h.date().default(()=>new Date)}),Te=h.object({id:h.string(),userId:h.string(),expiresAt:h.date(),createdAt:h.date().default(()=>new Date),updatedAt:h.date().default(()=>new Date),token:h.string(),ipAddress:h.string().nullish(),userAgent:h.string().nullish()}),ke=h.object({id:h.string(),value:h.string(),createdAt:h.date().default(()=>new Date),updatedAt:h.date().default(()=>new Date),expiresAt:h.date(),identifier:h.string()});function P(e,a){let c=a.fields,l={};for(let p in e){let A=c[p];if(!A){l[p]=e[p];continue}A.returned!==!1&&(l[p]=e[p])}return l}function V(e,a){let c={...a==="user"?e.user?.additionalFields:{},...a==="session"?e.session?.additionalFields:{}};for(let l of e.plugins||[])l.schema&&l.schema[a]&&(c={...c,...l.schema[a].fields});return c}function B(e,a){let c=V(e,"user");return P(a,{fields:c})}function I(e,a){let c=V(e,"session");return P(a,{fields:c})}function M(e,a){let c=a.hooks;async function l(o,y,t){let r=o;for(let u of c||[]){let d=u[y]?.create?.before;if(d){let i=await d(o);if(i===!1)return null;typeof i=="object"&&"data"in i&&(r=i.data)}}let n=t?await t.fn(r):null,s=!t||t.executeMainFn?await e.create({model:y,data:r}):n;for(let u of c||[]){let d=u[y]?.create?.after;d&&await d(s)}return s}async function p(o,y,t,r){let n=o;for(let d of c||[]){let i=d[t]?.update?.before;if(i){let f=await i(o);if(f===!1)return null;n=typeof f=="object"?f.data:f}}let s=r?await r.fn(n):null,u=!r||r.executeMainFn?await e.update({model:t,update:n,where:y}):s;for(let d of c||[]){let i=d[t]?.update?.after;i&&await i(u)}return u}async function A(o,y,t,r){let n=o;for(let d of c||[]){let i=d[t]?.update?.before;if(i){let f=await i(o);if(f===!1)return null;n=typeof f=="object"?f.data:f}}let s=r?await r.fn(n):null,u=!r||r.executeMainFn?await e.updateMany({model:t,update:n,where:y}):s;for(let d of c||[]){let i=d[t]?.update?.after;i&&await i(u)}return u}return{createWithHooks:l,updateWithHooks:p,updateManyWithHooks:A}}var D=Object.create(null),F=e=>globalThis.process?.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?D:globalThis),_=new Proxy(D,{get(e,a){return F()[a]??D[a]},has(e,a){let c=F();return a in c||a in D},set(e,a,c){let l=F(!0);return l[a]=c,!0},deleteProperty(e,a){if(!a)return!1;let c=F(!0);return delete c[a],!0},ownKeys(){let e=F(!0);return Object.keys(e)}});function Y(e){return e?e!=="false":!1}var ee=typeof process<"u"&&process.env&&process.env.NODE_ENV||"";var C=ee==="test"||Y(_.TEST);function j(e,a){if(a.advanced?.ipAddress?.disableIpTracking)return null;let c="127.0.0.1";if(C)return c;let p=a.advanced?.ipAddress?.ipAddressHeaders||["x-client-ip","x-forwarded-for","cf-connecting-ip","fastly-client-ip","x-real-ip","x-cluster-client-ip","x-forwarded","forwarded-for","forwarded"],A=e instanceof Request?e.headers:e;for(let o of p){let y=A.get(o);if(typeof y=="string"){let t=y.split(",")[0].trim();if(t)return t}}return null}function N(e){try{return JSON.parse(e)}catch{return null}}import{createRandomStringGenerator as te}from"@better-auth/utils/random";var k=e=>te("a-z","A-Z","0-9")(e||32);import{z as Tt}from"zod";import{APIError as Rt}from"better-call";var O=class extends Error{constructor(a,c){super(a),this.name="BetterAuthError",this.message=a,this.cause=c,this.stack=""}};import{createHash as at}from"@better-auth/utils/hash";import{xchacha20poly1305 as dt}from"@noble/ciphers/chacha";import{bytesToHex as lt,hexToBytes as ct,utf8ToBytes as ft}from"@noble/ciphers/utils";import{managedNonce as mt}from"@noble/ciphers/webcrypto";import{createHash as $e}from"@better-auth/utils/hash";import{SignJWT as Je}from"jose";import{scryptAsync as Qe}from"@noble/hashes/scrypt";import{getRandomValues as Ye}from"uncrypto";import{hex as tt}from"@better-auth/utils/hex";import{createRandomStringGenerator as ne}from"@better-auth/utils/random";var ie=ne("a-z","0-9","A-Z","-_");var L=["info","success","warn","error","debug"];function se(e,a){return L.indexOf(a)<=L.indexOf(e)}var b={reset:"\x1B[0m",bright:"\x1B[1m",dim:"\x1B[2m",underscore:"\x1B[4m",blink:"\x1B[5m",reverse:"\x1B[7m",hidden:"\x1B[8m",fg:{black:"\x1B[30m",red:"\x1B[31m",green:"\x1B[32m",yellow:"\x1B[33m",blue:"\x1B[34m",magenta:"\x1B[35m",cyan:"\x1B[36m",white:"\x1B[37m"},bg:{black:"\x1B[40m",red:"\x1B[41m",green:"\x1B[42m",yellow:"\x1B[43m",blue:"\x1B[44m",magenta:"\x1B[45m",cyan:"\x1B[46m",white:"\x1B[47m"}},ae={info:b.fg.blue,success:b.fg.green,warn:b.fg.yellow,error:b.fg.red,debug:b.fg.magenta},oe=(e,a)=>{let c=new Date().toISOString();return`${b.dim}${c}${b.reset} ${ae[e]}${e.toUpperCase()}${b.reset} ${b.bright}[Better Auth]:${b.reset} ${a}`},E=e=>{let a=e?.disabled!==!0,c=e?.level??"error",l=(p,A,o=[])=>{if(!a||!se(c,p))return;let y=oe(p,A);if(!e||typeof e.log!="function"){p==="error"?console.error(y,...o):p==="warn"?console.warn(y,...o):console.log(y,...o);return}e.log(p==="success"?"info":p,y,...o)};return Object.fromEntries(L.map(p=>[p,(...[A,...o])=>l(p,A,o)]))},H=E();var $t=(e,a)=>{let c=a.options,l=c.secondaryStorage,p=c.session?.expiresIn||60*60*24*7,{createWithHooks:A,updateWithHooks:o,updateManyWithHooks:y}=M(e,a);return{createOAuthUser:async(t,r)=>{let n=await A({createdAt:new Date,updatedAt:new Date,...t},"user"),s=await A({...r,userId:n.id||t.id,createdAt:new Date,updatedAt:new Date},"account");return{user:n,account:s}},createUser:async t=>await A({createdAt:new Date,updatedAt:new Date,emailVerified:!1,...t,email:t.email.toLowerCase()},"user"),createAccount:async t=>await A({createdAt:new Date,updatedAt:new Date,...t},"account"),listSessions:async t=>{if(l){let n=await l.get(`active-sessions-${t}`);if(!n)return[];let s=N(n)||[],u=Date.now(),d=s.filter(f=>f.expiresAt>u),i=[];for(let f of d){let g=await l.get(f.token);if(g){let m=JSON.parse(g),w=I(a.options,{...m.session,expiresAt:new Date(m.session.expiresAt)});i.push(w)}}return i}return await e.findMany({model:"session",where:[{field:"userId",value:t}]})},listUsers:async(t,r,n,s)=>await e.findMany({model:"user",limit:t,offset:r,sortBy:n,where:s}),listTotalUsers:async()=>await e.count({model:"user"}),deleteUser:async t=>{await e.deleteMany({model:"session",where:[{field:"userId",value:t}]}),await e.deleteMany({model:"account",where:[{field:"userId",value:t}]}),await e.delete({model:"user",where:[{field:"id",value:t}]})},createSession:async(t,r,n,s)=>{let u=r instanceof Request?r.headers:r,{id:d,...i}=s||{},f={ipAddress:r&&j(r,a.options)||"",userAgent:u?.get("user-agent")||"",...i,expiresAt:n?q(60*60*24,"sec"):q(p,"sec"),userId:t,token:k(32),createdAt:new Date,updatedAt:new Date};return await A(f,"session",l?{fn:async m=>{let w=await l.get(`active-sessions-${t}`),x=[],T=Date.now();return w&&(x=N(w)||[],x=x.filter(X=>X.expiresAt>T)),x.push({token:f.token,expiresAt:T+p*1e3}),await l.set(`active-sessions-${t}`,JSON.stringify(x),p),m},executeMainFn:c.session?.storeSessionInDatabase}:void 0)},findSession:async t=>{if(l){let d=await l.get(t);if(d){let i=JSON.parse(d),f=I(a.options,{...i.session,expiresAt:new Date(i.session.expiresAt),createdAt:new Date(i.session.createdAt),updatedAt:new Date(i.session.updatedAt)}),g=B(a.options,{...i.user,createdAt:new Date(i.user.createdAt),updatedAt:new Date(i.user.updatedAt)});return{session:f,user:g}}}let r=await e.findOne({model:"session",where:[{value:t,field:"token"}]});if(!r)return null;let n=await e.findOne({model:"user",where:[{value:r.userId,field:"id"}]});if(!n)return null;let s=I(a.options,r),u=B(a.options,n);return l&&await l?.set(t,JSON.stringify({session:s,user:u}),s.expiresAt?Math.floor(((s.expiresAt instanceof Date?s.expiresAt.getTime():new Date(s.expiresAt).getTime())-Date.now())/1e3):p),{session:s,user:u}},findSessions:async t=>{if(l){let u=[];for(let d of t){let i=await l.get(d);if(i){let f=JSON.parse(i),g={session:{...f.session,expiresAt:new Date(f.session.expiresAt)},user:{...f.user,createdAt:new Date(f.user.createdAt),updatedAt:new Date(f.user.updatedAt)}};u.push(g)}}return u}let r=await e.findMany({model:"session",where:[{field:"token",value:t,operator:"in"}]}),n=r.map(u=>u.userId);if(!n.length)return[];let s=await e.findMany({model:"user",where:[{field:"id",value:n,operator:"in"}]});return r.map(u=>{let d=s.find(i=>i.id===u.userId);return d?{session:u,user:d}:null})},updateSession:async(t,r)=>await o(r,[{field:"token",value:t}],"session",l?{async fn(s){let u=await l.get(t),d=null;return u?(d={...JSON.parse(u).session,...s},d):null},executeMainFn:c.session?.storeSessionInDatabase}:void 0),deleteSession:async t=>{if(l){await l.delete(t),c.session?.storeSessionInDatabase&&await e.delete({model:"session",where:[{field:"token",value:t}]});return}await e.delete({model:"session",where:[{field:"token",value:t}]})},deleteAccounts:async t=>{await e.deleteMany({model:"account",where:[{field:"userId",value:t}]})},deleteAccount:async(t,r)=>{await e.delete({model:"account",where:[{field:"providerId",value:t},{field:"userId",value:r}]})},deleteSessions:async t=>{if(l){if(typeof t=="string"){let r=await l.get(`active-sessions-${t}`),n=r?N(r):[];if(!n)return;for(let s of n)await l.delete(s.token)}else for(let r of t)await l.get(r)&&await l.delete(r);c.session?.storeSessionInDatabase&&await e.deleteMany({model:"session",where:[{field:Array.isArray(t)?"token":"userId",value:t,operator:Array.isArray(t)?"in":void 0}]});return}await e.deleteMany({model:"session",where:[{field:Array.isArray(t)?"token":"userId",value:t,operator:Array.isArray(t)?"in":void 0}]})},findOAuthUser:async(t,r,n)=>{let s=null;if(s=await e.findOne({model:"user",where:[{value:t.toLowerCase(),field:"email"}]}),!s){let d=await e.findOne({model:"account",where:[{value:r,field:"accountId"},{value:n,field:"providerId"}]});return d?(s=await e.findOne({model:"user",where:[{value:d.userId,field:"id"}]}),{user:s,accounts:[d]}):null}let u=await e.findMany({model:"account",where:[{value:s.id,field:"userId"}]});return{user:s,accounts:u||[]}},findUserByEmail:async(t,r)=>{let n=await e.findOne({model:"user",where:[{value:t.toLowerCase(),field:"email"}]});if(!n)return null;if(r?.includeAccounts){let s=await e.findMany({model:"account",where:[{value:n.id,field:"userId"}]});return{user:n,accounts:s}}return{user:n,accounts:[]}},findUserById:async t=>await e.findOne({model:"user",where:[{field:"id",value:t}]}),linkAccount:async t=>await A({...t,createdAt:new Date,updatedAt:new Date},"account"),updateUser:async(t,r)=>await o(r,[{field:"id",value:t}],"user"),updateUserByEmail:async(t,r)=>await o(r,[{field:"email",value:t}],"user"),updatePassword:async(t,r)=>{await y({password:r},[{field:"userId",value:t},{field:"providerId",value:"credential"}],"account")},findAccounts:async t=>await e.findMany({model:"account",where:[{field:"userId",value:t}]}),findAccount:async t=>await e.findOne({model:"account",where:[{field:"accountId",value:t}]}),findAccountByUserId:async t=>await e.findMany({model:"account",where:[{field:"userId",value:t}]}),updateAccount:async(t,r)=>await o(r,[{field:"id",value:t}],"account"),createVerificationValue:async t=>await A({createdAt:new Date,updatedAt:new Date,...t},"verification"),findVerificationValue:async t=>(await e.findMany({model:"verification",where:[{field:"identifier",value:t}],sortBy:{field:"createdAt",direction:"desc"},limit:1}))[0],deleteVerificationValue:async t=>{await e.delete({model:"verification",where:[{field:"id",value:t}]})},deleteVerificationByIdentifier:async t=>{await e.delete({model:"verification",where:[{field:"identifier",value:t}]})},updateVerificationValue:async(t,r)=>await o(r,[{field:"id",value:t}],"verification")}};var Wt=(e,a)=>({type:e,...a});var v=e=>{let a=e.plugins?.reduce((t,r)=>{let n=r.schema;if(!n)return t;for(let[s,u]of Object.entries(n))t[s]={fields:{...t[s]?.fields,...u.fields},modelName:u.modelName||s};return t},{}),c=e.rateLimit?.storage==="database",l={rateLimit:{modelName:e.rateLimit?.modelName||"rateLimit",fields:{key:{type:"string",fieldName:e.rateLimit?.fields?.key||"key"},count:{type:"number",fieldName:e.rateLimit?.fields?.count||"count"},lastRequest:{type:"number",fieldName:e.rateLimit?.fields?.lastRequest||"lastRequest"}}}},{user:p,session:A,account:o,...y}=a||{};return{user:{modelName:e.user?.modelName||"user",fields:{name:{type:"string",required:!0,fieldName:e.user?.fields?.name||"name"},email:{type:"string",unique:!0,required:!0,fieldName:e.user?.fields?.email||"email"},emailVerified:{type:"boolean",defaultValue:()=>!1,required:!0,fieldName:e.user?.fields?.emailVerified||"emailVerified"},image:{type:"string",required:!1,fieldName:e.user?.fields?.image||"image"},createdAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.updatedAt||"updatedAt"},...p?.fields,...e.user?.additionalFields},order:1},session:{modelName:e.session?.modelName||"session",fields:{expiresAt:{type:"date",required:!0,fieldName:e.session?.fields?.expiresAt||"expiresAt"},token:{type:"string",required:!0,fieldName:e.session?.fields?.token||"token",unique:!0},createdAt:{type:"date",required:!0,fieldName:e.session?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.session?.fields?.updatedAt||"updatedAt"},ipAddress:{type:"string",required:!1,fieldName:e.session?.fields?.ipAddress||"ipAddress"},userAgent:{type:"string",required:!1,fieldName:e.session?.fields?.userAgent||"userAgent"},userId:{type:"string",fieldName:e.session?.fields?.userId||"userId",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0},...A?.fields,...e.session?.additionalFields},order:2},account:{modelName:e.account?.modelName||"account",fields:{accountId:{type:"string",required:!0,fieldName:e.account?.fields?.accountId||"accountId"},providerId:{type:"string",required:!0,fieldName:e.account?.fields?.providerId||"providerId"},userId:{type:"string",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0,fieldName:e.account?.fields?.userId||"userId"},accessToken:{type:"string",required:!1,fieldName:e.account?.fields?.accessToken||"accessToken"},refreshToken:{type:"string",required:!1,fieldName:e.account?.fields?.refreshToken||"refreshToken"},idToken:{type:"string",required:!1,fieldName:e.account?.fields?.idToken||"idToken"},accessTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"accessTokenExpiresAt"},refreshTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"refreshTokenExpiresAt"},scope:{type:"string",required:!1,fieldName:e.account?.fields?.scope||"scope"},password:{type:"string",required:!1,fieldName:e.account?.fields?.password||"password"},createdAt:{type:"date",required:!0,fieldName:e.account?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.account?.fields?.updatedAt||"updatedAt"},...o?.fields},order:3},verification:{modelName:e.verification?.modelName||"verification",fields:{identifier:{type:"string",required:!0,fieldName:e.verification?.fields?.identifier||"identifier"},value:{type:"string",required:!0,fieldName:e.verification?.fields?.value||"value"},expiresAt:{type:"date",required:!0,fieldName:e.verification?.fields?.expiresAt||"expiresAt"},createdAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.updatedAt||"updatedAt"}},order:4},...y,...c?l:{}}};import{z as R}from"zod";function Zt(e){return R.object({...Object.keys(e).reduce((c,l)=>{let p=e[l];if(!p)return c;if(p.type==="string[]"||p.type==="number[]")return{...c,[l]:R.array(p.type==="string[]"?R.string():R.number())};if(Array.isArray(p.type))return{...c,[l]:R.any()};let A=R[p.type]();return p?.required===!1&&(A=A.optional()),p?.returned===!1?c:{...c,[l]:A}},{})})}import{Kysely as $,MssqlDialect as de}from"kysely";import{MysqlDialect as K,PostgresDialect as W,SqliteDialect as J}from"kysely";function z(e){if(!e)return null;if("dialect"in e)return z(e.dialect);if("createDriver"in e){if(e instanceof J)return"sqlite";if(e instanceof K)return"mysql";if(e instanceof W)return"postgres";if(e instanceof de)return"mssql"}return"aggregate"in e?"sqlite":"getConnection"in e?"mysql":"connect"in e?"postgres":null}var U=async e=>{let a=e.database;if(!a)return{kysely:null,databaseType:null};if("db"in a)return{kysely:a.db,databaseType:a.type};if("dialect"in a)return{kysely:new $({dialect:a.dialect}),databaseType:a.type};let c,l=z(a);return"createDriver"in a&&(c=a),"aggregate"in a&&(c=new J({database:a})),"getConnection"in a&&(c=new K(a)),"connect"in a&&(c=new W({pool:a})),{kysely:c?new $({dialect:c}):null,databaseType:l}};function S(e,a,c){return c==="update"?e:e==null&&a.defaultValue?typeof a.defaultValue=="function"?a.defaultValue():a.defaultValue:e}var ue=(e,a,c)=>{let l=v(a);function p(r,n){if(n==="id")return n;let s=l[r].fields[n];return s||console.log("Field not found",r,n),s.fieldName||n}function A(r,n,s){let{type:u="sqlite"}=c||{},d=l[n].fields[s];return d.type==="boolean"&&u==="sqlite"&&r!==null&&r!==void 0?r?1:0:d.type==="date"&&r&&r instanceof Date&&u==="sqlite"?r.toISOString():r}function o(r,n,s){let{type:u="sqlite"}=c||{},d=l[n].fields[s];return d.type==="boolean"&&u==="sqlite"&&r!==null?r===1:d.type==="date"&&r?new Date(r):r}function y(r){return l[r].modelName}let t=a?.advanced?.generateId===!1;return{transformInput(r,n,s){let u=t||s==="update"?{}:{id:a.advanced?.generateId?a.advanced.generateId({model:n}):r.id||k()},d=l[n].fields;for(let i in d){let f=r[i];u[d[i].fieldName||i]=S(A(f,n,i),d[i],s)}return u},transformOutput(r,n,s=[]){if(!r)return null;let u=r.id?s.length===0||s.includes("id")?{id:r.id}:{}:{},d=l[n].fields;for(let i in d){if(s.length&&!s.includes(i))continue;let f=d[i];f&&(u[i]=o(r[f.fieldName||i],n,i))}return u},convertWhereClause(r,n){if(!n)return{and:null,or:null};let s={and:[],or:[]};return n.forEach(u=>{let{field:d,value:i,operator:f="=",connector:g="AND"}=u,m=p(r,d),w=x=>f.toLowerCase()==="in"?x(m,"in",Array.isArray(i)?i:[i]):f==="contains"?x(m,"like",`%${i}%`):f==="starts_with"?x(m,"like",`${i}%`):f==="ends_with"?x(m,"like",`%${i}`):f==="eq"?x(m,"=",i):f==="ne"?x(m,"<>",i):f==="gt"?x(m,">",i):f==="gte"?x(m,">=",i):f==="lt"?x(m,"<",i):f==="lte"?x(m,"<=",i):x(m,f,i);g==="OR"?s.or.push(w):s.and.push(w)}),{and:s.and.length?s.and:null,or:s.or.length?s.or:null}},async withReturning(r,n,s,u){let d;if(c?.type!=="mysql")d=await n.returningAll().executeTakeFirst();else{await n.execute();let i=r.id?"id":u[0].field?u[0].field:"id",f=r[i]||u[0].value;d=await e.selectFrom(y(s)).selectAll().where(p(s,i),"=",f).executeTakeFirst()}return d},getModelName:y,getField:p}},G=(e,a)=>c=>{let{transformInput:l,withReturning:p,transformOutput:A,convertWhereClause:o,getModelName:y,getField:t}=ue(e,c,a);return{id:"kysely",async create(r){let{model:n,data:s,select:u}=r,d=l(s,n,"create"),i=e.insertInto(y(n)).values(d);return A(await p(d,i,n,[]),n,u)},async findOne(r){let{model:n,where:s,select:u}=r,{and:d,or:i}=o(n,s),f=e.selectFrom(y(n)).selectAll();d&&(f=f.where(m=>m.and(d.map(w=>w(m))))),i&&(f=f.where(m=>m.or(i.map(w=>w(m)))));let g=await f.executeTakeFirst();return g?A(g,n,u):null},async findMany(r){let{model:n,where:s,limit:u,offset:d,sortBy:i}=r,{and:f,or:g}=o(n,s),m=e.selectFrom(y(n));f&&(m=m.where(x=>x.and(f.map(T=>T(x))))),g&&(m=m.where(x=>x.or(g.map(T=>T(x))))),m=m.limit(u||100),d&&(m=m.offset(d)),i&&(m=m.orderBy(t(n,i.field),i.direction));let w=await m.selectAll().execute();return w?w.map(x=>A(x,n)):[]},async update(r){let{model:n,where:s,update:u}=r,{and:d,or:i}=o(n,s),f=l(u,n,"update"),g=e.updateTable(y(n)).set(f);return d&&(g=g.where(w=>w.and(d.map(x=>x(w))))),i&&(g=g.where(w=>w.or(i.map(x=>x(w))))),await A(await p(f,g,n,s),n)},async updateMany(r){let{model:n,where:s,update:u}=r,{and:d,or:i}=o(n,s),f=l(u,n,"update"),g=e.updateTable(y(n)).set(f);return d&&(g=g.where(w=>w.and(d.map(x=>x(w))))),i&&(g=g.where(w=>w.or(i.map(x=>x(w))))),(await g.execute()).length},async count(r){let{model:n,where:s}=r,{and:u,or:d}=o(n,s),i=e.selectFrom(y(n)).selectAll();return u&&(i=i.where(g=>g.and(u.map(m=>m(g))))),d&&(i=i.where(g=>g.or(d.map(m=>m(g))))),(await i.execute()).length},async delete(r){let{model:n,where:s}=r,{and:u,or:d}=o(n,s),i=e.deleteFrom(y(n));u&&(i=i.where(f=>f.and(u.map(g=>g(f))))),d&&(i=i.where(f=>f.or(d.map(g=>g(f))))),await i.execute()},async deleteMany(r){let{model:n,where:s}=r,{and:u,or:d}=o(n,s),i=e.deleteFrom(y(n));return u&&(i=i.where(f=>f.and(u.map(g=>g(f))))),d&&(i=i.where(f=>f.or(d.map(g=>g(f))))),(await i.execute()).length},options:a}};var le=e=>{let a=v(e);function c(l,p){return p==="id"?p:a[l].fields[p].fieldName||p}return{transformInput(l,p,A){let o=A==="update"?{}:{id:e.advanced?.generateId?e.advanced.generateId({model:p}):l.id||k()},y=a[p].fields;for(let t in y){let r=l[t];r===void 0&&!y[t].defaultValue||(o[y[t].fieldName||t]=S(r,y[t],A))}return o},transformOutput(l,p,A=[]){if(!l)return null;let o=l.id||l._id?A.length===0||A.includes("id")?{id:l.id}:{}:{},y=a[p].fields;for(let t in y){if(A.length&&!A.includes(t))continue;let r=y[t];r&&(o[t]=l[r.fieldName||t])}return o},convertWhereClause(l,p,A){return p.filter(o=>l.every(y=>{let{field:t,value:r,operator:n}=y,s=c(A,t);if(n==="in"){if(!Array.isArray(r))throw new Error("Value must be an array");return r.includes(o[s])}else return n==="contains"?o[s].includes(r):n==="starts_with"?o[s].startsWith(r):n==="ends_with"?o[s].endsWith(r):o[s]===r}))},getField:c}},Z=e=>a=>{let{transformInput:c,transformOutput:l,convertWhereClause:p,getField:A}=le(a);return{id:"memory",create:async({model:o,data:y})=>{let t=c(y,o,"create");return e[o].push(t),l(t,o)},findOne:async({model:o,where:y,select:t})=>{let r=e[o],s=p(y,r,o)[0]||null;return l(s,o,t)},findMany:async({model:o,where:y,sortBy:t,limit:r,offset:n})=>{let s=e[o];return y&&(s=p(y,s,o)),t&&(s=s.sort((u,d)=>{let i=A(o,t.field);return t.direction==="asc"?u[i]>d[i]?1:-1:u[i]<d[i]?1:-1})),n!==void 0&&(s=s.slice(n)),r!==void 0&&(s=s.slice(0,r)),s.map(u=>l(u,o))},update:async({model:o,where:y,update:t})=>{let r=e[o],n=p(y,r,o);return n.forEach(s=>{Object.assign(s,c(t,o,"update"))}),l(n[0],o)},count:async({model:o})=>e[o].length,delete:async({model:o,where:y})=>{let t=e[o],r=p(y,t,o);e[o]=t.filter(n=>!r.includes(n))},deleteMany:async({model:o,where:y})=>{let t=e[o],r=p(y,t,o),n=0;return e[o]=t.filter(s=>r.includes(s)?(n++,!1):!r.includes(s)),n},updateMany(o){let{model:y,where:t,update:r}=o,n=e[y],s=p(t,n,y);return s.forEach(u=>{Object.assign(u,r)}),s[0]||null}}};async function vr(e){if(!e.database){let l=v(e),p=Object.keys(l).reduce((A,o)=>(A[o]=[],A),{});return H.warn("No database configuration provided. Using memory adapter in development"),Z(p)(e)}if(typeof e.database=="function")return e.database(e);let{kysely:a,databaseType:c}=await U(e);if(!a)throw new O("Failed to initialize database adapter");return G(a,{type:c||"sqlite"})(e)}function Tr(e,a){let c=a.id?{id:a.id}:{};for(let l in e){let p=e[l],A=a[l];A!==void 0&&(c[p.fieldName||l]=A)}return c}function kr(e,a){if(!a)return null;let c={id:a.id};for(let[l,p]of Object.entries(e))c[l]=a[p.fieldName||l];return c}function Q(e){let a=v(e),c={};for(let l in a){let p=a[l],A=p.fields,o={};if(Object.entries(A).forEach(([y,t])=>{if(o[t.fieldName||y]=t,t.references){let r=a[t.references.model];r&&(o[t.fieldName||y].references={model:r.modelName,field:t.references.field})}}),c[p.modelName]){c[p.modelName].fields={...c[p.modelName].fields,...o};continue}c[p.modelName]={fields:o,order:p.order||1/0}}return c}var ce={string:["character varying","text"],number:["int4","integer","bigint","smallint","numeric","real","double precision"],boolean:["bool","boolean"],date:["timestamp","date"]},fe={string:["varchar","text"],number:["integer","int","bigint","smallint","decimal","float","double"],boolean:["boolean","tinyint"],date:["timestamp","datetime","date"]},pe={string:["TEXT"],number:["INTEGER","REAL"],boolean:["INTEGER","BOOLEAN"],date:["DATE","INTEGER"]},me={string:["nvarchar","varchar"],number:["int","bigint","smallint","decimal","float","double"],boolean:["bit","boolean"],date:["datetime","date"]},ye={postgres:ce,mysql:fe,sqlite:pe,mssql:me};function ge(e,a,c){if(a==="string[]"||a==="number[]")return e.toLowerCase().includes("json");let l=ye[c];return(Array.isArray(a)?l.string.map(o=>o.toLowerCase()):l[a].map(o=>o.toLowerCase())).includes(e.toLowerCase())}async function Ur(e){let a=Q(e),c=E(e.logger),{kysely:l,databaseType:p}=await U(e);p||(c.warn("Could not determine database type, defaulting to sqlite. Please provide a type in the database options to avoid this."),p="sqlite"),l||(c.error("Only kysely adapter is supported for migrations. You can use `generate` command to generate the schema, if you're using a different adapter."),process.exit(1));let A=await l.introspection.getTables(),o=[],y=[];for(let[u,d]of Object.entries(a)){let i=A.find(g=>g.name===u);if(!i){let g=o.findIndex(x=>x.table===u),m={table:u,fields:d.fields,order:d.order||1/0},w=o.findIndex(x=>(x.order||1/0)>m.order);w===-1?g===-1?o.push(m):o[g].fields={...o[g].fields,...d.fields}:o.splice(w,0,m);continue}let f={};for(let[g,m]of Object.entries(d.fields)){let w=i.columns.find(x=>x.name===g);if(!w){f[g]=m;continue}ge(w.dataType,m.type,p)||c.warn(`Field ${g} in table ${u} has a different type in the database. Expected ${m.type} but got ${w.dataType}.`)}Object.keys(f).length>0&&y.push({table:u,fields:f,order:d.order||1/0})}let t=[];function r(u){let d=u.type,i={string:{sqlite:"text",postgres:"text",mysql:u.unique?"varchar(255)":u.references?"varchar(36)":"text",mssql:"text"},boolean:{sqlite:"integer",postgres:"boolean",mysql:"boolean",mssql:"boolean"},number:{sqlite:"integer",postgres:"integer",mysql:"integer",mssql:"integer"},date:{sqlite:"date",postgres:"timestamp",mysql:"datetime",mssql:"datetime"}};return p==="sqlite"&&(d==="string[]"||d==="number[]")?"text":d==="string[]"||d==="number[]"?"jsonb":Array.isArray(d)?"text":i[d][p||"sqlite"]}if(y.length)for(let u of y)for(let[d,i]of Object.entries(u.fields)){let f=r(i),g=l.schema.alterTable(u.table).addColumn(d,f,m=>(m=i.required!==!1?m.notNull():m,i.references&&(m=m.references(`${i.references.model}.${i.references.field}`)),i.unique&&(m=m.unique()),m));t.push(g)}if(o.length)for(let u of o){let d=l.schema.createTable(u.table).addColumn("id",p==="mysql"?"varchar(36)":"text",i=>i.primaryKey().notNull());for(let[i,f]of Object.entries(u.fields)){let g=r(f);d=d.addColumn(i,g,m=>(m=f.required!==!1?m.notNull():m,f.references&&(m=m.references(`${f.references.model}.${f.references.field}`)),f.unique&&(m=m.unique()),m))}t.push(d)}async function n(){for(let u of t)await u.execute()}async function s(){return t.map(d=>d.compile().sql).join(`;

`)}return{toBeCreated:o,toBeAdded:y,runMigrations:n,compileMigrations:s}}export{kr as convertFromDB,Tr as convertToDB,Wt as createFieldAttribute,$t as createInternalAdapter,vr as getAdapter,v as getAuthTables,Ur as getMigrations,Q as getSchema,M as getWithHooks,ge as matchType,Zt as toZodSchema};
