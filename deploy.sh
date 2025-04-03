#!/bin/bash

cd deploy

pnpm build

pnpm run start $1 $2