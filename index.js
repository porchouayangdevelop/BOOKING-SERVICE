// import app from './app';

const app = require('./app');

// set port
const port = process.env.PORT || 3000;


// start server
app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
});