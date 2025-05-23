import * as http from 'http';
import { IncomingHttpHeaders } from 'http';
import { k as Auth } from '../shared/better-auth.Cl6aee2s.js';
import '../shared/better-auth.CYegVoq1.js';
import 'zod';
import '../shared/better-auth.Bzjh9zg_.js';
import 'jose';
import 'kysely';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

declare const toNodeHandler: (auth: {
    handler: Auth["handler"];
} | Auth["handler"]) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
declare function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers;

export { fromNodeHeaders, toNodeHandler };
