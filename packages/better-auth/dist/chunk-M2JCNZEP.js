import { getDate } from './chunk-FURNA6HY.js';
import { createHash } from '@better-auth/utils/hash';
import { base64Url } from '@better-auth/utils/base64';
import { betterFetch } from '@better-fetch/fetch';
import { jwtVerify } from 'jose';

async function generateCodeChallenge(codeVerifier) {
  const codeChallengeBytes = await createHash("SHA-256").digest(codeVerifier);
  return base64Url.encode(new Uint8Array(codeChallengeBytes), {
    padding: false
  });
}
function getOAuth2Tokens(data) {
  return {
    tokenType: data.token_type,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpiresAt: data.expires_in ? getDate(data.expires_in, "sec") : void 0,
    scopes: data?.scope ? typeof data.scope === "string" ? data.scope.split(" ") : data.scope : [],
    idToken: data.id_token
  };
}

// src/oauth2/create-authorization-url.ts
async function createAuthorizationURL({
  id,
  options,
  authorizationEndpoint,
  state,
  codeVerifier,
  scopes,
  claims,
  redirectURI,
  duration,
  prompt
}) {
  const url = new URL(authorizationEndpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", options.clientId);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
  if (codeVerifier) {
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("code_challenge", codeChallenge);
  }
  if (claims) {
    const claimsObj = claims.reduce(
      (acc, claim) => {
        acc[claim] = null;
        return acc;
      },
      {}
    );
    url.searchParams.set(
      "claims",
      JSON.stringify({
        id_token: { email: null, email_verified: null, ...claimsObj }
      })
    );
  }
  if (duration) {
    url.searchParams.set("duration", duration);
  }
  if (prompt) {
    url.searchParams.set("prompt", "select_account");
  }
  return url;
}
async function validateAuthorizationCode({
  code,
  codeVerifier,
  redirectURI,
  options,
  tokenEndpoint,
  authentication
}) {
  const body = new URLSearchParams();
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json",
    "user-agent": "better-auth"
  };
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  codeVerifier && body.set("code_verifier", codeVerifier);
  body.set("redirect_uri", redirectURI);
  if (authentication === "basic") {
    const encodedCredentials = btoa(
      `${options.clientId}:${options.clientSecret}`
    );
    headers["authorization"] = `Basic ${encodedCredentials}`;
  } else {
    body.set("client_id", options.clientId);
    body.set("client_secret", options.clientSecret);
  }
  const { data, error } = await betterFetch(tokenEndpoint, {
    method: "POST",
    body,
    headers
  });
  if (error) {
    throw error;
  }
  const tokens = getOAuth2Tokens(data);
  return tokens;
}
async function validateToken(token, jwksEndpoint) {
  const { data, error } = await betterFetch(jwksEndpoint, {
    method: "GET",
    headers: {
      accept: "application/json",
      "user-agent": "better-auth"
    }
  });
  if (error) {
    throw error;
  }
  const keys = data["keys"];
  const header = JSON.parse(atob(token.split(".")[0]));
  const key = keys.find((key2) => key2.kid === header.kid);
  if (!key) {
    throw new Error("Key not found");
  }
  const verified = await jwtVerify(token, key);
  return verified;
}

export { createAuthorizationURL, generateCodeChallenge, getOAuth2Tokens, validateAuthorizationCode, validateToken };
