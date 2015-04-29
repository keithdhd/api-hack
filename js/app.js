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
		showSearchResults(result);
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.results').append(errorElem);
	});
}

var showSearchResults = function(result){
	
	var artistTopTen = [];
	
	$.each(result.artists.items, function(i, item){

		//get the top 10 for this artist
		artistTopTen = getTopTen(item);
	});

}
var getTopTen = function(artist){

	var results = $.ajax({
		url: "https://api.spotify.com/v1/artists/" + artist.id + "/top-tracks?country=US",
		dataType: "json",
		type: "GET"
	})
	.done(function(results){
				// clone our result template code
		var resultsTemplate = $(".templates .artist").clone();

		var cover = resultsTemplate.find(".cover");
		var artistName = resultsTemplate.find(".artist-name");
		artistName.text(artist.name);
		
		if(artist.images.length){
			var imageUrl = artist.images[0].url;
		}else
			var imageUrl = "default image url";

		cover.css({
			"background-image": "url(" + imageUrl + ")",
			"background-size": "cover"
		});

		var topTenTemplate = resultsTemplate.find(".top-ten");
		topTenTemplate.text(results);

		$("#results").append(resultsTemplate).fadeIn(3000);
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