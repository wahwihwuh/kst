import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/food', routes);

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});

export default app;
