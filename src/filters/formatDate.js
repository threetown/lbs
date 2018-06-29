export const FormatDate = function (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
    if (date) {
        var oDate = new Date();
        oDate.setTime(date);

        var Y = oDate.getFullYear();
        var M = oDate.getMonth() + 1;
        var D = oDate.getDate();

        var H = oDate.getHours();
        var m = oDate.getMinutes();
        var s = oDate.getSeconds();

        M = (M < 10) ? '0' + M : M;
        D = (D < 10) ? '0' + D : D;
        H = (H < 10) ? '0' + H : H;
        m = (m < 10) ? '0' + m : m;
        s = (s < 10) ? '0' + s : s;

        return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
    }
}