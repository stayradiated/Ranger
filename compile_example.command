cd "$(dirname "$0")"
if [ ! -d node_modules ]; then
  npm install
fi
./node_modules/coffee-scrunch/bin/scrunch.js lib/controllers/ranger.js --compile -o example/js/ranger.js
