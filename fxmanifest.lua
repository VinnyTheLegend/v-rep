fx_version "cerulean"

description "v-rep"
author "Vinny"
version '1.0.0'
repository ''

lua54 'yes'

games {
  "gta5",
  "rdr3"
}

ui_page 'web/build/index.html'

shared_scripts {
  'config.lua'
}

client_script "client/**/*"
server_script "server/**/*"

files {
	'web/build/index.html',
	'web/build/**/*',
}