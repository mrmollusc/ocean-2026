export const dialogues = {
    dialogueMissing: [
        { speaker: "Unknown", text: "[Dialogue is missing]" }
    ],
    Welcome: [
        { speaker: "MrMollusc", text: "Welcome to Turritopsis RED!" },
        { speaker: "Basiliskk_0", text: "This was made for the Ocean 2026 Game, and is a work in progress." },
        { speaker: "Karbyn", text: "If you find any bugs, please report them to the developers." }
    ], 
    Chrysaory_Space: [
        { speaker: "???", text: "You can press key [SPACE] to dash!" }
    ],
    Chrysaory_Space_repeat_1: [
        { speaker: "???", text: "Is grass allergic to green?" },
        { speaker: "???", text: "It's the only light they don't eat..." },
        { speaker: "Crimson", text: "What's grass?" },
        { speaker: "???", text: "Oh, right!" },
        { speaker: "???", text: "By the way, you can also press key [SPACE] to dash!" }
    ],
    Chrysaory_Space_repeat_2: [
        { speaker: "???", text: "Maybe it is..." },
        { speaker: "Crimson", text: "What is?" },
        { speaker: "???", text: "The grass..." },
        { speaker: "???", text: "Anyways, you can press key [SPACE] to dash!" }
    ],
    Chrysaory_Space_repeat: [
        { speaker: "???", text: "Press key [SPACE] to dash!" }
    ]
};

///////////////////////////////////////////////////////////////////
// check back on random shoo line generation later
//////////////////////////////////////////////////////////////////
export function getDialogueLines(npcKey) {
    if (npcKey === "shoo") {
        return getRandomShooLine();
    }
    return dialogues[npcKey];
}

export function typeDialogueLogic(fullText, speed, onUpdate, onFinish) {
    let index = 0;

    const interval = setInterval(() => {
        onUpdate(fullText.slice(0, index + 1));
        index++;

        if (index >= fullText.length) {
            clearInterval(interval);
            onFinish();
        }
    }, speed);

    return interval; //main game stores this so Enter can skip
}