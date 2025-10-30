import { d as AuthContext } from '../../shared/better-auth.CDN3l_op.mjs';
import '../../shared/better-auth.DTtXpZYr.mjs';
import 'better-call';
import 'kysely';
import '@better-auth/core/db';
import 'zod';
import '../../shared/better-auth.BHPr8J54.mjs';
import 'better-sqlite3';
import 'bun:sqlite';
import 'node:sqlite';
import 'zod/v4/core';

declare const Providers: {
    readonly CLOUDFLARE_TURNSTILE: "cloudflare-turnstile";
    readonly GOOGLE_RECAPTCHA: "google-recaptcha";
    readonly HCAPTCHA: "hcaptcha";
    readonly CAPTCHAFOX: "captchafox";
};

interface BaseCaptchaOptions {
    secretKey: string;
    endpoints?: string[];
    siteVerifyURLOverride?: string;
}
interface GoogleRecaptchaOptions extends BaseCaptchaOptions {
    provider: typeof Providers.GOOGLE_RECAPTCHA;
    minScore?: number;
}
interface CloudflareTurnstileOptions extends BaseCaptchaOptions {
    provider: typeof Providers.CLOUDFLARE_TURNSTILE;
}
interface HCaptchaOptions extends BaseCaptchaOptions {
    provider: typeof Providers.HCAPTCHA;
    siteKey?: string;
}
interface CaptchaFoxOptions extends BaseCaptchaOptions {
    provider: typeof Providers.CAPTCHAFOX;
    siteKey?: string;
}
type CaptchaOptions = GoogleRecaptchaOptions | CloudflareTurnstileOptions | HCaptchaOptions | CaptchaFoxOptions;

declare const captcha: (options: CaptchaOptions) => {
    id: "captcha";
    onRequest: (request: Request, ctx: AuthContext) => Promise<{
        response: Response;
    } | undefined>;
};

export { captcha };
