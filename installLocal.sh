#!/bin/sh

npm ci

cd ../canvas-engine
echo "Building canvas-engine"
sh build.sh
cd ../vr-shooter

cd ../vector-2d
echo "Building vector-2d"
sh build.sh
cd ../vr-shooter

# cd ../canvas-engine-devtools
# echo "Building canvas-engine-devtools"
# sh installLocal.sh
# sh build.sh
# cd ../canvas-engine-devtools

echo "Copying canvas-engine to vr-shooter"
rm -rf ./node_modules/@arekrado/canvas-engine 
mkdir ./node_modules/@arekrado/canvas-engine 
mkdir ./node_modules/@arekrado/canvas-engine/dist
cp -R ../canvas-engine/dist/* ./node_modules/@arekrado/canvas-engine/dist
cp -R ../canvas-engine/package.json ./node_modules/@arekrado/canvas-engine



echo "Copying vector-2d to vr-shooter"
rm -rf ./node_modules/@arekrado/vector-2d 
mkdir ./node_modules/@arekrado/vector-2d 
cp -R ../vector-2d/dist/* ./node_modules/@arekrado/vector-2d

# echo "Copying canvas-engine-devtools to vr-shooter"
# rm -rf ./node_modules/@arekrado/canvas-engine-devtools 
# mkdir ./node_modules/@arekrado/canvas-engine-devtools 
# cp -R ../canvas-engine-devtools/dist/* ./node_modules/@arekrado/canvas-engine-devtools

