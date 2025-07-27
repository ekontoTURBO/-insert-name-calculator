document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements we need to interact with
    const stitchesInput = document.getElementById('stitchesInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');
    const resultY_span = document.getElementById('resultY');
    const resultZ_span = document.getElementById('resultZ');
    const resultE_span = document.getElementById('resultE');
    const resultF_span = document.getElementById('resultF');
    const finalMessage_p = document.getElementById('finalMessage');
    const inclineContainer = document.getElementById('inclineContainer');
    const inclineMessage = document.getElementById('inclineMessage');
    const increaseCountContainer = document.getElementById('increaseCountContainer');
    const increaseCount = document.getElementById('increaseCount');
    const zVariantSelect = document.getElementById('zVariantSelect');

    // Store the latest calculated values for Z, E, F, Y
    let latest = { y: 0, z: 0, e: 0, f: 0 };

    /**
     * Performs the calculation based on the user's input.
     * This is called on calculate and also when switching Z/E/F.
     * @param {string} [variant] - 'Z', 'E', or 'F'. If not provided, uses the select value.
     */
    function performCalculation(variant) {
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
        const z = Math.ceil(y / 18);
        const e = z + 1;
        const f = z + 2;

        // Save for later use
        latest = { y, z, e, f };

        // Show all Z, E, F values
        resultY_span.textContent = y;
        resultZ_span.textContent = z;
        if (resultE_span) resultE_span.textContent = e;
        if (resultF_span) resultF_span.textContent = f;

        // Make the results section visible
        resultsDiv.classList.remove('hidden');

        // Determine which variant to use for further calculations
        let useVariant = variant || (zVariantSelect ? zVariantSelect.value : 'Z');
        let zLike = z;
        if (useVariant === 'E') zLike = e;
        if (useVariant === 'F') zLike = f;

        // 3. Zlike * 18 + 1 = A
        const a = zLike * 18 + 1;
        finalMessage_p.textContent = `You need to go from ${y} to ${a}.`;

        // --- Start of Second Calculation (B and C) ---
        const b = a - y;

        // Only calculate and show the incline if there are stitches to increase (b > 0)
        // and we started with stitches (y > 0).
        if (b > 0 && y > 0) {
            // Y / B = C. Math.round() handles the rounding rule you specified:
            // it rounds to the nearest integer (e.g., 2.5 -> 3, 2.49 -> 2).
            const c = Math.round(y / b);

            increaseCount.textContent = b;
            increaseCountContainer.classList.remove('hidden');

            inclineMessage.textContent = `Make an INC every ${c} ST.`;
            inclineContainer.classList.remove('hidden');
        } else {
            // Hide the incline message if it's not applicable for this calculation
            increaseCountContainer.classList.add('hidden');
            inclineContainer.classList.add('hidden');
        }
    }

    // When the dropdown changes, recalculate using the selected variant
    if (zVariantSelect) {
        zVariantSelect.addEventListener('change', () => {
            // Only recalculate if we have a valid Y (i.e., calculation already done)
            if (latest && latest.y > 0) {
                performCalculation();
            }
        });
    }

    // Run the calculation when the button is clicked
    calculateBtn.addEventListener('click', () => performCalculation());

    // Also run the calculation if the user presses 'Enter' in the input field
    stitchesInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performCalculation();
        }
    });
});