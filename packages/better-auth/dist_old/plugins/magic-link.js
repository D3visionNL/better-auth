import{z as a}from"zod";import{createEndpointCreator as A,createMiddleware as g,createMiddlewareCreator as w}from"better-call";var h=g(async()=>({})),I=w({use:[h,g(async()=>({}))]}),l=A({use:[h]});import{APIError as R}from"better-call";var d=class extends Error{constructor(e,o){super(e),this.name="BetterAuthError",this.message=e,this.cause=o,this.stack=""}};var y=(t,e="ms")=>new Date(Date.now()+(e==="sec"?t*1e3:t));var m=Object.create(null),c=t=>globalThis.process?.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(t?m:globalThis),S=new Proxy(m,{get(t,e){return c()[e]??m[e]},has(t,e){let o=c();return e in o||e in m},set(t,e,o){let n=c(!0);return n[e]=o,!0},deleteProperty(t,e){if(!e)return!1;let o=c(!0);return delete o[e],!0},ownKeys(){let t=c(!0);return Object.keys(t)}});function E(t){return t?t!=="false":!1}var O=typeof process<"u"&&process.env&&process.env.NODE_ENV||"";var $=O==="test"||E(S.TEST);import{base64Url as _}from"@better-auth/utils/base64";import{createHMAC as x}from"@better-auth/utils/hmac";async function D(t,e){if(t.context.options.session?.cookieCache?.enabled){let n=_.encode(JSON.stringify({session:e,expiresAt:y(t.context.authCookies.sessionData.options.maxAge||60,"sec").getTime(),signature:await x("SHA-256","base64urlnopad").sign(t.context.secret,JSON.stringify(e))}),{padding:!1});if(n.length>4093)throw new d("Session data is too large to store in the cookie. Please disable session cookie caching or reduce the size of the session data");t.setCookie(t.context.authCookies.sessionData.name,n,t.context.authCookies.sessionData.options)}}async function k(t,e,o,n){let r=t.context.authCookies.sessionToken.options,s=o?void 0:t.context.sessionConfig.expiresIn;await t.setSignedCookie(t.context.authCookies.sessionToken.name,e.session.token,t.context.secret,{...r,maxAge:s,...n}),o&&await t.setSignedCookie(t.context.authCookies.dontRememberToken.name,"true",t.context.secret,t.context.authCookies.dontRememberToken.options),await D(t,e),t.context.setNewSession(e),t.context.options.secondaryStorage&&await t.context.secondaryStorage?.set(e.session.token,JSON.stringify({user:e.user,session:e.session}),Math.floor((new Date(e.session.expiresAt).getTime()-Date.now())/1e3))}import{createHash as ke}from"@better-auth/utils/hash";import{xchacha20poly1305 as Te}from"@noble/ciphers/chacha";import{bytesToHex as we,hexToBytes as Se,utf8ToBytes as Ee}from"@noble/ciphers/utils";import{managedNonce as _e}from"@noble/ciphers/webcrypto";import{createHash as oe}from"@better-auth/utils/hash";import{SignJWT as se}from"jose";import{scryptAsync as de}from"@noble/hashes/scrypt";import{getRandomValues as ue}from"uncrypto";import{hex as le}from"@better-auth/utils/hex";import{createRandomStringGenerator as M}from"@better-auth/utils/random";var b=M("a-z","0-9","A-Z","-_");var T={USER_NOT_FOUND:"User not found",FAILED_TO_CREATE_USER:"Failed to create user",FAILED_TO_CREATE_SESSION:"Failed to create session",FAILED_TO_UPDATE_USER:"Failed to update user",FAILED_TO_GET_SESSION:"Failed to get session",INVALID_PASSWORD:"Invalid password",INVALID_EMAIL:"Invalid email",INVALID_EMAIL_OR_PASSWORD:"Invalid email or password",SOCIAL_ACCOUNT_ALREADY_LINKED:"Social account already linked",PROVIDER_NOT_FOUND:"Provider not found",INVALID_TOKEN:"invalid token",ID_TOKEN_NOT_SUPPORTED:"id_token not supported",FAILED_TO_GET_USER_INFO:"Failed to get user info",USER_EMAIL_NOT_FOUND:"User email not found",EMAIL_NOT_VERIFIED:"Email not verified",PASSWORD_TOO_SHORT:"Password too short",PASSWORD_TOO_LONG:"Password too long",USER_ALREADY_EXISTS:"User already exists",EMAIL_CAN_NOT_BE_UPDATED:"Email can not be updated",CREDENTIAL_ACCOUNT_NOT_FOUND:"Credential account not found",SESSION_EXPIRED:"Session expired. Re-authenticate to perform this action."};var Be=t=>({id:"magic-link",endpoints:{signInMagicLink:l("/sign-in/magic-link",{method:"POST",requireHeaders:!0,body:a.object({email:a.string({description:"Email address to send the magic link"}).email(),callbackURL:a.string({description:"URL to redirect after magic link verification"}).optional()}),metadata:{openapi:{description:"Sign in with magic link",responses:{200:{description:"Success",content:{"application/json":{schema:{type:"object",properties:{status:{type:"boolean"}}}}}}}}}},async e=>{let{email:o}=e.body;if(t.disableSignUp&&!await e.context.internalAdapter.findUserByEmail(o))throw new R("BAD_REQUEST",{message:T.USER_NOT_FOUND});let n=b(32,"a-z","A-Z");await e.context.internalAdapter.createVerificationValue({identifier:n,value:o,expiresAt:new Date(Date.now()+(t.expiresIn||60*5)*1e3)});let r=`${e.context.baseURL}/magic-link/verify?token=${n}&callbackURL=${e.body.callbackURL||"/"}`;return await t.sendMagicLink({email:o,url:r,token:n},e.request),e.json({status:!0})}),magicLinkVerify:l("/magic-link/verify",{method:"GET",query:a.object({token:a.string({description:"Verification token"}),callbackURL:a.string({description:"URL to redirect after magic link verification, if not provided will return session"}).optional()}),requireHeaders:!0,metadata:{openapi:{description:"Verify magic link",responses:{200:{description:"Success",content:{"application/json":{schema:{type:"object",properties:{session:{$ref:"#/components/schemas/Session"},user:{$ref:"#/components/schemas/User"}}}}}}}}}},async e=>{let{token:o,callbackURL:n}=e.query,r=n?.startsWith("http")?n:n?`${e.context.options.baseURL}${n}`:e.context.options.baseURL,s=await e.context.internalAdapter.findVerificationValue(o);if(!s)throw e.redirect(`${r}?error=INVALID_TOKEN`);if(s.expiresAt<new Date)throw await e.context.internalAdapter.deleteVerificationValue(s.id),e.redirect(`${r}?error=EXPIRED_TOKEN`);await e.context.internalAdapter.deleteVerificationValue(s.id);let u=s.value,i=await e.context.internalAdapter.findUserByEmail(u).then(f=>f?.user);if(!i){if(t.disableSignUp)throw e.redirect(`${r}?error=failed_to_create_user`);if(i=await e.context.internalAdapter.createUser({email:u,emailVerified:!0,name:u}),!i)throw e.redirect(`${r}?error=failed_to_create_user`)}i.emailVerified||await e.context.internalAdapter.updateUser(i.id,{emailVerified:!0});let p=await e.context.internalAdapter.createSession(i.id,e.headers);if(!p)throw e.redirect(`${r}?error=failed_to_create_session`);if(await k(e,{session:p,user:i}),!n)return e.json({token:p.token});throw e.redirect(n)})},rateLimit:[{pathMatcher(e){return e.startsWith("/sign-in/magic-link")||e.startsWith("/magic-link/verify")},window:t.rateLimit?.window||60,max:t.rateLimit?.max||5}]});export{Be as magicLink};
