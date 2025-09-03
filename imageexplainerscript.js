const imageUpload = document.getElementById('imageUpload');
        const imagePreview = document.getElementById('imagePreview');
        const promptInput = document.getElementById('promptInput');
        const explainButton = document.getElementById('explainButton');
        const responseArea = document.getElementById('responseArea');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const messageBox = document.getElementById('messageBox');

        let base64ImageData = ''; // To store the base64 encoded image

        // Function to display messages to the user
        function showMessage(message, type = 'warning') {
            messageBox.textContent = message;
            messageBox.className = 'message-box ' + type; // Set class for styling
            messageBox.style.display = 'block';
        }

        // Function to hide messages
        function hideMessage() {
            messageBox.style.display = 'none';
            messageBox.textContent = '';
            messageBox.className = 'message-box';
        }

        // Function to process an image file/blob and display it
        function processImage(file) {
            hideMessage();
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block'; // Show the image preview
                    // Extract base64 data (remove the data:image/png;base64, prefix)
                    base64ImageData = e.target.result.split(',')[1];
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = '#';
                imagePreview.style.display = 'none'; // Hide if no file selected
                base64ImageData = '';
            }
        }

        // Handle image file selection and preview
        imageUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            processImage(file);
        });

        // Handle paste event for images
        document.addEventListener('paste', function(event) {
            hideMessage();
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            let imageFound = false;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    processImage(blob);
                    imageFound = true;
                    break;
                }
            }
            if (!imageFound) {
                showMessage('No image found in clipboard.', 'warning');
            }
        });


        // Handle the "Explain Image" button click
        explainButton.addEventListener('click', async function() {
            hideMessage();
            const prompt = promptInput.value.trim();

            if (!base64ImageData) {
                showMessage('Please upload or paste an image first.', 'warning');
                return;
            }
            if (!prompt) {
                showMessage('Please enter a prompt for the image.', 'warning');
                return;
            }

            responseArea.textContent = ''; // Clear previous response
            loadingSpinner.style.display = 'block'; // Show loading spinner
            explainButton.disabled = true; // Disable button during loading

            try {
                let chatHistory = [];
                // Add the user's prompt and image data to the chat history
                chatHistory.push({
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: "image/png", // Assuming PNG, but could be dynamic based on file type
                                data: base64ImageData
                            }
                        }
                    ]
                });

                const payload = {
                    contents: chatHistory,
                };

                const apiKey = "AIzaSyA6_zEoo5YkwCsFZVTMzVQDZMGRVcUTGco"; // Canvas will automatically provide the API key
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

                let retryCount = 0;
                const maxRetries = 5;
                let delay = 1000; // 1 second

                while (retryCount < maxRetries) {
                    try {
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (!response.ok) {
                            // If response is not OK, it might be a rate limit or other error
                            if (response.status === 429) { // Too Many Requests
                                throw new Error('Rate limit exceeded. Retrying...');
                            } else {
                                const errorData = await response.json();
                                throw new Error(`API error: ${response.status} - ${errorData.error.message || response.statusText}`);
                            }
                        }

                        const result = await response.json();

                        if (result.candidates && result.candidates.length > 0 &&
                            result.candidates[0].content && result.candidates[0].content.parts &&
                            result.candidates[0].content.parts.length > 0) {
                            const text = result.candidates[0].content.parts[0].text;
                            responseArea.textContent = text;
                            break; // Exit retry loop on success
                        } else {
                            showMessage('No valid response from the AI. Please try again.', 'error');
                            break; // Exit retry loop if response structure is unexpected
                        }
                    } catch (error) {
                        console.error('Fetch error:', error);
                        retryCount++;
                        if (retryCount < maxRetries) {
                            await new Promise(res => setTimeout(res, delay));
                            delay *= 2; // Exponential backoff
                        } else {
                            showMessage(`Failed to get explanation after multiple retries: ${error.message}`, 'error');
                        }
                    }
                }

            } catch (error) {
                console.error('Error explaining image:', error);
                showMessage(`An unexpected error occurred: ${error.message}`, 'error');
            } finally {
                loadingSpinner.style.display = 'none'; // Hide loading spinner
                explainButton.disabled = false; // Re-enable button
            }
        });