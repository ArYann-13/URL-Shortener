const redisClient = require('../config/redisClient');

async function getNextSequence() {
  return await redisClient.incr('url_count');
}

async function initCounter() {
  const exists = await redisClient.exists('url_count');
  if (!exists) {
    await redisClient.set('url_count', process.env.COUNTER_START || 100000000);
  }
}

module.exports = { getNextSequence, initCounter };