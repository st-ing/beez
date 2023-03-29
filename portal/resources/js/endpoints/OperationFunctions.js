import axios from "axios";

export const getAllPlannedOperations = () => {
  return axios
    .get(
      `/operation/planned`,
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

export const getAllOngoingOperations = () => {
  return axios
    .get(
      `/operation/ongoing`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then(res =>{
      return res.data
    }).catch(err => {
      return err.response.data.errors;
    })
}

export const getAllFinishedOperations = () => {
  return axios
    .get(
      `/operation/finished`,
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

export const getTemplates = () => {
  return axios
    .get(
      `/operation/template`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then(res =>{
      return res.data
    }).catch(err => {
      return err.response.data.errors;
    })
}

export const getAllOperations = () => {
  return axios
    .get(
      `/operation`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then(res =>{
      return res.data
    }).catch(err => {
      return err.response.data.errors;
    })
}

export const getOperation = id => {
  return axios
    .get(
      `/operation/${id}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then(res =>{
      return res.data
    }).catch(err => {
      return err.response.data.errors;
    })
}
export const getOperationTemplate = id => {
  return axios
    .get(
      `/templates/operation/${id}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then(res =>{
      return res.data
    }).catch(err => {
      return err.response.data.errors;
    })
}

export const addOperation = data => {
  return axios
    .post(
      '/operation',
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
export const updateOperation = (data, id) => {
  return axios
    .put(
      `/operation/${id}`,
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

export const deleteOperation = id => {
  return axios
    .delete(`/operation/${id}`, {
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
}

export const initializeOperation = (data)  => {
  return axios
    .post(
      `/operation/initialize`,
      data,
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
    .then(res => {
      return res
    })
    .catch(err => {
      return err.response.data.errors;
    })
}

