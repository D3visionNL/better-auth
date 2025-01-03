import{createHash as y}from"@better-auth/utils/hash";import{xchacha20poly1305 as p}from"@noble/ciphers/chacha";import{bytesToHex as w,hexToBytes as A,utf8ToBytes as l}from"@noble/ciphers/utils";import{managedNonce as g}from"@noble/ciphers/webcrypto";function i(t,r){let e=new Uint8Array(t),n=new Uint8Array(r);if(e.length!==n.length)return!1;let o=0;for(let a=0;a<e.length;a++)o|=e[a]^n[a];return o===0}import{createHash as c}from"@better-auth/utils/hash";async function H(t){let r=await c("SHA-256").digest(t);return Buffer.from(r).toString("base64")}async function b(t,r){let e=await c("SHA-256").digest(typeof t=="string"?new TextEncoder().encode(t):t),n=Buffer.from(r,"base64");return i(e,n)}import{SignJWT as u}from"jose";async function U(t,r,e=3600){return await new u(t).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime(Math.floor(Date.now()/1e3)+e).sign(new TextEncoder().encode(r))}import{scryptAsync as d}from"@noble/hashes/scrypt";import{getRandomValues as x}from"uncrypto";import{hex as m}from"@better-auth/utils/hex";var s={N:16384,r:16,p:1,dkLen:64};async function f(t,r){return await d(t.normalize("NFKC"),r,{N:s.N,p:s.p,r:s.r,dkLen:s.dkLen,maxmem:128*s.N*s.r*2})}var K=async t=>{let r=m.encode(x(new Uint8Array(16))),e=await f(t,r);return`${r}:${m.encode(e)}`},L=async({hash:t,password:r})=>{let[e,n]=t.split(":"),o=await f(r,e);return i(o,new Uint8Array(Buffer.from(n,"hex")))};import{createRandomStringGenerator as h}from"@better-auth/utils/random";var z=h("a-z","0-9","A-Z","-_");var F=async({key:t,data:r})=>{let e=await y("SHA-256").digest(t),n=l(r),o=g(p)(new Uint8Array(e));return w(o.encrypt(n))},G=async({key:t,data:r})=>{let e=await y("SHA-256").digest(t),n=A(r),o=g(p)(new Uint8Array(e));return new TextDecoder().decode(o.decrypt(n))};export{b as compareHash,i as constantTimeEqual,z as generateRandomString,K as hashPassword,H as hashToBase64,U as signJWT,G as symmetricDecrypt,F as symmetricEncrypt,L as verifyPassword};