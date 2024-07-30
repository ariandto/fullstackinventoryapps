const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./config/Database.js');
const router = require('./routes/index.js');

dotenv.config();
const app = express();

// Konfigurasi CORS
const corsOptions = {
  origin: ['https://www.tpklg.lifeforcode.net','https://tpklg.lifeforcode.net','tpklg.lifeforcode.net', 'http://localhost:3000','https://www.cmmstock.lifeforcode.net','www.cmmstock.lifeforcode.net','https://cmmstock.lifeforcode.net','cmmstock.lifeforcode.net','http://cmmstock.lifeforcode.net'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware untuk mengatur header CORS jika diperlukan tambahan
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(router);

// Sinkronisasi database
db.sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Failed to sync database:', error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
