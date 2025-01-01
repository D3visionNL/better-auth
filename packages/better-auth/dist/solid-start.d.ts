import { j as Auth } from './auth-Ce_9WfBL.js';
import 'kysely';
import 'better-call';
import 'zod';
import './helper-Bi8FQwDD.js';
import './index-B0PXeJp8.js';
import 'jose';
import 'better-sqlite3';

declare function toSolidStartHandler(auth: Auth | Auth["handler"]): {
    GET: (event: {
        request: Request;
    }) => Promise<Response>;
    POST: (event: {
        request: Request;
    }) => Promise<Response>;
};

export { toSolidStartHandler };
