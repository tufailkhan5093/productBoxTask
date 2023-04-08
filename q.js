const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const Q = require('q');

const app = express();
const port = 3000;

// Route handler for GET /I/want/title
app.get('/I/want/title', async (req, res) => {
    // Get addresses from query string
    const addresses = req.query.address;

    // Check if addresses are provided in query string
    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
        return res.status(400).send('Please provide array of addresses');
        
    }

    try {
        let QPromises_for_title = [];
        addresses.map((address)=>{
                QPromises_for_title.push(getTitle(address));
        })
       
        // settled all promises that can be resolved or reject 
        const titleResults = await Q.allSettled(QPromises_for_title);
     
        let html = '<html><head></head><body><h1> Addresses </h1><ul>';
        var title = "";
        titleResults.forEach((result, index) => {
            if(result.state === "fulfilled")
            {
                 title = result.value;
            }
            else
            {
                 title = "No Response";
            }
           
            html += `<li>${addresses[index]} - "${title}"</li>`;
        });
        html += '</ul></body></html>';

        res.status(200).send(html);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});


function getTitle(address) {
    const deferred = Q.defer();
    request(address)
    
        .then(html => {
            const $ = cheerio.load(html);
            const title = $('title').text();
            deferred.resolve(title);
        })
        .catch(err => {
            deferred.resolve(null);
        });

    return deferred.promise;
}

app.get('*', (req, res) => {
    res.status(404).send('Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
