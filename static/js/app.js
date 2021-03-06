d3.json("./samples.json").then( (importedData) => {
    
    //Extract useful data from json file.
    var data = importedData;
    var metadata = data.metadata;
    var samples = data.samples; 
    
    //Bind data to dropdown menu options
    var dropdownMenu = d3.select("#selDataset");
    dropdownMenu.selectAll("option")
        .data(samples)
        .enter()
        .append("option")
        .attr("value", function(d) {return d.id})
        .text(function(d) {return d.id});
    
    // Define a function to show bar chart
    function showBar(barData) {
        var data = [{
                type: 'bar',
                orientation: 'h',
                x: barData.sample_values.slice(0, 10),
                y: barData.otu_ids.map(item => `OTU ${item}`).slice(0, 10),
                text: barData.otu_labels,
                marker: {
                    color: barData.sample_values.slice(0, 10),
                    colorscale: "Portland",
                    reversescale: true
                },
                
            // Make bar charts sorted in ascending order.
                transforms: [{
                    type: 'sort',
                    target: 'x',
                    order: 'ascending'
                }]
            }];
        
        var layout = {
            title: "Top 10 OTUs found",
            autosize: true,
            height: 450,
            margin: {
                l: 100,
                r: 0,
                b: 50,
                t: 50,
            }
        };
        
        Plotly.newPlot("bar", data, layout);       
    }
    
    //Define a function to show metadata
    function showMeta(data) {
        d3.select("#sample-metadata").html('');
        Object.entries(data).forEach(([key, value]) => {
            d3.select("#sample-metadata").append('p').text(`${key}: ${value}`);
        });  
    }
    
    //Define a function to show bubble chart.
    function showBubble(data) {
        
        // Customize the bubble size by a factor of 0.75 in order to reduce bubble overlapping.
        scalesize = [];
        data.sample_values.forEach(d => {
            scalesize.push(d*0.75);
        });
        
        var data_bubble = [{
                type: 'scatter',
                mode: 'markers',
                x: data.otu_ids,
                y: data.sample_values,
                text: data.otu_labels,
                marker: {
                    size: scalesize,
                    color: data.otu_ids ,
                    colorscale: 'Portland',
                        }
            }];
        
        var bubblelayout = {
            autosize: true,
            height: 450,
            margin: {
                l: 100,
                r: 0,
                b: 50,
                t: 50,
            }
        };
        
        d3.select("#bubble").html('');
        Plotly.newPlot("bubble", data_bubble, bubblelayout);
    }
    
    //Define a function to show gauge chart.
    function showGauge(data) {
        var dataGauge = [{
          type: 'pie',
          showlegend: false,
          hole: 0.4,
          rotation: 90,
          values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10],
          text: ['0','1','2','3','4','5','6','7','8','9'],
          direction: 'clockwise',
          textinfo: 'text',
          textposition: 'inside',
          marker: {
            colors: ["rgb(247,242,236)",
                     "rgb(243,240,229)",
                     "rgb(233,231,201)",
                     "rgb(229,233,177)",
                     "rgb(213,229,149)",
                     "rgb(183,205,139)",
                     "rgb(135,192,128)",
                     "rgb(133,188,139)",
                     "rgb(128,181,134)",
                     "rgb(120,165,125)",
                     'white'],
            labels: ['0','1','2','3','4','5','6','7','8','9'],
            hoverinfo: 'label'
          }
        }];
        
        // Doing math to set the pointer angle correctly
        // x and y are the displacement from pointer origin.
        var radians = (1 - data/10) * Math.PI - Math.PI/20;
        var radius = 0.3;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        
        var gaugeLayout = {
            autosize: true,
            height: 450,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 50,
            },
            shapes: [{
                        type: 'path',
                        fillcolor: 'red',
                    // Making a triangle shape with tip pointing at correct target.
                        path: `M 0.48 0.5 L ${0.5+x} ${0.5+y} L 0.52 0.5 Z`,
                        line: {
                          color: 'red',
                          width: 1
                        }
                    }, 
                    // Use a filled circle to cover the bottom of the above triangle.
                    {
                      type: 'circle',
                      fillcolor: 'red',
                      x0: 0.48,
                      y0: 0.52,
                      x1: 0.52,
                      y1: 0.48,
                      line: {
                      color: 'red',
                      width: 3
                      }
            }],
          title: 'Belly Button Washing Frequency'
        }

        Plotly.newPlot('gauge', dataGauge, gaugeLayout);
    }
    
    //Initialize all charts using the first dataset.
    function init() {
        var selDataset = samples[0];
        var metaInfo = metadata[0];
        
        showBar(selDataset);
        showMeta(metaInfo);
        showBubble(samples[0]);
        showGauge(metaInfo.wfreq); 
    }
    
    //Event listener 
    d3.selectAll("#selDataset").on("change", updatePlotly);
    
    //Update function for all figures.
    function updatePlotly() {
        
        //Retrive the selected index and select the corresponding dataset.
        var index = this.selectedIndex;
        var selDataset = samples[index];
        var metaInfo = metadata[index];
        
        showBar(selDataset);
        showMeta(metaInfo);
        showBubble(selDataset);   
        showGauge(metaInfo.wfreq);
    }
    init();
});