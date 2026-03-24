const http = require('http');

const loginOptions = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/signin',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

const req = http.request(loginOptions, res => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        try {
            const authData = JSON.parse(data);
            console.log("Auth User ID:", authData.id, authData.username);
            
            const feedOptions = {
                hostname: 'localhost',
                port: 8080,
                path: '/api/blog/feed?page=0&size=10',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + authData.token }
            };
            
            const feedReq = http.request(feedOptions, res => {
                let feedDataStr = '';
                res.on('data', chunk => { feedDataStr += chunk; });
                res.on('end', () => {
                    const feedData = JSON.parse(feedDataStr);
                    if(feedData.content && feedData.content.length > 0) {
                        console.log("First post null likes:", feedData.content[0].likedBy);
                        console.log("First post likes counting:", feedData.content[0].likes);
                    } else {
                        console.log("No posts.");
                    }
                });
            });
            feedReq.end();
            
        } catch(e) { console.error("Error", e.message); }
    });
});

req.write(JSON.stringify({ username: 'Manideep', password: 'password123' }));
req.end();
