// Handle accept cookies button
document.getElementById("acceptCookies").addEventListener("click", function() {
    alert("Cookies accepted!");
    document.getElementById("cookiesPopup").style.display = "none"; // Close cookies popup
});

// Handle reject cookies button
document.getElementById("rejectCookies").addEventListener("click", function() {
    alert("Cookies rejected!");
    document.getElementById("cookiesPopup").style.display = "none"; // Close cookies popup
});
