"use strict";

// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission
    const planForm = document.getElementById('plan-form');
    const planOutput = document.getElementById('plan-output');
    const loadingPopup = document.getElementById('loading-popup');

    planForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Show the loading popup
        loadingPopup.style.display = 'flex';

        const fitnessLevel = document.getElementById('fitness-level').value;
        const goal = document.getElementById('goal').value;

        // Generate plan using the LM Studio API
        generatePlan(fitnessLevel, goal).then(plan => {
            // Hide the loading popup
            loadingPopup.style.display = 'none';

            if (plan) {
                // Sanitize and display the plan as HTML
                const sanitizedPlan = sanitizeHTML(plan);

                planOutput.innerHTML = `
                    <h3>Your Custom Plan</h3>
                    <p><strong>Fitness Level:</strong> ${capitalizeFirstLetter(fitnessLevel)}</p>
                    <p><strong>Goal:</strong> ${goal}</p>
                    ${sanitizedPlan}
                `;
            } else {
                planOutput.innerHTML = `<p>There was an error generating your plan. Please try again later.</p>`;
            }

            // Reset the form
            planForm.reset();
        }).catch((error) => {
            // Hide the loading popup
            loadingPopup.style.display = 'none';

            planOutput.innerHTML = `<p>There was an error generating your plan. Please try again later.</p>`;
            console.error('Error generating plan:', error);
        });
    });

    async function generatePlan(fitnessLevel, goal) {
        const apiUrl = 'http://127.0.0.1:1234/v1/chat/completions';
        const modelId = 'llama-3.2-3b-instruct'; // Replace with your model ID

        const headers = {
            'Content-Type': 'application/json',
        };

        const body = JSON.stringify({
            model: modelId,
            messages: [
                { role: 'system', content: 'You are a running coach who creates custom training plans.' },
                { role: 'user', content: `Create a running plan for a ${fitnessLevel} aiming to achieve "${goal}". Output the response in HTML format ONLY! keeping the response brief with just a schedule.` },
            ],
            temperature: 0.7,
        });

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.choices && data.choices.length > 0) {
                return data.choices[0].message.content;
            } else {
                throw new Error('Unexpected API response format');
            }
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Sanitizes HTML to prevent XSS attacks.
     * @param {string} html - The HTML string to sanitize.
     * @returns {string} - The sanitized HTML string.
     */
    function sanitizeHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Remove script and style elements
        const scripts = doc.querySelectorAll('script, style');
        scripts.forEach(script => script.remove());

        // Remove all on* event attributes
        const elements = doc.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
            const attrs = elements[i].attributes;
            for (let j = attrs.length - 1; j >= 0; j--) {
                const attrName = attrs[j].name;
                if (attrName.startsWith('on')) {
                    elements[i].removeAttribute(attrName);
                }
            }
        }

        return doc.body.innerHTML;
    }
});
