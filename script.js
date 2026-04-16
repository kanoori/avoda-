
<script>
    let doors = {
    left: false,  // false = open, true = closed
    right: false
};
let seconds = 0;
const display = document.getElementById("timer");

// Start automatically when page loads
setInterval(() => {
  seconds++;
  display.textContent = seconds;
}, 1000);
function toggleDoor(side) {
    doors[side] = !doors[side];

    console.log(side + " door is now " + (doors[side] ? "CLOSED" : "OPEN"));

    // Optional visual change
    document.getElementById("office").style.filter =
        doors.left || doors.right ? "brightness(70%)" : "brightness(100%)";
}
let cameraOpen = false;


/* Camera Toggle */
function toggleCamera() {
    cameraOpen = !cameraOpen;

    document.getElementById("cameraView").style.display = cameraOpen ? "block" : "none";
    document.getElementById("camMap").style.display = cameraOpen ? "block" : "none";
    document.getElementById("static").style.display = cameraOpen ? "block" : "none";
}

/* Switch Cameras */
function switchCam(img) {
    document.getElementById("cameraView").style.backgroundImage = `url(${img})`;

    // Static flicker
    document.getElementById("static").style.opacity = Math.random();
}

/* Door + Light placeholders */
function toggleDoor(side) {
    console.log(side + " door toggled");
}

function toggleLight(side) {
    console.log(side + " light toggled");
}
</script>
