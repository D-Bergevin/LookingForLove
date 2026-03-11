import env from './env.js';
import * as db from './db.js'
import * as fs from "node:fs/promises";

const DATABASE_NAME = "LookingForLove";
const COLLECTION_NAME = "profiles"

const retrieveProfiles = async () => {
    let profiles = [];
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        
        profiles = await db.findDocuments(context, DATABASE_NAME, COLLECTION_NAME, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return profiles;
}

// CASE SENSITIVE
const retrieveProfile = async(profileUsername) => {
    let profile = null;
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);
        
        profile = await db.findDocument(context, DATABASE_NAME, COLLECTION_NAME, {username: profileUsername});

        console.log(profile);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return profile;
}

export {
    DATABASE_NAME,
    retrieveProfiles,
    retrieveProfile
};