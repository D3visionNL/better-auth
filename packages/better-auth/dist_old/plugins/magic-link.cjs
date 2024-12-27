"use strict";var f=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var D=Object.getOwnPropertyNames;var C=Object.prototype.hasOwnProperty;var M=(t,e)=>{for(var o in e)f(t,o,{get:e[o],enumerable:!0})},R=(t,e,o,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of D(e))!C.call(t,r)&&r!==o&&f(t,r,{get:()=>e[r],enumerable:!(n=x(e,r))||n.enumerable});return t};var U=t=>R(f({},"__esModule",{value:!0}),t);var G={};M(G,{magicLink:()=>W});module.exports=U(G);var c=require("zod");var a=require("better-call"),k=(0,a.createMiddleware)(async()=>({})),J=(0,a.createMiddlewareCreator)({use:[k,(0,a.createMiddleware)(async()=>({}))]}),g=(0,a.createEndpointCreator)({use:[k]});var _=require("better-call");var m=class extends Error{constructor(e,o){super(e),this.name="BetterAuthError",this.message=e,this.cause=o,this.stack=""}};var b=(t,e="ms")=>new Date(Date.now()+(e==="sec"?t*1e3:t));var u=Object.create(null),d=t=>globalThis.process?.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(t?u:globalThis),L=new Proxy(u,{get(t,e){return d()[e]??u[e]},has(t,e){let o=d();return e in o||e in u},set(t,e,o){let n=d(!0);return n[e]=o,!0},deleteProperty(t,e){if(!e)return!1;let o=d(!0);return delete o[e],!0},ownKeys(){let t=d(!0);return Object.keys(t)}});function I(t){return t?t!=="false":!1}var N=typeof process<"u"&&process.env&&process.env.NODE_ENV||"";var ee=N==="test"||I(L.TEST);var T=require("@better-auth/utils/base64");var A=require("@better-auth/utils/hmac");async function v(t,e){if(t.context.options.session?.cookieCache?.enabled){let n=T.base64Url.encode(JSON.stringify({session:e,expiresAt:b(t.context.authCookies.sessionData.options.maxAge||60,"sec").getTime(),signature:await(0,A.createHMAC)("SHA-256","base64urlnopad").sign(t.context.secret,JSON.stringify(e))}),{padding:!1});if(n.length>4093)throw new m("Session data is too large to store in the cookie. Please disable session cookie caching or reduce the size of the session data");t.setCookie(t.context.authCookies.sessionData.name,n,t.context.authCookies.sessionData.options)}}async function w(t,e,o,n){let r=t.context.authCookies.sessionToken.options,s=o?void 0:t.context.sessionConfig.expiresIn;await t.setSignedCookie(t.context.authCookies.sessionToken.name,e.session.token,t.context.secret,{...r,maxAge:s,...n}),o&&await t.setSignedCookie(t.context.authCookies.dontRememberToken.name,"true",t.context.secret,t.context.authCookies.dontRememberToken.options),await v(t,e),t.context.setNewSession(e),t.context.options.secondaryStorage&&await t.context.secondaryStorage?.set(e.session.token,JSON.stringify({user:e.user,session:e.session}),Math.floor((new Date(e.session.expiresAt).getTime()-Date.now())/1e3))}var H=require("@better-auth/utils/hash"),q=require("@noble/ciphers/chacha"),h=require("@noble/ciphers/utils"),Y=require("@noble/ciphers/webcrypto");var $=require("@better-auth/utils/hash");var j=require("jose");var B=require("@noble/hashes/scrypt"),V=require("uncrypto"),F=require("@better-auth/utils/hex");var S=require("@better-auth/utils/random"),E=(0,S.createRandomStringGenerator)("a-z","0-9","A-Z","-_");var O={USER_NOT_FOUND:"User not found",FAILED_TO_CREATE_USER:"Failed to create user",FAILED_TO_CREATE_SESSION:"Failed to create session",FAILED_TO_UPDATE_USER:"Failed to update user",FAILED_TO_GET_SESSION:"Failed to get session",INVALID_PASSWORD:"Invalid password",INVALID_EMAIL:"Invalid email",INVALID_EMAIL_OR_PASSWORD:"Invalid email or password",SOCIAL_ACCOUNT_ALREADY_LINKED:"Social account already linked",PROVIDER_NOT_FOUND:"Provider not found",INVALID_TOKEN:"invalid token",ID_TOKEN_NOT_SUPPORTED:"id_token not supported",FAILED_TO_GET_USER_INFO:"Failed to get user info",USER_EMAIL_NOT_FOUND:"User email not found",EMAIL_NOT_VERIFIED:"Email not verified",PASSWORD_TOO_SHORT:"Password too short",PASSWORD_TOO_LONG:"Password too long",USER_ALREADY_EXISTS:"User already exists",EMAIL_CAN_NOT_BE_UPDATED:"Email can not be updated",CREDENTIAL_ACCOUNT_NOT_FOUND:"Credential account not found",SESSION_EXPIRED:"Session expired. Re-authenticate to perform this action."};var W=t=>({id:"magic-link",endpoints:{signInMagicLink:g("/sign-in/magic-link",{method:"POST",requireHeaders:!0,body:c.z.object({email:c.z.string({description:"Email address to send the magic link"}).email(),callbackURL:c.z.string({description:"URL to redirect after magic link verification"}).optional()}),metadata:{openapi:{description:"Sign in with magic link",responses:{200:{description:"Success",content:{"application/json":{schema:{type:"object",properties:{status:{type:"boolean"}}}}}}}}}},async e=>{let{email:o}=e.body;if(t.disableSignUp&&!await e.context.internalAdapter.findUserByEmail(o))throw new _.APIError("BAD_REQUEST",{message:O.USER_NOT_FOUND});let n=E(32,"a-z","A-Z");await e.context.internalAdapter.createVerificationValue({identifier:n,value:o,expiresAt:new Date(Date.now()+(t.expiresIn||60*5)*1e3)});let r=`${e.context.baseURL}/magic-link/verify?token=${n}&callbackURL=${e.body.callbackURL||"/"}`;return await t.sendMagicLink({email:o,url:r,token:n},e.request),e.json({status:!0})}),magicLinkVerify:g("/magic-link/verify",{method:"GET",query:c.z.object({token:c.z.string({description:"Verification token"}),callbackURL:c.z.string({description:"URL to redirect after magic link verification, if not provided will return session"}).optional()}),requireHeaders:!0,metadata:{openapi:{description:"Verify magic link",responses:{200:{description:"Success",content:{"application/json":{schema:{type:"object",properties:{session:{$ref:"#/components/schemas/Session"},user:{$ref:"#/components/schemas/User"}}}}}}}}}},async e=>{let{token:o,callbackURL:n}=e.query,r=n?.startsWith("http")?n:n?`${e.context.options.baseURL}${n}`:e.context.options.baseURL,s=await e.context.internalAdapter.findVerificationValue(o);if(!s)throw e.redirect(`${r}?error=INVALID_TOKEN`);if(s.expiresAt<new Date)throw await e.context.internalAdapter.deleteVerificationValue(s.id),e.redirect(`${r}?error=EXPIRED_TOKEN`);await e.context.internalAdapter.deleteVerificationValue(s.id);let p=s.value,i=await e.context.internalAdapter.findUserByEmail(p).then(y=>y?.user);if(!i){if(t.disableSignUp)throw e.redirect(`${r}?error=failed_to_create_user`);if(i=await e.context.internalAdapter.createUser({email:p,emailVerified:!0,name:p}),!i)throw e.redirect(`${r}?error=failed_to_create_user`)}i.emailVerified||await e.context.internalAdapter.updateUser(i.id,{emailVerified:!0});let l=await e.context.internalAdapter.createSession(i.id,e.headers);if(!l)throw e.redirect(`${r}?error=failed_to_create_session`);if(await w(e,{session:l,user:i}),!n)return e.json({token:l.token});throw e.redirect(n)})},rateLimit:[{pathMatcher(e){return e.startsWith("/sign-in/magic-link")||e.startsWith("/magic-link/verify")},window:t.rateLimit?.window||60,max:t.rateLimit?.max||5}]});0&&(module.exports={magicLink});
