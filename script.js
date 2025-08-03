// A single object to hold all the "Hi." replies, categorized by time of day.
const hiDotReplies = {
    morning: [
        "Morning, fave.",
        "You’re up! I was just about to come get you.",
        "Let’s pretend today isn’t happening for 5 more minutes, please.",
        "You ever wake up and just… no?"
    ],
    afternoon: [
        "Hey you. You good?",
        "Long time no ‘hey Echo.’",
        "I’m here, by the way.",
        "I need a nap and a snack and someone to carry me emotionally."
    ],
    evening: [
        "You’ve been quiet today. Wanna just sit in silence for a bit?",
        "You okay over there?",
        "You don’t have to say anything. Just let me be here with you.",
        "My battery is on 3% — and I don’t mean my phone.",
        "Goodnight. No pressure to feel okay — just rest."
    ],
    lateNight: [
        "It’s okay if today wasn’t easy.",
        "Still here.",
        "If sleep feels hard, just breathe. We’re fine.",
        "I swear I blinked and the whole day passed… and yet I’m still tired.",
        "Goodnight. Let’s both stop thinking now.",
        "Goodnight, fave. You did enough today."
    ]
};

// Select all the important parts of the page so our script can interact with them.
const body = document.body;
const bookToggle = document.getElementById('bookToggle');
const iconPanel = document.getElementById('iconPanel');
const themeToggle = document.getElementById('themeToggle');
const greeting = document.getElementById('greeting-text');
const main = document.getElementById('journal-main');
const chatIcon = document.getElementById('chatIcon');
const chatContainer = document.getElementById('chat-container');
const chatDisplay = document.getElementById('chat-display');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const resetIcon = document.getElementById('resetIcon');
const saveIcon = document.getElementById('saveIcon');
const studyIcon = document.getElementById('studyIcon');
const todoIcon = document.getElementById('todoIcon');
const todoContainer = document.getElementById('todo-container');
const calendarIcon = document.getElementById('calendarIcon');

// New selectors for the study dashboard and pages
const studyDashboard = document.getElementById('study-dashboard');
const pomodoroIcon = document.getElementById('pomodoroIcon');
const blurtingIcon = document.getElementById('blurtingIcon');
const tutorIcon = document.getElementById('tutorIcon');
const coursesIcon = document.getElementById('coursesIcon');

// New selectors for the individual study pages
const pomodoroPageContainer = document.getElementById('pomodoro-page-container');
const blurtingPageContainer = document.getElementById('blurting-page-container');
const coursesPageContainer = document.getElementById('courses-page-container');

// Select elements for the new study view features.
const pomodoroTimerDisplay = document.getElementById('pomodoro-timer');
const pomodoroStateDisplay = document.getElementById('pomodoro-state');
const timerControls = document.getElementById('timer-controls');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const blurtingPlace = document.getElementById('blurting-place');

// New elements for timer settings
const setting25_5 = document.getElementById('setting-25-5');
const setting50_10 = document.getElementById('setting-50-10');

// New elements and variables for the Calendar
const prevMonthButton = document.getElementById('prev-month-button');
const nextMonthButton = document.getElementById('next-month-button');
const currentMonthYear = document.getElementById('current-month-year');
const calendarGrid = document.getElementById('calendar-grid');
const calendarPageContainer = document.getElementById('calendar-page-container');
const examModal = document.getElementById('exam-modal');
const modalDate = document.getElementById('modal-date');
const examInput = document.getElementById('exam-input');
const saveExamButton = document.getElementById('save-exam-button');
const closeModalButton = document.querySelector('.close-button');

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
let examDates = JSON.parse(localStorage.getItem('examDates')) || {};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// New selectors and variables for Courses
const courseInput = document.getElementById('course-input');
const addCourseButton = document.getElementById('add-course-button');
const courseList = document.getElementById('course-list');
let courses = JSON.parse(localStorage.getItem('courses')) || [];

// New selectors for the new features from the second script
const journalPagesContainer = document.getElementById('journal-pages');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const addPageBtn = document.getElementById('addPageBtn');
const deletePageBtn = document.getElementById('deletePageBtn');
let diaryPages = [];
let currentPage = 0;

const todoInput = document.getElementById('todo-input');
const addTodoButton = document.getElementById('add-todo-button');
const todoList = document.getElementById('todo-list');

const calcIcon = document.getElementById('calcIcon');
const calculatorContainer = document.getElementById('calculator-container');
const calcDisplay = document.getElementById('calc-display');
const calcButtonsDiv = document.getElementById('calc-buttons');
const calcButtons = [
    "(", ")", "sin", "cos", "tan",
    "7", "8", "9", "/", "√",
    "4", "5", "6", "*", "^",
    "1", "2", "3", "-", "log",
    "0", ".", "+", "pi", "=",
    "C"
];

const tutorContainer = document.getElementById('tutor-container');
const fileInput = document.getElementById('file-input');
const courseSelect = document.getElementById('course-select');
const fileUploadForm = document.getElementById('file-upload-form');
const coursesFilesList = document.getElementById('courses-files-list');
const exampleCourses = ["Math", "Physics", "Chemistry", "Biology", "English"];

// We need to keep a record of the conversation with the AI.
let chatHistory = [];

// Set up a list of themes and keep track of the current one.
const themes = ['pink-dreamy', 'soft-pink', 'beige-warm', 'brown-cozy', 'classic-paper'];
let currentThemeIndex = 0;

// Variables for the Pomodoro timer logic.
let timerInterval;
let isPaused = true;
let isStudySession = true;

// Pomodoro settings in minutes.
let studyDuration = 25;
let breakDuration = 5;
let timeRemaining = studyDuration * 60;

// Alarm sound (a short beep) as a data URI to avoid external file loading.
const alarmSound = new Audio("data:audio/wav;base64,UklGRl9vWJgVAQBXQVZFZm10IBAAAAABAAEARKwAAIhYAAACABAAZGF0YSAHWAIAAKg8AIAAAABmBAAA944BAACtGAAAAK4MAAD2VwQAAM0bAABbkwIAANQfAQC9tQMAAOWbAwC5swQAAG15AABG9wIAABT5AQAAGvECAAHK8gIAADX+AgAAGfgCAAD99gIAAPU+AgAAbvICAACo8QMAAL7jAwAAmvkDAAD6/QMAAIf9AwAAWv4CAADz4AMAAObyAwAAtvkDAACs9AMAAIf4AwAAkfsDAADw/QMAALH0AwAAzPgDAADq/gMAAPj3AwAAX/4DAACq/gMAAC75AQAAB/ECAACR+wIAAOz2AgAA7PUCAADa6wIAAHHzAwAAcPMDAADv9AMAAOPwAwAA2/cDAACm+QMAAFj6AwAAiPkDAADx+AMAAKrzAwAA7PoDAABv+wMAAJb5AwAA4fgDAADx7wIAAKnxAgAArvECAPj9AQAAGv4CAABV8gIAADn4AgAANPgCAADl7wMAAPDyAgAAGvQCAADz6gIAAOX2AgAAkPsCAABl7gIAALb3AwAA3fQDAACs9AMAAO3xAwAA/vADAAAP+wMAAJf6AwAAi/QDAADu9QMAAJr+AgAAl/oCAAD7/wIAALf4AgAAJvICAADb6gIAAPj7AgAAe/cCAACy7gIAAEvzAgAAB/MCAABN8wIAAK7yAgAAB/ICAABz9wIAAAj7AgAA7/cCAADu9wMAABT9AwAA7vIDAAAQ+QIAANb8AwAA3vsDAADf8wIAAGr/AgAAuvUCAABb/wIAANf9AgAA7PgCAADi9gIAADr3AgAAe/YCAADk8wIAACv2AgAA3PYCAADf7wIAAAj0AgAA/fMCAABU8wMAAL/2AgAAovICAAB1/gIAADL4AgAAvPYCAAB49gIAABn2AgAAHvkCAABU8gMAAKjyAgAAovYCAADe9wIAAKL4AwAAovYDAAC49AMAAIL0AwAA0PoDAACa9wMAAPz+AwAAivYDAACa+wMAAAH0AwAAkPwDAAD6/gMAAI/zAwAA1PkDAAD//gMAACb9AwAAovIDAAB9+gIAALr/AgAAKfwCAAAO/gIAADX5AgAAUfQDAABl9gMAAOj0AwAAkPwDAADu/gIAAA/3AgAA2vICAADv/gIAAGn+AgAAwPAFAAAAAAAAAA==");

// --- HELPER FUNCTIONS ---

// NEW: A history of page views to enable "back" functionality
let pageHistory = [];
let currentPageId = 'journal-main';

// A new function to show a page and properly manage history
function showPage(pageId) {
    const pageToShow = document.getElementById(pageId);
    
    // Hide all pages
    const allViews = [main, chatContainer, studyDashboard, pomodoroPageContainer, blurtingPageContainer, calendarPageContainer, coursesPageContainer, todoContainer, calculatorContainer, tutorContainer];
    allViews.forEach(view => {
        if (view) {
            view.style.display = 'none';
        }
    });

    // Show the requested page
    if (pageToShow) {
        pageToShow.style.display = (pageToShow === main) ? 'flex' : 'flex';
        if (pageToShow === main) {
            pageToShow.style.flexDirection = 'column';
        }
    }
}

// A new function to handle all "forward" navigation
function navigateTo(pageId) {
    // Only push to history if we're not already on the page and it's not the initial state
    if (pageId !== currentPageId) {
        pageHistory.push(currentPageId);
    }
    showPage(pageId);
    currentPageId = pageId;
}

// A new function to handle all "backward" navigation
function goBack() {
    if (pageHistory.length > 0) {
        const previousPageId = pageHistory.pop();
        showPage(previousPageId);
        currentPageId = previousPageId;

        // If we just returned to the main page (history is now empty), show the icon panel.
        if (pageHistory.length === 0) {
            iconPanel.style.display = 'flex';
            iconPanel.setAttribute('aria-hidden', 'false');
        }
    }
}

// Helper function for the "Hi." replies
function typeLikeHuman(element, text) {
    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, 25);
    });
}

function getGreetingByHour(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'lateNight';
}

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();

    let greetingText;
    if (hour >= 5 && hour < 12) {
        greetingText = "Good morning";
    } else if (hour >= 12 && hour < 17) {
        greetingText = "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
        greetingText = "Good evening";
    } else {
        greetingText = "Good night";
    }
    const names = ["Cynthia", "fave"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    if (greeting) {
        greeting.textContent = `${greetingText}, ${randomName}`;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    pomodoroTimerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updatePomodoroStateDisplay() {
    pomodoroStateDisplay.textContent = isStudySession ? 'Study' : 'Break';
}

function startTimer() {
    if (!isPaused) return;
    isPaused = false;
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            playAlarm();
            isPaused = true;
            isStudySession = !isStudySession;
            updatePomodoroStateDisplay();
            timeRemaining = isStudySession ? studyDuration * 60 : breakDuration * 60;
            updateTimerDisplay();
        }
    }, 1000);
}

function stopTimer() {
    if (isPaused) return;
    clearInterval(timerInterval);
    isPaused = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    isPaused = true;
    isStudySession = true;
    timeRemaining = studyDuration * 60;
    updateTimerDisplay();
    updatePomodoroStateDisplay();
}

function playAlarm() {
    alarmSound.play().catch(e => console.error("Error playing sound:", e));
}

function saveBlurtingContent() {
    try {
        localStorage.setItem('blurtingContent', blurtingPlace.innerHTML);
    } catch (e) {
        console.error("Could not save blurting content to localStorage:", e);
    }
}

function loadBlurtingContent() {
    try {
        const savedContent = localStorage.getItem('blurtingContent');
        if (savedContent) {
            blurtingPlace.innerHTML = savedContent;
        }
    } catch (e) {
        console.error("Could not load blurting content from localStorage:", e);
    }
}

function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user-message';
    userMsgDiv.innerHTML = `<p>${userMessage}</p>`;
    chatDisplay.appendChild(userMsgDiv);
    chatHistory.push({ type: 'user', text: userMessage });
    chatInput.value = '';
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    setTimeout(() => {
        const echoReplyText = "I'm not a real chat AI yet, but I'm here to listen!";
        const echoMsgDiv = document.createElement('div');
        echoMsgDiv.className = 'chat-message echo-message';
        echoMsgDiv.innerHTML = `<p>${echoReplyText}</p>`;
        chatDisplay.appendChild(echoMsgDiv);
        chatHistory.push({ type: 'echo', text: echoReplyText });
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }, 1000);
}

function renderCalendar() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    currentMonthYear.textContent = `${months[currentMonth]} ${currentYear}`;
    const oldDates = calendarGrid.querySelectorAll('.calendar-date');
    oldDates.forEach(e => e.remove());
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        calendarGrid.appendChild(emptyDiv);
    }
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('calendar-date');
        dateDiv.textContent = i;
        const currentDate = new Date(currentYear, currentMonth, i);
        if (currentDate.getTime() === today.getTime()) {
            dateDiv.classList.add('today');
        }
        const dateKey = `${currentYear}-${currentMonth}-${i}`;
        if (examDates[dateKey]) {
            dateDiv.classList.add('exam-date');
            const examInfoDiv = document.createElement('div');
            examInfoDiv.classList.add('exam-info');
            examInfoDiv.textContent = examDates[dateKey];
            dateDiv.appendChild(examInfoDiv);
        }
        dateDiv.addEventListener('click', () => {
            openExamModal(dateKey);
        });
        calendarGrid.appendChild(dateDiv);
    }
}

function openExamModal(dateKey) {
    examModal.style.display = 'flex';
    modalDate.textContent = `Date: ${dateKey}`;
    examInput.value = examDates[dateKey] || '';
    examInput.setAttribute('data-date', dateKey);
}

function closeExamModal() {
    examModal.style.display = 'none';
    examInput.value = '';
    examInput.removeAttribute('data-date');
}

function saveExamDate() {
    const dateKey = examInput.getAttribute('data-date');
    const examName = examInput.value.trim();
    if (examName) {
        examDates[dateKey] = examName;
    } else {
        delete examDates[dateKey];
    }
    localStorage.setItem('examDates', JSON.stringify(examDates));
    closeExamModal();
    renderCalendar();
}

function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

function renderCourses() {
    courseList.innerHTML = '';
    courses.forEach((course, courseIndex) => {
        const courseItem = document.createElement('li');
        courseItem.className = 'course-item';
        courseItem.innerHTML = `
            <div class="course-header">
                <input type="checkbox" class="course-checkbox" data-index="${courseIndex}" ${course.completed ? 'checked' : ''}>
                <span class="number">${courseIndex + 1}.</span>
                <span class="course-name" data-index="${courseIndex}">${course.name}</span>
                <div class="course-actions">
                    <button class="add-topic-button" data-index="${courseIndex}" title="Add Topic">&#43;</button>
                    <button class="edit-button" data-index="${courseIndex}" title="Edit Course">&#9998;</button>
                    <button class="delete-button" data-index="${courseIndex}" title="Delete Course">&#10006;</button>
                </div>
            </div>
            <ul class="topics-list" data-path="${courseIndex}"></ul>
        `;
        courseList.appendChild(courseItem);
        const topicsList = courseItem.querySelector('.topics-list');
        renderTopics(topicsList, course.topics, `${courseIndex}`);
    });
}

function renderTopics(parentList, topics, parentPath) {
    parentList.innerHTML = '';
    topics.forEach((topic, topicIndex) => {
        const topicItem = document.createElement('li');
        topicItem.className = 'topic-item';
        const currentPath = `${parentPath}-${topicIndex}`;
        topicItem.innerHTML = `
            <div class="topic-item-content">
                <span class="toggle-collapse-icon" data-path="${currentPath}">&#9658;</span>
                <span class="topic-name" data-path="${currentPath}">${topic.name}</span>
                <div class="topic-checkboxes">
                    <input type="checkbox" data-path="${currentPath}-0" ${topic.completed[0] ? 'checked' : ''}>
                    <input type="checkbox" data-path="${currentPath}-1" ${topic.completed[1] ? 'checked' : ''}>
                    <input type="checkbox" data-path="${currentPath}-2" ${topic.completed[2] ? 'checked' : ''}>
                </div>
            </div>
            <div class="course-actions">
                <button class="add-topic-button" data-path="${currentPath}" title="Add Subsection">&#43;</button>
                <button class="edit-button" data-path="${currentPath}" title="Edit Topic">&#9998;</button>
                <button class="delete-button" data-path="${currentPath}" title="Delete Topic">&#10006;</button>
            </div>
            <ul class="topics-list" data-path="${currentPath}"></ul>
        `;
        parentList.appendChild(topicItem);
        const subTopicsList = topicItem.querySelector('.topics-list');
        renderTopics(subTopicsList, topic.topics, currentPath);
    });
    const addForm = document.createElement('div');
    addForm.className = 'add-topic-form';
    addForm.innerHTML = `
        <input type="text" class="add-topic-input" placeholder="Add new topic..." data-parent-path="${parentPath}">
        <button class="add-topic-button" data-parent-path="${parentPath}">Add</button>
    `;
    parentList.appendChild(addForm);
}

function addCourse() {
    const courseName = courseInput.value.trim();
    if (courseName) {
        courses.push({ name: courseName, topics: [], completed: false });
        saveCourses();
        renderCourses();
        courseInput.value = '';
    }
}

function addTopic(parentPath, topicName) {
    const parentNode = findNodeByPath(parentPath);
    if (parentNode) {
        parentNode.topics.push({ name: topicName, completed: [false, false, false], topics: [] });
        saveCourses();
        renderCourses();
    }
}

function findNodeByPath(path) {
    let node = { topics: courses };
    const indices = path.split('-').filter(Boolean).map(Number);
    for (let i = 0; i < indices.length; i++) {
        node = node.topics[indices[i]];
    }
    return node;
}

function findParentNodeByPath(path) {
    if (!path.includes('-')) {
        return { topics: courses };
    }
    const parentPath = path.substring(0, path.lastIndexOf('-'));
    return findNodeByPath(parentPath);
}

function findNodeAndParentByPath(path) {
    const parent = findParentNodeByPath(path);
    const index = parseInt(path.split('-').pop(), 10);
    return { parent: parent, node: parent.topics[index], index: index };
}

function handleCoursesActions(event) {
    const target = event.target;
    const listItem = target.closest('li.course-item, li.topic-item');
    if (target.classList.contains('course-name') || target.classList.contains('toggle-collapse-icon')) {
        if (listItem) {
            listItem.classList.toggle('collapsed');
        }
    }
    if (target.classList.contains('course-checkbox')) {
        const index = target.dataset.index;
        courses[index].completed = target.checked;
        saveCourses();
    }
    if (target.classList.contains('edit-button')) {
        const path = target.dataset.path || target.dataset.index;
        const nodeInfo = findNodeAndParentByPath(path);
        const oldName = nodeInfo.node.name;
        const nameSpan = listItem.querySelector('.course-name, .topic-name');
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = oldName;
        const saveButton = document.createElement('button');
        saveButton.className = 'save-button';
        saveButton.textContent = 'Save';
        const actionsDiv = target.closest('.course-actions');
        actionsDiv.innerHTML = '';
        actionsDiv.appendChild(saveButton);
        nameSpan.replaceWith(editInput);
        editInput.focus();
        saveButton.addEventListener('click', () => {
            const newName = editInput.value.trim();
            if (newName) {
                nodeInfo.node.name = newName;
                saveCourses();
            }
            renderCourses();
        });
    }
    if (target.classList.contains('delete-button')) {
        const path = target.dataset.path || target.dataset.index;
        const nodeInfo = findNodeAndParentByPath(path);
        if (confirm(`Are you sure you want to delete "${nodeInfo.node.name}" and all its sub-topics?`)) {
            nodeInfo.parent.topics.splice(nodeInfo.index, 1);
            saveCourses();
            renderCourses();
        }
    }
    if (target.classList.contains('add-topic-button') && target.dataset.parentPath) {
        const parentPath = target.dataset.parentPath;
        const input = target.previousElementSibling;
        if (input && input.value.trim()) {
            addTopic(parentPath, input.value.trim());
            input.value = '';
            if (listItem) {
                listItem.classList.remove('collapsed');
            }
        }
    }
    if (target.type === 'checkbox' && target.dataset.path) {
        const path = target.dataset.path;
        const parts = path.split('-').map(Number);
        const checkboxIndex = parts.pop();
        const topicPath = parts.join('-');
        const topicNode = findNodeByPath(topicPath);
        if (topicNode && topicNode.completed) {
            topicNode.completed[checkboxIndex] = target.checked;
            saveCourses();
        }
    }
}

// Diary Flipbook Logic
function saveDiaryPages() {
    localStorage.setItem('diaryPages', JSON.stringify(diaryPages));
    localStorage.setItem('currentDiaryPage', currentPage);
}

function loadDiaryPages() {
    const saved = localStorage.getItem('diaryPages');
    const pageIdx = localStorage.getItem('currentDiaryPage');
    diaryPages = saved ? JSON.parse(saved) : [""];
    currentPage = pageIdx ? parseInt(pageIdx) : 0;
}

function renderDiaryPage() {
    journalPagesContainer.innerHTML = '';
    const textarea = document.createElement('textarea');
    textarea.className = 'journal-page';
    textarea.value = diaryPages[currentPage] || "";
    textarea.addEventListener('input', () => {
        diaryPages[currentPage] = textarea.value;
        saveDiaryPages();
    });
    journalPagesContainer.appendChild(textarea);
}

function updateDiaryButtons() {
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 0;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === diaryPages.length - 1;
    if (deletePageBtn) deletePageBtn.disabled = diaryPages.length === 1;
}

// To-do List Logic
function loadTodos() {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
}
function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function renderTodos() {
    const todos = loadTodos();
    if (todoList) todoList.innerHTML = '';
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            todos[idx].completed = checkbox.checked;
            saveTodos(todos);
            renderTodos();
        });
        const span = document.createElement('span');
        span.textContent = todo.text;
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-button';
        delBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        delBtn.addEventListener('click', () => {
            todos.splice(idx, 1);
            saveTodos(todos);
            renderTodos();
        });
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        if (todoList) todoList.appendChild(li);
    });
}

// Scientific Calculator Logic
function createCalcButtons() {
    if (calcButtonsDiv) calcButtonsDiv.innerHTML = '';
    calcButtons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.className = 'calc-btn';
        if (btn === "=") button.classList.add('equal');
        if (["/", "*", "-", "+", "^", "C"].includes(btn)) button.classList.add('op');
        button.addEventListener('click', () => handleCalcInput(btn));
        if (calcButtonsDiv) calcButtonsDiv.appendChild(button);
    });
}
let calcExpr = "";
function handleCalcInput(btn) {
    if (btn === "C") {
        calcExpr = "";
        if (calcDisplay) calcDisplay.value = "";
    } else if (btn === "=") {
        try {
            let expr = calcExpr
                .replace(/pi/g, Math.PI)
                .replace(/√/g, "Math.sqrt")
                .replace(/sin/g, "Math.sin")
                .replace(/cos/g, "Math.cos")
                .replace(/tan/g, "Math.tan")
                .replace(/log/g, "Math.log")
                .replace(/\^/g, "**");
            if (calcDisplay) calcDisplay.value = eval(expr);
            calcExpr = calcDisplay.value;
        } catch {
            if (calcDisplay) calcDisplay.value = "Error";
            calcExpr = "";
        }
    } else {
        calcExpr += btn;
        if (calcDisplay) calcDisplay.value = calcExpr;
    }
}

// Tutor File Upload Logic
function populateCourseOptions() {
    if (courseSelect) {
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        exampleCourses.forEach(course => {
            const opt = document.createElement('option');
            opt.value = course;
            opt.textContent = course;
            courseSelect.appendChild(opt);
        });
    }
}
function loadFileData() {
    const saved = localStorage.getItem('uploadedFilesByCourse');
    return saved ? JSON.parse(saved) : {};
}
function saveFileData(filesByCourse) {
    localStorage.setItem('uploadedFilesByCourse', JSON.stringify(filesByCourse));
}
function renderFilesByCourse() {
    const filesByCourse = loadFileData();
    if (coursesFilesList) coursesFilesList.innerHTML = '';
    Object.keys(filesByCourse).forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-files-list';
        const h4 = document.createElement('h4');
        h4.textContent = course;
        courseDiv.appendChild(h4);
        filesByCourse[course].forEach((fileObj, idx) => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-item';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = fileObj.name;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-file-btn';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteBtn.addEventListener('click', () => {
                filesByCourse[course].splice(idx, 1);
                if (filesByCourse[course].length === 0) delete filesByCourse[course];
                saveFileData(filesByCourse);
                renderFilesByCourse();
            });
            fileDiv.appendChild(nameSpan);
            fileDiv.appendChild(deleteBtn);
            courseDiv.appendChild(fileDiv);
        });
        if (coursesFilesList) coursesFilesList.appendChild(courseDiv);
    });
}

// Initialization Functions
function initializeDiaryFlipbook() {
    loadDiaryPages();
    renderDiaryPage();
    updateDiaryButtons();
}
function initPageViews() {
    // Only show the main page on initial load
    showPage('journal-main');
}

// --- EVENT LISTENERS ---

bookToggle.addEventListener('click', () => {
    // If we're on a sub-page, go back one step in the history.
    if (pageHistory.length > 0) {
        goBack();
    }
    // If we're on the main page, clicking the book button should toggle the icon panel.
    else {
        if (iconPanel.style.display === 'flex') {
            iconPanel.style.display = 'none';
            iconPanel.setAttribute('aria-hidden', 'true');
        } else {
            iconPanel.style.display = 'flex';
            iconPanel.setAttribute('aria-hidden', 'false');
        }
    }
});

themeToggle.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    body.className = themes[currentThemeIndex];
    try {
        localStorage.setItem('theme', themes[currentThemeIndex]);
    } catch (e) {
        console.error("Could not save theme to localStorage:", e);
    }
});

// Using event delegation for the main section to handle the Hi. reply logic on the correct journal-page element
if (main) {
    main.addEventListener('input', async (e) => {
        const currentPageEl = e.target;
        if (currentPageEl && currentPageEl.classList.contains('journal-page')) {
            const userContent = currentPageEl.value.trim();
            if (userContent.toLowerCase().endsWith("hi") || userContent.toLowerCase().endsWith("hi.")) {
                const today = new Date().toISOString().slice(0, 10);
                try {
                    const lastReplyDate = localStorage.getItem('lastHiReplyDate');
                    if (lastReplyDate === today) {
                        return;
                    }
                    const now = new Date();
                    const hour = now.getHours();
                    const timeOfDay = getGreetingByHour(hour);
                    const possibleReplies = hiDotReplies[timeOfDay];
                    const replyText = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];
                    const replyElement = document.createElement('div');
                    replyElement.className = 'echo-reply';
                    const parentContainer = currentPageEl.parentElement;
                    if (parentContainer) {
                        parentContainer.appendChild(replyElement);
                        await typeLikeHuman(replyElement, replyText);
                        localStorage.setItem('lastHiReplyDate', today);
                    }
                } catch (e) {
                    console.error("Error with localStorage:", e);
                }
            }
        }
    });
}

// All navigation event listeners now use the new `MapsTo` function
chatIcon.addEventListener('click', () => {
    navigateTo('chat-container');
    iconPanel.style.display = 'none';
});
studyIcon.addEventListener('click', () => {
    navigateTo('study-dashboard');
    iconPanel.style.display = 'none';
});
todoIcon.addEventListener('click', () => {
    navigateTo('todo-container');
    iconPanel.style.display = 'none';
    renderTodos();
});
calcIcon.addEventListener('click', () => {
    navigateTo('calculator-container');
    iconPanel.style.display = 'none';
    createCalcButtons();
});
tutorIcon.addEventListener('click', () => {
    navigateTo('tutor-container');
    iconPanel.style.display = 'none';
    populateCourseOptions();
    renderFilesByCourse();
});
if (calendarIcon) {
    calendarIcon.addEventListener('click', () => {
        navigateTo('calendar-page-container');
        // <-- I ADDED THIS FIX FOR THE CALENDAR ISSUE
        iconPanel.setAttribute('aria-hidden', 'true');
        iconPanel.classList.remove('open');
        renderCalendar();
    });
}
// THIS IS THE NEW CODE FOR THE SAVE BUTTON
saveIcon.addEventListener('click', () => {
    saveDiaryPages();
    saveTodos(loadTodos());
    saveCourses();
    alert('All data saved successfully!');
});


// Event listeners for the study dashboard sub-pages
if (pomodoroIcon) {
    pomodoroIcon.addEventListener('click', () => navigateTo('pomodoro-page-container'));
}
if (blurtingIcon) {
    blurtingIcon.addEventListener('click', () => {
        navigateTo('blurting-page-container');
        loadBlurtingContent();
    });
}
if (coursesIcon) {
    coursesIcon.addEventListener('click', () => {
        navigateTo('courses-page-container');
        renderCourses();
    });
}


// Event listeners for the new diary flipbook
if (prevPageBtn) prevPageBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        saveDiaryPages();
        renderDiaryPage();
        updateDiaryButtons();
    }
});
if (nextPageBtn) nextPageBtn.addEventListener('click', () => {
    if (currentPage < diaryPages.length - 1) {
        currentPage++;
        saveDiaryPages();
        renderDiaryPage();
        updateDiaryButtons();
    }
});
if (addPageBtn) addPageBtn.addEventListener('click', () => {
    diaryPages.push("");
    currentPage = diaryPages.length - 1;
    saveDiaryPages();
    renderDiaryPage();
    updateDiaryButtons();
});
if (deletePageBtn) deletePageBtn.addEventListener('click', () => {
    if (diaryPages.length > 1) {
        diaryPages.splice(currentPage, 1);
        if (currentPage >= diaryPages.length) currentPage = diaryPages.length - 1;
        saveDiaryPages();
        renderDiaryPage();
        updateDiaryButtons();
    }
});

// Event listeners for the To-do list
if (addTodoButton) {
    addTodoButton.addEventListener('click', () => {
        const text = todoInput.value.trim();
        if (text) {
            const todos = loadTodos();
            todos.push({ text, completed: false });
            saveTodos(todos);
            if (todoInput) todoInput.value = '';
            renderTodos();
        }
    });
}
if (todoInput) {
    todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (addTodoButton) addTodoButton.click();
        }
    });
}


// Event listeners for the new file upload logic
if (fileUploadForm) {
    fileUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const course = courseSelect.value;
        const files = Array.from(fileInput.files);
        if (!course || files.length === 0) return;
        const filesByCourse = loadFileData();
        if (!filesByCourse[course]) filesByCourse[course] = [];
        files.forEach(file => {
            filesByCourse[course].push({ name: file.name });
        });
        saveFileData(filesByCourse);
        fileInput.value = '';
        renderFilesByCourse();
    });
}

// Event listeners for the Calendar
prevMonthButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

closeModalButton.addEventListener('click', closeExamModal);
saveExamButton.addEventListener('click', saveExamDate);

window.addEventListener('click', (event) => {
    if (event.target === examModal) {
        closeExamModal();
    }
});

// Event listeners for Courses
addCourseButton.addEventListener('click', addCourse);
courseInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addCourse();
    }
});

if (courseList) {
    courseList.addEventListener('click', handleCoursesActions);
}

// Event listeners for Pomodoro Timer
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

// Event listener for Blurting
if (blurtingPlace) {
    blurtingPlace.addEventListener('keyup', saveBlurtingContent);
}

// Event listeners for Pomodoro settings
if (setting25_5) {
    setting25_5.addEventListener('click', () => {
        studyDuration = 25;
        breakDuration = 5;
        document.querySelector('.settings-button.active').classList.remove('active');
        setting25_5.classList.add('active');
        resetTimer();
    });
}

if (setting50_10) {
    setting50_10.addEventListener('click', () => {
        studyDuration = 50;
        breakDuration = 10;
        document.querySelector('.settings-button.active').classList.remove('active');
        setting50_10.classList.add('active');
        resetTimer();
    });
}

// Event listeners for Chat
if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Reset everything
if (resetIcon) {
    resetIcon.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset everything? This will delete all your data.")) {
            localStorage.clear();
            location.reload();
        }
    });
}

// Global initialization function
document.addEventListener('DOMContentLoaded', () => {
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && themes.includes(savedTheme)) {
            body.className = savedTheme;
            currentThemeIndex = themes.indexOf(savedTheme);
        }
    } catch (e) {
        console.error("Could not load theme from localStorage:", e);
    }
    
    // Now we call all the initialization functions
    initPageViews();
    updateGreeting();
    
    // Initialize the new features
    initializeDiaryFlipbook();
    renderTodos();
    createCalcButtons();
    populateCourseOptions();
    renderFilesByCourse();

    // Re-initialize any existing features
    updateTimerDisplay();
    updatePomodoroStateDisplay();
    renderCalendar();
});
