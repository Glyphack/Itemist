const host = process.env.REDIS_URL;
const port = parseInt(process.env.REDIS_PORT);
const password = process.env.REDIS_PASS || '';

export { host, port, password };
