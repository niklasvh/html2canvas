describe("Gradients", function() {
    var expected = [
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
            method: "linear-gradient",
            args: [
                "left",
                " red",
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
            method: 'linear-gradient',
            args: [
                "left",
                " rgb(206, 219, 233) 0%",
                " rgb(170, 197, 222) 17px",
                " rgb(97, 153, 199) 50%",
                " rgb(58, 132, 195) 51px",
                " rgb(65, 154, 214) 59%",
                " rgb(75, 184, 240) 71px",
                " rgb(58, 139, 194) 84%",
                " rgb(38, 85, 139) 100px"
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
            method: "gradient",
            args: [
                "linear",
                " 50% 0%",
                " 50% 100%",
                " from(rgb(255, 0, 0))",
                " color-stop(0.314159, green)",
                " color-stop(0.51, rgb(0, 0, 255))",
                // temporary workaround for Blink/WebKit bug: crbug.com/453414
                //" to(rgba(0, 0, 0, 0.5))"
                " to(rgba(0, 0, 0, 0))"
            ]
        },
        {
            method: 'linear-gradient',
            args: [
                "0deg",
                " rgb(221, 221, 221)",
                " rgb(221, 221, 221) 50%",
                " transparent 50%"
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

    [].slice.call(document.querySelectorAll('#backgroundGradients div'), 0).forEach(function(node, i) {
        var container = new html2canvas.NodeContainer(node, null);
        var value = container.css("backgroundImage");
        it(value, function() {
            var parsedBackground = html2canvas.utils.parseBackgrounds(value);
            if (parsedBackground[0].args[0] === "0% 50%") {
                parsedBackground[0].args[0] = 'left';
            }
            expect(parsedBackground[0].args).to.eql(expected[i].args);
            expect(parsedBackground[0].method).to.eql(expected[i].method);
        });
    });
});
