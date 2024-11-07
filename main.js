"use strict";

// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Handle 'Connect with Strava' button click
    const connectStravaButton = document.getElementById('connect-strava');
    connectStravaButton.addEventListener('click', () => {
        alert('Redirecting to Strava for authentication...');
    });

    // Handle form submission
    const planForm = document.getElementById('plan-form');
    const planOutput = document.getElementById('plan-output');

    planForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fitnessLevel = document.getElementById('fitness-level').value;
        const goal = document.getElementById('goal').value;

        // Generate plan using the LM Studio API
        generatePlan(fitnessLevel, goal).then(plan => {
            if (plan) {
                // Display the plan
                planOutput.innerHTML = `
                    <h3>Your Custom Plan</h3>
                    <p><strong>Fitness Level:</strong> ${capitalizeFirstLetter(fitnessLevel)}</p>
                    <p><strong>Goal:</strong> ${goal}</p>
                    <p>${plan}</p>
                `;
            } else {
                planOutput.innerHTML = `<p>There was an error generating your plan. Please try again later.</p>`;
            }

            // Reset the form
            planForm.reset();
        }).catch((error) => {
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
                { role: 'user', content: `Create a running plan for a ${fitnessLevel} aiming to achieve "${goal}".` },
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
});
