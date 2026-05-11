let doors = {
    left: false,
    right: false
};
let doorTimers = { left: null, right: null };
let doorCooldowns = { left: false, right: false };

const DOOR_OPEN_TIME = 5000;
const DOOR_COOLDOWN = 3000;
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
    monsters.kanoori.speed += 0.0009;
    monsters.linny.speed += 0.001;
    monsters.sheleg.speed += 0.0015;
    monsters.jewel.speed += 0.002;

    console.log("Night getting harder...");
}, 30000);



function moveMonster(name) {
    let m = monsters[name];


    let lookingAtMonster = cameraOpen && currentCam === getMonsterCam(name);
    let effectiveSpeed = m.speed;

    if (!lookingAtMonster) {
        effectiveSpeed += 0.01;
    }

    if (getMonsterCam(name) === "door") {
    let side;

    if (name === "kanoori" || name === "jewel") {
    side = "left";
    } else {
    side = "right";
}
        if (doors[side]) {
            effectiveSpeed += 0.02;
        }
    }

    if (Math.random() < effectiveSpeed) {
        if (m.step < m.path.length - 1) {
            m.step++;
            console.log(name + " moved to", m.path[m.step]);
        }
    }
}



function checkJumpscare() {
    if (gameOver === true) return;

    for (let name in monsters) {
        let m = monsters[name];

        if (getMonsterCam(name) === "door") {

            let side = (name === "kanoori" || name === "jewel") ? "left" : "right";

            if (doors[side] === false) {
                triggerGameOver(name);
                return;
            } else {

                console.log(name + " blocked! Returning to start.");
                

                m.step = 0; 
                

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
    if (gameOver) return;

    if (doorCooldowns[side]) {
        console.log(side + " door is overheating! Wait for cooldown.");
        return;
    }

  
    if (doors[side] === false) {

        doors[side] = true;
        console.log(side + " door is now CLOSED");


        doorTimers[side] = setTimeout(() => {
            autoOpenDoor(side);
        }, DOOR_OPEN_TIME);

    } else {

        autoOpenDoor(side);
    }

    updateVisuals();
}

function autoOpenDoor(side) {
    doors[side] = false;
    clearTimeout(doorTimers[side]);
    console.log(side + " door forced OPEN (Cooldown started)");


    doorCooldowns[side] = true;
    setTimeout(() => {
        doorCooldowns[side] = false;
        console.log(side + " door cooldown finished");
    }, DOOR_COOLDOWN);

    updateVisuals();
}

function updateVisuals() {
    if (doors.left === true || doors.right === true) {
        document.getElementById("office").style.filter = "brightness(70%)";
    } else {
        document.getElementById("office").style.filter = "brightness(100%)";
    }
}
function toggleCamera() {
    cameraOpen = !cameraOpen;

    const zapButton = document.getElementById("zapBtn");

    if (cameraOpen) {
        document.getElementById("cameraView").style.display = "block";
        document.getElementById("camMap").style.display = "block";
        document.getElementById("static").style.display = "block";

        zapButton.style.display = "inline-block";
    } else {
        document.getElementById("cameraView").style.display = "none";
        document.getElementById("camMap").style.display = "none";
        document.getElementById("static").style.display = "none";

        zapButton.style.display = "none";
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
function zapMonstersOnCam() {
    if (gameOver) return;
    if (!cameraOpen) {
        console.log("Open a camera first!");
        return;
    }

    let anyZapped = false;

    for (let name in monsters) {
        let m = monsters[name];


        if (getMonsterCam(name) === currentCam) {
            if (m.step > 0) {
                m.step--; 
                console.log(name + " was zapped back to room " + m.path[m.step]);
                anyZapped = true;
            } else {
                console.log(name + " is already at the start and can't be zapped further.");
            }
        }
    }

    if (!anyZapped) console.log("No monsters on this camera to zap.");
    
    switchCam(currentCam);
}
let zapCooldown = false;
const ZAP_COOLDOWN_TIME = 3000; 

function zapMonstersOnCam() {
    if (gameOver) return; 
    if (!cameraOpen) {
        console.log("Open a camera first!");
        return;
    }

    if (zapCooldown) {
        console.log("Zap is on cooldown!");
        return;
    }

    let anyZapped = false;

    for (let name in monsters) {
        let m = monsters[name];

        if (getMonsterCam(name) === currentCam) {
            if (m.step > 0) {
                m.step--;
                console.log(name + " was zapped back to room " + m.path[m.step]);
                anyZapped = true;
            } else {
                console.log(name + " is already at the start and can't be zapped further.");
            }
        }
    }

    if (!anyZapped) console.log("No monsters on this camera to zap.");

    switchCam(currentCam); 


    zapCooldown = true;
    document.getElementById("zapBtn").disabled = true;

    setTimeout(() => {
        zapCooldown = false;
        document.getElementById("zapBtn").disabled = false;
        console.log("Zap ready!");
    }, ZAP_COOLDOWN_TIME);
}
let zapSound = new Audio('zap.wav');
zapSound.play();
