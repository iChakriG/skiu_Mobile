#!/usr/bin/env bash
# Install iOS CocoaPods dependencies. Run from repo root: npm run ios:pod
set -e

# Ensure Homebrew is on PATH (common when opened from IDE or before .zshrc runs)
for brew_prefix in /opt/homebrew /usr/local; do
  if [[ -x "$brew_prefix/bin/brew" ]]; then
    eval "$("$brew_prefix/bin/brew" shellenv 2>/dev/null)" || true
    export PATH="$brew_prefix/bin:$PATH"
    break
  fi
done

# Require full Xcode (not only Command Line Tools). iOS SDK is needed for glog and the app.
XCODE_SELECT="$(xcode-select -p 2>/dev/null)"
if [[ "$XCODE_SELECT" == *"CommandLineTools"* ]] || [[ -z "$(xcodebuild -version 2>/dev/null | head -1)" ]]; then
  echo "Full Xcode is required for iOS build (Command Line Tools are not enough)."
  echo ""
  echo "  1. Install Xcode from the App Store if you have not."
  echo "  2. Point the active developer directory to Xcode:"
  echo "     sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  echo "  3. Open Xcode once to accept the license if prompted."
  echo "  4. Run again: npm run ios:pod"
  echo ""
  exit 1
fi
if ! xcrun --sdk iphoneos --show-sdk-path &>/dev/null; then
  echo "The iOS SDK (iphoneos) was not found. Use full Xcode, not only Command Line Tools:"
  echo "  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  echo ""
  exit 1
fi

IOS_DIR="$(dirname "$0")/../ios"
cd "$IOS_DIR"

if ! command -v pod >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "Installing CocoaPods with Homebrew..."
    brew install cocoapods
  else
    echo "CocoaPods and Homebrew are not available. Run these commands in your terminal:"
    echo ""
    echo "  # 1. Install Homebrew (one-time)"
    echo '  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo ""
    echo "  # 2. Add Homebrew to PATH (Apple Silicon: use the two lines the installer prints)"
    echo "  #    Usually: eval \"\$(/opt/homebrew/bin/brew shellenv)\""
    echo ""
    echo "  # 3. Install CocoaPods"
    echo "  brew install cocoapods"
    echo ""
    echo "  # 4. Install iOS pods and run app"
    echo "  cd $(cd "$IOS_DIR" && pwd) && pod install && cd .. && npm run ios"
    echo ""
    exit 1
  fi
fi

# Clear glog cache so a previous failed build (e.g. with Command Line Tools) is not reused
pod cache clean glog 2>/dev/null || true

pod install
echo "Done. You can run: npm run ios"
