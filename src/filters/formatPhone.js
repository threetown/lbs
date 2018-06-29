export const FormatPhone = function (tel) {
    if (tel && tel.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
        let subTel = tel.substr(3,4);

        return tel.replace(subTel, '****');
    }
}