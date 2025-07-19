import { SceneOptions } from "src/modules/ai/dtos/common/SceneOptions";

export function sceneGenerationPrompt(chunks: string[], options: SceneOptions, wordLimit = 1500) {
    const { tone, description, conflict, atmosphere } = options;
    const context = chunks.map((chunk, i) => `Context ${i + 1}:\n${chunk}`).join("\n\n");

    return `
        You are a creative writing assistant.
        Using the following context pieces, craft a vivid and engaging scene or short narrative. 
        Incorporate key details from the context and options provided.

        Options:
        - tone: ${tone}
        - description: ${description}
        - conflict: ${conflict}
        - atmosphere: ${atmosphere}

        Context:
        ${context}

        Instructions: 
        - Create a scene that fit the context precisely, not a whole story resolution 
        - (max ${wordLimit} words)
        - Keep it coherent and grounded in the context themes
        - Use expressive language and vivid imagery
     `;
}
