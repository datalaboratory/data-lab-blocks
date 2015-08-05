var servicesAsFilters = [
    'numberDeclension'
];
servicesAsFilters.forEach(function (filter) {
    dataLab.filter(filter, function ($injector) {
        return $injector.get(filter);
    });
});
