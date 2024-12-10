class NaiveBayes {
    constructor() {
        this.kata = {};
        this.totalKata = 0;
        this.totalDataSet = 0;
        this.filterKategori = {};
        this.filterKata = {};
        this.frekuensiKata = {};
        this.kategori = {};
    }

    tokenizer(text) {
        const rgxPunctuation = /[^(a-zA-ZA-Яa-я0-9_)+\s]/g;
        const sanitized = text.replace(rgxPunctuation, ' ');
        return sanitized.split(/\s+/);
    }

    initializeCategory(categoryName) {
        if (!this.kategori[categoryName]) {
            this.filterKategori[categoryName] = 0;
            this.filterKata[categoryName] = 0;
            this.frekuensiKata[categoryName] = {};
            this.kategori[categoryName] = true;
        }
    }

    async learn(text, category) {
        this.initializeCategory(category);
        // console.log(category)
        this.filterKategori[category]++;
        this.totalDataSet++;
        const tokens = await this.tokenizer(text);
        // console.log(tokens)
        const frequencyTable = this.frequencyTable(tokens);
        // console.log(frequencyTable)
        // console.log(Object.keys(frequencyTable))

        for (const token of Object.keys(frequencyTable)) {
            if (!this.kata[token]) {
                this.kata[token] = true;
                this.totalKata++;
            }

            const frequencyInText = frequencyTable[token];
            this.frekuensiKata[category][token] = (this.frekuensiKata[category][token] || 0) + frequencyInText;
            this.filterKata[category] += frequencyInText;
        }
    }

    async categorize(text) {
        let maxProbability = -Infinity;
        let chosenCategory = null;
        const tokens = await this.tokenizer(text);
        const frequencyTable = this.frequencyTable(tokens);

        for (const category of Object.keys(this.kategori)) {
            const categoryProbability = this.filterKategori[category] / this.totalDataSet;
            // console.log("Probabilitas Kategori : ", categoryProbability);
            let logProbability = Math.log(categoryProbability);
            // console.log("Probabilitas Log Kategori : ", logProbability);

            for (const token of Object.keys(frequencyTable)) {
                const frequencyInText = frequencyTable[token];
                const tokenProbability = this.tokenProbability(token, category);
                // console.log(frequencyInText * Math.log(tokenProbability))
                logProbability += frequencyInText * Math.log(tokenProbability);
            }

            if (logProbability > maxProbability) {
                maxProbability = logProbability;
                chosenCategory = category;
            }

            console.log(category, logProbability)
        }

        return chosenCategory;
    }

    // Hitung probabilitas token dalam kategori
    tokenProbability(token, category) {
        const frekuensiKata = this.frekuensiKata[category][token] || 0;
        const filterKata = this.filterKata[category];
        return (frekuensiKata + 1) / (filterKata + this.totalKata);
    }

    // Tabel frekuensi token dalam suatu data
    frequencyTable(tokens) {
        const frequencyTable = Object.create(null);
        for (const token of tokens) {
            frequencyTable[token] = (frequencyTable[token] || 0) + 1;
        }
        return frequencyTable;
    }

    // Konversi model ke format JSON
    toJson() {
        const state = {};
        for (const key of NaiveBayes.STATE_KEYS) {
            state[key] = this[key];
        }
        return JSON.stringify(state);
    }

    // Buat model dari string JSON
    static fromJson(jsonStr) {
        let parsed;
        try {
            parsed = JSON.parse(jsonStr);
        } catch (e) {
            throw new Error('NaiveBayes.fromJson membutuhkan string JSON yang valid.');
        }
        let classifier = new Object();
        for (const key of NaiveBayes.STATE_KEYS) {
            if (typeof parsed[key] === 'undefined' || parsed[key] === null) {
                throw new Error('NaiveBayes.fromJson: JSON string tidak memiliki properti yang diharapkan: `' + key + '`.');
            }
            classifier[key] = parsed[key];
        }
        return classifier;
    }
}

NaiveBayes.STATE_KEYS = [
    'kategori', 'filterKategori', 'totalDataSet', 'kata', 'totalKata',
    'filterKata', 'frekuensiKata'
];

module.exports = NaiveBayes;
