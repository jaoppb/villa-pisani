#!/bin/sh

parse() {
	tmp=$(mktemp)
	jq -r 'to_entries[] | "export \(.key)=\(.value | @sh)"' > ${tmp}
	echo $tmp
}

API_TEMP=$(echo $API | parse)
DATABASE_TEMP=$(echo $DATABASE | parse)

source $API_TEMP
source $DATABASE_TEMP

rm -f $API_TEMP $DATABASE_TEMP