// Simple In-Browser N-Gram (Markov Chain) Language Model
class NextWordPredictor {
    constructor() {
        this.model = {}; // Map of "word1 word2" -> { "word3": count, total: N }
        this.totalWords = 0;
        this.isTrained = false;
    }

    train(text) {
        // Clean and tokenize text into words, preserving lowercase for consistency
        const tokens = text.toLowerCase()
            .replace(/[^\w\s\']/g, ' ')
            .split(/\s+/)
            .filter(token => token.length > 0);

        this.totalWords = tokens.length;
        this.model = {};

        // Build Bigram / Trigram model
        for (let i = 0; i < tokens.length - 1; i++) {
            const w1 = tokens[i];
            const w2 = tokens[i + 1];
            
            // Bigram tracking
            if (!this.model[w1]) {
                this.model[w1] = { _total: 0 };
            }
            this.model[w1]._total++;
            this.model[w1][w2] = (this.model[w1][w2] || 0) + 1;

            // Trigram tracking (context: "w1 w2")
            if (i < tokens.length - 2) {
                const w3 = tokens[i + 2];
                const context2 = `${w1} ${w2}`;
                if (!this.model[context2]) {
                    this.model[context2] = { _total: 0 };
                }
                this.model[context2]._total++;
                this.model[context2][w3] = (this.model[context2][w3] || 0) + 1;
            }
        }

        this.isTrained = true;
        return {
            totalWords: this.totalWords,
            uniqueNgrams: Object.keys(this.model).length
        };
    }

    predict(inputString, topK = 5) {
        if (!this.isTrained) return [];

        const cleanInput = inputString.toLowerCase()
            .replace(/[^\w\s\']/g, ' ')
            .trim()
            .split(/\s+/);

        if (cleanInput.length === 0 || (cleanInput.length === 1 && cleanInput[0] === '')) {
            return [];
        }

        let candidates = null;

        // Try Trigram lookup first (last 2 words)
        if (cleanInput.length >= 2) {
            const w1 = cleanInput[cleanInput.length - 2];
            const w2 = cleanInput[cleanInput.length - 1];
            const context2 = `${w1} ${w2}`;
            if (this.model[context2]) {
                candidates = this.model[context2];
            }
        }

        // Fallback to Bigram lookup (last 1 word) if no trigram match
        if (!candidates && cleanInput.length >= 1) {
            const w1 = cleanInput[cleanInput.length - 1];
            if (this.model[w1]) {
                candidates = this.model[w1];
            }
        }

        if (!candidates) return [];

        // Sort candidates by frequency
        const total = candidates._total;
        const predictions = Object.keys(candidates)
            .filter(word => word !== '_total')
            .map(word => ({
                word: word,
                probability: candidates[word] / total
            }))
            .sort((a, b) => b.probability - a.probability)
            .slice(0, topK);

        return predictions;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const fileNameEl = document.getElementById('file-name');
    const fileInfo = document.getElementById('file-info');
    const dropZone = document.getElementById('drop-zone');
    const modelStatus = document.getElementById('model-status');
    const userInput = document.getElementById('user-input');

    fileInput.addEventListener('change', async (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            await uploadFileToBackend(file);
        }
    });

    async function uploadFileToBackend(file) {
        // Create a FormData object to hold the raw file
        const formData = new FormData();
        formData.append('text_file', file); // 'text_file' is the key Python will look for

        try {
            modelStatus.textContent = 'Uploading...';
            
            // Send file to Python backend
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                // Update UI upon successful backend receipt
                fileNameEl.textContent = file.name;
                dropZone.style.display = 'none';
                fileInfo.style.display = 'flex';
                modelStatus.textContent = 'Backend Connected';
                modelStatus.className = 'status-badge trained';
                userInput.disabled = false;
                
                console.log("Backend response:", result);
            } else {
                alert('Error from backend: ' + result.error);
                modelStatus.textContent = 'Upload Failed';
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Failed to connect to backend.');
        }
    }
});