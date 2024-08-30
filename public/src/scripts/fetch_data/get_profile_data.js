//THIS IS A SCRAPER + BASIC DISPLAY API PROFILE DATA 
//
//BUT I DONT HAVE A BUSINESS AND META REQUESTS
//THIS CODE WORKS BUT I CANT USE TO GET USER END DATA THATS DOESNT HAVE AN APP ROLE
//
export class FetchProfileData {
    constructor(pageElements) {
        this.pageElements = pageElements;
        this.fetchData(); 
    }

    getAccessTokenFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('access_token');
    }

    async fetchData() {
        try {
            const accessToken = this.getAccessTokenFromURL();
            
            if (!accessToken) {
                throw new Error('Access token não encontrado.');
            }

            const profileResponse = await fetch(`http://localhost:3000/profile?access_token=${accessToken}`);
            const profileData = await profileResponse.json();

            const mediaResponse = await fetch(`http://localhost:3000/media?access_token=${accessToken}`);
            const mediaData = await mediaResponse.json();

            const username = profileData.username; // Assumindo que o username está disponível no perfil
            const scrapedInfoResponse = await fetch(`http://localhost:3000/scraped-info?username=${username}`);
            const scrapedInfoData = await scrapedInfoResponse.json();

            this.displayData({ profile: profileData, media: mediaData, scrapedInfo: scrapedInfoData });
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    displayData(data) {
        const { profilePage } = this.pageElements;

        profilePage.profilePic.style.backgroundImage = `url(${data.scrapedInfo.profilePicUrl})`;

        profilePage.userUsername.textContent = data.profile.username;
        profilePage.userName.textContent = data.scrapedInfo.name;
        profilePage.userBiography.textContent = data.scrapedInfo.biography;
        profilePage.postQuantity.textContent = data.scrapedInfo.postQuantity;
        profilePage.followersQuantity.textContent = data.scrapedInfo.followers;
        profilePage.followingQuantity.textContent = data.scrapedInfo.following;
    }
}
