// Стандартный фильтр, удобен для проверки массива объектов на соответствие набору свойств.
dataLab.value('multifilter', function (items, filters) {
    if (!items || !filters) return;
    var keys = Object.keys(filters);
    return items.filter(function (item) {
        return keys.every(function (key) {
            var filter = filters[key];
            if (filter === null) return true;
            return filter == item[key];
        });
    });
});