#!/bin/bash
set -eo pipefail

files=$(git diff --name-only @{upstream}.. | grep -E '(js|jsx|ts|tsx)$')

if [ "$files" ]; then
  echo "$files" | xargs eslint
fi
