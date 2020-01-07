// read in json file
var names = [];
var metadata = [];
var samples = [];
d3.json("http://localhost:8000/static/js/data/samples.json").then((data) => {
  names = data.names;
  populateDropwdown(names);
  metadata = data.metadata;
  samples = data.samples;   
})

function populateDropwdown(names) {
  var selector = d3.select("#selDataset").html("");
  // Use `.html("") to clear any existing metadata
  selector.html("");
  selector.selectAll("option")
		.data(names)
		.enter().append("option")
		.text(function(d) { return d; })
		.attr("value", function (d) {
			return d;
		});
}
function optionChanged(value) {
  updateDemographicInfo(value);
  updateBarChart(value);
  updateBubbleChart(value);
}

// Update demographic info box
function updateDemographicInfo(key) {
  var demoInfo = d3.select("#sample-metadata").html("");
  demoInfo.html("");
  info = metadata.find(d => d.id == key);
  demoInfo.append("text").html("<font size='1'>" 
    + "id: " + key
    + "<br>"
    + "ethnicity: " + info.ethnicity
    + "<br>"
    + "gender: " + info.gender
    + "<br>"
    + "age: " + info.age
    + "<br>"
    + "location: " + info.location
    + "<br>"
    + "bbtype: " + info.bbtype
    + "<br>"
    + "wfreq: " + info.wfreq 
    + "</font><br>");
}
//update barchart
function updateBarChart(key) {

  var mySamples = samples.filter(s => s.id.toString() === key)[0];
  
  // Getting the top 10 
  var samplevalues = mySamples.sample_values.slice(0, 10).reverse();


  var OTU_top = (mySamples.otu_ids.slice(0, 10)).reverse();
  
  var OTU_id = OTU_top.map(d => "OTU " + d);

  var labels = mySamples.otu_labels.slice(0, 10);

  // create trace variable for the plot
  var trace = {
      x: samplevalues,
      y: OTU_id,
      text: labels,
      marker: {
        color: 'pink'},
      type:"bar",
      orientation: "h",
  };

  // create data variable
  var data = [trace];

  // create layout variable to set plots layout
  var layout = {
      
      yaxis:{
          tickmode:"linear",
      },
      margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 30
      }
  };

  // create the bar plot
  Plotly.newPlot("bar", data, layout);
}

// update bubble chart
function updateBubbleChart(key) {
  var mySamples = samples.filter(s => s.id.toString() === key)[0];
  
  // Getting the top 10 
  var samplevalues = mySamples.sample_values.slice(0, 10).reverse();
  var OTU_top = (mySamples.otu_ids.slice(0, 10)).reverse();
  var OTU_id = OTU_top.map(d => "OTU " + d);


  var labels = mySamples.otu_labels.slice(0, 10);

  // The bubble chart
  var trace1 = {
    x: mySamples.otu_ids,
    y: mySamples.sample_values,
    mode: "markers",
    marker: {
        size: mySamples.sample_values,
        color: mySamples.otu_ids
    },
    text: mySamples.otu_labels
  };


  var layout1 = {
      height: 600,
      width: 1000
  };

  // creating data variable 
  var data1 = [trace1];

  // create the bubble plot
  Plotly.newPlot("bubble", data1, layout1);
}
