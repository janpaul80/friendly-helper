async function testLangdock() {
    const key = 'sk-GFVSGOjDIgbgdHPZ16t2Rz2EQ2lrXMCR25Og_errM2Cyb1lIYFrFZJh80XuFdobIRBmdLcLoa5iRwtD54b4x1g';
    const assistantId = 'bddc9537-f05f-47ce-ada1-c4573e2b9609'; // HeftCoder Pro

    try {
        const response = await fetch('https://api.langdock.com/assistant/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                assistantId: assistantId,
                messages: [{ role: 'user', content: 'hello' }]
            })
        });

        const body = await response.text();
        console.log('STATUS:', response.status);
        console.log('RESPONSE:', body);
    } catch (error) {
        console.log('ERROR:', error.message);
    }
}

testLangdock();
