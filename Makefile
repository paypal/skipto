DATE=$(shell date +%I:%M%p)
CHECK=\033[32m✔ Done\033[39m
HR=\n\033[37m--------------------------------------------------\033[39m

# -*- Configuration -*-
SRC_DIR = ./src
BIN_PATH= ./node_modules/.bin
COMPILED_DIR = ./compiled

JS_SOURCES = \
  $(SRC_DIR)/js/skipTo.js \
  $(SRC_DIR)/js/dropMenu.js \

JS_MIN = $(COMPILED_DIR)/js/skipTo.min.js
JS_MAP = $(COMPILED_DIR)/js/skipTo.min.js.map

CSS_SOURCES =  \
	$(SRC_DIR)/less/skipTo.less \

CSS_MIN = $(COMPILED_DIR)/css/skipTo.css

# -*- Wordpress plugin -*-
WP_DIR = $(SRC_DIR)/WordPress/skipTo
WP_JS = ${WP_DIR}/js/skipTo.js
WP_CS = ${WP_DIR}/css/skipTo.css
WP_ZIP = ../../compiled/WordPress/skipTo.zip

# -*- Drupal plugin -*-
DRUPAL_JS = $(SRC_DIR)/Drupal/skipTo/js/skipTo.js
DRUPAL_CS = $(SRC_DIR)/Drupal/skipTo/css/skipTo.css
DRUPAL_TAR = ../../compiled/Drupal/skipTo.tar

# -*- programs and flags -*-
JSHINT ?= ${BIN_PATH}/jshint 
JSHINT_OPTS ?= --config ./$(SRC_DIR)/js/.jshintrc

UGLIFY ?= ${BIN_PATH}/uglifyjs
UGLIFY_OPT1 ?= -o
UGLIFY_OPT2 ?= --source-map

LESSC ?= ${BIN_PATH}/lessc
LESSC_OPTS ?= -x 

# -*- -*- -*-
# -*- BUILD SCRIPT -*--*-
# -*- -*- -*-

build:
	@echo "\n"
	@echo "\033[36mBuilding SkipTo Markup...\033[39m"
	@echo "${HR}"
	@printf "Running JSHint on JavaScript..."
	@echo "${HR}"
	@$(JSHINT) $(JS_SOURCES) $(JSHINT_OPTS)
	@echo "     ${CHECK}"


	@echo "${HR}"
	@printf "Compiling LESS"
	@echo "${HR}"
	@$(LESSC) $(LESSC_OPTS) $(CSS_SOURCES) > $(CSS_MIN)
	@cp $(CSS_MIN) $(WP_CS)
	@cp $(CSS_MIN) $(DRUPAL_CS)
	@echo "     ${CHECK}"

	@echo "${HR}"
	@printf "Compiling and minifying JavaScript..."
	@echo "${HR}"
	@$(UGLIFY)  $(JS_SOURCES) $(UGLIFY_OPT1) $(JS_MIN) $(UGLIFY_OPT2) $(JS_MAP)
	@cp $(JS_MIN) $(WP_JS) 
	@cp $(JS_MIN) $(DRUPAL_JS) 
	@echo "     ${CHECK}"

	@echo "${HR}"
	@printf "Creating Wordpress Zip file..."
	@echo "${HR}"
	@cd ./src/WordPress/ ; zip -r  ${WP_ZIP} skipTo;
	@echo "     ${CHECK}"

	@echo "${HR}"
	@printf "Creating Drupal Tar file..."
	@echo "${HR}"
	@cd ./src/drupal/ ; tar -cvf ${DRUPAL_TAR}  skipTo;
	@echo "     ${CHECK}"
	@echo "${HR}"
	@echo "\033[36mSuccess!\033[39m"
	@echo "${HR}"
	@echo "******** CSS Built and JS are built at ${DATE}*************** \n\n"

# -*- For Debugging JS -*-
#   @cat $(SRC_DIR)/js/skipTo.js $(SRC_DIR)/js/dropMenu.js > $(COMPILED_DIR)/js/skipTo.min.js	

wordpress:
	@printf "Creating Wordpress Zip file..."
	@cd ./src/WordPress/ ; zip -r  ${WP_ZIP} skipTo;
	@echo "     ${CHECK}"
	@echo "${HR}"
	@echo "\033[36mSuccess!\n\033[39m"

drupal:
	@printf "Creating Drupal Tar file..."
	@cd ./src/drupal/ ; tar -cvf ${DRUPAL_TAR}  skipTo;
	@echo "     ${CHECK}"
	@echo "${HR}"
	@echo "\033[36mSuccess!\n\033[39m"

clean:
	rm -r $(COMPILED_DIR)/js/* $(COMPILED_DIR)/css/*
	@echo "     ${CHECK}"

	rm -r  $(WP_JS) $(WP_CS)
	@echo "     ${CHECK}"
	rm -r  $(DRUPAL_JS) $(DRUPAL_CS)	
	@echo "     ${CHECK}"
	@echo "******** CSS and JS directories are cleaned at ${DATE}*************** " 	
