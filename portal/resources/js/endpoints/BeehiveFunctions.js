import axios from 'axios'

export const getBeehives = id => {
    return axios
        .get(`/api/beehives/${id}`,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )
        .then(res => {
            return res.data
        })

}
export const getBeehive = id => {
    return axios
        .get(
            `/api/beehive/${id}`,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )
        .then(res =>{
            return res.data
        })
}

export const getBeehiveOperations = id => {
  return axios
    .get(
      `/api/beehive/operations/${id}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then(res =>{
      return res.data
    })
}

export const getBeehiveHistory = id => {
    return axios
        .get(
            `/api/apiaries-history/${id}`,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )
        .then(res =>{
            return res.data
        })
}
export const getApiaryBeehives = id => {
    return axios
        .get(`/api/apiary-beehives/${id}`,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        )
        .then(res => {
            return res.data
        })

}

export const addBeehive = data => {
    return axios
        .post(
            '/api/beehive',
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

export const deleteBeehive = id => {
    axios
        .delete(`/api/beehive/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
            return true;
        })
        .catch(err => {
            return false;
        })
}

export const updateBeehive = (data, id) => {
    return axios
        .put(
            `/api/beehive/${id}`,
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
