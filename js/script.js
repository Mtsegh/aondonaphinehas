/* =========================================
     NAV: SCROLL SHADOW + MOBILE MENU
     ========================================= */
const siteNav = document.getElementById('siteNav');
const navLinks = document.getElementById('navLinks');
const navHamburger = document.getElementById('navHamburger');

window.addEventListener('scroll', () => {
    siteNav.classList.toggle('nav-scrolled', window.scrollY > 20);
});

navHamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    navHamburger.classList.toggle('menu-open', isOpen);
    navHamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        navHamburger.classList.remove('menu-open');
        navHamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
    });
});

/* =========================================
     SCROLL REVEAL
     ========================================= */
const revealTargetSelectors = [
    '.hero-content',
    '.hero-visual',
    '.about-text',
    '.about-image-wrap',
    '.service-card',
    '.stack-category',
    '.project-card',
    '.contact-text',
    '.contact-form',
];

revealTargetSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
        el.classList.add('reveal');
    });
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =========================================
     ACTIVE NAV LINK ON SCROLL
     ========================================= */
const sectionIds = ['hero', 'about', 'services', 'stack', 'projects', 'contact'];
const navAnchorLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navAnchorLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${entry.target.id}`;
                    link.style.color = isActive ? 'var(--color-text-primary)' : '';
                });
            }
        });
    },
    { threshold: 0.4 }
);

sectionIds.forEach(id => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
});

/* =========================================
     CONTACT FORM VALIDATION + SUBMIT
     ========================================= */
const contactForm = document.getElementById('contactForm');
const senderNameInput = document.getElementById('senderName');
const senderEmailInput = document.getElementById('senderEmail');
const messageTextInput = document.getElementById('messageText');
const formSubmitButton = document.getElementById('formSubmitButton');
const formSubmitLabel = document.getElementById('formSubmitLabel');
const formSuccessMessage = document.getElementById('formSuccessMessage');

const nameErrorEl = document.getElementById('senderNameError');
const emailErrorEl = document.getElementById('senderEmailError');
const messageErrorEl = document.getElementById('messageTextError');

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearFieldError(inputEl, errorEl) {
    inputEl.classList.remove('input-error');
    errorEl.textContent = '';
}

function showFieldError(inputEl, errorEl, message) {
    inputEl.classList.add('input-error');
    errorEl.textContent = message;
}

function validateAllFields() {
    let isValid = true;

    if (!senderNameInput.value.trim()) {
        showFieldError(senderNameInput, nameErrorEl, 'Please enter your name.');
        isValid = false;
    } else {
        clearFieldError(senderNameInput, nameErrorEl);
    }

    if (!senderEmailInput.value.trim()) {
        showFieldError(senderEmailInput, emailErrorEl, 'Please enter your email.');
        isValid = false;
    } else if (!isValidEmail(senderEmailInput.value.trim())) {
        showFieldError(senderEmailInput, emailErrorEl, 'Please enter a valid email address.');
        isValid = false;
    } else {
        clearFieldError(senderEmailInput, emailErrorEl);
    }

    if (!messageTextInput.value.trim()) {
        showFieldError(messageTextInput, messageErrorEl, 'Please enter a message.');
        isValid = false;
    } else {
        clearFieldError(messageTextInput, messageErrorEl);
    }

    return isValid;
}

[senderNameInput, senderEmailInput, messageTextInput].forEach(input => {
    input.addEventListener('input', () => {
        const errorEl = document.getElementById(`${input.id}Error`);
        clearFieldError(input, errorEl);
        formSuccessMessage.textContent = '';
    });
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formSuccessMessage.textContent = '';

    if (!validateAllFields()) return;

    formSubmitButton.disabled = true;
    formSubmitLabel.textContent = 'Sending…';

    try {
        const response = await fetch('https://formspree.io/f/mrejbylg', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(contactForm)
        });

        if (response.ok) {
            contactForm.reset();
            formSuccessMessage.textContent = "You're on my radar. Expect a reply today.";
            formSuccessMessage.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            formSuccessMessage.textContent = '';
        }, 5000);
        } else {
            formSuccessMessage.style.color = '#f87171';
            formSuccessMessage.textContent = 'Something went wrong. Please try again.';
        }
    } catch (error) {
        formSuccessMessage.style.color = '#f87171';
        formSuccessMessage.textContent = 'Network error. Please try again.';
    } finally {
        formSubmitButton.disabled = false;
        formSubmitLabel.textContent = 'Send Message';
    }
});

/* =========================================
     FOOTER YEAR
     ========================================= */
document.getElementById('footerYear').textContent = new Date().getFullYear();

