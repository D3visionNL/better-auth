import { P as ProviderOptions, a as OAuth2Tokens } from './index-D0tmmb_V.cjs';
export { O as OAuthProvider } from './index-D0tmmb_V.cjs';
import * as jose from 'jose';
export { g as generateState, p as parseState } from './state-BFXV2aCw.cjs';
import './helper-Bi8FQwDD.cjs';
import 'zod';
import './auth-xST9BYWZ.cjs';
import 'kysely';
import 'better-call';
import 'better-sqlite3';

declare function createAuthorizationURL({ id, options, authorizationEndpoint, state, codeVerifier, scopes, claims, redirectURI, duration, prompt, }: {
    id: string;
    options: ProviderOptions;
    redirectURI: string;
    authorizationEndpoint: string;
    state: string;
    codeVerifier?: string;
    scopes: string[];
    claims?: string[];
    duration?: string;
    prompt?: boolean;
}): Promise<URL>;

declare function validateAuthorizationCode({ code, codeVerifier, redirectURI, options, tokenEndpoint, authentication, }: {
    code: string;
    redirectURI: string;
    options: ProviderOptions;
    codeVerifier?: string;
    tokenEndpoint: string;
    authentication?: "basic" | "post";
}): Promise<OAuth2Tokens>;
declare function validateToken(token: string, jwksEndpoint: string): Promise<jose.JWTVerifyResult<jose.JWTPayload>>;

declare function generateCodeChallenge(codeVerifier: string): Promise<string>;
declare function getOAuth2Tokens(data: Record<string, any>): OAuth2Tokens;

export { OAuth2Tokens, ProviderOptions, createAuthorizationURL, generateCodeChallenge, getOAuth2Tokens, validateAuthorizationCode, validateToken };
