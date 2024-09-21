let currentVideoId = '';
        let intervalId = null;
        let invalidLinkShown = false;
        let lastInvalidLink = '';

        function runWithinTimeInterval(durationInMinutes) {
            const now = new Date();
            const endTime = new Date(now.getTime() + durationInMinutes * 60000); // Convert minutes to milliseconds

            // Clear previous interval if exists
            clearInterval(intervalId);

            // Set the interval to check every second
            intervalId = setInterval(checkAndPerformAction, 1000);

            // Function to perform the action if the current time is within the interval
            function checkAndPerformAction() {
                const currentTime = new Date();

                // Check if the current time is within the interval
                if (currentTime <= endTime) {
                    performScheduledAction();
                } else {
                    // Clear interval and close the video
                    clearInterval(intervalId);
                    closeVideo();
                }
            }
        }

        function performScheduledAction() {
            console.log("The scheduled action is performed!");
            // Get the entered video link
            const videoLink = document.getElementById('videoLink').value;

            // Skip popup if the duration is set to None
            const selectedDuration = document.querySelector('input[name="duration"]:checked').id;
            if (selectedDuration === 'None') {
                closeVideo();
                return;
            }

            // Extract the video ID from the link
            let videoId;
            if (videoLink.includes('youtube.com')) {
                videoId = videoLink.split('v=')[1];
                const ampersandPosition = videoId.indexOf('&');
                if (ampersandPosition !== -1) {
                    videoId = videoId.substring(0, ampersandPosition);
                }
            } else if (videoLink.includes('youtu.be')) {
                videoId = videoLink.split('.be/')[1];
            } else {
                // Show the custom popup for invalid YouTube link only once per unique link
                if (videoLink !== lastInvalidLink) {
                    document.getElementById('popup').style.display = 'block';
                    lastInvalidLink = videoLink;
                    // Clear the input box for invalid link
                    document.getElementById('videoLink').value = '';
                }
                return;
            }

            // Check if the video ID is the same as current video ID to prevent reloading the same video
            if (videoId !== currentVideoId) {
                // Update the iframe with the new video link
                const iframe = document.getElementById('videoIframe');
                iframe.src = 'https://www.youtube.com/embed/' + videoId;

                // Show the iframe
                iframe.style.display = 'block';

                // Store the current video ID
                currentVideoId = videoId;

                // Hide the popup if previously shown for the same link
                if (videoLink === lastInvalidLink) {
                    document.getElementById('popup').style.display = 'none';
                    lastInvalidLink = ''; // Reset last invalid link
                }
            }
        }

        function closeVideo() {
            // Hide the iframe
            const iframe = document.getElementById('videoIframe');
            iframe.style.display = 'none';
            
            // Stop video playback (optional)
            iframe.src = '';
            
            // Reset current video ID
            currentVideoId = '';

            // Clear the video link input
            document.getElementById('videoLink').value = '';
        }

        // Function to handle radio button click and update start time
        function selectDuration(duration) {
            if (duration === 'None') {
                // Close the video if currently playing
                if (currentVideoId) {
                    closeVideo();
                }
                // Clear the video link input
                document.getElementById('videoLink').value = '';
                return;
            }

            switch (duration) {
                case '1hour':
                    runWithinTimeInterval(60); // 60 minutes
                    break;
                case '2hours':
                    runWithinTimeInterval(120); // 120 minutes
                    break;
                case '3hours':
                    runWithinTimeInterval(180); // 180 minutes
                    break;
                case '4hours':
                    runWithinTimeInterval(240); // 240 minutes
                    break;
                case 'custom':
                    document.getElementById('customPopup').style.display = 'block';
                    break;
                default:
                    break;
            }
        }

        function setCustomDuration() {
            const customDuration = parseInt(document.getElementById('customDurationInput').value);
            if (!isNaN(customDuration)) {
                runWithinTimeInterval(customDuration);
            }
            document.getElementById('customPopup').style.display = 'none';
        }

        // Close the custom popup
        function closePopup() {
            document.getElementById('popup').style.display = 'none';
            lastInvalidLink = ''; // Reset last invalid link when popup is closed
        }

        // Close the custom duration popup
        function closeCustomPopup() {
            document.getElementById('customPopup').style.display = 'none';
        }

        // Run the function to set the interval when the window loads
        window.onload = function() {
            // Set default duration to None (no video playing)
            selectDuration('None');
        };

            // Updated function to show the usage popup with overlay
       function showUsagePopup() {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('usagePopup').style.display = 'block';
    }

    // Updated function to close the usage popup and hide overlay
    function closeUsagePopup() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('usagePopup').style.display = 'none';
    }

    // Modify the window.onload function
    window.onload = function() {
        // Set default duration to None (no video playing)
        selectDuration('None');
        // Show the usage popup
        showUsagePopup();
    };
