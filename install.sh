#!/bin/bash
set -e

CYAN='\033[38;5;39m'
BLUE='\033[38;5;33m'
WHITE='\033[1;37m'
DIM='\033[2m'
RESET='\033[0m'

clear
echo -e "${CYAN}"
cat << "BANNER"
   __        __                  _                   
   \ \      / /_ ___   _____ ___| |_ _ __ __ _ _ __  
    \ \ /\ / / _` \ \ / / _ / __| __| '__/ _` | '_ \ 
     \ V  V | (_| |\ V |  __\__ | |_| | | (_| | |_) |
      \_/\_/ \__,_| \_/ \___|___/\__|_|  \__,_| .__/ 
            ~ ~  ~   ~  ~   ~  ~   ~  ~       |_|    
BANNER
echo -e "${WHITE}  Wavestrap for macOS ${DIM}• Custom Roblox Bootstrapper${RESET}\n"

echo -e "${BLUE}▸${RESET} Downloading Wavestrap source..."
rm -rf "$HOME/Wavestrap"
git clone -q "https://$(echo github.com)/cyberexotics402-a11y/Wavestrap.git" "$HOME/Wavestrap"

echo -e "${BLUE}▸${RESET} Installing dependencies..."
cd "$HOME/Wavestrap"
npm install --silent --no-fund --no-audit >/dev/null 2>&1

echo -e "${BLUE}▸${RESET} Packaging Wavestrap.app..."
ARCH=$(uname -m | sed 's/x86_64/x64/')
npx --yes @electron/packager . Wavestrap --platform=darwin --arch="$ARCH" --icon=icon.icns --overwrite --out=dist >/dev/null 2>&1

echo -e "${BLUE}▸${RESET} Installing to /Applications..."
rm -rf /Applications/Wavestrap.app
cp -R dist/Wavestrap-darwin-*/Wavestrap.app /Applications/Wavestrap.app
touch /Applications/Wavestrap.app

echo -e "\n${CYAN}✓ Wavestrap installed successfully!${RESET} ${DIM}Launching...${RESET}\n"
open /Applications/Wavestrap.app
