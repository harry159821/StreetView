npm -v && npm install && npm start

IF ERRORLEVEL 1 GOTO PY
exit

:PY
	echo "npm not found, try python as a http server..."
	cd src
	python -m http.server || python -m SimpleHTTPServer
	cd ..