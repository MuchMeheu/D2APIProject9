require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_KEY = process.env.API_KEY;
const REDIRECT_URI = process.env.REDIRECT_URI;
const BUNGIE_OAUTH_URL = 'https://www.bungie.net/en/OAuth/Authorize';
const BUNGIE_TOKEN_URL = 'https://www.bungie.net/platform/app/oauth/token/';

app.use(express.static('public'));

app.get('/auth', (req, res) => {
    const authUrl = `${BUNGIE_OAUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        const response = await axios.post(BUNGIE_TOKEN_URL, new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = response.data.access_token;
        res.redirect(`/?accessToken=${accessToken}`);
    } catch (error) {
        console.error('Error during token exchange:', error);
        res.status(500).send('Authentication failed');
    }
});

app.get('/user/membership-types', async (req, res) => {
    const accessToken = req.query.accessToken;
    if (!accessToken) {
        return res.status(400).send('Access token is required');
    }

    try {
        const membershipResponse = await axios.get('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
            headers: {
                'X-API-Key': API_KEY,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        res.json(membershipResponse.data.Response.destinyMemberships);
    } catch (error) {
        console.error('Error fetching membership types:', error);
        res.status(500).send('Error fetching membership types');
    }
});

// Endpoint to fetch user's characters
app.get('/user/characters', async (req, res) => {
    const membershipId = req.query.membershipId;
    const accessToken = req.query.accessToken;

    if (!membershipId || !accessToken) {
        return res.status(400).send('Membership ID and Access token are required');
    }

    try {
        const charactersResponse = await axios.get(`https://www.bungie.net/Platform/Destiny2/1/Profile/${membershipId}/Characters/`, {
            headers: {
                'X-API-Key': API_KEY,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        res.json(charactersResponse.data.Response.characters.data);
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).send('Error fetching characters');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
