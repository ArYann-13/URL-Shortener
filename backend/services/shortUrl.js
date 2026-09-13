const Url = require('../models/url');
const { encode } = require('../utils/base62');
const { isValidUrl, isOwnDomain } = require('../utils/validateUrl');
const redisClient = require('../config/redisClient');
const {getNextSequence} = require('../utils/getNextSequence');



const CACHE_TTL = 60 * 60 * 24; // 24 hours


const createShortUrl = async (req, res) => {
    

    try {
        const { originalUrl, customAlias } = req.body;
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const domain = new URL(baseUrl).hostname;

        if (!originalUrl) {
            return res.status(400).json({ error: 'originalUrl is required' });
        }

        if (!isValidUrl(originalUrl)) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const parsed = new URL(originalUrl);


        if (isOwnDomain(originalUrl, domain)) {
            return res.status(400).json({ error: 'Cannot shorten your own short URL' });
        }

        // custom alias flow
        if (customAlias) {
            const existingAlias = await Url.findOne({ shortUrl: customAlias });
            if (existingAlias) {
                return res.status(409).json({ error: 'This alias is already taken' });
            }
            await Url.create({ shortUrl: customAlias, originalUrl });
            await redisClient.set(`code:${customAlias}`, originalUrl, 'EX', CACHE_TTL);
            return res.json({ shortUrl: `${baseUrl}/${customAlias}` });
        }

        // dedup check — Redis first
        const cachedCode = await redisClient.get(`url:${originalUrl}`);
        if (cachedCode) {
            return res.json({ shortUrl: `${baseUrl}/${cachedCode}` });
        }

        // dedup check — Mongo fallback
        const existing = await Url.findOne({ originalUrl });
        if (existing) {
            await redisClient.set(`url:${originalUrl}`, existing.shortUrl, 'EX', CACHE_TTL);
            return res.json({ shortUrl: `${baseUrl}/${existing.shortUrl}` });
        }

        // genuinely new
        const seq = await getNextSequence();
        const shortUrl = encode(seq);
        await Url.create({ shortUrl, originalUrl });

        await redisClient.set(`code:${shortUrl}`, originalUrl, 'EX', CACHE_TTL);
        await redisClient.set(`url:${originalUrl}`, shortUrl, 'EX', CACHE_TTL);

        res.json({ shortUrl: `${baseUrl}/${shortUrl}` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }





}

module.exports = { createShortUrl };