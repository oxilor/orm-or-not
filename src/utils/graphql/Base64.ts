const escape = (str: string): string =>
  str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

const unescape = (str: string): string =>
  (str + '==='.slice((str.length + 3) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/');

const encode = (str: string): string => {
  const base64 = Buffer.from(str).toString('base64');
  return escape(base64);
};

const decode = (str: string): string => {
  const unescaped = unescape(str);
  return Buffer.from(unescaped, 'base64').toString();
};

const Base64 = {
  encode,
  decode,
};

export default Base64;
