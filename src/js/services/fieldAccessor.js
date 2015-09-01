dataLab.value('fieldAccessor', function fieldAccessor(field) {
    return function (item) {
        return item[field];
    };
});