#!/bin/bash

node ../frontend/node_modules/.bin/abi-types-generator ../frontend/src/contracts/nft.abi.json --output ../frontend/src/contracts
node ../frontend/node_modules/.bin/abi-types-generator ../frontend/src/contracts/paymentToken.abi.json --output ../frontend/src/contracts
node ../frontend/node_modules/.bin/abi-types-generator ../frontend/src/contracts/marketplace.abi.json --output ../frontend/src/contracts
node ../frontend/node_modules/.bin/abi-types-generator ../frontend/src/contracts/egg.abi.json --output ../frontend/src/contracts
node ../frontend/node_modules/.bin/abi-types-generator ../frontend/src/contracts/sperm.abi.json --output ../frontend/src/contracts
