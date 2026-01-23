async function test() {
    const key = 'sk-GFVSGOjDIgbgdHPZ16t2Rz2EQ2lrXMCR25Og_errM2Cyb1lIYFrFZJh80XuFdobIRBmdLcLoa5iRwtD54b4x1g';
    const id = 'bddc9537-f05f-47ce-ada1-c4573e2b9609';

    const variations = [
        { name: 'assistantId', body: { assistantId: id, messages: [{ role: 'user', content: 'hi' }] } },
        { name: 'assistant_id', body: { assistant_id: id, messages: [{ role: 'user', content: 'hi' }] } },
        { name: 'assistant (obj)', body: { assistant: { id: id }, messages: [{ role: 'user', content: 'hi' }] } },
    ];

    for (const v of variations) {
        console.log(`Testing variation: ${v.name}`);
        try {
            const res = await fetch('https://api.langdock.com/assistant/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify(v.body)
            });
            const data = await res.text();
            console.log(`Status: ${res.status}`);
            console.log(`Response: ${data}\n`);
        } catch (e) {
            console.log(`Error: ${e.message}\n`);
        }
    }
}

test();
