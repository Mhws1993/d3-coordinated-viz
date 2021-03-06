//What there is of d3.
(function(){

//pseudo-global variables
var attrArray = ["povline", "Unemployment", "HighGraduation", "HigherEdAttain", "FoodInsecurity"]; //list of attributes
var expressed = attrArray[0]; //initial attribute


//chart frame dimensions
var chartWidth = window.innerWidth * 0.425,
    chartHeight = 473,
    leftPadding = 25,
    rightPadding = 2,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

//create a scale to size bars proportionally to frame and for axis
   var yScale = d3.scaleLinear()
              /*.range([0, chartHeight])
              .domain([0, 105]);*/
			  
			    .range([463, 0])
				.domain([0, 110]);
			  
//start of script
window.onload = setMap();

//set up choropleth map
function setMap(){

    //map frame dimensions
    var width = window.innerWidth * 0.5,
        height = 460;


    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);


    var projection = d3.geoConicEqualArea()
            .center([0, 40])
            .rotate([98, 0])
            .parallels([43, 62])
            .scale(900)
            .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);


    d3.queue()
        .defer(d3.csv, "data/d3_povertydata5.csv") 
		.defer(d3.json, "data/theStates.geojson")   
        .await(callback);

function callback(error, csvData, states){
        //place graticule on the map
        setGraticule(map, path);


       var southern = states.features;


        southern = joinData(southern, csvData);
		createDropdown(csvData);
        var colorScale = makeColorScale(csvData);

        setEnumerationUnits(southern, map, path, colorScale);

        setChart(csvData, colorScale);
    };
};

function setGraticule(map, path){

    var graticule = d3.geoGraticule()
        .step([5, 5]); //place graticule lines every 5 degrees
    //create graticule background
    var gratBackground = map.append("path")
        .datum(graticule.outline()) //bind graticule
        .attr("class", "gratBackground") //assign class
        .attr("d", path) //project

    //create graticule lines
    var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
        .data(graticule.lines()) //bind graticule lines to each element to be created
        .enter() //create an element
        .append("path") //append each element to svg 
        .attr("class", "gratLines") 
        .attr("d", path); //project graticule lines
};

function joinData(southern, csvData){
    //loop through csv to assign each set of csv attribute values to geojson region
    for (var i=0; i<csvData.length; i++){
        var csvRegion = csvData[i]; //the current region
        var csvKey = csvRegion.name; //the CSV primary key

        //loop through geojson regions to find correct region
        for (var a=0; a<southern.length; a++){

            var geojsonProps = southern[a].properties; //the current region geojson properties
            var geojsonKey = geojsonProps.name; //the geojson primary key
           
            //transfer csv data to geojson
            if (geojsonKey == csvKey){

                //assign all attributes and values
                attrArray.forEach(function(attr){
                    var val = parseFloat(csvRegion[attr]); //get csv attribute value
                    geojsonProps[attr] = val;
                });
            };
        };
      };

      return southern;
};

function setEnumerationUnits(southern, map, path, colorScale){

    var regions = map.selectAll(".regions")
        .data(southern)
        .enter()
        .append("path")
        .attr("class", function(d){
            return "regions " + d.properties.name;
        })
        .attr("d", path)
        .style("fill", function(d){
            return choropleth(d.properties, colorScale);
        })
///new		
		  .on("mouseover", function(d){
            highlight(d.properties);
        });

		
		
};//end setEnumerationUnits

//function to create color scale generator
function makeColorScale(data){
    var colorClasses = [
      "#ffffcc",
      "#c2e699",
      "#78c679",
      "#31a354",
      "#006837"
    ];

    //create color scale generator
    var colorScale = d3.scaleQuantile()
        .range(colorClasses);

    //build array of all values of the expressed attribute
    var domainArray = [];
    for (var i=0; i<data.length; i++){
        var val = parseFloat(data[i][expressed]);
        domainArray.push(val);
    };

    //assign array of expressed values as scale domain
    colorScale.domain(domainArray);

    return colorScale;
};

 function choropleth(props, colorScale){

      var val = parseFloat(props[expressed]);

      if (typeof val == 'number' && !isNaN(val)){
          return colorScale(val);
      } else {
          return "#636363";
      };
};

function setChart(csvData, colorScale){

    var chartWidth = window.innerWidth * 0.425,
        chartHeight = 460;

     var chart = d3.select("body")
           .append("svg")
           .attr("width", chartWidth)
           .attr("height", chartHeight)
           .attr("class", "chart");
           //var y scale above var bars?

           //set bars for each province
    var bars = chart.selectAll(".bars")
           var bars = chart.selectAll(".bar")
        .data(csvData)
        .enter()
        .append("rect")
        .sort(function(a, b){
            return a[expressed]-b[expressed]
        })
        .attr("class", function(d){
            return "bar " + d.name;
        })
        .attr("width", chartInnerWidth / csvData.length - 1)
        .on("mouseover", highlight);
		
		
var numbers = chart.selectAll(".numbers")
                   .data(csvData)
                   .enter()
                   .append("text")
                   .sort(function(a, b){
                       return a[expressed]-b[expressed]
                   })
                   .attr("class", function(d){
                       return "numbers " + d.name;
                   })
                   .attr("text-anchor", "middle")
                   .attr("x", function(d, i){
                       var fraction = chartWidth / csvData.length;
                       return i * fraction + (fraction - 1) / 2;
                   })
                   .attr("y", function(d){
                       return chartHeight - yScale(parseFloat(d[expressed])) + 15;
                   })
                   .text(function(d){
                       return d[expressed];
                   }); 
		var titleArray = ["Percent of people living under the poverty line", "Percent of people who are unemployed", "Percent of people that haven't graduated high school",
 "Percent of people who haven't completed a form of higher education", "Percent of people who stuggle with food insecurity"];//list of attributes
			var chartTitle = chart.append("text")
                        .attr("x", 20)
                        .attr("y", 40)
                        .attr("class", "chartTitle")
                        .text(titleArray[3]);
                        //.text(expressed[3] + " by state");
						updateChart(bars, csvData.length, colorScale);
  };//end of setchart
  
  //function to reset the element style on mouseout
function dehighlight(props){
    var selected = d3.selectAll("." + props.name)
        .style("stroke", function(){
            return getStyle(this, "stroke")
        })
        .style("stroke-width", function(){
            return getStyle(this, "stroke-width")
        });

    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };
};
  
 
  //function to create a dropdown menu for attribute selection
function createDropdown(csvData){
    //add select element
      var dropdown = d3.select("body")
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){
            changeAttribute(this.value, csvData)
        });
		
		
    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("Select Attribute");

    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attrArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d })
	 .on("change", function(){
            changeAttribute(this.value, csvData)
        });
};//end of createDropdown
  //dropdown istener
function changeAttribute(attribute, csvData){
    //change the expressed attribute
    expressed = attribute;

    //recreate the color scale
    var colorScale = makeColorScale(csvData);

    //recolor enumeration units
    var regions = d3.selectAll(".regions")
		.transition()
        .duration(1000)
        .style("fill", function(d){
            return choropleth(d.properties, colorScale)
        })
		
		
		var bars = d3.selectAll(".bar")
        //re-sort bars
        .sort(function(a, b){
            return a[expressed] - b[expressed];
        })
 .transition() //animation
        .delay(function(d, i){
            return i * 20
        })
        .duration(500);
    updateChart(bars, csvData.length, colorScale);
		
		
		
  }; //end of changeAttribute

function updateChart(bars, n, colorScale){
    //position bars
    bars.attr("x", function(d, i){
            return i * (chartInnerWidth / n) + leftPadding;
        })
        //size/resize bars
        .attr("height", function(d, i){
            return 463 - yScale(parseFloat(d[expressed]));
        })
        .attr("y", function(d, i){
            return yScale(parseFloat(d[expressed])) + topBottomPadding;
        })
        //color/recolor bars
        .style("fill", function(d){
            return choropleth(d, colorScale);
        });
  }; //end updateChart
  
  //function to highlight enumeration units and bars
function highlight(props){
    //change stroke
    var selected = d3.selectAll("." + props.name)
        .style("stroke", "blue")
        .style("stroke-width", "2");
};//end of highlight
  
})();//end function
