#!/usr/bin/env bash

BASEURL="https://github.com/chieffancypants/ddns-client"
LATEST_TAG=`curl -si $BASEURL/releases/latest | sed -En 's/^location:.*tag\/(.*)\r/\1/p'`
PACKAGE_URL="${BASEURL}/releases/download/${LATEST_TAG}/ddns-client.zip"

DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
DIR_PROJ_ROOT=$(cd "$DIR/.."; pwd)
cd $DIR_PROJ_ROOT

# Try to be safe about rm -rf by asking for confirmation to the full path
echo "Updating to $LATEST_TAG:"
echo -e "  $PACKAGE_URL\n"
echo "This will remove all files in $DIR_PROJ_ROOT (with the exception of .env)"
read -p "Continue [y/N] " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
    rm -rv $DIR_PROJ_ROOT/*
else
    echo -e "\n\nAborted."
    exit 1
fi

curl -sL $PACKAGE_URL --output ddns-client.zip
unzip ddns-client.zip
rm ddns-client.zip
