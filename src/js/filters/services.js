// Этот код «превращает» сервисы в фильтры, чтобы их можно было использовать в шаблонах.
var servicesAsFilters = [
// Включён для этих сервисов:
    'last',
    'numberDeclension'
];
servicesAsFilters.forEach(function (filter) {
    dataLab.filter(filter, function ($injector) {
        return $injector.get(filter);
    });
});
