const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'healthmate';

async function main() {
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection('users');

        // CHANGE THIS TO YOUR EMAIL IF DIFFERENT
        const emailToDelete = ""; // Pass as argument or hardcode if needed. Input below.

        if (process.argv[2]) {
            const email = process.argv[2];
            const deleteResult = await collection.deleteMany({ email: email });
            const planResult = await db.collection('health_plans').deleteMany({ userId: { $exists: true } }); // Optional: clear plans too? Maybe just for this user if we could link them.

            // Actually, plans are linked by userId string. If we delete user, the plan becomes orphaned.
            // Let's just delete the user for now.

            console.log(`Deleted ${deleteResult.deletedCount} user(s) with email: ${email}`);
        } else {
            console.log("Please provide an email address as an argument.");
            console.log("Usage: node reset-db.js <email>");
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

main();
