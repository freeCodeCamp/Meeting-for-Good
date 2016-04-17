#!/bin/bash

set -o errexit # Exit on error

git stash save 'Before deploy' # Stash all changes before deploy
git checkout -b deploy
git merge development --no-edit # Merge in the master branch without prompting
npm run build # Generate the bundled Javascript and CSS
rm -r client
rm -r node_modules
rm -r server
cp package.json build
rm *
cp build/* .
git add -A
git commit -m "Deploy"
git push heroku deploy:master # Deploy to Heroku
git checkout development # Checkout master again
git branch -D deploy
git stash pop # And restore the changes
