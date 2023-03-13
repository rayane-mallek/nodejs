const axios = require('axios')
const jwt = require('jsonwebtoken');
const secret = "klahfaik?FLMKAHZGOPIAZHGpfklkdmgùzgjnùm942";
require('dotenv').config();

module.exports = {
    register: async (req, res) => {
        try {
            let options = {
                method: 'GET',
                url: 'https://nodejs-d27e.restdb.io/rest/utilisateurs',
                headers: { 'x-apikey': process.env.API_KEY },
            };
            const response = await axios(options);
            const users = response.data;
            let user = users.find(user => user.email === req.body.email);

            if (user) {
                res.send('Email already used.')
            } else {
                options = {
                    method: 'POST',
                    url: 'https://nodejs-d27e.restdb.io/rest/utilisateurs',
                    headers: {
                        'cache-control': 'no-cache',
                        'x-apikey': process.env.API_KEY,
                        'content-type': 'application/json'
                    },
                    data: { email: req.body.email, password: req.body.password }
                };
                await axios(options);
                res.json({ message: "User registered" });
            }
        } catch (error) {
            res.send('Register failed.');
        }
    },
    login: async (req, res) => {
        try {
            const options = {
                method: 'GET',
                url: 'https://'+process.env.DB_NAME+'.restdb.io/rest/utilisateurs',
                headers: { 'x-apikey': process.env.API_KEY },
            };
            const response = await axios(options);
            const users = response.data;
            let user = users.find(user => user.email === req.body.email);
    
            if (!user || user.password !== req.body.password) {
                res.send('Wrong credentials.');
            } else {
                let token = jwt.sign({ email: user.email }, secret);
                res.json({jwt: token });
            }
    
        } catch (error) {
            throw new Error(error);
        }
    },
};