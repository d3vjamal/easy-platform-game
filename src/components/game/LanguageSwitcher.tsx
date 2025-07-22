import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-switcher">
            <button
                onClick={() => changeLanguage('en')}
                className={`btn btn-secondary ${i18n.language === 'en' ? 'active' : ''}`}
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage('bn')}
                className={`btn btn-secondary ${i18n.language === 'bn' ? 'active' : ''}`}
            >
                BN
            </button>
        </div>
    );
};

export default LanguageSwitcher;