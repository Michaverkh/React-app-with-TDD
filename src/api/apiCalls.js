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
