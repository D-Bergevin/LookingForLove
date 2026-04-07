import env from './env.js';
import * as db from './db.js';
import bcrypt from "bcrypt";

const DATABASE_NAME = "LookingForLove";
const PROFILE_TABLE = "profiles";
const MATCH_TABLE = "matches";
const REVIEW_TABLE = "reviews";
const SALT_ROUNDS = 10;

const retrieveProfiles = async () => {
    let profiles = [];
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        profiles = await db.findDocuments(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            {},
            { _id: 0, passwordHash: 0 }
        );
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return profiles;
};

const retrieveProfilesByInterest = async (userUsername) => {
    let profiles = [];
    let context = undefined;

    let userProfile = await retrieveProfile(userUsername);

    try {
        context = await db.initDatabase(env.DB_URI);

        profiles = await db.findDocuments(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            {interests: {$in: userProfile.interests}, username: {$ne: userProfile.username}},
            { _id: 0, passwordHash: 0 }
        );

        let filteredProfiles = profiles.map(profile => {
            if (!profile) return null;

            const privacyLevel = profile;

            switch (privacyLevel) {
                case 0:
                    return {
                        username: profile.username,
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        email: profile.email,
                        interests: profile.interests,
                        skills: profile.skills,
                        datingPreference: profile.datingPreference,
                        displayedGender: profile.displayerGender,
                        location: profile.location,
                        employment: profile.employment
                    };
                case 1:
                    return {
                        username: profile.username,
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        interests: profile.interests,
                        skills: profile.skills,
                        datingPreference: profile.datingPreference,
                        displayedGender: profile.displayerGender
                    };
                default:
                    return {
                        username: profile.username,
                        firstName: profile.firstName,
                        interests: profile.interests,
                        skills: profile.skills,
                        datingPreference: profile.datingPreference,
                        displayedGender: profile.displayerGender
                    };
            }
        });

        profiles = filteredProfiles;
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return profiles;
};

const retrieveProfile = async (profileUsername) => {
    let profile = null;
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        profile = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            { username: profileUsername },
            { _id: 0, passwordHash: 0 }
        );
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return profile;
};



const retrieveProfileByPrivacy = async (profileUsername) => {
    let profile = null;
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        profile = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            { username: profileUsername },
            { _id: 0, passwordHash: 0 }
        );

        if (profile)
        {
            const privacyLevel = profile.privacyLevel;

            switch (privacyLevel)
            {
                case 0:
                    profile = {
                        username: profile.username, 
                        firstName: profile.firstName, 
                        lastName: profile.lastName, 
                        email: profile.email,
                        interests: profile.interests, 
                        skills: profile.skills, 
                        datingPreference: profile.datingPreference, 
                        displayedGender: profile.displayedGender,
                        location: profile.location,
                        employment: profile.employment
                    };
                    break;
                case 1:
                    profile = {
                        username: profile.username, 
                        firstName: profile.firstName, 
                        lastName: profile.lastName, 
                        interests: profile.interests, 
                        skills: profile.skills, 
                        datingPreference: profile.datingPreference, 
                        displayedGender: profile.displayedGender
                    };
                    break;
                default:
                    profile = {
                        username: profile.username, 
                        firstName: profile.firstName,
                        interests: profile.interests, 
                        skills: profile.skills, 
                        datingPreference: profile.datingPreference, 
                        displayedGender: profile.displayedGender
                    }
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return profile;
};

const addNewProfile = async (profile) => {
    let context = undefined;
    let result = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        let testUsername = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            { username: profile.username }
        );

        let testEmail = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            { email: profile.email }
        );

        if (!testUsername && !testEmail) {
            const passwordHash = await bcrypt.hash(profile.password, SALT_ROUNDS);

            const profileToInsert = {
                ...profile,
                passwordHash
            };

            delete profileToInsert.password;

            result = await db.insertDocument(
                context,
                DATABASE_NAME,
                PROFILE_TABLE,
                profileToInsert
            );
        }
        else {
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
};

const authenticateProfile = async (identifier, password) => {
    let context = undefined;
    let user = null;

    try {
        context = await db.initDatabase(env.DB_URI);

        user = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            {
                $or: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
        );

        if (!user) {
            return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
            return null;
        }

        delete user.passwordHash;
        delete user._id;

        return user;
    }
    catch (e) {
        console.error("AUTH ERROR:", e);
        return null;
    }
    finally {
        context?.close();
    }
};

const updatePartialProfile = async (criteria, update) => {
    let context = undefined;
    let result = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        let existingProfile = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            criteria
        );

        if (!existingProfile) {
            console.error("ERROR: Profile does not exist.");
            result = "NotFound";
        }
        else {

            let testEmail = null;
            
            if (update.email)
            {
                testEmail = await db.findDocument(
                context,
                DATABASE_NAME,
                PROFILE_TABLE,
                { email: update.email, username: {$ne: existingProfile.username} }
                );
        }   

            if (!testEmail) {
                if (update.username) {
                    console.error("ERROR: Cannot update username.");
                    result = "Username";
                }
                else {
                    result = await db.updateDocument(
                        context,
                        DATABASE_NAME,
                        PROFILE_TABLE,
                        criteria,
                        update
                    );
                }
            }
            else {
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
};

export {
    DATABASE_NAME,
    retrieveProfiles,
    retrieveProfile,
    retrieveProfilesByInterest,
    retrieveProfileByPrivacy,
    addNewProfile,
    authenticateProfile,
    updatePartialProfile
};