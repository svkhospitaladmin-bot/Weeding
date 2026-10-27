const menuButton = document.querySelector('.menu-toggle');
const openingVideo = document.querySelector('#opening-video');
const playOpening = document.querySelector('#play-opening');
playOpening.addEventListener('click', async () => {
  try {
    document.querySelector('#video-status').textContent = 'व्हिडिओ सुरू होत आहे…';
    await openingVideo.play();
    document.querySelector('#video-status').textContent = '';
  } catch {
    playOpening.hidden = true;
    document.querySelector('#video-status').textContent = 'व्हिडिओ सुरू करण्यासाठी प्ले बटणावर टॅप करा.';
  }
});
openingVideo.addEventListener('play', () => { playOpening.hidden = true; });
openingVideo.addEventListener('ended', () => { playOpening.hidden = false; });
openingVideo.addEventListener('error', () => {
  playOpening.hidden = true;
  document.querySelector('#video-status').textContent = 'व्हिडिओ पुन्हा पाहण्यासाठी पान रीफ्रेश करा.';
});
const invitationVideos = [...document.querySelectorAll('video')];
const engagementVideo = document.querySelector('#engagement-video');
const playEngagement = document.querySelector('#play-engagement');
playEngagement.addEventListener('click', async () => {
  try {
    document.querySelector('#engagement-status').textContent = 'व्हिडिओ सुरू होत आहे…';
    await engagementVideo.play();
    document.querySelector('#engagement-status').textContent = '';
  } catch {
    playEngagement.hidden = true;
    document.querySelector('#engagement-status').textContent = 'व्हिडिओ सुरू करण्यासाठी प्ले बटणावर टॅप करा.';
  }
});
engagementVideo.addEventListener('play', () => { playEngagement.hidden = true; });
engagementVideo.addEventListener('ended', () => { playEngagement.hidden = false; });
engagementVideo.addEventListener('error', () => {
  playEngagement.hidden = true;
  document.querySelector('#engagement-status').textContent = 'व्हिडिओ पुन्हा पाहण्यासाठी पान रीफ्रेश करा.';
});
invitationVideos.forEach(video => video.addEventListener('play', () => {
  invitationVideos.forEach(other => { if (other !== video) other.pause(); });
}));
const videoVisibility = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
}, { threshold: 0.05 });
invitationVideos.forEach(video => videoVisibility.observe(video));
const menu = document.querySelector('#mobile-menu');
menuButton.addEventListener('click', () => {
  const opened = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!opened));
  menuButton.setAttribute('aria-label', opened ? 'कार्यक्रम मेनू उघडा' : 'कार्यक्रम मेनू बंद करा');
  menu.hidden = opened;
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'कार्यक्रम मेनू उघडा');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  }
});
const sectionLinks = [...document.querySelectorAll('[data-section]')];
let activeSection = '';
const updateActiveSection = () => {
  const focus = window.innerHeight * .42;
  let selected = '';
  document.querySelectorAll('[data-event]').forEach(section => {
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= focus && bounds.bottom > focus) selected = section.id;
  });
  if (selected === activeSection) return;
  activeSection = selected;
  sectionLinks.forEach(link => {
    if (link.dataset.section === selected) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
};
let scrollPending = false;
window.addEventListener('scroll', () => {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(() => { updateActiveSection(); scrollPending = false; });
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();
document.querySelector('#share-invitation').addEventListener('click', async () => {
  const status = document.querySelector('#share-status');
  const url = new URL(location.href);
  url.hash = '';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'ऋतांशु आणि किरण · सस्नेह निमंत्रण', text: 'आमच्या विवाहसोहळ्यात आपण सहकुटुंब सहभागी व्हावे. १३–१६ डिसेंबर २०२६.', url: url.href });
      status.textContent = '';
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url.href);
      status.textContent = 'आमंत्रणाची लिंक कॉपी झाली.';
    } else {
      status.textContent = 'आमंत्रणाची लिंक: ' + url.href;
    }
  } catch (error) {
    if (error.name !== 'AbortError') status.textContent = 'कृपया ब्राउझरमधील लिंक कॉपी करून शेअर करा.';
  }
});
