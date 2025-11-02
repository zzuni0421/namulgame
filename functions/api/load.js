// load.js
export async function loadDataAPI(key) {
    try {
        const res = await fetch(`/api/load?key=${encodeURIComponent(key)}`);
        const json = await res.json();
        return json.data || [];
    } catch (e) {
        console.error('Load API failed', e);
        return [];
    }
}
