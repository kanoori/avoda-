
let doors = {
    left: false,
    right: false
};
let timerInterval = null;
let loopsStarted = false;
let scoreSaved = false;
let gameStarted = false;
let doorTimers = { left: null, right: null };
let doorCooldowns = { left: false, right: false };
let doorThreats = {
    left: 0,
    right: 0
};

const DOOR_GRACE_TICKS = 3;
let switchCamSound = new Audio('sounds/switch.wav')
switchCamSound.loop = false;
let cam5StaticSound = new Audio('sounds/static5.mp3');
cam5StaticSound.loop = true;
let staticSound1 = new Audio('sounds/ambience.mp3');
staticSound1.loop = true;
let staticSound2 = new Audio('sounds/ambience.mp3');
staticSound2.loop=true;


document.getElementById("startBtn").addEventListener("click", () => {

    if (gameStarted) return;
    gameStarted = true;
    document.getElementById("startScreen").style.display = "none";

    staticSound1.play();
    staticSound2.play();

    loadHighScores();

    startGameLoops();
});
const DOOR_OPEN_TIME = 5000;
const DOOR_COOLDOWN = 3000;
let gameOver = false;
let cameraOpen = false;
let currentCam = 0;
let seconds = 0;

const display = document.getElementById("timer");

const totalCams = 10;

const hatulim = {

    kanoori: {
        path: [0, 1, 3, 5, 8, "door"],
        step: 0,
        speed: 0.01
    },

    linny: {
        path: [0,2, 4, 6, 8, "door"],
        step: 0,
        speed: 0.02
    },

    sheleg: {
        path: [2,5, 7, 8, 9, "door"],
        step: 0,
        speed: 0.03
    },

    jewel: {
        path: [0,7, 3, 1, 6, 9, "door"],
        step: 0,
        speed: 0.04
    }
};
function startGameLoops() {
    if (loopsStarted) return;
    loopsStarted = true;

timerInterval = setInterval(() => {
    seconds++;
    display.textContent = seconds;
}, 1000);

    setInterval(() => {
        movehatulim("kanoori");
        movehatulim("linny");
        movehatulim("sheleg");
        movehatulim("jewel");

        checkJumpscare();
    }, 3000);

    setInterval(() => {
        hatulim.kanoori.speed += 0.0009;
        hatulim.linny.speed += 0.001;
        hatulim.sheleg.speed += 0.0015;
        hatulim.jewel.speed += 0.002;
        console.log("kashe yoter");
    }, 30000);

}
function renderCam() {
    let hatulimHere = [];

    for (let name in hatulim) {
        const cam = gethatulimCam(name);

        if (cam === currentCam) {
            hatulimHere.push(name);
        }
    }

    let hatulimImages = "";

    for (let name of hatulimHere) {
        let pos = hatulPositions[name];

        hatulimImages += `
            <img class="hatul-${name}"
                 src="images/hatulim/${name}.png"
                 style="left:${pos.x*100}%; top:${pos.y*100}%;">
        `;  
    }

    document.getElementById("cameraView").innerHTML = `
        <img class="camBg" src="images/cams/cam${currentCam + 1}.png">
        
        ${hatulimImages}
    `;

    document.getElementById("static").style.opacity =
        Math.random() * 0.4;
}




function movehatulim(name) {
    let m = hatulim[name];


    let lookingAthatulim = cameraOpen && currentCam === gethatulimCam(name);
    let effectiveSpeed = m.speed;

    if (!lookingAthatulim) {
        effectiveSpeed += 0.005;
    }

    if (gethatulimCam(name) === "door") {
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
            console.log(name + " moved to", m.path[m.step]+1);
        }
    }
}

let jumpscareSound = new Audio('sounds/jumpscare.wav');
let sybau=0;
function checkJumpscare() {
    if (gameOver) return;

    let activeThreats = {
        left: 0,
        right: 0
    };

    for (let name in hatulim) {
        let m = hatulim[name];

        if (gethatulimCam(name) === "door") {

            let side;

            if (name === "kanoori" || name === "jewel") {
                side = "left";
            } else {
                side = "right";
            }

            if (doors[side]) {
                m.step = m.path.length - 3;
            } else {
                activeThreats[side]++;
            }
        }
    }

    doorThreats.left += activeThreats.left;
    doorThreats.right += activeThreats.right;

    if (activeThreats.left === 0) {
        doorThreats.left = 0;
    }

    if (activeThreats.right === 0) {
        doorThreats.right = 0;
    }

    if (doorThreats.left >= DOOR_GRACE_TICKS ||
        doorThreats.right >= DOOR_GRACE_TICKS) {

        triggerGameOver();
    }
}

function gethatulimCam(name) {

    let m = hatulim[name];

    return m.path[m.step];
}
let doorSound = new Audio('sounds/door.mp3');
function toggleDoor(side) {
    doorSound.play();
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
    const office = document.getElementById("office");
    if (doors.left === true || doors.right === true) {
        office.style.filter = "brightness(70%)"
    } else {
       office.style.filter = "brightness(100%)";
    }
}
let cameraSound = new Audio('sounds/camera.mp3')
function toggleCamera() {
    cameraOpen = !cameraOpen;
    cameraSound.play();
    
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
const hatulPositions = {
    kanoori: { x: 0.0001, y: 0.36},
    linny:   { x: 0.46,  y: 0.47 },
    sheleg:  { x: 0.2,  y: 0.3 },
    jewel:   { x: 0.73,  y: 0.6}
};
function switchCam(camIndex) {
    switchCamSound.currentTime = 0;
    switchCamSound.play();

    currentCam = camIndex;

    if (camIndex !== 4) {
        cam5StaticSound.pause();
        cam5StaticSound.currentTime = 0;
    }

    if (camIndex === 4) {
        cam5StaticSound.loop = true;
        cam5StaticSound.play();
    }

    renderCam();
} 
setInterval(() => {
    if (cameraOpen) {
        renderCam();
    }
}, 100); 
function triggerGameOver(hatulimName) {

    if (gameOver) return;
        clearInterval(timerInterval);
    gameOver = true;

    document.getElementById("gameOverText").textContent =
        hatulimName + " got you!";

    document.getElementById("gameOverScreen").style.display = "flex";

    saveHighScore(seconds);

    loadHighScores();
}
async function saveHighScore(time) {
    if (scoreSaved) return;

    if (!Number.isFinite(time) || time <= 0) return; 

    scoreSaved = true;

    try {
        await window.firebaseFns.addDoc(
            window.firebaseFns.collection(window.firebaseDB, "highscores"),
            { time: time }
        );

        console.log("Score saved!");
        loadHighScores();

    } catch (e) {
        console.log("Failed to save score", e);
    }
}
async function loadHighScores() {
    try {
        const q = window.firebaseFns.query(
            window.firebaseFns.collection(window.firebaseDB, "highscores"),
            window.firebaseFns.orderBy("time", "desc"),
            window.firebaseFns.limit(5)
        );

        const snapshot = await window.firebaseFns.getDocs(q);

        console.log("Firestore snapshot size:", snapshot.size);

        const list = document.getElementById("highScoreList");
        list.innerHTML = "";

        snapshot.forEach(doc => {
            console.log(doc.data());
            const data = doc.data();
             if (!Number.isFinite(data.time) || data.time <= 0) return;
            const li = document.createElement("li");
            li.textContent = data.time + " sec";
            list.appendChild(li);
        });

    } catch (err) {
        console.error("loadHighScores failed:", err);
    }
}
function restartGame() {
    scoreSaved = false;
    gameOver = false;
    seconds = 0;

    clearInterval(timerInterval); 

    location.reload();
}

let zapCooldown = false;
const ZAP_COOLDOWN_TIME = 3000; 

let zapSuccessSound = new Audio('sounds/zap.wav');
let zapFailSound = new Audio('sounds/zap1.wav');

function zaphatulimOnCam() {
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

    for (let name in hatulim) {
        let m = hatulim[name];
        console.log(
    name,
    "hatulimCam:",
    gethatulimCam(name),
    "currentCam:",
    currentCam
);      
        if (gethatulimCam(name) === currentCam) {

            console.log(name + " detected on cam " + currentCam);

            if (m.step > 0) {
                m.step--;

                console.log(
                    name + " was zapped back to room " + m.path[m.step]
                );

                anyZapped = true;
            } else {
                console.log(name + " already at spawn");
            }
        }
    }

    if (anyZapped) {
        zapSuccessSound.currentTime = 0;
        zapSuccessSound.play();
    } else {
        zapFailSound.currentTime = 0;
        zapFailSound.play();

        console.log("No hatulim on this camera to zap.");
    }

    switchCam(currentCam);

    zapCooldown = true;
    document.getElementById("zapBtn").disabled = true;

    setTimeout(() => {
        zapCooldown = false;
        document.getElementById("zapBtn").disabled = false;
        console.log("Zap ready!");
    }, ZAP_COOLDOWN_TIME);
}
window.addEventListener("load", () => {
    loadHighScores();
});
