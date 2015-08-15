// Округление чисел до заданной точности.
// Функция `roundTo` принимает число в качестве аргумента, значения точности и возвращает округляющую функцию.
dataLab.constant('roundTo', function (precision) {
    var log2 = Math.log2(precision);
    // Если точность меньше единицы и не является степенью двойки…
    if (log2 < 0 && Math.floor(log2) != Math.ceil(log2)) {
        var fixed = precision.toString().length - 2;
        // …вернём специальную функцию, обрезающую число.
        // Это несколько медленнее, но избавляет от ошибок, вида roundTo(0.05)(1.65) → 1.6500000000000001
        return function (value) {
            value = precision * Math.round(value / precision);
            return parseFloat(value.toFixed(fixed));
        }
    }
    // В остальных случаях вернём простую округляющую функцию.
    return function (value) {
        return precision * Math.round(value / precision);
    }
});