import axios from "axios";

export const getNode = (id) => {
  return axios
    .get(`/api/node/${id}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err;
    })
}

export const getData = (id) => {
  return axios
    .get(`/api/measurement-data/${id}`,
      {
        headers: { 'Content-Type': 'application/json'}
      }
    )
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err;
    })
}
