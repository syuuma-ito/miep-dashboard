import i18nConfig from "./config";
import { _getValue } from "./utils";

const getAvailableLanguages = () => Object.keys(i18nConfig.translations);

const getStaticTranslations = (lang) => {
    const t = (key, params = {}) => _getValue(key, lang, params);

    return { t };
};

export { getAvailableLanguages, getStaticTranslations, i18nConfig };
