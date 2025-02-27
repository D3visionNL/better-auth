'use strict';

var chunk2D7VGWTP_cjs = require('./chunk-2D7VGWTP.cjs');
var chunkH74YRRNV_cjs = require('./chunk-H74YRRNV.cjs');
var chunkPEZRSDZS_cjs = require('./chunk-PEZRSDZS.cjs');
var fetch = require('@better-fetch/fetch');
var betterCall = require('better-call');
var jose = require('jose');
var zod = require('zod');

var apple = (options) => {
  const tokenEndpoint = "https://appleid.apple.com/auth/token";
  return {
    id: "apple",
    name: "Apple",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scope = scopes || ["email", "name"];
      options.scope && _scope.push(...options.scope);
      return new URL(
        `https://appleid.apple.com/auth/authorize?client_id=${options.clientId}&response_type=code&redirect_uri=${options.redirectURI || redirectURI}&scope=${_scope.join(" ")}&state=${state}&response_mode=form_post`
      );
    },
    validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI: options.redirectURI || redirectURI,
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
      const name = profile.user ? `${profile.user.name.firstName} ${profile.user.name.lastName}` : profile.email;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name,
          emailVerified: false,
          email: profile.email,
          ...userMap
        },
        data: profile
      };
    }
  };
};
var getApplePublicKey = async (kid) => {
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
var discord = (options) => {
  return {
    id: "discord",
    name: "Discord",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      let _scopes = scopes ? scopes : options?.scope ? options?.scope : ["identify", "email"];
      options.scope && _scopes.push(...options.scope);
      _scopes = Array.from(new Set(_scopes));
      return new URL(
        `https://discord.com/api/oauth2/authorize?scope=${_scopes.join(
          "+"
        )}&response_type=code&client_id=${options.clientId}&redirect_uri=${encodeURIComponent(
          options.redirectURI || redirectURI
        )}&state=${state}&prompt=${options.prompt || "none"}`
      );
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
        options,
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
          name: profile.display_name || profile.username || "",
          email: profile.email,
          emailVerified: profile.verified,
          image: profile.image_url,
          ...userMap
        },
        data: profile
      };
    }
  };
};
var facebook = (options) => {
  return {
    id: "facebook",
    name: "Facebook",
    async createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = scopes || ["email", "public_profile"];
      options.scope && _scopes.push(...options.scope);
      return await chunk2D7VGWTP_cjs.createAuthorizationURL({
        id: "facebook",
        options,
        authorizationEndpoint: "https://www.facebook.com/v21.0/dialog/oauth",
        scopes: _scopes,
        state,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
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
    }
  };
};
var github = (options) => {
  const tokenEndpoint = "https://github.com/login/oauth/access_token";
  return {
    id: "github",
    name: "GitHub",
    createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      const _scopes = scopes || ["user:email"];
      options.scope && _scopes.push(...options.scope);
      return chunk2D7VGWTP_cjs.createAuthorizationURL({
        id: "github",
        options,
        authorizationEndpoint: "https://github.com/login/oauth/authorize",
        scopes: _scopes,
        state,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint
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
      let emailVerified = false;
      const { data } = await fetch.betterFetch("https://api.github.com/user/emails", {
        headers: {
          authorization: `Bearer ${token.accessToken}`,
          "User-Agent": "better-auth"
        }
      });
      if (data) {
        profile.email = (data.find((e) => e.primary) ?? data[0])?.email;
        emailVerified = data.find((e) => e.email === profile.email)?.verified ?? false;
      }
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
    }
  };
};
var google = (options) => {
  return {
    id: "google",
    name: "Google",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      if (!options.clientId || !options.clientSecret) {
        chunkH74YRRNV_cjs.logger.error(
          "Client Id and Client Secret is required for Google. Make sure to provide them in the options."
        );
        throw new chunkPEZRSDZS_cjs.BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
      }
      if (!codeVerifier) {
        throw new chunkPEZRSDZS_cjs.BetterAuthError("codeVerifier is required for Google");
      }
      const _scopes = scopes || ["email", "profile", "openid"];
      options.scope && _scopes.push(...options.scope);
      const url = await chunk2D7VGWTP_cjs.createAuthorizationURL({
        id: "google",
        options,
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI
      });
      options.accessType && url.searchParams.set("access_type", options.accessType);
      options.prompt && url.searchParams.set("prompt", options.prompt);
      options.display && url.searchParams.set("display", options.display);
      options.hd && url.searchParams.set("hd", options.hd);
      return url;
    },
    validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint: "https://oauth2.googleapis.com/token"
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
      const isValid = tokenInfo.aud === options.clientId && tokenInfo.iss === "https://accounts.google.com";
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
    }
  };
};
var microsoft = (options) => {
  const tenant = options.tenantId || "common";
  const authorizationEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`;
  const tokenEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  return {
    id: "microsoft",
    name: "Microsoft EntraID",
    createAuthorizationURL(data) {
      const scopes = data.scopes || ["openid", "profile", "email", "User.Read"];
      options.scope && scopes.push(...options.scope);
      return chunk2D7VGWTP_cjs.createAuthorizationURL({
        id: "microsoft",
        options,
        authorizationEndpoint,
        state: data.state,
        codeVerifier: data.codeVerifier,
        scopes,
        redirectURI: data.redirectURI,
        prompt: options.requireSelectAccount || false
      });
    },
    validateAuthorizationCode({ code, codeVerifier, redirectURI }) {
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI: options.redirectURI || redirectURI,
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
              const pictureBase64 = Buffer.from(pictureBuffer).toString("base64");
              user.picture = `data:image/jpeg;base64, ${pictureBase64}`;
            } catch (e) {
              chunkH74YRRNV_cjs.logger.error(
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
    }
  };
};
var spotify = (options) => {
  return {
    id: "spotify",
    name: "Spotify",
    createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      const _scopes = scopes || ["user-read-email"];
      options.scope && _scopes.push(...options.scope);
      return chunk2D7VGWTP_cjs.createAuthorizationURL({
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
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI: options.redirectURI || redirectURI,
        options,
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
    }
  };
};
var twitch = (options) => {
  return {
    id: "twitch",
    name: "Twitch",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = scopes || ["user:read:email", "openid"];
      options.scope && _scopes.push(...options.scope);
      return chunk2D7VGWTP_cjs.createAuthorizationURL({
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
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint: "https://id.twitch.tv/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const idToken = token.idToken;
      if (!idToken) {
        chunkH74YRRNV_cjs.logger.error("No idToken found in token");
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
    }
  };
};
var twitter = (options) => {
  return {
    id: "twitter",
    name: "Twitter",
    createAuthorizationURL(data) {
      const _scopes = data.scopes || [
        "users.read",
        "tweet.read",
        "offline.access"
      ];
      options.scope && _scopes.push(...options.scope);
      return chunk2D7VGWTP_cjs.createAuthorizationURL({
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
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        codeVerifier,
        authentication: "basic",
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint: "https://api.x.com/2/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) {
        return options.getUserInfo(token);
      }
      const { data: profile, error } = await fetch.betterFetch(
        "https://api.x.com/2/users/me?user.fields=profile_image_url",
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
          id: profile.data.id,
          name: profile.data.name,
          email: profile.data.username || null,
          image: profile.data.profile_image_url,
          emailVerified: profile.data.verified || false,
          ...userMap
        },
        data: profile
      };
    }
  };
};
var dropbox = (options) => {
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
      const _scopes = scopes || ["account_info.read"];
      options.scope && _scopes.push(...options.scope);
      return await chunk2D7VGWTP_cjs.createAuthorizationURL({
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
      return await chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint
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
    }
  };
};
var linkedin = (options) => {
  const authorizationEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
  const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
  return {
    id: "linkedin",
    name: "Linkedin",
    createAuthorizationURL: async ({ state, scopes, redirectURI }) => {
      const _scopes = scopes || ["profile", "email", "openid"];
      options.scope && _scopes.push(...options.scope);
      return await chunk2D7VGWTP_cjs.createAuthorizationURL({
        id: "linkedin",
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return await chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
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
    }
  };
};
var cleanDoubleSlashes = (input = "") => {
  return input.split("://").map((str) => str.replace(/\/{2,}/g, "/")).join("://");
};
var issuerToEndpoints = (issuer) => {
  let baseUrl = issuer || "https://gitlab.com";
  return {
    authorizationEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/authorize`),
    tokenEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/token`),
    userinfoEndpoint: cleanDoubleSlashes(`${baseUrl}/api/v4/user`)
  };
};
var gitlab = (options) => {
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
      redirectURI
    }) => {
      const _scopes = scopes || ["read_user"];
      options.scope && _scopes.push(...options.scope);
      return await chunk2D7VGWTP_cjs.createAuthorizationURL({
        id: issuerId,
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        redirectURI,
        codeVerifier
      });
    },
    validateAuthorizationCode: async ({ code, redirectURI, codeVerifier }) => {
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
        options,
        codeVerifier,
        tokenEndpoint
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
    }
  };
};
var reddit = (options) => {
  return {
    id: "reddit",
    name: "Reddit",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = scopes || ["identity"];
      options.scope && _scopes.push(...options.scope);
      return chunk2D7VGWTP_cjs.createAuthorizationURL({
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
        Authorization: `Basic ${Buffer.from(
          `${options.clientId}:${options.clientSecret}`
        ).toString("base64")}`
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
      return chunk2D7VGWTP_cjs.getOAuth2Tokens(data);
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
    }
  };
};
var roblox = (options) => {
  return {
    id: "roblox",
    name: "Roblox",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = scopes || ["openid", "profile"];
      options.scope && _scopes.push(...options.scope);
      return new URL(
        `https://apis.roblox.com/oauth/v1/authorize?scope=${_scopes.join(
          "+"
        )}&response_type=code&client_id=${options.clientId}&redirect_uri=${encodeURIComponent(
          options.redirectURI || redirectURI
        )}&state=${state}&prompt=${options.prompt || "select_account+consent"}`
      );
    },
    validateAuthorizationCode: async ({ code, redirectURI }) => {
      return chunk2D7VGWTP_cjs.validateAuthorizationCode({
        code,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint: "https://apis.roblox.com/oauth/v1/token",
        authentication: "post"
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
      return {
        user: {
          id: profile.sub,
          name: profile.nickname || profile.preferred_username || "",
          image: profile.picture,
          email: profile.preferred_username || null,
          // Roblox does not provide email
          emailVerified: true
        },
        data: {
          ...profile
        }
      };
    }
  };
};
var socialProviders = {
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
  linkedin,
  gitlab,
  reddit,
  roblox
};
var socialProviderList = Object.keys(socialProviders);
var SocialProviderListEnum = zod.z.enum(socialProviderList, {
  description: "OAuth2 provider to use"
});

exports.SocialProviderListEnum = SocialProviderListEnum;
exports.apple = apple;
exports.discord = discord;
exports.dropbox = dropbox;
exports.facebook = facebook;
exports.getApplePublicKey = getApplePublicKey;
exports.github = github;
exports.gitlab = gitlab;
exports.google = google;
exports.linkedin = linkedin;
exports.microsoft = microsoft;
exports.reddit = reddit;
exports.roblox = roblox;
exports.socialProviderList = socialProviderList;
exports.socialProviders = socialProviders;
exports.spotify = spotify;
exports.twitch = twitch;
exports.twitter = twitter;
