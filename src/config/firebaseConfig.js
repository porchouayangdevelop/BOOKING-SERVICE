var admin = require("firebase-admin");
require('dotenv').config();

const {
    getDatabase
} = require('firebase-admin/database');

var accountService = require('../../accountService.json');

admin.initializeApp({
    credential: admin.credential.cert(process.env.FIREBASE_DATABASE_URL || accountService),
    databaseURL: "https://booking-service-422cc-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const realtimeDB = getDatabase();

module.exports = {
    admin,
    realtimeDB
}