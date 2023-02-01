#!/usr/bin/env bash

BASEURL="https://github.com/chieffancypants/ddns-client"
DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
LATEST_TAG=`curl -si $BASEURL/releases/latest | sed -En 's/^location:.*tag\/(.*)\r/\1/p'`
PACKAGE_URL="${BASEURL}/releases/download/${LATEST_TAG}/ddns-client.zip"

DIR_CANONICAL=$(cd "$path"; pwd)
cd $DIR_CANONICAL

# Try to be safe about rm -rf by asking for confirmation to the full path
echo "Updating to $LATEST_TAG"
echo "This will remove all files in $DIR_CANONICAL (with the exception of .env)"
read -p "Continue [y/N] " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
    rm -rv $DIR_CANONICAL/*
else
    echo -e "\n\nAborted"
    exit 1
fi

curl -sL $PACKAGE_URL --output ddns-client.zip
unzip ddns-client.zip

