'use strict';

const fetch = require('@better-fetch/fetch');
const betterCall = require('better-call');
const jose = require('jose');
const refreshAccessToken = require('../shared/better-auth.6XyKj7DG.cjs');
require('@better-auth/utils/hash');
const base64 = require('@better-auth/utils/base64');
const zod = require('zod');
require('@noble/ciphers/chacha');
require('@noble/ciphers/utils');
require('@noble/ciphers/webcrypto');
require('@noble/hashes/scrypt');
require('@better-auth/utils');
require('@better-auth/utils/hex');
require('@noble/hashes/utils');
require('../shared/better-auth.CYeOI8C-.cjs');
const index = require('../shared/better-auth.ANpbi45u.cjs');
const logger = require('../shared/better-auth.GpOOav9x.cjs');
require('@better-auth/utils/random');
require('../shared/better-auth.C1hdVENX.cjs');

const apple = (options) => {
  const tokenEndpoint = "https://appleid.apple.com/auth/token";
  return {
    id: "apple",
    name: "Apple",
    async createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scope = options.disableDefaultScope ? [] : ["email", "name"];
      options.scope && _scope.push(...options.scope);
      scopes && _scope.push(...scopes);
      const url = await refreshAccessToken.createAuthorizationURL({
        id: "apple",
        options,
        authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
        scopes: _scope,
        state,
        redirectURI,
        responseMode: "form_post",
        responseType: "code id_token"
      });
      return url;
    },
    validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    async verifyIdToken(token, nonce) {
      if (options.disableIdTokenSignIn) {
        return false;
      }
      if (options.verifyIdToken) {
        return options.verifyIdToken(token, nonce);
      }
      const decodedHeader = jose.decodeProtectedHeader(token);
      const { kid, alg: jwtAlg } = decodedHeader;
      if (!kid || !jwtAlg) return false;
      const publicKey = await getApplePublicKey(kid);
      const { payload: jwtClaims } = await jose.jwtVerify(token, publicKey, {
        algorithms: [jwtAlg],
        issuer: "https://appleid.apple.com",
        audience: options.appBundleIdentifier || options.clientId,
        maxTokenAge: "1h"
      });
      ["email_verified", "is_private_email"].forEach((field) => {
        if (jwtClaims[field] !== void 0) {
          jwtClaims[field] = Boolean(jwtClaims[field]);
        }
      });
      if (nonce && jwtClaims.nonce !== nonce) {
        return false;
      }
      return !!jwtClaims;
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://appleid.apple.com/auth/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      if (!token.idToken) {
        return null;
      }
      const profile = jose.decodeJwt(token.idToken);
      if (!profile) {
        return null;
      }
      const name = token.user ? `${token.user.name?.firstName} ${token.user.name?.lastName}` : profile.name || profile.email;
      const emailVerified = typeof profile.email_verified === "boolean" ? profile.email_verified : profile.email_verified === "true";
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name,
          emailVerified,
          email: profile.email,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const getApplePublicKey = async (kid) => {
  const APPLE_BASE_URL = "https://appleid.apple.com";
  const JWKS_APPLE_URI = "/auth/keys";
  const { data } = await fetch.betterFetch(`${APPLE_BASE_URL}${JWKS_APPLE_URI}`);
  if (!data?.keys) {
    throw new betterCall.APIError("BAD_REQUEST", {
      message: "Keys not found"
    });
  }
  const jwk = data.keys.find((key) => key.kid === kid);
  if (!jwk) {
    throw new Error(`JWK with kid ${kid} not found`);
  }
  return await jose.importJWK(jwk, jwk.alg);
};

const discord = (options) => {
  return {
    id: "discord",
    name: "Discord",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["identify", "email"];
      scopes && _scopes.push(...scopes);
      options.scope && _scopes.push(...options.scope);
      return new URL(
        `https://discord.com/api/oauth2/authorize?scope=${_scopes.join(
          "+"
        )}&response_type=code&client_id=${options.clientId}&redirect_uri=${encodeURIComponent(
          options.redirectURI || redirectURI
        )}&state=${state}&prompt=${options.prompt || "none"}`
      );
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI,
        options,
        tokenEndpoint: "https://discord.com/api/oauth2/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://discord.com/api/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        "https://discord.com/api/users/@me",
        {
          headers: {
            authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (error) {
        return null;
      }
      if (profile.avatar === null) {
        const defaultAvatarNumber = profile.discriminator === "0" ? Number(BigInt(profile.id) >> BigInt(22)) % 6 : parseInt(profile.discriminator) % 5;
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.global_name || profile.username || "",
          email: profile.email,
          emailVerified: profile.verified,
          image: profile.image_url,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const facebook = (options) => {
  return {
    id: "facebook",
    name: "Facebook",
    async createAuthorizationURL({ state, scopes, redirectURI, loginHint }) {
      const _scopes = options.disableDefaultScope ? [] : ["email", "public_profile"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return await refreshAccessToken.createAuthorizationURL({
        id: "facebook",
        options,
        authorizationEndpoint: "https://www.facebook.com/v21.0/dialog/oauth",
        scopes: _scopes,
        state,
        redirectURI,
        loginHint,
        additionalParams: options.configId ? {
          config_id: options.configId
        } : {}
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI,
        options,
        tokenEndpoint: "https://graph.facebook.com/oauth/access_token"
      });
    },
    async verifyIdToken(token, nonce) {
      if (options.disableIdTokenSignIn) {
        return false;
      }
      if (options.verifyIdToken) {
        return options.verifyIdToken(token, nonce);
      }
      if (token.split(".").length) {
        try {
          const { payload: jwtClaims } = await jose.jwtVerify(
            token,
            jose.createRemoteJWKSet(
              new URL("https://www.facebook.com/.well-known/oauth/openid/jwks")
            ),
            {
              algorithms: ["RS256"],
              audience: options.clientId,
              issuer: "https://www.facebook.com"
            }
          );
          if (nonce && jwtClaims.nonce !== nonce) {
            return false;
          }
          return !!jwtClaims;
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://graph.facebook.com/v18.0/oauth/access_token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      if (token.idToken) {
        const profile2 = jose.decodeJwt(token.idToken);
        const user = {
          id: profile2.sub,
          name: profile2.name,
          email: profile2.email,
          picture: {
            data: {
              url: profile2.picture,
              height: 100,
              width: 100,
              is_silhouette: false
            }
          }
        };
        const userMap2 = await options.mapProfileToUser?.({
          ...user,
          email_verified: true
        });
        return {
          user: {
            ...user,
            emailVerified: true,
            ...userMap2
          },
          data: profile2
        };
      }
      const fields = [
        "id",
        "name",
        "email",
        "picture",
        ...options?.fields || []
      ];
      const { data: profile, error } = await fetch.betterFetch(
        "https://graph.facebook.com/me?fields=" + fields.join(","),
        {
          auth: {
            type: "Bearer",
            token: token.accessToken
          }
        }
      );
      if (error) {
        return null;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
          emailVerified: profile.email_verified,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const github = (options) => {
  const tokenEndpoint = "https://github.com/login/oauth/access_token";
  return {
    id: "github",
    name: "GitHub",
    createAuthorizationURL({ state, scopes, loginHint, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["read:user", "user:email"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return refreshAccessToken.createAuthorizationURL({
        id: "github",
        options,
        authorizationEndpoint: "https://github.com/login/oauth/authorize",
        scopes: _scopes,
        state,
        redirectURI,
        loginHint
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://github.com/login/oauth/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        "https://api.github.com/user",
        {
          headers: {
            "User-Agent": "better-auth",
            authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (error) {
        return null;
      }
      const { data: emails } = await fetch.betterFetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "User-Agent": "better-auth"
        }
      });
      if (!profile.email && emails) {
        profile.email = (emails.find((e) => e.primary) ?? emails[0])?.email;
      }
      const emailVerified = emails?.find((e) => e.email === profile.email)?.verified ?? false;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const google = (options) => {
  return {
    id: "google",
    name: "Google",
    async createAuthorizationURL({
      state,
      scopes,
      codeVerifier,
      redirectURI,
      loginHint,
      display
    }) {
      if (!options.clientId || !options.clientSecret) {
        logger.logger.error(
          "Client Id and Client Secret is required for Google. Make sure to provide them in the options."
        );
        throw new index.BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
      }
      if (!codeVerifier) {
        throw new index.BetterAuthError("codeVerifier is required for Google");
      }
      const _scopes = options.disableDefaultScope ? [] : ["email", "profile", "openid"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      const url = await refreshAccessToken.createAuthorizationURL({
        id: "google",
        options,
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI,
        prompt: options.prompt,
        accessType: options.accessType,
        display: display || options.display,
        loginHint,
        hd: options.hd
      });
      return url;
    },
    validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint: "https://oauth2.googleapis.com/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token"
      });
    },
    async verifyIdToken(token, nonce) {
      if (options.disableIdTokenSignIn) {
        return false;
      }
      if (options.verifyIdToken) {
        return options.verifyIdToken(token, nonce);
      }
      const googlePublicKeyUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`;
      const { data: tokenInfo } = await fetch.betterFetch(googlePublicKeyUrl);
      if (!tokenInfo) {
        return false;
      }
      const isValid = tokenInfo.aud === options.clientId && (tokenInfo.iss === "https://accounts.google.com" || tokenInfo.iss === "accounts.google.com");
      return isValid;
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      if (!token.idToken) {
        return null;
      }
      const user = jose.decodeJwt(token.idToken);
      const userMap = await options.mapProfileToUser?.(user);
      return {
        user: {
          id: user.sub,
          name: user.name,
          email: user.email,
          image: user.picture,
          emailVerified: user.email_verified,
          ...userMap
        },
        data: user
      };
    },
    options
  };
};

const microsoft = (options) => {
  const tenant = options.tenantId || "common";
  const authorizationEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`;
  const tokenEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  return {
    id: "microsoft",
    name: "Microsoft EntraID",
    createAuthorizationURL(data) {
      const scopes = options.disableDefaultScope ? [] : ["openid", "profile", "email", "User.Read"];
      options.scope && scopes.push(...options.scope);
      data.scopes && scopes.push(...scopes);
      return refreshAccessToken.createAuthorizationURL({
        id: "microsoft",
        options,
        authorizationEndpoint,
        state: data.state,
        codeVerifier: data.codeVerifier,
        scopes,
        redirectURI: data.redirectURI,
        prompt: options.prompt
      });
    },
    validateAuthorizationCode({ code, codeVerifier, redirectURI }) {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      if (!token.idToken) {
        return null;
      }
      const user = jose.decodeJwt(token.idToken);
      const profilePhotoSize = options.profilePhotoSize || 48;
      await fetch.betterFetch(
        `https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          },
          async onResponse(context) {
            if (options.disableProfilePhoto || !context.response.ok) {
              return;
            }
            try {
              const response = context.response.clone();
              const pictureBuffer = await response.arrayBuffer();
              const pictureBase64 = base64.base64.encode(pictureBuffer);
              user.picture = `data:image/jpeg;base64, ${pictureBase64}`;
            } catch (e) {
              logger.logger.error(
                e && typeof e === "object" && "name" in e ? e.name : "",
                e
              );
            }
          }
        }
      );
      const userMap = await options.mapProfileToUser?.(user);
      return {
        user: {
          id: user.sub,
          name: user.name,
          email: user.email,
          image: user.picture,
          emailVerified: true,
          ...userMap
        },
        data: user
      };
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    options
  };
};

const spotify = (options) => {
  return {
    id: "spotify",
    name: "Spotify",
    createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["user-read-email"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return refreshAccessToken.createAuthorizationURL({
        id: "spotify",
        options,
        authorizationEndpoint: "https://accounts.spotify.com/authorize",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint: "https://accounts.spotify.com/api/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://accounts.spotify.com/api/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        "https://api.spotify.com/v1/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (error) {
        return null;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images[0]?.url,
          emailVerified: false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const twitch = (options) => {
  return {
    id: "twitch",
    name: "Twitch",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["user:read:email", "openid"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return refreshAccessToken.createAuthorizationURL({
        id: "twitch",
        redirectURI,
        options,
        authorizationEndpoint: "https://id.twitch.tv/oauth2/authorize",
        scopes: _scopes,
        state,
        claims: options.claims || [
          "email",
          "email_verified",
          "preferred_username",
          "picture"
        ]
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI,
        options,
        tokenEndpoint: "https://id.twitch.tv/oauth2/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://id.twitch.tv/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const idToken = token.idToken;
      if (!idToken) {
        logger.logger.error("No idToken found in token");
        return null;
      }
      const profile = jose.decodeJwt(idToken);
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name: profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          emailVerified: false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const twitter = (options) => {
  return {
    id: "twitter",
    name: "Twitter",
    createAuthorizationURL(data) {
      const _scopes = options.disableDefaultScope ? [] : ["users.read", "tweet.read", "offline.access", "users.email"];
      options.scope && _scopes.push(...options.scope);
      data.scopes && _scopes.push(...data.scopes);
      return refreshAccessToken.createAuthorizationURL({
        id: "twitter",
        options,
        authorizationEndpoint: "https://x.com/i/oauth2/authorize",
        scopes: _scopes,
        state: data.state,
        codeVerifier: data.codeVerifier,
        redirectURI: data.redirectURI
      });
    },
    validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        codeVerifier,
        authentication: "basic",
        redirectURI,
        options,
        tokenEndpoint: "https://api.x.com/2/oauth2/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://api.x.com/2/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error: profileError } = await fetch.betterFetch(
        "https://api.x.com/2/users/me?user.fields=profile_image_url",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (profileError) {
        return null;
      }
      const { data: emailData, error: emailError } = await fetch.betterFetch("https://api.x.com/2/users/me?user.fields=confirmed_email", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });
      if (!emailError && emailData?.data?.confirmed_email) {
        profile.data.email = emailData.data.confirmed_email;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.data.id,
          name: profile.data.name,
          email: profile.data.email || profile.data.username || null,
          image: profile.data.profile_image_url,
          emailVerified: profile.data.verified || false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const dropbox = (options) => {
  const tokenEndpoint = "https://api.dropboxapi.com/oauth2/token";
  return {
    id: "dropbox",
    name: "Dropbox",
    createAuthorizationURL: async ({
      state,
      scopes,
      codeVerifier,
      redirectURI
    }) => {
      const _scopes = options.disableDefaultScope ? [] : ["account_info.read"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return await refreshAccessToken.createAuthorizationURL({
        id: "dropbox",
        options,
        authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
        scopes: _scopes,
        state,
        redirectURI,
        codeVerifier
      });
    },
    validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
      return await refreshAccessToken.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://api.dropbox.com/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        "https://api.dropboxapi.com/2/users/get_current_account",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (error) {
        return null;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.account_id,
          name: profile.name?.display_name,
          email: profile.email,
          emailVerified: profile.email_verified || false,
          image: profile.profile_photo_url,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const linkedin = (options) => {
  const authorizationEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
  const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
  return {
    id: "linkedin",
    name: "Linkedin",
    createAuthorizationURL: async ({
      state,
      scopes,
      redirectURI,
      loginHint
    }) => {
      const _scopes = options.disableDefaultScope ? [] : ["profile", "email", "openid"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return await refreshAccessToken.createAuthorizationURL({
        id: "linkedin",
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        loginHint,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return await refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        "https://api.linkedin.com/v2/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (error) {
        return null;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified || false,
          image: profile.picture,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const cleanDoubleSlashes = (input = "") => {
  return input.split("://").map((str) => str.replace(/\/{2,}/g, "/")).join("://");
};
const issuerToEndpoints = (issuer) => {
  let baseUrl = issuer || "https://gitlab.com";
  return {
    authorizationEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/authorize`),
    tokenEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/token`),
    userinfoEndpoint: cleanDoubleSlashes(`${baseUrl}/api/v4/user`)
  };
};
const gitlab = (options) => {
  const { authorizationEndpoint, tokenEndpoint, userinfoEndpoint } = issuerToEndpoints(options.issuer);
  const issuerId = "gitlab";
  const issuerName = "Gitlab";
  return {
    id: issuerId,
    name: issuerName,
    createAuthorizationURL: async ({
      state,
      scopes,
      codeVerifier,
      loginHint,
      redirectURI
    }) => {
      const _scopes = options.disableDefaultScope ? [] : ["read_user"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return await refreshAccessToken.createAuthorizationURL({
        id: issuerId,
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        redirectURI,
        codeVerifier,
        loginHint
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI, codeVerifier }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI,
        options,
        codeVerifier,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://gitlab.com/oauth/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        userinfoEndpoint,
        { headers: { authorization: `Bearer ${token.accessToken}` } }
      );
      if (error || profile.state !== "active" || profile.locked) {
        return null;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id.toString(),
          name: profile.name ?? profile.username,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: true,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const tiktok = (options) => {
  return {
    id: "tiktok",
    name: "TikTok",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["user.info.profile"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return new URL(
        `https://www.tiktok.com/v2/auth/authorize?scope=${_scopes.join(
          ","
        )}&response_type=code&client_key=${options.clientKey}&client_secret=${options.clientSecret}&redirect_uri=${encodeURIComponent(
          options.redirectURI || redirectURI
        )}&state=${state}`
      );
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint: "https://open.tiktokapis.com/v2/oauth/token/"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://open.tiktokapis.com/v2/oauth/token/"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const fields = [
        "open_id",
        "avatar_large_url",
        "display_name",
        "username"
      ];
      const { data: profile, error } = await fetch.betterFetch(
        `https://open.tiktokapis.com/v2/user/info/?fields=${fields.join(",")}`,
        {
          headers: {
            authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (error) {
        return null;
      }
      return {
        user: {
          email: profile.data.user.email || profile.data.user.username,
          id: profile.data.user.open_id,
          name: profile.data.user.display_name || profile.data.user.username,
          image: profile.data.user.avatar_large_url,
          /** @note Tiktok does not provide emailVerified or even email*/
          emailVerified: profile.data.user.email ? true : false
        },
        data: profile
      };
    },
    options
  };
};

const reddit = (options) => {
  return {
    id: "reddit",
    name: "Reddit",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["identity"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return refreshAccessToken.createAuthorizationURL({
        id: "reddit",
        options,
        authorizationEndpoint: "https://www.reddit.com/api/v1/authorize",
        scopes: _scopes,
        state,
        redirectURI,
        duration: options.duration
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: options.redirectURI || redirectURI
      });
      const headers = {
        "content-type": "application/x-www-form-urlencoded",
        accept: "text/plain",
        "user-agent": "better-auth",
        Authorization: `Basic ${base64.base64.encode(
          `${options.clientId}:${options.clientSecret}`
        )}`
      };
      const { data, error } = await fetch.betterFetch(
        "https://www.reddit.com/api/v1/access_token",
        {
          method: "POST",
          headers,
          body: body.toString()
        }
      );
      if (error) {
        throw error;
      }
      return refreshAccessToken.getOAuth2Tokens(data);
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://www.reddit.com/api/v1/access_token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        "https://oauth.reddit.com/api/v1/me",
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "User-Agent": "better-auth"
          }
        }
      );
      if (error) {
        return null;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.oauth_client_id,
          emailVerified: profile.has_verified_email,
          image: profile.icon_img?.split("?")[0],
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const roblox = (options) => {
  return {
    id: "roblox",
    name: "Roblox",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["openid", "profile"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return new URL(
        `https://apis.roblox.com/oauth/v1/authorize?scope=${_scopes.join(
          "+"
        )}&response_type=code&client_id=${options.clientId}&redirect_uri=${encodeURIComponent(
          options.redirectURI || redirectURI
        )}&state=${state}&prompt=${options.prompt || "select_account+consent"}`
      );
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint: "https://apis.roblox.com/oauth/v1/token",
        authentication: "post"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://apis.roblox.com/oauth/v1/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        "https://apis.roblox.com/oauth/v1/userinfo",
        {
          headers: {
            authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (error) {
        return null;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name: profile.nickname || profile.preferred_username || "",
          image: profile.picture,
          email: profile.preferred_username || null,
          // Roblox does not provide email
          emailVerified: true,
          ...userMap
        },
        data: {
          ...profile
        }
      };
    },
    options
  };
};

var LANG = /* @__PURE__ */ ((LANG2) => {
  LANG2[LANG2["RUS"] = 0] = "RUS";
  LANG2[LANG2["UKR"] = 1] = "UKR";
  LANG2[LANG2["ENG"] = 3] = "ENG";
  LANG2[LANG2["SPA"] = 4] = "SPA";
  LANG2[LANG2["GERMAN"] = 6] = "GERMAN";
  LANG2[LANG2["POL"] = 15] = "POL";
  LANG2[LANG2["FRA"] = 16] = "FRA";
  LANG2[LANG2["TURKEY"] = 82] = "TURKEY";
  return LANG2;
})(LANG || {});
const vk = (options) => {
  return {
    id: "vk",
    name: "VK",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["email", "phone"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      const authorizationEndpoint = "https://id.vk.com/authorize";
      return refreshAccessToken.createAuthorizationURL({
        id: "vk",
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        redirectURI,
        codeVerifier
      });
    },
    validateAuthorizationCode: async ({
      code,
      codeVerifier,
      redirectURI,
      deviceId
    }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI: options.redirectURI || redirectURI,
        options,
        deviceId,
        tokenEndpoint: "https://id.vk.com/oauth2/auth"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
      return refreshAccessToken.refreshAccessToken({
        refreshToken,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://id.vk.com/oauth2/auth"
      });
    },
    async getUserInfo(data) {
      if (options.getUserInfo) {
        return options.getUserInfo(data);
      }
      if (!data.accessToken) {
        return null;
      }
      const formBody = new URLSearchParams({
        access_token: data.accessToken,
        client_id: options.clientId
      }).toString();
      const { data: profile, error } = await fetch.betterFetch(
        "https://id.vk.com/oauth2/user_info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formBody
        }
      );
      if (error) {
        return null;
      }
      if (!profile.user.email) {
        return null;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.user.user_id,
          first_name: profile.user.first_name,
          last_name: profile.user.last_name,
          email: profile.user.email,
          image: profile.user.avatar,
          /** @note VK does not provide emailVerified*/
          emailVerified: !!profile.user.email,
          birthday: profile.user.birthday,
          sex: profile.user.sex,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const kick = (options) => {
  return {
    id: "kick",
    name: "Kick",
    createAuthorizationURL({ state, scopes, redirectURI, codeVerifier }) {
      const _scopes = options.disableDefaultScope ? [] : ["user:read"];
      options.scope && _scopes.push(...options.scope);
      scopes && _scopes.push(...scopes);
      return refreshAccessToken.createAuthorizationURL({
        id: "kick",
        redirectURI,
        options,
        authorizationEndpoint: "https://id.kick.com/oauth/authorize",
        scopes: _scopes,
        codeVerifier,
        state
      });
    },
    async validateAuthorizationCode({ code, redirectURI, codeVerifier }) {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI,
        options,
        tokenEndpoint: "https://id.kick.com/oauth/token",
        codeVerifier
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data, error } = await fetch.betterFetch("https://api.kick.com/public/v1/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });
      if (error) {
        return null;
      }
      const profile = data.data[0];
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.user_id,
          name: profile.name,
          email: profile.email,
          image: profile.profile_picture,
          emailVerified: true,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};

const zoom = (userOptions) => {
  const options = {
    pkce: true,
    ...userOptions
  };
  return {
    id: "zoom",
    name: "Zoom",
    createAuthorizationURL: async ({ state, redirectURI, codeVerifier }) => {
      const params = new URLSearchParams({
        response_type: "code",
        redirect_uri: options.redirectURI ? options.redirectURI : redirectURI,
        client_id: options.clientId,
        state
      });
      if (options.pkce) {
        const codeChallenge = await refreshAccessToken.generateCodeChallenge(codeVerifier);
        params.set("code_challenge_method", "S256");
        params.set("code_challenge", codeChallenge);
      }
      const url = new URL("https://zoom.us/oauth/authorize");
      url.search = params.toString();
      return url;
    },
    validateAuthorizationCode: async ({ code, redirectURI, codeVerifier }) => {
      return refreshAccessToken.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
        codeVerifier,
        options,
        tokenEndpoint: "https://zoom.us/oauth/token",
        authentication: "post"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        "https://api.zoom.us/v2/users/me",
        {
          headers: {
            authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (error) {
        return null;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.display_name,
          image: profile.pic_url,
          email: profile.email,
          emailVerified: Boolean(profile.verified),
          ...userMap
        },
        data: {
          ...profile
        }
      };
    }
  };
};

const socialProviders = {
  apple,
  discord,
  facebook,
  github,
  microsoft,
  google,
  spotify,
  twitch,
  twitter,
  dropbox,
  kick,
  linkedin,
  gitlab,
  tiktok,
  reddit,
  roblox,
  vk,
  zoom
};
const socialProviderList = Object.keys(socialProviders);
const SocialProviderListEnum = zod.z.enum(socialProviderList).or(zod.z.string());

exports.LANG = LANG;
exports.SocialProviderListEnum = SocialProviderListEnum;
exports.apple = apple;
exports.discord = discord;
exports.dropbox = dropbox;
exports.facebook = facebook;
exports.getApplePublicKey = getApplePublicKey;
exports.github = github;
exports.gitlab = gitlab;
exports.google = google;
exports.kick = kick;
exports.linkedin = linkedin;
exports.microsoft = microsoft;
exports.reddit = reddit;
exports.roblox = roblox;
exports.socialProviderList = socialProviderList;
exports.socialProviders = socialProviders;
exports.spotify = spotify;
exports.tiktok = tiktok;
exports.twitch = twitch;
exports.twitter = twitter;
exports.vk = vk;
exports.zoom = zoom;
