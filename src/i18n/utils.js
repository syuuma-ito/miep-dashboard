import i18nConfig from "./config";

const _getNested = (obj, key) => {
    return key.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
};

const _getValue = (key, lang, params = {}) => {
    let val = _getNested(i18nConfig.translations[lang], key);

    if (val === undefined) {
        val = _getNested(i18nConfig.translations[i18nConfig.defaultLang], key);
        if (val !== undefined) {
            console.warn(`[i18n] 警告 : '${key}'が'${lang}'に見つかりません。デフォルト言語'${i18nConfig.defaultLang}'にフォールバックします`);
        }
    }

    if (val === undefined) {
        console.error(`[i18n] エラー : '${key}'が'${lang}'およびデフォルト言語'${i18nConfig.defaultLang}'に見つかりません。`);
        return key;
    }

    if (typeof val === "string" && Object.keys(params).length > 0) {
        const placeholdersInText = (val.match(/\{\{(\w+)\}\}/g) || []).map((p) => p.slice(2, -2));
        const paramsKeys = Object.keys(params);

        // 翻訳ファイルにキーがあるのに引数にない場合
        placeholdersInText.forEach((placeholderKey) => {
            if (!(placeholderKey in params)) {
                console.error(`[i18n] エラー : キー'${key}'の翻訳テキストにプレースホルダー'{{${placeholderKey}}}'がありますが、引数'params'にその値がありません。`);
            }
        });

        // 引数にあるのに翻訳ファイルにはない、引数が余分な場合
        paramsKeys.forEach((paramKey) => {
            if (!placeholdersInText.includes(paramKey)) {
                console.error(`[i18n] エラー : キー'${key}'の翻訳テキストにはプレースホルダー'{{${paramKey}}}'がありませんが、引数'params'にその値が渡されました。`);
            }
        });

        let formattedText = val;
        for (const pKey in params) {
            if (placeholdersInText.includes(pKey)) {
                formattedText = formattedText.replace(new RegExp(`\\{\\{${pKey}\\}\\}`, "g"), params[pKey]);
            }
        }
        return formattedText;
    } else if (typeof val === "string" && Object.keys(params).length > 0) {
        // 翻訳テキストにプレースホルダーがないのにparamsが渡された場合
        const placeholdersInText = (val.match(/\{\{(\w+)\}\}/g) || []).map((p) => p.slice(2, -2));
        if (placeholdersInText.length === 0) {
            console.error(`[i18n] エラー : キー'${key}'の翻訳テキストにはプレースホルダーがありませんが、引数'params'が渡されました。`);
        }
    } else if (typeof val !== "string" && Object.keys(params).length > 0) {
        // 翻訳値が文字列ではないのにparamsが渡された場合
        console.error(`[i18n] エラー : キー'${key}'の翻訳値は文字列ではありませんが、引数'params'が渡されました。`);
    }

    return val;
};

export { _getValue };
