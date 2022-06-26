console.log("Hello World!");

var x = 60;
var interval = 1000;
for (var i = 0; i < x; i++) {
    setTimeout(function () {
        console.log("Hello World!");
    }, i * interval)
}


