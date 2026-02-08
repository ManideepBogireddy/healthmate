const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://manideepbogireddy_db_user:jODmIhC6MhRD7hAU@healthmate.itmurcv.mongodb.net/healthmate?appName=HealthMate&retryWrites=true&w=majority';
const client = new MongoClient(url);

async function main() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await client.connect();

        const db = client.db('healthmate');
        const rolesCollection = db.collection('roles');

        // Check if roles exist
        const count = await rolesCollection.countDocuments();
        if (count === 0) {
            console.log("Seeding roles...");
            const roles = [
                { name: 'ROLE_USER' },
                { name: 'ROLE_ADMIN' }
            ];
            await rolesCollection.insertMany(roles);
            console.log("Roles seeded successfully!");
        } else {
            console.log("Roles already exist. Skipping seed.");
        }

    } catch (error) {
        console.error('Error seeding roles:', error);
    } finally {
        await client.close();
    }
}

main();
