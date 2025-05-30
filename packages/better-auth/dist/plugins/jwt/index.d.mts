import * as better_call from 'better-call';
import { U as User, S as Session, I as InferOptionSchema, H as HookEndpointContext, G as GenericEndpointContext } from '../../shared/better-auth.kHOzQ3TU.mjs';
import '../../shared/better-auth.Bi8FQwDD.mjs';
import 'zod';
import '../../shared/better-auth.CggyDr6H.mjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

declare const schema: {
    jwks: {
        fields: {
            publicKey: {
                type: "string";
                required: true;
            };
            privateKey: {
                type: "string";
                required: true;
            };
            createdAt: {
                type: "date";
                required: true;
            };
        };
    };
};

type JWKOptions = {
    alg: "EdDSA";
    crv?: "Ed25519" | "Ed448";
} | {
    alg: "ES256";
    crv?: never;
} | {
    alg: "RS256";
    modulusLength?: number;
} | {
    alg: "PS256";
    modulusLength?: number;
} | {
    alg: "ECDH-ES";
    crv?: "P-256" | "P-384" | "P-521";
} | {
    alg: "ES512";
    crv?: never;
};
interface JwtOptions {
    jwks?: {
        /**
         * Key pair configuration
         * @description A subset of the options available for the generateKeyPair function
         *
         * @see https://github.com/panva/jose/blob/main/src/runtime/node/generate.ts
         *
         * @default { alg: 'EdDSA', crv: 'Ed25519' }
         */
        keyPairConfig?: JWKOptions;
        /**
         * Disable private key encryption
         * @description Disable the encryption of the private key in the database
         *
         * @default false
         */
        disablePrivateKeyEncryption?: boolean;
    };
    jwt?: {
        /**
         * The issuer of the JWT
         */
        issuer?: string;
        /**
         * The audience of the JWT
         */
        audience?: string;
        /**
         * Set the "exp" (Expiration Time) Claim.
         *
         * - If a `number` is passed as an argument it is used as the claim directly.
         * - If a `Date` instance is passed as an argument it is converted to unix timestamp and used as the
         *   claim.
         * - If a `string` is passed as an argument it is resolved to a time span, and then added to the
         *   current unix timestamp and used as the claim.
         *
         * Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
         * day".
         *
         * Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
         * "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
         * "years", "yr", "yrs", and "y". It is not possible to specify months. 365.25 days is used as an
         * alias for a year.
         *
         * If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
         * subtracted from the current unix timestamp. A "from now" suffix can also be used for
         * readability when adding to the current unix timestamp.
         *
         * @default 15m
         */
        expirationTime?: number | string | Date;
        /**
         * A function that is called to define the payload of the JWT
         */
        definePayload?: (session: {
            user: User & Record<string, any>;
            session: Session & Record<string, any>;
        }) => Promise<Record<string, any>> | Record<string, any>;
        /**
         * A function that is called to get the subject of the JWT
         *
         * @default session.user.id
         */
        getSubject?: (session: {
            user: User & Record<string, any>;
            session: Session & Record<string, any>;
        }) => Promise<string> | string;
    };
    /**
     * Custom schema for the admin plugin
     */
    schema?: InferOptionSchema<typeof schema>;
}
declare function getJwtToken(ctx: GenericEndpointContext, options?: JwtOptions): Promise<string>;
declare const jwt: (options?: JwtOptions) => {
    id: "jwt";
    endpoints: {
        getJwks: {
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
                    keys: any[];
                };
            } : {
                keys: any[];
            }>;
            options: {
                method: "GET";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                keys: {
                                                    type: string;
                                                    description: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            kid: {
                                                                type: string;
                                                                description: string;
                                                            };
                                                            kty: {
                                                                type: string;
                                                                description: string;
                                                            };
                                                            alg: {
                                                                type: string;
                                                                description: string;
                                                            };
                                                            use: {
                                                                type: string;
                                                                description: string;
                                                                enum: string[];
                                                                nullable: boolean;
                                                            };
                                                            n: {
                                                                type: string;
                                                                description: string;
                                                                nullable: boolean;
                                                            };
                                                            e: {
                                                                type: string;
                                                                description: string;
                                                                nullable: boolean;
                                                            };
                                                            crv: {
                                                                type: string;
                                                                description: string;
                                                                nullable: boolean;
                                                            };
                                                            x: {
                                                                type: string;
                                                                description: string;
                                                                nullable: boolean;
                                                            };
                                                            y: {
                                                                type: string;
                                                                description: string;
                                                                nullable: boolean;
                                                            };
                                                        };
                                                        required: string[];
                                                    };
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/jwks";
        };
        getToken: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
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
                headers: HeadersInit;
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
                    token: string;
                };
            } : {
                token: string;
            }>;
            options: {
                method: "GET";
                requireHeaders: true;
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
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/token";
        };
    };
    hooks: {
        after: {
            matcher(context: HookEndpointContext): boolean;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<void>;
        }[];
    };
    schema: {
        jwks: {
            fields: {
                publicKey: {
                    type: "string";
                    required: true;
                };
                privateKey: {
                    type: "string";
                    required: true;
                };
                createdAt: {
                    type: "date";
                    required: true;
                };
            };
        };
    };
};

export { type JwtOptions, getJwtToken, jwt };
