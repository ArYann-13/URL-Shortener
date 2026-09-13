const express = require('express');
const router = express.Router();
const { createShortUrl } = require('../services/shortUrl');
const { redirectToOriginalUrl } = require('../services/redirect');
const { getUrlStats } = require('../services/stats');
const { shortenLimiter } = require('../middleware/rateLimiter');


//validating the url and creating short url
router.post('/shortUrl', shortenLimiter, createShortUrl);


//redirecting to original url
router.get('/:shortUrl', redirectToOriginalUrl);

//stats route
router.get('/stats/:shortUrl', getUrlStats);

module.exports = router;