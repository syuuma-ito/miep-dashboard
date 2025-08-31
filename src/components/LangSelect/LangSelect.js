"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { memo } from "react";
import style from "./LangSelect.module.css";

const getLangName = (lang) => {
    const dict = {
        en: "英語",
        ja: "日本語",
        ko: "韓国語",
    };
    return dict[lang] || lang;
};

const languages = ["en", "ja", "ko"];

const LangSelect = ({ lang, setLang }) => {
    return (
        <div className={style.langSelect}>
            <p>Language</p>
            <Select defaultValue={lang} onValueChange={setLang}>
                <SelectTrigger>
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                            {getLangName(lang)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default memo(LangSelect);
