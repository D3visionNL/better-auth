import * as http from 'http';
import { IncomingHttpHeaders } from 'http';
import { k as Auth } from './auth-BA0Kj1M6.js';
import 'kysely';
import 'better-call';
import 'zod';
import './helper-Bi8FQwDD.js';
import './index-l5SennZN.js';
import 'jose';
import 'better-sqlite3';

declare const toNodeHandler: (auth: {
    handler: Auth["handler"];
} | Auth["handler"]) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
declare function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers;

export { fromNodeHeaders, toNodeHandler };
