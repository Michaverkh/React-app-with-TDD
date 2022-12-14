import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { signUp } from "../api/apiCalls";
import Alert from "../components/Alert";
import Input from "../components/input";
import Spinner from "../components/Spinner";

const SignUpPage = ({ t, i18n }) => {
  const [fieldsState, setFieldsState] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    apiProgress: false,
    signUpSuccess: false,
    errors: {},
  });

  const handleFieldChange = (e) => {
    const { id, value } = e.target;
    const errorsCopy = { ...fieldsState.errors };
    delete errorsCopy[id];
    setFieldsState({ ...fieldsState, [id]: value, errors: errorsCopy });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const body = {
      username: fieldsState.username,
      email: fieldsState.email,
      password: fieldsState.password,
    };
    setFieldsState({ ...fieldsState, apiProgress: true });
    try {
      await signUp(body);
      setFieldsState({
        ...fieldsState,
        apiProgress: false,
        signUpSuccess: true,
      });
    } catch (error) {
      setFieldsState({
        ...fieldsState,
        apiProgress: false,
      });
      if (error.response.status === 400) {
        setFieldsState({
          ...fieldsState,
          errors: error.response.data.validationErrors,
        });
      }
    }
  };

  const passwordMismatch =
    fieldsState.password !== fieldsState.repeatPassword
      ? t("passwordMismatch")
      : "";

  return (
    <div
      className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
      data-testid="sign-up"
    >
      {!fieldsState.signUpSuccess && (
        <form
          className="card mt-5"
          onSubmit={onSubmit}
          data-testid="form-sign-up"
        >
          <div className="card-header">
            <h1>{t("signUp")}</h1>
          </div>
          <div className="card-body">
            <Input
              id={"username"}
              label={t("username")}
              onChange={handleFieldChange}
              help={fieldsState.errors.username}
              value={fieldsState.username}
            />
            <Input
              id={"email"}
              label={t("email")}
              onChange={handleFieldChange}
              help={fieldsState.errors.email}
              value={fieldsState.email}
            />
            <Input
              id={"password"}
              label={t("password")}
              onChange={handleFieldChange}
              help={fieldsState.errors.password}
              value={fieldsState.password}
              type={"password"}
            />
            <Input
              id={"repeatPassword"}
              label={t("repeatPassword")}
              onChange={handleFieldChange}
              help={passwordMismatch}
              value={fieldsState.repeatPassword}
              type={"password"}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                !fieldsState.password ||
                fieldsState.password !== fieldsState.repeatPassword ||
                fieldsState.apiProgress
              }
            >
              {fieldsState.apiProgress && (
                <Alert type={"secondary"} text="" center={true}>
                  <Spinner />
                </Alert>
              )}
              <span>{t("signUp")}</span>
            </button>
          </div>
        </form>
      )}
      {fieldsState.signUpSuccess && (
        <Alert>Please check your e-mail to activate your account</Alert>
      )}
    </div>
  );
};

const SignUpPageWithTranslation = withTranslation()(SignUpPage);

export default SignUpPageWithTranslation;
