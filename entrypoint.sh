#!/bin/bash
echo "-> Starting $TROCA_APP_NAME"

echo "### Introducing parameters on NPM & Yarn Files ###"
echo "//npm-proxy.fury.io/trocafone/:_authToken=${FURY_PUSH_TOKEN}" > ~/.npmrc
echo "registry: \"//npm-proxy.fury.io/trocafone/\"" >> ~/.npmrc
echo "always-auth=true" >> ~/.npmrc
echo "registry \"https://npm-proxy.fury.io/trocafone/\"" > ~/.yarnrc
echo "Done 1/2"
echo "Entry point args: ${*:-<none>}"

test() {
     echo "#### Running test ####"
     npm run test
}

push () {
    echo "#### Removing Docker File ####"
    rm Dockerfile
    echo "#### Removing Entrypoint File ####"
    rm entrypoint.sh
    echo "#### Images Build ####"
    yarn build
    cd build/package
    echo "#### Create TGZ file ####"
    npm pack
    echo "#### Pushing TGZ to GemFury ####"
    curl -F package=@"$(echo $TROCA_APP_NAME-*.tgz)" https://$FURY_PUSH_TOKEN@push.fury.io/trocafone/
    echo "Done 2/2"
}

shell () {
    echo "Done 2/2"
    echo "Welcome to the Shell"
    sh
}

COMMAND=$1; shift
case $COMMAND in
    push)
        push $*
    ;;
    test)
        test $*
    ;;
    shell)
        shell $*
    ;;
    *)
        echo "[!] Invalid or no command specified [$COMMAND]. Available commands: start or shell"
        exit 1
    ;;
esac


