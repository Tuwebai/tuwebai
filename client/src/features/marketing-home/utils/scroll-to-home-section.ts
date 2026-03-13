const HOME_SECTION_SCROLL_GAP = 4;
const FALLBACK_HEADER_OFFSET = 96;

function getHeaderOffset() {
  const header = document.querySelector('header');

  if (!(header instanceof HTMLElement)) {
    return FALLBACK_HEADER_OFFSET;
  }

  return Math.ceil(header.getBoundingClientRect().height + HOME_SECTION_SCROLL_GAP);
}

export function scrollToHomeSection(
  target: HTMLElement | string,
  behavior: ScrollBehavior = 'smooth',
) {
  const section =
    typeof target === 'string' ? document.getElementById(target) : target;

  if (!(section instanceof HTMLElement)) {
    return false;
  }

  const top = section.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

  window.scrollTo({
    top: Math.max(top, 0),
    behavior,
  });

  return true;
}
