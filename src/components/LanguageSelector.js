import { useTranslation } from "react-i18next";
import withHover from "../hoc/withHover";

const LanguageSelector = (props) => {
  const { i18n } = useTranslation();

  let size = 24;
  if (props.on) {
    size = 48;
  }

  return (
    <>
      <img
        title="ru"
        src={`https://www.countryflagicons.com/SHINY/${size}/RU.png`}
        onClick={() => i18n.changeLanguage("ru")}
        alt="flag"
      />
      <img
        title="en"
        src={`https://www.countryflagicons.com/SHINY/${size}/GB.png`}
        onClick={() => i18n.changeLanguage("en")}
        alt="flag"
      />
    </>
  );
};

// export default LanguageSelector;
export default withHover(LanguageSelector);
