const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle', 'nav-menu')


const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    if (navMenu) navMenu.classList.remove('show')
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
sr.reveal('.skills__data, .work__img, .contact__input', { interval: 200 });


const renderProjects = (projectList, container) => {
    container.innerHTML = '';

    projectList.forEach((project) => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <img src="${project.image}" alt="${project.title}">
          <div class="card-content">
            <div class="card-header">
              <h4 class="card-title">${project.title}</h4>
              ${project.github ? `
                <a href="${project.github}" target="_blank" class="github-button" title="Ver en GitHub">
                  <i class="bi bi-github"></i>
                </a>` : ''}
            </div>
            <p class="card-description">${project.description}</p>
            <div class="card-tech">
              ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
          </div>
        `;

        container.appendChild(card);
    });
};

fetch('./assets/data/data.json')
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar el archivo JSON');
        return response.json();
    })
    .then(projects => {
        const gameContainer = document.getElementById('gamesContainer');
        const webAppContainer = document.getElementById('webAppContainer');
        const erpContainer = document.getElementById('erpContainer');

        const gameProjects = projects.filter(p => p.type === 'game');
        const webApps = projects.filter(p => p.type === 'web-app');
        const erpApps = projects.filter(p => p.type === 'erp');

        if (gameContainer) renderProjects(gameProjects, gameContainer);
        if (webAppContainer) renderProjects(webApps, webAppContainer);
        if (erpContainer) renderProjects(erpApps, erpContainer);
    })
    .catch(error => console.error('Hubo un problema al cargar los proyectos:', error));


const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        emailInput.focus();
        return;
    }

    const recipient = 'mjuliantor@gmail.com';
    const subject = 'Contacto desde portfolio';
    const body = `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`;

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    contactForm.reset();
});