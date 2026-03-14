import env from './modules/env.js';

import { initDatabase, deleteDatabase, insertDocument } from './modules/db.js';
import { startServer } from './modules/api.js';

const API_PORT = 9000;

let db = undefined;
try {
    // Initialize the database
    db = await initDatabase(env.DB_URI);
}
catch (e) {
    console.error(e);
}
finally {
    db?.close();
}

startServer(API_PORT);