$(function() {
    var propsToTest = {},
        numDivs = {},
        expected = {};

    propsToTest['parseBackgrounds Gradient'] = ["backgroundImage"];
    numDivs['parseBackgrounds Gradient'] = $('#backgroundGradients div').length;
    expected['parseBackgrounds Gradient'] = [
        {
            method: "linear-gradient",
            args: [
                "left",
                " rgb(255, 0, 0)",
                " rgb(255, 255, 0)",
                " rgb(0, 255, 0)"
            ]
        },
        {
            method: 'linear-gradient',
            args: [
                "left",
                " rgb(206, 219, 233) 0%",
                " rgb(170, 197, 222) 17%",
                " rgb(97, 153, 199) 50%",
                " rgb(58, 132, 195) 51%",
                " rgb(65, 154, 214) 59%",
                " rgb(75, 184, 240) 71%",
                " rgb(58, 139, 194) 84%",
                " rgb(38, 85, 139) 100%"
            ]
        },
        {
            method: "gradient",
            args: [
                "linear",
                " 50% 0%",
                " 50% 100%",
                " from(rgb(240, 183, 161))",
                " color-stop(0.5, rgb(140, 51, 16))",
                " color-stop(0.51, rgb(117, 34, 1))",
                " to(rgb(191, 110, 78))"
            ]
        },
        {
            method: "radial-gradient",
            args: [
                "75% 19%",
                " ellipse closest-side",
                " rgb(171, 171, 171)",
                " rgb(0, 0, 255) 33%",
                " rgb(153, 31, 31) 100%"
            ]
        },
        {
            method: "radial-gradient",
            args: [
                "75% 19%",
                " ellipse closest-corner",
                " rgb(171, 171, 171)",
                " rgb(0, 0, 255) 33%",
                " rgb(153, 31, 31) 100%"
            ]
        },
        {
            method: "radial-gradient",
            args: [
                "75% 19%",
                " ellipse farthest-side",
                " rgb(171, 171, 171)",
                " rgb(0, 0, 255) 33%",
                " rgb(153, 31, 31) 100%"
            ]
        },
        {
            method: "radial-gradient",
            args: [
                "75% 19%",
                " ellipse farthest-corner",
                " rgb(171, 171, 171)",
                " rgb(0, 0, 255) 33%",
                " rgb(153, 31, 31) 100%"
            ]
        },
        {
            method: "radial-gradient",
            args: [
                "75% 19%",
                " ellipse contain",
                " rgb(171, 171, 171)",
                " rgb(0, 0, 255) 33%",
                " rgb(153, 31, 31) 100%"
            ]
        },
        {
            method: "radial-gradient",
            args: [
                "75% 19%",
                " ellipse cover",
                " rgb(171, 171, 171)",
                " rgb(0, 0, 255) 33%",
                " rgb(153, 31, 31) 100%"
            ]
        }
    ];

    test('parseBackgrounds Gradient', numDivs['parseBackgrounds Gradient'] * 2, function() {
        $('#backgroundGradients div').each(function(i, node) {
            var container = new NodeContainer(node, null);
            var value = container.css("backgroundImage");

            if (/^(-webkit|-o|-moz|-ms|linear)-/.test(value)) {
                var parsedBackground = parseBackgrounds(value);
                QUnit.deepEqual(parsedBackground[0].args, expected['parseBackgrounds Gradient'][i].args, 'Parsed gradient with CSS: ' + value);
                QUnit.deepEqual(parsedBackground[0].method, expected['parseBackgrounds Gradient'][i].method, 'Parsed gradient with CSS: ' + value);
            } else {
                QUnit.ok(true, 'No CSS Background Gradient support');
            }
        });
    });
});
