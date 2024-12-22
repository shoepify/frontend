import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
    en: {
        translation: {
            welcome: "Welcome to My Bag Store",
            searchPlaceholder: "Search for products",
            profile: "Profile",
            logout: "Logout",
        },
    },
    tr: {
        translation: {
            welcome: "Çanta Mağazasına Hoşgeldiniz",
            searchPlaceholder: "Ürünleri arayın",
            profile: "Profil",
            logout: "Çıkış Yap",
        },
    },
    fr: {
        translation: {
            welcome: "Bienvenue à My Bag Store",
            searchPlaceholder: "Recherchez des produits",
            profile: "Profil",
            logout: "Se Déconnecter",
        },
    },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
    resources,
    fallbackLng: 'en', // Default language
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;
