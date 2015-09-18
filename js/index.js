function getLines() {

	var lines = [];
	var requestType = 'Mode/Route?modes=tube';

	var res = xhrRequest(requestType, function(response) {

		for(var i=0; i<response.length; i++) {
			lines.push({
				'name': response[i].name,
				'id': response[i].id
			});
		}

		buildDropdown(lines, 'line');

	});
	
}

function getStations(line) {

	var stations = [];
	var requestType = line + '/StopPoints?modes=tube';

	var element = document.getElementById('station');

	if ( element.hasChildNodes() ) { 
		element.removeChild( element.childNodes[0] );
	}

	var res = xhrRequest(requestType, function(response) {

		for(var i=0; i<response.length; i++) {
			stations.push({
				'name': response[i].commonName,
				'id': response[i].id
			});
		}

		buildDropdown(stations, 'station');

	});

}

function getArrivals(stationId) {

	var tubeInfo = [];
	var line = document.getElementById('lineSelection').value;
	var requestType = line + '/Arrivals?stopPointId=' + stationId;

	var res = xhrRequest(requestType, function(response) {

		tubeInfo.push({
			'Current Location': response[0].currentLocation, 
			'Destination Name': response[0].destinationName,
			'Direction': response[0].direction,
			'Line Name': response[0].lineName,
			'Platform Name' : response[0].platformName,
			'Station Name' : response[0].stationName,
			'Time To Live' : response[0].timeToLive,
			'Time To Station' : response[0].timeToStation,
			'Towards' : response[0].towards

		});

		var info = document.getElementById('information');
		var ul = document.createElement('ul');
		info.appendChild(ul);

		for(key in tubeInfo[0]) {
			var li = document.createElement('li');
			li.innerHTML = '<strong>' + key + '</strong>' + ' - ' + tubeInfo[0][key];
			ul.appendChild(li);
		}
		
	});
}

function buildDropdown(obj, id) {

	var div = document.getElementById(id);

	var select = document.createElement('select');
	select.id = id + 'Selection';	
	div.appendChild(select);

	var option = document.createElement('option');
	var defaultOption = 'Select ' + id;
	option.innerHTML = defaultOption;
	select.appendChild(option);
	select.onchange = somethingChanged;

	for(var i=0; i<obj.length; i++) {
		el = document.createElement('option');
		el.innerHTML = obj[i].name;
		el.value = obj[i].id;
		el.id = obj[i].id;
		select.appendChild(el);
	}

}

function somethingChanged(e) {

	if(e.target.parentNode.id === 'line') {
		getStations(e.target.value);
	}

	if(e.target.parentNode.id === 'station') {
		getArrivals(e.target.value);	
	}
	
}
	
function xhrRequest(requestType, callback) {

	// appID and appKey are required and are available when you register with tfl api

	var response = '';
	var appID = '';
	var appKey = '';

	var req = new XMLHttpRequest();
	var url = 'https://api.tfl.gov.uk/Line/' + requestType + '&app_id=' + appID + '&app_key=' + appKey;
	req.open('GET', url, true);
	req.onload = function(e) {
		if(req.readyState === 4 ) {
			if(req.status === 200) {
				var response = JSON.parse(req.responseText);
				callback(response);
			}else {
				console.error(req.statusText);
			}
		}
	}
	req.send();

}

getLines();
