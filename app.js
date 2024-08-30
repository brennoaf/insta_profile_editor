import { EditProfile } from './src/scripts/edit_profile.js';
import { MenuHandler } from './src/scripts/menu.js';
import {  HighlightHandler  } from './src/scripts/highlight_handler.js';
import { ProfileFunctions } from './src/scripts/profile_page.js';
//import { FetchProfileData } from './src/scripts/fetch_data/get_profile_data.js';
import { ScrapedProfileData } from './src/scripts/fetch_data/scraped_profile_data.js';

document.addEventListener('DOMContentLoaded', function() {
    const pageElements = {
        profilePage: {
            userUsername: document.querySelector('.username-text'),
            userName: document.querySelector('.profile-name-text'),
            userBiography: document.querySelector('.biography-text'),
            postQuantity: document.querySelector('.publications-number'),
            followersQuantity: document.querySelector('.followers-number'),
            followingQuantity: document.querySelector('.following-number'),
            profilePicBorder: document.querySelector('.pic-border'),
            profilePicWrapper: document.querySelector('.pic-wrapper'),
            profilePic: document.querySelector('.profile-pic'),

            newHighlight: document.querySelector('.new-highlight-content'),
            editProfileBtn: document.querySelector('.edit-profile'),

            publication:{
                publicationsItems: document.querySelector('.publications-items'),

                newPubButton: document.querySelector('.new-publication'),
                attButton: document.querySelector('.attachment-button'),
                buttonHitbox: document.getElementById('new-publication-file'),

                content: document.querySelector('.new-publication-content'),
                publicationImage: document.querySelector('.publication-image'),
                saveCreationBtn: document.querySelectorAll('.save-creation-container')[0],
                attachmentImage: document.querySelector('.image-attachment'),

                pubMenu: document.querySelector('.pub-menu-container'),
                blurBg: document.querySelector('.pub-focus-background'),

            },

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
                    usernameInput: document.getElementById('username'),
                    placeholder: document.querySelectorAll('.custom-placeholder'),
                    bioTextArea: document.getElementById('biography-textarea'),
                    limitCounter: document.querySelector('.limit-counter'),
                    changeContentBtn: document.querySelector('.save-modification-container'),

                    imageHitbox: document.querySelector('#profile-pic-file'),
                    actualPic: document.querySelector('.actual-picture'),
                },
            },

            menu: {
                borderDropdown:{
                    button: document.querySelector('.border-choose'),
                    content: document.querySelectorAll('.dropdown-content')[2],
                },

                quantityDropdown:{
                    button: document.querySelector('.border-choose'),
                    content: document.querySelectorAll('.dropdown-content')[2],
                },

                content: document.querySelectorAll('.menu')[1],
                openButton: document.querySelectorAll('.menu')[0],

                optionsContainer: document.querySelector('.options-container'),
            },

            highlights: {
                content:document.querySelectorAll('.popup-content')[4],
                openPopup: document.querySelector('.new-highlight'),

                creationPopup: {
                    content: document.querySelector('.create-highlight'),
                    close: document.querySelector('.space-close'),
                    saveCreationBtn: document.querySelectorAll('.save-creation-container')[1],
                    imagePreview: document.querySelector('.highlight-demo'),
                    hgImage: document.querySelector('.hg-pic'),
                    imageHitbox: document.getElementById('hg-pic-file'),
                    highlightsContainer: document.querySelector('.manage-highlight-items'),

                    hgTxt: document.querySelector('.hg-text-container'),
                    hgTxtInput: document.querySelector('.hg-text-input'),
                }
            }
        },
    };

    console.log(pageElements.popup.menu.borderDropdown)

    const editProfile = new EditProfile(pageElements);
    const menuHandler = new MenuHandler(pageElements);
    const highlightHandler = new HighlightHandler(pageElements);
    const profileFunctions = new ProfileFunctions(pageElements);
    //const fetchProfileData = new FetchProfileData(pageElements);
    const scrapedProfileData = new ScrapedProfileData(pageElements);

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
        pageElements.popup.editProfile.infoInputs.changeContentBtn.disabled = true;

    });



    //Possibilita sortir os destaques do perfil
    new Sortable(pageElements.profilePage.highlight.itemsContainer, {
        animation: 150,
        ghostClass: 'ghost',
        delay: 100, // Ajuste conforme necessário
        delayOnTouchOnly: true,

    });

    new Sortable(pageElements.profilePage.publication.publicationsItems, {
        animation: 150,
        ghostClass: 'ghost',
        delay: 100, // Ajuste conforme necessário
        delayOnTouchOnly: true,

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
});
