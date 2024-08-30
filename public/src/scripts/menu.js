export class MenuHandler{
    constructor(pageElements){
        this.pageElements = pageElements;
        this.setupDropdown();
        this.toggleMenu();
    }

    setupDropdown() {
        const { borderDropdown } = this.pageElements.popup.menu;
        const { profilePage } = this.pageElements;
        const dropdownOptions = borderDropdown.content.querySelectorAll('a');

        borderDropdown.button.addEventListener('click', () => {
            borderDropdown.content.classList.toggle('show');
        });

        //escondendo dropdown se clicar fora do objeto
        window.addEventListener('click', (event) => {
            if (!event.target.matches('.border-choose')) {
                if (borderDropdown.content.classList.contains('show')) {
                    borderDropdown.content.classList.remove('show');
                }
            }
        });


        dropdownOptions.forEach(option => {
            option.addEventListener('click', (event) => {
                event.preventDefault();
                const selectedValue = option.getAttribute('data-value');
                borderDropdown.button.textContent = selectedValue;
                borderDropdown.content.classList.remove('show');

                if(selectedValue === 'None'){
                    profilePage.profilePicWrapper.style.padding = '';
                    profilePage.profilePicBorder.style.background = 'none';

                }else if(selectedValue == 'Close Friends'){
                    profilePage.profilePicWrapper.style.padding = '.2em';
                    profilePage.profilePicBorder.style.background = '#1cd150';

                }else if(selectedValue == 'New Story'){
                    profilePage.profilePicWrapper.style.padding = '.2em';
                    profilePage.profilePicBorder.style.background = 'linear-gradient(to right, yellow, rgb(255, 168, 29), red, rgb(160, 0, 160))';

                }
            });
        });
    }

    toggleMenu(){
        const { menu } = this.pageElements.popup;

        window.addEventListener('click', (event) =>{
            if(event.target.matches('.popup-background')){
                menu.optionsContainer.style.height = '1em';
                
                setTimeout(() =>{
                    menu.content.classList.add('hidden');
                }, 250)


            }else{
                if(event.target.matches('.menu-button')){
                    menu.content.classList.remove('hidden');

                    setTimeout(() =>{
                        menu.optionsContainer.style.height = '20em';
                    }, 100)
                }
            }

        })



    }
}