import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  return (
    <>
      <img
        title="ru"
        src="https://www.countryflagicons.com/SHINY/24/RU.png"
        onClick={() => i18n.changeLanguage("ru")}
        alt="flag"
      />
      <img
        title="en"
        src="https://www.countryflagicons.com/SHINY/24/GB.png"
        onClick={() => i18n.changeLanguage("en")}
        alt="flag"
      />
    </>
  );
};

export default LanguageSelector;
