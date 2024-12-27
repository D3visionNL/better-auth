"use strict";var w=Object.defineProperty;var S=Object.getOwnPropertyDescriptor;var q=Object.getOwnPropertyNames;var B=Object.prototype.hasOwnProperty;var L=(e,r)=>{for(var c in r)w(e,c,{get:r[c],enumerable:!0})},E=(e,r,c,u)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of q(r))!B.call(e,i)&&i!==c&&w(e,i,{get:()=>r[i],enumerable:!(u=S(r,i))||u.enumerable});return e};var P=e=>E(w({},"__esModule",{value:!0}),e);var de={};L(de,{memoryAdapter:()=>U});module.exports=P(de);var n=require("zod"),V=require("better-call"),le=n.z.object({id:n.z.string(),providerId:n.z.string(),accountId:n.z.string(),userId:n.z.string(),accessToken:n.z.string().nullish(),refreshToken:n.z.string().nullish(),idToken:n.z.string().nullish(),accessTokenExpiresAt:n.z.date().nullish(),refreshTokenExpiresAt:n.z.date().nullish(),scope:n.z.string().nullish(),password:n.z.string().nullish(),createdAt:n.z.date().default(()=>new Date),updatedAt:n.z.date().default(()=>new Date)}),fe=n.z.object({id:n.z.string(),email:n.z.string().transform(e=>e.toLowerCase()),emailVerified:n.z.boolean().default(!1),name:n.z.string(),image:n.z.string().nullish(),createdAt:n.z.date().default(()=>new Date),updatedAt:n.z.date().default(()=>new Date)}),pe=n.z.object({id:n.z.string(),userId:n.z.string(),expiresAt:n.z.date(),createdAt:n.z.date().default(()=>new Date),updatedAt:n.z.date().default(()=>new Date),token:n.z.string(),ipAddress:n.z.string().nullish(),userAgent:n.z.string().nullish()}),me=n.z.object({id:n.z.string(),value:n.z.string(),createdAt:n.z.date().default(()=>new Date),updatedAt:n.z.date().default(()=>new Date),expiresAt:n.z.date(),identifier:n.z.string()});var h=Object.create(null),y=e=>globalThis.process?.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?h:globalThis),F=new Proxy(h,{get(e,r){return y()[r]??h[r]},has(e,r){let c=y();return r in c||r in h},set(e,r,c){let u=y(!0);return u[r]=c,!0},deleteProperty(e,r){if(!r)return!1;let c=y(!0);return delete c[r],!0},ownKeys(){let e=y(!0);return Object.keys(e)}});function M(e){return e?e!=="false":!1}var _=typeof process<"u"&&process.env&&process.env.NODE_ENV||"";var C=_==="test"||M(F.TEST);var O=require("@better-auth/utils/random"),x=e=>(0,O.createRandomStringGenerator)("a-z","A-Z","0-9")(e||32);var Y=require("zod"),ee=require("better-call");var Z=require("@better-auth/utils/hash"),Q=require("@noble/ciphers/chacha"),b=require("@noble/ciphers/utils"),X=require("@noble/ciphers/webcrypto");var $=require("@better-auth/utils/hash");var K=require("jose");var W=require("@noble/hashes/scrypt"),J=require("uncrypto"),z=require("@better-auth/utils/hex");var D=require("@better-auth/utils/random"),G=(0,D.createRandomStringGenerator)("a-z","0-9","A-Z","-_");var v=["info","success","warn","error","debug"];function te(e,r){return v.indexOf(r)<=v.indexOf(e)}var p={reset:"\x1B[0m",bright:"\x1B[1m",dim:"\x1B[2m",underscore:"\x1B[4m",blink:"\x1B[5m",reverse:"\x1B[7m",hidden:"\x1B[8m",fg:{black:"\x1B[30m",red:"\x1B[31m",green:"\x1B[32m",yellow:"\x1B[33m",blue:"\x1B[34m",magenta:"\x1B[35m",cyan:"\x1B[36m",white:"\x1B[37m"},bg:{black:"\x1B[40m",red:"\x1B[41m",green:"\x1B[42m",yellow:"\x1B[43m",blue:"\x1B[44m",magenta:"\x1B[45m",cyan:"\x1B[46m",white:"\x1B[47m"}},re={info:p.fg.blue,success:p.fg.green,warn:p.fg.yellow,error:p.fg.red,debug:p.fg.magenta},ne=(e,r)=>{let c=new Date().toISOString();return`${p.dim}${c}${p.reset} ${re[e]}${e.toUpperCase()}${p.reset} ${p.bright}[Better Auth]:${p.reset} ${r}`},I=e=>{let r=e?.disabled!==!0,c=e?.level??"error",u=(i,f,t=[])=>{if(!r||!te(c,i))return;let a=ne(i,f);if(!e||typeof e.log!="function"){i==="error"?console.error(a,...t):i==="warn"?console.warn(a,...t):console.log(a,...t);return}e.log(i==="success"?"info":i,a,...t)};return Object.fromEntries(v.map(i=>[i,(...[f,...t])=>u(i,f,t)]))},ie=I();var g=e=>{let r=e.plugins?.reduce((s,d)=>{let l=d.schema;if(!l)return s;for(let[o,m]of Object.entries(l))s[o]={fields:{...s[o]?.fields,...m.fields},modelName:m.modelName||o};return s},{}),c=e.rateLimit?.storage==="database",u={rateLimit:{modelName:e.rateLimit?.modelName||"rateLimit",fields:{key:{type:"string",fieldName:e.rateLimit?.fields?.key||"key"},count:{type:"number",fieldName:e.rateLimit?.fields?.count||"count"},lastRequest:{type:"number",fieldName:e.rateLimit?.fields?.lastRequest||"lastRequest"}}}},{user:i,session:f,account:t,...a}=r||{};return{user:{modelName:e.user?.modelName||"user",fields:{name:{type:"string",required:!0,fieldName:e.user?.fields?.name||"name"},email:{type:"string",unique:!0,required:!0,fieldName:e.user?.fields?.email||"email"},emailVerified:{type:"boolean",defaultValue:()=>!1,required:!0,fieldName:e.user?.fields?.emailVerified||"emailVerified"},image:{type:"string",required:!1,fieldName:e.user?.fields?.image||"image"},createdAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.updatedAt||"updatedAt"},...i?.fields,...e.user?.additionalFields},order:1},session:{modelName:e.session?.modelName||"session",fields:{expiresAt:{type:"date",required:!0,fieldName:e.session?.fields?.expiresAt||"expiresAt"},token:{type:"string",required:!0,fieldName:e.session?.fields?.token||"token",unique:!0},createdAt:{type:"date",required:!0,fieldName:e.session?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.session?.fields?.updatedAt||"updatedAt"},ipAddress:{type:"string",required:!1,fieldName:e.session?.fields?.ipAddress||"ipAddress"},userAgent:{type:"string",required:!1,fieldName:e.session?.fields?.userAgent||"userAgent"},userId:{type:"string",fieldName:e.session?.fields?.userId||"userId",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0},...f?.fields,...e.session?.additionalFields},order:2},account:{modelName:e.account?.modelName||"account",fields:{accountId:{type:"string",required:!0,fieldName:e.account?.fields?.accountId||"accountId"},providerId:{type:"string",required:!0,fieldName:e.account?.fields?.providerId||"providerId"},userId:{type:"string",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0,fieldName:e.account?.fields?.userId||"userId"},accessToken:{type:"string",required:!1,fieldName:e.account?.fields?.accessToken||"accessToken"},refreshToken:{type:"string",required:!1,fieldName:e.account?.fields?.refreshToken||"refreshToken"},idToken:{type:"string",required:!1,fieldName:e.account?.fields?.idToken||"idToken"},accessTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"accessTokenExpiresAt"},refreshTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"refreshTokenExpiresAt"},scope:{type:"string",required:!1,fieldName:e.account?.fields?.scope||"scope"},password:{type:"string",required:!1,fieldName:e.account?.fields?.password||"password"},createdAt:{type:"date",required:!0,fieldName:e.account?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.account?.fields?.updatedAt||"updatedAt"},...t?.fields},order:3},verification:{modelName:e.verification?.modelName||"verification",fields:{identifier:{type:"string",required:!0,fieldName:e.verification?.fields?.identifier||"identifier"},value:{type:"string",required:!0,fieldName:e.verification?.fields?.value||"value"},expiresAt:{type:"date",required:!0,fieldName:e.verification?.fields?.expiresAt||"expiresAt"},createdAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.updatedAt||"updatedAt"}},order:4},...a,...c?u:{}}};var se=require("zod");var N=require("kysely"),T=require("kysely");function k(e,r,c){return c==="update"?e:e==null&&r.defaultValue?typeof r.defaultValue=="function"?r.defaultValue():r.defaultValue:e}var oe=e=>{let r=g(e);function c(u,i){return i==="id"?i:r[u].fields[i].fieldName||i}return{transformInput(u,i,f){let t=f==="update"?{}:{id:e.advanced?.generateId?e.advanced.generateId({model:i}):u.id||x()},a=r[i].fields;for(let s in a){let d=u[s];d===void 0&&!a[s].defaultValue||(t[a[s].fieldName||s]=k(d,a[s],f))}return t},transformOutput(u,i,f=[]){if(!u)return null;let t=u.id||u._id?f.length===0||f.includes("id")?{id:u.id}:{}:{},a=r[i].fields;for(let s in a){if(f.length&&!f.includes(s))continue;let d=a[s];d&&(t[s]=u[d.fieldName||s])}return t},convertWhereClause(u,i,f){return i.filter(t=>u.every(a=>{let{field:s,value:d,operator:l}=a,o=c(f,s);if(l==="in"){if(!Array.isArray(d))throw new Error("Value must be an array");return d.includes(t[o])}else return l==="contains"?t[o].includes(d):l==="starts_with"?t[o].startsWith(d):l==="ends_with"?t[o].endsWith(d):t[o]===d}))},getField:c}},U=e=>r=>{let{transformInput:c,transformOutput:u,convertWhereClause:i,getField:f}=oe(r);return{id:"memory",create:async({model:t,data:a})=>{let s=c(a,t,"create");return e[t].push(s),u(s,t)},findOne:async({model:t,where:a,select:s})=>{let d=e[t],o=i(a,d,t)[0]||null;return u(o,t,s)},findMany:async({model:t,where:a,sortBy:s,limit:d,offset:l})=>{let o=e[t];return a&&(o=i(a,o,t)),s&&(o=o.sort((m,R)=>{let A=f(t,s.field);return s.direction==="asc"?m[A]>R[A]?1:-1:m[A]<R[A]?1:-1})),l!==void 0&&(o=o.slice(l)),d!==void 0&&(o=o.slice(0,d)),o.map(m=>u(m,t))},update:async({model:t,where:a,update:s})=>{let d=e[t],l=i(a,d,t);return l.forEach(o=>{Object.assign(o,c(s,t,"update"))}),u(l[0],t)},delete:async({model:t,where:a})=>{let s=e[t],d=i(a,s,t);e[t]=s.filter(l=>!d.includes(l))},deleteMany:async({model:t,where:a})=>{let s=e[t],d=i(a,s,t),l=0;return e[t]=s.filter(o=>d.includes(o)?(l++,!1):!d.includes(o)),l},updateMany(t){let{model:a,where:s,update:d}=t,l=e[a],o=i(s,l,a);return o.forEach(m=>{Object.assign(m,d)}),o[0]||null}}};0&&(module.exports={memoryAdapter});
