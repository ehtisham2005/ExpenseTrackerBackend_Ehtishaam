const admin = require('firebase-admin');

const serviceAccount = require('../../serviceAccountKey.json');

const initializeFirebaseAdmin = () => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
};

initializeFirebaseAdmin();

const auth = admin.auth();

module.exports = { auth };
