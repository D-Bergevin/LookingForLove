**Project Summary**

This program is a web-app matchmaking service advertised specifically to IT professionals. The user can sign up + log in, where they can see potential
matches given based on their entered interests. Users can also edit their profile information, which updates the information for other users who can see their profile.
The user can also set a specific privacy level, where they can choose how much information can be shared with potential matches.

**Project Makeup**

This project uses Javascript and React on the Client-side, and Javascript with Express on the Server-side.

**Current Status**

In the current build, the Client and the Server sides do not communicate with eachother, this is the current progress on both sides.

**Server**

Currently, the Server is able to respond to requests with all information necessary, with required authorization, including:

- Retrieving all profiles
- Retrieving all profiles that include a matching interest
- Retrieving one profile by username with privacy level
- Adding a new profile
- Updating an existing profile

**Client**

In the current build, the Client has a UI, but no functionality with the server-side has been implemented.

**Required to Function**

There is a .env file not included in the repository that holds sensitive information, including the hash string and database credentials.
When cloning from the repository and attempting to test the build, the user will need to run "npm install" in the command line in both the
"/Server" and "/Client" directories, as that will install modules included in the package.json.
