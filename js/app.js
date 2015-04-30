$(function(){

	$("#search-button").click(function(event){
		$("#results").html("");
		$("#results").hide();

		var searchQuery = $("#input-search").val().trim();
		getSearchResults(searchQuery);
	});

})

var getSearchResults = function(searchQuery){

	var params = {
		q: searchQuery,
		type: "artist"
	};

	var results = $.ajax({
		url: "https://api.spotify.com/v1/search",
		data: params,
		dataType: "json",
		type: "GET"
	})
	.done(function(result){
				
console.log(result);
		//for each artist get their top ten tracks
		$.each(result.artists.items, function(i, item){
				//get the top 10 for this artist then display the results
				 getTopTen(item);
			});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.results').append(errorElem);
	});
}

var showSearchResults = function(artist, topTen){	
		// clone our result template code
		var resultsTemplate = $(".templates .artist").clone();

		var cover = resultsTemplate.find(".cover");
		var artistName = resultsTemplate.find(".artist-name");
		artistName.text(artist.name);
		
		if(artist.images.length){
			var imageUrl = artist.images[0].url;
		}else
			var imageUrl = "no-picture.jpg";

		cover.css({
			"background-image": "url(" + imageUrl + ")",
			"background-size": "cover"
		});

		var topTenTemplate = resultsTemplate.find(".top-ten");

		//for each track, display its title ranking and popularity
		$.each(topTen.tracks, function(i, trackObject){
			topTenTemplate.append((i+1) + ".  <a target='_blank' href='" + trackObject.preview_url + "'>" + trackObject.name + "</a><br/>");
		});
		
		$("#results").append(resultsTemplate).fadeIn(3000);
}

var getTopTen = function(artist){

	var results = $.ajax({
		url: "https://api.spotify.com/v1/artists/" + artist.id + "/top-tracks?country=US",
		dataType: "json",
		type: "GET"
	})
	.done(function(results){
		showSearchResults(artist, results);
	})	
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.results').append(errorElem);
	});
	
}

var showError = function(error){
	// clone our error template code
	var errorTemplate = $(".templates .error").clone();
	errorTemplate.text(error);
	return errorTemplate;
}