git checkout gh-pages
cp -r compiled downloads
git add downloads
git commit -m "Sync downloads folder with master"
git checkout master

