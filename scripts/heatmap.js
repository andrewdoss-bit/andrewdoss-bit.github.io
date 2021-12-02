document.addEventListener("DOMContentLoaded", () => {
    let margin = {
        top: 25,
        right: 150,
        bottom: 150,
        left: 200
      };
      
      let width = 1000 - margin.left - margin.right;
      let height = 8000 - margin.top - margin.bottom;
      
      let svg = d3.select("#diff_heatmap")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
      
      //Read the data
      d3.csv("https://raw.githubusercontent.com/andrewdoss-bit/andrewdoss-bit.github.io/master/data/pandemic_diffs.csv", function(data) {
          // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
          // data = data.filter(row => +row.group.substring(0,4) > 2019);
          data.forEach((row, index) => {
              data[index].year_month = row.year_month.substring(2,4) + '-' + row.year_month.substring(5);
              data[index].variable = data[index].variable.split(' ').map(word => word.substring(0,1).toUpperCase() + word.substring(1)).join(' ');
          })
          data = data.sort((a, b) => {
              if (a.variable < b.variable) {
                  return 1;
              } else if (a.variable > b.variable) {
                  return -1;
              } else {
                  if (a.year_month < b.year_month) {
                      return -1;
                  } else {
                      return 1;
                  }
              }
          });
      
          var myGroups = d3.map(data, function(d){return d.year_month;}).keys()
          var myVars = d3.map(data, function(d){return d.variable;}).keys()
      
          // Build X scales and axis:
          var x = d3.scaleBand()
                    .range([ 0, width ])
                    .domain(myGroups)
                    .padding(0.05);
          svg.append("g")
             .style("font-size", 11)
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(x).tickSize(0))
             .select(".domain").remove()

          svg.append("g")
             .style("font-size", 11)
             .attr("transform", "translate(0," + 0 + ")")
             .call(d3.axisTop(x).tickSize(0))
             .select(".domain").remove()
      
          // Build Y scales and axis:
          var y = d3.scaleBand()
                    .range([ height, 0 ])
                    .domain(myVars)
                    .padding(0.05);
          svg.append("g")
             .style("font-size", 15)
             .call(d3.axisLeft(y).tickSize(0))
             .select(".domain").remove()
      
          // Build color scale
          var myColor = d3.scaleSequential()
                          .interpolator(d3.interpolateRdBu)
                          .domain([100,-100])
      
          
          let monthMap = {
            '01': 'Jan',
            '02': 'Feb',
            '03': 'Mar',
            '04': 'Apr',
            '05': 'May',
            '06': 'Jun',
            '07': 'Jul',
            '08': 'Aug',
            '09': 'Sep',
            '10': 'Oct',
            '11': 'Nov',
            '12': 'Dec'
          }
      
          function formatDate(date) {
              let arr = date.split('-');
              let year = '20' + arr[0];
              let month = monthMap[arr[1]];
              return month + ', ' + year;
          }
          
                          // create a tooltip
          var tooltip = d3.select("#diff_heatmap")
                          .append("div")
                          .style("position", "absolute")
                          .style("opacity", 0)
                          .attr("class", "tooltip")
                          .style("background-color", "white")
                          .style("border", "solid")
                          .style("border-width", "2px")
                          .style("border-radius", "5px")
                          .style("padding", "5px")
      
          // Three function that change the tooltip when user hover / move / leave a cell
          var mouseover = function(d) {
            tooltip.style("opacity", 1)
                 d3.select(this)
                   .style("stroke", "black")
                   .style("opacity", 1)
          }
          var mousemove = function(d) {
            tooltip.html('Hobby: ' + d.variable + '<br>Month: ' +  formatDate(d.year_month) + '<br>Value: ' + ((d.value > 0 ? '+' : '') + (+d.value).toFixed(0))).style("left", (d3.mouse(this)[0]+590) + "px").style("top", (d3.mouse(this)[1] + 410) + "px")
          }
          var mouseleave = function(d) {
            tooltip.style("opacity", 0)
            d3.select(this)
              .style("stroke", "none")
              .style("opacity", 0.8)
          }
      
          // add the squares
          svg.selectAll()
             .data(data, function(d) {return d.year_month+':'+d.variable;})
             .enter()
             .append("rect")
             .attr("x", function(d) { return x(d.year_month) })
             .attr("y", function(d) { return y(d.variable) })
             .attr("rx", 4)
             .attr("ry", 4)
             .attr("width", x.bandwidth() )
             .attr("height", y.bandwidth() )
             .style("fill", function(d) { return myColor(d.value)} )
             .style("stroke-width", 4)
             .style("stroke", "none")
             .style("opacity", 0.8)
             .on("mouseover", mouseover)
             .on("mousemove", mousemove)
             .on("mouseleave", mouseleave)

             svg.append('line')
             .style("stroke", "#cccccc")
             .style("stroke-width", 2)
             .attr("x1", 89)
             .attr("y1", 0)
             .attr("x2", 89)
             .attr("y2", 7825)


             svg.append('line')
             .style("stroke", "#cccccc")
             .style("stroke-width", 2)
             .attr("x1", 177)
             .attr("y1", 0)
             .attr("x2", 177)
             .attr("y2", 7825)

             svg.append('line')
             .style("stroke", "#cccccc")
             .style("stroke-width", 2)
             .attr("x1", 266)
             .attr("y1", 0)
             .attr("x2", 266)
             .attr("y2", 7825)

             svg.append('line')
          .style("stroke", "#555555")
          .style("stroke-width", 2)
          .attr("x1", 355)
          .attr("y1", 0)
          .attr("x2", 355)
          .attr("y2", 7825)

          svg.append('line')
          .style("stroke", "#cccccc")
          .style("stroke-width", 2)
          .attr("x1", 443)
          .attr("y1", 0)
          .attr("x2", 443)
          .attr("y2", 7825)

          svg.append('line')
          .style("stroke", "#cccccc")
          .style("stroke-width", 2)
          .attr("x1", 531)
          .attr("y1", 0)
          .attr("x2", 531)
          .attr("y2", 7825)

          svg.append('line')
          .style("stroke", "#cccccc")
          .style("stroke-width", 2)
          .attr("x1", 620)
          .attr("y1", 0)
          .attr("x2", 620)
          .attr("y2", 7825)

          svg.append('line')
          .style("stroke", "#d46c64")
          .style("stroke-width", 2)
          .attr("x1", 60)
          .attr("y1", 0)
          .attr("x2", 60)
          .attr("y2", 7825)

          svg.append('line')
          .style("stroke", "#FFFFFF")
          .style("stroke-width", 20)
          .attr("x1", 0)
          .attr("y1", -10)
          .attr("x2", 800)
          .attr("y2", -10)

          svg.append('text')
          .style("stroke", "#d46c64")
          .style("fill", "#d46c64")
          .style("text-anchor", "middle")
          .attr("x", 60)
          .attr("y", -6)
          .text("Pandemic Begins")

          svg.append('text')
          .style("stroke", "#555555")
          .style("fill", "#555555")
          .style("text-anchor", "middle")
          .attr("x", 355)
          .attr("y", -6)
          .text("2021 Begins")

          svg.append('line')
          .style("stroke", "#FFFFFF")
          .style("stroke-width", 20)
          .attr("x1", 0)
          .attr("y1", 7831)
          .attr("x2", 800)
          .attr("y2", 7831)

          svg.append('text')
          .style("stroke", "#d46c64")
          .style("fill", "#d46c64")
          .style("text-anchor", "middle")
          .attr("x", 60)
          .attr("y", 7838)
          .text("Pandemic Begins")

          svg.append('text')
          .style("stroke", "#555555")
          .style("fill", "#555555")
          .style("text-anchor", "middle")
          .attr("x", 355)
          .attr("y", 7838)
          .text("2021 Begins")

      });
});