	# Layout prefix is prepended to each markdown file synced
	###################################################################
	LAYOUT_PREFIX='---\r\nlayout: index\r\n---\r\n\r\n'

	# Sync the README.md in master to index.md adding jekyll header
	###################################################################
	
	git checkout master -- README.md
	echo $LAYOUT_PREFIX > index.md
	cat README.md >> index.md
	rm README.md