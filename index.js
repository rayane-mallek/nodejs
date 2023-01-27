const express = require('express');
const app = express();
const axios = require('axios')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const secret = "klahfaik?FLMKAHZGOPIAZHGpfklkdmgùzgjnùm942";
const urlEncodedParser = express.urlencoded({ extended: false })

/* Middlewares */
app.use(cors());

app.use(passport.initialize());

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    jsonWebTokenOptions: {
        ignoreExpiration: false,
    },
    secretOrKey: secret,
    algorithms: ['HS256'],
}, async (jwtPayload, next) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://nodejs-d27e.restdb.io/rest/utilisateurs',
            headers: { 'x-apikey': '3f0a468d13b5689cc8d8d0c7f0b13d870407d' },
        };

        const response = await axios(options);
        const users = response.data;
        const user = users.find(user => user.email === jwtPayload.email);

        if (user) {
            return next(null, user);
        } else {
            return next(null, false);
        }

    } catch (error) {
        return next(error, false);
    }
}));

app.post('/register', urlEncodedParser, async (req, res) => {
    try {
        let options = {
            method: 'GET',
            url: 'https://nodejs-d27e.restdb.io/rest/utilisateurs',
            headers: { 'x-apikey': '3f0a468d13b5689cc8d8d0c7f0b13d870407d' },
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
                    'x-apikey': '3f0a468d13b5689cc8d8d0c7f0b13d870407d',
                    'content-type': 'application/json'
                },
                data: { email: req.body.email, password: req.body.password }
            };
    
            await axios(options);
            res.send('Register completed!');
        }

    } catch (error) {
        res.send('Register failed.');
    }
});

app.post('/login', urlEncodedParser, async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://nodejs-d27e.restdb.io/rest/utilisateurs',
            headers: { 'x-apikey': '3f0a468d13b5689cc8d8d0c7f0b13d870407d' },
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
});

app.get('/index', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('Index');
});

app.post('/:action/:id?', urlEncodedParser, passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.params.action === 'update') {
        try {
            const options = {
                method: 'PUT',
                url: `https://nodejs-d27e.restdb.io/rest/products/${req.body.id}`,
                headers: {
                    'cache-control': 'no-cache',
                    'x-apikey': '3f0a468d13b5689cc8d8d0c7f0b13d870407d',
                    'content-type': 'application/json'
                },
                data: { name: req.body.name, price: req.body.price }
            };
            
            await axios(options);
            res.send('Product updated!');
        } catch (error) {
            res.send('Error when updating the product.');
        }
    } else if (req.params.action === 'create') {
        const options = {
            method: 'POST',
            url: 'https://nodejs-d27e.restdb.io/rest/products',
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': '3f0a468d13b5689cc8d8d0c7f0b13d870407d',
                'content-type': 'application/json'
            },
            data: { name: req.body.name, price: req.body.price }
        };

        await axios(options);
        res.send('Product created!');
    } else {
        res.send('This action does not exist.');
    }
});

app.get('/products', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://nodejs-d27e.restdb.io/rest/products',
        headers: { 'x-apikey': '3f0a468d13b5689cc8d8d0c7f0b13d870407d' },
    };
    const response = await axios(options);

    res.json(response.data);
});

app.get('/product/:id', async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: `https://nodejs-d27e.restdb.io/rest/products/${req.params.id}`,
            headers: { 'x-apikey': '3f0a468d13b5689cc8d8d0c7f0b13d870407d' },
        };
        const response = await axios(options);
    
        res.json(response.data);
    } catch (error) {
        res.send('This product does not exist.')
    }
});

app.delete('/delete/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        options = {
            method: 'DELETE',
            url: `https://nodejs-d27e.restdb.io/rest/products/${req.params.id}`,
            headers: { 'x-apikey': '3f0a468d13b5689cc8d8d0c7f0b13d870407d' },
        };
        response = await axios(options);
    
        res.send('Product deleted.')
    } catch (error) {
        res.send('Product does not exist.')
    }
});

/* Server */
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});