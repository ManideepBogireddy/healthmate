const http = require('http');

async function testTemp() {
    const tempRes = await new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost', port: 8080, path: '/api/test/temp/posts', method: 'GET'
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch(e) { console.error("Temp raw:", data); reject(e); }
            });
        });
        req.end();
    });
    
    if(!tempRes || tempRes.length === 0) {
        console.log("No posts found in temp API.");
        return;
    }
    const post = tempRes[0];
    console.log(`Temp API DB State: ID=${post.id}, Likes=${post.likes}, LikedBy=`, post.likedBy);
}

testTemp().catch(e => console.error("Caught error:", e.message));
