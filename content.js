//Set debug mode on or off
const inDebug = false;

//init vars to hold the DOM elements containing the video and scrubbing graphic
var vidElement = undefined;
var ffBezel = undefined;
getElements();

//setup an object to wach the DOM for changes and update the element vaiables
//this is done beacuse the YouTube webapp does not load a new page when a user clicks on a video so the element vars will be set to null  
const bodyObserver = new MutationObserver(getElements);
const bodyObserverConfig = { childList: true, subtree: true };
bodyObserver.observe(document.body, bodyObserverConfig);

//init the rate at which this extension will scrubb through the video 
//and tell it to update whenever a change is made to the extension storage 
var scrubbRate = 5;
refreshScrubbRate();
chrome.storage.onChanged.addListener(refreshScrubbRate);

if(inDebug)
{
	if(!vidElement || !ffBezel)
	{
		console.log('YouTube Scrubbing Rate Controller ERROR: the proper page elements could not be captured for the extension to work');
	}
	else
	{
		console.log('YouTube Scrubbing Rate Controller extension ready and waiting');
	}
}

//setup keyboard input
window.addEventListener('keydown', onClick);
function onClick(keyboardEvent)
{
	if(inDebug)
	{
		console.log(keyboardEvent);
	}

	if(keyboardEvent.ctrlKey)
	{
		if(keyboardEvent.key == 'ArrowRight' || keyboardEvent.key == 'd')
		{
			scrubb('forward');
		}
		else if(keyboardEvent.key == 'ArrowLeft' || keyboardEvent.key == 'a')
		{
			scrubb('backward');
		}
	}
}

function scrubb(direction)
{
	if(direction == 'forward')
	{
		vidElement.currentTime += scrubbRate;
		if(inDebug)
		{
			console.log(`scrubbing forward by ${scrubbRate}s`);
		}
	}
	else if(direction == 'backward')
	{
		vidElement.currentTime -= scrubbRate;
		if(inDebug)
		{
			console.log(`scrubbing backward by ${scrubbRate}s`);
		}
	}
}
function refreshScrubbRate() 
{
	chrome.storage.sync.get(['rate'], function(result) {

		if(result.rate)
		{
			scrubbRate = parseFloat(result.rate);
		}

		if(inDebug)
		{
			console.log(scrubbRate);
			console.log(result.rate);
		}
	});
}
function getElements() 
{
	if(!vidElement || !ffBezel)
	{
		vidElement = document.querySelector('.html5-main-video');
		ffBezel = document.querySelector('.ytp-bezel-icon');

		if(inDebug)
		{
			console.log(vidElement);
			console.log(ffBezel);
		}
	}
}