"use strict";var I=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var C=Object.getOwnPropertyNames;var j=Object.prototype.hasOwnProperty;var H=(e,t)=>{for(var c in t)I(e,c,{get:t[c],enumerable:!0})},$=(e,t,c,y)=>{if(t&&typeof t=="object"||typeof t=="function")for(let m of C(t))!j.call(e,m)&&m!==c&&I(e,m,{get:()=>t[m],enumerable:!(y=_(t,m))||y.enumerable});return e};var K=e=>$(I({},"__esModule",{value:!0}),e);var ye={};H(ye,{createKyselyAdapter:()=>N,kyselyAdapter:()=>M});module.exports=K(ye);var T=require("kysely"),b=require("kysely");function B(e){if(!e)return null;if("dialect"in e)return B(e.dialect);if("createDriver"in e){if(e instanceof b.SqliteDialect)return"sqlite";if(e instanceof b.MysqlDialect)return"mysql";if(e instanceof b.PostgresDialect)return"postgres";if(e instanceof T.MssqlDialect)return"mssql"}return"aggregate"in e?"sqlite":"getConnection"in e?"mysql":"connect"in e?"postgres":null}var N=async e=>{let t=e.database;if(!t)return{kysely:null,databaseType:null};if("db"in t)return{kysely:t.db,databaseType:t.type};if("dialect"in t)return{kysely:new T.Kysely({dialect:t.dialect}),databaseType:t.type};let c,y=B(t);return"createDriver"in t&&(c=t),"aggregate"in t&&(c=new b.SqliteDialect({database:t})),"getConnection"in t&&(c=new b.MysqlDialect(t)),"connect"in t&&(c=new b.PostgresDialect({pool:t})),{kysely:c?new T.Kysely({dialect:c}):null,databaseType:y}};var d=require("zod"),W=require("better-call"),xe=d.z.object({id:d.z.string(),providerId:d.z.string(),accountId:d.z.string(),userId:d.z.string(),accessToken:d.z.string().nullish(),refreshToken:d.z.string().nullish(),idToken:d.z.string().nullish(),accessTokenExpiresAt:d.z.date().nullish(),refreshTokenExpiresAt:d.z.date().nullish(),scope:d.z.string().nullish(),password:d.z.string().nullish(),createdAt:d.z.date().default(()=>new Date),updatedAt:d.z.date().default(()=>new Date)}),we=d.z.object({id:d.z.string(),email:d.z.string().transform(e=>e.toLowerCase()),emailVerified:d.z.boolean().default(!1),name:d.z.string(),image:d.z.string().nullish(),createdAt:d.z.date().default(()=>new Date),updatedAt:d.z.date().default(()=>new Date)}),be=d.z.object({id:d.z.string(),userId:d.z.string(),expiresAt:d.z.date(),createdAt:d.z.date().default(()=>new Date),updatedAt:d.z.date().default(()=>new Date),token:d.z.string(),ipAddress:d.z.string().nullish(),userAgent:d.z.string().nullish()}),ve=d.z.object({id:d.z.string(),value:d.z.string(),createdAt:d.z.date().default(()=>new Date),updatedAt:d.z.date().default(()=>new Date),expiresAt:d.z.date(),identifier:d.z.string()});var F=Object.create(null),k=e=>globalThis.process?.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?F:globalThis),L=new Proxy(F,{get(e,t){return k()[t]??F[t]},has(e,t){let c=k();return t in c||t in F},set(e,t,c){let y=k(!0);return y[t]=c,!0},deleteProperty(e,t){if(!t)return!1;let c=k(!0);return delete c[t],!0},ownKeys(){let e=k(!0);return Object.keys(e)}});function J(e){return e?e!=="false":!1}var z=typeof process<"u"&&process.env&&process.env.NODE_ENV||"";var G=z==="test"||J(L.TEST);var E=require("@better-auth/utils/random"),O=e=>(0,E.createRandomStringGenerator)("a-z","A-Z","0-9")(e||32);var oe=require("zod"),de=require("better-call");var ie=require("@better-auth/utils/hash"),se=require("@noble/ciphers/chacha"),U=require("@noble/ciphers/utils"),ae=require("@noble/ciphers/webcrypto");var X=require("@better-auth/utils/hash");var Y=require("jose");var ee=require("@noble/hashes/scrypt"),te=require("uncrypto"),re=require("@better-auth/utils/hex");var P=require("@better-auth/utils/random"),ne=(0,P.createRandomStringGenerator)("a-z","0-9","A-Z","-_");var S=["info","success","warn","error","debug"];function ue(e,t){return S.indexOf(t)<=S.indexOf(e)}var w={reset:"\x1B[0m",bright:"\x1B[1m",dim:"\x1B[2m",underscore:"\x1B[4m",blink:"\x1B[5m",reverse:"\x1B[7m",hidden:"\x1B[8m",fg:{black:"\x1B[30m",red:"\x1B[31m",green:"\x1B[32m",yellow:"\x1B[33m",blue:"\x1B[34m",magenta:"\x1B[35m",cyan:"\x1B[36m",white:"\x1B[37m"},bg:{black:"\x1B[40m",red:"\x1B[41m",green:"\x1B[42m",yellow:"\x1B[43m",blue:"\x1B[44m",magenta:"\x1B[45m",cyan:"\x1B[46m",white:"\x1B[47m"}},ce={info:w.fg.blue,success:w.fg.green,warn:w.fg.yellow,error:w.fg.red,debug:w.fg.magenta},le=(e,t)=>{let c=new Date().toISOString();return`${w.dim}${c}${w.reset} ${ce[e]}${e.toUpperCase()}${w.reset} ${w.bright}[Better Auth]:${w.reset} ${t}`},V=e=>{let t=e?.disabled!==!0,c=e?.level??"error",y=(m,x,A=[])=>{if(!t||!ue(c,m))return;let h=le(m,x);if(!e||typeof e.log!="function"){m==="error"?console.error(h,...A):m==="warn"?console.warn(h,...A):console.log(h,...A);return}e.log(m==="success"?"info":m,h,...A)};return Object.fromEntries(S.map(m=>[m,(...[x,...A])=>y(m,x,A)]))},fe=V();var R=e=>{let t=e.plugins?.reduce((v,i)=>{let r=i.schema;if(!r)return v;for(let[a,u]of Object.entries(r))v[a]={fields:{...v[a]?.fields,...u.fields},modelName:u.modelName||a};return v},{}),c=e.rateLimit?.storage==="database",y={rateLimit:{modelName:e.rateLimit?.modelName||"rateLimit",fields:{key:{type:"string",fieldName:e.rateLimit?.fields?.key||"key"},count:{type:"number",fieldName:e.rateLimit?.fields?.count||"count"},lastRequest:{type:"number",fieldName:e.rateLimit?.fields?.lastRequest||"lastRequest"}}}},{user:m,session:x,account:A,...h}=t||{};return{user:{modelName:e.user?.modelName||"user",fields:{name:{type:"string",required:!0,fieldName:e.user?.fields?.name||"name"},email:{type:"string",unique:!0,required:!0,fieldName:e.user?.fields?.email||"email"},emailVerified:{type:"boolean",defaultValue:()=>!1,required:!0,fieldName:e.user?.fields?.emailVerified||"emailVerified"},image:{type:"string",required:!1,fieldName:e.user?.fields?.image||"image"},createdAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.updatedAt||"updatedAt"},...m?.fields,...e.user?.additionalFields},order:1},session:{modelName:e.session?.modelName||"session",fields:{expiresAt:{type:"date",required:!0,fieldName:e.session?.fields?.expiresAt||"expiresAt"},token:{type:"string",required:!0,fieldName:e.session?.fields?.token||"token",unique:!0},createdAt:{type:"date",required:!0,fieldName:e.session?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.session?.fields?.updatedAt||"updatedAt"},ipAddress:{type:"string",required:!1,fieldName:e.session?.fields?.ipAddress||"ipAddress"},userAgent:{type:"string",required:!1,fieldName:e.session?.fields?.userAgent||"userAgent"},userId:{type:"string",fieldName:e.session?.fields?.userId||"userId",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0},...x?.fields,...e.session?.additionalFields},order:2},account:{modelName:e.account?.modelName||"account",fields:{accountId:{type:"string",required:!0,fieldName:e.account?.fields?.accountId||"accountId"},providerId:{type:"string",required:!0,fieldName:e.account?.fields?.providerId||"providerId"},userId:{type:"string",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0,fieldName:e.account?.fields?.userId||"userId"},accessToken:{type:"string",required:!1,fieldName:e.account?.fields?.accessToken||"accessToken"},refreshToken:{type:"string",required:!1,fieldName:e.account?.fields?.refreshToken||"refreshToken"},idToken:{type:"string",required:!1,fieldName:e.account?.fields?.idToken||"idToken"},accessTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"accessTokenExpiresAt"},refreshTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"refreshTokenExpiresAt"},scope:{type:"string",required:!1,fieldName:e.account?.fields?.scope||"scope"},password:{type:"string",required:!1,fieldName:e.account?.fields?.password||"password"},createdAt:{type:"date",required:!0,fieldName:e.account?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.account?.fields?.updatedAt||"updatedAt"},...A?.fields},order:3},verification:{modelName:e.verification?.modelName||"verification",fields:{identifier:{type:"string",required:!0,fieldName:e.verification?.fields?.identifier||"identifier"},value:{type:"string",required:!0,fieldName:e.verification?.fields?.value||"value"},expiresAt:{type:"date",required:!0,fieldName:e.verification?.fields?.expiresAt||"expiresAt"},createdAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.updatedAt||"updatedAt"}},order:4},...h,...c?y:{}}};var pe=require("zod");function q(e,t,c){return c==="update"?e:e==null&&t.defaultValue?typeof t.defaultValue=="function"?t.defaultValue():t.defaultValue:e}var me=(e,t,c)=>{let y=R(t);function m(i,r){if(r==="id")return r;let a=y[i].fields[r];return a||console.log("Field not found",i,r),a.fieldName||r}function x(i,r,a){let{type:u="sqlite"}=c||{},o=y[r].fields[a];return o.type==="boolean"&&u==="sqlite"&&i!==null&&i!==void 0?i?1:0:o.type==="date"&&i&&i instanceof Date&&u==="sqlite"?i.toISOString():i}function A(i,r,a){let{type:u="sqlite"}=c||{},o=y[r].fields[a];return o.type==="boolean"&&u==="sqlite"&&i!==null?i===1:o.type==="date"&&i?new Date(i):i}function h(i){return y[i].modelName}let v=t?.advanced?.generateId===!1;return{transformInput(i,r,a){let u=v||a==="update"?{}:{id:t.advanced?.generateId?t.advanced.generateId({model:r}):i.id||O()},o=y[r].fields;for(let n in o){let s=i[n];u[o[n].fieldName||n]=q(x(s,r,n),o[n],a)}return u},transformOutput(i,r,a=[]){if(!i)return null;let u=i.id?a.length===0||a.includes("id")?{id:i.id}:{}:{},o=y[r].fields;for(let n in o){if(a.length&&!a.includes(n))continue;let s=o[n];s&&(u[n]=A(i[s.fieldName||n],r,n))}return u},convertWhereClause(i,r){if(!r)return{and:null,or:null};let a={and:[],or:[]};return r.forEach(u=>{let{field:o,value:n,operator:s="=",connector:f="AND"}=u,l=m(i,o),g=p=>s.toLowerCase()==="in"?p(l,"in",Array.isArray(n)?n:[n]):s==="contains"?p(l,"like",`%${n}%`):s==="starts_with"?p(l,"like",`${n}%`):s==="ends_with"?p(l,"like",`%${n}`):s==="eq"?p(l,"=",n):s==="ne"?p(l,"<>",n):s==="gt"?p(l,">",n):s==="gte"?p(l,">=",n):s==="lt"?p(l,"<",n):s==="lte"?p(l,"<=",n):p(l,s,n);f==="OR"?a.or.push(g):a.and.push(g)}),{and:a.and.length?a.and:null,or:a.or.length?a.or:null}},async withReturning(i,r,a,u){let o;if(c?.type!=="mysql")o=await r.returningAll().executeTakeFirst();else{await r.execute();let n=i.id?"id":u[0].field?u[0].field:"id",s=i[n]||u[0].value;o=await e.selectFrom(h(a)).selectAll().where(m(a,n),"=",s).executeTakeFirst()}return o},getModelName:h,getField:m}},M=(e,t)=>c=>{let{transformInput:y,withReturning:m,transformOutput:x,convertWhereClause:A,getModelName:h,getField:v}=me(e,c,t);return{id:"kysely",async create(i){let{model:r,data:a,select:u}=i,o=y(a,r,"create"),n=e.insertInto(h(r)).values(o);return x(await m(o,n,r,[]),r,u)},async findOne(i){let{model:r,where:a,select:u}=i,{and:o,or:n}=A(r,a),s=e.selectFrom(h(r)).selectAll();o&&(s=s.where(l=>l.and(o.map(g=>g(l))))),n&&(s=s.where(l=>l.or(n.map(g=>g(l)))));let f=await s.executeTakeFirst();return f?x(f,r,u):null},async findMany(i){let{model:r,where:a,limit:u,offset:o,sortBy:n}=i,{and:s,or:f}=A(r,a),l=e.selectFrom(h(r));s&&(l=l.where(p=>p.and(s.map(D=>D(p))))),f&&(l=l.where(p=>p.or(f.map(D=>D(p))))),l=l.limit(u||100),o&&(l=l.offset(o)),n&&(l=l.orderBy(v(r,n.field),n.direction));let g=await l.selectAll().execute();return g?g.map(p=>x(p,r)):[]},async update(i){let{model:r,where:a,update:u}=i,{and:o,or:n}=A(r,a),s=y(u,r,"update"),f=e.updateTable(h(r)).set(s);return o&&(f=f.where(g=>g.and(o.map(p=>p(g))))),n&&(f=f.where(g=>g.or(n.map(p=>p(g))))),await x(await m(s,f,r,a),r)},async updateMany(i){let{model:r,where:a,update:u}=i,{and:o,or:n}=A(r,a),s=y(u,r,"update"),f=e.updateTable(h(r)).set(s);return o&&(f=f.where(g=>g.and(o.map(p=>p(g))))),n&&(f=f.where(g=>g.or(n.map(p=>p(g))))),(await f.execute()).length},async delete(i){let{model:r,where:a}=i,{and:u,or:o}=A(r,a),n=e.deleteFrom(h(r));u&&(n=n.where(s=>s.and(u.map(f=>f(s))))),o&&(n=n.where(s=>s.or(o.map(f=>f(s))))),await n.execute()},async deleteMany(i){let{model:r,where:a}=i,{and:u,or:o}=A(r,a),n=e.deleteFrom(h(r));return u&&(n=n.where(s=>s.and(u.map(f=>f(s))))),o&&(n=n.where(s=>s.or(o.map(f=>f(s))))),(await n.execute()).length},options:t}};0&&(module.exports={createKyselyAdapter,kyselyAdapter});
