export class ProfileFunctions{
    constructor(pageElements){
        this.pageElements = pageElements;

        this.publicationPopupManager();
        this.publicationCreationManager(this.lastOriginalHgName, this.lastChangedHgName);
        this.publicationSetting();

        
    }

    async loadImage(file){
        return new Promise((resolve, reject) =>{
            const reader = new FileReader();
            const { publication } = this.pageElements.profilePage;

            reader.onload = (event) =>{
                var insertedImage = event.target.result;
                publication.publicationImage.style.backgroundImage = `url('${event.target.result}')`;
                
                resolve(insertedImage)

            };
            reader.onerror = reject;
            reader.readAsDataURL(file);

        })
    }

    resetPbCreation(content, saveBtn, pbImage, pbImgInput, pbAttachment, attButton){
        content.classList.add('hidden');

        saveBtn.disabled = true;
        saveBtn.classList.add('disabled');
        pbImage.style.backgroundImage = '';
        pbAttachment.style.backgroundImage = '';
        attButton.textContent = 'None';

        //TENTANDO LIMPAR INPUT NOS BROWSERS
        pbImgInput.value = null;
        pbImgInput.type = 'text';
        pbImgInput.type = 'file';

    }

    publicationSetting(){
        const { publication } = this.pageElements.profilePage;

        let lastSelect = null
        window.addEventListener('click', (event) =>{
            if(event.target.matches('.pub-item')){
                const x = event.clientX;
                const y =  event.clientY;

                publication.pubMenu.style.left = `${x}px`;
                publication.pubMenu.style.top = `${y}px`;
                publication.pubMenu.style.display = 'block';
                publication.blurBg.style.display = 'inherit';

                lastSelect = event.target;
                lastSelect.style.zIndex = '100';

            }else{
                publication.pubMenu.style.display = 'none';
                publication.blurBg.style.display = 'none';

                console.log(lastSelect);
                if(lastSelect){
                    console.log(lastSelect)
                    lastSelect.style.zIndex = ''
                    lastSelect = null
                }
                
            }

        })

    }   

    publicationPopupManager(){
        const { publication } = this.pageElements.profilePage;
        const { dropdown } = this.pageElements.popup.editProfile;
        const dropdownOptions = dropdown.content.querySelectorAll('a');



        dropdownOptions.forEach(option => {
            option.addEventListener('click', () => {
                if(publication.attButton.textContent === 'None'){
                    publication.attachmentImage.style.backgroundImage = '';

                }else if(publication.attButton.textContent === 'Reels'){
                    publication.attachmentImage.style.backgroundImage = "url('src/assets/icons/reels_icon_focus.png')";
                    console.log(publication.attachmentImage.style.backgroundImage)

                }else if(publication.attButton.textContent === 'Carousel'){
                    publication.attachmentImage.style.backgroundImage = "url('src/assets/icons/carousel_icon.png')";
                    console.log(publication.attachmentImage.style.backgroundImage)
                }
            });
        });


        window.addEventListener('click', (event) =>{
            if(event.target.matches('.creation-close')){
                this.resetPbCreation(
                    publication.content,

                    publication.saveCreationBtn,
                    publication.publicationImage,
                    publication.buttonHitbox,
                    publication.attachmentImage,
                    publication.attButton,
                )

            }

        })
    }

    publicationCreationManager(){
        const { publication } = this.pageElements.profilePage

        publication.buttonHitbox.addEventListener('input', async () => {
                try {
                    const image = publication.buttonHitbox.files[0];
                    await this.loadImage(image);

                    publication.content.classList.remove('hidden');
            
                    publication.saveCreationBtn.disabled = false;
                    publication.saveCreationBtn.classList.remove('disabled');
                } catch (error) {
                    console.error('Erro:', error);

                }
        });


        publication.saveCreationBtn.addEventListener('click', async () =>{
            try{

                const { publicationsItems } = publication;
                const publicationsQuant = publicationsItems.childElementCount;
        
                function createPublication(){
                    //Criando o container da publicação
                    const newPb =  document.createElement('span');
                    newPb.classList.add('pub-container');

                    //Criando item
                    const pbItem = document.createElement('div');
                    pbItem.classList.add('pub-item');

                    //Criando imagem do highlight
                    const pbPic = document.createElement('div');
                    pbPic.classList.add('pub-picture');


                    pbPic.style.backgroundImage = publication.publicationImage.style.backgroundImage;

                    
                    //Criando span de ícone attachment
                    const pbAttachment = document.createElement('span');
                    pbAttachment.classList.add('pub-attachment');

                    pbAttachment.style.backgroundImage = publication.attachmentImage.style.backgroundImage;


                    pbItem.appendChild(pbAttachment);
                    pbItem.appendChild(pbPic);
                    newPb.appendChild(pbItem);
                    publicationsItems.appendChild(newPb);
                    
                }

                createPublication();
        
                //resetListener(highlights.creationPopup.highlightsContainer);




                //Resetando popup de criação
                this.resetPbCreation(
                    publication.content,

                    publication.saveCreationBtn,
                    publication.publicationImage,
                    publication.buttonHitbox,
                    publication.attachmentImage,
                    publication.attButton,
                )
                

            }catch(error){
                console.log('Erro, ', error)
            }


        });
    }
}