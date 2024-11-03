// displayscenarios.js
function displayScenarios(key, containerId) {
    const scenarioContainer = document.getElementById(containerId);
    const storedScenarios = JSON.parse(localStorage.getItem(key)) || [];

    if (storedScenarios.length === 0) {
        scenarioContainer.innerHTML = `<p>No scenarios available.</p>`;
        return;
    }

    storedScenarios.forEach((scenario, index) => {
        const scenarioBlock = document.createElement('div');
        scenarioBlock.innerHTML = `
            <h3>Scenario ${index + 1}</h3>
            <p><strong>Question:</strong> ${scenario.question}</p>
            <p><strong>Correct Answer:</strong> ${scenario.correctAnswer}</p>
        `;

        if (key === 'missedScenarios') {
            scenarioBlock.innerHTML += `
                <p><strong>Your Answer:</strong> ${scenario.selectedAnswer}</p>
            `;
        }

        scenarioContainer.appendChild(scenarioBlock);
    });
}

// Call this function on page load with appropriate parameters for each page
window.onload = function () {
    if (document.getElementById('scenario-container')) {
        const pageType = document.body.getAttribute('data-page-type');
        if (pageType === 'correct') {
            displayScenarios('correctScenarios', 'scenario-container');
        } else if (pageType === 'missed') {
            displayScenarios('missedScenarios', 'scenario-container');
        }
    }
};