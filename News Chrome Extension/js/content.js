// Extract news data from the current page
const headline = document.querySelector("h1")?.innerText || "No headline found";
const body = Array.from(document.querySelectorAll("p"))
    .slice(0, 5)
    .map((p) => p.innerText)
    .join(" ")
    .slice(0, 500); // Limit to 500 characters
const image = document.querySelector("meta[property='og:image']")?.content || "";

// Send the data to the background script
chrome.runtime.sendMessage({
    action: "extract_content",
    data: { headline, body, image, source: window.location.hostname },
});

