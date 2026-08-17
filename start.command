#!/bin/bash
echo "======================================"
echo "  Spirit Root 本地预览服务器"
echo "======================================"
echo ""
cd "$(dirname "$0")/apps/web"
python3 -m http.server 3000 --directory dist
