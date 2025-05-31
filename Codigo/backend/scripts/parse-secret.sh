#/bin/sh

parse_secret() {
	local secret=$1
	echo $(echo $secret | jq -r 'to_entries[] | "\(.key)=\(.value)"')
}

export $(parse_secret $DATABASE) $(parse_secret $API)