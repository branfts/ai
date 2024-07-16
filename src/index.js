import './styles.css'

document.addEventListener("DOMContentLoaded", function () {
    const countdownElement = document.querySelector('.countdown')
    const metaRefreshContent = document.querySelector('meta[http-equiv="refresh"]').getAttribute('content')
    const seconds = parseInt(metaRefreshContent.match(/\d+/)[0]) // Extract and parse seconds

    const targetDate = new Date()
    targetDate.setSeconds(targetDate.getSeconds() + seconds)  // Set countdown for parsed seconds

    function updateCountdown() {
        const now = new Date()
        const timeLeft = targetDate - now
        if (timeLeft <= 0) {
            countdownElement.textContent = 'Time is up!'
            return
        }

        const secondsRemaining = Math.floor(timeLeft / 1000)
        countdownElement.textContent = `${secondsRemaining}s`
    }

    // Initial update
    updateCountdown()
    // Update every second
    setInterval(updateCountdown, 1000)
})