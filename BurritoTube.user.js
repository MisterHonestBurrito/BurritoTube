// ==UserScript==
// @name         BurritoTube
// @namespace    Youtube old UI
// @version      1.0
// @description  Brings back the old, good Youtube UI.
// @author       MisterHonestBurrito
// @homepage     https://github.com/MisterHonestBurrito/BurritoTube
// @updateURL    https://raw.githubusercontent.com/MisterHonestBurrito/BurritoTube/refs/heads/main/BurritoTube.user.js
// @downloadURL  https://raw.githubusercontent.com/MisterHonestBurrito/BurritoTube/refs/heads/main/BurritoTube.user.js
// @supportURL   https://github.com/MisterHonestBurrito/BurritoTube/issues
// @icon         https://raw.githubusercontent.com/MisterHonestBurrito/BurritoTube/refs/heads/main/DisplayIcon.png
// @match        https://*.youtube.com/*
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

    /* START OF CONFIG */
    let forcePlaybackQuality = false; // set to true to force a specific playback quality or false to disable (neither you or Youtube can change the quality with this on)

    let forcedPlaybackQuality = 'auto'; // set the desired playback quality when the video starts ('auto' to disable), you can also set 'highest' or 'lowest' to automatically select the highest or lowest available quality
    /*
    supported playback quality values:
    'highres', -- 8K
    'hd2160', -- 4K
    'hd1440', -- 1440p (2K)
    'hd1080', -- 1080p (Full HD)
    'hd720', -- 720p (HD)
    'large', -- 480p (SD)
    'medium', -- 360p (SD)
    'small', -- 240p (LOW SD)
    'tiny' -- 144p (Low Quality)
    if the quality is not supported, the closest available quality will be selected instead
    */
    let forcePlaybackSpeedOnShorts = false; // set to true to also force the playback speed on shorts or false to only force it on normal videos
    let forcedPlaybackSpeed = false; // set the desired forced playback speed or false to disable (e.g. 1.25 for 1.25x speed)
    // WARNING: setting a lower speed then 0.25 or higher then 2 may be unsupported; speeds increase or decrease in increments of 0.05, so setting a different speed may not work

    let oldPlaybackSpeedMenu = true; // set to false to have the new playback speed menu
    let fullscreenAnimation = false; // set to true to have the new full screen animation
    let moreVideosInFullscreen = false; // set to true to have the 'More Videos' option in full screen
    let modernVideoTitle = false; // set to true to have the modern video title instead of the old one
    let playerQuickActions = false; // set to true to have quick actions, such as liking or commenting on the video, in full screen
    let miniplayerEnabled = false; // set to true to enable the miniplayer; if the value value is set to false, the PIP player will be used instead
    /* END OF CONFIG */

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

    /* DO NOT CHANGE */
    let customSpeedSelected = false;
    let currentCustomSpeed = 1.00;
    let currentQuality = false;
    let playbackQualityListenerPlayer = false;
    let fullscreenButtonFixed = false;
    let doubleClickFullscreenFixed = false;
    let miniplayerButtonFixed = false;
    /* DO NOT CHANGE */

    if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: string => string
        });
    }

    let CustomTexts = [[{ "code": "af", "text": "Pasgemaak" }, { "code": "sq", "text": "Me porosi" }, { "code": "am", "text": "ብጁ" }, { "code": "ar", "text": "مخصص" }, { "code": "hy", "text": "Պատվերով" }, { "code": "as", "text": "অনুকুলন কৰা" }, { "code": "ay", "text": "Isinaka" }, { "code": "az", "text": "Xüsusi" }, { "code": "bm", "text": "Laada" }, { "code": "eu", "text": "Pertsonalizatua" }, { "code": "be", "text": "Прыстасаваныя" }, { "code": "bn", "text": "কাস্টম" }, { "code": "bho", "text": "रिवाज" }, { "code": "bs", "text": "Prilagođeno" }, { "code": "bg", "text": "По избор" }, { "code": "ca", "text": "Personalitzat" }, { "code": "ceb", "text": "Gipasadya" }, { "code": "ny", "text": "Mwambo" }, { "code": "zh-CN", "text": "自定义" }, { "code": "zh-TW", "text": "自定義" }, { "code": "co", "text": "Personalizatu" }, { "code": "hr", "text": "Prilagođeno" }, { "code": "cs", "text": "Vlastní" }, { "code": "da", "text": "Brugerdefineret" }, { "code": "dv", "text": "ސަޤާފަތް" }, { "code": "doi", "text": "रवाज" }, { "code": "nl", "text": "Aangepast" }, { "code": "en", "text": "Custom" }, { "code": "eo", "text": "Kutimo" }, { "code": "et", "text": "Kohandatud" }, { "code": "ee", "text": "Dekᴐnu" }, { "code": "tl", "text": "Pasadya" }, { "code": "fi", "text": "Mukautettu" }, { "code": "fr", "text": "Personnalisé" }, { "code": "fy", "text": "Oanpast" }, { "code": "gl", "text": "Personalizado" }, { "code": "ka", "text": "მორგებული" }, { "code": "de", "text": "Benutzerdefiniert" }, { "code": "el", "text": "Προσαρμοσμένο" }, { "code": "gn", "text": "Jepokuaa" }, { "code": "gu", "text": "કસ્ટમ" }, { "code": "ht", "text": "Personnalisé" }, { "code": "ha", "text": "Na musamman" }, { "code": "haw", "text": "Kuʻuna" }, { "code": "iw", "text": "מִנְהָג" }, { "code": "hi", "text": "रिवाज़" }, { "code": "hmn", "text": "Kev cai" }, { "code": "hu", "text": "Szokás" }, { "code": "is", "text": "Sérsniðin" }, { "code": "ig", "text": "Omenala" }, { "code": "ilo", "text": "Naibagay" }, { "code": "id", "text": "Kustom" }, { "code": "ga", "text": "Saincheaptha" }, { "code": "it", "text": "Personalizzato" }, { "code": "ja", "text": "カスタム" }, { "code": "jw", "text": "adat" }, { "code": "kn", "text": "ಕಸ್ಟಮ್" }, { "code": "kk", "text": "Арнаулы" }, { "code": "km", "text": "ផ្ទាល់ខ្លួន" }, { "code": "rw", "text": "Guhindurwa" }, { "code": "gom", "text": "कस्टम" }, { "code": "ko", "text": "사용자 지정" }, { "code": "kri", "text": "Wetin kɔmɔn" }, { "code": "ku", "text": "Hûnbunî" }, { "code": "ckb", "text": "باو" }, { "code": "ky", "text": "Ыңгайлаштырылган" }, { "code": "lo", "text": "ກຳນົດເອງ" }, { "code": "la", "text": "Consuetudinem" }, { "code": "lv", "text": "Pielāgots" }, { "code": "ln", "text": "Momeseno" }, { "code": "lt", "text": "Pasirinktinis" }, { "code": "lg", "text": "Empisa" }, { "code": "lb", "text": "Benotzerdefinéiert" }, { "code": "mk", "text": "Прилагодено" }, { "code": "mai", "text": "परिपाटी" }, { "code": "mg", "text": "fanao" }, { "code": "ms", "text": "Tersuai" }, { "code": "ml", "text": "കസ്റ്റം" }, { "code": "mt", "text": "Personalizzat" }, { "code": "mi", "text": "Ritenga" }, { "code": "mr", "text": "सानुकूल" }, { "code": "mni-Mtei", "text": "ꯆꯠꯅꯕꯤ" }, { "code": "lus", "text": "Chindan" }, { "code": "mn", "text": "Захиалгат" }, { "code": "my", "text": "စိတ်ကြိုက်" }, { "code": "ne", "text": "अनुकूलन" }, { "code": "no", "text": "Egendefinert" }, { "code": "or", "text": "କଷ୍ଟମ୍" }, { "code": "om", "text": "Aadaa" }, { "code": "ps", "text": "ګمرک" }, { "code": "fa", "text": "سفارشی" }, { "code": "pl", "text": "Niestandardowy" }, { "code": "pt", "text": "Personalizado" }, { "code": "pa", "text": "ਕਸਟਮ" }, { "code": "qu", "text": "Chullachasqa" }, { "code": "ro", "text": "Personalizat" }, { "code": "ru", "text": "Пользовательский" }, { "code": "sm", "text": "Aganuu" }, { "code": "sa", "text": "आचारः" }, { "code": "gd", "text": "Gnàthach" }, { "code": "nso", "text": "Tlwaelo" }, { "code": "sr", "text": "Прилагођено" }, { "code": "st", "text": "Tloaelo" }, { "code": "sn", "text": "Yakasarudzwa" }, { "code": "sd", "text": "حسب ضرورت" }, { "code": "si", "text": "අභිරුචි" }, { "code": "sk", "text": "Vlastné" }, { "code": "sl", "text": "Po meri" }, { "code": "so", "text": "Caadiyan" }, { "code": "es", "text": "Personalizado" }, { "code": "su", "text": "Adat" }, { "code": "sw", "text": "Desturi" }, { "code": "sv", "text": "Anpassad" }, { "code": "tg", "text": "Фармоишгар" }, { "code": "ta", "text": "தனிப்பயன்" }, { "code": "tt", "text": "Гадәт" }, { "code": "te", "text": "కస్టమ్" }, { "code": "th", "text": "กำหนดเอง" }, { "code": "ti", "text": "ቅቡል ልምዲ" }, { "code": "ts", "text": "Ntolovelo" }, { "code": "tr", "text": "Özel" }, { "code": "tk", "text": "Omörite" }, { "code": "ak", "text": "Amaneɛ" }, { "code": "uk", "text": "Користувацький" }, { "code": "ur", "text": "حسب ضرورت" }, { "code": "ug", "text": "ئىختىيارى" }, { "code": "uz", "text": "Maxsus" }, { "code": "vi", "text": "Tùy chỉnh" }, { "code": "cy", "text": "Personol" }, { "code": "xh", "text": "Isiko" }, { "code": "yi", "text": "מנהג" }, { "code": "yo", "text": "Aṣa" }, { "code": "zu", "text": "Ngokwezifiso" }]];

    let language = document.documentElement.lang.split('-')[0].toLowerCase();

    let customText = 'Custom';

    for (let i = 0; i < CustomTexts[0].length; i++) {
        if (CustomTexts[0][i].code === language) {
            customText = CustomTexts[0][i].text;
            break;
        }
    }

    function watchPage() {
        if (window.location.href.indexOf('/watch?') !== -1 || window.location.href.indexOf('/watch/') !== -1 || window.location.href.indexOf('/live/') !== -1) {
            return true;
        }
        else {
            return false;
        }
    }

    function shortsPage() {
        if (window.location.href.indexOf('/shorts/') !== -1) {
            return true;
        }
        else {
            return false;
        }
    }

    let BodyClasses_timeout = false;
    function BodyClasses() {
        if (!document.body) {
            clearTimeout(BodyClasses_timeout);
            BodyClasses_timeout = setTimeout(BodyClasses, 100)
            return;
        }

        if (moreVideosInFullscreen) {
            document.body.classList.add('moreVideosInFullscreen')
        }
        if (modernVideoTitle) {
            document.body.classList.add('modernVideoTitle')
        }
        if (playerQuickActions) {
            document.body.classList.add('playerQuickActions')
        }
        if (miniplayerEnabled) {
            document.body.classList.add('miniplayerEnabled')
        }
    }

    BodyClasses();

    function oldPlayerUI() {
        Object.defineProperty(Object.prototype, 'delhi_modern_web_player', {
            get: () => ({}),
            set: () => { },
            configurable: true
        });

        Object.defineProperty(Object.prototype, 'delhi_modern_web_player_icons', {
            get: () => ({}),
            set: () => { },
            configurable: true
        });
    }

    oldPlayerUI();

    if (!fullscreenAnimation) {
        document.documentElement.requestFullscreen = function () {
            let player = document.querySelector('#movie_player');
            if (player && !document.fullscreenElement && watchPage()) {
                player.requestFullscreen();
            }
            else {
                return Element.prototype.requestFullscreen.call(document.documentElement);
            }
        }
    }

    function scrollFullscreenFix(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    if (!moreVideosInFullscreen) {
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                document.addEventListener('wheel', scrollFullscreenFix, true);
            }
            else {
                document.removeEventListener('wheel', scrollFullscreenFix, true);
            }
        });
    }

    let injectEmbedClass_timeout = false;
    function injectEmbedClass() {
        let player = document.querySelector('#movie_player');
        if (!player) {
            clearTimeout(injectEmbedClass_timeout);
            injectEmbedClass_timeout = setTimeout(injectEmbedClass, 100);
            return;
        }

        if (!player.classList.contains('ytp-embed') || (!modernVideoTitle && (player.classList.contains('ytp-hide-fullscreen-title') || player.classList.contains('ytp-fullscreen-metadata-top')))) {
            player.classList.add('ytp-embed');
            player.classList.remove('ytp-hide-fullscreen-title');
            player.classList.remove('ytp-fullscreen-metadata-top');
        }
    }

    let oldPlaybackSpeedUI_timeout = false;
    function oldPlaybackSpeedUI() {

        oldPlaybackSpeedMenu = false;

        let player = document.querySelector('#movie_player');

        if (player && player.querySelector('.ytp-settings-button')) {
            let settingsButton = player.querySelector('.ytp-settings-button');

            ['click', 'menuRefresh'].forEach(event => {
                settingsButton.addEventListener(event, () => {
                    let settingsPanel = player.querySelector('.ytp-settings-menu');
                    if (settingsPanel) {
                        settingsPanel.classList.remove('speed-menu-animate');
                        let panelMenu = settingsPanel.querySelector('.ytp-panel-menu');
                        if (panelMenu) {
                            let menuItems = panelMenu.querySelectorAll('.ytp-menuitem');
                            if (menuItems.length >= 2) {
                                let playbackButton = false;
                                if (player.getAvailableQualityLevels().length > 0) {
                                    playbackButton = menuItems[menuItems.length - 2];
                                }
                                else {
                                    playbackButton = menuItems[menuItems.length - 1];
                                }
                                if (playbackButton) {
                                    playbackButton.removeEventListener('click', playbackButtonClick);
                                    playbackButton.addEventListener('click', playbackButtonClick);
                                    playbackButton.removeEventListener('click', playbackButtonAnimate);
                                    playbackButton.addEventListener('click', playbackButtonAnimate, true);

                                    let playbackButtonIcon = playbackButton.querySelector('.ytp-menuitem-icon');
                                    if (playbackButtonIcon) {
                                        playbackButtonIcon.innerHTML = `
                                        <svg height="24" viewBox="0 0 24 24" width="24"><path d="M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z" fill="white"></path></svg>
                                        `
                                    }
                                }
                            }
                        }
                    }
                });
            });
        }
        else {
            clearTimeout(oldPlaybackSpeedUI_timeout);
            oldPlaybackSpeedUI_timeout = setTimeout(oldPlaybackSpeedUI, 100);
            return;
        }
    }

    function playbackButtonClick() {
        let player = document.querySelector('#movie_player');
        let settingsPanel = player.querySelector('.ytp-settings-menu');
        let settingsButton = player.querySelector('.ytp-settings-button');
        let panel = settingsPanel.querySelector('.ytp-panel-animate-forward');
        if (panel) {
            let originalBackButton = panel.querySelector('.ytp-panel-back-button');
            if (originalBackButton && !document.querySelector('#original-back-button')) {
                originalBackButton.id = 'original-back-button';
                document.body.appendChild(originalBackButton);
            }

            let playbackSpeedText = false;
            let playbackSpeedTextElement = panel.querySelector('.ytp-panel-title');
            if (playbackSpeedTextElement) {
                playbackSpeedText = playbackSpeedTextElement.textContent;
            }

            let normalSpeedText = false;
            let normalSpeedTextElement = panel.querySelector('.ytp-variable-speed-panel-preset-button-label-text');
            if (normalSpeedTextElement) {
                normalSpeedText = normalSpeedTextElement.textContent;
            }

            panel.innerHTML = `<div class="ytp-panel-header"><div class="ytp-panel-back-button-container"><button class="ytp-button ytp-panel-back-button" id="speed-back-button" aria-label="Back to previous menu"></button></div><span class="ytp-panel-title" id="speed-panel-title" role="heading" aria-level="2">Playback speed</span></div><div class="ytp-panel-menu" role="menu"><div class="ytp-menuitem ytp-menuitem-with-footer" id="speed-menu-custom" tabindex="0" role="menuitemradio" aria-checked="false"><div class="ytp-menuitem-label" id="speed-menu-custom-text">Custom (1)</div><div class="ytp-menuitem-footer"><div class="ytp-speed-slider-menu-footer"><div class="ytp-input-slider-section"><div class="ytp-speedslider-indicator-container"><div class="ytp-speedslider-badge" aria-label=""></div><p class="ytp-speedslider-text">1.00x</p></div><input class="ytp-input-slider ytp-speedslider" role="slider" tabindex="0" type="range" min="0.25" max="2" step="0.05" value="1" aria-valuenow="1" aria-valuemin="0.25" aria-valuemax="2" aria-valuetext="1.00" style="--yt-slider-shape-gradient-percent: 42.857142857142854%;"></div></div></div></div><div class="ytp-menuitem " tabindex="0" role="menuitemradio" aria-checked="false"><div class="ytp-menuitem-label speed-menu-item" id='speed-menu-item-0.25'>0.25</div></div><div class="ytp-menuitem " tabindex="0" role="menuitemradio" aria-checked="false"><div class="ytp-menuitem-label speed-menu-item" id='speed-menu-item-0.5'>0.5</div></div><div class="ytp-menuitem " tabindex="0" role="menuitemradio" aria-checked="false"><div class="ytp-menuitem-label speed-menu-item" id='speed-menu-item-0.75'>0.75</div></div><div class="ytp-menuitem " tabindex="0" role="menuitemradio" aria-checked="false"><div class="ytp-menuitem-label speed-menu-item" id="speed-menu-item-1">Normal</div></div><div class="ytp-menuitem " tabindex="0" role="menuitemradio" aria-checked="false"><div class="ytp-menuitem-label speed-menu-item" id='speed-menu-item-1.25'>1.25</div></div><div class="ytp-menuitem " tabindex="0" role="menuitemradio" aria-checked="false"><div class="ytp-menuitem-label speed-menu-item" id='speed-menu-item-1.5'>1.5</div></div><div class="ytp-menuitem " tabindex="0" role="menuitemradio" aria-checked="false"><div class="ytp-menuitem-label speed-menu-item" id='speed-menu-item-1.75'>1.75</div></div><div class="ytp-menuitem " tabindex="0" role="menuitemradio" aria-checked="false"><div class="ytp-menuitem-label speed-menu-item" id='speed-menu-item-2'>2</div></div></div>`;

            let speedPanelTitle = panel.querySelector('#speed-panel-title');
            if (speedPanelTitle && playbackSpeedText) {
                speedPanelTitle.textContent = playbackSpeedText;
            }

            let normalSpeedLabel = panel.querySelector('#speed-menu-item-1');
            if (normalSpeedLabel && normalSpeedText) {
                normalSpeedLabel.textContent = normalSpeedText;
            }

            let customTextElement = panel.querySelector('#speed-menu-custom-text');
            if (customTextElement) {
                customTextElement.textContent = `${customText} (${parseFloat(currentCustomSpeed.toFixed(2))})`;
            }

            let backButtonOriginal = document.querySelector('#original-back-button')
            if (backButtonOriginal) {
                panel.appendChild(backButtonOriginal);
            }

            player = document.querySelector('#movie_player');
            if (player) {
                let currentSpeed = player.getPlaybackRate();
                let currentSpeedItem = panel.querySelector(`[id="speed-menu-item-${currentSpeed}"]`);
                if (currentSpeedItem && !customSpeedSelected) {
                    currentSpeedItem.parentElement.setAttribute('aria-checked', 'true');
                }
            }

            let speedMenuItems = panel.querySelectorAll('.speed-menu-item');
            speedMenuItems.forEach(item => {
                item.addEventListener('click', () => {
                    let currentlyChecked = panel.querySelector('.ytp-menuitem[aria-checked="true"]');
                    if (currentlyChecked) {
                        currentlyChecked.setAttribute('aria-checked', 'false');
                    }

                    item.parentElement.setAttribute('aria-checked', 'true');

                    let speed = parseFloat(item.id.split('speed-menu-item-')[1]);
                    player = document.querySelector('#movie_player');
                    if (player) {
                        customSpeedSelected = false;
                        player.setPlaybackRate(speed);
                        backButton.click();
                    }
                });
            });

            let speedMenuEnterItems = panel.querySelectorAll('.speed-menu-item');
            speedMenuEnterItems.forEach(item => {
                item.parentElement.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        let currentlyChecked = panel.querySelector('.ytp-menuitem[aria-checked="true"]');
                        if (currentlyChecked) {
                            currentlyChecked.setAttribute('aria-checked', 'false');
                        }

                        item.parentElement.setAttribute('aria-checked', 'true');

                        let speed = parseFloat(item.id.split('speed-menu-item-')[1]);
                        player = document.querySelector('#movie_player');
                        if (player) {
                            customSpeedSelected = false;
                            player.setPlaybackRate(speed);
                            backButton.click();
                        }
                    }
                });
            });

            let speedMenuCustom = panel.querySelector('#speed-menu-custom');
            if (speedMenuCustom) {
                if (customSpeedSelected) {
                    let currentlyChecked = panel.querySelector('.ytp-menuitem[aria-checked="true"]');
                    if (currentlyChecked) {
                        currentlyChecked.setAttribute('aria-checked', 'false');
                    }
                    speedMenuCustom.setAttribute('aria-checked', 'true');
                }

                speedMenuCustom.addEventListener('click', () => {
                    customSpeedSelected = true;
                    let currentlyChecked = panel.querySelector('.ytp-menuitem[aria-checked="true"]');
                    if (currentlyChecked) {
                        currentlyChecked.setAttribute('aria-checked', 'false');
                    }
                    speedMenuCustom.setAttribute('aria-checked', 'true');
                    player.setPlaybackRate(currentCustomSpeed);
                });
            }

            let speedSlider = panel.querySelector('.ytp-speedslider');
            let speedSliderText = panel.querySelector('.ytp-speedslider-text');

            if (speedSlider && speedSliderText) {
                speedSlider.value = currentCustomSpeed
                let percent = (currentCustomSpeed - speedSlider.min) / (speedSlider.max - speedSlider.min) * 100;
                speedSlider.style.setProperty('--yt-slider-shape-gradient-percent', `${percent}%`);
                speedSliderText.textContent = `${currentCustomSpeed.toFixed(2)}x`;

                speedSlider.addEventListener('input', (event) => {
                    let percent = (event.target.value - speedSlider.min) / (speedSlider.max - speedSlider.min) * 100;
                    speedSlider.style.setProperty('--yt-slider-shape-gradient-percent', `${percent}%`);
                    speedSliderText.textContent = `${parseFloat(event.target.value).toFixed(2)}x`;
                });

                speedSlider.addEventListener('change', (event) => {
                    let speed = parseFloat(event.target.value);
                    player = document.querySelector('#movie_player');
                    if (player) {
                        customSpeedSelected = true;
                        player.setPlaybackRate(speed);
                        currentCustomSpeed = speed
                        let speedMenuCustom = panel.querySelector('#speed-menu-custom');
                        if (speedMenuCustom) {
                            let currentlyChecked = panel.querySelector('.ytp-menuitem[aria-checked="true"]');
                            if (currentlyChecked) {
                                currentlyChecked.setAttribute('aria-checked', 'false');
                            }
                            speedMenuCustom.setAttribute('aria-checked', 'true');
                        }
                        let customSpeedTextElement = settingsPanel.querySelector('#speed-menu-custom-text');
                        if (customSpeedTextElement) {
                            customSpeedTextElement.textContent = `${customText} (${parseFloat(currentCustomSpeed.toFixed(2))})`;
                        }
                    }
                });
            }

            player.removeEventListener('onPlaybackRateChange', playbackRateChange);
            player.addEventListener('onPlaybackRateChange', playbackRateChange);

            let backButton = panel.querySelector('#speed-back-button');
            if (backButton) {
                backButton.addEventListener('click', () => {
                    let bodyBackButton = document.querySelector('#original-back-button');
                    if (bodyBackButton) {
                        bodyBackButton.click();

                        setTimeout(() => {
                            settingsPanel.classList.remove('speed-menu-animate');
                            settingsButton.dispatchEvent(new Event('menuRefresh'));
                        }, 300);
                    }
                });
                backButton.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        let bodyBackButton = document.querySelector('#original-back-button');
                        if (bodyBackButton) {
                            bodyBackButton.click();

                            setTimeout(() => {
                                settingsPanel.classList.remove('speed-menu-animate');
                                settingsButton.dispatchEvent(new Event('menuRefresh'));
                            }, 300);
                        }
                    }
                });
            }
        }
    }

    function playbackRateChange() {
        let player = document.querySelector('#movie_player');
        let currentSpeed = player.getPlaybackRate();
        let settingsPanel = player.querySelector('.ytp-settings-menu');
        let speedMenuItems = settingsPanel.querySelectorAll('.speed-menu-item');

        if (!customSpeedSelected) {
            speedMenuItems.forEach(item => {
                if (parseFloat(item.id.split('speed-menu-item-')[1]) === currentSpeed) {
                    item.parentElement.setAttribute('aria-checked', 'true');
                }
                else {
                    item.parentElement.setAttribute('aria-checked', 'false');
                }
            });
        }
    }

    function playbackButtonAnimate() {
        let player = document.querySelector('#movie_player');
        let settingsPanel = player.querySelector('.ytp-settings-menu');
        if (settingsPanel) {
            settingsPanel.classList.add('speed-menu-animate');
        }
    }

    let forcePlabackSpeed_timeout = false;
    function forcePlabackSpeed() {
        let player = false;
        if (watchPage()) {
            player = document.querySelector('#movie_player');
        }
        else if (shortsPage()) {
            player = document.querySelector('#shorts-player');
        }

        if (player && player.setPlaybackRate && player.getPlaybackRate) {
            let currentSpeed = player.getPlaybackRate();
            if (currentSpeed !== forcedPlaybackSpeed) {
                player.setPlaybackRate(forcedPlaybackSpeed);
            }
        }
        else {
            clearTimeout(forcePlabackSpeed_timeout);
            forcePlabackSpeed_timeout = setTimeout(forcePlabackSpeed, 100);
            return;
        }
    }

    let forceQuality_timeout = false;
    function forceQuality() {
        let player = false;
        if (watchPage()) {
            player = document.querySelector('#movie_player');
        }
        else if (shortsPage()) {
            player = document.querySelector('#shorts-player');
        }
        if (player && player.setPlaybackQualityRange && player.getAvailableQualityLevels && player.getAvailableQualityLevels().length > 0) {

            let quality = false;
            let qualities = player.getAvailableQualityLevels();

            if (forcedPlaybackQuality === 'highest') {
                quality = qualities[0];
            }

            else if (forcedPlaybackQuality === 'lowest') {
                quality = qualities[qualities.length - 2];
            }

            if (qualities.includes(forcedPlaybackQuality)) {
                quality = forcedPlaybackQuality;
            }

            else {
                let qualityValues = [
                    'highres',
                    'hd2160',
                    'hd1440',
                    'hd1080',
                    'hd720',
                    'large',
                    'medium',
                    'small',
                    'tiny'
                ];
                let currentIndex = qualityValues.indexOf(forcedPlaybackQuality);
                for (let i = 0; i < qualityValues.length; i++) {
                    let lowerIndex = currentIndex - i;
                    let higherIndex = currentIndex + i;

                    if (lowerIndex >= 0 && qualities.includes(qualityValues[lowerIndex])) {
                        quality = qualityValues[lowerIndex];
                        break;
                    }

                    else if (higherIndex < qualityValues.length && qualities.includes(qualityValues[higherIndex])) {
                        quality = qualityValues[higherIndex];
                        break;
                    }
                }
            }
            player.setPlaybackQualityRange(quality);
            currentQuality = quality;

            if (forcePlaybackQuality || playbackQualityListenerPlayer !== player.id) {
                player.addEventListener('onPlaybackQualityChange', () => {
                    let currentPlayerQuality = player.getPlaybackQuality();
                    if (currentPlayerQuality !== currentQuality) {
                        forceQuality();
                        forcePlaybackQuality = false;
                        playbackQualityListenerPlayer = player.id;
                    }
                });
            }
        }
        else {
            clearTimeout(forceQuality_timeout);
            forceQuality_timeout = setTimeout(forceQuality, 100);
            return;
        }
    }

    let fixMiniplayerButton_timeout = false;
    function fixMiniplayerButton() {
        let miniplayerButton = document.querySelector('.ytp-pip-button');
        if (miniplayerButton) {
            miniplayerButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                document.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'i',
                        code: 'KeyI',
                        keyCode: 73,
                        which: 73,
                        bubbles: true
                    })
                );
            }, true);
            miniplayerButtonFixed = true;
        }
        else {
            clearTimeout(fixMiniplayerButton_timeout);
            fixMiniplayerButton_timeout = setTimeout(fixMiniplayerButton, 100);
            return;
        }
    }

    let fixFullscreenTitleLink_timeout = false;
    function fixFullscreenTitleLink() {
        let player = document.querySelector('#movie_player');
        if (player && player.querySelector('.ytp-title-link')) {
            let title = player.querySelector('.ytp-title-link');
            title.href = 'https://www.youtube.com/watch?v=' + window.location.href.split('v=')[1].split('&')[0];
        }
        else {
            clearTimeout(fixFullscreenTitleLink_timeout);
            fixFullscreenTitleLink_timeout = setTimeout(fixFullscreenTitleLink, 100);
            return;
        }
    }

    let fixFullscreenButton_timeout = false;
    function fixFullscreenButton() {
        let fullscreenButton = document.querySelector('.ytp-fullscreen-button');
        if (fullscreenButton) {
            fullscreenButtonFixed = true;
            fullscreenButton.addEventListener('click', () => {
                if (document.fullscreenElement && watchPage()) {
                    document.exitFullscreen();
                }
            });
        }
        else {
            clearTimeout(fixFullscreenButton_timeout);
            fixFullscreenButton_timeout = setTimeout(fixFullscreenButton, 100);
            return;
        }
    }

    let fixDoubleClickFullscreen_timeout = false;
    function fixDoubleClickFullscreen() {
        let player = document.querySelector('#movie_player');
        if (player && player.querySelector('video')) {
            let video = player.querySelector('video');
            doubleClickFullscreenFixed = true;
            video.addEventListener('dblclick', () => {
                if (document.fullscreenElement && watchPage()) {
                    document.exitFullscreen();
                }
            });
        }
        else {
            clearTimeout(fixDoubleClickFullscreen_timeout);
            fixDoubleClickFullscreen_timeout = setTimeout(fixDoubleClickFullscreen, 100);
            return;
        }
    }

    function removeMiniplayer() {
        let miniplayer = document.querySelector('ytd-miniplayer');
        if (miniplayer) {
            miniplayer.remove();
        }
    }

    document.addEventListener('yt-navigate', () => {
        if (watchPage()) {
            injectEmbedClass();
            if (!modernVideoTitle) {
                fixFullscreenTitleLink();
            }
            if (oldPlaybackSpeedMenu) {
                oldPlaybackSpeedUI();
            }
            if (!fullscreenAnimation) {
                if (!fullscreenButtonFixed) {
                    fixFullscreenButton();
                }
                if (!doubleClickFullscreenFixed) {
                    fixDoubleClickFullscreen();
                }
            }
            if (miniplayerEnabled && !miniplayerButtonFixed) {
                fixMiniplayerButton();
            }
        }
        else if (!miniplayerEnabled) {
            removeMiniplayer();
        }

        if (watchPage() || (shortsPage() && forcePlaybackSpeedOnShorts)) {
            if (forcedPlaybackQuality !== 'auto') {
                forceQuality();
            }
            if (forcedPlaybackSpeed) {
                forcePlabackSpeed();
            }
        }
    });

    if (watchPage()) {
        if (oldPlaybackSpeedMenu) {
            oldPlaybackSpeedUI();
        }
        injectEmbedClass();
        if (forcedPlaybackQuality !== 'auto') {
            forceQuality();
        }
        if (!fullscreenAnimation) {
            fixFullscreenButton();
            fixDoubleClickFullscreen();
        }
        if (!modernVideoTitle) {
            fixFullscreenTitleLink();
        }
        if (miniplayerEnabled && !miniplayerButtonFixed) {
            fixMiniplayerButton();
        }
    }

    if (watchPage() || (shortsPage() && forcePlaybackSpeedOnShorts)) {
        if (forcedPlaybackQuality !== 'auto') {
            forceQuality();
        }
        if (forcedPlaybackSpeed) {
            forcePlabackSpeed();
        }
    }

    function isTextField(event) {
        let isTextField = event.target
        if (isTextField &&
            (
                isTextField.tagName.toLowerCase().indexOf('input') !== -1 ||
                isTextField.tagName.toLowerCase().indexOf('label') !== -1 ||
                isTextField.tagName.toLowerCase().indexOf('select') !== -1 ||
                isTextField.tagName.toLowerCase().indexOf('textarea') !== -1 ||
                isTextField.tagName.toLowerCase().indexOf('fieldset') !== -1 ||
                isTextField.tagName.toLowerCase().indexOf('legend') !== -1 ||
                isTextField.tagName.toLowerCase().indexOf('datalist') !== -1 ||
                isTextField.tagName.toLowerCase().indexOf('output') !== -1 ||
                isTextField.tagName.toLowerCase().indexOf('option') !== -1 ||
                isTextField.tagName.toLowerCase().indexOf('optgroup') !== -1 ||
                isTextField.getAttribute('id') === 'contenteditable-root'
            )
        ) {
            return true;
        }
        else {
            return false;
        }
    }

    function shortcuts(event) {
        if (event.altKey || event.ctrlKey || event.metaKey || !watchPage() || isTextField(event)) {
            return;
        }

        else if (event.key.toLowerCase() === 'f') {
            if (document.fullscreenElement) {
                event.preventDefault();
                event.stopImmediatePropagation();
                document.exitFullscreen();
            }
        }

        else if (event.key.toLowerCase() === 't') {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }

        if (!miniplayerEnabled) {
            if (event.key.toLowerCase() === 'i') {
                event.preventDefault();
                event.stopImmediatePropagation();
                let pipButton = document.querySelector('.ytp-pip-button');
                if (pipButton) {
                    pipButton.click();
                }
            }
        }
        if (!moreVideosInFullscreen) {
            if (event.key.toLowerCase() === 'v') {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }
    }

    window.addEventListener('keydown', shortcuts, true);

    document.addEventListener('animationstart', (event) => {
        if (event.animationName === 'classDetector' && watchPage()) {
            injectEmbedClass();
        }
    });

    let addCustomStyles_timeout = false;
    function addCustomStyles() {
        if (!document.head) {
            clearTimeout(addCustomStyles_timeout);
            addCustomStyles_timeout = setTimeout(addCustomStyles, 100);
            return;
        }

        let css = `
        @keyframes classDetector {
            from { outline-color: transparent; }
            to { outline-color: transparent; }
        }

        .ytp-hide-fullscreen-title,
        .ytp-fullscreen-metadata-top {
            animation: classDetector 1ms linear 1;
        }

        .ytp-settings-menu.speed-menu-animate .ytp-panel-animate-forward {
            width: 250px !important;
            height: 414px !important;
        }

        #original-back-button {
            display: none !important;
        }

        .ytp-next-button {
            display: block !important;
            cursor: pointer !important;
            opacity: 1 !important;
        }

        .ytp-autonav-toggle,
        .ytp-pip-button {
            display: inline-block !important;
            cursor: pointer !important;
            opacity: 1 !important;
        }

        .ended-mode .html5-endscreen {
            display: block !important;
        }

        .ytp-tooltip {
            animation: none !important;
            transition: none !important;
        }

        .ytp-tooltip:not(.ytp-preview) {
            transform: translateY(50%) !important;
        }

        .ytp-tooltip.ytp-preview {
            transform: translateY(6%) !important;
        }

        .ytp-overlay-bottom-right {
            transform: translateY(30%) !important;
        }

        body:not(.moreVideosInFullscreen) .ytp-fullscreen-grid,
        .ended-mode .ytp-fullscreen-grid,
        body:not(.playerQuickActions) .ytp-fullscreen-quick-actions,
        body:not(.modernVideoTitle) .ytPlayerOverlayVideoDetailsRendererHost {
            display: none !important;
        }

        .ytp-fullscreen-quick-actions {
            margin-top: -50px !important;
        }

        .ytp-overlay-top-left {
            margin-top: -50px !important;
        }

        .ytp-title-text {
            padding-left: 36px !important;
        }

        .ytp-title-link {
            cursor: pointer !important;
        }

        .ytp-cards-teaser,
        .ytp-cards-button,
        .ytp-playlist-menu-button {
            display: none !important;
        }

        body:not(.miniplayerEnabled) ytd-miniplayer,
        body:not(.miniplayerEnabled) .ytp-contextmenu .ytp-menuitem:nth-child(2) {
            display: none !important;
        }

        :fullscreen .ytp-size-button,
        :fullscreen .ytp-pip-button {
            top: -9999px !important;
            left: -9999px !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: fixed !important;
        }

        yt-notification-action-renderer:has(a[href*="support.google.com/youtube/answer/3037019#check_ad_blockers"]) {
            display: none !important;
        }
    `;

        let style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    addCustomStyles();

})();
