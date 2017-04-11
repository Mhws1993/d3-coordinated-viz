window.onload = setMap();
function setMap(){
	
	//map frame dimensions
	var width = 960,
		height = 460;

	//create new svg container for the map
	var map = d3.select("body")
		.append("svg")
		.attr("class", "map")
		.attr("width", width)
		.attr("height", height);

	//create Albers equal area conic projection centered on France
	var projection = d3.geoConicEqualArea()
		.center([0, 46.2])
		.rotate([98, 0])
		.parallels([43, 62])
		.scale(500)
		.translate([width / 2, height / 2]);

	var path = d3.geoPath()
		.projection(projection);

	//use d3.queue to parallelize asynchronous data loading
	d3.queue()
		/*.defer(d3.csv, "data/unitsData.csv") //load attributes from csv
		.defer(d3.json, "data/EuropeCountries.topojson") //load background spatial data
		.defer(d3.json, "data/FranceRegions.topojson") //load choropleth spatial data
		*/
		.defer(d3.csv, "data/d3_povertydata.csv") 
		.defer(d3.json, "data/ne_10m_admin_0_countries.topojson") 
		.defer(d3.json, "data/newtry_data.topojson")
		
		.await(callback);
		
	

function callback(error, csvData, country, states){
	
	 var graticule = d3.geoGraticule()
            .step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude

        //create graticule lines
    var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
            .data(graticule.lines()) //bind graticule lines to each element to be created
            .enter() //create an element for each datum
            .append("path") //append each element to the svg as a path element
            .attr("class", "gratLines") //assign class for styling
            .attr("d", path); //project graticule lines
	 var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
	
	
	var usa = topojson.feature(country, country.objects.ne_10m_admin_0_countries),
		 southern = states.features //get actual topojson layer. geojson layer lags more than topojson layers
		
			console.log(csvData);
			
	
        //add Europe countries to map
        var countries = map.append("path")
            .datum(usa)
            .attr("class", "countries")
            .attr("d", path);
			console.log(southern);

        //add France regions to map
        var regions = map.selectAll(".regions")
            .data(southern)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.adm1_code;
            })
            .attr("d", path);
    };
};