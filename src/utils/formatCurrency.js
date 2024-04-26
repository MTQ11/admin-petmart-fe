const formatCurrency = (amount) => {
    if (isNaN(amount)) {
        return "Không hợp lệ";
    }

    const numberString = amount.toString();
    const digits = numberString.split('');

    let formattedPrice = '';
    for (let i = digits.length - 1, j = 1; i >= 0; i--, j++) {
        formattedPrice = digits[i] + formattedPrice;
        if (j % 3 === 0 && i !== 0) {
            formattedPrice = '.' + formattedPrice;
        }
    }

    return formattedPrice;
};

export default formatCurrency
