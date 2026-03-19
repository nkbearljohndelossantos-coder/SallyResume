// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksList = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

// 1. Navigation Background on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Highlight Active Nav Link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// 2. Mobile Menu Toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isVisible = navLinks.style.display === 'flex';
        if (isVisible) {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.right = '2rem';
            navLinks.style.background = 'rgba(13, 15, 23, 0.95)';
            navLinks.style.padding = '2rem';
            navLinks.style.borderRadius = '12px';
            navLinks.style.border = '1px solid var(--glass-border)';
            navLinks.style.gap = '1.5rem';
        }
    });
}

// 3. Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile menu if open
        if (window.innerWidth <= 768 && navLinks) {
            navLinks.style.display = 'none';
        }

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Adjust offset for fixed header
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// 4. Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: observer.unobserve(entry.target) to animate only once
        }
    });
};

const revealOptions = {
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// 5. Typewriter Effect Logic (Optional Enhancement)
const typeWriterElement = document.querySelector('.typewriter');
if (typeWriterElement) {
    const roles = ['Retail & Customer Service Professional', 'Store Operations Specialist', 'Team Leader', 'Customer Service Representative'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typeWriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            typeWriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing new
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing effect
    setTimeout(type, 1000);
}

// 6. In-Browser CMS Logic
const adminTrigger = document.getElementById('admin-trigger');
const loginModal = document.getElementById('login-modal');
const changePinModal = document.getElementById('change-pin-modal');
const adminBar = document.getElementById('admin-bar');
const editableRegions = document.querySelectorAll('.editable-region');

// Admin Buttons
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const btnSaveContent = document.getElementById('btn-save-content');
const btnChangePinModal = document.getElementById('btn-change-pin-modal');
const btnSavePin = document.getElementById('btn-save-pin');

// Inputs
const pinInput = document.getElementById('pin-input');
const oldPinInput = document.getElementById('old-pin-input');
const newPinInput = document.getElementById('new-pin-input');
const loginError = document.getElementById('login-error');
const pinError = document.getElementById('pin-error');

// Close buttons for modals
document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        if (loginModal) loginModal.style.display = 'none';
        if (changePinModal) changePinModal.style.display = 'none';
        resetModals();
    });
});

function resetModals() {
    if (pinInput) pinInput.value = '';
    if (oldPinInput) oldPinInput.value = '';
    if (newPinInput) newPinInput.value = '';
    if (loginError) loginError.style.display = 'none';
    if (pinError) pinError.style.display = 'none';
}

// Check for saved content on load
document.addEventListener('DOMContentLoaded', () => {
    if (editableRegions) {
        editableRegions.forEach(region => {
            const savedContent = localStorage.getItem('resume_content_v2_' + region.id);
            if (savedContent) {
                region.innerHTML = savedContent;
            }
        });
    }
});

// Admin Login Trigger
if (adminTrigger) {
    adminTrigger.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });
}

// Override removed from here as it's defined below.

// Save Content Logic
if (btnSaveContent) {
    btnSaveContent.addEventListener('click', () => {
        editableRegions.forEach(region => {
            localStorage.setItem('resume_content_v2_' + region.id, region.innerHTML);
        });
        alert('Changes successfully saved! They will persist even if you close the browser.');
    });
}

// Change PIN Modal Trigger
if (btnChangePinModal) {
    btnChangePinModal.addEventListener('click', () => {
        changePinModal.style.display = 'flex';
    });
}

// Save New PIN Logic
if (btnSavePin) {
    btnSavePin.addEventListener('click', () => {
        const currentPin = localStorage.getItem('resume_admin_pin') || '1914';

        if (oldPinInput.value !== currentPin) {
            pinError.style.display = 'block';
            pinError.textContent = 'Current PIN is incorrect.';
            pinError.style.color = '#ef4444';
            return;
        }

        if (newPinInput.value.length < 4) {
            pinError.style.display = 'block';
            pinError.textContent = 'New PIN must be at least 4 characters long.';
            pinError.style.color = '#ef4444';
            return;
        }

        // Success
        localStorage.setItem('resume_admin_pin', newPinInput.value);
        pinError.style.display = 'block';
        pinError.textContent = 'PIN successfully changed!';
        pinError.style.color = '#22c55e'; // Green

        setTimeout(() => {
            changePinModal.style.display = 'none';
            resetModals();
        }, 1500);
    });
}

// 7. Dynamic Addition/Removal of Elements
const adminControls = document.querySelectorAll('.admin-controls');

function toggleAdminControls(show) {
    adminControls.forEach(control => {
        control.style.display = show ? 'block' : 'none';
    });
}

window.addExperienceItem = function () {
    const timeline = document.getElementById('editable-experience');
    const items = timeline.querySelectorAll('.timeline-item');
    if (items.length === 0) return;

    // Clone the first item so we don't copy over heavily modified text from the last item
    const newItem = items[0].cloneNode(true);

    // Clear out the contents for the new item
    const h3 = newItem.querySelector('h3');
    if (h3) h3.textContent = "New Position / Role";

    const span = newItem.querySelector('.timeline-date');
    if (span) span.textContent = "Year | Company Name, Location";

    const ul = newItem.querySelector('ul');
    if (ul) {
        ul.innerHTML = '<li>Enter your responsibilities here.</li>';
    }

    // Insert at the end
    timeline.appendChild(newItem);

    // Ensure the new item is editable if we're in edit mode
    if (document.getElementById('admin-bar').style.display === 'flex') {
        newItem.setAttribute('contenteditable', 'true');
    }
};

window.removeLastExperienceItem = function () {
    const timeline = document.getElementById('editable-experience');
    const items = timeline.querySelectorAll('.timeline-item');
    if (items.length > 1) {
        timeline.removeChild(items[items.length - 1]);
    } else {
        alert("Cannot remove the last item. You can edit it instead.");
    }
};

window.addEducationItem = function () {
    const container = document.getElementById('editable-education-container');
    const items = container.querySelectorAll('.project-card');
    if (items.length === 0) return;

    const newItem = items[0].cloneNode(true);
    const h3 = newItem.querySelector('h3');
    if (h3) h3.textContent = "School Name / Institution";

    const h4 = newItem.querySelector('h4');
    if (h4) h4.textContent = "Degree / Course Name";

    const pTag = newItem.querySelector('p');
    if (pTag) pTag.textContent = "Year - Year";

    container.appendChild(newItem);

    if (document.getElementById('admin-bar').style.display === 'flex') {
        newItem.setAttribute('contenteditable', 'true');
    }
};

window.removeLastEducationItem = function () {
    const container = document.getElementById('editable-education-container');
    const items = container.querySelectorAll('.project-card');
    if (items.length > 1) {
        container.removeChild(items[items.length - 1]);
    } else {
        alert("Cannot remove the last item. You can edit it instead.");
    }
};

window.addLanguageItem = function () {
    const container = document.getElementById('editable-languages');
    if (!container) return;
    const items = container.querySelectorAll('li');
    if (items.length === 0) return;

    const newItem = items[0].cloneNode(true);
    newItem.innerHTML = '<i class="fas fa-check text-secondary" style="color: var(--accent-color);"></i> New Language';

    container.appendChild(newItem);
};

window.removeLastLanguageItem = function () {
    const container = document.getElementById('editable-languages');
    if (!container) return;
    const items = container.querySelectorAll('li');
    if (items.length > 1) {
        container.removeChild(items[items.length - 1]);
    } else {
        alert("Cannot remove the last item.");
    }
}

window.addSkillCategory = function () {
    const container = document.getElementById('editable-skills');
    if (!container) return;
    const items = container.querySelectorAll('.skill-card');
    if (items.length === 0) return;

    const newItem = items[0].cloneNode(true);
    const ul = newItem.querySelector('ul');
    if (ul) {
        ul.innerHTML = '<li><i class="fas fa-check-circle accent" style="margin-right: 10px;"></i> New Skill</li>';
    }
    container.appendChild(newItem);

    if (document.getElementById('admin-bar').style.display === 'flex') {
        newItem.setAttribute('contenteditable', 'true');
    }
}

window.removeLastSkillCategory = function () {
    const container = document.getElementById('editable-skills');
    if (!container) return;
    const items = container.querySelectorAll('.skill-card');
    if (items.length > 1) {
        container.removeChild(items[items.length - 1]);
    } else {
        alert("Cannot remove the last category.");
    }
}

window.addSkillItem = function () {
    const container = document.getElementById('editable-skills');
    if (!container) return;
    const skillCards = container.querySelectorAll('.skill-card');
    if (skillCards.length === 0) return;
    // Add to the LAST skill category
    const lastCard = skillCards[skillCards.length - 1];
    const ul = lastCard.querySelector('ul');
    if (ul) {
        const li = document.createElement('li');
        li.innerHTML = '<i class="fas fa-check-circle accent" style="margin-right: 10px;"></i> New Added Skill';
        ul.appendChild(li);
    }
}

window.removeLastSkillItem = function () {
    const container = document.getElementById('editable-skills');
    if (!container) return;
    const skillCards = container.querySelectorAll('.skill-card');
    if (skillCards.length === 0) return;

    // Remove from the LAST skill category
    const lastCard = skillCards[skillCards.length - 1];
    const ul = lastCard.querySelector('ul');
    if (ul) {
        const items = ul.querySelectorAll('li');
        if (items.length > 1) {
            ul.removeChild(items[items.length - 1]);
        } else {
            alert("Cannot remove the last bullet point in this category.");
        }
    }
}

// Override Login/Logout specifically for Add/Remove buttons display
if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        const currentPin = localStorage.getItem('resume_admin_pin') || '1914';
        if (pinInput.value === currentPin) {
            loginModal.style.display = 'none';
            adminBar.style.display = 'flex';
            toggleAdminControls(true);
            editableRegions.forEach(el => el.setAttribute('contenteditable', 'true'));
            resetModals();
        } else {
            loginError.style.display = 'block';
        }
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        adminBar.style.display = 'none';
        toggleAdminControls(false);
        editableRegions.forEach(el => el.setAttribute('contenteditable', 'false'));
    });
}
