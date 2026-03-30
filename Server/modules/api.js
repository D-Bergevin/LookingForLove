import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import env from "./env.js";
import {
    retrieveProfiles,
    retrieveProfile,
    addNewProfile,
    authenticateProfile,
    updatePartialProfile,
    retrieveProfilesByInterest
} from './data.js';

// The Express application object
const app = express();

// Configure Express APIs Middleware
app.use(express.json());
app.use(cors());

app.use((req, _res, next) => {
    const timestamp = new Date(Date.now());
    console.warn(`[${timestamp.toDateString()} ${timestamp.toTimeString()}] / ${timestamp.toISOString()}`);
    console.log(req.method, req.hostname, req.path);
    console.log('headers:', req.headers);
    console.log('query:', req.query);
    console.log('body:', req.body);
    next();
});
const authenticateToken = (request, response, next) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return response.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        request.user = decoded;
        next();
    }
    catch (e) {
        console.error("TOKEN ERROR:", e);
        return response.sendStatus(403);
    }
};
// Endpoint Definitions
app.get('/about', (_request, response) => {
    response.sendFile("package.json", { root: '.' });
});

app.get('/profiles', authenticateToken, async (_request, response) => {
    let profiles = await retrieveProfiles();
    response.json(profiles);
});

app.get('/profilesbyinterest/:username', authenticateToken, async (_request, response) => {
    let profiles = await retrieveProfilesByInterest(_request.params.username);
    response.json(profiles);
});

app.get('/profiles/:username', authenticateToken, async (request, response) => {
    try {
        const profileUsername = request.params.username;

        let profile = await retrieveProfile(profileUsername);

        if (profile) {
            response.json(profile);
        } else {
            response.status(404).json({ error: "Profile not found" });
        }
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});

app.post('/register', async (request, response) => {
    const newProfile = request.body;

    try {
        let result = await addNewProfile(newProfile);

        if (result === "Duplicate") {
            response.sendStatus(400);
        }
        else {
            response.json(result);
        }
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});

app.post('/login', async (request, response) => {
    const { identifier, password } = request.body;

    if (!identifier || !password) {
        return response.status(400).json({ error: "Missing identifier or password" });
    }

    try {
        const user = await authenticateProfile(identifier, password);

        if (!user) {
            return response.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                username: user.username,
                email: user.email
            },
            env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        response.json({
            message: "Login successful",
            token,
            user
        });
    }
    catch (e) {
        console.error("LOGIN ERROR:", e);
        response.sendStatus(500);
    }
});

app.put('/update', authenticateToken, async (request, response) => {
    const update = request.body.update;

    if (!update) {
        return response.status(400).send("Missing update");
    }

    if (update.username) {
        return response.status(400).json({ error: "Cannot update username" });
    }

    const criteria = { username: request.user.username };

    try {
        const result = await updatePartialProfile(criteria, update);

        if (result === "NotFound") {
            response.sendStatus(404);
        }
        else if (result === "Duplicate") {
            response.sendStatus(409);
        }
        else if (result === "Username") {
            response.sendStatus(400);
        }
        else {
            response.json(result);
        }
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});

const startServer = (port) => {
    app.listen(port, () => console.warn(`Listening on port ${port}`));
};

console.log('Completed API setup.');

export {
    startServer
}