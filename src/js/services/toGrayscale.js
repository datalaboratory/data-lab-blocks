// Приведение `d3`-совместимого цвета к соответствующему серому оттенку.
dataLab.value('toGrayscale', function (color) {
    var hcl = d3.hcl(color);
    hcl.c = 0;
    return hcl.toString()
});
