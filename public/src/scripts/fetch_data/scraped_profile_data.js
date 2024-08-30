//THIS IS A SCRAPER AS INSTABLE ALTERNATIVE
//PLEASE CONSIDEER USE GET_PROFILE_DATA.JS IF YOU CAN USE BASIC set API

export class ScrapedProfileData {
    constructor(pageElements) {
        this.pageElements = pageElements;
        this.fetchProfileData(); 
        this.fetchPostData();

    }

    initialError = false;

    getUsernameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('username');
    }

    async fetchProfileData() {
        try {
            const username = this.getUsernameFromURL();
            
            if (!username) {
                throw new Error('Usuário não encontrado.');
                
            }

            const scrapedProfileResponse = await fetch(`http://localhost:3001/scraped-profile?username=${username}`);
            const scrapedProfileData = await scrapedProfileResponse.json();


            this.setProfileData({ scrapedProfile: scrapedProfileData });
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    setProfileData(data) {
        const { profilePage } = this.pageElements;

        profilePage.profilePic.style.backgroundImage = `url(${data.scrapedProfile.profilePicUrl})`;

        profilePage.userUsername.textContent = data.scrapedProfile.username;
        profilePage.userName.textContent = data.scrapedProfile.name;
        profilePage.userBiography.innerHTML = data.scrapedProfile.biography.replace(/\n/g, '<br>');
        profilePage.postQuantity.textContent = data.scrapedProfile.postQuantity;
        profilePage.followersQuantity.textContent = data.scrapedProfile.followers;
        profilePage.followingQuantity.textContent = data.scrapedProfile.following;

    }

    async fetchPostData() {
        try{
            const username = this.getUsernameFromURL();
            
            if (!username) {
                this.initialError = true;
                throw new Error('Conteúdo de publicações não encontrado.');
            }
        
        const scrapedPostResponse = await fetch(`http://localhost:3001/scraped-publications?username=${username}`);
        const scrapedPostData = await scrapedPostResponse.json();

        this.setPostData({ scrapedPost: scrapedPostData });

        }catch(error){
            if(!this.initialError){
                window.alert(`${error}\nVerifique se o perfil é público ou tente novamente mais tarde.`);
            }
        }

    }

    setPostData(data) {
        const { profilePage } = this.pageElements;

        data.scrapedPost.posts.forEach(pub => {
            this.createPublication(pub);
        });

        data.scrapedPost.highlightData.forEach(highlight => {
            this.createHighlight(highlight.title, highlight.image)
        })

        
        
        if(data.scrapedPost.error){
            window.alert(`Failed to find highlight or publications, 
                please check if profile is public or try again later.`)
        }
    }


    createPublication(image){
        const { publication } = this.pageElements.profilePage

        //Criando o container da publicação
        const newPb =  document.createElement('span');
        newPb.classList.add('pub-container');

        //Criando item
        const pbItem = document.createElement('div');
        pbItem.classList.add('pub-item');

        //Criando imagem do highlight
        const pbPic = document.createElement('div');
        pbPic.classList.add('pub-picture');


        pbPic.style.backgroundImage = `url(${image})`;

        
        
        const pbAttachment = document.createElement('span');
        pbAttachment.classList.add('pub-attachment');


        pbItem.appendChild(pbAttachment);
        pbItem.appendChild(pbPic);
        newPb.appendChild(pbItem);
        publication.publicationsItems.appendChild(newPb);
        
    }

    createHighlight(title, image){
        const { highlights } = this.pageElements.popup;

        const { highlightsContainer } = highlights.creationPopup;
        const { itemsContainer } = this.pageElements.profilePage.highlight;
        const highlightsQuant = highlightsContainer.childElementCount;

        resetListener(highlights.creationPopup.highlightsContainer);

        function settingHighlight(hgClass, itemType){
            //Criando o container do highlight
            const newHg =  document.createElement(itemType);
            newHg.classList.add(hgClass);
            newHg.classList.add(`${highlightsQuant + 1}`)

            //Criando container de imagem
            const hgPicCont = document.createElement('div');
            hgPicCont.classList.add('highlight-pic-content');

            //Criando imagem do highlight
            const hgPic = document.createElement('div');
            hgPic.classList.add('highlight-pic');


            hgPic.style.backgroundImage = `url(${image})`;

            
            //Criando container de texto
            const hgTextCont = document.createElement('div');
            hgTextCont.classList.add('highlight-text-content');

            //Criando span de texto
            const hgText = document.createElement('span');
            hgText.classList.add('highlight-text');


            if(hgClass === 'mockup-item'){
                //criando container de esconder highlight
                const hgHideCont = document.createElement('div');
                hgHideCont.classList.add('hide-highlight');

                const eyeSpan = document.createElement('span');
                const svgEye = `
                    <svg width="24" height="24" viewBox="-3 -3 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="currentColor"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C17.5915 3 22.2898 6.82432 23.6219 12C22.2898 17.1757 17.5915 21 12 21C6.40848 21 1.71018 17.1757 0.378052 12C1.71018 6.82432 6.40848 3 12 3ZM12 19C7.52443 19 3.73132 16.0581 2.45723 12C3.73132 7.94186 7.52443 5 12 5C16.4756 5 20.2687 7.94186 21.5428 12C20.2687 16.0581 16.4756 19 12 19Z" fill="currentColor"/>
                    </svg>
                `;

                const hiddenSpan = document.createElement('span');
                const svgHidden = `
                    <svg class='off' width="24" height="24" viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 11H22V13H2V11Z" fill="currentColor"/>
                    </svg>
                `;


                eyeSpan.innerHTML = svgEye;
                hiddenSpan.innerHTML = svgHidden;

                hgPicCont.appendChild(hgHideCont);
                hgHideCont.appendChild(eyeSpan);
                hgHideCont.appendChild(hiddenSpan);

            }

            hgText.textContent = title;

            hgPicCont.appendChild(hgPic);
            hgTextCont.appendChild(hgText);
            newHg.appendChild(hgPicCont);
            newHg.appendChild(hgTextCont);

            return newHg;
            
        }

        let newHg  = settingHighlight('mockup-item', 'div');
        let newItemHg = settingHighlight('item', 'li');

        //Adicionando filhos aos respectivos pais
        highlightsContainer.appendChild(newHg);
        itemsContainer.appendChild(newItemHg);

        resetListener(highlights.creationPopup.highlightsContainer);

        function resetListener(hgContainer){
            const childs = hgContainer.childNodes
            
            childs.forEach(child =>{
                let childClone = child.cloneNode(true);
                hgContainer.replaceChild(childClone, child);

                childClone.addEventListener('click', () =>{
                    childClone.classList.toggle('hidden')
                    childClone.childNodes[0].childNodes[0].childNodes[0].childNodes[1].classList.toggle('off');
                    childClone.childNodes[0].childNodes[0].childNodes[1].childNodes[1].classList.toggle('off');
                    
                });
            });
        }


    }
}
