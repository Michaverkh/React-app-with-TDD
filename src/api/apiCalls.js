import axios from "axios";
import { BASE_URL, USERS } from "../constants/API";
import i18n from "../locals/i18n";

export const signUp = (body) => {
  return axios.post(USERS, body, {
    headers: {
      "Accept-Language": i18n.language,
    },
  });
};

export const activate = (token) => {
  return axios.post("http://localhost:8080/api/1.0/users/token/" + token);
};

export const loadUsers = (page) => {
  return axios.get(BASE_URL, {
    params: {
      page: page,
      size: 3,
    },
  });
};
