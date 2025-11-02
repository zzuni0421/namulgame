// save.js
export async function saveDataAPI(key, data) {
    try {
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, data })
        });
        return await res.json();
    } catch (e) {
        console.error('Save API failed', e);
    }
}
