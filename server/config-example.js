

const API_KEY = 'somesecretapikeyblablba';

const PORT = 8888;

// random secret for json webtoken
const SECRET = 'abcdefgh';

const USER = {
  name: 'admin',
  pwhash: '$2b$10$wbm.5m27QVoQKvVh1Lar4uabKplVvoZFGjKuKYFCQfqilkZ5ij9oi'
};
// create with:
// const bcrypt = require('bcrypt');
// bcrypt.hashSync('beboop', 10);

// database setup
const DBUSER = 'pipolog-admin';
const DBPASSWORD = 'example123';
const DBURL = 'mongodb://localhost:27018';
const DBNAME = 'pipolog';

const STATICDIR = '../client/public';

const PRODUCTION = true;

export { API_KEY, PORT, SECRET, USER, DBUSER, DBPASSWORD, DBURL,
  DBNAME, STATICDIR, PRODUCTION };
