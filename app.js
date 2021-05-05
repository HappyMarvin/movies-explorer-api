const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');
const auth = require('./middlewares/auth');
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

app.use(cors());

app.use(bodyParser.json());

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});


app.use(errorHandler);
app.listen(PORT, () => {

});