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

// CASE SENSITIVE USERNAME
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

const addNewProfile = async(profile) => {
    let context = undefined;
    let result = undefined
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let testUsername = await db.findDocument(context,DATABASE_NAME,COLLECTION_NAME, {username: profile.username})
        let testEmail = await db.findDocument(context,DATABASE_NAME,COLLECTION_NAME, {email: profile.email})

        if (!testUsername && !testEmail)
        {

            result = await db.insertDocument(context,DATABASE_NAME,COLLECTION_NAME,profile);

            console.log(result);
        }
        else
        {
            console.error("ERROR: Profile already exists.");
            result = "Duplicate";
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return result;
}


const updatePartialProfile = async(criteria, update) => {
    let context = undefined;
    let result = undefined
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let existingProfile = await db.findDocument(context,DATABASE_NAME,COLLECTION_NAME, criteria)

        if (!existingProfile)
        {
            console.error("ERROR: Profile does not exist.");
            result = "NotFound";
        }
        else
        {
            let testEmail = await db.findDocument(context,DATABASE_NAME,COLLECTION_NAME, {email: update.email})

            if (!testEmail)
            {
                if (update.username)
                {
                    console.error("ERROR: Cannot update username.");
                    result = "Username";
                }
                else
                {
                    result = await db.updateDocument(context, DATABASE_NAME, COLLECTION_NAME, criteria, update)
                }
            }
            else
            {
                console.error("ERROR: Profile already exists.");
                result = "Duplicate";
            }

            
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return result;
}


export {
    DATABASE_NAME,
    retrieveProfiles,
    retrieveProfile,
    addNewProfile,
    updatePartialProfile
};