import * as better_call from 'better-call';
import { z } from 'zod';
import { U as User, S as Session, G as GenericEndpointContext } from '../../shared/better-auth.kHOzQ3TU.mjs';
import '../../shared/better-auth.Bi8FQwDD.mjs';
import '../../shared/better-auth.CggyDr6H.mjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface OneTimeTokenOptions {
    /**
     * Expires in minutes
     *
     * @default 3
     */
    expiresIn?: number;
    /**
     * Only allow server initiated requests
     */
    disableClientRequest?: boolean;
    /**
     * Generate a custom token
     */
    generateToken?: (session: {
        user: User & Record<string, any>;
        session: Session & Record<string, any>;
    }, ctx: GenericEndpointContext) => Promise<string>;
}
declare const oneTimeToken: (options?: OneTimeTokenOptions) => {
    id: "one-time-token";
    endpoints: {
        generateOneTimeToken: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: better_call.Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    token: string;
                };
            } : {
                token: string;
            }>;
            options: {
                method: "GET";
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
            } & {
                use: any[];
            };
            path: "/one-time-token/generate";
        };
        verifyOneTimeToken: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    token: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: better_call.Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    session: Session & Record<string, any>;
                    user: User & Record<string, any>;
                };
            } : {
                session: Session & Record<string, any>;
                user: User & Record<string, any>;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    token: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    token: string;
                }, {
                    token: string;
                }>;
            } & {
                use: any[];
            };
            path: "/one-time-token/verify";
        };
    };
};

export { oneTimeToken };
