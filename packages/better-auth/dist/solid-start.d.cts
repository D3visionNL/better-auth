import { j as Auth } from './auth-DLuY-BpD.cjs';
import 'kysely';
import 'better-call';
import 'zod';
import './helper-Bi8FQwDD.cjs';
import './index-DOvW5Rd7.cjs';
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
