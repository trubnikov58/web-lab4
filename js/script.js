const ANSWERS_DB = [
    {
        id: 1,
        question: "Напишите проверочное слово к слову 'б..жать'",
        type: "text",
        target: "q1",
        correctAnswer: "бег",
        correctText: "бег"
    },
    {
        id: 2,
        question: "Какая буква пишется в приставке слова '(з/с)делать'",
        type: "text",
        target: "q2",
        correctAnswer: "с",
        correctText: "с"
    },
    {
        id: 3,
        question: "На какой слог падает ударение в слове 'звонит'?",
        type: "radio",
        target: "q3",
        correctAnswer: "2",
        correctText: "На второй"
    },
    {
        id: 4,
        question: "В каком слове пишется буква 'О'?",
        type: "radio",
        target: "q4",
        correctAnswer: "2",
        correctText: "Шов"
    },
    {
        id: 5,
        question: "Выберите слова-исключения, в которых пишется 'НН'",
        type: "checkbox",
        target: [
            { id: "q5_1", expected: true, text: "Стеклянный" },
            { id: "q5_2", expected: false, text: "Ветреный" },
            { id: "q5_3", expected: true, text: "Оловянный" },
            { id: "q5_4", expected: false, text: "Серебрянный" },
        ],
        correctText: "Стеклянный, Оловянный"
    },
    {
        id: 6,
        question: "Выберите глаголы-исключения II спряжения",
        type: "checkbox",
        target: [
            { id: "q6_1", expected: false, text: "Брить" },
            { id: "q6_2", expected: true, text: "Видеть" },
            { id: "q6_3", expected: false, text: "Стелить" },
            { id: "q6_4", expected: true, text: "Дышать" },
        ],
        correctText: "Видеть, Дышать"
    },
    {
        id: 7,
        question: "Какого рода слово 'кофе' (литературная норма)?",
        type: "select",
        target: "q7",
        correctAnswer: "1",
        correctText: "Мужской род"
    },
    {
        id: 8,
        question: "Выберите правильное окончание: 'Он бор..тся'",
        type: "select",
        target: "q8",
        correctAnswer: "2",
        correctText: "-ется"
    }
];

let isFinished = false;
let userAnswersArray = []

let totalSeconds = 120;
let timerID = null;

let totalScore = 0;

function tickTimer() {
    if (isFinished) return;
    totalSeconds--;

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    document.getElementById("timeDisplay").textContent = minutes + ":" + seconds;

    if (totalSeconds <= 0) {
        clearInterval(timerID);
        alert("Время вышло!");
        finishTest();
    }
}
function initTest() {
    timerID = setInterval(tickTimer, 1000);
}

function calculateResults() {
    let table = document.getElementById("resultTable");

    for (let i = 0; i < ANSWERS_DB.length; i++) {
        let currentQuestion = ANSWERS_DB[i];
        let userAnswerText = "";
        let score = 0;

        switch(currentQuestion.type) {
            case "text":
                let textElement = document.getElementById(currentQuestion.target);
                let elementValue = textElement.value.toLowerCase().trim();
                userAnswerText = textElement.value;

                if (elementValue === currentQuestion.correctAnswer) {
                    score += 1;
                }
                break;
            case "select":
                let selectElement = document.getElementById(currentQuestion.target);
                let selectValue = selectElement.value;

                if (selectValue === currentQuestion.correctAnswer) {
                    score += 1;
                }
                userAnswerText = selectElement.options[selectElement.selectedIndex].text;
                break;
            case "radio":
                let radioElements = document.getElementsByName(currentQuestion.target);
                for (let j = 0; j < radioElements.length; j++) {
                    if (radioElements[j].checked) {
                        if (radioElements[j].value === currentQuestion.correctAnswer) {
                            score += 1;
                        }
                        userAnswerText = radioElements[j].nextSibling.nodeValue.trim();
                        break;
                    }
                }
                break;
            case "checkbox":
                let isCorrect = true;
                let answersArray = [];

                for (let j = 0; j < currentQuestion.target.length; j++) {
                    let boxInfo = currentQuestion.target[j];
                    let htmlBox = document.getElementById(boxInfo.id);

                    if (htmlBox.checked) {
                        answersArray.push(boxInfo.text);
                    }
                    if (htmlBox.checked !== boxInfo.expected) {
                        isCorrect = false;
                    }
                }
                userAnswerText = answersArray.join(", ");
                
                if(isCorrect) {
                    score += 1;
                }
                break;
        }

        totalScore += score;

        let newRow = table.insertRow();

        if (score === 1) {
            newRow.className = "correct-row";
        } else {
            newRow.className = "incorrect-row";
        }
        newRow.insertCell().textContent = currentQuestion.id;
        newRow.insertCell().textContent = currentQuestion.question;
        newRow.insertCell().textContent = userAnswerText || "Нет ответа";
        newRow.insertCell().textContent = currentQuestion.correctText;
        newRow.insertCell().textContent = score;
    }
    document.getElementById("totalScore").textContent = totalScore;
    document.getElementById("resultsBlock").style.display = "block"; // Показываем скрытый блок
}
function finishTest() {
    isFinished = true;
    clearInterval(timerID);

    let elements = document.getElementById("testForm").elements;
    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
    }
    calculateResults();
}