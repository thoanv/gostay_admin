/**
 * App Language Provider
 * Add more locales here
 */
import { addLocaleData } from 'react-intl';
import enLang from './entries/en-US';
import viLang from './entries/vi';


const AppLocale = {
    en: enLang,
    vi: viLang,
};

addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.vi.data);


export default AppLocale;
