let doors = {
    left: false,
    right: false
};
let gameOver = false;
let cameraOpen = false;
let currentCam = 0;
let seconds = 0;

const display = document.getElementById("timer");

const totalCams = 11;

const monsters = {
    kanoori: { cam: 0, speed: 0.01 },
    linny: { cam: 2, speed: 0.03 },
    sheleg: { cam: 5, speed: 0.06 },
    jewel: { cam: 7, speed: 0.08 }
};



setInterval(() => {
    seconds++;
    display.textContent = seconds;
}, 1000);


setInterval(() => {
    moveMonster("kanoori");
    moveMonster("linny");
    moveMonster("sheleg");
    moveMonster("jewel");

    checkJumpscare();
}, 1000);


setInterval(() => {
    monsters.kanoori.speed += 0.002;
    monsters.linny.speed += 0.003;
    monsters.sheleg.speed += 0.004;
    monsters.jewel.speed += 0.005;

    console.log("Night getting harder...");
}, 30000);



function moveMonster(name) {
    let m = monsters[name];

    if (Math.random() < m.speed) {

        if (name === "linny" && currentCam === m.cam) {
            return;
        }


        if (name === "jewel") {
            if (Math.random() < 0.5) {
                m.cam += 2;
            } else {
                m.cam += 1;
            }
        } else {
            m.cam += 1;
        }


        if (m.cam >= totalCams) {
            m.cam = "door";
        }

        console.log(name + " moved to", m.cam);
    }
}



function checkJumpscare() {
    if (gameOver === true) return;

    for (let name in monsters) {
        let m = monsters[name];

        if (m.cam === "door") {

            let side;

            if (Math.random() < 0.5) {
                side = "left";
            } else {
                side = "right";
            }

            if (doors[side] === false) {

                triggerGameOver(name);
                return;

            } else {
                console.log(name + " blocked by " + side + " door");
                m.cam = 0;
            }
        }
    }
}



function checkCameraDanger() {
    for (let name in monsters) {
        let m = monsters[name];

        if (m.cam === currentCam) {
            console.log(name + " is on this camera!");
        }
    }
}



function toggleDoor(side) {

  
    if (doors[side] === false) {
        doors[side] = true;
    } else {
        doors[side] = false;
    }

    if (doors[side] === true) {
        console.log(side + " door is now CLOSED");
    } else {
        console.log(side + " door is now OPEN");
    }

    if (doors.left === true || doors.right === true) {
        document.getElementById("office").style.filter = "brightness(70%)";
    } else {
        document.getElementById("office").style.filter = "brightness(100%)";
    }
}


function toggleLight(side) {
    console.log(side + " light toggled");
}



function toggleCamera() {

    if (cameraOpen === false) {
        cameraOpen = true;
    } else {
        cameraOpen = false;
    }

    if (cameraOpen === true) {
        document.getElementById("cameraView").style.display = "block";
        document.getElementById("camMap").style.display = "block";
        document.getElementById("static").style.display = "block";
    } else {
        document.getElementById("cameraView").style.display = "none";
        document.getElementById("camMap").style.display = "none";
        document.getElementById("static").style.display = "none";
    }
}


function switchCam(camIndex) {
    currentCam = camIndex;

    document.getElementById("cameraView").style.backgroundImage =
        "url(cam" + (camIndex + 1) + ".png)";

    document.getElementById("static").style.opacity = Math.random();

    checkCameraDanger();
}
function triggerGameOver(monsterName) {
    gameOver = true;

    document.getElementById("gameOverText").textContent =
        monsterName + " got you!";

    document.getElementById("gameOverScreen").style.display = "flex";
}
function restartGame() {
    location.reload();
}
setInterval(() => {
    if (gameOver === true) return;

    moveMonster("kanoori");
    moveMonster("linny");
    moveMonster("sheleg");
    moveMonster("jewel");

    checkJumpscare();
}, 1000);
