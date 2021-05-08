const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { limiter } = require('./middlewares/rate-limiter');
const errorHandler = require('./middlewares/error-handler');
const routes = require('./routes');
require('dotenv').config();

const { NODE_ENV } = process.env;
const { PORT, DB } = NODE_ENV === 'production' ? process.env : require('./constants/config');

const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: true,
  useUnifiedTopology: true,
});

const app = express();

app.set('trust proxy', 'loopback');
app.use(limiter);
app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {

});
