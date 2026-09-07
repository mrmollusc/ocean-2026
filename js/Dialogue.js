export const dialogues = {
    dialogueMissing: [
        { speaker: "Unknown", text: "[Dialogue is missing]" }
    ],
    Welcome: [
        { speaker: "MrMollusc", text: "Welcome to Turritopsis RED!" },
        { speaker: "Basiliskk_0", text: "This was made for the Ocean 2026 Game, and is a work in progress." },
        { speaker: "Karbyn", text: "If you find any bugs, please report them to the developers." },
        { speaker: "Crzyakushi", text: "Enjoy the game!" },
        { speaker: "MrMollusc", text: "Finally, music only plays upon player interaction, sorry about that!" }
    ], 
    Chrysaory_room_2: [
        { speaker: "??? ", text: 'Hey there, Its me-'},
        { speaker: "??? ", text: 'Oh wait, what are you doing here?'},
        { speaker: "??? ", text: 'This is quite far from Australia or New Zealand isnt it?'},
        { speaker: "??? ", text: "Don't worry, you'll be back in no time!"},
        { speaker: "??? ", text: "In the meantime, watch out for those ugly blue lumps. They're trash"}

    ],
    Chrysaory_dash_kelp:[
        {speaker: "??? ", text: "Kelp can only be dashed through."},
        {speaker: "??? ", text: "You are nearly there..."}
    ],
    treasure: [
        { speaker: "Crimson", text: "And what could this be?" },
    ],
    maze_room_2: [
        { speaker: "Crimson", text: "AHHHH!" },
        { speaker: "Crimson", text: "Bullet HELL!" }
    ],
    room_6: [
        { speaker: "Crimson", text: "This is satisfying..." },
    ],
    zap_Chrysaory: [
        { speaker: "??? ", text: "The next room has so many snails!" },
        { speaker: "??? ", text: "You can press key [K] or [F] to shock them!" },
    ],
    heal: [
        { speaker: "Crimson", text: "Mmm, yummy roe" }
    ],
    Chrysaory_Dash: [
        { speaker: "??? ", text: "You can press key [SPACE] to dash!" }
    ],
    Chrysaory_sand:[
        { speaker: "??? ", text: "This is a very sandy area!" },
        {speaker: "??? ", text: "See that health? You can now heal it with [O] or [E]" },
        {speaker: "??? ", text: "Anyways, good luck with the next area, it will finally put you to the test!" }
    ],
    Chrysaory_end:[
        { speaker: "??? ", text: "Thanks for playing our game/demo :)" },
        { speaker: "??? ", text: "See you next time" },

    ],
    Chrysaory_end_repeat_1:[
        { speaker: "??? ", text: "Well, only thing left to do" },
        { speaker: "??? ", text: "Is reset..." },
    ],
    Chrysaory_end_repeat_1:[
        { speaker: "??? ", text: "All that is left is a reset" }

    ],
    Chrysaory_sand_repeat_1: [
        { speaker: "??? ", text: "Look! I think I found a roe." },
    ],
    Chrysaory_Dash_repeat_1: [
        { speaker: "??? ", text: "Is grass allergic to green?" },
        { speaker: "??? ", text: "It's the only light they don't eat..." },
        { speaker: "Crimson", text: "What's grass?" },
        { speaker: "??? ", text: "Oh, right!" },
        { speaker: "??? ", text: "By the way, you can also press key [SPACE] to dash!" }
    ],
    Chrysaory_Dash_repeat_2: [
        { speaker: "??? ", text: "Maybe it is..." },
        { speaker: "Crimson", text: "What is?" },
        { speaker: "??? ", text: "The grass..." },
        { speaker: "??? ", text: "Anyways, you can press key [SPACE] to dash!" }
    ],
    Chrysaory_Dash_repeat: [
        { speaker: "??? ", text: "Press key [SPACE] to dash!" }
    ], 
    Chrysaory_Shock: [
        { speaker: "Fish", text: "Please don't sting me!" }, 
        { speaker: "Crimson", text: "How do you sting... ing?" }, 
        { speaker: "??? ", text: "You can press key [K] to shock!" }, 
        { speaker: "??? ", text: "Like this!" }
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

    return interval;
}