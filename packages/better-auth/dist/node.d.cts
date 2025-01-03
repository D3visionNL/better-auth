import * as http from 'http';
import { IncomingHttpHeaders } from 'http';
import { j as Auth } from './auth-BISvpQdc.cjs';
import 'kysely';
import 'better-call';
import 'zod';
import './helper-Bi8FQwDD.cjs';
import './index-KR6jI2X2.cjs';
import 'jose';
import 'better-sqlite3';

declare const toNodeHandler: (auth: {
    handler: Auth["handler"];
} | Auth["handler"]) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
declare function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers;

export { fromNodeHeaders, toNodeHandler };
