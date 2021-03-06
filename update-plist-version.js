const fs = require('fs');
const readline = require('readline');

var appversion = require('./package.json').version;

var outputString = '';
var foundCFBundleVersion = false;
var foundCFBundleShortVersionString = false;

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

require('fs').readFileSync('./QtProject/release-build/macos/Info.plist', 'utf-8').split(/\r?\n/).forEach(function(line){
    if(foundCFBundleVersion == true){
        var beforeString = line.slice(0, getPosition(line, '>', 1) + 1);
        var afterString = line.slice(getPosition(line, '<', 2));
        line = beforeString + appversion + afterString;
        foundCFBundleVersion = false;
    }
    if(foundCFBundleShortVersionString == true){
        var beforeString = line.slice(0, getPosition(line, '>', 1) + 1);
        var afterString =line.slice(getPosition(line, '<', 2));
// Before : through short version needed to be short, but in fact no !! It's just a possibility offered by Apple, but it can be identical ! However, this short version must be unique between releases on the apple store, so if want to publish "patch" releases, must use longer version.
//        line = beforeString + appversion.substring(0, appversion.lastIndexOf('.')) + afterString;
        line = beforeString + appversion + afterString;
        foundCFBundleShortVersionString = false;
    }
    if(line.includes('CFBundleVersion')){
        foundCFBundleVersion = true;
    }
    if(line.includes('CFBundleShortVersionString')){
        foundCFBundleShortVersionString = true;
    }

    outputString += line + "\n";
    })

outputString = outputString.substring(0, outputString.length -1); //remove last new line
fs.writeFile('./QtProject/release-build/macos/Info.plist', outputString, 'utf-8', function (err) {
    if (err) return console.log(err);
    console.log('Wrote updated Plist file');
});
