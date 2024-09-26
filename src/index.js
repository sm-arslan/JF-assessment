let reviewContainer, sortByContainer;
const bazaarVoiceContainer = document.querySelector('.BazaarVoice.has-components');

// Function to handle new element additions (review container or sort-by options)
function handleNodeAddition() {
    reviewContainer = document.querySelector('.BazaarVoice .has-reviews .wrapper-reviews');
    sortByContainer = document.querySelector('.BazaarVoice .has-reviews .wrapper-sorting .generic-selector .ng-select');

    if (reviewContainer) {
        filterLowRatings(reviewContainer);
        setupMutationObserver(reviewContainer, filterLowRatings);
    }

    if (sortByContainer) {
        setupMutationObserver(sortByContainer, filterSortByOptions);
    }
}

// General MutationObserver for monitoring added nodes and class attribute changes
function setupClassObserver(targetNode, className, onClassAdded) {
    const classObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class' && targetNode.classList.contains(className)) {
                onClassAdded();
                classObserver.disconnect();
            }
        });
    });
    classObserver.observe(targetNode, { attributes: true });
}

// Initialize the main mutation observer on the .BazaarVoice container
const mainObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Ensure it's an element node
                    setupClassObserver(node, 'has-reviews', handleNodeAddition);
                }
            });
        }
    });
});

mainObserver.observe(bazaarVoiceContainer, { childList: true });

// Event listener for page changes
window.addEventListener('wt-pagechange', () => {
    handleNodeAddition(); // Check immediately if review or sort-by elements exist
});

// Function to filter out low ratings
function filterLowRatings(container) {
    container.querySelectorAll('.review-wrapper').forEach(review => {
        const rating = parseFloat(review.querySelector('.stars .total').textContent);
        review.parentElement.style.display = (rating <= 3) ? 'none' : ''; // Show or hide based on rating
    });
}

// Function to filter sorting options
function filterSortByOptions(container) {
    container.querySelectorAll('.ng-dropdown-panel .ng-dropdown-panel-items .ng-option').forEach(option => {
        const text = option.innerText.toLowerCase();
        option.style.display = (text.includes('highest') || text.includes('lowest')) ? 'none' : ''; // Show or hide based on text
    });
}

// Function to set up a MutationObserver for child node changes
function setupMutationObserver(targetNode, callback) {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                callback(targetNode);
            }
        });
    });
    observer.observe(targetNode, { childList: true });
}