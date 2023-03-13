const axios = require('axios')
require('dotenv').config();

module.exports = {
    createOrUpdate: async (req, res) => {
        if (req.params.action === 'update') {
            try {
                const options = {
                    method: 'PUT',
                    url: `https://${process.env.DB_NAME}.restdb.io/rest/products/${req.body.id}`,
                    headers: {
                        'cache-control': 'no-cache',
                        'x-apikey': process.env.API_KEY,
                        'content-type': 'application/json'
                    },
                    data: { name: req.body.name, resistance: req.body.resistance, hardness: req.body.hardness, image: req.body.image  }
                };
                
                await axios(options);
                res.send('Product updated!');
            } catch (error) {
                res.send('Error when updating the product.');
            }
        } else if (req.params.action === 'create') {
            const options = {
                method: 'POST',
                url: 'https://'+process.env.DB_NAME+'.restdb.io/rest/products',
                headers: {
                    'cache-control': 'no-cache',
                    'x-apikey': process.env.API_KEY,
                    'content-type': 'application/json'
                },
                data: { name: req.body.name, resistance: req.body.resistance, hardness: req.body.hardness }
            };
    
            await axios(options);
            res.send('Product created!');
        } else {
            res.send('This action does not exist.');
        }
    },
    list: async (req, res) => {
        try {
            const options = {
                method: 'GET',
                url: 'https://'+process.env.DB_NAME+'.restdb.io/rest/products',
                headers: { 'x-apikey': process.env.API_KEY },
            };
            const response = await axios(options);
        
            res.json(response.data);
        } catch (error) {
            res.send('Unable to get the products.')
        }
    },
    product: async (req, res) => {
        try {
            const options = {
                method: 'GET',
                url: `https://${process.env.DB_NAME}.restdb.io/rest/products/${req.params.id}`,
                headers: { 'x-apikey': process.env.API_KEY },
            };
            const response = await axios(options);
        
            res.json(response.data);
        } catch (error) {
            res.send('This product does not exist.')
        }
    },
    deleteProduct: async (req, res) => {
        try {
            options = {
                method: 'DELETE',
                url: `https://${process.env.DB_NAME}.restdb.io/rest/products/${req.params.id}`,
                headers: { 'x-apikey': process.env.API_KEY },
            };
            response = await axios(options);
        
            res.send('Product deleted.')
        } catch (error) {
            res.send('Product does not exist.')
        }
    },
}
