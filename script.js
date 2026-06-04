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

document.querySelectorAll('.feature-card, .section-header, .cta-box, .hero-content, .page-hero-content, .why-card, .value-card, .team-card, .info-card, .story-content, .story-visual, .contact-form-wrapper, .faq-item').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ========== FORM VALIDATION (JavaScript) ==========
// As required by the assignment: Ensure Name and Email are not empty, show alert if missing
function validateForm() {
    let name = document.forms["contactForm"]["name"].value;
    let email = document.forms["contactForm"]["email"].value;

    if (name == "" || email == "") {
        alert("Name and Email must be filled out!");
        return false;
    }

    // If valid, show success message
    alert("Thank you, " + name + "! Your message has been sent successfully. We'll get back to you at " + email + ".");
    document.forms["contactForm"].reset();
    return false; // Prevent actual form submission since there's no backend
}

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
