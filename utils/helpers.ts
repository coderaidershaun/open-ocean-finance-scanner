const { createHash } = require('crypto');

export const sortString = function(text: string) {
  return text.split('').sort().join('');
};

export function hash(text: string) {
  return createHash('sha256').update(text).digest('hex');
}
