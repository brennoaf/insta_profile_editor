export class HighlightHandler{
    constructor(pageElements){
        this.pageElements = pageElements;
        this.popupManager();
        this.creationManager();
    }

    popupManager(){
        const {  highlights  } = this.pageElements.popup;

        window.addEventListener('click', (event) =>{
            if(event.target.matches('.new-highlight-content')){
                highlights.content.classList.remove('hidden');

            }else if(event.target.matches('.new-highlight')){
                highlights.creationPopup.content.classList.remove('hidden');


            }else if(event.target.matches('.space-close')){
                highlights.creationPopup.content.classList.add('hidden');

                highlights.creationPopup.saveCreationBtn.disabled = true;
                highlights.creationPopup.saveCreationBtn.classList.add('disabled');
                highlights.creationPopup.hgTxtInput.value = '';
                highlights.creationPopup.hgTxt.textContent = 'Highlight';
                highlights.creationPopup.hgImage.src = ''

            }

        })
    }

    creationManager(){
        const {  highlights  } = this.pageElements.popup;


        //Atualiza o nome da prévia do destaque com base no value do input
        highlights.creationPopup.hgTxtInput.addEventListener('input', () =>{
            highlights.creationPopup.hgTxt.textContent = highlights.creationPopup.hgTxtInput.value

            highlights.creationPopup.saveCreationBtn.disabled = false;
            highlights.creationPopup.saveCreationBtn.classList.remove('disabled');
        })

        highlights.creationPopup.saveCreationBtn.addEventListener('click', () =>{

        })

        highlights.creationPopup.imagePreview.addEventListener('click', () =>{
            
        })

        //linkando e importando imagem
        highlights.creationPopup.imageHitbox.addEventListener('input', () => {
            const reader = new FileReader();

            reader.onload = (event) =>{
                highlights.creationPopup.hgImage.src = event.target.result;
            }

            reader.readAsDataURL(highlights.creationPopup.imageHitbox.files[0]);
            highlights.creationPopup.saveCreationBtn.disabled = false;
            highlights.creationPopup.saveCreationBtn.classList.remove('disabled');

        })
    }

}