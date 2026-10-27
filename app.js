const i18n = window.invitationI18n;
const menuButton = document.querySelector('.menu-toggle');
const openingVideo = document.querySelector('#opening-video');
const playOpening = document.querySelector('#play-opening');
playOpening.addEventListener('click', async () => {
  try {
    i18n.setStatus('#video-status', 'videoLoading');
    await openingVideo.play();
    i18n.setStatus('#video-status');
  } catch {
    playOpening.hidden = true;
    i18n.setStatus('#video-status', 'videoPlayHint');
  }
});
openingVideo.addEventListener('play', () => { playOpening.hidden = true; });
openingVideo.addEventListener('ended', () => { playOpening.hidden = false; });
openingVideo.addEventListener('error', () => {
  playOpening.hidden = true;
  i18n.setStatus('#video-status', 'videoError');
});
const invitationVideos = [...document.querySelectorAll('video')];
const engagementVideo = document.querySelector('#engagement-video');
const playEngagement = document.querySelector('#play-engagement');
playEngagement.addEventListener('click', async () => {
  try {
    i18n.setStatus('#engagement-status', 'videoLoading');
    await engagementVideo.play();
    i18n.setStatus('#engagement-status');
  } catch {
    playEngagement.hidden = true;
    i18n.setStatus('#engagement-status', 'videoPlayHint');
  }
});
engagementVideo.addEventListener('play', () => { playEngagement.hidden = true; });
engagementVideo.addEventListener('ended', () => { playEngagement.hidden = false; });
engagementVideo.addEventListener('error', () => {
  playEngagement.hidden = true;
  i18n.setStatus('#engagement-status', 'videoError');
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
  i18n.refreshMenuLabel();
  menu.hidden = opened;
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  i18n.refreshMenuLabel();
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    i18n.refreshMenuLabel();
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
document.addEventListener('invitation-language-change', updateActiveSection);
document.querySelector('#share-invitation').addEventListener('click', async () => {
  const url = new URL(location.href);
  url.hash = '';
  url.searchParams.set('lang', i18n.language);
  try {
    if (navigator.share) {
      await navigator.share({ title: i18n.t('shareTitle'), text: i18n.t('shareText'), url: url.href });
      i18n.setStatus('#share-status');
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url.href);
      i18n.setStatus('#share-status', 'linkCopied');
    } else {
      i18n.setStatus('#share-status', 'linkPrefix', url.href);
    }
  } catch (error) {
    if (error.name !== 'AbortError') i18n.setStatus('#share-status', 'copyHint');
  }
});
