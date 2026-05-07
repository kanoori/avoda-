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

    kanoori: {
        path: [0, 1, 3, 5, 8, "door"],
        step: 0,
        speed: 0.02
    },

    linny: {
        path: [2, 4, 6, 8, "door"],
        step: 0,
        speed: 0.03
    },

    sheleg: {
        path: [5, 7, 9, 10, "door"],
        step: 0,
        speed: 0.04
    },

    jewel: {
        path: [7, 3, 1, 6, 10, "door"],
        step: 0,
        speed: 0.05
    }
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

        if (m.step < m.path.length - 1) {

            m.step++;

            console.log(
                name + " moved to",
                m.path[m.step]
            );
        }
    }
}



function checkJumpscare() {
    if (gameOver === true) return;

    for (let name in monsters) {
        let m = monsters[name];

        if (getMonsterCam(name) === "door"){

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

function getMonsterCam(name) {

    let m = monsters[name];

    return m.path[m.step];
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

    let monstersHere = [];

    for (let name in monsters) {

        if (getMonsterCam(name) === camIndex) {
            monstersHere.push(name);
        }
    }

    let imageName = "cam" + (camIndex + 1);

    if (monstersHere.length > 0) {
        imageName += "_" + monstersHere.join("_");
    }

    imageName += ".png";

    console.log(imageName);

    document.getElementById("cameraView").style.backgroundImage =
        "url('images/" + imageName + "')";

    document.getElementById("static").style.opacity =
        Math.random() * 0.4;
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
