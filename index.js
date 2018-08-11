const express = require('express');
const bodyParser = require('body-parser');
const verification = require('./controllers/verification');
const messageWebhook = require('./controllers/messageWebhook');

const APP_PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', verification);

app.post('/', messageWebhook);

app.listen(APP_PORT, () => console.log(`Webhook server is listening, port ${APP_PORT}`));
