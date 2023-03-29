import axios from "axios";

export const fetchLocalization = language => {
    return axios
        .get(`/api/translations/${language}`
            ,{
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response.data.message;
        })
}
