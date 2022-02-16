window.oncontextmenu = function () {
    return false;
};

document.addEventListener("keydown", function(event){
    // console.log(event.key);
    // console.log(event.keyCode);
    const key = event.key || event.keyCode;
    const keyCode = event.keyCode;
    console.log(keyCode)
    console.log(event.ctrlKey);
    console.log(event.shiftKey);

    if (keyCode === 123) {
        return false;
    } else if ((event.ctrlKey && event.shiftKey && keyCode === 73) || (event.ctrlKey && event.shiftKey && keyCode === 74)) {
        event.preventDefault();
        return false;
    }
}, false);