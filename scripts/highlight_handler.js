export class HighlightHandler{
    constructor(pageElements){
        this.pageElements = pageElements;
        this.popupManager();
        this.modificationManager();
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

            }

        })
    }

    modificationManager(){
        const {  highlights  } = this.pageElements.popup;


        highlights.creationPopup.hgTxtInput.addEventListener('input', () =>{
            highlights.creationPopup.hgTxt.textContent = highlights.creationPopup.hgTxtInput.value

            highlights.creationPopup.saveCreationBtn.disabled = false;
            highlights.creationPopup.saveCreationBtn.classList.remove('disabled');
        })
    }

}