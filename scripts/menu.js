export class MenuHandler{
    constructor(pageElements){
        this.pageElements = pageElements;
        this.setupDropdown();
        this.toggleMenu();
    }

    setupDropdown() {
        const { dropdown } = this.pageElements.popup.menu;
        const { profilePage } = this.pageElements;
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