document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.share-profile-button');
    const bioText = document.querySelector('.biography-text');
    const nameText = document.querySelector('.profile-name-text');
    const usernameText = document.querySelector('.username-text');
    const profilePic = document.querySelector('.profile-pic');

    button.addEventListener('click', () => {
        getBiography();
    });

    function getBiography() {
        const username = document.querySelector('#usernameInput').value.trim();
        
        if (username) {
            // Atualize o URL do proxy local
            const proxyUrl = 'http://localhost:3000/api/';
            const apiUrl = 'v1/info?username_or_id_or_url=' + username;

            const settings = {
                "url": proxyUrl + apiUrl,
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
                    "x-rapidapi-key": ""
                }
            };

            $.ajax(settings).done(function(response) {
                if (response.data) {
                    nameText.textContent = response.data.full_name || 'N/A';
                    usernameText.textContent = response.data.username || 'N/A';
                    profilePic.src = response.data.profile_pic_url || 'default_profile_pic_url'; // Use uma URL padrão se necessário
                    bioText.textContent = response.data.biography || 'Biography not available';
                } else {
                    console.log("Biography not found or user not found.");
                }
            }).fail(function() {
                console.log("Failed to fetch biography. Make sure the username is correct.");
            });
            
        } else {
            console.log("Please enter a valid Instagram username.");
        }
    }
});
