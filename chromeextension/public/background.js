console.log("background.js loaded");

// Warm-up AI backend
async function warmUpAI() {
    try {
        await fetch("http://localhost:9000/checkScore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jd: "Warm-up job description",
                resumeText: "Warm-up resume text"
            })
        });
        console.log("Backend AI warmed up");
    } catch (err) {
        console.error("Warm-up failed:", err.message);
    }
}



// Utility: Get resume from Chrome storage

function getResume() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("resume", (data) => {
            if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
            resolve(data.resume || {}); // Always return an object
        });
    });
}


// Listener for messages from content.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CHECK_SCORE") {
        // Trigger warm-up immediately when service worker loads
warmUpAI();
        callApi(message.jd, sendResponse); // async call
        return true; // Keep message channel open for async
    }

    if (message.type === "GET_SCORE_DETAILS") {
        chrome.storage.local.get("lastAnalysis", (data) => {
            sendResponse(data.lastAnalysis || "No analysis found");
        });
        return true; // Needed for async storage.get
    }

    // Unknown message type
    sendResponse({ err: "Unknown message type" });
});


// Async function to call backend API

async function callApi(jd, sendResponse) {
    try {
        const resume = await getResume();

        // Validate resume
        if (!resume?.resumeText) {
            sendResponse({ err: "Upload Resume First" });
            return;
        }

        const resumeText = resume.resumeText.trim();
        if (!resumeText) {
            sendResponse({ err: "Resume is empty" });
            return;
        }

        console.log("Using cached resume text");

        // Call backend API
        let apiResponse;
        try {
            apiResponse = await fetch("http://localhost:9000/checkScore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jd, resumeText }),
            });
        } catch (fetchError) {
            console.error("Fetch failed:", fetchError.message);
            sendResponse({ err: "Failed to connect to backend" });
            return;
        }

        let result;
        // Handle non-OK responses
        if (!apiResponse.ok) {
            try {
                result = await apiResponse.json();
            } catch {
                result = { message: apiResponse.statusText || "Backend error" };
            }

            console.error("Backend error status:", apiResponse.status);
            console.error("Backend error body:", JSON.stringify(result, null, 2));
            sendResponse({ err: result.error || result.err || result.message || "Backend error" });
            return;
        }

        // Parse JSON if OK
        try {
            result = await apiResponse.json();
        } catch {
            sendResponse({ err: "Invalid JSON from backend" });
            return;
        }

        console.log("Response from backend:", result);

        // Save analysis to chrome storage safely
        await new Promise((res) => chrome.storage.local.set({ lastAnalysis: result }, res));

        // Send result back to content.js
        sendResponse(result);

    } catch (error) {
        console.error("callApi error:", error.message);
        sendResponse({ err: "Something went wrong" });
    }
}