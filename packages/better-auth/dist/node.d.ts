import * as http from 'http';
import { IncomingHttpHeaders } from 'http';
import { j as Auth } from './auth-DqGmFvxB.js';
import 'kysely';
import 'better-call';
import 'zod';
import './helper-Bi8FQwDD.js';
import './index-BX_Xd9xp.js';
import 'jose';
import 'better-sqlite3';

declare const toNodeHandler: (auth: {
    handler: Auth["handler"];
} | Auth["handler"]) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
declare function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers;

export { fromNodeHeaders, toNodeHandler };
