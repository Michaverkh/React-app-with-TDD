import SignUpPageWithTranslation from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";

function App() {
  return (
    <div className="container">
      <SignUpPageWithTranslation />
      <LanguageSelector />
    </div>
  );
}

export default App;
