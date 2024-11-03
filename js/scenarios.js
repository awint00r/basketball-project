// scenarios.js
window.onload = function () {
    loadScenario();
};

function loadScenario() {
    fetch('/data/scenarios.json') // Make sure the path matches where you store the file
        .then(response => response.json())
        .then(scenarios => {
            const scenarioArea = document.getElementById('scenario-area');
            scenarioArea.innerHTML = ''; // Clear the current scenario
            const questionEl = document.createElement('p');
            const choicesEl = document.createElement('div');

            // Load previously answered correct questions
            let answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions')) || [];
            
            // Filter out already answered questions
            let availableScenarios = scenarios.filter(scenario => !answeredQuestions.includes(scenario.question));

            // If all questions have been answered, reset answered questions
            if (availableScenarios.length === 0) {
                localStorage.removeItem('answeredQuestions');
                availableScenarios = scenarios;
                answeredQuestions = [];
            }

            // Randomly select a scenario
            const randomIndex = Math.floor(Math.random() * availableScenarios.length);
            const selectedScenario = availableScenarios[randomIndex];

            // Display the question
            questionEl.textContent = selectedScenario.question;
            scenarioArea.appendChild(questionEl);

            // Display the choices
            selectedScenario.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.textContent = choice;
                button.onclick = () => checkAnswer(index, selectedScenario, answeredQuestions);
                choicesEl.appendChild(button);
            });
            scenarioArea.appendChild(choicesEl);
        })
        .catch(error => console.error('Error loading scenarios:', error));
}

function checkAnswer(selectedIndex, selectedScenario, answeredQuestions) {
    const correctIndex = selectedScenario.correctAnswer;
    const answerData = {
        question: selectedScenario.question,
        choices: selectedScenario.choices,
        correctAnswer: selectedScenario.choices[correctIndex],
        selectedAnswer: selectedScenario.choices[selectedIndex]
    };

    if (selectedIndex === correctIndex) {
        alert("Correct! Great job.");
        saveScenarioToStorage('correctScenarios', answerData);
        answeredQuestions.push(selectedScenario.question);
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
    } else {
        alert("Incorrect. The correct answer is: " + selectedScenario.choices[correctIndex]);
        saveScenarioToStorage('missedScenarios', answerData);
        answeredQuestions.push(selectedScenario.question); // Add the question to answeredQuestions even if incorrect
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
    }

    // Load the next scenario
    loadScenario();
}

function saveScenarioToStorage(key, data) {
    let storedData = JSON.parse(localStorage.getItem(key)) || [];
    storedData.push(data);
    localStorage.setItem(key, JSON.stringify(storedData));
}
