#!/bin/bash
set -euo pipefail

files=$(git diff --name-only @{upstream}.. | grep -E '(js|jsx|ts|tsx)$')

if [ "$files" ]; then
  npx eslint $files
  npx prettier --check $files
else
  echo "No JavaScript files to check"
fi
