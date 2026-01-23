const fs = require('fs');

async function test() {
    const key = 'sk-GFVSGOjDIgbgdHPZ16t2Rz2EQ2lrXMCR25Og_errM2Cyb1lIYFrFZJh80XuFdobIRBmdLcLoa5iRwtD54b4x1g';
    const id = 'bddc9537-f05f-47ce-ada1-c4573e2b9609';

    console.log('Testing key with assistantId payload...');

    try {
        const res = await fetch('https://api.langdock.com/assistant/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                assistantId: id,
                messages: [{ role: 'user', content: 'hello checking connection' }]
            })
        });

        const text = await res.text();
        const status = res.status;

        const output = {
            status: status,
            headers: Object.fromEntries(res.headers.entries()),
            body: text // Keep as text first to see exact raw output
        };

        fs.writeFileSync('debug_output.json', JSON.stringify(output, null, 2));
        console.log('Finished. Check debug_output.json');

    } catch (e) {
        fs.writeFileSync('debug_output.json', JSON.stringify({ error: e.message }));
        console.log('Error occurred.');
    }
}

test();
