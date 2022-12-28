import axios from "axios";
import { USERS } from "../constants/API";
import i18n from "../locals/i18n";

export const signUp = (body) => {
  return axios.post(USERS, body, {
    headers: {
      "Accept-Language": i18n.language,
    },
  });
};

export const activate = (token) => {
  return axios.post("/api/1.0/users/token/" + token);
};

export const loadUsers = () => {
  return axios.get(USERS);
};
