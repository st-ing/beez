import axios from 'axios'

export const getAllSettings = () => {
  return axios
    .get(
      `/settings`,
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err;
    })
}

export const getSettingKey = (key) => {
  return axios
    .get(
      `/settings/key/${key}`,
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

export const addSetting = (data) => {
  return axios
    .post(
      '/settings',
      (data),
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

export const updateSetting = (data, id) => {
  return axios
    .put(
      `/settings/${id}`,
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

export const deleteSetting = id => {
  return axios
    .delete(`/settings/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
}
