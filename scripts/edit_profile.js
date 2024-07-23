// edit_profile.js

export class EditProfile {
    constructor(pageElements) {
        this.pageElements = pageElements;
        this.setupDropdown();
        this.setupInputs();
    }

    //Cria e edita o dropdown
    setupDropdown() {
        const { dropdown } = this.pageElements.popup.editProfile;
        const dropdownOptions = dropdown.content.querySelectorAll('a');

        dropdown.button.addEventListener('click', () => {
            dropdown.content.classList.toggle('show');
        });

        //escondendo dropdown se clicar fora do objeto
        window.addEventListener('click', (event) => {
            if (!event.target.matches('.dropdown-button')) {
                if (dropdown.content.classList.contains('show')) {
                    dropdown.content.classList.remove('show');
                }
            }
        });


        dropdownOptions.forEach(option => {
            option.addEventListener('click', (event) => {
                event.preventDefault();
                const selectedValue = option.getAttribute('data-value');
                dropdown.button.textContent = selectedValue;
                dropdown.content.classList.remove('show');
            });
        });
    }

    //Maneja animações dentro do input
    setupInputs() {
        const { infoInputs } = this.pageElements.popup.editProfile;
        const { profilePage } = this.pageElements;
        const popups = document.querySelectorAll('.popup-content');

        infoInputs.input.forEach(input => {
            const inputContainer = input.parentNode;
            const placeholder = inputContainer.childNodes[1];
            input.addEventListener('focus', () => {
                placeholder.style.fontSize = '9px';
                placeholder.style.alignItems = 'flex-start';
                placeholder.style.paddingLeft = '.1em';
                placeholder.style.top = '5px';
            });

            //Modifica o input quando desselecionar
            input.addEventListener('blur', () => {
                if (!input.value) {
                    placeholder.style.fontSize = '10px';
                    placeholder.style.alignItems = 'center';
                    placeholder.style.top = 'inherit';
                    placeholder.style.color = '#a0a3a8';
                }
            });

            if (input.value) {
                placeholder.style.fontSize = '9px';
                placeholder.style.alignItems = 'flex-start';
                placeholder.style.paddingLeft = '.1em';
                placeholder.style.top = '5px';
            }

            input.addEventListener('input', () =>{
                infoInputs.changeContentBtn.classList.remove('disabled')
                infoInputs.changeContentBtn.disabled = false
            })

        });

        infoInputs.bioTextArea.addEventListener('input', () => {
            this.changeBioTextArea(infoInputs.bioTextArea);
            this.bioLimitCounter(infoInputs.limitCounter, infoInputs.bioTextArea);
        });

        infoInputs.changeContentBtn.addEventListener('click', () =>{
            this.modifyProfileInfo(infoInputs, profilePage, popups)
        })
    }

    //Modifica height da textarea com base no texto
    changeBioTextArea(textArea) {
        textArea.style.height = 'fit-content';
        var heightFitContent = textArea.scrollHeight - 60;
        textArea.style.height = (heightFitContent + 70) + 'px';

        if (!textArea.value) {
            textArea.style.height = '36px';
        }
    }

    //Modifica contador de limite de caracteres (colocar limit checker in js de caracteres)
    bioLimitCounter(limitCounter, bioTextArea) {
        const maxLength = 150;
        const actualLength = bioTextArea.value.length;

        limitCounter.textContent = `${actualLength}/${maxLength}`;

        if (actualLength > 100) {
            limitCounter.style.color = 'red';
        } else {
            limitCounter.style.color = 'white';
        }
    }




    //Esta função quando executa transfere os valores dos inputs para o PERFIL
    modifyProfileInfo(infoInputs, profilePage, popups){
            infoInputs.input.forEach(input =>{
            if(input.classList.contains('name-input')){
                profilePage.userName.textContent = input.value;
            }

            else if(input.classList.contains('username-input')){
                profilePage.userUsername.textContent = input.value;
            }

            else if(input.classList.contains('biography-input')){
                profilePage.userBiography.textContent = input.value;
            }
        })
        
        popups.forEach(popup => {
            popup.classList.add('hidden');

        });
    }
}
