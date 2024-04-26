function getHour(dateString) {
    var createdAt = new Date(dateString);

    // Lấy ra ngày, tháng, năm từ đối tượng Date
    var day = createdAt.getDate();
    var month = createdAt.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    var year = createdAt.getFullYear();

    // Lấy ra giờ, phút, giây từ đối tượng Date
    var hours = createdAt.getHours();
    var minutes = createdAt.getMinutes();
    var seconds = createdAt.getSeconds();

    // Định dạng lại thời gian
    var formattedDateTime = hours + ':' + minutes + ' ' + day + '/' + month + '/' + year;

    return formattedDateTime;
}

export default getHour;
