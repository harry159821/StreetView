#!/bin/sh
#
if ! type "npm" > /dev/null; then
	echo node.js or io.js runtime not found. Use python instead.
	pushd src 
	python -m http.server || python -m SimpleHTTPServer
	popd
	exit
fi

echo Installing dependencies...
npm install
echo Run server...
npm start
