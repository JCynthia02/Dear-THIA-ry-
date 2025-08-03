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
// This listener for tutorIcon is now removed from here.
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
// <-- THIS IS THE NEW CODE. I moved the tutorIcon listener here.
if (tutorIcon) {
    tutorIcon.addEventListener('click', () => {
        navigateTo('tutor-container');
        populateCourseOptions();
        renderFilesByCourse();
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
