// scenarios.js
window.onload = function () {
    loadScenario();
};

function loadScenario() {
    const categorySelect = document.getElementById('category-select');
    const selectedCategory = categorySelect ? categorySelect.value : 'NCAA-W'; // Default category

    fetch(`${selectedCategory}-scenarios.json`) // Dynamically load JSON based on category
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
                button.onclick = () => checkAnswer(index, selectedScenario, answeredQuestions, selectedCategory);
                choicesEl.appendChild(button);
            });
            scenarioArea.appendChild(choicesEl);
        })
        .catch(error => console.error('Error loading scenarios:', error));
}

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function checkAnswer(selectedIndex, selectedScenario, answeredQuestions, category) {
    const currentUser = getCurrentUser();

    const correctIndex = selectedScenario.correctAnswer;
    const answerData = {
        category: category, // Ensure category is included
        question: selectedScenario.question,
        choices: selectedScenario.choices,
        correctAnswer: selectedScenario.choices[correctIndex],
        selectedAnswer: selectedScenario.choices[selectedIndex]
    };

    if (selectedIndex === correctIndex) {
        alert("Correct! Great job.");
        if (currentUser) {
            saveScenarioToStorageUnique(`correctScenarios-${currentUser}-${category}`, answerData);
        }
    } else {
        alert("Incorrect. The correct answer is: " + selectedScenario.choices[correctIndex]);
        if (currentUser) {
            saveScenarioToStorage(`missedScenarios-${currentUser}-${category}`, answerData);
        }
    }

    answeredQuestions.push(selectedScenario.question);
    localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));

    // Load the next scenario
    loadScenario();
}

function saveScenarioToStorageUnique(key, data) {
    let storedData = JSON.parse(localStorage.getItem(key)) || [];

    // Check if the question already exists in the stored data
    if (!storedData.some(item => item.question === data.question)) {
        storedData.push(data);
        localStorage.setItem(key, JSON.stringify(storedData));
    }
}

function saveScenarioToStorage(key, data) {
    let storedData = JSON.parse(localStorage.getItem(key)) || [];
    storedData.push(data);
    localStorage.setItem(key, JSON.stringify(storedData));
}
