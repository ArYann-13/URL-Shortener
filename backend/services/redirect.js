const Url = require('../models/url');
const redisClient = require('../config/redisClient');


const CACHE_TTL = 60 * 60 * 24; // 24 hours
const redirectToOriginalUrl = async (req, res) => {
    try {
        // const { urlId } = req.params;                    // ✅ matches route /:urlId
        // const url = await Url.findOne({ shortUrl: urlId }); // ✅ query DB by shortUrl field
        // if (!url) {
        //     return res.status(404).json({ error: 'URL not found' });
        // }
        // res.redirect(url.originalUrl);

        const { shortUrl } = req.params;

        // cache hit
        const cachedUrl = await redisClient.get(`code:${shortUrl}`);
        if (cachedUrl) {
            trackClick(shortUrl, req); // fire and forget, don't block redirect
            return res.redirect(cachedUrl);
        }
        // cache miss — check Mongo
        const url = await Url.findOne({ shortUrl });
        if (!url) {
            return res.status(404).send('Short URL not found');
        }

        if (url.expiresAt && url.expiresAt < new Date()) {
            return res.status(410).send('This link has expired');
        }
        await redisClient.set(`code:${shortUrl}`, url.originalUrl, 'EX', CACHE_TTL);

        trackClick(shortUrl, req);
        res.redirect(url.originalUrl);



    } catch (error) {
        console.error('Error redirecting to original URL:', error);
        res.status(500).json({ error: 'Internal server error' });

    }


}

async function trackClick(shortUrl, req) {
  try {
    await Url.updateOne({ shortUrl }, { $inc: { clicks: 1 } });
  } catch (err) {
    console.error('Click tracking failed:', err);
  }
}

module.exports = { redirectToOriginalUrl, trackClick };