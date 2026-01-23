async function test() {
    const key = 'sk-GFVSGOjDIgbgdHPZ16t2Rz2EQ2lrXMCR25Og_errM2Cyb1lIYFrFZJh80XuFdobIRBmdLcLoa5iRwtD54b4x1g';
    const id = 'bddc9537-f05f-47ce-ada1-c4573e2b9609';
    const url = 'https://api.langdock.com/assistant/v1/chat/completions';

    const cases = [
        { name: 'assistantId (camel)', body: { assistantId: id, messages: [{ role: 'user', content: 'hi' }] } },
        { name: 'assistant_id (snake)', body: { assistant_id: id, messages: [{ role: 'user', content: 'hi' }] } },
        { name: 'assistant (object with id)', body: { assistant: { id: id }, messages: [{ role: 'user', content: 'hi' }] } },
        { name: 'assistant (object with assistantId)', body: { assistant: { assistantId: id }, messages: [{ role: 'user', content: 'hi' }] } },
        { name: 'assistant (string)', body: { assistant: id, messages: [{ role: 'user', content: 'hi' }] } },
    ];

    for (const c of cases) {
        console.log(`-- Testing ${c.name} --`);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify(c.body)
            });
            const txt = await res.text();
            console.log(`Status: ${res.status}`);
            console.log(`Body: ${txt}\n`);
        } catch (e) {
            console.log(`Error: ${e.message}\n`);
        }
    }
}

test();
