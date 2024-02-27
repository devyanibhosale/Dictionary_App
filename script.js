function playSound(audioUrl) {
    const sound = document.getElementById("sound");

    if (audioUrl) {
        try {
            // Attempt to create a valid URL
            const url = new URL(audioUrl);
            sound.setAttribute("src", url.href);
            sound.load();

            sound.addEventListener('error', (event) => {
                console.error('Error during audio playback:', event);
                console.log('Error code:', event.target.error ? event.target.error.code : 'Unknown');
                alert('Error during audio playback. Please try again.');
            });

            sound.play()
                .then(() => {
                    console.log('Audio playback successful');
                })
                .catch((error) => {
                    console.error('Error playing audio:', error.message);
                    alert('Error playing audio. Please try again.');
                });
        } catch (error) {
            console.error('Invalid audio URL:', audioUrl);
            alert('Invalid audio URL. Please try again.');
        }
    }
}


const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;

    fetch(`${apiUrl}${inpWord}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Word not found: ${inpWord}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);

            if (data && data.length > 0) {
                const wordData = data[0];
                const phonetic = wordData.phonetics && wordData.phonetics[0] && wordData.phonetics[0].text || "Not available";
                const meanings = wordData.meanings || [];

                result.innerHTML = `
                    <div class="word">
                        <h3>${wordData.word}</h3>
                        <button onclick="playSound('${wordData.phonetics[0].audio}')">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                    <div class="details">
                        <p>${phonetic}</p>
                        ${meanings.map((meaning) => `
                            <p class="part-of-speech">${meaning.partOfSpeech}: ${meaning.definitions[0].definition}</p>
                            <p class="example">Example: ${meaning.definitions[0].example || "Not available"}</p>
                        `).join("")}
                    </div>
                `;

                // Clear previous audio playback
                sound.setAttribute("src", "");
            } else {
                // Handle case where no results are found
                result.innerHTML = "<p>Sorry, this is not a word</p>";
                // Clear previous audio playback
                sound.setAttribute("src", "");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error.message);
            console.error('Error creating URL from audio URL:', error.message);
            console.log('Invalid audio URL:', audioUrl);
            alert('Error creating URL from audio URL. Please try again.');
            // Handle specific error cases, e.g., word not found
            if (error.message.includes("Word not found")) {
                result.innerHTML = "<p>Sorry, this is not a word</p>";
            } else {
                result.innerHTML = `<p>Error: ${error.message}</p>`;
            }

        });
});
