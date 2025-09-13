const textField = (lang) => [
    "coalesce", //
    ["get", `name:${lang}`],
    ["get", "name"],
];

const fontFamily = (lang) => {
    if (lang === "ko") {
        return [
            "case", //
            ["has", "name:ko"],
            ["literal", ["Gaegu"]],
            ["literal", ["ZenMaruGothic"]],
        ];
    }

    return ["ZenMaruGothic"];
};

export { fontFamily, textField };
