const API_URL = "https://newsapi.org/v2/everything?q=tesla&from=2024-11-22&sortBy=publishedAt&apiKey=d312e4848d4d4965aab3445d5a1c159d";

const DAILY_FREE_LIMIT = 2; // Free cards limit
const PAID_KEY = "isPaid"; // Key to track if user paid
const DAILY_CARD_KEY = "dailyCardCount"; // Key to track daily card count

document.getElementById("fetch-news").addEventListener("click", async () => {
    const isPaid = getPaidStatus();
    const cardCount = getDailyCardCount();

    // If the user has hit their daily limit and has not paid, show the payment modal
    if (!isPaid && cardCount >= DAILY_FREE_LIMIT) {
        showPaymentModal();
        return;
    }

    // Display loading message
    const container = document.getElementById("news-container");
    container.innerHTML = "Loading...";

    try {
        // Fetch fresh news articles
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status === "ok" && data.articles.length > 0) {
            container.innerHTML = ""; // Clear previous content

            // Determine whether to show free cards (up to DAILY_FREE_LIMIT) or all cards if paid
            const articlesToShow = isPaid ? data.articles : data.articles.slice(0, DAILY_FREE_LIMIT);

            // Create and display cards
            articlesToShow.forEach((article) => {
                const card = document.createElement("div");
                card.className = "card";

                const imgSrc = article.urlToImage || "placeholder.jpg";
                const headline = article.title || "No Title";
                const description = article.description || "No Description";
                const sourceName = article.source.name || "Unknown Source";
                const sourceURL = article.source.url || "#";

                card.innerHTML = `
                    <img src="${imgSrc}" alt="News Image" />
                    <h2>${headline}</h2>
                    <p>${description}</p>
                    <div class="actions">
                        <button class="share-button" onclick="shareToWhatsApp('${article.url}')">WhatsApp</button>
                        <button class="download-button" onclick="downloadCard('${headline}', '${imgSrc}')">Download</button>
                    </div>
                    <div class="source">
                        <p>Source: <a href="${sourceURL}" target="_blank">${sourceName}</a></p>
                    </div>
                `;
                container.appendChild(card);
            });

            // Increment the card count only if not paid
            if (!isPaid) {
                incrementDailyCardCount();
            }
        } else {
            container.innerHTML = "No articles found.";
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        container.innerHTML = "Failed to fetch news. Please try again later.";
    }
});

// Get the user's paid status from localStorage
function getPaidStatus() {
    return localStorage.getItem(PAID_KEY) === "true";
}

// Set the user's paid status
function setPaidStatus(status) {
    localStorage.setItem(PAID_KEY, status);
}

// Get the count of cards displayed today
function getDailyCardCount() {
    const data = JSON.parse(localStorage.getItem(DAILY_CARD_KEY) || "{}");
    const today = new Date().toDateString();

    // Reset card count if it's a new day
    if (data.date !== today) {
        localStorage.setItem(DAILY_CARD_KEY, JSON.stringify({ count: 0, date: today }));
        return 0;
    }

    return data.count;
}

// Increment the daily card count
function incrementDailyCardCount() {
    const data = JSON.parse(localStorage.getItem(DAILY_CARD_KEY) || "{}");
    const today = new Date().toDateString();

    if (data.date !== today) {
        localStorage.setItem(DAILY_CARD_KEY, JSON.stringify({ count: 1, date: today }));
    } else {
        data.count++;
        localStorage.setItem(DAILY_CARD_KEY, JSON.stringify(data));
    }
}

// Show the payment modal
function showPaymentModal() {
    document.getElementById("payment-modal").style.display = "block";
}

document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "none";
});

// Handle payment action
document.getElementById("pay-button").addEventListener("click", () => {
    // Simulate a payment request and response
    const paymentSuccessful = simulatePaymentProcess();

    // Show the payment status
    if (paymentSuccessful) {
        setPaidStatus(true); // Set status to paid
        showPaymentStatusMessage("Payment Successful!");
        document.getElementById("payment-modal").style.display = "none"; // Close payment modal
        document.getElementById("fetch-news").click(); // Automatically fetch news after payment
    } else {
        showPaymentStatusMessage("Payment Failed. Try Again!");
    }
});

// Simulate payment process (this can be replaced with actual payment API if needed)
function simulatePaymentProcess() {
    const success = Math.random() > 0.2; // 80% success rate
    return success;
}

// Display payment status message
function showPaymentStatusMessage(message) {
    const statusMessage = document.getElementById("status-message");
    const paymentStatus = document.getElementById("payment-status");

    statusMessage.textContent = message;
    paymentStatus.style.display = "block"; // Show payment status message

    // Hide the message after 3 seconds
    setTimeout(() => {
        paymentStatus.style.display = "none";
    }, 3000);
}

document.getElementById("dismiss-status").addEventListener("click", () => {
    document.getElementById("payment-status").style.display = "none";
});

// Sharing function
function shareToWhatsApp(link) {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(link)}`;
    window.open(url, "_blank");
}

// Card download function
function downloadCard(title, imgSrc) {
    const link = document.createElement("a");
    link.href = imgSrc;
    link.download = `${title}.jpg`;
    link.click();
}
