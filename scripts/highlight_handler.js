export class HighlightHandler{
    constructor(pageElements){
        this.pageElements = pageElements;
        //nomes originais e transformados dos highlights
        this.lastOriginalHgName = '';
        this.lastChangedHgName = '';

        this.popupManager();
        this.creationManager(this.lastOriginalHgName, this.lastChangedHgName);

        
    }

    async loadImage(file){
        return new Promise((resolve, reject) =>{
            const reader = new FileReader();
            const { highlights } = this.pageElements.popup;

            reader.onload = (event) =>{
                var insertedImage = event.target.result;
                highlights.creationPopup.hgImage.src = event.target.result;
                
                resolve(insertedImage)

            };
            reader.onerror = reject;
            reader.readAsDataURL(file);

        })
    }

    resetHgCreation(content, saveBtn, hgTxtInput, hgTxt, hgImage, hgImgInput){
        content.classList.add('hidden');

        saveBtn.disabled = true;
        saveBtn.classList.add('disabled');
        hgTxtInput.value = '';
        hgTxt.textContent = 'Highlight';
        hgImage.src = '';

        //TENTANDO LIMPAR INPUT NOS BROWSERS
        hgImgInput.value = null;
        hgImgInput.type = 'text';
        hgImgInput.type = 'file';
    }

    popupManager(){
        const {  highlights  } = this.pageElements.popup;

        window.addEventListener('click', (event) =>{
            if(event.target.matches('.new-highlight-content')){
                highlights.content.classList.remove('hidden');

            }else if(event.target.matches('.new-highlight')){
                highlights.creationPopup.content.classList.remove('hidden');


            }else if(event.target.matches('.space-close')){
                this.resetHgCreation(
                    highlights.creationPopup.content,

                    highlights.creationPopup.saveCreationBtn,
                    highlights.creationPopup.hgTxtInput,
                    highlights.creationPopup.hgTxt,
                    highlights.creationPopup.hgImage,
                    highlights.creationPopup.imageHitbox
                )

            }

        })
    }

    creationManager(originalInput, changedInput){
        const { highlights } = this.pageElements.popup;
        resetListener(highlights.creationPopup.highlightsContainer);

        //Atualiza o nome da prévia do destaque com base no value do input
        highlights.creationPopup.hgTxtInput.addEventListener('input', () =>{

            originalInput = highlights.creationPopup.hgTxtInput.value.trim();
            changedInput = highlights.creationPopup.hgTxtInput.value.trim();
            highlights.creationPopup.hgTxt.textContent = changedInput;

            //Verificando conteúdo offset sem os 3 pontos
            if((changedInput.slice(-3)) === '...' && !(originalInput.slice(-3)) === '...'){
                changedInput = changedInput.slice(0, -3)
                console.log(changedInput)

                highlights.creationPopup.hgTxt.textContent = changedInput

                if(highlights.creationPopup.hgTxt.offsetWidth > 146){
                    changedInput += '...';
                    highlights.creationPopup.hgTxt.textContent = changedInput; 

                }
            }

            if(highlights.creationPopup.hgTxt.offsetWidth > 146){
                changedInput = highlights.creationPopup.hgTxtInput.value.trim().slice(0, 12) + '...';
                highlights.creationPopup.hgTxt.textContent = changedInput;
                console.log(changedInput)
                
            }else{
                
            }

            if(!highlights.creationPopup.hgTxtInput.value){
                highlights.creationPopup.hgTxt.textContent = 'Highlight';
            }

            console.log(highlights.creationPopup.hgTxt.offsetWidth)


            highlights.creationPopup.saveCreationBtn.disabled = false;
            highlights.creationPopup.saveCreationBtn.classList.remove('disabled');
        })

        //linkando e importando imagem
        highlights.creationPopup.imageHitbox.addEventListener('input', async () => {
                try {
                    const image = highlights.creationPopup.imageHitbox.files[0];
                    await this.loadImage(image);
            
                    highlights.creationPopup.saveCreationBtn.disabled = false;
                    highlights.creationPopup.saveCreationBtn.classList.remove('disabled');
                } catch (error) {
                    console.error('Erro:', error);

                }
        });

        highlights.creationPopup.saveCreationBtn.addEventListener('click', async () =>{
            try{
                const { highlightsContainer } = highlights.creationPopup;
                const highlightsQuant = highlightsContainer.childElementCount;
        
                //Criando o container do highlight
                const newHg =  document.createElement('div');
                newHg.classList.add('mockup-item');
                newHg.classList.add(`${highlightsQuant + 1}`)

                //Criando container de imagem
                const hgPicCont = document.createElement('div');
                hgPicCont.classList.add('highlight-pic-content');

                //criando container de esconder highlight
                const hgHideCont = document.createElement('div');
                hgHideCont.classList.add('hide-highlight');

                const hgHideOff = document.createElement('i');
                hgHideOff.classList.add('gg-eye');
                const hgHideOn = document.createElement('i');
                hgHideOn.classList.add('gg-border-style-solid');
                hgHideOn.classList.add('off');
                

                //Criando imagem do highlight
                const hgPic = document.createElement('div');
                hgPic.classList.add('highlight-pic');

                hgPic.style.backgroundImage = `url('${highlights.creationPopup.hgImage.src}')`;


                if(!highlights.creationPopup.imageHitbox.value){
                    window.alert('You need to insert a picture!');
                    
                }else{
                    //Criando container de texto
                    const hgTextCont = document.createElement('div');
                    hgTextCont.classList.add('highlight-text-content');

                    //Criando span de texto
                    const hgText = document.createElement('span');
                    hgText.classList.add('highlight-text');

                    //Se o input do nome tiver vazio, seta para 'Highlight'
                    if(!highlights.creationPopup.hgTxtInput.value){
                        hgText.textContent = 'Highlight';

                    }else{
                        hgText.textContent = changedInput;

                    }

                    //Adicionando filhos aos respectivos pais
                    hgHideCont.appendChild(hgHideOff);
                    hgHideCont.appendChild(hgHideOn);
                    hgPicCont.appendChild(hgHideCont);
                    hgPicCont.appendChild(hgPic);
                    hgTextCont.appendChild(hgText);
                    newHg.appendChild(hgPicCont);
                    newHg.appendChild(hgTextCont);
                    highlightsContainer.appendChild(newHg);


                    
                    //Resetando popup de criação

                    resetListener(highlights.creationPopup.highlightsContainer);

                    this.resetHgCreation(
                        highlights.creationPopup.content,

                        highlights.creationPopup.saveCreationBtn,
                        highlights.creationPopup.hgTxtInput,
                        highlights.creationPopup.hgTxt,
                        highlights.creationPopup.hgImage,
                        highlights.creationPopup.imageHitbox
                    )
                }

            }catch(error){
                console.log('Erro, ', error)
            }


        });

        function resetListener(hgContainer){
            const childs = hgContainer.childNodes
            
            childs.forEach(child =>{
                let childClone = child.cloneNode(true);
                hgContainer.replaceChild(childClone, child);

                childClone.addEventListener('click', () =>{
                    childClone.classList.toggle('hidden')
                    childClone.childNodes[0].childNodes[0].childNodes[0].classList.toggle('gg-eye');
                    childClone.childNodes[0].childNodes[0].childNodes[1].classList.toggle('off');
                    
                });
            });
        }
    }

}