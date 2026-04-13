# BurritoTube

## Introduction
BurritoTube is a little script that returns the old Youtube player UI. It works by resetting the experimental flags and remaking some features. It also allows a bit of configuration.

## Installation

### Chrome

  1. Go to the Chrome Web Store and install a UserScript extension:
   [TamperMonkey for Chrome]([https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo])
  2. Click **Add to Chrome** to install TamperMonkey
  3. Paste this url into your browser: `about:extensions`
  4. Toggle `Developer Mode` on
  5. Click the TamperMonkey extension and scroll down a bit. Toggle the `Allow UserScripts` option on and restart your browser
  7. Install BurritoTube: [BurritoTube]([https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo])
  8. Open Youtube and enjoy!

### Firefox

  1. Go to the Firefox addons store and install a UserScript extension:
   [TamperMonkey for Firefox]([https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/])
  2. Click **Add to Firefox** to install TamperMonkey
  3. Install BurritoTube: [BurritoTube]([https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo])
  4. Open Youtube and enjoy!

## Configuration

BurritoTube allows configuration based on your preferences. To configure it, follow these instructions:
  1. Click the puzzle icon in the top of your browser, usually on the right
  2. select Tampermonkey and click an arrow next to BurritoTube in the installed UserScripts
  3. Click Edit; this will open a new window with the script
  4. There is a section called CONFIG, which is marked by /* START OF CONFIG */ and /* END OF CONFIG */
  5. Change a flag and click the 'File' button and then 'Save'

### Example
I want to force the HD video quality on all videos. I locate the `forcedPlaybackQuality` and change the value from 'auto' to 'hd1080'. I save the changes and refresh Youtube. There are a lot of instructions inside, so you should be able to do it easily.

## Issues
If you encounter any issues, please create an issue on Github by visiting this URL: ([https://github.com/issues]). Try to describe your problem clearly, so I can help you fix it.

## Updates
This script does not update automaticaly. You will have to manually click the `Update Scripts` button in the UserScripts menu. However, there probably won’t that many updates.
