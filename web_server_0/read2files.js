"use strict";

console.log("NodeJs Interpreter starts executing Javascript code");

/* Async programming *****************************************************/
const fs = require("fs");

// global variables
let file1_loaded = false;
let file1_content = null;
let file2_loaded = false;
let file2_content = null;

fs.readFile("some_file.txt", "utf8", (err, file_content) => {
    if (err) throw err;
    file1_loaded = true;
    file1_content = file_content;
    DisplayFiles(); // see below
});

fs.readFile("other_file.txt", "utf8", (err, file_content) => {
    if (err) throw err;
    file2_loaded = true;
    file2_content = file_content;
    DisplayFiles(); // see below
});

function DisplayFiles() {
    // display only when both files are loaded
    if (file1_loaded && file2_loaded) {
        console.log(file1_content + file2_content);
    }
}

console.log("Hello TEST123");
