import * as http from 'http';
import { IncomingHttpHeaders } from 'http';
import { c as Auth } from '../shared/better-auth.CDN3l_op.mjs';
import '../shared/better-auth.DTtXpZYr.mjs';
import 'better-call';
import 'kysely';
import '@better-auth/core/db';
import 'zod';
import '../shared/better-auth.BHPr8J54.mjs';
import 'better-sqlite3';
import 'bun:sqlite';
import 'node:sqlite';
import 'zod/v4/core';

declare const toNodeHandler: (auth: {
    handler: Auth["handler"];
} | Auth["handler"]) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
declare function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers;

export { fromNodeHeaders, toNodeHandler };
