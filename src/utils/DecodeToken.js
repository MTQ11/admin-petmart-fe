import { jwtDecode } from "jwt-decode";

const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export default decodeToken
