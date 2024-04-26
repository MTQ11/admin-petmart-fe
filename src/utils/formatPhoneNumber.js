// Trước khi lưu số điện thoại vào cơ sở dữ liệu
const formatPhone = (phoneNumber) => {
    phoneNumber = String(phoneNumber);

    if (!phoneNumber.startsWith('0')) {
        return '0' + phoneNumber;
    }
    return phoneNumber;
};


export default formatPhone
