import env from './env.js';
import * as db from './db.js';
import bcrypt from "bcrypt";

const DATABASE_NAME = "LookingForLove";
const PROFILE_TABLE = "profiles";
const MATCH_TABLE = "matches";
const REVIEW_TABLE = "reviews";
const DASHBOARD_TABLE = "dashboard"
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

    if (!userProfile)
    {
        return profiles;
    }

    try {
        context = await db.initDatabase(env.DB_URI);

        profiles = await db.findDocuments(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            {interests: {$in: userProfile.interests}, username: {$ne: userProfile.username}},
            { _id: 0, passwordHash: 0 }
        );

        let existingMatches = await db.findDocuments(
            context,
            DATABASE_NAME,
            MATCH_TABLE,
            { $or: [{initialSender: userProfile.username},
                    {initialReceiver: userProfile.username, matched:"true"}]
            }
        );

        let existingUsernames = existingMatches.map(match => {
            if (!match) return null;

            if (match.initialSender === userUsername)
            {
                return match.initialReceiver
            }
            else if (match.initialReceiver === userUsername)
            {
                return match.initialSender;
            }
            else return null;

        }).filter(matchUsername => matchUsername !== null);


        let filteredProfiles = profiles.map(profile => {
            if (!profile) return null;
            if (existingUsernames.includes(profile.username)) return null;

            if (userProfile.datingPreference !== "A" && userProfile.datingPreference !== profile.displayedGender)
            {
                return null;
            }

            if (profile.datingPreference !== "A" && profile.datingPreference !== userProfile.displayedGender)
            {
                return null
            }

            const privacyLevel = profile.privacyLevel;

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
                        displayedGender: profile.displayedGender,
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
                        displayedGender: profile.displayedGender
                    };
                default:
                    return {
                        username: profile.username,
                        firstName: profile.firstName,
                        interests: profile.interests,
                        skills: profile.skills,
                        datingPreference: profile.datingPreference,
                        displayedGender: profile.displayedGender
                    };
            }
        }).filter(profile => profile !== null);

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

const retreiveMatchedProfiles = async (userUsername) => {
    let profiles = [];
    let context = undefined;

    let userProfile = await retrieveProfile(userUsername);

    if (!userProfile)
    {
        return profiles;
    }

    try {
        context = await db.initDatabase(env.DB_URI);

        let matches = await db.findDocuments(
            context,
            DATABASE_NAME,
            MATCH_TABLE,
            { $or: [{initialSender: userUsername, matched: "true"},
                    {initialReceiver: userUsername, matched: "true"}] 
            },
            { _id: 0, matched: 0 }
        );

        let matchUsernames = matches.map(match => {
            if (!match) return null;

            if (match.initialSender === userUsername)
            {
                return match.initialReceiver
            }
            else if (match.initialReceiver === userUsername)
            {
                return match.initialSender;
            }
            else return null;

        }).filter(matchUsername => matchUsername !== null);

        profiles = await db.findDocuments(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            {username: {$in: matchUsernames}},
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

const retrieveContactInformation = async (profileUsername) => {
    let contactInfo = null;
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        let profile = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            { username: profileUsername }
        );

        if (profile.email)
        {
            contactInfo = {email: profile.email};

            dashboardResult = await db.updateDashboard(
            context,
            DATABASE_NAME,
            DASHBOARD_TABLE,
            {numCommunicationShares: 1}
            );
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return contactInfo;
};

const retrieveDashboardStats = async () => {
    let stats = null;
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        stats = await db.findDocument(
            context,
            DATABASE_NAME,
            DASHBOARD_TABLE,
            { dashboard: "dashboard" },
            { _id: 0, dashboard: 0 }
        );
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return stats;
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

            let dashboardResult = null;

            if (profileToInsert.membership)
            {
                if (profileToInsert.membership === "Paid")
                {
                    dashboardResult = await db.updateDashboard(
                    context,
                    DATABASE_NAME,
                    DASHBOARD_TABLE,
                    {numPaidMembers: 1}  
                    );
                }
                else
                {
                    dashboardResult = await db.updateDashboard(
                    context,
                    DATABASE_NAME,
                    DASHBOARD_TABLE,
                    {numFreeMembers: 1}
                    );
                }
            }
            else
            {
                dashboardResult = await db.updateDashboard(
                context,
                DATABASE_NAME,
                DASHBOARD_TABLE,
                {numFreeMembers: 1}  
                );
            }
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

const matchProfiles = async (senderUsername, receiverUsername) => {
    let context = undefined;
    let result = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        let sender = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            { username: senderUsername }
        );

        let receiver = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            { username: receiverUsername }
        );

        if (sender && receiver) {

            let alreadyMatched = await db.findDocument(
            context,
            DATABASE_NAME,
            MATCH_TABLE,
            { $or: [{initialSender: sender.username, initialReceiver: receiver.username, matched: "true"},
                    {initialSender: receiver.username, initialReceiver: sender.username, matched: "true"}] 
            }
            );

            if (!alreadyMatched)
            {

                let requestAlreadySent = await db.findDocument(
                context,
                DATABASE_NAME,
                MATCH_TABLE,
                { initialSender: sender.username, initialReceiver: receiver.username }
                );

                if (!requestAlreadySent)
                {
                    let receiverSentRequest = await db.findDocument(
                    context,
                    DATABASE_NAME,
                    MATCH_TABLE,
                    { initialSender: receiver.username, initialReceiver: sender.username }
                    );

                    if (receiverSentRequest)
                    {
                        //Match profiles
                        result = await db.updateDocument(
                        context,
                        DATABASE_NAME,
                        MATCH_TABLE,
                        {initialSender: receiver.username, initialReceiver: sender.username},
                        {matched: "true"}
                        );

                        let dashboardResult = await db.updateDashboard(
                        context,
                        DATABASE_NAME,
                        DASHBOARD_TABLE,
                        {numMatches: 1}  
                        );
                    }
                    else
                    {
                        //Send initial request
                        result = await db.insertDocument(
                            context,
                            DATABASE_NAME,
                            MATCH_TABLE,
                            {
                                initialSender: sender.username,
                                initialReceiver: receiver.username,
                                matched: "false"
                            }
                        );
                    }
                }
                else
                {
                    //request already sent
                    console.error("ERROR: Match request already sent to this user.");
                    result = "AlreadySent";
                }
            }
            else
            {
                //already matched
                console.error("ERROR: Profiles are already matched.");
                result = "Matched";
            }
        }
        else {
            console.error("ERROR: Profile does not exist.");
            result = "NotFound";
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

const retrieveReviewsByUsername = async (username) => {
    let reviews = [];
    let context = undefined;
    try{
        context = await db.initDatabase(env.DB_URI);

        reviews = await db.findDocuments(
            context,
            DATABASE_NAME,
            REVIEW_TABLE,
            { reviewer: username },
            //{ _id: 0 }
        );
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return reviews;
}

const reviewMatch = async (reviewerUsername, matchedUsername, review) => {
    let context = undefined;
    let result = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        let reviewerProfile = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            { username: reviewerUsername }
        );

        let matchedProfile = await db.findDocument(
            context,
            DATABASE_NAME,
            PROFILE_TABLE,
            { username: matchedUsername }
        );

        if (!reviewerProfile || !matchedProfile) {
            console.error("ERROR: Profile does not exist.");
            result = "NotFound";
        }
        else {

            let alreadyReviewed = await db.findDocument(
            context,
            DATABASE_NAME,
            REVIEW_TABLE,
            {reviewer: reviewerProfile.username, matched: matchedProfile.username}
            );

            if (alreadyReviewed)
            {
                result = await db.updateDocument(
                        context,
                        DATABASE_NAME,
                        REVIEW_TABLE,
                        {reviewer: reviewerProfile.username, matched: matchedProfile.username},
                        {rating: review.rating, comment: review.comment}
                    );
            }
            else
            {
                let matchExists = await db.findDocument(
                    context,
                    DATABASE_NAME,
                    MATCH_TABLE,
                    { $or: [{initialSender: reviewerProfile.username, initialReceiver: matchedProfile.username, matched: "true"},
                        {initialSender: matchedProfile.username, initialReceiver: reviewerProfile.username, matched: "true"}] 
                    }
                );

                if (matchExists)
                {
                    if (review.rating > 5 || review.rating < 1)
                    {
                        //Rating not 1-5
                        console.error("ERROR: Rating is not in between 1-5.");
                        result = "Rating";
                    }
                    else
                    {
                        result = await db.insertDocument(
                            context,
                            DATABASE_NAME,
                            REVIEW_TABLE,
                            {
                                reviewer: reviewerProfile.username,
                                matched: matchedProfile.username,
                                rating: review.rating,
                                comment: review.comment
                            }
                        );
                    }
                }
                else
                {
                    //Profiles not matched
                    console.error("ERROR: Profiles are not matched.");
                    result = "NotMatched";
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
    updatePartialProfile,
    matchProfiles,
    retreiveMatchedProfiles,
    reviewMatch,
    retrieveReviewsByUsername,
    retrieveContactInformation,
    retrieveDashboardStats
};