// Quick test to check if the game canvas renders correctly
import http from 'http';

// Check if dev server is running
http.get('http://localhost:3000/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Server status:', res.statusCode);
        console.log('HTML length:', data.length);
        console.log('Has game-container:', data.includes('game-container'));
        console.log('Has main.js:', data.includes('main.js'));
    });
});
