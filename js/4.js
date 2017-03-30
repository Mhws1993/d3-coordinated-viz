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
	var projection = d3.geoAlbers()
		.center([-86, 46.2])
		.rotate([-2, 0])
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
		console.log(newtry_data)
		.await(callback);
		
		//create graticule generator
		
		
		
		
		/*function callback(error, csvData, europe, france){
        //translate europe TopoJSON
        var europeCountries = topojson.feature(europe, europe.objects.EuropeCountries),
            franceRegions = topojson.feature(france, france.objects.FranceRegions).features;
			
			    //add Europe countries to map
        var countries = map.append("path")
            .datum(europeCountries)
            .attr("class", "countries")
            .attr("d", path);

        //add France regions to map
        var regions = map.selectAll(".regions")
            .data(franceRegions)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.adm1_code;
            })
            .attr("d", path);
    };
*/

function callback(error, csvData, country, states){
	
	var usa = topojson.feature(country, country.objects.ne_10m_admin_0_countries),
		 southern = topojson.feature(states, states.objects.newtry_data).features;
			
			
	
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