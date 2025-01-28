import * as better_call from 'better-call';
import { OpenAPIParameter, OpenAPISchemaType } from 'better-call';
import { l as AuthContext, B as BetterAuthOptions } from '../auth-CxnTUVJT.js';
import { L as LiteralString } from '../helper-Bi8FQwDD.js';
import 'kysely';
import 'zod';
import '../index-l5SennZN.js';
import 'jose';
import 'better-sqlite3';

interface Path {
    get?: {
        tags?: string[];
        operationId?: string;
        description?: string;
        security?: [{
            bearerAuth: string[];
        }];
        parameters?: OpenAPIParameter[];
        responses?: {
            [key in string]: {
                description?: string;
                content: {
                    "application/json": {
                        schema: {
                            type?: OpenAPISchemaType;
                            properties?: Record<string, any>;
                            required?: string[];
                            $ref?: string;
                        };
                    };
                };
            };
        };
    };
    post?: {
        tags?: string[];
        operationId?: string;
        description?: string;
        security?: [{
            bearerAuth: string[];
        }];
        parameters?: OpenAPIParameter[];
        requestBody?: {
            content: {
                "application/json": {
                    schema: {
                        type?: OpenAPISchemaType;
                        properties?: Record<string, any>;
                        required?: string[];
                        $ref?: string;
                    };
                };
            };
        };
        responses?: {
            [key in string]: {
                description?: string;
                content: {
                    "application/json": {
                        schema: {
                            type?: OpenAPISchemaType;
                            properties?: Record<string, any>;
                            required?: string[];
                            $ref?: string;
                        };
                    };
                };
            };
        };
    };
}
declare function generator(ctx: AuthContext, options: BetterAuthOptions): Promise<{
    openapi: string;
    info: {
        title: string;
        description: string;
        version: string;
    };
    components: {
        schemas: {};
    };
    security: {
        apiKeyCookie: never[];
    }[];
    servers: {
        url: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
    paths: Record<string, Path>;
}>;

interface OpenAPIOptions {
    /**
     * The path to the OpenAPI reference page
     *
     * keep in mind that this path will be appended to the base URL `/api/auth` path
     * by default, so if you set this to `/reference`, the full path will be `/api/auth/reference`
     *
     * @default "/reference"
     */
    path?: LiteralString;
    /**
     * Disable the default reference page that is generated by Scalar
     *
     * @default false
     */
    disableDefaultReference?: boolean;
}
declare const openAPI: <O extends OpenAPIOptions>(options?: O) => {
    id: "open-api";
    endpoints: {
        generateOpenAPISchema: {
            <C extends [(better_call.Context<"/open-api/generate-schema", {
                method: "GET";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                openapi: string;
                info: {
                    title: string;
                    description: string;
                    version: string;
                };
                components: {
                    schemas: {};
                };
                security: {
                    apiKeyCookie: never[];
                }[];
                servers: {
                    url: string;
                }[];
                tags: {
                    name: string;
                    description: string;
                }[];
                paths: Record<string, Path>;
            }>;
            path: "/open-api/generate-schema";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        openAPIReference: {
            <C extends [(better_call.Context<"/reference", {
                method: "GET";
                metadata: {
                    isAction: boolean;
                };
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : Response>;
            path: "/reference";
            options: {
                method: "GET";
                metadata: {
                    isAction: boolean;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    };
};

export { type OpenAPIOptions, type Path, generator, openAPI };
