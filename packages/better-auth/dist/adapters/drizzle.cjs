"use strict";var O=Object.defineProperty;var V=Object.getOwnPropertyDescriptor;var _=Object.getOwnPropertyNames;var C=Object.prototype.hasOwnProperty;var $=(e,r)=>{for(var u in r)O(e,u,{get:r[u],enumerable:!0})},j=(e,r,u,p)=>{if(r&&typeof r=="object"||typeof r=="function")for(let c of _(r))!C.call(e,c)&&c!==u&&O(e,c,{get:()=>r[c],enumerable:!(p=V(r,c))||p.enumerable});return e};var H=e=>j(O({},"__esModule",{value:!0}),e);var ge={};$(ge,{drizzleAdapter:()=>ye});module.exports=H(ge);var y=require("drizzle-orm");var i=require("zod"),K=require("better-call"),xe=i.z.object({id:i.z.string(),providerId:i.z.string(),accountId:i.z.string(),name:i.z.string().nullish(),userId:i.z.string(),accessToken:i.z.string().nullish(),refreshToken:i.z.string().nullish(),idToken:i.z.string().nullish(),accessTokenExpiresAt:i.z.date().nullish(),refreshTokenExpiresAt:i.z.date().nullish(),scope:i.z.string().nullish(),password:i.z.string().nullish(),image:i.z.string().nullish(),createdAt:i.z.date().default(()=>new Date),updatedAt:i.z.date().default(()=>new Date)}),be=i.z.object({id:i.z.string(),email:i.z.string().transform(e=>e.toLowerCase()),emailVerified:i.z.boolean().default(!1),name:i.z.string(),image:i.z.string().nullish(),createdAt:i.z.date().default(()=>new Date),updatedAt:i.z.date().default(()=>new Date)}),ve=i.z.object({id:i.z.string(),userId:i.z.string(),expiresAt:i.z.date(),createdAt:i.z.date().default(()=>new Date),updatedAt:i.z.date().default(()=>new Date),token:i.z.string(),ipAddress:i.z.string().nullish(),userAgent:i.z.string().nullish()}),Te=i.z.object({id:i.z.string(),value:i.z.string(),createdAt:i.z.date().default(()=>new Date),updatedAt:i.z.date().default(()=>new Date),expiresAt:i.z.date(),identifier:i.z.string()});var D=Object.create(null),k=e=>globalThis.process?.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?D:globalThis),U=new Proxy(D,{get(e,r){return k()[r]??D[r]},has(e,r){let u=k();return r in u||r in D},set(e,r,u){let p=k(!0);return p[r]=u,!0},deleteProperty(e,r){if(!r)return!1;let u=k(!0);return delete u[r],!0},ownKeys(){let e=k(!0);return Object.keys(e)}});function W(e){return e?e!=="false":!1}var z=typeof process<"u"&&process.env&&process.env.NODE_ENV||"";var J=z==="test"||W(U.TEST);var q=require("@better-auth/utils/random"),R=e=>(0,q.createRandomStringGenerator)("a-z","A-Z","0-9")(e||32);var ie=require("zod"),ae=require("better-call");var w=class extends Error{constructor(r,u){super(r),this.name="BetterAuthError",this.message=r,this.cause=u,this.stack=""}};var re=require("@better-auth/utils/hash"),ne=require("@noble/ciphers/chacha"),I=require("@noble/ciphers/utils"),se=require("@noble/ciphers/webcrypto");var Q=require("@better-auth/utils/hash");var Z=require("jose");var X=require("@noble/hashes/scrypt"),Y=require("uncrypto"),ee=require("@better-auth/utils/hex");var L=require("@better-auth/utils/random"),te=(0,L.createRandomStringGenerator)("a-z","0-9","A-Z","-_");var N=["info","success","warn","error","debug"];function oe(e,r){return N.indexOf(r)<=N.indexOf(e)}var b={reset:"\x1B[0m",bright:"\x1B[1m",dim:"\x1B[2m",underscore:"\x1B[4m",blink:"\x1B[5m",reverse:"\x1B[7m",hidden:"\x1B[8m",fg:{black:"\x1B[30m",red:"\x1B[31m",green:"\x1B[32m",yellow:"\x1B[33m",blue:"\x1B[34m",magenta:"\x1B[35m",cyan:"\x1B[36m",white:"\x1B[37m"},bg:{black:"\x1B[40m",red:"\x1B[41m",green:"\x1B[42m",yellow:"\x1B[43m",blue:"\x1B[44m",magenta:"\x1B[45m",cyan:"\x1B[46m",white:"\x1B[47m"}},de={info:b.fg.blue,success:b.fg.green,warn:b.fg.yellow,error:b.fg.red,debug:b.fg.magenta},ue=(e,r)=>{let u=new Date().toISOString();return`${b.dim}${u}${b.reset} ${de[e]}${e.toUpperCase()}${b.reset} ${b.bright}[Better Auth]:${b.reset} ${r}`},M=e=>{let r=e?.disabled!==!0,u=e?.level??"error",p=(c,g,m=[])=>{if(!r||!oe(u,c))return;let x=ue(c,g);if(!e||typeof e.log!="function"){c==="error"?console.error(x,...m):c==="warn"?console.warn(x,...m):console.log(x,...m);return}e.log(c==="success"?"info":c,x,...m)};return Object.fromEntries(N.map(c=>[c,(...[g,...m])=>p(c,g,m)]))},ce=M();var T=e=>{let r=e.plugins?.reduce((a,l)=>{let s=l.schema;if(!s)return a;for(let[t,d]of Object.entries(s))a[t]={fields:{...a[t]?.fields,...d.fields},modelName:d.modelName||t};return a},{}),u=e.rateLimit?.storage==="database",p={rateLimit:{modelName:e.rateLimit?.modelName||"rateLimit",fields:{key:{type:"string",fieldName:e.rateLimit?.fields?.key||"key"},count:{type:"number",fieldName:e.rateLimit?.fields?.count||"count"},lastRequest:{type:"number",fieldName:e.rateLimit?.fields?.lastRequest||"lastRequest"}}}},{user:c,session:g,account:m,...x}=r||{};return{user:{modelName:e.user?.modelName||"user",fields:{name:{type:"string",required:!0,fieldName:e.user?.fields?.name||"name"},email:{type:"string",unique:!0,required:!0,fieldName:e.user?.fields?.email||"email"},emailVerified:{type:"boolean",defaultValue:()=>!1,required:!0,fieldName:e.user?.fields?.emailVerified||"emailVerified"},image:{type:"string",required:!1,fieldName:e.user?.fields?.image||"image"},createdAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.updatedAt||"updatedAt"},...c?.fields,...e.user?.additionalFields},order:1},session:{modelName:e.session?.modelName||"session",fields:{expiresAt:{type:"date",required:!0,fieldName:e.session?.fields?.expiresAt||"expiresAt"},token:{type:"string",required:!0,fieldName:e.session?.fields?.token||"token",unique:!0},createdAt:{type:"date",required:!0,fieldName:e.session?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.session?.fields?.updatedAt||"updatedAt"},ipAddress:{type:"string",required:!1,fieldName:e.session?.fields?.ipAddress||"ipAddress"},userAgent:{type:"string",required:!1,fieldName:e.session?.fields?.userAgent||"userAgent"},userId:{type:"string",fieldName:e.session?.fields?.userId||"userId",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0},...g?.fields,...e.session?.additionalFields},order:2},account:{modelName:e.account?.modelName||"account",fields:{accountId:{type:"string",required:!0,fieldName:e.account?.fields?.accountId||"accountId"},providerId:{type:"string",required:!0,fieldName:e.account?.fields?.providerId||"providerId"},userId:{type:"string",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0,fieldName:e.account?.fields?.userId||"userId"},accessToken:{type:"string",required:!1,fieldName:e.account?.fields?.accessToken||"accessToken"},refreshToken:{type:"string",required:!1,fieldName:e.account?.fields?.refreshToken||"refreshToken"},idToken:{type:"string",required:!1,fieldName:e.account?.fields?.idToken||"idToken"},accessTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"accessTokenExpiresAt"},refreshTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"refreshTokenExpiresAt"},scope:{type:"string",required:!1,fieldName:e.account?.fields?.scope||"scope"},password:{type:"string",required:!1,fieldName:e.account?.fields?.password||"password"},createdAt:{type:"date",required:!0,fieldName:e.account?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.account?.fields?.updatedAt||"updatedAt"},...m?.fields},order:3},verification:{modelName:e.verification?.modelName||"verification",fields:{identifier:{type:"string",required:!0,fieldName:e.verification?.fields?.identifier||"identifier"},value:{type:"string",required:!0,fieldName:e.verification?.fields?.value||"value"},expiresAt:{type:"date",required:!0,fieldName:e.verification?.fields?.expiresAt||"expiresAt"},createdAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.updatedAt||"updatedAt"}},order:4},...x,...u?p:{}}};var le=require("zod");var E=require("kysely"),S=require("kysely");function F(e,r,u){return u==="update"?e:e==null&&r.defaultValue?typeof r.defaultValue=="function"?r.defaultValue():r.defaultValue:e}var pe=(e,r,u)=>{let p=T(u);function c(a,l){return l==="id"?l:p[a].fields[l].fieldName||l}function g(a){let l=r.schema||e._.fullSchema;if(!l)throw new w("Drizzle adapter failed to initialize. Schema not found. Please provide a schema object in the adapter options object.");let s=m(a),t=l[s];if(!t)throw new w(`[# Drizzle Adapter]: The model "${s}" was not found in the schema object. Please pass the schema directly to the adapter options.`);return t}let m=a=>p[a].modelName!==a?p[a].modelName:r.usePlural?`${a}s`:a,x=u?.advanced?.generateId===!1;return{getSchema:g,transformInput(a,l,s){let t=x||s==="update"?{}:{id:u.advanced?.generateId?u.advanced.generateId({model:l}):a.id||R()},d=p[l].fields;for(let o in d){let f=a[o];f===void 0&&!d[o].defaultValue||(t[d[o].fieldName||o]=F(f,d[o],s))}return t},transformOutput(a,l,s=[]){if(!a)return null;let t=a.id||a._id?s.length===0||s.includes("id")?{id:a.id}:{}:{},d=p[l].fields;for(let o in d){if(s.length&&!s.includes(o))continue;let f=d[o];f&&(t[o]=a[f.fieldName||o])}return t},convertWhereClause(a,l){let s=g(l);if(!a)return[];if(a.length===1){let n=a[0];if(!n)return[];let A=c(l,n.field);if(!s[A])throw new w(`The field "${n.field}" does not exist in the schema for the model "${l}". Please update your schema.`);if(n.operator==="in"){if(!Array.isArray(n.value))throw new w(`The value for the field "${n.field}" must be an array when using the "in" operator.`);return[(0,y.inArray)(s[A],n.value)]}return n.operator==="contains"?[(0,y.like)(s[A],`%${n.value}%`)]:n.operator==="starts_with"?[(0,y.like)(s[A],`${n.value}%`)]:n.operator==="ends_with"?[(0,y.like)(s[A],`%${n.value}`)]:[(0,y.eq)(s[A],n.value)]}let t=a.filter(n=>n.connector==="AND"||!n.connector),d=a.filter(n=>n.connector==="OR"),o=(0,y.and)(...t.map(n=>{let A=c(l,n.field);if(n.operator==="in"){if(!Array.isArray(n.value))throw new w(`The value for the field "${n.field}" must be an array when using the "in" operator.`);return(0,y.inArray)(s[A],n.value)}return(0,y.eq)(s[A],n.value)})),f=(0,y.or)(...d.map(n=>{let A=c(l,n.field);return(0,y.eq)(s[A],n.value)})),h=[];return t.length&&h.push(o),d.length&&h.push(f),h},withReturning:async(a,l,s)=>{if(r.provider!=="mysql")return(await l.returning())[0];await l;let t=g(m(a));return(await e.select().from(t).where((0,y.eq)(t.id,s.id)))[0]},getField:c,getModelName:m}};function me(e,r,u){if(!e)throw new w("Drizzle adapter failed to initialize. Schema not found. Please provide a schema object in the adapter options object.");for(let p in u)if(!e[p])throw new w(`The field "${p}" does not exist in the "${r}" schema. Please update your drizzle schema or re-generate using "npx @better-auth/cli generate".`)}var ye=(e,r)=>u=>{let{transformInput:p,transformOutput:c,convertWhereClause:g,getSchema:m,withReturning:x,getField:a,getModelName:l}=pe(e,r,u);return{id:"drizzle",async create(s){let{model:t,data:d}=s,o=p(d,t,"create"),f=m(t);me(f,l(t),o);let h=e.insert(f).values(o),n=await x(t,h,o);return c(n,t)},async findOne(s){let{model:t,where:d,select:o}=s,f=m(t),h=g(d,t),n=await e.select().from(f).where(...h);return n.length?c(n[0],t,o):null},async findMany(s){let{model:t,where:d,sortBy:o,limit:f,offset:h}=s,n=m(t),A=d?g(d,t):[],v=o?.direction==="desc"?y.desc:y.asc,B=e.select().from(n).limit(f||100).offset(h||0);return o?.field&&B.orderBy(v(n[a(t,o?.field)])),(await B.where(...A)).map(P=>c(P,t))},async count(s){let{model:t,where:d}=s,o=m(t),f=d?g(d,t):[];return(await e.select().from(o).where(...f)).length},async update(s){let{model:t,where:d,update:o}=s,f=m(t),h=g(d,t),n=p(o,t,"update"),A=e.update(f).set(n).where(...h),v=await x(t,A,n);return c(v,t)},async updateMany(s){let{model:t,where:d,update:o}=s,f=m(t),h=g(d,t),n=p(o,t,"update"),v=await e.update(f).set(n).where(...h);return v?v.changes:0},async delete(s){let{model:t,where:d}=s,o=m(t),f=g(d,t);await e.delete(o).where(...f)},async deleteMany(s){let{model:t,where:d}=s,o=m(t),f=g(d,t),n=await e.delete(o).where(...f);return n?n.length:0},options:r}};0&&(module.exports={drizzleAdapter});
