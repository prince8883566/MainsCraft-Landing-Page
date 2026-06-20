// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
}

// ========== SMOOTH SCROLL FOR SAME-PAGE ANCHORS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== SCROLL REVEAL ANIMATIONS ==========
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .section-header, .cta-box, .hero-content, .page-hero-content, .why-card, .value-card, .team-card, .info-card, .story-content, .story-visual, .contact-form-wrapper, .faq-item, .submission-card, .submissions-header').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ========== FORM VALIDATION & LOCALSTORAGE (JavaScript) ==========
// Task 3: Validate all fields, save to LocalStorage, display on Submissions page
function validateForm() {
    let name = document.forms["contactForm"]["name"].value.trim();
    let email = document.forms["contactForm"]["email"].value.trim();
    let message = document.forms["contactForm"]["message"].value.trim();

    // Ensure no empty fields
    if (!name || !email || !message) {
        showToast("All fields are required!", "error");
        return false;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showToast("Please enter a valid email address!", "error");
        return false;
    }

    // Save to LocalStorage
    let submissions = JSON.parse(localStorage.getItem("contacts")) || [];
    submissions.push({
        name,
        email,
        message,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem("contacts", JSON.stringify(submissions));

    // Show success toast
    showToast("Form submitted successfully! View your submission on the Submissions page.", "success");
    document.forms["contactForm"].reset();
    return false; // Prevent actual form submission since there's no backend
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ========== SUBMISSIONS PAGE LOGIC ==========
(function loadSubmissions() {
    const submissionsList = document.getElementById('submissions-list');
    const submissionsCount = document.getElementById('submissions-count');
    const clearBtn = document.getElementById('clear-submissions');

    if (!submissionsList) return; // Not on submissions page

    function renderSubmissions() {
        const submissions = JSON.parse(localStorage.getItem('contacts')) || [];

        if (submissionsCount) {
            submissionsCount.textContent = submissions.length;
        }

        if (submissions.length === 0) {
            submissionsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fas fa-inbox"></i></div>
                    <h3>No Submissions Yet</h3>
                    <p>Submissions from the contact form will appear here.</p>
                    <a href="contact.html" class="btn btn-primary"><i class="fas fa-paper-plane"></i> Go to Contact Form</a>
                </div>
            `;
            return;
        }

        submissionsList.innerHTML = submissions.map((s, index) => `
            <div class="submission-card reveal revealed" style="animation-delay: ${index * 0.08}s">
                <div class="submission-number">#${index + 1}</div>
                <div class="submission-details">
                    <div class="submission-field">
                        <i class="fas fa-user"></i>
                        <div>
                            <span class="field-label">Name</span>
                            <span class="field-value">${escapeHTML(s.name)}</span>
                        </div>
                    </div>
                    <div class="submission-field">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <span class="field-label">Email</span>
                            <span class="field-value">${escapeHTML(s.email)}</span>
                        </div>
                    </div>
                    <div class="submission-field">
                        <i class="fas fa-comment-dots"></i>
                        <div>
                            <span class="field-label">Message</span>
                            <span class="field-value">${escapeHTML(s.message)}</span>
                        </div>
                    </div>
                </div>
                <div class="submission-time">
                    <i class="fas fa-clock"></i> ${s.timestamp || 'N/A'}
                </div>
            </div>
        `).join('');
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all submissions?')) {
                localStorage.removeItem('contacts');
                renderSubmissions();
                showToast('All submissions cleared!', 'success');
            }
        });
    }

    renderSubmissions();
})();

// ========== FAQ ACCORDION ==========
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        // Close all
        document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
        // Toggle current
        if (!isActive) {
            item.classList.add('active');
        }
    });
});
