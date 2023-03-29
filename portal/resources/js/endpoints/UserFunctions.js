import axios from 'axios';

export const googleLogin = () => {
  return axios.get('login/google')
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
}

export const register = newUser => {
    const postdata = {
        'email':newUser.email,
        'name': newUser.name,
        'password': newUser.password,
        'password_confirmation': newUser.repeatPassword,
        'locale': document.documentElement.lang
    }
    return axios.post('/register', postdata)
        .then(res => {
            return false;
        })
        .catch(err => {
            return err.response.data.errors;
        })
}

export const login = user => {
    return axios.post('/login',{
        email:user.email,
        password: user.password,
        remember: user.remember
    },{
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => {
            return false;
        })
        .catch(err => {
            return err.response.data.errors;
        })
}
export const logout = () => {
    return axios.post('/logout',)
        .then(res => {
            return true;
        })
        .catch(err => {
            console.log('error');
        })
}

export const resend = () => {
    return axios.post('/email/resend')
        .then(res => {
            return true;
        })
        .catch(err => {
            return false;
        })
}

export const reset = data => {
    return axios.post('/password/email',data
    )
        .then(res => {
            return false;
        })
        .catch(err => {
            return err.response.data.errors;
        })
}

export const resetPassword = newPassword => {
    const postData = {
        'token':newPassword.token,
        'email':newPassword.email,
        'password': newPassword.password,
        'password_confirmation': newPassword.repeatPassword
    }
    return axios.post('/password/reset',postData
    )
        .then(res => {
            return false;
        })
        .catch(err => {
            return err.response.data.errors;
        })
}

export const getUser = () => {
    return axios.post('/get/verified')
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return err;
        })
}

export const getSelectedUser = id => {
    return axios.get(`/get-user/${id}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return err;
        })
}

export const getAllUsers = () => {
    return axios.get('/all-users')
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return err;
        })
}

export const restoreUser = id => {
    return axios.get(`/user-restore/${id}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return err;
        })
}

export const deleteUser = id => {
    return axios
        .delete(`/user/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}

export const addUser = (data) => {
    return axios
        .post(
            '/add-user',
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

export const updateUser = (data, id) => {
    return axios
        .put(
            `update-user/${id}`,
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
export const hideVideo = (id,data) => {
  return axios
    .put(
      `hide-video/${id}`,data,
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

export const uploadImage = (image,id) => {
    return axios.post(`/upload-image/${id}`,image)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}

export const changePassword = (data) => {
    return axios.post('change-password',data)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response.data.errors;
        })
}
