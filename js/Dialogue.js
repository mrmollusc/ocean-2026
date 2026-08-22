export const dialogues = {
    name_1: [
        { speaker: "Crimson", text: "test text" },
        { speaker: "Test Dialogue", text: "It works!" },
        { speaker: "Crimson", text: "you're damn right" }
    ]
};

export function getDialogueLines(npc) {
    return dialogues[npc] ?? [];
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