import SignUpPageWithTranslation from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div className="container">
      <HomePage />
      <SignUpPageWithTranslation />
      <LanguageSelector />
    </div>
  );
}

export default App;
