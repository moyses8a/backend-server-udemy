cd existing_repo
git remote rename origin old-origin
git remote add origin git@gitlab.com:Moyses8a/backend-server-udemy.git
git push -u origin --all
git push -u origin --tags