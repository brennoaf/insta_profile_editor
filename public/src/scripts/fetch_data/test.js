export class ScrapedProfileData {
    constructor(pageElements) {
        this.pageElements = pageElements;
        this.initialError = false;
        this.fetchProfileData();
        this.fetchPostData();
    }

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

            // Atualize a URL para o backend hospedado no Vercel
            const profilePage = await this.scrapeProfilePage(`/api/proxy-instagram?username=${username}`);
            this.setProfileData(profilePage);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    async scrapeProfilePage(url) {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const getMetaContent = (property) => doc.querySelector(`meta[property="${property}"]`)?.getAttribute('content');
        const getNameAndUsername = getMetaContent('og:title')?.split(') ')[0].split(' (@') || ['', ''];

        return {
            username: getNameAndUsername[1],
            profilePicUrl: getMetaContent('og:image'),
            name: getNameAndUsername[0],
            biography: getMetaContent('og:description')?.split(': ')[1] || '',
            followers: doc.querySelector('meta[name="description"]')?.content.split(', ')[0].split(' ')[0] || 'N/A',
            following: doc.querySelector('meta[name="description"]')?.content.split(', ')[1].split(' ')[0] || 'N/A',
            postQuantity: doc.querySelector('meta[name="description"]')?.content.split(', ')[2].split(' ')[0] || 'N/A',
        };
    }

    setProfileData(data) {
        const { profilePage } = this.pageElements;

        profilePage.profilePic.style.backgroundImage = `url(${data.profilePicUrl})`;
        profilePage.userUsername.textContent = data.username;
        profilePage.userName.textContent = data.name;
        profilePage.userBiography.innerHTML = data.biography.replace(/\n/g, '<br>');
        profilePage.postQuantity.textContent = data.postQuantity;
        profilePage.followersQuantity.textContent = data.followers;
        profilePage.followingQuantity.textContent = data.following;
    }

    async fetchPostData() {
        try {
            const username = this.getUsernameFromURL();
            if (!username) {
                this.initialError = true;
                throw new Error('Conteúdo de publicações não encontrado.');
            }

            // Atualize a URL para o backend hospedado no Vercel
            const postPage = await this.scrapePostPage(`/api/proxy-instagram?username=${username}`);
            this.setPostData(postPage);
        } catch (error) {
            if (!this.initialError) {
                window.alert(`${error}\nVerifique se o perfil é público ou tente novamente mais tarde.`);
            }
        }
    }

    async scrapePostPage(url) {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const getImages = () => {
            const images = Array.from(doc.querySelectorAll('article img')).map(img => img.src);
            return images.slice(0, 12);  // Limita a 12 imagens
        };

        const getHighlights = () => {
            const highlightElements = Array.from(doc.querySelectorAll('ul._acay > li._acaz'));
            return highlightElements
                .filter(el => !el.style.transition)
                .map(el => ({
                    image: el.querySelector('img')?.src || '',
                    title: el.querySelector('span')?.innerText || '',
                }));
        };

        return {
            posts: getImages(),
            highlightData: getHighlights(),
        };
    }

    setPostData(data) {
        const { profilePage } = this.pageElements;

        data.posts.forEach(image => this.createPublication(image));
        data.highlightData.forEach(highlight => this.createHighlight(highlight.title, highlight.image));

        if (data.error) {
            window.alert('Failed to find highlight or publications, please check if profile is public or try again later.');
        }
    }

    createPublication(image) {
        const { publication } = this.pageElements.profilePage;

        const newPb = document.createElement('span');
        newPb.classList.add('pub-container');

        const pbItem = document.createElement('div');
        pbItem.classList.add('pub-item');

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

    createHighlight(title, image) {
        const { highlights } = this.pageElements.popup;
        const { highlightsContainer } = highlights.creationPopup;
        const { itemsContainer } = this.pageElements.profilePage.highlight;
        const highlightsQuant = highlightsContainer.childElementCount;

        const newHg = this.createHighlightElement('mockup-item', 'div', title, image, highlightsQuant);
        const newItemHg = this.createHighlightElement('item', 'li', title, image, highlightsQuant);

        highlightsContainer.appendChild(newHg);
        itemsContainer.appendChild(newItemHg);

        this.resetListener(highlights.creationPopup.highlightsContainer);
    }

    createHighlightElement(hgClass, itemType, title, image, highlightsQuant) {
        const newHg = document.createElement(itemType);
        newHg.classList.add(hgClass, `${highlightsQuant + 1}`);

        const hgPicCont = document.createElement('div');
        hgPicCont.classList.add('highlight-pic-content');

        const hgPic = document.createElement('div');
        hgPic.classList.add('highlight-pic');
        hgPic.style.backgroundImage = `url(${image})`;

        const hgTextCont = document.createElement('div');
        hgTextCont.classList.add('highlight-text-content');

        const hgText = document.createElement('span');
        hgText.classList.add('highlight-text');
        hgText.textContent = title;

        hgPicCont.appendChild(hgPic);
        hgTextCont.appendChild(hgText);
        newHg.appendChild(hgPicCont);
        newHg.appendChild(hgTextCont);

        return newHg;
    }

    resetListener(hgContainer) {
        const childs = hgContainer.childNodes;
        childs.forEach(child => {
            let childClone = child.cloneNode(true);
            hgContainer.replaceChild(childClone, child);

            childClone.addEventListener('click', () => {
                childClone.classList.toggle('hidden');
                childClone.querySelector('svg').classList.toggle('off');
            });
        });
    }
}
