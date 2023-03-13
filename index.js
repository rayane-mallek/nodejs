const express = require('express');
const app = express();
const passport = require('passport')
const cors = require('cors');
const urlEncodedParser = express.urlencoded({ extended: false })

const { login, register } = require('./controllers/auth');
const { createOrUpdate, list, product, deleteProduct } = require('./controllers/product');
const { passportJWT } = require('./middlewares/auth');

/* Middlewares */
passport.use(passportJWT);
app.use(passport.initialize());
app.use(cors({origin: '*'}));

/* Routes */
app.post('/register', urlEncodedParser, register);
app.post('/login', urlEncodedParser, login);
app.post('/:action/:id?', urlEncodedParser, passport.authenticate('jwt', { session: false }), createOrUpdate);

app.get('/products', list);
app.get('/product/:id', product);

app.delete('/delete/:id', passport.authenticate('jwt', { session: false }), deleteProduct);

/* Server */
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});