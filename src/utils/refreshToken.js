import { jwtDecode } from "jwt-decode";

const refreshToken = async (refreshToken) => {
    const res = await axios.post(
        `http://localhost:3000/user/refresh-token`, {},
        {
            // headers: {
            //     token: `Bearer ${refreshToken}`,
            // }
            withCredentials: true,
        }
    );
    return res.data;
};

export default refreshToken
