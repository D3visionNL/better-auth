import { l as AuthContext } from '../../shared/better-auth.p1j7naQW.mjs';
import '../../shared/better-auth.CYegVoq1.mjs';
import 'zod';
import '../../shared/better-auth.BTXFetzv.mjs';
import 'jose';
import 'kysely';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

declare const Providers: {
    readonly CLOUDFLARE_TURNSTILE: "cloudflare-turnstile";
    readonly GOOGLE_RECAPTCHA: "google-recaptcha";
    readonly HCAPTCHA: "hcaptcha";
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
type CaptchaOptions = GoogleRecaptchaOptions | CloudflareTurnstileOptions | HCaptchaOptions;

declare const captcha: (options: CaptchaOptions) => {
    id: "captcha";
    onRequest: (request: Request, ctx: AuthContext) => Promise<{
        response: Response;
    } | undefined>;
};

export { captcha };
