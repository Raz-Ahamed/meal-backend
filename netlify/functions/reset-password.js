const admin = require('firebase-admin');

// ফায়ারবেস ইনিশিয়ালাইজেশন
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error("Firebase Init Error:", error);
    }
}

exports.handler = async (event, context) => {
    // CORS সেটিংস (যাতে আপনার ওয়েবসাইট থেকে রিকোয়েস্ট ব্লক না হয়)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: 'Success' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);
        const uid = data.uid;

        if (!uid) {
            return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'UID is required' }) };
        }

        // ফায়ারবেস অ্যাডমিন SDK দিয়ে পাসওয়ার্ড 123456 করে দেওয়া হলো
        await admin.auth().updateUser(uid, { password: '123456' });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে!' })
        };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: error.message }) };
    }
};
