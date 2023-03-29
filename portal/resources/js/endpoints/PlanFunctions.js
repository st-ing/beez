import axios from "axios";

export const getAllPlans = () => {
  return axios
    .get(
      `/plan`,
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

export const getAllPlanTemplates = () => {
  return axios
    .get(
      `/plans/templates`,
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

export const getPlan = id => {
  return axios
    .get(
      `/plan/${id}`,
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
export const getPlanTemplate = id => {
  return axios
    .get(
      `/templates/plan/${id}`,
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

export const getPlanOperation = id => {
  return axios
    .get(
      `/plan/operations/${id}`,
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

export const addPlan = data => {
  return axios
    .post(
      '/plan',
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

export const updatePlan = (data, id) => {
  return axios
    .put(
      `/plan/${id}`,
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

export const deletePlan = id => {
  return axios
    .delete(`/plan/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
}

export const initializePlan = (data,id)  => {
  return axios
    .post(
      `/plan/initialize/${id}`,
      data,
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.response.data.errors;
    })
}
