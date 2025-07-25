
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

    navMenu.classList.remove('show')
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

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', { delay: 400 });
sr.reveal('.home__social-icon', { interval: 200 });
sr.reveal('.skills__data, .work__img, .contact__input', { interval: 200 });

fetch('./assets/data/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        return response.json();
    })
    .then(projects => {
        const gameContainer = document.getElementById('gamesContainer');
        const webAppContainer = document.getElementById('webAppContainer');
        const erpContainer = document.getElementById('erpContainer');

        const renderProjects = (projectList, container) => {
            projectList.forEach(project => {
                const card = document.createElement('div');
                card.classList.add('card');

                card.innerHTML = `
          <img src="${project.image}" alt="${project.title}">
          <div class="card-content">
            <div class="card-header">
              <h4 class="card-title">${project.title}</h4>
              ${project.github ? `
                <a href="${project.github}" target="_blank" class="github-button" title="Ver en GitHub">
                  <i class="bx bxl-github"></i>
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

        const gameProjects = projects.filter(p => p.type === 'game');
        const webApps = projects.filter(p => p.type === 'web-app');
        const erpApps = projects.filter(p => p.type === 'erp');

        renderProjects(gameProjects, gameContainer);
        renderProjects(webApps, webAppContainer);
        renderProjects(erpApps, erpContainer);
    })
    .catch(error => {
        console.error('Hubo un problema al cargar los proyectos:', error);
    });

