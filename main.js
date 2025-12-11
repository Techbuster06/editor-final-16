
// =======================================================
// TWIN-CLOUDS PHASE 2: CORE JAVASCRIPT (main.js)
// TEST MODE (Firebase + Gemini API Disabled)
// =======================================================

// -------------------------------------------------------
// A. FIREBASE (Disabled for Local Testing)
// -------------------------------------------------------
console.warn("⚠️ Firebase & Gemini API are currently disabled for testing.");

// Mock Firebase functions
function initializeApp() { return {}; }
function getAuth() { return {}; }
function signInAnonymously() { console.log("Mock: signInAnonymously() called"); }
function onAuthStateChanged(auth, callback) {
  console.log("Mock: onAuthStateChanged triggered");
  callback({ uid: "mockUser123" });
}
function getFirestore() { return {}; }
function collection() { return {}; }
function addDoc(path, data) {
  console.log("Mock: Saving post to Firestore:", data);
  return Promise.resolve();
}
function query() { return {}; }
function onSnapshot(q, callback) { console.log("Mock: Listening for scheduled posts"); callback({ forEach: ()=>{} }); }

// -------------------------------------------------------
// B. FIRESTORE LOGIC (Mock)
// -------------------------------------------------------
let currentUserId = "mockUser123";

async function savePostToFirestore(postData) {
  console.log("🟢 Mock Firestore Save:", postData);
  alert("✅ (Test Mode) Post saved locally!");
}

function listenForScheduledPosts() {
  console.log("📅 Mock: Listening for posts (test mode)");
}

// -------------------------------------------------------
// C. MOCK AUTH FLOW
// -------------------------------------------------------
onAuthStateChanged({}, (user) => {
  if (user) {
    currentUserId = user.uid;
    listenForScheduledPosts();
    if (document.getElementById('calendarGrid')) {
      console.log("Mock: renderCalendar() skipped in test mode");
    }
  } else {
    signInAnonymously();
  }
});

// -------------------------------------------------------
// D. Gemini API (Disabled for Local Testing)
// -------------------------------------------------------
async function fetchGeminiResponse(prompt) {
  console.log("Mock Gemini called with prompt:", prompt);
  return `✨ Mock AI Response for: "${prompt}"`;
}

// -------------------------------------------------------
// E. Handle AI Generation Button
// -------------------------------------------------------
async function handleAIGeneration(e) {
  e.preventDefault();

  const promptInput = document.getElementById("topic");
  const toneSelect = document.getElementById("tone");
  const formatSelect = document.getElementById("format");
  const outputContainer = document.getElementById("ai-results-output");
  const generateBtn = document.getElementById("ai-generate-btn");

  const prompt = promptInput.value.trim();
  const tone = toneSelect.value;
  const format = formatSelect.value;

  if (prompt.length < 5) {
    alert("Please enter a longer prompt (at least 5 characters)!");
    return;
  }

  const originalText = generateBtn.textContent;
  generateBtn.textContent = "Generating...";
  generateBtn.disabled = true;
  outputContainer.innerHTML = `<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Simulating AI generation...</div>`;

  try {
    const result = await fetchGeminiResponse(prompt);
    const formattedResult = result.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    outputContainer.innerHTML = `
      <div class="result-box">
        <p class="result-meta">Generated for: ${format} | Tone: ${tone}</p>
        <p class="ai-output-text">${formattedResult}</p>
        <div class="result-actions">
          <button class="btn btn-secondary"><i class="fas fa-copy"></i> Copy</button>
          <button class="btn btn-accent"><i class="fas fa-calendar-plus"></i> Schedule</button>
        </div>
      </div>
    `;
  } catch (error) {
    outputContainer.innerHTML = `<p class="error-message">Error generating content: ${error.message}</p>`;
    console.error("AI Generation Error:", error);
  } finally {
    generateBtn.textContent = originalText;
    generateBtn.disabled = false;
  }
}

// -------------------------------------------------------
// D. INSTAGRAM FEED
// -------------------------------------------------------
const INSTAGRAM_ID = "17841477231695125";
const ACCESS_TOKEN = "EAAVgkpIbjnwBP2oLQEnysRZCzKnMf9sMJ0cFv99MyS0NQXBmPjS3lLk8iosIOoyAZA7syFzNLZBr7De7irByp2gZAA08wUCLzZAxUxbg7uROnEaFhu5ffRUToQD8d76BPoqal88NLTgWGjdGSdqGOC9vSBC98QCHwYbEXAlkIWsheTrdiRtq9yJHkVsgVZAZBIF2KZCXNJgLmOSE9PJYMCX1";
const FEED_CONTAINER_ID = "instagram-feed-container";
async function fetchInstagramFeed() {
    const container = document.getElementById(FEED_CONTAINER_ID);
    if (!container) return;


    container.innerHTML = "";
    const endpoint = `https://graph.facebook.com/v19.0/${INSTAGRAM_ID}/media?fields=caption,media_url,media_type,permalink,timestamp,thumbnail_url,like_count,comments_count&access_token=${ACCESS_TOKEN}&limit=6`;
    try {
        const res = await fetch(endpoint);
        // 🚨 NEW CRITICAL CHECK: If the response is not OK (e.g., 400, 403, 500)
    if (!res.ok) {
        const errorData = await res.json();
        // Use console.error for developers and innerHTML for users
        console.error("Instagram API Error:", errorData);
        container.innerHTML = `<p class="error-message">Failed to load feed: ${errorData.error.message || res.statusText}. Please check Access Token permissions.</p>`;
        return;
    }
        const data = await res.json();
        const posts = data.data || [];
        if (posts.length === 0) {
            container.innerHTML = "<p>No posts found.</p>";
            return;
        }
        posts.forEach(post => {
            const card = document.createElement("a");
            card.href = post.permalink;
            card.target = "_blank";
            card.classList.add("instagram-post-card");
            const mediaHTML = post.media_type === "VIDEO"
                ? `<div class="video-overlay"><i class="fas fa-play"></i></div><img src="${post.thumbnail_url || post.media_url}" alt="Video">`
                : `<img src="${post.media_url}" alt="Image">`;
           card.innerHTML = `
    ${mediaHTML}
    <div class="overlay">
        <div class="overlay-content">
            <span><i class="fas fa-heart"></i> ${post.like_count || 0}</span>
            <span><i class="fas fa-comment"></i> ${post.comments_count || 0}</span>
        </div>
    </div>`;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<p class="error-message">Failed to load Instagram feed.</p>`;
    }
}
document.addEventListener("DOMContentLoaded", () => {

    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    // ... (rest of your DOMContentLoaded code) ...
});

// -------------------------------------------------------
// AI STUDIO LOGIC (COMBINED HANDLERS)
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // A. INPUT MODE SWITCH HANDLER
    const mode = document.getElementById("inputMode");
    const area = document.getElementById("recycleInputArea");
    const fileSec = document.getElementById("fileUploadSection");
    const urlSec = document.getElementById("urlInputSection");
    const textSec = document.getElementById("textInputSection");

    if (mode) {
        mode.addEventListener("change", () => {
            const value = mode.value;
            area.style.display = value === "topic" ? "none" : "block";
            fileSec.style.display = value === "file" ? "block" : "none";
            urlSec.style.display = value === "url" ? "block" : "none";
            textSec.style.display = value === "text" ? "block" : "none";
        });
    }

   // ✅ CONNECT GEMINI LIVE GENERATION
document.getElementById("ai-generate-btn")?.addEventListener("click", handleAIGeneration);
});

// -------------------------------------------------------
// SCHEDULER: CAMPAIGN TEMPLATE HANDLER (ENHANCED)
// -------------------------------------------------------
/**
 * Creates a typewriter animation effect in a textarea element.
 * @param {HTMLTextAreaElement} element - The textarea element to target.
 * @param {string} text - The full text to be typed out.
 * @param {number} delay - The delay (in milliseconds) between each character.
 */
function typewriterEffect(element, text, delay = 40) {
  element.value = '';
  let i = 0;
  // 1. Add 'typing' class for CSS cursor animation
  element.classList.add('typing');
  element.classList.remove('prefilled'); // Remove 'prefilled' temporarily

  function type() {
    if (i < text.length) {
      element.value += text.charAt(i);
      i++;
      setTimeout(type, delay);
    } else {
      // 2. When complete, remove 'typing' and add 'prefilled'
      element.classList.remove('typing');
      element.classList.add('prefilled');
    }
  }
  type();
}
document.addEventListener("DOMContentLoaded", () => {
    // 1. SCHEDULER: Define all constants once at the start
    const templateSelect = document.getElementById("campaignTemplate");
    const caption = document.getElementById("caption");
    const platform = document.getElementById("platform");
    const timeInput = document.getElementById("scheduleTime");
    const note = document.getElementById("templateNote");
    // New constant for the tip
    const linkedinTip = document.getElementById("linkedinTip");

    // 2. SCHEDULER: Campaign Template Handler Logic
    if (templateSelect) {
        templateSelect.addEventListener("change", () => {
            const val = templateSelect.value;
            note.style.display = "none";
            if (!val) return;

            const now = new Date();
            let preset = {};

            switch (val) {
                case "productLaunch":
                    preset = {
                        caption: "🚀 Launching our brand new product! Stay tuned for exclusive offers.",
                        platform: "Instagram",
                        time: new Date(now.getTime() + 2 * 60 * 60 * 1000)
                    };
                    break;
                case "eventHype":
                    preset = {
                        caption: "🎉 Join our upcoming event this weekend! RSVP today. #Event #Hype",
                        platform: "LinkedIn",
                        time: new Date(now.getTime() + 4 * 60 * 60 * 1000)
                    };
                    break;
                case "weeklyTips":
                    preset = {
                        caption: "💡 Weekly Tip: Consistency builds engagement. Stay visible!",
                        platform: "X",
                        time: new Date(now.getTime() + 24 * 60 * 60 * 1000)
                    };
                    break;
                // <<< ADDED NEW B2B TEMPLATE CASE >>>
                case "thoughtLeadership":
                    preset = {
                        caption: "The future of B2B marketing relies on authentic content, not just automation. Here are three steps to get started:\n\n1. Identify 3 core value topics.\n2. Write simple, short paragraphs.\n3. End with a question to drive comments.",
                        platform: "LinkedIn",
                        time: new Date(now.getTime() + 10 * 60 * 60 * 1000)
                    };
                    break;
                // <<< END NEW CASE >>>
                case "custom":
                default:
                    preset = {};
            }

            // This is the correct placement for updatePredictiveScore()
            updatePredictiveScore();

            if (caption && preset.caption) {
                typewriterEffect(caption, preset.caption, 40);
            }

            if (platform && preset.platform) platform.value = preset.platform;

            if (timeInput && preset.time) {
                const formatted = preset.time.toISOString().slice(0, 16);
                timeInput.value = formatted;
            }

            // Show confirmation note with a delay
            setTimeout(() => {
                note.style.display = "block";
            }, 200);
        });
    }

    // 3. SCHEDULER: LinkedIn Tip Visibility Logic
    // This logic runs once on load, and attaches listeners to the platform/template selectors.
    if (platform && linkedinTip) {

        const toggleLinkedInTip = () => {
            // Check if the currently selected value is 'LinkedIn'
            if (platform.value === "LinkedIn") {
                linkedinTip.style.display = "block"; // SHOW the tip
            } else {
                linkedinTip.style.display = "none";  // HIDE the tip for other platforms
            }
        };

        // A. Initial check (CRUCIAL: Shows the tip if LinkedIn is the default on load)
        toggleLinkedInTip();

        // B. Listener for platform changes (User manually selects a different platform)
        platform.addEventListener("change", toggleLinkedInTip);

        // C. Listener for template changes (A template sets the platform value, e.g., to LinkedIn)
        templateSelect.addEventListener("change", toggleLinkedInTip);
    }

    // ... (Any other global logic for the scheduler page goes here, like calendar setup) ...

});


// -------------------------------------------------------
// E. DASHBOARD & ANALYTICS BUTTON FIXES
// -------------------------------------------------------
// -------------------------------------------------------
// E. DASHBOARD & MODAL LOGIC (UPDATED)
// -------------------------------------------------------


let currentOnboardingStep = 1;
const TOTAL_ONBOARDING_STEPS = 3;


function hideOnboardingModal() {
    const modal = document.getElementById('onboardingModal');
    if (modal) {
        modal.style.display = 'none';
    }
}


// Function to control which onboarding step is visible
function showOnboardingStep(stepNumber) {
    // Hide all steps first
    document.querySelectorAll('.onboarding-step').forEach(step => {
        step.style.display = 'none';
    });


    // Show the desired step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.style.display = 'block'; // Or 'flex' depending on your layout
    }


    // Update button visibility (You need to ensure you have these button IDs in your HTML)
    document.getElementById('onboardingNext1').style.display = (stepNumber === 1 || stepNumber === 2) ? 'inline-flex' : 'none';
    document.getElementById('onboardingDone').style.display = (stepNumber === TOTAL_ONBOARDING_STEPS) ? 'inline-flex' : 'none';
    document.getElementById('onboardingSkip2').style.display = 'inline-flex';

    // NEW: Control the visibility of the back button
    document.getElementById('onboardingBack').style.display = (stepNumber > 1) ? 'inline-flex' : 'none';
}


function advanceOnboarding() {
    currentOnboardingStep++;
    if (currentOnboardingStep <= TOTAL_ONBOARDING_STEPS) {
        showOnboardingStep(currentOnboardingStep);
    } else {
        hideOnboardingModal();
    }
}


// 👇 PASTE THE NEW FUNCTION HERE
function retreatOnboarding() {
    currentOnboardingStep--;
    if (currentOnboardingStep >= 1) {
        showOnboardingStep(currentOnboardingStep);
    } else {
        // If they click Back on the first step, reset to step 1
        currentOnboardingStep = 1;
    }
}
// 👆 END NEW FUNCTION


function showOnboardingModal(date = null) {
    const modal = document.getElementById('onboardingModal');
    if (modal) {
        modal.style.display = 'flex';
        // Start at the first step
        currentOnboardingStep = 1;
        showOnboardingStep(currentOnboardingStep);

        if (date) {
            console.log(`Scheduling for ${date}`);
        }
    }
}
// main.js (Add these functions)


// Function to show the new post modal
function showNewPostModal() {
    const modal = document.getElementById('newPostModal');
    if (modal) {
        modal.style.display = 'flex';
        // Add a class to the body to prevent background scrolling if needed
        document.body.classList.add('modal-open');
    }
}


// Function to hide the new post modal
function hideNewPostModal() {
    const modal = document.getElementById('newPostModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}


function setupDashboardButtons() {
    const newPostBtn = document.getElementById("newPostBtn");
    const queuePostBtn = document.getElementById("queuePostBtn");
    // Check if we are on the Scheduler page (which has the calendar grid)
    const isSchedulerPage = document.getElementById('calendarGrid');


    if (newPostBtn) {
        newPostBtn.addEventListener("click", (e) => {
            e.preventDefault();

            if (isSchedulerPage) {
                // ✅ SCHEDULER: Opens the Welcome Box/Onboarding Modal
                showOnboardingModal();
            } else {
                // ✅ DASHBOARD/ANALYTICS: Opens the New Post Dialog
                showNewPostModal();
            }
        });
    }


    // main.js (inside setupDashboardButtons)


if (queuePostBtn) {
    queuePostBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Current: alert("Queue Post clicked! (Functionality not implemented yet)");

        // Optional: More advanced mock
        queuePostBtn.disabled = true;
        queuePostBtn.textContent = "Scheduling...";
        setTimeout(() => {
            queuePostBtn.textContent = "Scheduled!";
            setTimeout(() => {
                queuePostBtn.textContent = "Queue Post";
                queuePostBtn.disabled = false;
            }, 1000);
        }, 1500);
    });
}
}


// -------------------------------------------------------
// F. CHARTS (Dashboard + Analytics)
// -------------------------------------------------------
function initChart(id, config) {
    const canvas = document.getElementById(id);
    if (!canvas || typeof Chart === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (canvas.chart) canvas.chart.destroy();
    canvas.chart = new Chart(ctx, config);
}


function initCharts() {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#FFD54F" } } },
        scales: {
            x: { ticks: { color: "#FFD54F" }, grid: { color: "rgba(255,255,255,0.05)" } },
            y: { ticks: { color: "#FFD54F" }, grid: { color: "rgba(255,255,255,0.05)" } }
        }
    };


    initChart("overviewChart", {
        type: "bar",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Engagement",
                data: [12, 19, 8, 15, 22, 30, 25],
                backgroundColor: (ctx) => {
                    const chart = ctx.chart;
                    const { ctx: c, chartArea } = chart;
                    if (!chartArea) return;
                    const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    grad.addColorStop(0, "#00E5FF");
                    grad.addColorStop(1, "#0097A7");
                    return grad;
                },
                borderRadius: 8
            }]
        },
        options
    });


    initChart("engagementChart", {
        type: "doughnut",
        data: {
            labels: ["Likes", "Comments", "Shares"],
            datasets: [{
                data: [145, 32, 18],
                backgroundColor: ["#FFD54F", "#00E5FF", "#4DD0E1"],
                borderWidth: 0
            }]
        },
        options: { ...options, cutout: "65%" }
    });

    // main.js (Add this block inside the initCharts function)

    initChart("platformChart", {
        type: "doughnut",
        data: {
            labels: ["LinkedIn", "Facebook", "Instagram", "Twitter"],
            datasets: [{
                // Mock data representing platform impressions (e.g., total impressions: 15.2K)
                data: [6000, 4500, 3200, 1500],
                // Platform-specific colors for easy identification
                backgroundColor: ["#0A66C2", "#4267B2", "#C13584", "#1DA1F2"],
                borderWidth: 0
            }]
        },
        // Re-use the common options, but set a cutout for the doughnut effect
        options: {
            ...options,
            cutout: "65%",
            plugins: {
                legend: {
                    position: 'bottom', // Move legend to the bottom
                    labels: {
                        color: "#FFD54F"
                    }
                }
            },
        }
    });

// ... The rest of the initCharts function continues here


    initChart("growthChart", {
        type: "line",
        data: {
            labels: ["Day 1", "Day 15", "Day 30", "Day 45", "Day 60", "Day 75", "Day 90"],
            datasets: [
                { label: "Total Reach", data: [2000, 2400, 3100, 3500, 4100, 4800, 5500], borderColor: "#00E5FF", fill: true, backgroundColor: "rgba(0,229,255,0.1)", tension: 0.4 },
                { label: "Followers", data: [1500, 1650, 1800, 2050, 2200, 2450, 2700], borderColor: "#FFD54F", tension: 0.4 }
            ]
        },
        options
    });


    initChart("engagementComparisonChart", {
        type: "bar",
        data: {
            labels: ["Likes", "Comments", "Shares", "Saves"],
            datasets: [
                { label: "Facebook", data: [180, 45, 12, 5], backgroundColor: "#4267B2" },
                { label: "Instagram", data: [350, 75, 20, 30], backgroundColor: "#C13584" },
                { label: "LinkedIn", data: [90, 20, 8, 2], backgroundColor: "#0A66C2" }
            ]
        },
        options: { ...options, scales: { x: { stacked: true }, y: { stacked: true } } }
    });


 // ... (The engagementComparisonChart block ends here)
// In main.js, inside the initCharts function
// REPLACE the entire block for initChart("bestDaysChart", ...) with this:


    initChart("bestDaysChart", {
        type: "bar",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Avg Engagement Score",
                data: [75, 80, 90, 65, 85, 50, 40],
                // ... (Keep your custom background gradient logic)
                // 🛠️ START OF COLOR CHANGE 🛠️
                backgroundColor: (ctx) => {
                    const chart = ctx.chart;
                    const { ctx: c, chartArea } = chart;
                    if (!chartArea) return;

                    // Create a horizontal gradient using your existing blue tones
                    const grad = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);

                    // Lighter Sky Blue (consistent with your other charts)
                    grad.addColorStop(0, "rgba(0, 229, 255, 0.5)"); // #00E5FF with transparency

                    // Darker Blue/Cyan (consistent with your other charts)
                    grad.addColorStop(1, "#0097A7"); // A deep cyan/teal for the end of the bar

                    return grad;
                },
                // Change the border color to match the blue tone
                borderColor: "#00E5FF",
                // 🛠️ END OF COLOR CHANGE 🛠️
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        // Manually re-specify options, including the required indexAxis
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false } // Hide the legend
            },
            indexAxis: 'y', // CRITICAL: Makes it horizontal
            scales: {
                x: {
                    ticks: { color: "#FFD54F" },
                    grid: { color: "rgba(255,255,255,0.05)" },
                    title: { display: true, text: 'Engagement Score', color: "#FFD54F" }
                },
                y: {
                    ticks: { color: "#FFD54F" },
                    grid: { display: false } // Hide horizontal grid lines
                }
            }
        }
    });
}
// ---------- Quick Video Editor improved logic ----------
document.addEventListener("DOMContentLoaded", () => {
  // elements
  const editorModal = document.getElementById("quickVideoEditor");
  const quickVideoBtns = document.querySelectorAll(".quick-video-btn");
  const closeBtn = document.getElementById("closeEditor");
  const videoPreview = document.getElementById("videoPreview");
  const overlayContainer = document.querySelector(".overlay-container") || document.getElementById("videoContainer");
  const toolbar = document.getElementById("floatingToolbar");
  const videoContainer = document.getElementById("videoContainer");
  const textToolbar = document.getElementById("textToolbar");
  const trashBin = document.getElementById("trashBin");

  // open modal
  quickVideoBtns.forEach(btn => btn.addEventListener("click", e => {
    e.preventDefault();
    if (!editorModal) return;
    editorModal.style.display = "flex";
    videoPreview.play();
  }));

  // close
  if (closeBtn) closeBtn.addEventListener("click", () => { editorModal.style.display = "none"; videoPreview.pause(); });

  // play/pause
  const playPauseBtn = document.getElementById("playPause");
  if (playPauseBtn) playPauseBtn.addEventListener("click", () => {
    if (videoPreview.paused) { videoPreview.play(); playPauseBtn.textContent = "⏸️"; }
    else { videoPreview.pause(); playPauseBtn.textContent = "▶️"; }
  });

  // add text
  const addTextBtn = document.getElementById("addText");
  addTextBtn && addTextBtn.addEventListener("click", () => {
    const text = document.createElement("div");
    text.className = "editable-text";
    text.contentEditable = "false";             // start non-editing
    text.textContent = "Tap to edit";
    // place center
    const rect = videoContainer.getBoundingClientRect();
    text.style.left = (rect.width/2 - 80) + "px";
    text.style.top = (rect.height/2 - 16) + "px";
    overlayContainer.appendChild(text);
    makeDraggable(text);
    // focus on double-click to edit
    text.addEventListener("dblclick", () => enterEditMode(text));
    text.addEventListener("click", (ev) => { activeText = text; ev.stopPropagation(); });
  });

  // replace video
  const fileInput = document.getElementById("videoInput");
  const replaceBtn = document.getElementById("replaceVideo");
  replaceBtn && replaceBtn.addEventListener("click", () => fileInput.click());
  fileInput && fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) { const url = URL.createObjectURL(file); videoPreview.src = url; videoPreview.play(); }
  });

  // aspect ratio - resizes videoContainer
  function setAspect(mode) {
    if (!videoContainer) return;
    if (mode === "square") { videoContainer.style.width = "60vh"; videoContainer.style.height = "60vh"; }
    else if (mode === "vertical") { videoContainer.style.width = "45vh"; videoContainer.style.height = "80vh"; }
    else { videoContainer.style.width = "80vh"; videoContainer.style.height = "45vh"; }
  }
  document.getElementById("aspectSquare")?.addEventListener("click", () => setAspect("square"));
  document.getElementById("aspectVertical")?.addEventListener("click", () => setAspect("vertical"));
  document.getElementById("aspectHorizontal")?.addEventListener("click", () => setAspect("horizontal"));

  // filters / presets
  const filtersBtn = document.getElementById("filtersBtn");
  const filterPresets = document.getElementById("filterPresets");
  const filtersMenu = document.getElementById("filtersMenu");
  const brightness = document.getElementById("brightnessRange");
  const blur = document.getElementById("blurRange");
  const contrast = document.getElementById("contrastRange");

  filtersBtn && filtersBtn.addEventListener("click", () => {
    // toggle presets first, then sliders
    if (filterPresets && filterPresets.style.display === "flex") { filterPresets.style.display = "none"; if (filtersMenu) filtersMenu.style.display = "flex"; }
    else if (filtersMenu && filtersMenu.style.display === "flex") { filtersMenu.style.display = "none"; }
    else if (filterPresets) { filterPresets.style.display = "flex"; }
  });

  filterPresets && filterPresets.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    videoPreview.className = "";
    const f = btn.dataset.filter;
    if (f && f !== "none") videoPreview.classList.add(`filter-${f}`);
    filterPresets.style.display = "none";
  }));

  function applyFilters() {
    if (!videoPreview) return;
    videoPreview.style.filter = `brightness(${brightness?.value || 100}%) blur(${blur?.value || 0}px) contrast(${contrast?.value || 100}%)`;
  }
  [brightness, blur, contrast].forEach(i => i && i.addEventListener("input", applyFilters));

  // sound
  const soundBtn = document.getElementById("soundBtn");
  const audioInput = document.getElementById("audioInput");
  const audioEl = document.getElementById("bgMusic");
  soundBtn && soundBtn.addEventListener("click", () => audioInput.click());
  audioInput && audioInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) { audioEl.src = URL.createObjectURL(file); audioEl.play(); }
  });

  // emoji
  const emojiBtn = document.getElementById("emojiBtn");
  const emojiMenu = document.getElementById("emojiMenu");
  emojiBtn && emojiBtn.addEventListener("click", () => { emojiMenu.style.display = emojiMenu.style.display === "block" ? "none" : "block"; });
  emojiMenu && emojiMenu.querySelectorAll("span").forEach(s => s.addEventListener("click", () => {
    const emoji = document.createElement("div");
    emoji.className = "editable-text";
    emoji.textContent = s.textContent;
    emoji.contentEditable = "false";
    overlayContainer.appendChild(emoji);
    // place center
    const r = videoContainer.getBoundingClientRect();
    emoji.style.left = (r.width/2 - 20) + "px";
    emoji.style.top = (r.height/2 - 20) + "px";
    makeDraggable(emoji);
    emojiMenu.style.display = "none";
  }));

  // inline text toolbar & selection handling
  const toolbarColor = document.getElementById("toolbarColor");
  let activeText = null;
  let isDragging = false;
  let draggedEl = null;

  // show inline toolbar when user selects within an editable text
  document.addEventListener("mouseup", (ev) => {
    setTimeout(() => { // slight delay for selection
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) { hideTextToolbar(); return; }
      const range = sel.getRangeAt(0);
      if (!range || range.collapsed) { hideTextToolbar(); return; }
      // ensure selection is inside an .editable-text
      const node = range.startContainer;
      const editable = node.nodeType === 3 ? node.parentElement.closest('.editable-text') : node.closest && node.closest && node.closest('.editable-text');
      if (editable) {
        activeText = editable;
        // position toolbar above selection (approx using bounding rect)
        const rect = range.getBoundingClientRect();
        const containerRect = videoContainer.getBoundingClientRect();
        textToolbar.style.left = Math.min(containerRect.right - 30, Math.max(20, rect.left - containerRect.left + rect.width/2)) + "px";
        textToolbar.style.top = (rect.top - containerRect.top - 44) + "px";
        textToolbar.style.display = "flex";
      } else {
        hideTextToolbar();
      }
    }, 10);
  });

  // toolbar actions (B/I/U + color)
  textToolbar.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    // use execCommand to apply styling to selection within contentEditable
    document.execCommand(cmd, false, null);
    // keep toolbar visible
    window.getSelection().removeAllRanges();
    hideTextToolbar();
  }));
  toolbarColor && toolbarColor.addEventListener("input", (e) => {
    document.execCommand("foreColor", false, e.target.value);
    hideTextToolbar();
  });

  function hideTextToolbar() { if (textToolbar) textToolbar.style.display = "none"; }

  // double-click -> enter edit mode; single click selects
  function enterEditMode(el) {
    el.contentEditable = "true";
    el.classList.add("editing");
    el.focus();
    // create a caret at end
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  // exit edit mode on click outside
  document.addEventListener("click", (e) => {
    if (activeText && !e.target.closest('.editable-text')) {
      if (activeText.classList.contains('editing')) {
        activeText.contentEditable = "false";
        activeText.classList.remove("editing");
      }
      activeText = null;
      hideTextToolbar();
    }
  });

  // ---- Draggable + Trash behavior ----
  function makeDraggable(el) {
    let offsetX = 0, offsetY = 0;
    el.addEventListener("mousedown", (e) => {
      // if editing, don't drag
      if (el.classList.contains("editing")) return;
      isDragging = true;
      draggedEl = el;
      const rect = el.getBoundingClientRect();
      const containerRect = overlayContainer.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      // activate trash
      trashBin.style.display = "block";
      trashBin.classList.add("active");
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(e) {
      if (!isDragging || !draggedEl) return;
      const containerRect = overlayContainer.getBoundingClientRect();
      let left = e.clientX - containerRect.left - offsetX;
      let top = e.clientY - containerRect.top - offsetY;
      // clamp inside container
      left = Math.max(0, Math.min(left, containerRect.width - draggedEl.offsetWidth));
      top = Math.max(0, Math.min(top, containerRect.height - draggedEl.offsetHeight));
      draggedEl.style.left = left + "px";
      draggedEl.style.top = top + "px";

      // check if over trash
      const trashRect = trashBin.getBoundingClientRect();
      const elRect = draggedEl.getBoundingClientRect();
      const overlap = !(elRect.right < trashRect.left || elRect.left > trashRect.right || elRect.bottom < trashRect.top || elRect.top > trashRect.bottom);
      if (overlap) trashBin.classList.add("active");
      else trashBin.classList.remove("active");
    }

    function onMouseUp(e) {
      if (!isDragging) return;
      // check if dropped inside trash -> remove
      const trashRect = trashBin.getBoundingClientRect();
      const elRect = draggedEl.getBoundingClientRect();
      const overlap = !(elRect.right < trashRect.left || elRect.left > trashRect.right || elRect.bottom < trashRect.top || elRect.top > trashRect.bottom);
      if (overlap) {
        draggedEl.remove();
      }
      // cleanup
      isDragging = false;
      draggedEl = null;
      trashBin.style.display = "none";
      trashBin.classList.remove("active");
      document.body.style.userSelect = "";
    }
  }

  // speed: small auto-hide toolbar
  let hideTimer;
  document.addEventListener("mousemove", () => {
    if (!toolbar) return;
    toolbar.classList.remove("hidden");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toolbar.classList.add("hidden"), 3000);
  });

  // initial: attach makeDraggable to any existing editable-texts
  document.querySelectorAll(".editable-text").forEach(el => {
    makeDraggable(el);
    el.addEventListener("dblclick", () => enterEditMode(el));
    el.addEventListener("click", () => activeText = el);
  });

});

// -------------------------------------------------------
// G. DOMContentLoaded INITIALIZER (FIXED)
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    // 1. Initialize features that exist on multiple pages (or are conditional checks)
    if (document.getElementById(FEED_CONTAINER_ID)) fetchInstagramFeed(); // Dashboard only
    if (document.getElementById("ai-generate-btn")) { // AI Studio only
        document.getElementById("ai-generate-btn").addEventListener("click", handleAIGeneration);
    }

    // Attaches listeners for "New Post" and "Queue Post" buttons (Dashboard/Scheduler)
    setupDashboardButtons();

    // Initializes Charts (Dashboard/Analytics only)
    initCharts();

    // Calendar initialization
    if (document.getElementById('calendarGrid')) {
        renderCalendar(currentCalendarDate);
        setupCalendarNavigation();
    }

    // Onboarding modal navigation
    document.getElementById("onboardingNext1")?.addEventListener("click", e => {
        e.preventDefault();
        advanceOnboarding();
    });

    document.getElementById("onboardingNext2")?.addEventListener("click", e => {
        e.preventDefault();
        advanceOnboarding();
    });

    document.getElementById("onboardingDone")?.addEventListener("click", e => {
        e.preventDefault();
        hideOnboardingModal();
    });

    document.getElementById("onboardingSkip2")?.addEventListener("click", e => {
        e.preventDefault();
        hideOnboardingModal();
    });

    document.getElementById("onboardingBack")?.addEventListener("click", e => {
        e.preventDefault();
        retreatOnboarding();
    });
    // -------------------------------------------------------------
    // 4. NEW POST MODAL LISTENERS
    // -------------------------------------------------------------
    document.getElementById('closePostModal')?.addEventListener('click', hideNewPostModal);
    document.getElementById('cancelPost')?.addEventListener('click', hideNewPostModal);
    document.getElementById('schedulePost')?.addEventListener('click', (e) => {
        e.preventDefault();
        const postContent = document.getElementById('postContent')?.value || '';
        if (postContent.trim() !== '') {
            alert(`Draft Scheduled:\n"${postContent.substring(0, 50)}..."`);
            hideNewPostModal();
            document.getElementById('postContent').value = '';
        } else {
            alert("Please enter some content for your post.");
        }
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('newPostModal');
        if (modal && event.target === modal) {
            hideNewPostModal();
        }
    });

    // -------------------------------------------------------------
    // 5. Analytics Export Data Button
    // -------------------------------------------------------------
    const exportDataBtn = document.getElementById("exportDataBtn");
    if (exportDataBtn) {
        exportDataBtn.addEventListener("click", (e) => {
            e.preventDefault();
            exportDataBtn.disabled = true;
            exportDataBtn.textContent = "Exporting...";
            setTimeout(() => {
                alert("Data export initiated!");
                exportDataBtn.textContent = "Export Data";
                exportDataBtn.disabled = false;
            }, 1500);
        });
    }
}); // ✅ END DOMContentLoaded



// =======================================================
// 6. UTILITY BUTTON LISTENERS (Search, Save Draft, Settings)
// =======================================================


// 6a. Search Bar Functionality (Targets the new form ID: searchForm)
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput')?.value;
        if (searchInput) {
            alert(`Searching for: "${searchInput}"... (Filter functionality not yet implemented)`);
            // Optional: clear input after search
            document.getElementById('searchInput').value = '';
        }
    });
}


// 6b. Dashboard: Save Draft Button (Targets the new button ID: saveDraftBtn)
const saveDraftBtn = document.getElementById('saveDraftBtn');
if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', async(e) => {
        e.preventDefault();
        // Assuming 'postContent' is the ID of the textarea where the user types
        const postContent = document.getElementById('postContent')?.value || '';

        if (postContent.trim() !== '') {
            saveDraftBtn.disabled = true;
            saveDraftBtn.textContent = "Saving...";

          setTimeout(async () => {
                await savePostToFirestore({
                    content: postContent,
                    platform: "Instagram",
                    timestamp: new Date().toISOString()
                });
                alert(`Draft saved successfully:\n"${postContent.substring(0, 50)}..."`);
                saveDraftBtn.disabled = false;
                saveDraftBtn.textContent = "Save Draft";
                // NOTE: We don't clear the content or close the modal here,
                // as a saved draft should remain open for editing.
            }, 1000);
        } else {
            alert("Cannot save an empty draft.");
        }
    });
}


// main.js (Locate and replace the 6c block)


// 6c. Analytics: Settings Button (Targets the new link ID: settingsBtn)
const settingsBtn = document.getElementById('settingsBtn');
if (settingsBtn) {
    settingsBtn.addEventListener('click', (e) => {
        // Prevents the link from navigating or jumping to the top of the page
        e.preventDefault();

       window.location.href = 'settings.html';
    });
}
// -------------------------------------------------------
// H. PREDICTIVE SCORE MODULE
// -------------------------------------------------------
function calculatePredictiveScore(text) {
  let score = 0;
  if (!text) return 0;

  const length = text.length;
  const hashtags = (text.match(/#/g) || []).length;

  // base score from length (ideal: 80–200 chars)
  if (length >= 80 && length <= 200) score += 60;
  else if (length > 200 && length <= 300) score += 50;
  else score += 30;

  // hashtags bonus (1–3 optimal)
  if (hashtags === 1) score += 10;
  else if (hashtags === 2 || hashtags === 3) score += 20;
  else if (hashtags > 3) score += 5;

  // time-of-day factor
  const hour = new Date().getHours();
  if (hour >= 8 && hour <= 11) score += 10;     // morning window
  else if (hour >= 18 && hour <= 21) score += 15; // evening prime time
  else score += 5;

  // clamp & round
  return Math.min(100, Math.round(score));
}

function updatePredictiveScore() {
  const captionEl = document.getElementById("caption");
  const boxEl = document.getElementById("predictiveScoreBox");
  if (!captionEl || !boxEl) return;

  const text = captionEl.value.trim();
  const score = calculatePredictiveScore(text);
  let performance = "average";

  if (score > 85) performance = "excellent";
  else if (score > 70) performance = "good";
  else if (score > 50) performance = "fair";
  else performance = "low";

  boxEl.textContent = `AI Predictive Score: ${score}/100 (${performance})`;
}

// attach listener
document.addEventListener("DOMContentLoaded", () => {
  const captionEl = document.getElementById("caption");
  if (captionEl) captionEl.addEventListener("input", updatePredictiveScore);
});

// -------------------------------------------------------
// I. CALENDAR SCHEDULER LOGIC (FIXED CLEAN VERSION)
// -------------------------------------------------------

let currentCalendarDate = new Date();

/**
 * Helper to generate icons for platforms.
 */
function getPlatformIcon(platform) {
  switch (platform.toLowerCase()) {
    case "instagram": return '<i class="fab fa-instagram"></i>';
    case "facebook": return '<i class="fab fa-facebook"></i>';
    case "linkedin": return '<i class="fab fa-linkedin"></i>';
    default: return '<i class="fas fa-link"></i>';
  }
}

// === Render small colored pills for posts on calendar cells ===
function renderPostDetails(cell, posts) {
  try {
    cell.classList.add("has-scheduled-posts");

    let postsContainer = cell.querySelector(".posts");
    if (!postsContainer) {
      postsContainer = document.createElement("div");
      postsContainer.classList.add("posts");
      cell.appendChild(postsContainer);
    }

    postsContainer.innerHTML = "";

    posts.forEach(post => {
      const postPill = document.createElement("div");
      postPill.classList.add("post-pill", `post-${post.platform.toLowerCase()}`);
      postPill.innerHTML = `
        <span class="post-platform-icon" title="${post.platform}">
          ${getPlatformIcon(post.platform)}
        </span>
        <span class="post-time">${post.time}</span>
      `;
      if (post.caption) postPill.title = post.caption;
      postsContainer.appendChild(postPill);
    });
  } catch (err) {
    console.error("Error rendering post details:", err);
  }
}

// -------------------------------------------------------
// AI Suggested Time Mock Logic
// -------------------------------------------------------
const aiSuggestedTimeDisplay = document.getElementById("aiSuggestedTimeDisplay");
const aiSuggestedTimeValue = document.getElementById("aiSuggestedTimeValue");
const useSuggestedTimeBtn = document.getElementById("useSuggestedTimeBtn");

function generateSuggestedTime() {
  const hours = ["9:00 AM", "11:30 AM", "2:00 PM", "5:30 PM", "8:00 PM"];
  return hours[Math.floor(Math.random() * hours.length)];
}

function showSuggestedTime() {
  const suggested = generateSuggestedTime();
  aiSuggestedTimeValue.textContent = suggested;
  aiSuggestedTimeDisplay.querySelector(".time-visual").textContent = "⏰";
  document.getElementById("ai-suggested-note").textContent =
    "AI recommends this time for max engagement!";
}

useSuggestedTimeBtn?.addEventListener("click", () => {
  alert(
    `✅ Suggested time "${aiSuggestedTimeValue.textContent}" applied to your next scheduled post!`
  );
});

// Trigger suggestion when a day cell is clicked
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("day-cell")) {
    showSuggestedTime();
  }
});

// 🌈 AUTO-GENERATED MOCK POSTS — new every month
function generateMonthlyMockPosts() {
  const platforms = ["Instagram", "Facebook", "LinkedIn"];
  const captions = [
    "Morning inspiration post 🌞",
    "Team update 💼",
    "Automation success story 🧠",
    "Midweek motivation 💪",
    "Weekend marketing tips 💡",
    "Creative content showcase 🎨",
    "Evening recap 📊",
    "Daily engagement booster 🚀",
    "Behind the scenes 🎬",
    "Gratitude moment 🙏"
  ];

  const currentMonth = currentCalendarDate.getMonth() + 1; // 1–12
  const currentYear = currentCalendarDate.getFullYear();
  const totalDays = new Date(currentYear, currentMonth, 0).getDate();

  const mockPosts = [];

  // Generate 8–12 colorful posts randomly spread through the month
  const numPosts = Math.floor(Math.random() * 5) + 8; // between 8–12
  for (let i = 0; i < numPosts; i++) {
    const randomDay = Math.floor(Math.random() * totalDays) + 1;
    const day = randomDay < 10 ? `0${randomDay}` : randomDay;
    const month = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    const dateStr = `${currentYear}-${month}-${day}`;

    const platform =
      platforms[Math.floor(Math.random() * platforms.length)];
    const caption =
      captions[Math.floor(Math.random() * captions.length)];

    const hours = ["9:00 AM", "11:30 AM", "2:00 PM", "5:30 PM", "8:00 PM"];
    const time = hours[Math.floor(Math.random() * hours.length)];

    mockPosts.push({
      date: dateStr,
      posts: [
        { time, platform, caption }
      ]
    });
  }

  return mockPosts;
}

// 🧩 generate for current calendar month
var mockPosts = generateMonthlyMockPosts();

async function loadScheduledPosts() {
  // Clear any old posts visually
  document
    .querySelectorAll(".day-cell.has-scheduled-posts")
    .forEach((cell) => {
      cell.classList.remove("has-scheduled-posts");
      cell.querySelector(".posts")?.remove();
    });

  const currentMonthYear = currentCalendarDate.toISOString().substring(0, 7);
  const allPosts = []; // combine Firestore + mock

  // === 1️⃣ Load from Firestore if user is logged in
  try {
    if (typeof db !== "undefined" && currentUserId) {
      const q = query(collection(db, `users/${currentUserId}/posts`));
      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        const post = doc.data();
        const dateObj = new Date(post.timestamp);
        const dateStr = dateObj.toISOString().substring(0, 10);
        if (dateStr.startsWith(currentMonthYear)) {
          allPosts.push({
            date: dateStr,
            posts: [
              {
                time: dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                platform: post.platform || "Instagram",
                caption: post.caption || "",
              },
            ],
          });
        }
      });
    }
  } catch (err) {
    console.error("❌ Firestore load error:", err);
  }

  // === 2️⃣ Add MOCK posts for the same month (but skip duplicates)
  mockPosts.forEach((mock) => {
    if (mock.date.substring(0, 7) === currentMonthYear) {
      // Skip if Firestore already has a post for that same date
      const exists = allPosts.some((real) => real.date === mock.date);
      if (!exists) allPosts.push(mock);
    }
  });

  // === 3️⃣ Render everything
  allPosts.forEach((entry) => {
    const cell = document.querySelector(`.day-cell[data-date="${entry.date}"]`);
    if (cell) renderPostDetails(cell, entry.posts);
  });

  console.log("📅 Loaded posts combined:", allPosts.length);
}

function renderCalendar(date) {
    const grid = document.getElementById("calendarGrid");
    const monthTitle = document.getElementById("monthTitle");
    if (!grid || !monthTitle) return;


    // Clear previous cells
    grid.innerHTML = "";


    // Get month details
    const year = date.getFullYear();
    const month = date.getMonth();

    // Set the month title (e.g., "October 2025")
    monthTitle.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });


    // Determine first day of the month and last day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Calculate the offset (how many empty cells before the 1st)
    // .getDay() returns 0 for Sunday, 1 for Monday, etc.
    const startOffset = firstDayOfMonth.getDay();


    // 1. Add 'placeholder' cells for days from previous month
    // Calculate the previous month's days to fill the gap (e.g., September 28, 29, 30)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
        const prevDay = prevMonthLastDay - i;
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day-cell', 'muted');
        emptyCell.innerHTML = `<span class="day-number">${prevDay}</span><p class="day-empty">No posts</p>`;
        grid.appendChild(emptyCell);
    }


    // 2. Add 'day' cells for the current month
    for (let day = 1; day <= daysInMonth; day++) {
        // Date format: YYYY-M-D (Note: JavaScript month is 0-indexed, but data-date should be 1-indexed)
        const monthNumber = month + 1 < 10 ? `0${month + 1}` : month + 1;
        const dayNumber = day < 10 ? `0${day}` : day;
        const fullDateString = `${year}-${monthNumber}-${dayNumber}`;

        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        dayCell.setAttribute('data-date', fullDateString);
        dayCell.innerHTML = `<span class="day-number">${day}</span><p class="day-empty">No posts</p>`;

        // Add styling/classes for today's date
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayCell.classList.add('today');
        }


       // Add event listener to open new post form/modal on cell click
dayCell.addEventListener('click', () => {
    // When user clicks a date, fill the AI suggested time card for that specific day
    try {
        suggestTimeForDate(fullDateString);
    } catch (err) {
        console.error('Failed to compute suggested time:', err);
    }
    showOnboardingModal(fullDateString);
});

        grid.appendChild(dayCell);
    }


    // 3. Add 'placeholder' cells for days from next month (to fill the final row)
    const totalCells = startOffset + daysInMonth;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days = 42 total cells

    if (totalCells <= 35) { // If it's a 5-week month, fill the rest up to 35
        for (let i = 1; i <= (35 - totalCells); i++) {
             const emptyCell = document.createElement('div');
             emptyCell.classList.add('day-cell', 'muted');
             emptyCell.innerHTML = `<span class="day-number">${i}</span><p class="day-empty">No posts</p>`;
             grid.appendChild(emptyCell);
        }
    } else if (totalCells > 35) { // If it's a 6-week month, fill up to 42
        for (let i = 1; i <= (42 - totalCells); i++) {
             const emptyCell = document.createElement('div');
             emptyCell.classList.add('day-cell', 'muted');
             emptyCell.innerHTML = `<span class="day-number">${i}</span><p class="day-empty">No posts</p>`;
             grid.appendChild(emptyCell);
        }
    }

   // 🔁 Re-generate new mock posts for the new month
mockPosts = generateMonthlyMockPosts();

// After rendering the structure, load any scheduled posts
loadScheduledPosts();
}

/* ===========================
   AI SUGGESTED TIME (Mocked)
   Injects suggestion into scheduler sidebar when a date is selected
   =========================== */

function getAISuggestedTimeForDate(dateString) {
    // dateString -> "YYYY-MM-DD"
    // Mocked suggestion logic: deterministic-ish based on day value so it doesn't feel random each click
    // (This keeps suggestions looking stable across re-renders in the same month.)
    try {
        const day = parseInt(dateString.split('-')[2], 10);
        const buckets = [
            "09:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "05:00 PM", "07:30 PM", "09:00 PM"
        ];
        // Use day to pick a bucket (wrap around)
        return buckets[day % buckets.length];
    } catch (err) {
        return "05:00 PM";
    }
}

function suggestTimeForDate(dateString) {
    const valueEl = document.getElementById('aiSuggestedTimeValue');
    const noteEl = document.getElementById('ai-suggested-note');
    if (!valueEl || !noteEl) return;
    const suggested = getAISuggestedTimeForDate(dateString);
    valueEl.textContent = suggested;
    noteEl.textContent = `Suggested for ${dateString} — estimated peak engagement (mock).`;
    // Store the last suggested into session so "Use Suggested Time" can access it
    sessionStorage.setItem('lastSuggestedTime', suggested);
    sessionStorage.setItem('lastSuggestedDate', dateString);
}

// Wire the "Use Suggested Time" button (stores into localStorage to be used by scheduling flow)
document.getElementById('useSuggestedTimeBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const suggested = sessionStorage.getItem('lastSuggestedTime');
    const date = sessionStorage.getItem('lastSuggestedDate');
    if (!suggested || !date) {
        alert("Please pick a date on the calendar to get a suggestion first.");
        return;
    }
    // Save to localStorage so your scheduler or new post modal can use it
    localStorage.setItem('scheduledSuggestedTime', suggested);
    localStorage.setItem('scheduledSuggestedDate', date);
    // Provide a subtle confirmation
    alert(`Suggested time ${suggested} saved for ${date}. You can now use it when scheduling your post.`);
});

function setupCalendarNavigation() {
    // Navigate to previous month
    // The '?' here prevents the error on pages without the button (like dashboard.html)
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar(currentCalendarDate);
    });


    // Navigate to next month
    document.getElementById('nextMonth')?.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar(currentCalendarDate);
    });
}
// === AI Coach Rotating Tips ===
const coachTips = [
  "Insight: Your Reels engagement jumped 32% this week — keep posting short videos!",
  "Action: Try scheduling more posts on Fridays — audience is most active.",
  "Tip: Use bright thumbnails — they’re driving 20% more clicks.",
  "Reminder: Add hashtags for trending reach this weekend.",
  "Insight: Carousel posts are performing better than single images lately."
];

function rotateCoachTips() {
  const tip = document.getElementById("coachTip");
  const typing = document.getElementById("coachTyping");
  if (!tip) return;
  let index = 0;
  setInterval(() => {
    typing.style.opacity = 1;
    setTimeout(() => {
      tip.textContent = coachTips[index];
      typing.style.opacity = 0;
      index = (index + 1) % coachTips.length;
    }, 800);
  }, 6000);
}
document.addEventListener("DOMContentLoaded", rotateCoachTips);

let selectedNode = null;
let floatingControls = document.getElementById('floating-media-controls');

// =========================================================
// ⚡️ GLOBAL DOM ELEMENT DECLARATIONS (MAINTAINING ROBUST SCOPE)
// Declared here, assigned in initEditor()
// =========================================================
let presetSizeSelect;
let mediaUploadInput;
let uploadBtn;
let opacitySlider;
let opacityValueSpan;
let colorPicker;
let colorHexInput;
let fontFamilySelect;
let shadowToggle;
let animationSelect;
let undoBtn;
let redoBtn;
let exportBtn;
let postBtn;
// =========================================================

document.addEventListener("keydown", function(e) {
    // Check if the focus is on a text input to prevent accidental deletion while typing
    const activeElement = document.activeElement;
    const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

    // Only proceed if a Konva node is selected and the key is Delete or Backspace
    if ((e.key === "Delete" || e.key === "Backspace") && selectedNode) {
        // Prevent default browser behavior (e.g., navigating back on Backspace)
        // unless the user is actively typing in a form field.
        if (!isTyping) {
            e.preventDefault();
        } else {
            // Allow Backspace/Delete key to work in input fields
            return;
        }

        // Stop & clear HTML element (if any)
        if (selectedNode) {
            const mediaType = selectedNode.getAttr && selectedNode.getAttr('mediaType');
            const mediaEl = mediaType === 'video' ? selectedNode.videoElement : selectedNode.audioElement;
            if (mediaEl) {
                try {
                    mediaEl.pause();
                    mediaEl.removeAttribute('src');
                    mediaEl.load();
                } catch (e) { /* silent fail for cleanup */ }
            }
        }

        // Clear transformer (Konva.Transformer instances)
        if (typeof transformer !== 'undefined' && transformer) {
            try { transformer.nodes([]); } catch (e) {}
        }

        // Destroy the Konva node
        if (selectedNode && selectedNode.destroy) {
            selectedNode.destroy();
        }
        selectedNode = null;
        selectedShape = null; // CRITICAL: Ensure deselectShape is fully ready for next action

        // Hide floating HTML controls
        if (floatingControls) {
            floatingControls.style.display = 'none';
        }

        // Redraw layer and save
        if (typeof layer !== 'undefined' && layer) layer.draw();
        saveState && typeof saveState === 'function' && saveState();
    }
});

// --- Jules injected template loader ------------------------------------------------
function loadTemplateFromURL(url) {
    console.log(`[DEBUG] Attempting to load template from URL: ${url}`);

    Konva.Image.fromURL(url, (image) => {
        console.log('[DEBUG] Konva.Image.fromURL SUCCESS callback entered.');
        const stage = getStage();
        if (!stage) {
            console.error('[DEBUG] Stage object not found inside callback.');
            return;
        }
        console.log('[DEBUG] Stage object found.');

        const aspectRatio = image.width() / image.height();
        const maxWidth = stage.width();
        const maxHeight = stage.height();

        let newWidth = maxWidth;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
        }
        console.log(`[DEBUG] Calculated image dimensions: ${newWidth}x${newHeight}`);

        image.setAttrs({
            width: newWidth,
            height: newHeight,
            x: (maxWidth - newWidth) / 2,
            y: (maxHeight - newHeight) / 2,
            name: 'editable-shape',
            mediaType: 'image',
            draggable: true,
            listening: true
        });

        const layer = getActiveLayer();
        if (!layer) {
            console.error('[DEBUG] Active layer not found inside callback.');
            return;
        }
        console.log('[DEBUG] Active layer found.');

        // Clear existing content before adding the template
        hideWelcomeMessage();
        console.log('[DEBUG] Welcome message hidden.');

        layer.add(image);
        console.log('[DEBUG] Image added to layer.');

        setupImageListeners(image);
        selectShape(image);
        console.log('[DEBUG] New image selected.');

        layer.batchDraw();
        console.log('[DEBUG] Layer redrawn.');

        recordState();
        console.log('[DEBUG] State recorded. Template load complete.');

    }, (err) => {
        console.error(`[DEBUG] Konva.Image.fromURL ERROR callback entered for URL: ${url}`, err);
    });
}

function getStage() {
    return stage;
}

function getActiveLayer() {
    return layer;
}

function hideWelcomeMessage() {
    // Find and remove the welcome message text node
    const textNode = layer.findOne('Text');
    if (textNode && textNode.text().includes('Welcome')) {
        textNode.destroy();
    }
}

function recordState() {
    saveState();
}
// -----------------------------------------------------------------------------------

// =========================================================
// ⚡️ GLOBAL KONVA VARIABLE DECLARATIONS
// =========================================================
let selectedShape = null;
let stage;
let layer;
let transformer;
let container;
let mockup;
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 550;

// --- History/State Management ---
let history = [];
let historyPointer = -1;
const HISTORY_LIMIT = 50;

// =========================================================
// ⚡️ GLOBAL HELPER FUNCTIONS
// =========================================================

/**
 * Saves the current state of the Konva layer to the history stack.
 */
function saveState() {
    if (historyPointer < history.length - 1) {
        history = history.slice(0, historyPointer + 1);
    }
    const state = layer.toJSON();
    history.push(state);

    if (history.length > HISTORY_LIMIT) {
        history.shift();
    }
    historyPointer = history.length - 1;
}

/**
 * Handles the logic for switching between the left sidebar tabs (Templates, Media, Text).
 * @param {Event} e The click event.
 */
function handleLeftTabClick(e) {
    const targetId = e.currentTarget.getAttribute('data-target');

    // Deactivate all left tab buttons
    document.querySelectorAll('.left-sidebar .tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Hide all left tab content
    document.querySelectorAll('.left-sidebar .tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate the clicked button
    e.currentTarget.classList.add('active');

    // Show the target content
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
        targetContent.classList.add('active');
        // Dispatch event for templates if needed (templates-sidebar.js listens to this)
        if (targetId === 'templates') {
             document.dispatchEvent(new CustomEvent('templates:open'));
        }
    }
}

/**
 * Loads a previous or next state from history (Undo/Redo).
 */

/**
 * Loads a previous or next state from history (Undo/Redo).
 */
function loadState(isUndo) {
    let newPointer = historyPointer;
    if (isUndo) {
        newPointer--;
    } else {
        newPointer++;
    }

    if (newPointer >= 0 && newPointer < history.length) {
        historyPointer = newPointer;
        const state = history[historyPointer];

        // Use Konva.Node.create to reliably parse the JSON state
        const tempLayer = Konva.Node.create(state, 'editor-canvas-container');

        // Destroy all current layer children
        layer.destroyChildren();

        // Re-add the transformer
        transformer = new Konva.Transformer();
        layer.add(transformer);

        // Move children from temp layer to real layer, and re-setup listeners
        tempLayer.children.forEach(node => {
            if (node.hasName('editable-shape')) {
                layer.add(node);

                if (node.getClassName() === 'Text') {
                    setupTextListeners(node);
                } else if (node.getClassName() === 'Image') {
                    setupImageListeners(node);
                }
            }
        });

        tempLayer.destroy();
        deselectShape();
        layer.batchDraw();
    }
}


/**
 * Attaches Konva event listeners specific to Text nodes.
 */
function setupTextListeners(textNode) {
    const floatingToolbar = document.getElementById('floating-toolbar');

    textNode.on('click tap', function () {
        selectShape(textNode);
    });
    textNode.on('dblclick dbltap', () => startTextEdit(textNode));
    textNode.on('dragend', saveState);
    textNode.on('transformend', saveState);
}

/**
 * Attaches Konva event listeners specific to Image nodes.
 */
function setupImageListeners(image) {
    image.on('click tap', function (e) {
        // *** CRITICAL FIX: Stop event from bubbling up to the stage/layer deselect handler ***
        e.cancelBubble = true;
        selectShape(image);
    });
    image.on('dragend', saveState);
    image.on('transformend', function () {
        saveState();
        updateFloatingControls(image); // Ensure position update after scaling/rotating
    });

    image.on('dragmove', function() {
        updateFloatingControls(image); // Ensure position update while dragging
    });
}


/**
 * Selects a shape on the canvas, showing the correct transformer and sidebar.
 * @param {Konva.Shape} shape The shape to select.
 */
function selectShape(shape) {
    const floatingToolbar = document.getElementById('floating-toolbar');

    selectedNode = shape;
    selectedShape = shape;

    // Use the single global transformer for all shapes
    if (transformer) {
        transformer.nodes([shape]);
    }

    setupSidebar(shape);
    if (floatingToolbar) floatingToolbar.classList.add('active');
    updateFloatingControls(shape);
    layer.batchDraw();
}

function updateFloatingControls(node) {
    if (!floatingControls) return;
    const stage = getStage(); // Assuming getStage() returns the Konva.Stage instance

    // Add this early check:
    if (!stage || !node) {
        floatingControls.style.display = 'none';
        return;
    }

    if (node && node.getAttr('isMedia')) {
        const mediaType = node.getAttr('mediaType');
        const mediaElement = mediaType === 'video' ? node.videoElement : node.audioElement;
        const playPauseBtn = document.getElementById('canvas-play-pause-btn');

        // SAFER POSITIONING: compute node center in stage coordinates and map to screen coords

        // Node client rect returns coordinates relative to stage (in many Konva setups).
        const nodeRect = node.getClientRect();
        const stagePos = stage.container().getBoundingClientRect();

        // Fallback: if nodeRect values are not numbers, hide and return
        if (!nodeRect || isNaN(nodeRect.x) || isNaN(nodeRect.y)) {
            floatingControls.style.display = 'none';
            return;
        }

        // Center of node in stage coordinates
        const center = {
            x: nodeRect.x + nodeRect.width / 2,
            y: nodeRect.y + nodeRect.height / 2
        };

        // Map to screen coordinates (stagePos.left/top are screen offsets)
        const screenX = stagePos.left + center.x;
        const screenY = stagePos.top + center.y;

        // 2. Position the floating container (ensure these match your CSS size)
        const toolbarWidth = 110; // Adjust this if your controls bar width is different
        const toolbarHeight = 50;  // Adjust this if your controls bar height is different

        floatingControls.style.left = (screenX - toolbarWidth / 2) + 'px';
        floatingControls.style.top = (screenY - toolbarHeight / 2) + 'px';
        floatingControls.style.display = 'flex';

        // 3. Update Icon (Play/Pause state)
        if (mediaElement) {
            if (mediaElement.paused) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        }
    } else {
        // Hide if not a media node or no node selected
        floatingControls.style.display = 'none';
    }
}


/**
 * Adds a new text element to the Konva canvas.
 */
function addTextToCanvas(initialText, size, color, x = 50, y = 150, align = 'left') {
    const newText = new Konva.Text({
        x: x,
        y: y,
        text: initialText,
        fontSize: size,
        fill: color,
        align: align,
        draggable: true,
        listening: true,
        name: 'editable-shape',
        wrap: 'word',
        width: stage.width() - 100
    });

    setupTextListeners(newText);
    layer.add(newText);
    layer.batchDraw();
    // CRITICAL: Auto-select the text to show the transformer immediately
    selectShape(newText);
    return newText;
}

function addEmojiToCanvas(emoji) {
    const stage = getStage();
    if (!stage) return;
    const defaultFontSize = 100;

    const textNode = new Konva.Text({
        text: emoji,
        x: stage.width() / 2 - (defaultFontSize / 2),
        y: stage.height() / 2 - (defaultFontSize / 2),
        fontSize: defaultFontSize,
        fill: '#ffffff',
        fontFamily: 'Segoe UI Emoji, Apple Color Emoji, sans-serif',
        draggable: true,
        name: 'editable-shape'
    });

    layer.add(textNode);
    layer.batchDraw();
    saveState();
    selectShape(textNode);
}


/**
 * Adds a new rectangle element to the Konva canvas.
 */
function addRectangleToCanvas(x, y, width, height, color) {
    const newRect = new Konva.Rect({
        x: x,
        y: y,
        width: width,
        height: height,
        fill: color,
        draggable: true,
        name: 'editable-shape'
    });

    // For simplicity, we'll use image listeners for rectangles as they share similar behaviors
    setupImageListeners(newRect);
    layer.add(newRect);
    // Move rectangle to the back
    newRect.zIndex(0);
    layer.batchDraw();
    return newRect;
}

/**
Applies current shape properties to the sidebar.
@param {Konva.Shape | Konva.Node} shape */
function setupSidebar(shape) {
    // These variables are now globally declared and assigned in initEditor.
    const opacitySliderRef = opacitySlider; // Reference global variable
    const opacityValueSpanRef = opacityValueSpan; // Reference global variable
    const shadowToggleRef = shadowToggle; // Reference global variable
    const shadowControls = document.getElementById('shadow-controls');

    // Canvas Color Pickers - (NOTE: Canvas controls not handled here, only shape)
    const canvasColorPicker = document.getElementById('canvas-color-picker');
    const canvasColorHex = document.getElementById('canvas-color-hex');

    // TAB REFERENCES
    const styleButton = document.querySelector('[data-right-target="style-props"]');
    const animButton = document.querySelector('[data-right-target="anim-props"]');
    const textButton = document.querySelector('[data-right-target="text-props"]');
    const canvasButton = document.querySelector('[data-right-target="canvas-props"]');

    // --- Phase 2: Canvas Properties (No shape selected) ---
    if (!shape) {
        // Show all buttons for the default canvas view
        document.querySelectorAll('.sidebar-tabs-right button').forEach(btn => btn.style.display = 'block');

        // Find the canvas tab and activate it (assuming canvas-props is one of the content IDs)
        if (canvasButton) {
            // Only set to active, do not force a click which can re-trigger logic
            canvasButton.classList.add('active');
        }

        // Handle canvas color picker update if needed (Logic omitted for brevity, keeping original JS structure)
        if (canvasColorPicker && stage) {
            const stageColor = stage.container().style.backgroundColor || '#333333';
            canvasColorPicker.value = rgbToHex(stageColor);
            if (canvasColorHex) canvasColorHex.value = rgbToHex(stageColor);
        }

        return; // Exit function
    }

    // --- Phase 3: Shape Properties (Shape IS selected) ---

    // 1. Show Base Tabs (Style and Animation)
    if (styleButton) styleButton.style.display = 'block';
    if (animButton) animButton.style.display = 'block';
    if (canvasButton) canvasButton.style.display = 'none'; // Hide canvas props when shape selected

    // 2. Element-specific Tabs
    const isText = shape.getClassName() === 'Text';

    if (isText) {
        if (textButton) {
            textButton.style.display = 'block';
        }

        // Font Family
        if (document.getElementById('font-family-select')) {
             document.getElementById('font-family-select').value = shape.fontFamily();
        }

        // Font Color
        const textColor = shape.fill() || '#ffffff';
        if (document.getElementById('color-picker')) document.getElementById('color-picker').value = textColor;
        if (document.getElementById('color-hex-input')) document.getElementById('color-hex-input').value = textColor;

        // Alignment
        document.querySelectorAll('.btn-align').forEach(btn => btn.classList.remove('active'));
        const currentAlign = shape.align();
        const alignBtn = document.getElementById(`align-${currentAlign}`);
        if (alignBtn) alignBtn.classList.add('active');

        // Line Height
        const lh = shape.lineHeight() || 1.2;
        if (document.getElementById('line-height-slider')) document.getElementById('line-height-slider').value = lh;
        if (document.getElementById('line-height-value')) document.getElementById('line-height-value').textContent = lh.toFixed(1);

        // Letter Spacing
        const ls = shape.letterSpacing() || 0;
        if (document.getElementById('letter-spacing-slider')) document.getElementById('letter-spacing-slider').value = ls;
        if (document.getElementById('letter-spacing-value')) document.getElementById('letter-spacing-value').textContent = ls;

        // Stroke
        const sColor = shape.stroke() || '#000000';
        if (document.getElementById('stroke-color-picker')) document.getElementById('stroke-color-picker').value = sColor;
        if (document.getElementById('stroke-color-hex')) document.getElementById('stroke-color-hex').value = sColor;

        const sWidth = shape.strokeWidth() || 0;
        if (document.getElementById('stroke-width-slider')) document.getElementById('stroke-width-slider').value = sWidth;
        if (document.getElementById('stroke-width-value')) document.getElementById('stroke-width-value').textContent = sWidth;
    } else {
         // Hide Text tab for non-Text elements
        if (textButton) {
            textButton.style.display = 'none';
        }
    }

    // 3. Update General Style/Shadow Controls (Visible in Style tab)
    // Opacity
    if (opacitySliderRef && opacityValueSpanRef) {
        opacitySliderRef.value = shape.opacity() * 100;
        opacityValueSpanRef.textContent = `${Math.round(shape.opacity() * 100)}%`;
    }

    // Shadow
    const hasShadow = shape.shadowEnabled();
    if (shadowToggleRef) {
        shadowToggleRef.checked = hasShadow;
    }
    if (shadowControls) {
        shadowControls.style.display = hasShadow ? 'block' : 'none';
        if (hasShadow) {
            if (document.getElementById('shadow-color')) document.getElementById('shadow-color').value = shape.shadowColor() || '#000000';
            if (document.getElementById('shadow-offset-x')) document.getElementById('shadow-offset-x').value = shape.shadowOffsetX() || 5;
            if (document.getElementById('shadow-offset-y')) document.getElementById('shadow-offset-y').value = shape.shadowOffsetY() || 5;
        }
    }
}

/**
 * Removes the current selected shape and transformer, and resets controls.
 */
function deselectShape() {
    const floatingToolbar = document.getElementById('floating-toolbar');
    const floatingControls = document.getElementById('floating-media-controls');

    if (floatingControls) floatingControls.style.display = 'none';

    if (floatingToolbar) floatingToolbar.classList.remove('active');
    selectedShape = null;
    selectedNode = null; // Ensure both are null

    if (transformer) transformer.nodes([]);

    // Hide all type-specific groups
    // NOTE: The sidebar element structure relies on the tab system to hide/show,
    // so we just reset the right tab to the default 'Style' tab.

    // Ensure all controls are reset/unchecked to prevent ghost state
    if (shadowToggle) shadowToggle.checked = false;
    if (animationSelect) animationSelect.value = 'none';

    // Switch back to the default Style tab
    const rightTabs = document.querySelectorAll('.right-sidebar .right-tab-button');
    const rightContents = document.querySelectorAll('.right-sidebar .right-tab-content');

    rightTabs.forEach(btn => btn.classList.remove('active'));
    rightContents.forEach(content => content.classList.remove('active'));

    const styleButton = document.querySelector('[data-right-target="style-props"]');
    const styleContent = document.getElementById('style-props');

    // Ensure style-props and canvas-props buttons are visible by default
    document.querySelectorAll('.sidebar-tabs-right button').forEach(btn => btn.style.display = 'block');
    const textButton = document.querySelector('[data-right-target="text-props"]');
    if (textButton) textButton.style.display = 'none';

    if (styleButton) styleButton.classList.add('active');
    if (styleContent) styleContent.classList.add('active');

    if (layer) layer.batchDraw();
}

/**
 * Initiates in-place text editing for the selected Konva Text node.
 * This is crucial for the template text to be editable.
 */
function startTextEdit(textNode) {
    deselectShape();
    textNode.hide();
    layer.draw();

    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
    };

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    // Apply styles and content
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height = textNode.height() - textNode.padding() * 2 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.color = textNode.fill();
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.border = '1px dashed #05eafa';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.zIndex = 999;

    textarea.focus();

    function removeTextarea() {
        textarea.removeEventListener('blur', removeTextarea);
        textarea.removeEventListener('keydown', handleKeydown);

        textNode.text(textarea.value);
        textNode.show();
        layer.draw();

        document.body.removeChild(textarea);
        saveState();
    }

    function handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            removeTextarea();
        }
    }

    textarea.addEventListener('blur', removeTextarea);
    textarea.addEventListener('keydown', handleKeydown);
}
/**
 * Applies a simple animation to a Konva node.
 */
function applyAnimation(node, type) {
    if (!Konva.Tween) return;

    // Stop and destroy any previous animation on this node
    const activeTween = node.getAttr('activeTween');
    if (activeTween) {
        activeTween.pause();
        activeTween.destroy();
        node.setAttr('activeTween', null);
    }

    // Reset properties before applying a new animation
    node.opacity(1);
    node.scaleX(1);
    node.scaleY(1);
    // Restore original position if it was saved
    const originalPos = node.getAttr('originalPos');
    if (originalPos) {
        node.position(originalPos);
    }

    node.setAttr('currentAnimation', type);

    if (type === 'none') {
        node.opacity(1); // Ensure opacity is reset
        layer.batchDraw();
        return;
    }

    if (type === 'fade_jiggle') {
        const originalY = node.y();

        node.opacity(0);

        const fadeIn = new Konva.Tween({
            node: node,
            duration: 0.5,
            opacity: 1,
            easing: Konva.Easings.EaseIn,
            onFinish: () => {
                const jiggle = new Konva.Tween({
                    node: node,
                    duration: 0.8,
                    y: originalY - 10,
                    easing: Konva.Easings.ElasticEaseOut,
                    onFinish: () => {
                        node.y(originalY);
                        layer.batchDraw();
                    }
                });
                node.setAttr('activeTween', jiggle);
                jiggle.play();
            }
        });

        node.setAttr('activeTween', fadeIn);
        fadeIn.play();
    } else if (type === 'slide_in_left') {
        const originalX = node.x();
        node.setAttr('originalPos', { x: originalX, y: node.y() });

        node.x(-node.width());
        node.opacity(0);

        const slideIn = new Konva.Tween({
            node: node,
            duration: 0.6,
            x: originalX,
            opacity: 1,
            easing: Konva.Easings.EaseOut
        });

        node.setAttr('activeTween', slideIn);
        slideIn.play();

    } else if (type === 'zoom_in') {
        node.scaleX(0.1);
        node.scaleY(0.1);
        node.opacity(0);

        const zoomIn = new Konva.Tween({
            node: node,
            duration: 0.5,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            easing: Konva.Easings.BackEaseOut
        });

        node.setAttr('activeTween', zoomIn);
        zoomIn.play();
    }
    layer.batchDraw();
}

/**
 * Loads and sets up a new image on the canvas.
 */
function loadAndSetupImage(img) {
    let imgWidth = img.width;
    let imgHeight = img.height;
    const maxWidth = stage.width() * 0.8;
    const maxHeight = stage.height() * 0.8;

    if (imgWidth > maxWidth || imgHeight > maxHeight) {
        const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        imgWidth *= ratio;
        imgHeight *= ratio;
    }

    const konvaImage = new Konva.Image({
        image: img,
        x: stage.width() / 2 - imgWidth / 2,
        y: stage.height() / 2 - imgHeight / 2,
        width: imgWidth,
        height: imgHeight,
        draggable: true,
        name: 'editable-shape'
    });
    setupImageListeners(konvaImage);
    layer.add(konvaImage);
    layer.batchDraw();
}

/**
 * Creates and adds a Konva Group with an audio icon/visualizer
 * and links it to an HTML Audio element for playback.
 */
function applyAudioToCanvas(audioURL, fileName) {
    const stage = getStage();
    if (!stage) return;
    // 1. Setup HTML Audio Element
    const audio = new Audio(audioURL);
    audio.loop = true;

    // 2. Setup Konva Group/Shape to represent the audio
    const audioNode = new Konva.Group({
        x: stage.width() / 2 - 50,
        y: stage.height() / 2 - 50,
        width: 100,
        height: 100,
        draggable: true,
        name: 'editable-shape',
        isMedia: true,
        mediaType: 'audio'
    });
    audioNode.audioElement = audio; // Attach the HTML element

    const iconRect = new Konva.Rect({
        width: 100,
        height: 100,
        fill: '#05eafa',
        cornerRadius: 10
    });
    audioNode.add(iconRect);

    const iconText = new Konva.Text({
        text: '🎵\n' + fileName,
        fontSize: 30,
        align: 'center',
        verticalAlign: 'middle',
        width: 100,
        height: 100,
        fill: '#141414',
        fontFamily: 'Arial',
        listening: false
    });
    audioNode.add(iconText);

    // Disable listening for children so the Group listens for drag/click
    audioNode.children.forEach(c => c.listening(false));

    // Add other necessary listeners
    setupImageListeners(audioNode);
    layer.add(audioNode);
    layer.batchDraw();
    saveState();
    selectShape(audioNode);

    // Attempt to play immediately (will be handled by floating controls)
    audio.play().catch(e => console.log("Audio autoplay suppressed/failed:", e));
}

/**
 * Creates and adds a Konva.Image node with an HTML video element as its fill pattern.
 * This simulates a video element on the canvas.
 */
function applyVideoToCanvas(videoURL) {
    const video = document.createElement('video');
    video.src = videoURL;
    video.muted = true; // Videos with sound must be muted to play automatically
    video.loop = true;
    video.autoplay = true;

    // Load video meta data to get dimensions
    video.addEventListener('loadedmetadata', function() {
        let vidWidth = video.videoWidth;
        let vidHeight = video.videoHeight;
        const maxWidth = stage.width();
        const maxHeight = stage.height();

        // Scale down video to fit canvas if necessary
        const ratio = Math.min(maxWidth / vidWidth, maxHeight / vidHeight);
        vidWidth *= ratio;
        vidHeight *= ratio;

        const videoImage = new Konva.Image({
            x: stage.width() / 2 - vidWidth / 2,
            y: stage.height() / 2 - vidHeight / 2,
            width: vidWidth,
            height: vidHeight,
            image: video,
            fill: 'black', // fallback color
            draggable: true,
            name: 'editable-shape',
            isMedia: true,
            mediaType: 'video'
        });
        videoImage.videoElement = video; // Attach the HTML element

        // Set video as fill on the image node to play it
        videoImage.fillPatternImage(video);

        setupImageListeners(videoImage);
        layer.add(videoImage);

        const anim = new Konva.Animation(function () {
            // do nothing, animation just needs to update the layer
        }, layer);
        layer.batchDraw();
        saveState();

        // Start playing the video
        video.play().catch(e => console.error("Video autoplay failed:", e));
        anim.start();

        selectShape(videoImage);
    });
}

/**
 * Utility function to convert RGB to Hex.
 */
function rgbToHex(rgb) {
    if (!rgb || rgb.indexOf('rgb') === -1) {
        return rgb || '#333333';
    }
    const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!parts) return '#333333';
    delete parts[0];
    for (let i = 1; i <= 3; i++) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length === 1) parts[i] = '0' + parts[i];
    }
    return '#' + parts.join('');
}


// =========================================================
// ⚡️ FLOATING TOOLBAR ACTIONS (Used by buttons in editor.html)
// =========================================================

/**
 * Deletes the currently selected shape.
 */
function deleteSelectedShape() {
    if (!selectedNode) return;

    // Media cleanup logic (stop playback, etc.)
    const mediaType = selectedNode.getAttr && selectedNode.getAttr('mediaType');
    const mediaElement = mediaType === 'video' ? selectedNode.videoElement : selectedNode.audioElement;

    // 1. Stop & clear HTML element
    if (mediaElement) {
        mediaElement.pause();
        mediaElement.removeAttribute('src');
        mediaElement.load();
    }

    // 2. Clear Konva Transformer handles
    if (transformer) {
        transformer.nodes([]);
        layer.draw();
    }

    // 3. Remove Konva node
    selectedNode.destroy();
    selectedShape = null;
    selectedNode = null;

    // 4. Hide HTML Floating Controls
    updateFloatingControls(null);
    layer.draw();
    saveState();
}

/**
 * Duplicates the currently selected shape.
 */
function duplicateSelectedShape() {
    if (!selectedShape) return;

    // Konva's clone() method is ideal for duplication
    const clone = selectedShape.clone();

    // Adjust position slightly so the clone is visible
    clone.x(selectedShape.x() + 10);
    clone.y(selectedShape.y() + 10);

    // Ensure the clone is draggable and has the correct name
    clone.draggable(true);
    clone.name('editable-shape');

    // Re-attach listeners based on type
    if (clone.getClassName() === 'Text') {
        setupTextListeners(clone);
    } else {
        setupImageListeners(clone);
    }

    // Add to layer, draw, and select the new shape
    layer.add(clone);
    layer.batchDraw();
    selectShape(clone);
}

/**
 * Toggles the playback state of a selected media element (audio or video).
 */
function toggleMediaPlayback() {
    if (!selectedNode || !selectedNode.getAttr('isMedia')) return;

    const mediaType = selectedNode.getAttr('mediaType');
    // Get the underlying HTML media element (audioElement for audio, videoElement for video)
    const mediaElement = mediaType === 'video' ? selectedNode.videoElement : selectedNode.audioElement;
    const playPauseBtn = document.getElementById('canvas-play-pause-btn');
    const playIcon = '<i class="fas fa-play"></i>';
    const pauseIcon = '<i class="fas fa-pause"></i>';

    if (mediaElement) {
        if (mediaElement.paused) {
            // Play media and catch potential Autoplay Policy errors
            mediaElement.play().catch(e => console.error("Media play failed (Autoplay Policy?):", e));
            // Update button icon to PAUSE
            if (playPauseBtn) playPauseBtn.innerHTML = pauseIcon;
        } else {
            mediaElement.pause();
            // Update button icon to PLAY
            if (playPauseBtn) playPauseBtn.innerHTML = playIcon;
        }
    }
}

/**
 * Toggles bold style for a selected text node.
 */
function toggleTextBold() {
    if (selectedShape && selectedShape.getClassName() === 'Text') {
        const currentStyle = selectedShape.fontStyle() || 'normal';
        const isBold = currentStyle.includes('bold');
        const isItalic = currentStyle.includes('italic');
        let newStyle;
        if (isBold) {
            newStyle = isItalic ? 'italic' : 'normal';
        } else {
            newStyle = isItalic ? 'bold italic' : 'bold';
        }
        selectedShape.fontStyle(newStyle);
        layer.batchDraw();
    }
}

function toggleTextItalic() {
    if (selectedShape && selectedShape.getClassName() === 'Text') {
        const currentStyle = selectedShape.fontStyle() || 'normal';
        const isBold = currentStyle.includes('bold');
        const isItalic = currentStyle.includes('italic');
        let newStyle;
        if (isItalic) {
            newStyle = isBold ? 'bold' : 'normal';
        } else {
            newStyle = isBold ? 'bold italic' : 'italic';
        }
        selectedShape.fontStyle(newStyle);
        layer.batchDraw();
    }
}

function increaseFontSize() {
    if (selectedShape && selectedShape.getClassName() === 'Text') {
        selectedShape.fontSize(selectedShape.fontSize() + 2);
        layer.batchDraw();
    }
}

function decreaseFontSize() {
    if (selectedShape && selectedShape.getClassName() === 'Text') {
        selectedShape.fontSize(Math.max(10, selectedShape.fontSize() - 2)); // Minimum size 10
        layer.batchDraw();
    }
}

function exportCanvas() {
    const dataURL = stage.toDataURL({
        mimeType: 'image/png',
        quality: 1
    });

    const link = document.createElement('a');
    link.download = 'twinclouds-design.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function simulatePost() {
    // This is a simulation. In a real app, this would be an API call
    console.log("Simulating social media post API...");
    // Simulate a delay for the API call
    setTimeout(() => {
        alert("Post Scheduled!");
    }, 1500);
}

function resizeCanvas(newWidth, newHeight) {
    const mockup = document.querySelector('.device-mockup');
    if (mockup) {
        mockup.style.width = `${newWidth}px`;
        mockup.style.height = `${newHeight}px`;
    }
    if (stage) {
        stage.width(newWidth);
        stage.height(newHeight);
    }
    if (layer) layer.batchDraw();
}

// ❌ DELETED: The function setupSidebarTabs() which was causing conflicts/was unused.

function handleRightTabClick(event) {
    const targetButton = event.currentTarget;
    const targetId = targetButton.getAttribute('data-right-target');
    // Deactivate all buttons and hide all content
    document.querySelectorAll('.sidebar-tabs-right button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.right-tab-content').forEach(el => el.classList.remove('active'));
    // Activate the clicked button and show the corresponding content
    targetButton.classList.add('active');
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// =========================================================
// ⚡️ TEMPLATE DATA & FUNCTIONS
// =========================================================
// =========================================================
// ⚡️ TEMPLATE DATA DEFINITIONS (All 5 Templates)
// =========================================================
const TEMPLATE_DATA = {
    carousel1: {
        className: "Layer",
        children: [
            { className: "Image", attrs: { src: "assets/templates/carousel1.jpg", width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }, isBackground: true, id: "bg" },
            { className: "Text", text: "HEADLINE", x: 40, y: 70, fontSize: 50, fill: "#FFFFFF", fontFamily: "Bebas Neue", draggable: true, id: "headline_text" },
            { className: "Text", text: "Supporting text goes here", x: 40, y: 130, width: DEFAULT_WIDTH - 80, fontSize: 18, fill: "#FFFFFF", fontFamily: "Raleway", draggable: true, id: "body_text" }
        ]
    },
    carousel2: {
        className: "Layer",
        children: [
            { className: "Rect", x: 0, y: 0, width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT, fill: "#A0522D", draggable: false, id: "bg_rect" },
            { className: "Text", text: "TIP", x: 40, y: 50, fontSize: 36, fill: "#FFB531", fontFamily: "Anton", draggable: true, id: "tip_title" },
            { className: "Text", text: "Use high-contrast colors for accessibility.", x: 40, y: 100, width: DEFAULT_WIDTH - 80, fontSize: 24, fill: "#FFFFFF", fontFamily: "Oswald", draggable: true, id: "tip_body" }
        ]
    },
    carousel3: {
        className: "Layer",
        children: [
            { className: "Image", attrs: { src: "assets/templates/carousel3.jpg", width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }, isBackground: true, id: "bg" },
            { className: "Text", text: "“The best way to predict the future is to create it.”", x: 40, y: 70, width: DEFAULT_WIDTH - 80, fontSize: 36, fill: "#FFFFFF", fontFamily: "Oswald", draggable: true, id: "quote_title" },
            { className: "Text", text: "- Peter Drucker. Add your text here", x: 40, y: 140, width: DEFAULT_WIDTH - 80, fontSize: 18, fill: "#FFFFFF", fontFamily: "Raleway", draggable: true, id: "quote_body" }
        ]
    },
    carousel4: {
        className: "Layer",
        children: [
            { className: "Image", attrs: { src: "assets/templates/carousel4.jpg", width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }, isBackground: true, id: "bg" },
            { className: "Text", text: "CALL TO ACTION", x: 40, y: 70, fontSize: 42, fill: "#FFFFFF", fontFamily: "Oswald", draggable: true, id: "cta_title" },
            { className: "Rect", x: 40, y: 150, width: 180, height: 50, cornerRadius: 8, fill: "#FFB531", draggable: true, id: "cta_rect" },
            { className: "Text", text: "LEARN MORE", x: 60, y: 162, fontSize: 20, fill: "#141414", fontFamily: "Anton", draggable: true, id: "cta_text" }
        ]
    }
};

async function loadTemplate(templateKey) {
    const template = TEMPLATE_DATA[templateKey];
    if (!template) {
        console.error(`Template "${templateKey}" not found`);
        return;
    }
    // Clear the layer and reset state
    layer.destroyChildren();
    transformer = new Konva.Transformer(); // Re-add transformer
    layer.add(transformer);
    deselectShape();

    const imageNodesData = template.children.filter(node => node.className === 'Image');
    const otherNodesData = template.children.filter(node => node.className !== 'Image');

    // Create promises for loading all images using Konva's built-in method
    const imageLoadPromises = imageNodesData.map(nodeData => {
        return new Promise((resolve, reject) => {
            Konva.Image.fromURL(
                nodeData.attrs.src,
                (konvaImage) => {
                    konvaImage.setAttrs({
                        ...nodeData.attrs,
                        name: 'editable-shape',
                        id: nodeData.id,
                        isBackground: nodeData.isBackground
                    });
                    layer.add(konvaImage);
                    setupImageListeners(konvaImage);
                    if (nodeData.isBackground) {
                        konvaImage.zIndex(0); // Send background to back
                    }
                    resolve();
                },
                (err) => {
                    console.error('Failed to load image:', nodeData.attrs.src, err);
                    reject(err);
                }
            );
        });
    });

    try {
        await Promise.all(imageLoadPromises);

        // Add all other non-image nodes (Text, Rect, etc.)
        otherNodesData.forEach(nodeData => {
            let newNode;
            switch (nodeData.className) {
                case 'Text':
                    newNode = new Konva.Text({
                        ...nodeData.attrs,
                        text: nodeData.text,
                        name: 'editable-shape',
                        id: nodeData.id,
                        draggable: nodeData.draggable !== false
                    });
                    setupTextListeners(newNode);
                    break;
                case 'Rect':
                    newNode = new Konva.Rect({
                        ...nodeData.attrs,
                        name: 'editable-shape',
                        id: nodeData.id,
                        draggable: nodeData.draggable !== false
                    });
                    setupImageListeners(newNode);
                    break;
                // Add other Konva types here if needed (Circle, etc.)
                default:
                    return;
            }
            if (newNode) {
                layer.add(newNode);
                // Simple way to handle z-index for this template set
                if (newNode.getClassName() === 'Rect') newNode.zIndex(1);
            }
        });

        layer.batchDraw();
        saveState();
    } catch (error) {
        console.error("Error applying template:", error);
        alert("Failed to load template assets. Check console for details.");
    }
}

// =========================================================
// ⚡️ EVENT LISTENERS
// =========================================================

function setupEventListeners() {
    // --- Left Sidebar Tab Listeners (FIX) ---
    document.querySelectorAll('.left-sidebar .tab-button').forEach(button => {
        button.addEventListener('click', handleLeftTabClick);
    });

    // --- Preset Size Selector ---
    if (presetSizeSelect) {
        presetSizeSelect.addEventListener('change', function() {
            const [width, height] = this.value.split('x').map(Number);
            resizeCanvas(width, height);
            saveState();
        });
    }

    // --- Media Upload ---
    if (uploadBtn && mediaUploadInput) {
        uploadBtn.addEventListener('click', () => mediaUploadInput.click());
        mediaUploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        loadAndSetupImage(img);
                        saveState();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
            e.target.value = null; // Clear input to allow re-uploading the same file
        });
    }

    // --- Color Pickers ---
    function updateColor(color) {
        if (selectedShape) {
            selectedShape.fill(color);
            layer.batchDraw();
        }
    }

    if (colorPicker) {
        colorPicker.addEventListener('input', function() {
            updateColor(this.value);
            colorHexInput.value = this.value;
        });
        colorPicker.addEventListener('change', saveState);
    }
    if (colorHexInput) {
        colorHexInput.addEventListener('change', function() {
            updateColor(this.value);
            colorPicker.value = this.value;
            saveState();
        });
    }

    // --- Opacity Slider ---
    if (opacitySlider) {
        opacitySlider.addEventListener('input', function() {
            if (selectedShape) {
                const opacity = parseFloat(this.value) / 100;
                selectedShape.opacity(opacity);
                opacityValueSpan.textContent = `${this.value}%`;
                layer.batchDraw();
            }
        });
        opacitySlider.addEventListener('change', saveState);
    }

    // --- Font Family ---
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', function() {
            if (selectedShape && selectedShape.getClassName() === 'Text') {
                selectedShape.fontFamily(this.value);
                layer.batchDraw();
                saveState();
            }
        });
    }

    // --- Shadow Toggle ---
    if (shadowToggle) {
        shadowToggle.addEventListener('change', function() {
            if (selectedShape) {
                const isChecked = this.checked;
                selectedShape.shadowEnabled(isChecked);
                const shadowControls = document.getElementById('shadow-controls');
                if (shadowControls) {
                    shadowControls.style.display = isChecked ? 'block' : 'none';
                }
                layer.batchDraw();
                saveState();
            }
        });
    }

    // --- Shadow Controls ---
    const shadowColor = document.getElementById('shadow-color');
    const shadowOffsetX = document.getElementById('shadow-offset-x');
    const shadowOffsetY = document.getElementById('shadow-offset-y');

    function updateShadow() {
        if (selectedShape) {
            selectedShape.shadowColor(shadowColor.value);
            selectedShape.shadowOffsetX(parseInt(shadowOffsetX.value));
            selectedShape.shadowOffsetY(parseInt(shadowOffsetY.value));
            layer.batchDraw();
            saveState();
        }
    }

    if (shadowColor) shadowColor.addEventListener('change', updateShadow);
    if (shadowOffsetX) shadowOffsetX.addEventListener('input', updateShadow);
    if (shadowOffsetY) shadowOffsetY.addEventListener('input', updateShadow);

    // --- Animation Selector ---
    if (animationSelect) {
        animationSelect.addEventListener('change', function() {
            if (selectedShape) {
                applyAnimation(selectedShape, this.value);
                saveState();
            }
        });
    }

    // --- Undo/Redo ---
    if (undoBtn) undoBtn.addEventListener('click', () => loadState(true));
    if (redoBtn) redoBtn.addEventListener('click', () => loadState(false));

    // --- Text Alignment, Line Height, Letter Spacing, Stroke ---

    //// ALIGNMENT
    ['left', 'center', 'right'].forEach(align => {
        const btn = document.getElementById(`align-${align}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
            if (selectedShape && selectedShape.getClassName() === 'Text') {
                selectedShape.align(align);
                document.querySelectorAll('.btn-align').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                layer.batchDraw();
                saveState();
            }
        });
    });

    //// LINE HEIGHT
    const lhSlider = document.getElementById('line-height-slider');
    const lhValue = document.getElementById('line-height-value');
    if (lhSlider) {
        lhSlider.addEventListener('input', function () {
            if (selectedShape && selectedShape.getClassName() === 'Text') {
                const v = parseFloat(this.value);
                selectedShape.lineHeight(v);
                lhValue.textContent = v.toFixed(1);
                layer.batchDraw();
            }
        });
        lhSlider.addEventListener('change', saveState);
    }

    //// LETTER SPACING
    const lsSlider = document.getElementById('letter-spacing-slider');
    const lsValue = document.getElementById('letter-spacing-value');
    if (lsSlider) {
        lsSlider.addEventListener('input', function () {
            if (selectedShape && selectedShape.getClassName() === 'Text') {
                const v = parseInt(this.value, 10);
                selectedShape.letterSpacing(v);
                lsValue.textContent = v;
                layer.batchDraw();
            }
        });
        lsSlider.addEventListener('change', saveState);
    }

    //// STROKE COLOR & WIDTH
    const strokePicker = document.getElementById('stroke-color-picker');
    const strokeHex = document.getElementById('stroke-color-hex');

    function updateStrokeColor(color) {
        if (selectedShape && selectedShape.getClassName() === 'Text') {
            selectedShape.stroke(color);
            layer.batchDraw();
        }
    }

    if (strokePicker) {
        strokePicker.addEventListener('input', function () {
            updateStrokeColor(this.value);
            strokeHex.value = this.value;
        });
        strokePicker.addEventListener('change', saveState);
    }

    if (strokeHex) {
        strokeHex.addEventListener('change', function () {
            updateStrokeColor(this.value);
            strokePicker.value = this.value;
            saveState();
        });
    }

    const sWidthSlider = document.getElementById('stroke-width-slider');
    const sWidthValue = document.getElementById('stroke-width-value');
    if (sWidthSlider) {
        sWidthSlider.addEventListener('input', function () {
            if (selectedShape && selectedShape.getClassName() === 'Text') {
                const v = parseInt(this.value, 10);
                selectedShape.strokeWidth(v);
                sWidthValue.textContent = v;
                layer.batchDraw();
            }
        });
        sWidthSlider.addEventListener('change', saveState);
    }

    // --- Floating Toolbar Logic ---
    const floatDelete = document.getElementById('float-delete');
    if (floatDelete) floatDelete.addEventListener('click', () => {
        deleteSelectedShape();
        saveState();
    });
    const floatDuplicate = document.getElementById('float-duplicate');
    if (floatDuplicate) floatDuplicate.addEventListener('click', () => {
        duplicateSelectedShape();
        saveState();
    });
    const floatBold = document.getElementById('float-bold');
    if (floatBold) floatBold.addEventListener('click', () => {
        toggleTextBold();
        saveState();
    });
    const floatItalic = document.getElementById('float-italic');
    if (floatItalic) floatItalic.addEventListener('click', () => {
        toggleTextItalic();
        saveState();
    });
    const floatSize = document.getElementById('float-size');
    if (floatSize) floatSize.addEventListener('click', () => {
        increaseFontSize();
        saveState();
    });
    const floatToFront = document.getElementById('float-to-front');
    if (floatToFront) floatToFront.addEventListener('click', () => {
        if (selectedShape) {
            selectedShape.moveToTop();
            layer.draw();
            saveState();
        }
    });
    const floatToBack = document.getElementById('float-to-back');
    if (floatToBack) floatToBack.addEventListener('click', () => {
        if (selectedShape) {
            selectedShape.moveToBottom();
            layer.draw();
            saveState();
        }
    });

    // --- Keyboard Listeners ---
    // Note: The global keydown listener at the top of the file handles media/non-media delete

    // --- Content Adding ---
    document.querySelectorAll('#text .asset-card').forEach(card => {
        card.addEventListener('click', function() {
            const type = this.dataset.textType;
            let size = type === 'heading' ? 36 :
                       type === 'subheading' ? 24 : 16;
            let text = type === 'heading' ? 'HEADING TEXT' :
                       type === 'subheading' ? 'Subheading text here' : 'Body text here.';

            const newText = addTextToCanvas(text, size, '#FFFFFF');
            selectShape(newText);
            saveState();
        });
    });

    // --- Emoji Adding ---
    document.querySelectorAll('.emoji-grid button').forEach(button => {
        button.addEventListener('click', function() {
            addEmojiToCanvas(this.textContent.trim());
        });
    });


    // --- Right Sidebar Tab Listeners ---
    document.querySelectorAll('.sidebar-tabs-right button').forEach(button => {
        button.addEventListener('click', handleRightTabClick);
    });

    // --- Export Listener ---
    if (exportBtn) exportBtn.addEventListener('click', exportCanvas);

    // --- VIDEO UPLOAD LISTENER ---
    document.addEventListener('sidebar:loaded', bindVideoUploadHandlers);

    // **NEW LISTENER TO DISPLAY VIDEO**
    document.addEventListener('video:apply', function(e) {
        const url = e.detail && e.detail.url;
        if (url && typeof applyVideoToCanvas === 'function') {
            applyVideoToCanvas(url);
        } else {
            console.error('applyVideoToCanvas not defined or video URL missing.');
        }
    });

    // --- ON-CANVAS MEDIA CONTROL LISTENERS (Play/Pause & Delete) ---
    const canvasPlayPauseBtn = document.getElementById('canvas-play-pause-btn');
    if (canvasPlayPauseBtn) {
        canvasPlayPauseBtn.addEventListener('click', toggleMediaPlayback);
    }

    const canvasDeleteBtn = document.getElementById('canvas-delete-btn');
    if (canvasDeleteBtn) {
        canvasDeleteBtn.addEventListener('click', () => {
            if (!selectedNode || !selectedNode.getAttr('isMedia')) return;

            const mediaType = selectedNode.getAttr && selectedNode.getAttr('mediaType');
            const mediaElement = mediaType === 'video' ? selectedNode.videoElement : selectedNode.audioElement;

            // 1. Stop & clear HTML element
            if (mediaElement) {
                mediaElement.pause();
                mediaElement.removeAttribute('src');
                mediaElement.load();
            }

            // 2. Clear Konva Transformer handles
            // Assuming the active Transformer is named 'transformer' (not imageTransformer)
            if (transformer) {
                transformer.nodes([]);
                layer.draw();
            }

            // 3. Remove Konva node
            selectedNode.destroy();
            selectedNode = null;

            // 4. Hide HTML Floating Controls
            updateFloatingControls(null);
            layer.draw();
            saveState();
        });
    }

    // --- Post Listener ---
    if (postBtn) postBtn.addEventListener('click', simulatePost);

    // --- Drag and Drop Setup ---
    if (container) {
        container.addEventListener('dragover', function (e) {
            e.preventDefault();
            if (mockup) mockup.style.boxShadow = '0 0 0 5px #05eafa, 0 10px 30px rgba(0, 0, 0, 0.5)';
        });

        container.addEventListener('dragleave', function (e) {
            if (mockup) mockup.style.boxShadow = '0 0 0 5px #000, 0 10px 30px rgba(0, 0, 0, 0.5)';
        });

        container.addEventListener('drop', function (e) {
            e.preventDefault();
            if (mockup) mockup.style.boxShadow = '0 0 0 5px #000, 0 10px 30px rgba(0, 0, 0, 0.5)';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = new Image();
                        img.onload = function() {
                            loadAndSetupImage(img);
                            saveState();
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                } else if (file.type.startsWith('video/')) {
                    const videoURL = URL.createObjectURL(file);
                    applyVideoToCanvas(videoURL);
                } else if (file.type.startsWith('audio/')) {
                    const audioURL = URL.createObjectURL(file);
                    applyAudioToCanvas(audioURL, file.name);
                } else {
                    alert('Unsupported file type dropped.');
                }
            }
        });
    }
}

function bindVideoUploadHandlers() {
    const uploadVideoBtn = document.getElementById('upload-video-btn');
    const videoInput = document.getElementById('video-input');

    if (uploadVideoBtn && videoInput) {
        uploadVideoBtn.addEventListener('click', () => {
            videoInput.click();
        });

        videoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const videoURL = URL.createObjectURL(file);
                document.dispatchEvent(
                    new CustomEvent('video:apply', { detail: { url: videoURL } })
                );
                e.target.value = null;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initEditor);

function initEditor() {
    // Injected listener to apply templates from sidebar
    document.addEventListener('template:apply', function(e) {
        const url = e.detail && e.detail.url;
        if (!url) return;
        console.log('Editor received template request for:', url);
        if (typeof loadTemplateFromURL === 'function') {
            loadTemplateFromURL(url);
        } else {
            console.error('loadTemplateFromURL not defined.');
        }
    });

    // --- Konva Initialization ---
    function initKonva(width, height) {
        container = document.getElementById('editor-canvas-container'); // Must match the ID in editor.html
        if (!container) {
            console.error("Konva canvas container 'editor-canvas-container' not found. Stage failed to initialize.");
            return;
        }

        stage = new Konva.Stage({
            container: 'editor-canvas-container',
            width: width,
            height: height,
            draggable: true
        });

        layer = new Konva.Layer();
        stage.add(layer);

        transformer = new Konva.Transformer();
        layer.add(transformer);

        addTextToCanvas('Welcome to Twin Clouds Editor!', 30, '#FFFFFF', 30, 100);
        saveState();

        stage.on('click tap', function (e) {
            if (e.target === stage || !e.target.hasName('editable-shape')) {
                deselectShape();
            }
        });
    }

    // DOM ELEMENT REFERENCES
    // Assign to global variables declared earlier
    mockup = document.querySelector('.device-mockup');
    presetSizeSelect = document.getElementById('preset-size');
    mediaUploadInput = document.getElementById('media-upload');
    uploadBtn = document.getElementById('upload-btn');
    opacitySlider = document.getElementById('opacity-slider');
    opacityValueSpan = document.getElementById('opacity-value');
    colorPicker = document.getElementById('color-picker');
    colorHexInput = document.getElementById('color-hex-input');
    fontFamilySelect = document.getElementById('font-family-select');
    shadowToggle = document.getElementById('shadow-toggle');
    animationSelect = document.getElementById('animation-select');
    undoBtn = document.getElementById('undo-btn');
    redoBtn = document.getElementById('redo-btn');
    exportBtn = document.querySelector('.btn-export');
    postBtn = document.querySelector('.btn-post');

    // --- Core Initialization ---
    initKonva(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    setupEventListeners();

    // =========================================================
    // 2. ADDITIONAL GLOBAL FUNCTIONS FOR EXTERNAL USE
    // =========================================================

    window.addTextToCanvas = addTextToCanvas;
    window.addEmojiToCanvas = addEmojiToCanvas;
    window.addRectangleToCanvas = addRectangleToCanvas;
    window.loadTemplate = loadTemplate;
    window.deleteSelectedShape = deleteSelectedShape;
    window.duplicateSelectedShape = duplicateSelectedShape;
    window.toggleTextBold = toggleTextBold;
    window.toggleTextItalic = toggleTextItalic;
    window.increaseFontSize = increaseFontSize;
    window.decreaseFontSize = decreaseFontSize;
    window.exportCanvas = exportCanvas;
    window.resizeCanvas = resizeCanvas;
    // ✅ PATCH 3 FIX: Replaced with an empty function to prevent a ReferenceError crash
    window.updateShadow = function () {};
    window.loadState = loadState;
    window.toggleMediaPlayback = toggleMediaPlayback;
    window.applyAudioToCanvas = applyAudioToCanvas;
    window.applyVideoToCanvas = applyVideoToCanvas;
    window.initEditor = initEditor;
    window.loadTemplateFromURL = loadTemplateFromURL;
}

const TemplatesSidebar = (function () {
    const basePath = '/assets/templates/';

  const carouselFiles = [
    'carousel1.png',
    'carousel2.png',
    'carousel3.png',
    'carousel4.png'
  ];

  const carouselMockup = 'carousel_mockup.jpg';

  const generalFiles = [
    'event_promo_2.jpg',
    'product_announcement.jpg',
    'quote_graphic.jpg'
  ];

  const videoFiles = [];

  function mkThumbItem(filename, label) {
    const btn = document.createElement('button');
    btn.className = 'template-thumb';
    btn.type = 'button';
    btn.setAttribute('aria-label', label || filename);
    btn.tabIndex = 0;

    const img = document.createElement('img');
    img.alt = label || filename;
    img.src = basePath + filename;
    btn.appendChild(img);

    const lbl = document.createElement('div');
    lbl.className = 'thumb-label';
    lbl.textContent = label || filename;
    btn.appendChild(lbl);

    const dispatchApplyEvent = () => {
      document.dispatchEvent(
        new CustomEvent('template:apply', {
          detail: { url: basePath + filename }
        })
      );
    };

    btn.addEventListener('click', dispatchApplyEvent);

    btn.addEventListener('keyup', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        dispatchApplyEvent();
      }
    });

    return btn;
  }

  function init() {
    const templatesSection = document.querySelector('#templates-section');

    const mainPreview = templatesSection.querySelector('.carousel-main-preview');
    if (mainPreview) {
      mainPreview.src = basePath + carouselMockup;
    }

    const thumbsCarousel = templatesSection.querySelector('.thumbnails-carousel');
    if (thumbsCarousel) {
      carouselFiles.forEach((f, idx) => {
        thumbsCarousel.appendChild(mkThumbItem(f, `Carousel ${idx + 1}`));
      });
    }

    const thumbsGeneral = templatesSection.querySelector('.thumbnails-general');
    if (thumbsGeneral) {
      generalFiles.forEach((f, idx) => {
        thumbsGeneral.appendChild(mkThumbItem(f, `General ${idx + 1}`));
      });
    }

    const thumbsVideo = templatesSection.querySelector('.thumbnails-video');
    if (thumbsVideo) {
      videoFiles.forEach((f, idx) => {
        thumbsVideo.appendChild(mkThumbItem(f, `Video ${idx + 1}`));
      });
    }

    document.addEventListener('templates:open', () => {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.dispatchEvent(new CustomEvent('sidebar:loaded'));
  }

    return {
        init: init
    };
})();

// =========================================================
// MERGED: TEMPLATE SELECTION AND EDITOR OPEN LOGIC
// =========================================================

function setupTemplateSelection() {
    const templateCards = document.querySelectorAll('.template-card');
    const editorApp = document.getElementById('editor-app');

    templateCards.forEach(card => {
        const useButton = card.querySelector('.btn-template-use');
        const templateImage = card.querySelector('img');
        const templateURL = templateImage ? templateImage.src : null;

        if (useButton) {
            useButton.addEventListener('click', (e) => {
                e.preventDefault();

                if (editorApp) {
                    editorApp.style.display = 'flex';
                }

                if (window.initEditor && !editorApp.hasAttribute('data-initialized')) {
                    window.initEditor();
                    TemplatesSidebar.init();
                    editorApp.setAttribute('data-initialized', 'true');
                }

                if (window.loadTemplateFromURL && templateURL) {
                    window.loadTemplateFromURL(templateURL);
                }

                document.body.classList.add('editor-active');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', setupTemplateSelection);

const closeBtn = document.getElementById('close-editor-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        const editorApp = document.getElementById('editor-app');
        if (editorApp) {
            editorApp.style.display = 'none';
        }
        document.body.classList.remove('editor-active');
    });
}
