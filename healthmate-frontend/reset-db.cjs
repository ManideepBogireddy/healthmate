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

        if (process.argv[2]) {
            const email = process.argv[2];
            const deleteResult = await collection.deleteMany({ email: email });

            // We also want to delete the plan associated with this user, but we need the user ID first.
            // Since we are deleting by email, and plans are linked by userId, we technically 
            // leave orphaned plans if we don't look up the user first. 
            // However, this is just a quick test reset. 
            // Deleting the user is enough to trigger the "New User" flow.

            console.log(`Deleted ${deleteResult.deletedCount} user(s) with email: ${email}`);
        } else {
            console.log("Please provide an email address as an argument.");
            console.log("Usage: node reset-db.cjs <email>");
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

main();
