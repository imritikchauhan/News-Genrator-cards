chrome.storage.local.get(["shortenedHeadline", "body", "image", "source"], (data) => {
    const { shortenedHeadline, body, image, source } = data;

    // Create a canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    // Add a background color
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1080, 1080);

    // Draw the image if available
    const img = new Image();
    img.src = image;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, 1080, 500);

        // Add headline text
        ctx.fillStyle = "#000";
        ctx.font = "36px Arial";
        ctx.fillText(shortenedHeadline, 20, 550, 1040);

        // Add body text
        ctx.font = "24px Arial";
        ctx.fillText(body.slice(0, 200) + "...", 20, 600, 1040);

        // Add source text
        ctx.font = "20px Arial";
        ctx.fillStyle = "#777";
        ctx.fillText(`Source: ${source}`, 20, 1050, 1040);

        // Allow download
        const link = document.createElement("a");
        link.download = "news-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };
});
