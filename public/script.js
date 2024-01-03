window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');

    if (accessToken) {
        fetchCharacters(accessToken);
    }
};

function fetchCharacters(accessToken) {
    fetch(`/user/characters?accessToken=${accessToken}`)
        .then(response => response.json())
        .then(characters => {
            const charactersDiv = document.getElementById('characters');
            Object.keys(characters).forEach(characterId => {
                const character = characters[characterId];
                const button = document.createElement('button');
                button.textContent = `Character: ${character.classType}`;
                button.onclick = () => displayCharacter(character);
                charactersDiv.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error fetching characters:', error);
        });
}

function displayCharacter(character) {
    const characterInfoDiv = document.getElementById('character-info');
    characterInfoDiv.innerHTML = `Class: ${character.classType}<br>Light: ${character.light}<br>Race: ${character.raceType}`;
}
