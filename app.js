import { EditProfile } from './scripts/edit_profile.js';

document.addEventListener('DOMContentLoaded', function() {
    const pageElements = {
        profilePage: {
            userUsername: document.querySelector('.username-text'),
            userName: document.querySelector('.profile-name-text'),
            userBiography: document.querySelector('.biography-text'),


            editProfileBtn: document.querySelector('.edit-profile'),
        },

        popup: {
            backButton: document.querySelectorAll('.back-button'),

            settings: {},

            editProfile: {
                dropdown: {
                    button: document.querySelector('.dropdown-button'),
                    content: document.querySelector('.dropdown-content'),
                },

                infoInputs: {
                    input: document.querySelectorAll('.change-input'),
                    placeholder: document.querySelectorAll('.custom-placeholder'),
                    bioTextArea: document.getElementById('biography-textarea'),
                    limitCounter: document.querySelector('.limit-counter'),
                    changeContentBtn: document.querySelector('.save-modification-container'),
                },
            },
        },
    };

    // Adiciona a classe hidden em todos os popups quando clicado na seta de voltar ao perfil
    //LEMBRAR DE ADICIONAR POPUP DE SEGURANÇA 'TEM CERTEZA QUE NÃO DESEJA SALVAR?'
    pageElements.popup.backButton.forEach(button => {
        button.addEventListener('click', () => {
            const popups = document.querySelectorAll('.popup-content');
            popups.forEach(popup => {
                popup.classList.add('hidden');
            });
        });
    });

    // Abrindo popup de editar perfil
    pageElements.profilePage.editProfileBtn.addEventListener('click', () => {
        const editProfilePopUp = document.getElementById('edit-profile-popup');
        editProfilePopUp.classList.remove('hidden');
        pageElements.popup.editProfile.infoInputs.changeContentBtn.classList.add('disabled');
        pageElements.popup.editProfile.infoInputs.changeContentBtn.disabled = true

        connectInputs()
    });


    //Colocando os inputs com os valores respectivos do perfil
    function connectInputs(){
        const { infoInputs } = pageElements.popup.editProfile;
        const { profilePage } = pageElements;

        infoInputs.input.forEach(input =>{
            if(input.classList.contains('name-input')){
                input.value = profilePage.userName.textContent;
            }

            else if(input.classList.contains('username-input')){
                input.value = profilePage.userUsername.textContent;
            }

            else if(input.classList.contains('biography-input')){
                input.value = profilePage.userBiography.textContent;
            }
        })
    };

    const editProfile = new EditProfile(pageElements);
});
