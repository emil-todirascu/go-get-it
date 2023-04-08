function dragElement(element) {

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // let height = window.innerHeight;
    // let width = window.innerWidth;

    // console.log("height " + height)
    // console.log("width " + width)
    // console.log("toolBar " + toolBarH)
    // console.log(element);
    // console.log(element.id)
    document.getElementById(element.id + "-bar").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        // initial cursor pos
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        // new cursor pos
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;

        // update cursor pos
        pos3 = e.clientX;
        pos4 = e.clientY;
        console.log("cursor: " + pos3 + " " + pos4);

        // update window measurements
        let height = window.innerHeight - toolBarH;
        let width = window.innerWidth;

        // console.log("height " + height);
        // console.log("width " + width);

        // set new pos
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        console.log({newTop, newLeft})

        if (-1 < newTop && newTop < height - 5) {

            element.style.top = newTop + "px";
        }

        if (newLeft < width) {

            element.style.left = newLeft + "px";
        }
    }

    function closeDragElement() {

        let height = window.innerHeight - toolBarH;
        let width = window.innerWidth;
        console.log({height, width})
        
        if (pos3 <= 5) {
            element.style.top = 0 + "px";
            element.style.left = 0 + "px";
            element.style.width = parseInt(width) / 2 + "px";
            element.style.height = height + "px";
        } else if (pos4 <= 10) {
            element.style.top = 0 + "px";
            element.style.left = 0 + "px";
            element.style.width = width + "px";
            element.style.height = height + "px";
        } else if (pos3 >= width-11) {
            element.style.top = 0 + "px";
            element.style.left = parseInt(width) / 2 + "px";
            element.style.width = parseInt(width) / 2 + "px";
            element.style.height = height + "px";
        }

        // stop on mouse up
        document.onmouseup = null;
        document.onmousemove = null;
    }

}

function delWindow(id) {
    // Add animation
    document.getElementById("window" + id).remove();
}

function maxWindow(id) {
    win = document.getElementById("window" + id);

    let height = window.innerHeight - toolBarH;
    let width = window.innerWidth;

    if (win.style.width === width + "px" && win.style.height === height + "px" && win.style.top === 0 + "px" && win.style.left === 0 + "px") {

        console.log("already big")
        win.style.width = parseInt(width) / 2 + "px";
        win.style.height = parseInt(height) / 2 + "px";

        win.style.top = parseInt(height) / 4 + "px";
        win.style.left = parseInt(width) / 4 + "px";

    } else {

        win.style.top = 0 + "px";
        win.style.left = 0 + "px";
        win.style.width = width + "px";
        win.style.height = height + "px";

    }

}

windows = document.getElementsByClassName("window");
const toolBarH = document.getElementById("toolbar").clientHeight;

for (let i = 0; i < windows.length; i++) {
    // console.log(i);
    dragElement(windows[i]);
}
