const Url= require('../models/url');

const getUrlStats = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });

        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.json({
            shortUrl: url.shortUrl,
            originalUrl: url.originalUrl,
            clicks: url.clicks,
            createdAt: url.createdAt,
        });
    } catch (error) {
        console.error('Error fetching URL stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getUrlStats };