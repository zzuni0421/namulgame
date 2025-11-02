import { saveDataAPI } from './save.js';
import { loadDataAPI } from './load.js';

export class AITrainer {
    constructor(storageKey = 'aiTrainingData') {
        this.storageKey = storageKey;
        this.data = [];
    }

    async init() {
        this.data = await loadDataAPI(this.storageKey);
    }

    async addEntry(text, category) {
        const entry = { text, category, timestamp: Date.now() };
        this.data.push(entry);
        await saveDataAPI(this.storageKey, this.data);
    }

    getData() {
        return this.data;
    }

    predict(category) {
        return this.data.filter(d => d.category === category).slice(-3);
    }
}
