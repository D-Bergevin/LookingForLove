const API_IP = 'http://localhost';
const API_PORT = 9000;

const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
};

const serverRoute = (route) => `${API_IP}:${API_PORT}/${route}`;

const profile = {
    async signup(user) {
        const res = await fetch(serverRoute('register'), {
            method: 'POST',
            headers,
            body: JSON.stringify(user)
        });
        const data = await res.json();
        if (!res.ok) throw new Error('Signup failed - Email & Username already taken');
        return data;
    },

    async login(user) {
        const res = await fetch(serverRoute('login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier: user.username,  // or email
                password: user.password
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const data = await res.json();
        // Optionally store token in localStorage/sessionStorage
        localStorage.setItem('authToken', data.token);

        return data.user;  // return the authenticated user info
    },

    async createProfile(user) {

        const body = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            skills: user.skills,
            interests: user.interests,
            location: user.location,
            employment: user.employment,
            privacyLevel: user.privacyLevel,
            displayedGender: user.displayedGender,
            datingPreference: user.datingPreference,
            password: user.password,
            username: user.username
        };

        const res = await fetch(serverRoute('register'), {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (!res.ok) throw new Error('Profile failed to create');
        return data;
    },

    async updateProfile(user) {
        const token = localStorage.getItem('authToken');
        const body = {
            update: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                skills: user.skills,
                interests: user.interests,
                location: user.location,
                employment: user.employment,
                privacyLevel: user.privacyLevel,
                displayedGender: user.displayedGender,
                datingPreference: user.datingPreference,
                password: user.password,
            }
        };

        const res = await fetch(serverRoute('update'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Profile failed to update');
        return data;
    },

    async getUser(username) {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');

        // Fetch user data with Authorization header
        const res = await fetch(serverRoute(`profiles/${username}`), {
            method: 'GET',
            headers: {
                ...headers, // your other headers if any
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'User not found');

        return data;
    }

};
const matches = {
    async getPotentialMatches(username) {
        const token = localStorage.getItem('authToken');
        const res = await fetch(serverRoute(`profilesbyinterest/${username}`), {
            method: 'GET',
            headers: {
                ...headers,
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch matches');
        return data;
    },
    async requestMatch(senderUsername, receiverUsername) {
        const token = localStorage.getItem("authToken");

        const res = await fetch(serverRoute(`match/${senderUsername}/${receiverUsername}`), {
            method: 'PUT',
            headers: {
                ...headers,
                'Authorization': `Bearer ${token}`
            }
        });

        let data = null
        try {
            data = await res.json();
        }
        catch {
            data = null;
        }
        if (!res.ok) {
            throw new Error(data?.error || 'Failed to send match request')
        }
        return data;
    },
    async getMatches(username) {
        const token = localStorage.getItem('authToken');

        const res = await fetch(serverRoute(`matchingprofiles/${username}`), {
            method: 'GET',
            headers: {
                ...headers,
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch current matches');
        return data;
    },
    async postReview(senderUsername, receiverUsername, review) {
        const res = await fetch(serverRoute(`review/${senderUsername}/${receiverUsername}`), {
            method: 'PUT',
            headers: {
                ...headers,
            },
            body: JSON.stringify({ review: review })
        });
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to submit review');
        return data;
    },
    async getReviews(senderUsername) {
        const token = localStorage.getItem('authToken');
        const res = await fetch(serverRoute(`review/${senderUsername}`), {
            method: 'GET',
            headers: {
                ...headers,
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return data;
    }
}

export { profile, matches };