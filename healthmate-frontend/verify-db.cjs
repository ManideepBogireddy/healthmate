const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://manideepbogireddy_db_user:jODmIhC6MhRD7hAU@healthmate.itmurcv.mongodb.net/healthmate?appName=HealthMate&retryWrites=true&w=majority';
const client = new MongoClient(url);

async function main() {
    try {
        console.log("Attempting to connect to MongoDB Atlas...");
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db('healthmate');
        const adminDb = db.admin();
        const serverStatus = await adminDb.serverStatus();
        console.log("Server version: " + serverStatus.version);

        console.log("Connection verified!");
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await client.close();
    }
}

main();
