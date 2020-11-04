"use strict";

console.log("NodeJs Interpreter starts executing Javascript code");

/* Async programming *****************************************************/
const fs = require("fs");

// global variables
let file1Loaded = false;
let file1Content = null
let file2Loaded = false;
let file2Content = null;

fs.readFile("some_file.txt", "utf8", (err, fileContent) => {
    if (err) throw err;
    file1Loaded = true;
    file1Content = fileContent;
    DisplayFiles(); // see below
});

fs.readFile("other_file.txt", "utf8", (err, fileContent) => {
    if (err) throw err;
    file2Loaded = true;
    file2Content = fileContent;
    DisplayFiles(); // see below
});

function DisplayFiles() {
    // display only when both files are loaded
    if (file1Loaded && file2Loaded) {
        console.log(file1Content + file2Content);
    }else{
        console.log('not Ready yet \n');
    }
}

// this will be displayed first while waiting for files to be loaded
console.log("Hello TEST123");
