import express from "express";
import cors from "cors";
import { retrieveProfiles, retrieveProfile, addNewProfile } from './data.js';

// The Express application object
const app = express();

// Configure Express APIs Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Handle CORS headers

app.use((req, _res, next) => {
    const timestamp = new Date(Date.now());
    console.warn(`[${timestamp.toDateString()} ${timestamp.toTimeString()}] / ${timestamp.toISOString()}`);
    console.log(req.method, req.hostname, req.path);
    console.log('headers:', req.headers);
    console.log('query:', req.query);
    console.log('body:', req.body);
    next();
});

// Endpoint Definitions
app.get('/about', (_request, response) => {
    response.sendFile("package.json", { root: '.' });
});

app.get('/profiles', async (_request, response) => {
    let profiles = await retrieveProfiles();
    response.json(profiles);
});

app.get('/profiles/:username', async (request,response) => {
    const profileUsername = request.params.username;

    try {
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
            if (result = "Duplicate")
            {
                response.sendStatus(400);
            }
            else
            {
                response.json(result);
            }
    }
    catch (e)
    {
        console.error(e);
        response.sendStatus(500);
    }
});

const startServer = (port) => {
    app.listen(port, console.warn(`Listening on port ${port}`));
};

console.log('Completed API setup.');

export {
    startServer
}