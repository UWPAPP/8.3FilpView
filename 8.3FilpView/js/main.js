﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509

(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	var isFirstActivation = true;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.voiceCommand) {
			// TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
			// this is a good place to decide whether to populate an input field or choose a different initial view.
		}
		else if (args.detail.kind === activation.ActivationKind.launch) {
			// A Launch activation happens when the user launches your app via the tile
			// or invokes a toast notification by clicking or tapping on the body.
			if (args.detail.arguments) {
				// TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
				// to take the user in response to them invoking a toast notification.
			}
			else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
				// TODO: This application had been suspended and was then terminated to reclaim memory.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
				// Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
			}
		}

		if (!args.detail.prelaunchActivated) {
			// TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
			// In that case it would be suspended shortly thereafter.
			// Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
			// should be done here (to avoid doing them in the prelaunch case).
			// Alternatively, this work can be done in a resume or visibilitychanged handler.
		}

		if (isFirstActivation) {
			// TODO: The app was activated and had not been running. Do general startup initialization here.
			document.addEventListener("visibilitychange", onVisibilityChanged);
			args.setPromise(WinJS.UI.processAll());
		}

		isFirstActivation = false;
	};

	function onVisibilityChanged(args) {
		if (!document.hidden) {
			// TODO: The app just became visible. This may be a good time to refresh the view.
		}
	}

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();



	var myTOCData;
	var myFlipView;

    // initialize()
    //
    //      Purpose:
    //          To build the table of contents (TOC) we want to walk through
    //          the items in the dataSource and create links for them.  To
    //          simplify the process, the first item in the data source will
    //          duplicate the remaining items.  This makes it simple to
    //          constuct the TOC as well as template the remaining items.
	function initialize() {
	    myFlipView = document.getElementById("interactiveContent_FlipView").winControl;

	    // Attach Click Event Handlers to determine which item to navigate to.
	    myFlipView.addEventListener("click", clickHandler, false);

	    // Copy the data source and insert it as the first item in.
	    var contents = { type: "contentsArray", contents: DefaultData.array };
	    myTOCData = DefaultData.array.slice(0);
	    myTOCData.splice(0, 0, contents);

	    // Update Scenario 3 FlipView to use the custom template and the Table of
	    // contents data source.
	    myFlipView.itemTemplate = mytemplate;
	    myFlipView.itemDataSource = new WinJS.Binding.List(myTOCData).dataSource;
	}

    //  mytemplate
    //
    //      Purpose: This function simply picks whether the Item or Table of
    //               Contents needs to be rendered and calls the appropriate
    //               function.
	function mytemplate(itemPromise) {
	    return itemPromise.then(function (currentItem) {
	        if (currentItem.data.type === "item") {
	            return renderItem(currentItem.data);

	        } else {
	            return renderTableOfContents(currentItem.data, currentItem.key);
	        }
	    });
	}

    //  renderTableOfContents()
    //
    //      Purpose: This function is responsible for walking through an array
    //               of titles and constructing the table of contents.
	function renderTableOfContents(dataObject, index) {

	    // Step 1) Create an element to hold the table of contents.
	    var TableOfContents = document.createElement("div");
	    TableOfContents.className = "TableOfContents";

	    // Step 2) Create an element used to center the title and items.
	    var TOCCenter = document.createElement("div");
	    TOCCenter.className = "TOCCenter";

	    var title = document.createElement("h2");
	    title.className = "TOCTitle";
	    title.textContent = "Table of Contents";

	    TOCCenter.appendChild(title);

	    // Step 3) Loop through the elements and add them to the Table.
	    for (var i = 0, len = dataObject.contents.length; i < len; i++) {
	        TOCCenter.appendChild(renderTOCItem(dataObject.contents[i].title, i));
	    }
	    TableOfContents.appendChild(TOCCenter);

	    return TableOfContents;
	}

	function renderTOCItem(itemName, itemNumber) {

	    // Create the container that will hold all of the sub-elements
	    var itemContainer = document.createElement("button");
	    itemContainer.value = itemNumber + 1;
	    itemContainer.className = "itemContainer";

	    // Create a div to add some color to the item
	    var lightStrip = document.createElement("div");
	    lightStrip.className = "lightStrip";

	    // Create a simple anchor tag to make the titles interactive,
	    // store the item number so that it can be retrieved onClick,
	    // add set the class name for styling, and set the visible text.
	    var TOCItem = document.createElement("p");
	    TOCItem.className = "TOCItem";
	    TOCItem.textContent = itemName;

	    // Put all the pieces together
	    itemContainer.appendChild(lightStrip);
	    itemContainer.appendChild(TOCItem);

	    return itemContainer;
	}

    // renderItem()
    //
    //      Purpose: This function takes the raw data and constructs the
    //               item that is used in the FlipView.  It creates items of
    //               the following form:
    //
    //                  <div class="Scenario3_ItemTemplate">
    //                      <div class="overlaidItemTemplate">
    //                          <img class="image" data-win-bind="src: picture" data-win-bind="alt: title" />
    //                          <div class="overlay">
    //                              <div class="ItemTitle" data-win-bind="textContent: title"></div>
    //                          </div>
    //                      </div>
    //                  </div>
	function renderItem(dataObject) {

	    // Create the Item Title div
	    var itemTitle = document.createElement("h2");
	    itemTitle.className = "overlayElement ItemTitle";
	    itemTitle.textContent = dataObject.title;

	    // Create the Item Title div
	    var TOC = document.createElement("a");
	    TOC.className = "overlayElement win-type-xx-small returnTOC";
	    TOC.textContent = "Click to return to the Table of Contents.";

	    // Create the Overlay div
	    var overlay = document.createElement("div");
	    overlay.className = "overlayElement overlay";
	    overlay.appendChild(itemTitle);
	    overlay.appendChild(TOC);

	    // Create the Image div
	    var image = document.createElement("img");
	    image.className = "image";
	    image.src = dataObject.picture;
	    image.alt = dataObject.title;

	    // Create the overlaidItemTemplate div
	    var overlaidItemTemplate = document.createElement("div");
	    overlaidItemTemplate.className = "overlaidItemTemplate";
	    overlaidItemTemplate.appendChild(image);
	    overlaidItemTemplate.appendChild(overlay);

	    return overlaidItemTemplate;
	}

    // clickHandler
    //
    //      Purpose: This event handler is responsible for trigger navigation
    //               to the item that was clicked on in the table of contents
    //               or navigating back to the table of contents when the link
    //               is clicked on a item.
	function clickHandler(evt) {

	    // First check if the source of the event is an item in the table of
	    // contents
	    if (WinJS.Utilities.hasClass(evt.target, "itemContainer")) {
	        myFlipView.currentPage = parseInt(evt.target.value);
	    } else if (WinJS.Utilities.hasClass(evt.target, "TOCItem")) {
	        // Since we are navigating to an item, we need to retrieve the
	        // number of the page and set the currentPage on the FlipView.
	        myFlipView.currentPage = parseInt(evt.target.parentNode.value);
	    } else if (WinJS.Utilities.hasClass(evt.target, "returnTOC")) {

	        // Since we know that we are returning to the table of contents,
	        // simply set the currentPage to trigger the navigation.
	        myFlipView.currentPage = 0;
	    }
	}

	var array = [
        { type: "item", title: "Rainier", picture: "/pages/flipview/images/Rainier.jpg" },
        { type: "item", title: "Cliff", picture: "/pages/flipview/images/Cliff.jpg" },
        { type: "item", title: "Grapes", picture: "/pages/flipview/images/Grapes.jpg" },
        { type: "item", title: "Sunset", picture: "/pages/flipview/images/Sunset.jpg" },
        { type: "item", title: "Valley", picture: "/pages/flipview/images/Valley.jpg" }
	];
	var bindingList = new WinJS.Binding.List(array);

	WinJS.Namespace.define("DefaultData", {
	    bindingList: bindingList,
	    array: array
	});

	WinJS.UI.processAll().done(initialize);



})();
