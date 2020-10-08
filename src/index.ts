import * as express from 'express';
import { Request, Response } from "express";
import * as mongoose from 'mongoose';
import { router as ordering } from './ordering';
import { config } from 'dotenv';
config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } ,(err) => {
    if(err) console.log(err);
    else console.log('connected to db');
    
})

const app = express()

app.use('/new', ordering);

app.get('/', (req: Request, res: Response) => {
    res.send('ok')
});

app.listen(2021, () => {
    console.log(`Server started on 2021`);
});