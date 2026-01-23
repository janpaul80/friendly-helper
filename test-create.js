async function createAgent() {
    const key = 'sk-GFVSGOjDIgbgdHPZ16t2Rz2EQ2lrXMCR25Og_errM2Cyb1lIYFrFZJh80XuFdobIRBmdLcLoa5iRwtD54b4x1g';

    try {
        // Attempt to create a simple temporary agent
        const res = await fetch('https://api.langdock.com/assistant/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                assistant: {
                    name: "HeftCoder Connectivity Test",
                    instructions: "You are a connectivity test bot. unexpected-response-777",
                    model: "gpt-4o-mini"
                },
                messages: [{ role: 'user', content: 'Say "connected"' }]
            })
        });

        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${text}`);

    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

createAgent();
