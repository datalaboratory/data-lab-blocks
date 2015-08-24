// Сервис, превращающий специфичный объект (например, результат `getBBox()`) в обычный
// Возвращает объект без прототипа, со всеми свойствами переданного объекта.
dataLab.value('removePrototype', function removePrototype(object) {
    var result = {};
    for (var key in object) {
        result[key] = object[key];
    }
    return result;
});