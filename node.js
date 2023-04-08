const express = require('express');
const axios = require("axios");
const cheerio = require('cheerio');
const app = express();
const port = 3000;
app.get('/I/want/title', async (req, res) => {
    const titles = [];
    const addresses = req.query.address;
    if (Array.isArray(addresses)) {
        for (const url of addresses) {
            try {
                const response = await axios.get(url);
                if (response.status === 200) {
                    const $ = cheerio.load(response.data);
                    const title = $('title').text();
                    titles.push(`<li>${url} is Valid uri and its title is ${title}</li>`);
                }
                else if (response.status === 404) {
                    titles.push(`<li>${url} is Not Valid uri</li>`);
                }
                else {
                    titles.push(`<li>${url} is Not Valid uri</li>`);
                }
            } catch (error) {
                titles.push(`<li>${url} is Not Valid uri</li>`);
            }
        }
    }
    else {
        url = addresses;
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const title = $('title').text();
                titles.push(`<li>${url} is Valid uri and its title is ${title}</li>`);
            }
            else if (response.status === 404) {
                titles.push(`<li>${url} is Not Valid uri</li>`);
            }
            else {
                titles.push(`<li>${url} is Not Valid uri</li>`);
            }
        } catch (error) {
            titles.push(`<li>${url} is Not Valid uri</li>`);
        }
    }
    const html = `<html>
                  <head></head>
                  <body>
                    <h1>Addresses:</h1>
                    <ul>
                      ${titles.join('')}
                    </ul>
                  </body>
                </html>`;
    res.send(html);
});

app.get('*', (req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
