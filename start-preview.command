#!/bin/bash
cd "$(dirname "$0")/apps/web"
python3 -m http.server 3000 --directory dist
