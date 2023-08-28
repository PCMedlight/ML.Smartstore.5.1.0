

     
        function point(x, y) {
            x: 0;
            y: 0;
        }

 

       
        
        function drawLineGraph(graph, points, container, id, yLowerLimit, yUpperLimit) {

            var graph = Snap(graph);
            /*END DRAW GRID*/
            /* PARSE POINTS */
            var myPoints = [];
            var shadowPoints = [];
            function parseData(points) {
                for (i = 0; i < points.length; i++) {
                    var p = new point();
                    var pv = (points[i] - yLowerLimit) / (yUpperLimit - yLowerLimit) * 40;
                    p.x = 83.7 / points.length * i + 1;
                    p.y = 40 - pv;
                    if (p.x > 78) {
                        p.x = 78;
                    }
                    myPoints.push(p);
                }
            }
            var segments = [];
            function createSegments(p_array) {
                for (i = 0; i < p_array.length; i++) {
                    var seg = "L" + p_array[i].x + "," + p_array[i].y;
                    if (i === 0) {
                        seg = "M" + p_array[i].x + "," + p_array[i].y;
                    }
                    segments.push(seg);
                }
            }
            function joinLine(segments_array, id) {
                var line = segments_array.join(" ");
                var line = graph.path(line);
                line.attr('id', 'graph-' + id);
                var lineLength = line.getTotalLength();

                line.attr({
                    'stroke-dasharray': lineLength,
                    'stroke-dashoffset': lineLength
                });
            }
            function calculatePercentage(points, graph) {
                var initValue = points[0];
                var endValue = points[points.length - 1];
                var sum = endValue - initValue;
                var prefix;
                var percentageGain;
                var stepCount = 1300 / sum;

                function findPrefix() {
                    if (sum > 0) {
                        prefix = "+";
                    } else {
                        prefix = "";
                    }
                }
                var percentagePrefix = "";
                function percentageChange() {
                    percentageGain = initValue / endValue * 100;
                    if (percentageGain > 100) {
                        console.log('over100');
                        percentageGain = Math.round(percentageGain * 100 * 10) / 100;
                    } else if (percentageGain < 100) {
                        console.log('under100');
                        percentageGain = Math.round(percentageGain * 10) / 10;
                    }
                    if (initValue > endValue) {
                        percentageGain = endValue / initValue * 100 - 100;
                        percentageGain = percentageGain.toFixed(2);
                        percentagePrefix = "";
                        $(graph).find('.percentage-value').addClass('negative');
                    } else {
                        percentagePrefix = "+";
                    }
                    if (endValue > initValue) {
                        percentageGain = endValue / initValue * 100;
                        percentageGain = Math.round(percentageGain);
                    }
                };
                percentageChange();
                findPrefix();
                var percentage = $(graph).find('.percentage-value');
                var totalGain = $(graph).find('.total-gain');
                var hVal = $(graph).find('.h-value');
                function count(graph, sum) {
                    var totalGain = $(graph).find('.total-gain');
                    var i = 0;
                    var time = 1300;
                    var intervalTime = Math.abs(time / sum);
                    var timerID = 0;
                    if (sum > 0) {
                        var timerID = setInterval(function () {
                            i++;
                            totalGain.text(percentagePrefix + i);
                            if (i === sum) clearInterval(timerID);
                        }, intervalTime);
                    } else if (sum < 0) {
                        var timerID = setInterval(function () {
                            i--;
                            totalGain.text(percentagePrefix + i);
                            if (i === sum) clearInterval(timerID);
                        }, intervalTime);
                    }
                }
                count(graph, sum);
                percentage.text(percentagePrefix + percentageGain + "%");
                totalGain.text("0%");
                setTimeout(function () {
                    percentage.addClass('visible');
                    hVal.addClass('visible');
                }, 1300);
            }
            function showValues() {
                var val1 = $(graph).find('.h-value');
                var val2 = $(graph).find('.percentage-value');
                val1.addClass('visible');
                val2.addClass('visible');
            }
            function drawPolygon(segments, id) {
                var lastel = segments[segments.length - 1];
                var polySeg = segments.slice();
                polySeg.push([78, 38.4], [1, 38.4]);
                var polyLine = polySeg.join(' ').toString();
                var replacedString = polyLine.replace(/L/g, '').replace(/M/g, "");

                var poly = graph.polygon(replacedString);
                var clip = graph.rect(-80, 0, 80, 40);
                poly.attr({
                    'id': 'poly-' + id,
                    /*'clipPath':'url(#clip)'*/
                    'clipPath': clip
                });
                clip.animate({
                    transform: 't80,0'
                }, 1300, mina.linear);
            }
            parseData(points);
            createSegments(myPoints);
            calculatePercentage(points, container);
            joinLine(segments, id);
            drawPolygon(segments, id);
        }

        

        function applyGradientToElement(elementId, gradientName, fillOrStroke) {
            const element = document.querySelector(`#${elementId}`);
            const gradient = document.querySelector(`#${gradientName}`);
        
            if (!element || !gradient) {
                console.error("Element or gradient not found.");
                return;
            }
        
            if (fillOrStroke === "fill") {
                element.style.fill = `url(#${gradientName})`;
            } else if (fillOrStroke === "stroke") {
                element.style.stroke = `url(#${gradientName})`;
            } else {
                console.error("Invalid fillOrStroke value. Use 'fill' or 'stroke'.");
            }
        }
          
                  

          function generateCumulativeCosts(years, costPerYear, additionalCostEvery, additionalCost, initialCost) {
            var chart_y = [];
            var cumulativeCost = initialCost;
        
            for (var year = 1; year <= years; year++) {
                cumulativeCost += costPerYear;
        
                if (year % additionalCostEvery === 0) {
                    cumulativeCost += additionalCost;
                }
        
                chart_y.push(cumulativeCost);
            }
        
            return chart_y;
        }
        
        var initialCost = 60;
        var years = 15;
        var costPerYear = 5;
        var additionalCostEvery = 5;
        var additionalCost = 20;

        var chart_1_y = generateCumulativeCosts(years, costPerYear, additionalCostEvery, additionalCostEvery, additionalCost,initialCost);

        var initialCost = 50;     
        var years = 15;
        var costPerYear = 4;
        var additionalCostEvery = 5;
        var additionalCost = 17;
        var chart_2_y = generateCumulativeCosts(years, costPerYear, additionalCostEvery, additionalCostEvery, additionalCost,initialCost);
        
        // Specify the limit here
        var yLowerLimit = 0; 
        var yUpperLimit = 150;

        // Call the function with the ID of your SVG element  
        $(window).on('load',function(){

            // Select the target element you want to observe
            const targetElement = document.querySelector("#graph-1-container");

            // Options for the Intersection Observer
            const options = {
                threshold: 1.0,
                once: true,
            };

            // Create the Intersection Observer
            const observer = new IntersectionObserver((entries, observer) => {
                if (entries[0].isIntersecting) {
                    drawLineGraph('#chart-1', chart_1_y, '#graph-1-container', 1, yLowerLimit, yUpperLimit);
                    applyGradientToElement("graph-1", "line-gradient-1", "stroke");
                    applyGradientToElement("poly-1", "bg-gradient-1", "fill");
                    drawLineGraph('#chart-1', chart_2_y, '#graph-1-container', 2, yLowerLimit, yUpperLimit);
                    applyGradientToElement("graph-2", "line-gradient-2", "stroke");
                    applyGradientToElement("poly-2", "bg-gradient-2", "fill");
                    observer.disconnect();
                }
            }, options);

            // Start observing the target element
            observer.observe(targetElement);


        });
