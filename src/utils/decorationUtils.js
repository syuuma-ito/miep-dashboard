export function extractDecorationsByLanguage(mapDecorations, lang) {
    if (!Array.isArray(mapDecorations) || !lang) {
        return [];
    }

    return mapDecorations.map((decoration) => {
        const result = { ...decoration };

        if (decoration.options?.text && typeof decoration.options.text === "object") {
            const langText = decoration.options.text[lang];
            const fallbackText = decoration.options.text.ja || "";

            result.options = {
                ...decoration.options,
                text: langText && langText.trim() !== "" ? langText : fallbackText,
            };
        }

        return result;
    });
}
