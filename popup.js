var inputs = document.querySelectorAll('.wrapper input');

setCheckedRadioButton();
chrome.storage.onChanged.addListener(setCheckedRadioButton);

for(input of inputs)
{
	input.oninput = function(event) {

		var newRate = event.target.value;

		chrome.storage.sync.set({ rate: newRate }, function() {

		});
		console.log('set a new rate');
	};
}

function setCheckedRadioButton()
{
	var currentRate = 5;
	chrome.storage.sync.get(['rate'], function(result) {
		if(result.rate)
		{
			currentRate = result.rate;
		}
		
		for(input of inputs)
		{
			if(input.value == currentRate)
			{
				input.checked = true;
			}
		}
	});
}