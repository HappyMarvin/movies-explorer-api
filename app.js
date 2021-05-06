const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { limiter } = require('./middlewares/rate-limiter');
const errorHandler = require('./middlewares/error-handler');
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const { validateSignUpBody, validateSignInBody } = require('./middlewares/validations');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');
const { createUser, login } = require('./controllers/users');


mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: true,
  useUnifiedTopology: true,
});

const { PORT = 3001 } = process.env;
const app = express();


app.set('trust proxy', 'loopback');
app.use(limiter);
app.use(cors());

app.use(bodyParser.json());
app.use(requestLogger);


app.post('/signup', validateSignUpBody, createUser);
app.post('/signin', validateSignInBody, login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('/', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {

});