function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function showWelcomeMessage() {
    const currentUser = getCurrentUser();
    const welcomeContainer = document.getElementById('welcome-message');

    if (currentUser && welcomeContainer) {
        welcomeContainer.textContent = `Welcome back, ${currentUser}!`;
        welcomeContainer.style.display = 'block'; // Ensure the container is visible
    } else if (welcomeContainer) {
        welcomeContainer.style.display = 'none'; // Hide the container if no user is logged in
    }
}

function displayCategoryScenarios(type) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please log in to view your scenarios.');
        return;
    }

    const selectedCategory = document.getElementById('category-select') ? document.getElementById('category-select').value : 'NCAA-W';
    const key = `${type}Scenarios-${currentUser}-${selectedCategory}`;
    const storedScenarios = JSON.parse(localStorage.getItem(key)) || [];
    const container = document.getElementById(`${type}-scenarios`);

    container.innerHTML = ''; // Clear existing content

    if (storedScenarios.length === 0) {
        container.innerHTML = '<p>No scenarios available for this category.</p>';
    } else {
        storedScenarios.forEach((scenario, index) => {
            const scenarioBlock = document.createElement('div');
            scenarioBlock.classList.add('scenario-block');
            scenarioBlock.innerHTML = `
                <h3>Scenario ${index + 1}</h3>
                <p><strong>Question:</strong> ${scenario.question}</p>
                <p><strong>Correct Answer:</strong> ${scenario.correctAnswer}</p>
            `;

            if (type === 'missed') {
                scenarioBlock.innerHTML += `
                    <p><strong>Your Answer:</strong> ${scenario.selectedAnswer}</p>
                `;
            }

            container.appendChild(scenarioBlock);
        });
    }
}

// Function to handle category change
function handleCategoryChange(type) {
    displayCategoryScenarios(type);
}

// Call this function on page load to show the welcome message and display scenarios
window.onload = function () {
    showWelcomeMessage();
    const pageType = document.body.getAttribute('data-page-type');
    if (pageType === 'correct') {
        displayCategoryScenarios('correct');
    } else if (pageType === 'missed') {
        displayCategoryScenarios('missed');
    }
};
