import axios from 'axios'

export const getApiaries = id => {
    return axios
        .get(`/api/apiaries/${id}`,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )
        .then(res => {
            return res.data
        })

}
export const getApiary = id => {
    return axios
        .get(
            `/api/apiary/${id}`,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )
        .then(res =>{
            return res.data
        })
}

export const getApiaryOperations = id => {
  return axios
    .get(
      `/api/apiary/operations/${id}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then(res =>{
      return res.data
    })
}

export const getAllApiaries = id => {
    return axios
        .get(
            `/api/all-apiaries/${id}`,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )
        .then(res =>{
            return res.data
        })
}
export const addApiary = data => {
    return axios
        .post(
            '/api/apiary',
            data,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )
        .then(res => {
            return res
        })
        .catch(err => {
            return err.response.data.errors;
        })
}

export const deleteApiary = id => {
    axios
        .delete(`/api/apiary/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
            return true;
        })
        .catch(err => {
            return false;
        })
}

export const updateApiary = (data, id) => {
    return axios
        .put(
            `/api/apiary/${id}`,
            data,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )
        .then(res => {
            return res
        })
        .catch(err => {
            return err.response.data.errors;
        })
}
