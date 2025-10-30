import { d as AuthContext, g as checkPassword } from '../../shared/better-auth.CDN3l_op.mjs';
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

interface HaveIBeenPwnedOptions {
    customPasswordCompromisedMessage?: string;
}
declare const haveIBeenPwned: (options?: HaveIBeenPwnedOptions) => {
    id: "haveIBeenPwned";
    init(ctx: AuthContext): {
        context: {
            password: {
                hash(password: string): Promise<string>;
                verify: (data: {
                    password: string;
                    hash: string;
                }) => Promise<boolean>;
                config: {
                    minPasswordLength: number;
                    maxPasswordLength: number;
                };
                checkPassword: typeof checkPassword;
            };
        };
    };
    $ERROR_CODES: {
        readonly PASSWORD_COMPROMISED: "The password you entered has been compromised. Please choose a different password.";
    };
};

export { haveIBeenPwned };
export type { HaveIBeenPwnedOptions };
