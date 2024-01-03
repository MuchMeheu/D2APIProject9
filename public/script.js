window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');

    if (accessToken) {
        fetchMembershipTypes(accessToken);
    }
};

function fetchMembershipTypes(accessToken) {
    fetch(`/user/membership-types?accessToken=${accessToken}`)
        .then(response => response.json())
        .then(memberships => {
            const userInfoDiv = document.getElementById('user-info');
            memberships.forEach(membership => {
                const button = document.createElement('button');
                button.textContent = `Load ${membership.displayName}'s Data`;
                button.onclick = () => fetchAndDisplayCharacters(membership.membershipId, accessToken);
                userInfoDiv.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error fetching membership types:', error);
        });
}

function fetchAndDisplayCharacters(membershipId, accessToken) {
    fetch(`/user/characters?membershipId=${membershipId}&accessToken=${accessToken}`)
        .then(response => response.json())
        .then(characters => {
            // Process and display character data
            const charactersDiv = document.createElement('div');
            characters.forEach(character => {
                const characterDiv = document.createElement('div');
                characterDiv.textContent = `Character: ${character.characterName} - Class: ${character.class}`;
                charactersDiv.appendChild(characterDiv);
            });
            document.getElementById('user-info').appendChild(charactersDiv);
        })
        .catch(error => {
            console.error('Error fetching character data:', error);
        });
}

