const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('show')
            toggle.setAttribute('aria-expanded', String(isOpen))
        })
    }
}
showMenu('nav-toggle', 'nav-menu')

const copyrightYear = document.getElementById('copyright-year')
if (copyrightYear) copyrightYear.textContent = new Date().getFullYear()

const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    const navToggle = document.getElementById('nav-toggle')
    if (navMenu) navMenu.classList.remove('show')
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link')
        } else {
            sectionsClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)


const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
});

sr.reveal('.home__data, .timeline__item, .skills__subtitle, .skills__text', {});
sr.reveal('.home__img, .experience__intro, .skills__img', { delay: 400 });
sr.reveal('.home__social-icon', { interval: 200 });
sr.reveal('.skills__data, .contact__input', { interval: 200 });


const imageViewer = document.getElementById('image-viewer');
const imageViewerImage = document.getElementById('image-viewer-image');
const imageViewerTitle = document.getElementById('image-viewer-title');
const imageViewerClose = document.getElementById('image-viewer-close');
const languageToggle = document.getElementById('language-toggle');
const languageFlag = document.getElementById('language-flag');
const languageName = document.getElementById('language-name');
let currentLanguage = 'es';
let allProjects = [];

if (imageViewer && imageViewerImage && imageViewerTitle && imageViewerClose) {
    imageViewerClose.addEventListener('click', () => imageViewer.close());
    imageViewer.addEventListener('click', (event) => {
        if (event.target === imageViewer) imageViewer.close();
    });
}

let translations = {};

const applyLanguage = (language) => {
    currentLanguage = language;
    const copy = translations[language];

    document.documentElement.lang = language;
    document.title = language === 'en' ? 'Julián Torres - Portfolio' : 'Portfolio de Julián Torres';

    document.querySelectorAll('[data-key]').forEach((element) => {
        const key = element.dataset.key;
        if (!copy[key]) return;
        if (element.dataset.keyHtml === 'true') {
            element.innerHTML = copy[key];
        } else {
            element.textContent = copy[key];
        }
    });

    document.querySelectorAll('[data-key-aria-label]').forEach((element) => {
        const key = element.dataset.keyAriaLabel;
        if (copy[key]) element.setAttribute('aria-label', copy[key]);
    });
    document.querySelectorAll('[data-key-placeholder]').forEach((element) => {
        const key = element.dataset.keyPlaceholder;
        if (copy[key]) element.setAttribute('placeholder', copy[key]);
    });
    document.querySelectorAll('[data-key-alt]').forEach((element) => {
        const key = element.dataset.keyAlt;
        if (copy[key]) element.setAttribute('alt', copy[key]);
    });

    const contactStatus = document.getElementById('contact-status');
    if (contactStatus && contactStatus.textContent) {
        contactStatus.textContent = copy['contact-status'];
    }

    document.querySelectorAll('.contact__input[aria-invalid="true"]').forEach((input) => {
        const error = document.getElementById(`${input.id}-error`);
        if (!error) return;
        const isInvalidEmail = input.type === 'email' && input.value.trim()
            && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        error.textContent = input.value.trim() && isInvalidEmail
            ? copy['email-invalid']
            : copy['contact-required'];
    });

    if (languageToggle) {
        if (languageFlag) {
            languageFlag.src = language === 'es'
                ? './assets/img/flags/us.svg'
                : './assets/img/flags/ar.svg';
        }
        if (languageName) languageName.textContent = language === 'es' ? 'English' : 'Español';
        languageToggle.setAttribute(
            'aria-label',
            language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'
        );
    }

    renderProjectCollections();
};

if (languageToggle) {
    languageToggle.disabled = true;
    languageToggle.addEventListener('click', () => {
        applyLanguage(currentLanguage === 'es' ? 'en' : 'es');
    });
}

const renderProjects = (projectList, container) => {
    container.innerHTML = '';

    projectList.forEach((project) => {
        const card = document.createElement('div');
        card.classList.add('card');
        const projectTitle = currentLanguage === 'en' ? (project.titleEn || project.title) : project.title;
        const projectDescription = currentLanguage === 'en'
            ? (project.descriptionEn || project.description)
            : project.description;
        const labels = currentLanguage === 'en'
            ? { zoom: 'Enlarge image', demo: 'Play demo', github: 'View on GitHub', website: 'Visit website', screenshot: 'project screenshot' }
            : { zoom: 'Ampliar imagen', demo: 'Jugar demo', github: 'Ver en GitHub', website: 'Visitar sitio web', screenshot: 'captura del proyecto' };

        card.innerHTML = `
          <button class="card__image-button" type="button" aria-label="${labels.zoom}: ${projectTitle}">
            <img src="${project.image}" alt="${projectTitle} - ${labels.screenshot}">
            <span class="card__image-hint"><i class="bi bi-zoom-in" aria-hidden="true"></i> ${labels.zoom}</span>
          </button>
          <div class="card-content">
            <div class="card-header">
              <h4 class="card-title">${projectTitle}</h4>
              <div class="card-actions">
                ${project.demo ? `
                  <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="github-button" title="${labels.demo}" aria-label="${labels.demo}: ${projectTitle}">
                    <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                  </a>` : ''}
                ${project.github ? `
                  <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="github-button" title="${labels.github}" aria-label="${labels.github}: ${projectTitle}">
                    <i class="bi bi-github"></i>
                  </a>` : ''}
                ${project.website ? `
                  <a href="${project.website}" target="_blank" rel="noopener noreferrer" class="github-button" title="${labels.website}" aria-label="${labels.website}: ${projectTitle}">
                    <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                  </a>` : ''}
              </div>
            </div>
            <p class="card-description">${projectDescription}</p>
            <div class="card-tech">
              ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
          </div>
        `;

        const imageButton = card.querySelector('.card__image-button');
        imageButton.addEventListener('click', () => {
            if (!imageViewer || !imageViewerImage || !imageViewerTitle) return;

            const image = imageButton.querySelector('img');
            imageViewerImage.src = image.src;
            imageViewerImage.alt = image.alt;
            imageViewerTitle.textContent = projectTitle;
            imageViewer.showModal();
        });

        container.appendChild(card);
    });

    sr.reveal(container.querySelectorAll('.card'), { interval: 200 });
};

const renderProjectCollections = () => {
    if (!allProjects.length) return;
    const containers = {
        game: document.getElementById('gamesContainer'),
        'web-app': document.getElementById('webAppContainer'),
        erp: document.getElementById('erpContainer'),
        website: document.getElementById('websiteContainer')
    };

    Object.entries(containers).forEach(([type, container]) => {
        if (container) renderProjects(allProjects.filter(project => project.type === type), container);
    });
};

fetch('./assets/data/data.json')
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar el archivo JSON');
        return response.json();
    })
    .then(projects => {
        allProjects = projects;
        renderProjectCollections();
    })
    .catch(error => console.error('Hubo un problema al cargar los proyectos:', error));


const contactForm = document.getElementById('contact-form');

if (contactForm) {
    const fields = [
        { input: document.getElementById('name'), error: document.getElementById('name-error') },
        { input: document.getElementById('email'), error: document.getElementById('email-error') },
        { input: document.getElementById('message'), error: document.getElementById('message-error') }
    ];
    const status = document.getElementById('contact-status');
    let submitted = false;

    const getError = (input) => {
        const value = input.value.trim();
        if (!value) return translations[currentLanguage]['contact-required'];
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return translations[currentLanguage]['email-invalid'];
        }
        return '';
    };

    const validateField = ({ input, error }) => {
        const message = getError(input);
        error.textContent = message;
        input.setAttribute('aria-invalid', String(Boolean(message)));
        return !message;
    };

    fields.forEach((field) => {
        field.input.addEventListener('blur', () => validateField(field));
        field.input.addEventListener('input', () => {
            status.textContent = '';
            if (field.error.textContent || submitted) validateField(field);
        });
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitted = true;
        status.textContent = '';

        const isValid = fields.map(validateField).every(Boolean);
        if (!isValid) {
            fields.find(({ input }) => input.getAttribute('aria-invalid') === 'true').input.focus();
            return;
        }

        const [nameField, emailField, messageField] = fields;
        const recipient = 'mjuliantor@gmail.com';
        const copy = translations[currentLanguage];
        const subject = copy['mail-subject'];
        const body = `${copy['mail-name']}: ${nameField.input.value.trim()}\n${copy['mail-email']}: ${emailField.input.value.trim()}\n\n${copy['mail-message']}:\n${messageField.input.value.trim()}`;
        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoUrl;
        status.textContent = copy['contact-status'];
    });
}

fetch('./assets/data/translations.json')
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar el archivo de traducciones');
        return response.json();
    })
    .then(dictionary => {
        translations = dictionary;
        if (languageToggle) languageToggle.disabled = false;
        applyLanguage(currentLanguage);
    })
    .catch(error => console.error('Hubo un problema al cargar las traducciones:', error));