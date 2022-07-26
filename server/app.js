import 'dotenv/config';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

export default app