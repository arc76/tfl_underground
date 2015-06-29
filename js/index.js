function getLines() {

	var lines = [];
	var requestType = 'Mode/Route';

	var res = xhrRequest(requestType, function(response) {

		for(var i=0; i<response.length; i++) {
			lines.push({'name':response[i].name, 'id':response[i].id});
		}

		buildDropdown(lines, 'line');

	});
	
}

function getStations(line) {

	var stations = [];
	var requestType = line + '/StopPoints';

	var element = document.getElementById('station');

	if ( element.hasChildNodes() ) { 
		element.removeChild( element.childNodes[0] );
	}

	var res = xhrRequest(requestType, function(response) {

		for(var i=0; i<response.length; i++) {
			stations.push({'name':response[i].commonName, 'id':response[i].id});
		}

		buildDropdown(stations, 'station');

	});

}

function getArrivals(id) {

}

function buildDropdown(obj, id) {

	var div = document.getElementById(id);

	var select = document.createElement('select');
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

	var response = '';
	var appID = '87909d56';
	var appKey = '1039040d1280c0ca995b4da746bd0736';

	var req = new XMLHttpRequest();
	var url = 'https://api.tfl.gov.uk/Line/' + requestType + '?modes=tube&app_id=' + appID + '&app_key=' + appKey;
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
