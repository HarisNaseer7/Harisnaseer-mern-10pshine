const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Fix import.meta.env
process.env.VITE_API_URL = 'http://localhost:5000/api';