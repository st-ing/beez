import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    nsSeparator: false,
    keySeparator: false,
    fallbackLng: 'en',
    appendNamespaceToCIMode: true,
  })
export default i18n;
