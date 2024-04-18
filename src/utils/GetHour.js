function getHour(dateString) {
    var createdAt = new Date(dateString);

    // Lấy ra giờ từ đối tượng Date
    var gio = createdAt.getHours();
    var phut = createdAt.getMinutes();
    var giay = createdAt.getSeconds();

    var formattedTime = gio + ':' + phut

    return formattedTime;
}

export default getHour