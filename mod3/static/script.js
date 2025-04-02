// --- Code Fall Effect ---
const codeSnippets = [
    'console.log("Hello, World!");', 'def hello():', 'print("Hi!")',
    'int main() {', '#include <io>', 'public class Main {', '<html>', '<body>',
    'echo "Hello!";', 'const greet = () => {}', 'let x = 10;', 'if (x > 5)',
    '// Comment', '/* Comment */', '<div class="card">', 'SELECT * FROM users;',
    'try {} catch(e) {}', 'for i in range(n):', 'while (true)', 'namespace App {',
    'import numpy as np', 'using System;', 'class Point:', '#!/bin/bash',
    'const app = express();', 'useEffect(() => {}, []);', 'CREATE TABLE data (',
    'FROM flask import Flask', '.container { }', 'git commit -m "..."'
    // Add or remove snippets as desired
];

function createCodeSnippet(text) {
    const snippet = document.createElement('div');
    snippet.classList.add('code-snippet');
    snippet.textContent = text;
    // Use % for positioning relative to the .code-fall container
    snippet.style.left = Math.random() * 100 + '%';
    snippet.style.animationDuration = 6 + Math.random() * 15 + 's'; // Slightly longer duration range
    snippet.style.opacity = 0.3 + Math.random() * 0.4; // More subtle opacity
    snippet.style.fontSize = 10 + Math.random() * 15 + 'px'; // Smaller font size range
    return snippet;
}

function addCodeSnippets() {
    const codeFallContainer = document.querySelector('.code-fall');
    if (!codeFallContainer) return; // Exit if container not found

    const addSnippet = () => {
        if (document.hidden) return; // Don't add if tab is not visible

        const snippetText = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        const snippetElement = createCodeSnippet(snippetText);
        codeFallContainer.appendChild(snippetElement);

        // Remove the snippet after animation ends
        snippetElement.addEventListener('animationend', () => {
            // Check if the element still exists before trying to remove
            if (codeFallContainer.contains(snippetElement)) {
                 codeFallContainer.removeChild(snippetElement);
            }
        }, { once: true }); // Use once: true for better memory management
    };

    // Add snippets at a slightly reduced interval
    setInterval(addSnippet, 500); // Interval e.g., 500ms
}

// --- Timeline Drag Scrolling ---
const timelineWrapper = document.querySelector('.timeline-wrapper');
if (timelineWrapper) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    timelineWrapper.addEventListener('mousedown', (e) => {
        // Only activate drag for left mouse button
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.pageX - timelineWrapper.offsetLeft;
        scrollLeft = timelineWrapper.scrollLeft;
        timelineWrapper.style.cursor = 'grabbing';
        timelineWrapper.style.userSelect = 'none'; // Prevent text selection while dragging
    });

    timelineWrapper.addEventListener('mouseleave', () => {
        if (isDragging) { // Only reset if dragging was in progress
            isDragging = false;
            timelineWrapper.style.cursor = 'grab';
            timelineWrapper.style.removeProperty('user-select');
        }
    });

    timelineWrapper.addEventListener('mouseup', (e) => {
        // Only deactivate drag for left mouse button
        if (e.button !== 0) return;
        if (isDragging) { // Only reset if dragging was in progress
            isDragging = false;
            timelineWrapper.style.cursor = 'grab';
            timelineWrapper.style.removeProperty('user-select');
        }
    });

    timelineWrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent default drag behavior
        const x = e.pageX - timelineWrapper.offsetLeft;
        const walk = (x - startX) * 2; // Adjust multiplier for scroll speed
        timelineWrapper.scrollLeft = scrollLeft - walk;
    });
}

// --- Timeline Item Expansion ---
function toggleExpand(itemContent) {
    // Check if the clicked element is the content box itself
    if (itemContent.classList.contains('timeline-content')) {
        itemContent.classList.toggle('expanded');
    }
}

// --- Mobile Menu Toggle ---
const mobileMenuButton = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuButton && navMenu) {
    mobileMenuButton.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
        // Toggle aria-expanded attribute for accessibility
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuButton.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when a link is clicked (including resume button inside)
    const navLinksAndButtons = navMenu.querySelectorAll('.nav-link, .nav-resume-button');
    navLinksAndButtons.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuButton.classList.remove('active');
                 mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// --- Active Nav Link Highlighting on Scroll ---
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links .nav-link'); // Select only main nav links for highlighting

// Function to update active links
function updateActiveLink() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY;
    const offset = window.innerHeight * 0.4; // Offset from the top (40% of viewport height)

    sections.forEach(section => {
        const sectionTop = section.offsetTop - offset; // Use offsetTop relative to document
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });

     // Special case for reaching the bottom of the page
     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) { // Check if near bottom
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
             currentSectionId = lastSection.getAttribute('id');
        }
     }

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active-link');
        }
    });
}


// Debounce function to limit scroll event handler calls
function debounce(func, wait = 15, immediate = false) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Attach the debounced scroll handler
window.addEventListener('scroll', debounce(updateActiveLink, 50)); // Update active link on scroll (debounced)
// Initial call to set active link on page load
document.addEventListener('DOMContentLoaded', updateActiveLink);


// --- Footer Current Year ---
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// --- Initialize Code Fall Effect on Load ---
document.addEventListener('DOMContentLoaded', () => {
    addCodeSnippets();
});