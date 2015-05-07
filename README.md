# deploy
Environment for deploying consolidated basic-web-components into their individual repositories

Description
===========
This repository implements a single Grunt task that copies files from each component
in the consolidated git repository, basic-web-components/basic-web-components, into each
component's individual git repository. It then indicates which individual repositories have
been updated and need to be committed and pushed.

Simply run grunt:

````grunt````

You will see a list of individual repositories that need updating. Change directory to
each listed repository and manually perform "git commit" and "git push" operations.

The grunt script works by cloning the consolidated basic-web-components repository to
the repos directory, and each of the Basic Web Components bower-registered component
repositories. The consolidated basic-web-components repository is the development
repository for all Basic Web Components, and work should be done only within that
repository, cloned elsewhere on your machine. Do not work on the files within the
deploy repository: it is only for deployment purposes.
