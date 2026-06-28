// Presentation State
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slideSelect = document.getElementById('slideSelect');
const slideCounter = document.getElementById('slideCounter');
const progressBar = document.getElementById('progressBar');
const slidesWrapper = document.getElementById('slidesWrapper');

// Transition Styles list
const transitions = ['transition-slide', 'transition-fade', 'transition-zoom', 'transition-flip'];
let currentTransition = 'transition-slide';

// Speaker Notes Data
const speakerNotes = [
  // Slide 1
  "Welcome the reviewers. State your name, your role, and the project title. Emphasize that today you are presenting the fully completed Om Chanukya Traders Product Catalog System. This is the culmination of your entire internship journey, delivering a working product.",
  
  // Slide 2
  "Provide a crisp recap of the project journey. Keep it to one sentence per phase. Anchor the reviewers by explaining the customer friction you observed, the research metrics on size inquiries, and how this led to the QR-code zero-install catalog system.",
  
  // Slide 3
  "Explain the overall system deliverables. State the final outcome clearly. Point out the checklist of completed modules, and proactively address the descoped online checkout module: explain that since customers check out at store POS desks, digital checkout would add friction, proving you understand the operational context.",
  
  // Slide 4
  "Describe the presentation structure and budget. Reassure reviewers that the live demo takes up the largest block (5-6 min) because completeness is key. Explain that you have budgeted time for code, database design, and testing, keeping the entire presentation within the 15-20 min limit.",
  
  // Slide 5
  "Demonstrate the mobile customer catalog portal. Detail the physical scanning flow, explain how QR parameters auto-route them to the correct section, and mention the autocomplete engine that minimizes mobile typing.",
  
  // Slide 6
  "Show the secure Admin Portal. Focus on the secure login mechanism, explain the visual active indicator in the header that alerts managers they are in Admin Mode, and point out the explicit Exit button to log out safely.",
  
  // Slide 7
  "Walk the reviewers through the system component diagram. Trace data flows from customer search requests down to cache layers. Explain why this serverless design is zero-cost and highly resilient for retail store deployments.",
  
  // Slide 8
  "Detail the database schema. Explain that you normalized the Category collection away from the Product table. Discuss the design rationale: keeping category indices independent ensures counter QR codes remain static and valid even if product categories are renamed.",
  
  // Slide 9
  "Present your code highlight. Explain this exact snippet line-by-line: how you set up a custom 200ms debounce timeout to prevent laggy search updates. Point out that this custom algorithm keeps search rendering under 15ms on mobile devices.",
  
  // Slide 10
  "Explain Technical Challenge 1. Follow the structure: what the problem was (mobile keyboard stutters) -> what you tried first (redrawing entire DOM catalog list) -> why it failed (excessive browser writes) -> what you did instead (DocumentFragments cache swap) -> what you learned.",
  
  // Slide 11
  "Explain Technical Challenge 2. Follow the structure: what the problem was (blurry canvas QR codes printed for hangers) -> what you tried first (canvas image exports) -> why it failed (raster pixelation on high-res printers) -> what you did instead (vector SVGs and print CSS) -> what you learned.",
  
  // Slide 12
  "Show your testing results. Emphasize that all tests are fully complete. Point out the Safari viewport height rendering issue you resolved, and how you fixed search bar spaces bugs to handle realistic user input.",
  
  // Slide 13
  "Share your learnings. Be genuine and specific. Discuss how mastering vanilla JS DOM operations taught you performance fundamentals, and how regular merchant check-ins saved development time by preventing unnecessary payment features.",
  
  // Slide 14
  "Acknowledge current system limitations honestly: manual stock entries and single-shop limits. Connect this logically to the future roadmap, explaining how barcode scanner API integrations will automate stock counts.",
  
  // Slide 15
  "Review the deliverables checklists. Confirm that all six graduation deliverables (system, report, architecture, ERD, testing evidence, backup recording) are 100% ready. This shows professional readiness and complete closure.",
  
  // Slide 16
  "Pitch Rehearsal Simulator: Use this interactive tool to practice timing your script. Read the custom script aloud, tracking the time to ensure you stay under the 6-minute demo target.",
  
  // Slide 17
  "Evaluation Scorecard: Review each of the 11 evaluation rubrics. Rate yourself honestly to target potential questions. Make sure you can defend database design, architecture separation, and testing outcomes.",
  
  // Slide 18
  "Wrap up your presentation. Reiterate the golden rule: a working demo, a deep understanding of code decisions, and honesty about future improvements show engineering maturity. Open up the floor for Q&A."
];

// Timeline Slider Data
const timelineDetails = [
  { title: "Recap (1 min)", desc: "Slide 2. Anchors reviewers in the core retail problem, store traffic research, and design vision. Set a clean, professional tone." },
  { title: "System Overview (1 min)", desc: "Slide 3. Summarize outcomes, features delivered, and address descope choices. Establishes transparency early." },
  { title: "Live Demo (5–6 min)", desc: "Slides 5-6. The critical core of the session. Walk through customer scan to admin stock update. Must be live, with backup ready." },
  { title: "Arch & Code (3 min)", desc: "Slides 7-9. Deep dive into SPA structure, normalized schemas, and code snippets like search debouncing." },
  { title: "Challenges (2 min)", desc: "Slides 10-11. Share technical problems like DOM reflow bottlenecks and SVG print scaling. Shows engineering growth." },
  { title: "Learnings & Close (2 min)", desc: "Slides 12-15. Reflect on vanilla JS performance, testing validations, limitations, POS roadmap, and closure." }
];

// ERD Data
const erdExplanations = {
  "ent-product": "<strong>Product Entity:</strong> Stores item details (PK id, brand, price, stock quantity, availability flag). Design decision: normalized with category_id foreign key to prevent redundant schema duplications.",
  "ent-category": "<strong>Category Entity:</strong> Mapped to physical store display counters using `counter_code`. Keeping this independent allows changing category descriptions without breaking printed QR codes.",
  "ent-admin": "<strong>Admin Credentials Entity:</strong> Separated from customer access tables. Houses hashed passwords and last login timestamps to secure stock adjustment endpoints."
};

// Scorecard Criteria
const evaluationCriteria = [
  { name: "Completeness of Deliverables", desc: "All planned features delivered, descoped items justified." },
  { name: "Functionality of Demo", desc: "Catalog runs end-to-end; handles realistic inputs." },
  { name: "Technical Depth", desc: "Understanding code snippet lines; explaining decisions." },
  { name: "Architecture Quality", desc: "Logical separation of concerns; components clean." },
  { name: "Database Design", desc: "ERD well-structured; normalization justified." },
  { name: "Problem-Solving Maturity", desc: "Technical challenges described with logical fixes." },
  { name: "Testing & Validation", desc: "Evidence of manual validation; bug fixes documented." },
  { name: "Learnings & Limitations", desc: "Genuine personal reflection; honest system limitations." },
  { name: "Future Scope", desc: "Realistic improvements grounded in current limits." },
  { name: "Slide Design & Layout", desc: "Clean slides, consistent formatting, readable text." },
  { name: "Communication & Confidence", desc: "Clear delivery, timed under 20 mins, ready for Q&A." }
];

let criteriaScores = new Array(evaluationCriteria.length).fill(5);

// Presenter Timer variables
let timerInterval;
let timerSeconds = 0;
let timerRunning = false;

/* --- Slide Navigation Logic --- */

function initSlides() {
  // Populate Slide Select dropdown
  slideSelect.innerHTML = '';
  slides.forEach((slide, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `Slide ${idx + 1}: ${getSlideTitle(idx)}`;
    slideSelect.appendChild(opt);
  });

  showSlide(0);
}

function getSlideTitle(index) {
  const slide = slides[index];
  const h2 = slide.querySelector('h2');
  if (h2) return h2.textContent;
  const h1 = slide.querySelector('h1');
  if (h1) return h1.textContent;
  return `Slide ${index + 1}`;
}

function showSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  
  // Transition logic
  slides[currentSlideIndex].classList.remove('active');
  currentSlideIndex = index;
  slides[currentSlideIndex].classList.add('active');

  // Update HUD
  slideSelect.value = index;
  slideCounter.textContent = `Slide ${index + 1} of ${totalSlides}`;
  const percent = Math.round((index / (totalSlides - 1)) * 100);
  progressBar.style.width = `${percent}%`;

  // Update Presenter Mode elements if active
  updatePresenterConsole();

  // Highlight active parts inside slides if relevant
  triggerSlideInteractions(index);
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    showSlide(currentSlideIndex - 1);
  } else {
    showToast("You are on the first slide.");
  }
}

function nextSlide() {
  if (currentSlideIndex < totalSlides - 1) {
    showSlide(currentSlideIndex + 1);
  } else {
    showToast("End of presentation. Thank you!");
  }
}

/* --- Slide Event Listeners --- */

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  // Disable slide nav if user is typing inside input boxes
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
    return;
  }
  
  switch(e.key) {
    case 'ArrowLeft':
    case 'PageUp':
      prevSlide();
      break;
    case 'ArrowRight':
    case 'Space':
    case 'PageDown':
    case 'Enter':
      e.preventDefault();
      nextSlide();
      break;
    case 'Home':
      showSlide(0);
      break;
    case 'End':
      showSlide(totalSlides - 1);
      break;
  }
});

// Wheel Navigation
let lastWheelTime = 0;
document.addEventListener('wheel', (e) => {
  // Prevent fast scrolling triggers
  const now = Date.now();
  if (now - lastWheelTime < 800) return;
  
  // Verify scroll is inside slide container (not in scrollable text boxes)
  if (e.target.closest('.script-inputs') || e.target.closest('.script-preview') || e.target.closest('.criteria-list') || e.target.closest('.code-container') || e.target.closest('.speaker-notes-content')) {
    return;
  }

  if (e.deltaY > 50) {
    nextSlide();
    lastWheelTime = now;
  } else if (e.deltaY < -50) {
    prevSlide();
    lastWheelTime = now;
  }
});

// Swipe gestures
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;
  
  // Horizontal swipe check
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
    if (diffX > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  }
}, false);

// Slide select dropdown listener
slideSelect.addEventListener('change', (e) => {
  showSlide(parseInt(e.target.value));
});

// Click navigation
document.getElementById('prevBtn').addEventListener('click', prevSlide);
document.getElementById('nextBtn').addEventListener('click', nextSlide);

/* --- Toast Notification Utility --- */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
  }, 2000);
}

/* --- Theme Switcher --- */
const themeToggleBtn = document.getElementById('themeToggleBtn');
themeToggleBtn.addEventListener('click', toggleTheme);

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('slides-theme', newTheme);

  // Update icon
  const icon = themeToggleBtn.querySelector('i');
  if (newTheme === 'light') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }

  showToast(`Swapped to ${newTheme} theme.`);
  
  // Sync iframe theme if presenter console is active
  syncIframeTheme(newTheme);
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('slides-theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    const icon = themeToggleBtn.querySelector('i');
    if (savedTheme === 'light') {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  }
}

/* --- Presenter Console Overlay logic --- */
const presenterOverlay = document.getElementById('presenterOverlay');
const presenterFrame = document.getElementById('presenterFrame');
const presSlideCounter = document.getElementById('presSlideCounter');
const speakerNotesDiv = document.getElementById('speakerNotes');

document.getElementById('presenterModeBtn').addEventListener('click', openPresenterMode);
document.getElementById('closePresenterBtn').addEventListener('click', closePresenterMode);

document.getElementById('presPrevBtn').addEventListener('click', prevSlide);
document.getElementById('presNextBtn').addEventListener('click', nextSlide);

function openPresenterMode() {
  presenterOverlay.classList.add('active');
  updatePresenterConsole();
  startTimer();
  showToast("Presenter Console Opened. Press Esc to exit.");
}

function closePresenterMode() {
  presenterOverlay.classList.remove('active');
  stopTimer();
}

function updatePresenterConsole() {
  if (!presenterOverlay.classList.contains('active')) return;

  // Sync index counts
  presSlideCounter.textContent = `Slide ${currentSlideIndex + 1} of ${totalSlides}`;
  
  // Sync slide notes
  speakerNotesDiv.textContent = speakerNotes[currentSlideIndex] || "No notes available for this slide.";

  // Sync iframe view (use hash or postMessage if possible, or just refresh source)
  try {
    const frameWindow = presenterFrame.contentWindow;
    if (frameWindow && typeof frameWindow.showSlide === 'function') {
      frameWindow.showSlide(currentSlideIndex);
    } else {
      // Fallback reload matching active index hash
      presenterFrame.src = `index.html#slide=${currentSlideIndex}`;
    }
  } catch(e) {
    // Cross-origin boundaries check (though same domain, standard fallback)
  }
}

function syncIframeTheme(themeName) {
  try {
    const frameDoc = presenterFrame.contentDocument || presenterFrame.contentWindow.document;
    if (frameDoc) {
      frameDoc.body.setAttribute('data-theme', themeName);
    }
  } catch(e) {}
}

// Esc handler to close presenter view
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && presenterOverlay.classList.contains('active')) {
    closePresenterMode();
  }
});

/* --- Presenter Mode Timer --- */
const timerDisplay = document.getElementById('timerDisplay');
document.getElementById('timerStartBtn').addEventListener('click', startTimer);
document.getElementById('timerPauseBtn').addEventListener('click', pauseTimer);
document.getElementById('timerResetBtn').addEventListener('click', resetTimer);

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    timerSeconds++;
    const hrs = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(timerSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 0;
  timerDisplay.textContent = "00:00:00";
}

function stopTimer() {
  pauseTimer();
  resetTimer();
}

/* --- Slide Interactions controller --- */
function triggerSlideInteractions(slideIndex) {
  // Perform actions depending on which slide became active
  switch(slideIndex) {
    case 3: // Slide 4: Timeline
      syncTimelineCard(document.getElementById('timelineSlider').value);
      break;
    case 7: // Slide 8: ERD
      // Reset active entity highlights
      document.querySelectorAll('.erd-entity').forEach(el => el.classList.remove('active'));
      document.getElementById('ent-product').classList.add('active');
      document.getElementById('erdExplanation').innerHTML = erdExplanations['ent-product'];
      break;
    case 14: // Slide 15: Checklist
      updateChecklistGauge();
      break;
    case 15: // Slide 16: Script Simulator
      renderScriptText();
      break;
    case 16: // Slide 17: Scorecard
      renderScorecardList();
      updateScorecardMeter();
      break;
  }
}

/* --- Slide 4: Timeline Slider Interaction --- */
const timelineSlider = document.getElementById('timelineSlider');
timelineSlider.addEventListener('input', (e) => {
  syncTimelineCard(parseInt(e.target.value));
});

function syncTimelineCard(stepIndex) {
  const cards = document.querySelectorAll('.timeline-card');
  cards.forEach((card, idx) => {
    if (idx === stepIndex) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  const detail = timelineDetails[stepIndex];
  if (detail) {
    document.getElementById('timelineText').innerHTML = `
      <div class="card-title"><i class="fa-solid fa-clock"></i> ${detail.title}</div>
      <p class="card-desc" style="font-size: 1.05rem;">${detail.desc}</p>
    `;
  }
}

// Click timeline cards to update slider
document.querySelectorAll('.timeline-card').forEach((card) => {
  card.addEventListener('click', () => {
    const step = parseInt(card.getAttribute('data-step'));
    timelineSlider.value = step;
    syncTimelineCard(step);
  });
});

/* --- Slide 8: ERD Click Handlers --- */
document.querySelectorAll('.erd-entity').forEach((entity) => {
  entity.addEventListener('click', () => {
    document.querySelectorAll('.erd-entity').forEach(el => el.classList.remove('active'));
    entity.classList.add('active');
    
    const explanation = erdExplanations[entity.id] || "Select an entity table.";
    document.getElementById('erdExplanation').innerHTML = explanation;
  });
});

/* --- Slide 15: Deliverables Checklist Toggle --- */
document.querySelectorAll('.checklist-item').forEach((item) => {
  item.addEventListener('click', () => {
    item.classList.toggle('checked');
    updateChecklistGauge();
  });
});

function updateChecklistGauge() {
  const items = document.querySelectorAll('.checklist-item');
  const total = items.length;
  const checked = document.querySelectorAll('.checklist-item.checked').length;
  
  const percentage = Math.round((checked / total) * 100);
  
  // Update UI Elements
  const percentText = document.getElementById('gaugePercent');
  const gaugeRing = document.getElementById('gaugeRing');
  const gaugeStatus = document.getElementById('gaugeStatus');
  
  percentText.textContent = `${percentage}%`;
  
  // Radial color math
  gaugeRing.style.background = `conic-gradient(var(--success) ${percentage}%, rgba(255,255,255,0.05) ${percentage}%)`;
  
  // Progress status message
  if (percentage === 100) {
    gaugeStatus.textContent = "READY FOR FINAL REVIEW";
    gaugeStatus.style.color = "var(--success)";
  } else if (percentage >= 50) {
    gaugeStatus.textContent = "ALMOST COMPLETE";
    gaugeStatus.style.color = "var(--warning)";
  } else {
    gaugeStatus.textContent = "PREPARATION INCOMPLETE";
    gaugeStatus.style.color = "var(--error)";
  }
}

/* --- Slide 16: Live Demo Script Simulator --- */
const scriptInputs = [
  document.getElementById('sysName'),
  document.getElementById('startScreen'),
  document.getElementById('firstAction'),
  document.getElementById('secondAction'),
  document.getElementById('techDecision')
];

scriptInputs.forEach((input) => {
  input.addEventListener('input', renderScriptText);
});

function renderScriptText() {
  const sysNameVal = document.getElementById('sysName').value || "[System Name]";
  const startScreenVal = document.getElementById('startScreen').value || "[Starting Screen]";
  const firstActionVal = document.getElementById('firstAction').value || "[First Action]";
  const secondActionVal = document.getElementById('secondAction').value || "[Second Action]";
  const techDecisionVal = document.getElementById('techDecision').value || "[Technical Decision]";

  const scriptTextDiv = document.getElementById('scriptText');
  scriptTextDiv.innerHTML = `
"I'll now walk you through the complete <span class="filled">${sysNameVal}</span> application.

Starting at the <span class="filled">${startScreenVal}</span>, a user would first <span class="filled">${firstActionVal}</span>. Notice that search results populate instantly without a page reload.

Moving to the admin stock management console, the system allows the shop manager to <span class="filled">${secondActionVal}</span>. This secure updates feature required <span class="filled">${techDecisionVal}</span>, which optimizes page loading rates on spotty network layouts.

Finally, logging out and exiting the admin dashboard completes the full retail user workflow, resetting our counters for client queries."
  `;
}

/* --- Slide 17: Reviewer Scorecard Simulator --- */
function renderScorecardList() {
  const criteriaListDiv = document.getElementById('criteriaList');
  // Avoid duplicating list elements if already rendered
  if (criteriaListDiv.children.length > 0) return;

  criteriaListDiv.innerHTML = '';
  evaluationCriteria.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'criteria-item';
    
    const info = document.createElement('div');
    info.className = 'criteria-info';
    
    const name = document.createElement('span');
    name.className = 'criteria-name';
    name.textContent = `${idx + 1}. ${item.name}`;
    
    const desc = document.createElement('span');
    desc.className = 'criteria-desc';
    desc.textContent = item.desc;
    
    info.appendChild(name);
    info.appendChild(desc);
    
    const scoreButtons = document.createElement('div');
    scoreButtons.className = 'score-buttons';
    
    // Create 1-5 score pickers
    for(let val = 1; val <= 5; val++) {
      const btn = document.createElement('button');
      btn.className = 'score-btn';
      if (val === 5) btn.classList.add('selected'); // default to 5/5
      btn.textContent = val;
      
      btn.addEventListener('click', () => {
        // Toggle selected classes
        scoreButtons.querySelectorAll('.score-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        // Update score data
        criteriaScores[idx] = val;
        updateScorecardMeter();
      });
      
      scoreButtons.appendChild(btn);
    }
    
    row.appendChild(info);
    row.appendChild(scoreButtons);
    criteriaListDiv.appendChild(row);
  });
}

function updateScorecardMeter() {
  const sum = criteriaScores.reduce((acc, val) => acc + val, 0);
  const average = (sum / evaluationCriteria.length).toFixed(1);
  
  const scoreNum = document.getElementById('scoreNumber');
  const scoreCircle = document.getElementById('scoreCircle');
  const scoreMessage = document.getElementById('scoreMessage');
  const scoreTip = document.getElementById('scoreTip');
  
  scoreNum.textContent = average;
  
  const percentOf5 = (average / 5) * 100;
  scoreCircle.style.background = `conic-gradient(var(--accent-primary) ${percentOf5}%, rgba(255,255,255,0.05) ${percentOf5}%)`;
  
  // Custom reviewer feedback messages
  if (average >= 4.5) {
    scoreMessage.textContent = "EXCELLENT PREPARATION";
    scoreMessage.style.color = "var(--success)";
    scoreTip.textContent = "You are fully ready to present. You can defend architecture decisions and explain testing coverage clearly.";
  } else if (average >= 3.5) {
    scoreMessage.textContent = "SOLID READINESS";
    scoreMessage.style.color = "var(--warning)";
    scoreTip.textContent = "Almost there. Focus on practicing the live demo script to ensure timing fits the 6-minute window.";
  } else {
    scoreMessage.textContent = "REVIEWS WARNING";
    scoreMessage.style.color = "var(--error)";
    scoreTip.textContent = "DANGER: Revisit database design justifications and clean up code comments to avoid failing review marks.";
  }
}

/* --- Slide index validation checking for Iframe instances --- */
function checkUrlHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#slide=')) {
    const slideId = parseInt(hash.replace('#slide=', ''));
    if (!isNaN(slideId) && slideId !== currentSlideIndex) {
      showSlide(slideId);
    }
  }
}

/* --- Initialize Application --- */
window.addEventListener('load', () => {
  loadSavedTheme();
  initSlides();
  checkUrlHash();
  
  // Listen for hash changes (used for syncing Iframe slide movements)
  window.addEventListener('hashchange', checkUrlHash);
});
