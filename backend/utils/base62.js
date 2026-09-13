const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = CHARS.length;

function encode(num) {
  if (num === 0) return CHARS[0];
  let result = '';
  while (num > 0) {
    result = CHARS[num % BASE] + result;
    num = Math.floor(num / BASE);
  }
  return result;
}

function decode(str) {
  let num = 0;
  for (const char of str) {
    const index = CHARS.indexOf(char);
    if (index === -1) throw new Error(`Invalid character in short code: ${char}`);
    num = num * BASE + index;
  }
  return num;
}

module.exports = { encode, decode };