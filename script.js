function getCookie(name) {
    let cookieName = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

// Function to format the balance to a currency format
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

// Get the balance from the cookie and display it
window.onload = function() {
    let balance = getCookie('finalBalance');
    if (balance) {
        document.getElementById('balance-amount').textContent = formatCurrency(balance);
    }
};