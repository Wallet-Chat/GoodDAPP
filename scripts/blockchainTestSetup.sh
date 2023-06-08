#!/bin/bash
cp -R node_modules/@gooddollar/goodprotocol /tmp
pushd /tmp/goodprotocol
export MNEMONIC='test test test test test test test test test test test junk'
export ADMIN_MNEMONIC='test test test test test test test test test test test junk'
yarn set version berry
yarn --immutable
yarn add node-jq
yarn rebuild
ls -la node_modules/node-jq/bin
npx patch-package
yarn runNode &
yarn deployTest
yarn minimize
popd
cp -R /tmp/goodprotocol/artifacts node_modules/@gooddollar/goodprotocol/
cp -R /tmp/goodprotocol/releases node_modules/@gooddollar/goodprotocol/
