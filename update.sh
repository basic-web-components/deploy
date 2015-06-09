#!/bin/bash

components=(
  "basic-accessible-list"
  "basic-arrow-direction"
  "basic-aspect"
  "basic-autosize-textarea"
  "basic-button"
  "basic-carousel"
  "basic-carousel-fit"
  "basic-children-content"
  "basic-content-items"
  "basic-data-items"
  "basic-direction-selection"
  "basic-fade-overflow"
  "basic-framed-content"
  "basic-item-selection"
  "basic-keyboard"
  "basic-keyboard-direction"
  "basic-keyboard-paging"
  "basic-keyboard-prefix-selection"
  "basic-list-box"
  "basic-page-dots"
  "basic-selection-highlight"
  "basic-selection-scroll"
  "basic-shared"
  "basic-sliding-viewport"
  "basic-sliding-viewport-fit"
  "basic-spread-fit"
  "basic-spread-items"
  "basic-stack"
  "basic-swipe-direction"
  "basic-tap-selection"
  "basic-text-extractor"
  "basic-timer-selection"
  "basic-trackpad-direction"
)


update () {
  component=$1
  pushd repos/${component} > /dev/null

  # Put the commands you want to run against individual component repos below.
  echo "Processing" ${component}

  # To commit changes
  # git commit -am "Update README"
  # git push

  # To tag
  # git tag -a v0.6.1-pre -m 'v0.6.1-pre'
  # git push origin v0.6.1-pre

  # To release
  # VERSION="0.6.0"
  # API_JSON=$(printf '{"tag_name": "v%s","target_commitish": "master","name": "v%s","draft": false,"prerelease": false}' $VERSION $VERSION)
  # curl --data "${API_JSON}" https://api.github.com/repos/basic-web-components/${component}/releases?access_token=$GITHUB_TOKEN

  popd > /dev/null
}


for component in ${components[*]}; do
  update ${component}
done
