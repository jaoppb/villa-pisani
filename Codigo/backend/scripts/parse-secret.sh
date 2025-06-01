#!/bin/sh

parse() {
	jq -r 'to_entries[] | "export \(.key)=\(.value | @sh)"'
}

source <(echo $API | parse)
source <(echo $DATABASE | parse)