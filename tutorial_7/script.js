// ============================================
// TUTORIAL 8: STUDENT WORK FILE
// Complete the three library integration examples
// ============================================

import {
    handleAnimationError,
    getRestaurantCoordinates,
    handleMapError,
    handleChartError,
    createRestaurantCards,
    clearExistingMap,
    restaurants,
    clickToLoad
 } from './tutorial-support.js';

// Global variables for your library instances
let myChart = null;
let myMap = null;

// Wait for page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tutorial 8: Student work file ready!');
    
    // Set up your event listeners
    document.querySelector('#load-data-button').addEventListener('click', function(event) {
        clickToLoad(event.target);
    });
    document.querySelector('#chart-button').addEventListener('click', createMyChart);
    document.querySelector('#map-button').addEventListener('click', createMyMap);
    document.querySelector('#animation-button').addEventListener('click', animateMyCards);
});

// ============================================
// EXAMPLE 1: CHART.JS - YOU COMPLETE THIS
// ============================================

function createMyChart() {
    // Step 1: Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        alert('Chart.js not available. Check console.');
        return;
    }

    if (restaurants.length === 0) {
        alert('No data loaded. Click "Load Data" first.');
        return;
    }
    
    // Step 2: Process the restaurant data for charting
    const cuisineCounts = {};
    restaurants.forEach(function(restaurant) {
        const cuisine = restaurant.cuisine;
        cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
    });
    
    // Step 3: Transform counts into Chart.js format using array methods
    const chartLabels = Object.keys(cuisineCounts);
    const chartData = Object.values(cuisineCounts);
    
    console.log('Chart data prepared:', { labels: chartLabels, data: chartData });
    
    try {
        // Step 4: Get canvas and clear existing chart
        const canvas = document.querySelector('#rating-chart');
        const ctx = canvas.getContext('2d');
        
        if (myChart) {
            myChart.destroy();
            myChart = null;
        }
        
        // Step 5: Create the Chart.js chart
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Number of Restaurants',
                    data: chartData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(201, 203, 207, 0.6)',
                        'rgba(255, 99, 71, 0.6)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Restaurant Cuisine Distribution'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Restaurants'
                        },
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
        
        console.log('Chart created successfully!');
        
    } catch (error) {
        handleChartError(error);
    }
}

// ============================================
// EXAMPLE 2: LEAFLET.JS - YOU COMPLETE THIS
// ============================================

function createMyMap() {
    // Step 1: Check if Leaflet is available
    if (typeof L === 'undefined') {
        alert('Leaflet.js not available. Check console.');
        return;
    }

    if (restaurants.length === 0) {
        alert('No data loaded. Click "Load Data" first.');
        return;
    }
    
    try {
        if (myMap) {
            myMap.remove();
            myMap = null;
            window.myMap = null;
        }
        
        // Step 2: Clear existing map
        clearExistingMap();
        
        // Step 3: Create the map
        myMap = L.map('restaurant-map').setView([38.9897, -76.9378], 12);
        window.myMap = myMap;
        
        // Step 4: Add map tiles
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(myMap);
        
        // Step 5: Add markers for restaurants
        restaurants.forEach(function(restaurant, index) {
            const coords = getRestaurantCoordinates(restaurant, index);
            
            const marker = L.marker(coords);
            
            const popupContent = `
                <div>
                    <h3>${restaurant.name}</h3>
                    <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
                    <p><strong>Rating:</strong> ${restaurant.rating}★</p>
                    <p><strong>Neighborhood:</strong> ${restaurant.neighborhood}</p>
                    <p><strong>Price Range:</strong> ${restaurant.priceRange}</p>
                </div>
            `;
            
            marker.bindPopup(popupContent).addTo(myMap);
        });
        
        console.log('Map created successfully!');
        
    } catch (error) {
        handleMapError(error);
    }
}

// ============================================
// EXAMPLE 3: GSAP - YOU COMPLETE THIS
// ============================================

function animateMyCards() {
    // Step 1: Check if GSAP is available
    if (typeof gsap === 'undefined') {
        alert('GSAP not available. Check console.');
        return;
    }

    if (restaurants.length === 0) {
        alert('No data loaded. Click "Load Data" first.');
        return;
    }
    
    try {
        // Step 2: Clear and create cards
        createRestaurantCards();
        
        // Step 3: Create your animation sequence
        gsap.fromTo('.restaurant-card', 
            {
                opacity: 0,
                scale: 0.8,
                y: 30
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.12,
                ease: 'bounce.out'
            }
        );
        
        console.log('Animation created successfully!');
        
    } catch (error) {
        handleAnimationError(error);
    }
}

// ============================================
// DEBUGGING HELPERS (for your console)
// ============================================

function testMyWork() {
    console.log('Testing your implementations...');
    
    if (restaurants.length > 0) {
        console.log('Data loaded:', restaurants.length, 'restaurants');
        
        // Test each function
        console.log('Testing Chart.js...');
        createMyChart();
        
        setTimeout(() => {
            console.log('Testing Leaflet.js...');
            createMyMap();
            
            setTimeout(() => {
                console.log('Testing GSAP...');
                animateMyCards();
            }, 1000);
        }, 1000);
    } else {
        console.log('No restaurant data loaded. Make sure tutorial-support.js is included.');
    }
}

// Call testMyWork() in the console to test all your implementations
window.testMyWork = testMyWork;