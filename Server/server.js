import dotenv from 'dotenv';
dotenv.config();

import { initDatabase, deleteDatabase, insertDocument } from './modules/db.js';

let db = undefined;
try {
    // Initialize the database
    db = await initDatabase(process.env.DB_URI);

    
}
catch (e) {
    console.error(e);
}
finally {
    db?.close();
}