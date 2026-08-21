export const dialogues = {
    name_1: [
        { speaker: "Crimson", text: "test text" },
        { speaker: "Test Dialogue", text: "It works!"},
        { speaker: "Crimson", text: "you're damn right"}
    ]
};

export function dialogue(npc, number) {
    const line = dialogues[npc][number];
    console.log(`${line.speaker}: ${line.text}`);
}