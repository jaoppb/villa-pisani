#!/bin/sh

export TMPDIR=$(mkdir -p $(mktemp -d -p ./ -u))

parse() {
	tmp=$(mktemp -u)
	jq -r 'to_entries[] | "export \(.key)=\(.value | @sh)"' > ${tmp}
	echo $tmp
}

API_TEMP=$(echo $API | parse)
DATABASE_TEMP=$(echo $DATABASE | parse)

source $API_TEMP
source $DATABASE_TEMP

rm -rf $TMPDIR