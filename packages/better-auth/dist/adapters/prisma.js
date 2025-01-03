import{z as n}from"zod";import{APIError as W}from"better-call";var J=n.object({id:n.string(),providerId:n.string(),accountId:n.string(),name:n.string().nullish(),userId:n.string(),accessToken:n.string().nullish(),refreshToken:n.string().nullish(),idToken:n.string().nullish(),accessTokenExpiresAt:n.date().nullish(),refreshTokenExpiresAt:n.date().nullish(),scope:n.string().nullish(),password:n.string().nullish(),image:n.string().nullish(),createdAt:n.date().default(()=>new Date),updatedAt:n.date().default(()=>new Date)}),G=n.object({id:n.string(),email:n.string().transform(e=>e.toLowerCase()),emailVerified:n.boolean().default(!1),name:n.string(),image:n.string().nullish(),createdAt:n.date().default(()=>new Date),updatedAt:n.date().default(()=>new Date)}),z=n.object({id:n.string(),userId:n.string(),expiresAt:n.date(),createdAt:n.date().default(()=>new Date),updatedAt:n.date().default(()=>new Date),token:n.string(),ipAddress:n.string().nullish(),userAgent:n.string().nullish()}),Z=n.object({id:n.string(),value:n.string(),createdAt:n.date().default(()=>new Date),updatedAt:n.date().default(()=>new Date),expiresAt:n.date(),identifier:n.string()});var T=Object.create(null),b=e=>globalThis.process?.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?T:globalThis),I=new Proxy(T,{get(e,i){return b()[i]??T[i]},has(e,i){let c=b();return i in c||i in T},set(e,i,c){let u=b(!0);return u[i]=c,!0},deleteProperty(e,i){if(!i)return!1;let c=b(!0);return delete c[i],!0},ownKeys(){let e=b(!0);return Object.keys(e)}});function D(e){return e?e!=="false":!1}var N=typeof process<"u"&&process.env&&process.env.NODE_ENV||"";var q=N==="test"||D(I.TEST);import{createRandomStringGenerator as S}from"@better-auth/utils/random";var v=e=>S("a-z","A-Z","0-9")(e||32);import{z as ze}from"zod";import{APIError as Qe}from"better-call";var h=class extends Error{constructor(i,c){super(i),this.name="BetterAuthError",this.message=i,this.cause=c,this.stack=""}};import{createHash as Se}from"@better-auth/utils/hash";import{xchacha20poly1305 as Be}from"@noble/ciphers/chacha";import{bytesToHex as Pe,hexToBytes as Ee,utf8ToBytes as Me}from"@noble/ciphers/utils";import{managedNonce as Ce}from"@noble/ciphers/webcrypto";import{createHash as ge}from"@better-auth/utils/hash";import{SignJWT as we}from"jose";import{scryptAsync as Te}from"@noble/hashes/scrypt";import{getRandomValues as Re}from"uncrypto";import{hex as Oe}from"@better-auth/utils/hex";import{createRandomStringGenerator as B}from"@better-auth/utils/random";var L=B("a-z","0-9","A-Z","-_");var R=["info","success","warn","error","debug"];function P(e,i){return R.indexOf(i)<=R.indexOf(e)}var A={reset:"\x1B[0m",bright:"\x1B[1m",dim:"\x1B[2m",underscore:"\x1B[4m",blink:"\x1B[5m",reverse:"\x1B[7m",hidden:"\x1B[8m",fg:{black:"\x1B[30m",red:"\x1B[31m",green:"\x1B[32m",yellow:"\x1B[33m",blue:"\x1B[34m",magenta:"\x1B[35m",cyan:"\x1B[36m",white:"\x1B[37m"},bg:{black:"\x1B[40m",red:"\x1B[41m",green:"\x1B[42m",yellow:"\x1B[43m",blue:"\x1B[44m",magenta:"\x1B[45m",cyan:"\x1B[46m",white:"\x1B[47m"}},E={info:A.fg.blue,success:A.fg.green,warn:A.fg.yellow,error:A.fg.red,debug:A.fg.magenta},M=(e,i)=>{let c=new Date().toISOString();return`${A.dim}${c}${A.reset} ${E[e]}${e.toUpperCase()}${A.reset} ${A.bright}[Better Auth]:${A.reset} ${i}`},O=e=>{let i=e?.disabled!==!0,c=e?.level??"error",u=(l,y,f=[])=>{if(!i||!P(c,l))return;let a=M(l,y);if(!e||typeof e.log!="function"){l==="error"?console.error(a,...f):l==="warn"?console.warn(a,...f):console.log(a,...f);return}e.log(l==="success"?"info":l,a,...f)};return Object.fromEntries(R.map(l=>[l,(...[y,...f])=>u(l,y,f)]))},V=O();var x=e=>{let i=e.plugins?.reduce((s,p)=>{let d=p.schema;if(!d)return s;for(let[t,o]of Object.entries(d))s[t]={fields:{...s[t]?.fields,...o.fields},modelName:o.modelName||t};return s},{}),c=e.rateLimit?.storage==="database",u={rateLimit:{modelName:e.rateLimit?.modelName||"rateLimit",fields:{key:{type:"string",fieldName:e.rateLimit?.fields?.key||"key"},count:{type:"number",fieldName:e.rateLimit?.fields?.count||"count"},lastRequest:{type:"number",fieldName:e.rateLimit?.fields?.lastRequest||"lastRequest"}}}},{user:l,session:y,account:f,...a}=i||{};return{user:{modelName:e.user?.modelName||"user",fields:{name:{type:"string",required:!0,fieldName:e.user?.fields?.name||"name"},email:{type:"string",unique:!0,required:!0,fieldName:e.user?.fields?.email||"email"},emailVerified:{type:"boolean",defaultValue:()=>!1,required:!0,fieldName:e.user?.fields?.emailVerified||"emailVerified"},image:{type:"string",required:!1,fieldName:e.user?.fields?.image||"image"},createdAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",defaultValue:()=>new Date,required:!0,fieldName:e.user?.fields?.updatedAt||"updatedAt"},...l?.fields,...e.user?.additionalFields},order:1},session:{modelName:e.session?.modelName||"session",fields:{expiresAt:{type:"date",required:!0,fieldName:e.session?.fields?.expiresAt||"expiresAt"},token:{type:"string",required:!0,fieldName:e.session?.fields?.token||"token",unique:!0},createdAt:{type:"date",required:!0,fieldName:e.session?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.session?.fields?.updatedAt||"updatedAt"},ipAddress:{type:"string",required:!1,fieldName:e.session?.fields?.ipAddress||"ipAddress"},userAgent:{type:"string",required:!1,fieldName:e.session?.fields?.userAgent||"userAgent"},userId:{type:"string",fieldName:e.session?.fields?.userId||"userId",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0},...y?.fields,...e.session?.additionalFields},order:2},account:{modelName:e.account?.modelName||"account",fields:{accountId:{type:"string",required:!0,fieldName:e.account?.fields?.accountId||"accountId"},providerId:{type:"string",required:!0,fieldName:e.account?.fields?.providerId||"providerId"},userId:{type:"string",references:{model:e.user?.modelName||"user",field:"id",onDelete:"cascade"},required:!0,fieldName:e.account?.fields?.userId||"userId"},accessToken:{type:"string",required:!1,fieldName:e.account?.fields?.accessToken||"accessToken"},refreshToken:{type:"string",required:!1,fieldName:e.account?.fields?.refreshToken||"refreshToken"},idToken:{type:"string",required:!1,fieldName:e.account?.fields?.idToken||"idToken"},accessTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"accessTokenExpiresAt"},refreshTokenExpiresAt:{type:"date",required:!1,fieldName:e.account?.fields?.accessTokenExpiresAt||"refreshTokenExpiresAt"},scope:{type:"string",required:!1,fieldName:e.account?.fields?.scope||"scope"},password:{type:"string",required:!1,fieldName:e.account?.fields?.password||"password"},createdAt:{type:"date",required:!0,fieldName:e.account?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!0,fieldName:e.account?.fields?.updatedAt||"updatedAt"},...f?.fields},order:3},verification:{modelName:e.verification?.modelName||"verification",fields:{identifier:{type:"string",required:!0,fieldName:e.verification?.fields?.identifier||"identifier"},value:{type:"string",required:!0,fieldName:e.verification?.fields?.value||"value"},expiresAt:{type:"date",required:!0,fieldName:e.verification?.fields?.expiresAt||"expiresAt"},createdAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.createdAt||"createdAt"},updatedAt:{type:"date",required:!1,defaultValue:()=>new Date,fieldName:e.verification?.fields?.updatedAt||"updatedAt"}},order:4},...a,...c?u:{}}};import{z as It}from"zod";import{Kysely as Dt,MssqlDialect as Nt}from"kysely";import{MysqlDialect as St,PostgresDialect as Ut,SqliteDialect as Bt}from"kysely";function k(e,i,c){return c==="update"?e:e==null&&i.defaultValue?typeof i.defaultValue=="function"?i.defaultValue():i.defaultValue:e}var _=(e,i)=>{let c=x(i);function u(a,s){return s==="id"?s:c[a].fields[s].fieldName||s}function l(a){switch(a){case"starts_with":return"startsWith";case"ends_with":return"endsWith";default:return a}}function y(a){return c[a].modelName}let f=i?.advanced?.generateId===!1;return{transformInput(a,s,p){let d=f||p==="update"?{}:{id:i.advanced?.generateId?i.advanced.generateId({model:s}):a.id||v()},t=c[s].fields;for(let o in t){let r=a[o];r===void 0&&(!t[o].defaultValue||p==="update")||(d[t[o].fieldName||o]=k(r,t[o],p))}return d},transformOutput(a,s,p=[]){if(!a)return null;let d=a.id||a._id?p.length===0||p.includes("id")?{id:a.id}:{}:{},t=c[s].fields;for(let o in t){if(p.length&&!p.includes(o))continue;let r=t[o];r&&(d[o]=a[r.fieldName||o])}return d},convertWhereClause(a,s){if(!s)return{};if(s.length===1){let r=s[0];return r?{[u(a,r.field)]:r.operator==="eq"||!r.operator?r.value:{[l(r.operator)]:r.value}}:void 0}let p=s.filter(r=>r.connector==="AND"||!r.connector),d=s.filter(r=>r.connector==="OR"),t=p.map(r=>({[u(a,r.field)]:r.operator==="eq"||!r.operator?r.value:{[l(r.operator)]:r.value}})),o=d.map(r=>({[u(a,r.field)]:{[r.operator||"eq"]:r.value}}));return{...t.length?{AND:t}:{},...o.length?{OR:o}:{}}},convertSelect:(a,s)=>{if(!(!a||!s))return a.reduce((p,d)=>({...p,[u(s,d)]:!0}),{})},getModelName:y,getField:u}},Ir=(e,i)=>c=>{let u=e,{transformInput:l,transformOutput:y,convertWhereClause:f,convertSelect:a,getModelName:s,getField:p}=_(i,c);return{id:"prisma",async create(d){let{model:t,data:o,select:r}=d,m=l(o,t,"create");if(!u[s(t)])throw new h(`Model ${t} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);let g=await u[s(t)].create({data:m,select:a(r,t)});return y(g,t,r)},async findOne(d){let{model:t,where:o,select:r}=d,m=f(t,o);if(!u[s(t)])throw new h(`Model ${t} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);let g=await u[s(t)].findFirst({where:m,select:a(r,t)});return y(g,t,r)},async count(d){let{model:t,where:o}=d,r=f(t,o);if(!u[s(t)])throw new h(`Model ${t} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);return(await u[s(t)].findMany({where:r,select:{id:!0}})).length},async findMany(d){let{model:t,where:o,limit:r,offset:m,sortBy:g}=d,w=f(t,o);if(!u[s(t)])throw new h(`Model ${t} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);return(await u[s(t)].findMany({where:w,take:r||100,skip:m||0,...g?.field?{orderBy:{[p(t,g.field)]:g.direction==="desc"?"desc":"asc"}}:{}})).map(F=>y(F,t))},async update(d){let{model:t,where:o,update:r}=d;if(!u[s(t)])throw new h(`Model ${t} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`);let m=f(t,o),g=l(r,t,"update"),w=await u[s(t)].update({where:m,data:g});return y(w,t)},async updateMany(d){let{model:t,where:o,update:r}=d,m=f(t,o),g=l(r,t,"update"),w=await u[s(t)].updateMany({where:m,data:g});return w?w.count:0},async delete(d){let{model:t,where:o}=d,r=f(t,o);try{await u[s(t)].delete({where:r})}catch{}},async deleteMany(d){let{model:t,where:o}=d,r=f(t,o),m=await u[s(t)].deleteMany({where:r});return m?m.count:0},options:i}};export{Ir as prismaAdapter};