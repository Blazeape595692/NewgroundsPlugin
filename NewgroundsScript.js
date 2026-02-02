const PLATFORM = "Newgrounds";
const X_REQUESTED_WITH = "XMLHttpRequest"
const URL_MOVIE_SEARCH = "https://www.newgrounds.com/search/conduct/movies?terms={0}&page={1}&inner=1";
const URL_CREATOR_SEARCH = "https://www.newgrounds.com/search/conduct/users?terms={0}&page={1}&inner=1";
const URL_CREATOR_PROFILE = "https://{0}.newgrounds.com";
const URL_CREATOR_MOVIES = "https://{0}.newgrounds.com/movies";
const URL_MOVIE_FILE = "https://www.newgrounds.com/portal/video/{0}";
const URL_FEATURED_MOVIES = "https://www.newgrounds.com/movies/featured?offset={0}&inner=1";

var config = {};

let token
let local_settings

//Source Methods
source.enable = function(_confing, settings, savedState){
	local_settings = settings
}
source.getHome = function() {
	return new NGFeaturedMoviePager(1);
};

source.searchSuggestions = function(query) {
	return [];
};

source.getSearchCapabilities = () => {
	return {
		types: [Type.Feed.Mixed],
		sorts: [Type.Order.Chronological],
		filters: [ ]
	};
};

source.search = function (query, type, order, filters) {
	return new NGCreatorPager([], false);
};

source.getSearchChannelContentsCapabilities = function () {
	return {
		types: [Type.Feed.Mixed],
		sorts: [Type.Order.Chronological],
		filters: []
	};
};

source.searchChannelContents = function (channelUrl, query, type, order, filters) {
	
};

source.searchChannels = function (query) {
	
};

//Channel
source.isChannelUrl = function(url) {
	return url.match("^https:\/\/(?!www\.)[a-zA-Z0-9-]+\.newgrounds\.com\/$");
};

source.getChannel = function(url) {
	throw new ScriptException("This is a sample");
};
source.getChannelContents = function(url) {
	throw new ScriptException("This is a sample");
};

//Video
source.isContentDetailsUrl = function(url) {
	return false;
};
source.getContentDetails = function(url) {
	throw new ScriptException("This is a sample");
};

//Comments
source.getComments = function (url) {
	throw new ScriptException("This is a sample");

}
source.getSubComments = function (comment) {
	throw new ScriptException("This is a sample");
}

log("LOADED");

class NGMoviePager extends ContentPager {
	currentPage = 0;

	constructor(someInfo) {
		super([], true); //Alternatively, pass first page results in []
		this.someInfo = someInfo;
	}

	nextPage() {
		currentPage += 1;
		const myNewResults = [];
		this.results = myNewResults;
		this.hasMore = true; //Or false if last page
	}
}

class NGFeaturedMoviePager extends ContentPager {
	currentPage = 1;

	constructor() {
		featuredResp = http.GET(URL_FEATURED_MOVIES.replace("{0}", "1"), { "X-Requested-With": X_REQUESTED_WITH }, null);
		if (featuredResp.isOk)
		{
			let videos = [];
			let featuredContent = domDOMParser.parseFromString(featuredResp.body.content);
			let featuredVideos = featuredContent.querySelector('.portalsubmission-cell');
			featuredVideos.forEach(function(x) {
				let videoMetaData = x.querySelector('a');
				authorName = x.querySelector('.card-title span').text().toLowerCase().replace("by ", "");
				videos.push(new PlatformVideo({
					id: new PlatformID(PLATFORM, videoMetaData.getAttribute('data-video-playback'), config.id),
					thumbnails: new Thumbnails([
						new Thumbnail(x.querySelector('.card-img').getAttribute("src"), 720)
					]),
					url: videoMetaData.getAttribute('href'),
					author: new PlatformAuthorLink(new PlatformID(PLATFORM, authorName, config.id), authorName, URL_CREATOR_PROFILE.replace("{0}", authorName), "", null),
					name: x.getAttribute("title"),
					viewCount: 0,
					duration: 0,
					isLive: false
				}));
			});
			super(videos, true);
		}
		super([], false);
	}

	nextPage() {
		currentPage += 1;
		const myNewResults = [];
		this.results = myNewResults;
		this.hasMore = true; //Or false if last page
	}
}

class NGCreatorPager extends ChannelPager {
	currentPage = 0;

	constructor(someInfo) {
		super([], true); //Alternatively, pass first page results in []
		this.someInfo = someInfo;
	}

	nextPage() {
		currentPage += 1;
		const myNewResults = [];
		this.results = myNewResults;
		this.hasMore = true; //Or false if last page
	}
}
