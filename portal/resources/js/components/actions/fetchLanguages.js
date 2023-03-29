import {fetchLocalization }from '../../endpoints/LocalizationFunctions'
import i18n from "i18next";

//action that fetch language based on localization state
const fetchLanguages = () => {
    return function (dispatch,getState) {
        const state = getState();
        const lang = state.localization.language
        //if language is not inside i8n (already fetched) fetch from database and add bundle, else just change language
        if(!i18n.hasResourceBundle(lang,'translation')) {
          fetchLocalization(lang).then(res => {
            res = Object.values(res.data);
            let resources = {};
            res.map(item => {
              resources[item.key_path] = item.translation;
            })
            i18n.addResourceBundle(lang, 'translation', resources);
            i18n.changeLanguage(lang);
            document.documentElement.setAttribute('lang',lang);
          })
        }else{
          i18n.changeLanguage(lang);
          document.documentElement.setAttribute('lang',lang);
        }
    }
}
export default fetchLanguages;
