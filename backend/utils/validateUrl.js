
//
function isValidUrl(str) {
  try {
    const url = new URL(str);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

//Blocking loops (shortening your own short URLs)
function isOwnDomain(originalUrl, yourDomain) {
  try {
    const parsed = new URL(originalUrl);
    return parsed.hostname === yourDomain;
  } catch {
    return false;
  }
}

module.exports = { isValidUrl, isOwnDomain };