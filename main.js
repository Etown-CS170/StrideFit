"usestrict";

// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Handle 'Connect with Strava' button click
    const connectStravaButton = document.getElementById('connect-strava');
    connectStravaButton.addEventListener('click', () => {
        // Simulate Strava connection
        alert('Redirecting to Strava for authentication...');
        // In a real application, redirect to Strava OAuth page
    });

    // Handle form submission
    const planForm = document.getElementById('plan-form');
    const planOutput = document.getElementById('plan-output');

    planForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fitnessLevel = document.getElementById('fitness-level').value;
        const goal = document.getElementById('goal').value;

        // Simulate plan creation
        const plan = generatePlan(fitnessLevel, goal);

        // Display the plan
        planOutput.innerHTML = `
            <h3>Your Custom Plan</h3>
            <p><strong>Fitness Level:</strong> ${capitalizeFirstLetter(fitnessLevel)}</p>
            <p><strong>Goal:</strong> ${goal}</p>
            <p>${plan}</p>
        `;

        // Reset the form
        planForm.reset();
    });

    function generatePlan(fitnessLevel, goal) {
        let planDetails = '';

        if (fitnessLevel === 'beginner') {
            planDetails = 'Start with short, easy runs and gradually increase your distance over 12 weeks.';
        } else if (fitnessLevel === 'intermediate') {
            planDetails = 'Incorporate interval training and tempo runs to improve speed and endurance.';
        } else if (fitnessLevel === 'advanced') {
            planDetails = 'Focus on advanced techniques like hill repeats and long-distance runs.';
        }

        return `Based on your fitness level and goal to "${goal}", we recommend the following plan: ${planDetails}`;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
