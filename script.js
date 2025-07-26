document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements we need to interact with
    const stitchesInput = document.getElementById('stitchesInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');
    const resultY_span = document.getElementById('resultY');
    const resultZ_span = document.getElementById('resultZ');
    const finalMessage_p = document.getElementById('finalMessage');
    const inclineContainer = document.getElementById('inclineContainer');
    const inclineMessage = document.getElementById('inclineMessage');

    /**
     * Performs the calculation based on the user's input.
     */
    function performCalculation() {
        // Get the value from the input and convert it to a whole number
        const x = parseInt(stitchesInput.value, 10);

        // Validate the input. If it's not a number or less than 1, show an alert.
        if (isNaN(x) || x < 1) {
            alert('Please enter a valid number of stitches (1 or more).');
            resultsDiv.classList.add('hidden'); // Hide previous results
            return;
        }

        // --- Start of Calculations ---

        // 1. X - 1 = Y
        const y = x - 1;

        // 2. Y / 18 = Z (rounded up)
        // Math.ceil() always rounds a number up to the next largest integer.
        const z = Math.ceil(y / 18);

        // 3. Z * 18 + 1 = A
        const a = z * 18 + 1;

        // --- End of Calculations ---

        // Display the results on the page
        resultY_span.textContent = y;
        resultZ_span.textContent = z;
        finalMessage_p.textContent = `You need to go from ${y} to ${a}.`;

        // Make the results section visible
        resultsDiv.classList.remove('hidden');

        // --- Start of Second Calculation (B and C) ---
        const b = a - y;

        // Only calculate and show the incline if there are stitches to increase (b > 0)
        // and we started with stitches (y > 0).
        if (b > 0 && y > 0) {
            // Y / B = C. Math.round() handles the rounding rule you specified:
            // it rounds to the nearest integer (e.g., 2.5 -> 3, 2.49 -> 2).
            const c = Math.round(y / b);
            inclineMessage.textContent = `Make an INC every ${c} ST.`;
            inclineContainer.classList.remove('hidden');
        } else {
            // Hide the incline message if it's not applicable for this calculation
            inclineContainer.classList.add('hidden');
        }
    }

    // Run the calculation when the button is clicked
    calculateBtn.addEventListener('click', performCalculation);

    // Also run the calculation if the user presses 'Enter' in the input field
    stitchesInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performCalculation();
        }
    });
});