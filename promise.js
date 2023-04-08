const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// Define a route for /I/want/title
app.get('/I/want/title', async (req, res) => {
    const query = req.query;
    const addresses = Array.isArray(query.address) ? query.address : [query.address];

    try {
    
        let list_of_promises = [];
        addresses.map((address)=>{
            const promise =  new Promise(async (resolve, reject) => {
                try {
                    const response = await axios.get(address);
                    const $ = cheerio.load(response.data);
                    const title = $('title').text();
                    resolve(title);
                } catch (error) {
                    console.error('Error fetching title:', error.message);
                    resolve('No Response');
                }
            });
            list_of_promises.push(promise);
        })
        const result_of_titles = await Promise.all(list_of_promises);

        // Generate HTML response with titles
        let html = `<html><head></head><body><h1> Results </h1><ul>`;
        addresses.forEach((add,index)=>{
            html = html+  `<li>Address : ${add}  ---  Title : ${result_of_titles[index]}</li>`
        })
        html = html + `<ul></body>`
        res.status(200).send(html);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('*', (req, res) => {
    res.status(404).send('Not Found');
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});


