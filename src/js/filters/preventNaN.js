// Заменяет `NaN` на `undefined`.
dataLab.filter('preventNaN', function () {
    return function (number) {
        if (isNaN(number)) return undefined;
        return number;
    }
});
