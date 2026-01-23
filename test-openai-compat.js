async function test() {
    const key = 'sk-GFVSGOjDIgbgdHPZ16t2Rz2EQ2lrXMCR25Og_errM2Cyb1lIYFrFZJh80XuFdobIRBmdLcLoa5iRwtD54b4x1g';
    const id = 'bddc9537-f05f-47ce-ada1-c4573e2b9609';

    console.log('Testing variation: OpenAI-compatible endpoint with assistantId as model');
    try {
        const res = await fetch('https://api.langdock.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
            body: JSON.stringify({
                model: id,
                messages: [{ role: 'user', content: 'hello' }]
            })
        });
        const data = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${data}`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

test();
