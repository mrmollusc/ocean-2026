export const dialogues = {
    dialogueMissing: [
        { speaker: "Unknown", text: "[Dialogue is missing]" }
    ],
    Welcome: [
        { speaker: "MrMollusc", text: "Welcome to Turritopsis RED!" },
        { speaker: "Basiliskk_0", text: "This was made for the Ocean 2026 Game, and is a work in progress." },
        { speaker: "Karbyn", text: "If you find any bugs, please report them to the developers." }
    ], 
    Chrysaory_Dash: [
        { speaker: "???", text: "You can press key [SPACE] to dash!" }
    ],
    Chrysaory_Dash_repeat_1: [
        { speaker: "???", text: "Is grass allergic to green?" },
        { speaker: "???", text: "It's the only light they don't eat..." },
        { speaker: "Crimson", text: "What's grass?" },
        { speaker: "???", text: "Oh, right!" },
        { speaker: "???", text: "By the way, you can also press key [SPACE] to dash!" }
    ],
    Chrysaory_Dash_repeat_2: [
        { speaker: "???", text: "Maybe it is..." },
        { speaker: "Crimson", text: "What is?" },
        { speaker: "???", text: "The grass..." },
        { speaker: "???", text: "Anyways, you can press key [SPACE] to dash!" }
    ],
    Chrysaory_Dash_repeat: [
        { speaker: "???", text: "Press key [SPACE] to dash!" }
    ], 
    Chrysaory_Shock: [
        { speaker: "Fish", text: "Please don't sting me!" }, 
        { speaker: "Crimson", text: "How do you sting... ing?" }, 
        { speaker: "???", text: "You can press key [K] to shock!" }, 
        { speaker: "???", text: "Like this!" }
    ],
    Chrysaory_Shock_repeat_1: [
        { speaker: "Crimson", text: "Who even are you?" }, 
        { speaker: "Chrysaory", text: "I'm Chrysaory. You pronounce \"aory\" like in \"Flowery\"." }, 
        { speaker: "Crimson", text: "Flowery?" }, 
        { speaker: "Chrysaory", text: "Yeah, I'd say I'm pretty flowery." }, 
        { speaker: "Crimson", text: "That's not what I meant..." }
    ],
    Chrysaory_Shock_repeat: [
        { speaker: "Chrysaory", text: "..." }, 
        { speaker: "Chrysaory", text: "..." }, 
        { speaker: "Chrysaory", text: "..." }, 
        { speaker: "Chrysaory", text: "............................................." }, 
        { speaker: "Chrysaory", text: "Oh!" }, 
        { speaker: "Chrysaory", text: "Hey there!" }, 
        { speaker: "Chrysaory", text: "Press key [K] to shock!" }

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