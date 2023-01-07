import SignUpPage from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { useTranslation } from "react-i18next";
import logo from "./assets/23082612-hoaxify.png";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { AccountActivationPage } from "./pages/AccountActivationPage";
import UserPage from "./pages/UserPage";

function App() {
  const t = useTranslation();

  return (
    <BrowserRouter>
      <nav className="navbar navbae-expand navbar-light bg-light shadow">
        <div className="container">
          <Link className="navbar-brand" to="/" title="Home">
            <img src={logo} width={60} alt="Hoaxify" />
            Hoaxify
          </Link>
          <ul className="navbar-nav">
            <Link className="nav-link" to="/signup">
              Sign Up
            </Link>
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </ul>
        </div>
      </nav>
      <Routes className="container mt-5">
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/activate/:token" element={<AccountActivationPage />} />
      </Routes>
      <LanguageSelector />
    </BrowserRouter>
  );
}

export default App;
