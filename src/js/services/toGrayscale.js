dataLab.constant('toGrayscale', function (color) {
    var hcl = d3.hcl(color);
    hcl.c = 0;
    return hcl.toString()
});
