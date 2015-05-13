#!/bin/bash

components=(
  "basic-accessible-list"
  "basic-arrow-direction"
  "basic-aspect"
  "basic-autosize-textarea"
  "basic-carousel"
  "basic-carousel-fit"
  "basic-children-content"
  "basic-content-items"
  "basic-data-items"
  "basic-direction-selection"
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
  "basic-timer-selection"
  "basic-trackpad-direction"
)


update () {
  component=$1
  pushd repos/${component} > /dev/null

  # Put the commands you want to run against individual component repos below.
  echo "Processing" ${component}
  #git commit -am "Update README"
  #git push

  popd > /dev/null
}


for component in ${components[*]}; do
  update ${component}
done
