import axios from 'axios';
import { jwtURL } from '../urls';

//prettier-ignore
export const postJwt = async (email: string, password: string) => {
  const postData = { email: email, password: password }
  return axios.post(jwtURL, postData, {
    headers: {
        'Content-Type': 'application/json',
      },
  })
    .then(res => { return res.data })
    .catch((e) => console.error(e))
};
