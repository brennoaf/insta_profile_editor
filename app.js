import { EditProfile } from './scripts/edit_profile.js';
import { MenuHandler } from './scripts/menu.js';
import {  HighlightHandler  } from './scripts/highlight_handler.js';

document.addEventListener('DOMContentLoaded', function() {
    const pageElements = {
        profilePage: {
            userUsername: document.querySelector('.username-text'),
            userName: document.querySelector('.profile-name-text'),
            userBiography: document.querySelector('.biography-text'),
            profilePicBorder: document.querySelector('.pic-border'),
            profilePicWrapper: document.querySelector('.pic-wrapper'),

            newHighlight: document.querySelector('.new-highlight-content'),
            editProfileBtn: document.querySelector('.edit-profile'),

            highlight: {
                itemsContainer: document.querySelector('.highlight-items'),
                items: document.querySelectorAll('item')
            }
        },

        popup: {
            backButton: document.querySelectorAll('.back-button'),

            settings: {},

            editProfile: {
                dropdown: {
                    button: document.querySelectorAll('.dropdown-button')[0],
                    content: document.querySelectorAll('.dropdown-content')[0],
                },

                infoInputs: {
                    input: document.querySelectorAll('.change-input'),
                    placeholder: document.querySelectorAll('.custom-placeholder'),
                    bioTextArea: document.getElementById('biography-textarea'),
                    limitCounter: document.querySelector('.limit-counter'),
                    changeContentBtn: document.querySelector('.save-modification-container'),
                },
            },

            menu: {
                dropdown:{
                    button: document.querySelectorAll('.dropdown-button')[1],
                    content: document.querySelectorAll('.dropdown-content')[1],
                },

                content: document.querySelectorAll('.menu')[1],
                openButton: document.querySelectorAll('.menu')[0],

                optionsContainer: document.querySelector('.options-container'),
            },

            highlights: {
                content:document.querySelectorAll('.popup-content')[3],
                openPopup: document.querySelector('.new-highlight'),

                creationPopup: {
                    content: document.querySelector('.create-highlight'),
                    close: document.querySelector('.space-close'),
                    saveCreationBtn: document.querySelector('.save-creation-container'),
                    imagePreview: document.querySelector('.highlight-demo'),
                    hgImage: document.querySelector('.hg-pic'),
                    imageHitbox: document.getElementById('hg-pic-file'),

                    hgTxt: document.querySelector('.hg-text-container'),
                    hgTxtInput: document.querySelector('.hg-text-input'),
                }
            }
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


    //Possibilita sortir os destaques do perfil
    new Sortable(pageElements.profilePage.highlight.itemsContainer, {
        animation: 150,
        ghostClass: 'ghost',
    })

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
    const menuHandler = new MenuHandler(pageElements);
    const highlightHandler = new HighlightHandler(pageElements);
});
