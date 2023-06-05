import axios from "axios";
import config from "../env/env";
import {AxiosResponse} from 'axios';
import {Tokens} from "../features/tokenSlicer";
import {RefreshPayload, RefreshResult} from "package-types";

const request = axios.create({
    baseURL: `${config.beUrl}`,
    headers: {
        "Content-type": "multipart/form-data",
    },
});

const refreshTokens = async (): Promise<Tokens | undefined> => {
    try {
        const refreshToken = localStorage.getItem('refresh');
        const {data} = await request.post<RefreshPayload, AxiosResponse<RefreshResult, any>>(`/users/refresh/`, { refresh: refreshToken });
        console.log(data);
        if(!data.tokens) {
            throw new Error('No tokens received from server');
        }
        const { access, refresh } = data.tokens;
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        return data.tokens;
    } catch (err) {
        console.log("Error", err);
    }
};

request.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('access');
        console.log(token);
        if (token) {
            config.headers["Authorization"] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const res = await refreshTokens();
            if (!res?.access || !res?.refresh) {
                throw new Error('Cannot get access and refresh token from server');
            }
            const {access} = res;


            request.defaults.headers.common[
                "Authorization"
                ] = `${access}`;
            return request(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default request;
