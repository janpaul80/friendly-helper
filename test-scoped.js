async function test() {
    const key = 'sk-GFVSGOjDIgbgdHPZ16t2Rz2EQ2lrXMCR25Og_errM2Cyb1lIYFrFZJh80XuFdobIRBmdLcLoa5iRwtD54b4x1g';

    console.log('Testing variation: NO assistantId (Agent-scoped key test)');
    try {
        const res = await fetch('https://api.langdock.com/assistant/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'hi' }]
            })
        });
        const data = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${data}\n`);
    } catch (e) {
        console.log(`Error: ${e.message}\n`);
    }
}

test();
