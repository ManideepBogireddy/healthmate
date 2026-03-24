const http = require('http');

async function testLike() {
    const ts = Date.now();
    const newUser = {
        username: 'TestUser' + ts,
        email: 'test' + ts + '@example.com',
        password: 'password123',
        age: 25, height: 180, weight: 75,
        activityLevel: 'medium', healthGoal: 'stay fit'
    };
    
    // 0. Register
    await new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost', port: 8080, path: '/api/auth/signup', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, res => { res.on('data', ()=>{}); res.on('end', resolve); });
        req.write(JSON.stringify(newUser));
        req.end();
    });

    const loginData = JSON.stringify({ username: newUser.username, password: newUser.password });
    
    // 1. Login
    const authRes = await new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost', port: 8080, path: '/api/auth/signin', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.write(loginData);
        req.end();
    });
    
    console.log("Logged in UID:", authRes.id);
    const token = authRes.token;

    // 2. Fetch Feed
    const feedRes = await new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost', port: 8080, path: '/api/blog/feed?page=0&size=10', method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });
    
    if(!feedRes.content || feedRes.content.length === 0) { console.log("No posts found"); return; }
    
    const post = feedRes.content[0];
    console.log(`Initial DB State: ID=${post.id}, Likes=${post.likes}, LikedBy=`, post.likedBy);
    
    // 3. Like Post
    const likeRes = await new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost', port: 8080, path: '/api/blog/post/' + post.id + '/like', method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Length': 0 }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });
    
    console.log(`After Like API DB State: Likes=${likeRes.likes}, LikedBy=`, likeRes.likedBy);
    
    // 4. Fetch Feed Again
    const feedRes2 = await new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost', port: 8080, path: '/api/blog/feed?page=0&size=10', method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });
    
    const post2 = feedRes2.content.find(p => p.id === post.id);
    console.log(`After Refresh DB State: Likes=${post2.likes}, LikedBy=`, post2.likedBy);
}

testLike().catch(console.error);
