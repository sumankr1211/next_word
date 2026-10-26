// Simple In-Browser N-Gram (Markov Chain) Language Model

// document.addEventListener('DOMContentLoaded', () => {
//     const fileInput = document.getElementById('file-input');
//     const fileNameEl = document.getElementById('file-name');
//     const fileInfo = document.getElementById('file-info');
//     const dropZone = document.getElementById('drop-zone');
//     const modelStatus = document.getElementById('model-status');
//     const userInput = document.getElementById('user-input');

//     fileInput.addEventListener('change', async (e) => {
//         if (e.target.files.length) {
//             const file = e.target.files[0];
//             await uploadFileToBackend(file);
//         }
//     });

//     async function uploadFileToBackend(file) {
//         // Create a FormData object to hold the raw file
//         const formData = new FormData();
//         formData.append('text_file', file); // 'text_file' is the key Python will look for

//         try {
//             modelStatus.textContent = 'Uploading...';
            
//             // Send file to Python backend
//             const response = await fetch('/upload', {
//                 method: 'POST',
//                 body: formData
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 // Update UI upon successful backend receipt
//                 fileNameEl.textContent = file.name;
//                 dropZone.style.display = 'none';
//                 fileInfo.style.display = 'flex';
//                 modelStatus.textContent = 'Backend Connected';
//                 modelStatus.className = 'status-badge trained';
//                 userInput.disabled = false;
                
//                 console.log("Backend response:", result);
//             } else {
//                 alert('Error from backend: ' + result.error);
//                 modelStatus.textContent = 'Upload Failed';
//             }
//         } catch (error) {
//             console.error('Network error:', error);
//             alert('Failed to connect to backend.');
//         }
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const fileNameEl = document.getElementById('file-name');
    const fileInfo = document.getElementById('file-info');
    const dropZone = document.getElementById('drop-zone');
    const modelStatus = document.getElementById('model-status');
    const userInput = document.getElementById('user-input');

    // Listen for file selections (supports multiple files)
    fileInput.addEventListener('change', async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            // Loop through each selected file and upload it
            for (let i = 0; i < files.length; i++) {
                await uploadFileToBackend(files[i]);
            }
            // Clear input value so the same files can be selected again if needed
            fileInput.value = '';
        }
    });

    async function uploadFileToBackend(file) {
        const formData = new FormData();
        formData.append('text_file', file);

        try {
            modelStatus.textContent = `Uploading ${file.name}...`;
            
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                // Update UI to show success, but KEEP the drop zone visible for more files
                fileNameEl.textContent = `Uploaded: ${file.name}`;
                fileInfo.style.display = 'flex';
                dropZone.style.display = 'block'; // Keep drop zone visible!
                modelStatus.textContent = 'Backend Connected';
                modelStatus.className = 'status-badge trained';
                userInput.disabled = false;
                
                console.log("Backend response for", file.name, ":", result);
            } else {
                alert(`Error uploading ${file.name}: ${result.error}`);
                modelStatus.textContent = 'Upload Failed';
            }
        } catch (error) {
            console.error('Network error:', error);
            alert(`Failed to connect to backend for ${file.name}.`);
            modelStatus.textContent = 'Upload Failed';
        }
    }
});


// ********************************************************************************
// ********************************************************************************

// Grab the elements from your interface
const userInput = document.getElementById('user-input');
const predictionsContainer = document.querySelector('.predictions-container') || createPredictionsContainer();

let debounceTimer = null;

// Listen for typing events
userInput.addEventListener('input', () => {
    const text = userInput.value;

    // Clear any existing timer so we don't spam requests on every single keystroke
    clearTimeout(debounceTimer);

    if (!text.trim()) {
        predictionsContainer.innerHTML = '<span class="placeholder-text">Upload a text file and start typing to see predictions...</span>';
        return;
    }

    // Debounce the API call by 300ms for smooth performance
    debounceTimer = setTimeout(async () => {
    try {
        // 1. Clean and split the text into words
        const trimmedText = text.trim();
        const words = trimmedText ? trimmedText.split(/\s+/) : [];

        // 2. Determine current and previous words
        let currentWord = "";
        let previousWord = " "; // Default to space if first word

        // Check if user is currently typing a new word (ends with a space) or is mid-word
        const endsWithSpace = text.endsWith(" ");

        if (words.length > 0) {
            if (endsWithSpace) {
                // If text ends with a space, the last word is complete, 
                // and the *new* current word is effectively empty.
                previousWord = words[words.length - 1];
                currentWord = "";
            } else {
                // Mid-typing a word
                currentWord = words[words.length - 1];
                if (words.length > 1) {
                    previousWord = words[words.length - 2];
                }
            }
        }

        // 3. Send both to the backend
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                current_word: currentWord, 
                previous_word: previousWord 
            })
        });

        const result = await response.json();

        if (response.ok) {
            renderPredictions(result); // Expecting an dict 
        } else {
            console.error('Prediction failed');
        }
    } catch (error) {
        console.error('Network error during prediction:', error);
    }
}, 300);
});

// Helper function to display the predicted words as clickable pills/buttons
// Helper function to display the predicted words as clickable pills/buttons
function renderPredictions(predictions) {
    // Use the global variable directly instead of getElementById
    const container = predictionsContainer; 
    
    // Check if the object is empty
    const entries = Object.entries(predictions || {});
    if (entries.length === 0) {
        container.innerHTML = '<span class="placeholder-text">No predictions found</span>';
        return;
    }

    // Convert object entries [word, count] into HTML elements
    container.innerHTML = entries.map(([word, count]) => `
        <button class="prediction-chip">
            <span class="word">${word}</span>
            <span class="count">(${count})</span>
        </button>
    `).join('');
}

// Helper to create the container dynamically if it doesn't exist in HTML yet
function createPredictionsContainer() {
    const section = document.querySelector('.inference-section') || userInput.parentElement;
    const container = document.createElement('div');
    container.className = 'predictions-container';
    section.appendChild(container);
    return container;
}