/**
 * Modal Lab Panel (Act C)
 *
 * Goal: Build an accessible modal dialog that respects keyboard users
 * - Correct ARIA semantics (role="dialog", aria-modal="true")
 * - Focus moves into modal on open
 * - Focus trap (Tab/Shift+Tab stay inside)
 * - ESC closes and returns focus to trigger
 * - Backdrop click closes modal
 *
 * Follow the lab instructions (Act C) step-by-step to implement this.
 */

// TODO: Step 1 - Grab the panel container
const modalPanel = document.querySelector<HTMLElement>('#modal-panel')
if (!modalPanel) throw new Error('#modal-panel not found')

// TODO: Step 2 - Inject modal markup
// Include:
//   - Header
//   - Two trigger buttons (to test focus restoration)
//   - Backdrop element (dimmed overlay)
//   - Modal dialog with:
//     - role="dialog"
//     - aria-modal="true"
//     - aria-labelledby pointing to modal title
//     - tabindex="-1" (makes it focusable programmatically but removes from tab order)
//     - Title, content, close button, extra button (for focus trap testing)

modalPanel.innerHTML = `
  <section class="modal-lab">
    <header>
      <h2>Modal Lab</h2>
      <p>Open the dialog and try tabbing. ESC closes and focus returns.</p>
    </header>

    <button id="open-modal" class="btn-primary">Open demo modal</button>
    <button id="open-modal-2" class="btn-secondary">Open from here</button>

    <div class="backdrop hidden" id="modal-backdrop"></div>

    <div
      class="modal hidden"
      id="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
    >
       <h3 id="modal-title">Demo modal</h3>
      <p>This is a keyboard-friendly modal. Try Tab, Shift+Tab, and Escape.</p>
      <button id="modal-close">Close</button>
      <button>Extra action</button>
    </div>

  </section>`

// TODO: Step 3 - Add CSS for modal
// Style:
//   - Backdrop: fixed, full screen, semi-transparent
//   - Modal: fixed, centered, max-width, shadow, rounded corners
//   - .hidden class: display: none (for show/hide)

// TODO: Step 4 - Implement openModal function
// Parameters: trigger element (button that opened the modal)
// Steps:
//   1. Store trigger in lastFocused variable (for focus restoration)
//   2. Remove .hidden from backdrop and modal
//   3. Prevent body scroll: document.body.style.overflow = 'hidden'
//   4. Find all focusable elements in modal (getFocusableElements helper)
//   5. Focus first focusable element (or modal itself if none)
const openBtn = document.querySelector<HTMLButtonElement>('#open-modal')!
const openBtn2 = document.querySelector<HTMLButtonElement>('#open-modal-2')!
const modal = document.querySelector<HTMLElement>('#modal')!
const closeBtn = document.querySelector<HTMLButtonElement>('#modal-close')!
const backdrop = document.querySelector<HTMLElement>('#modal-backdrop')!

let lastFocused: Element | null = null

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  )
}

function openModal(trigger: HTMLElement) {
  lastFocused = trigger

  backdrop.classList.remove('hidden')
  modal.classList.remove('hidden')
  document.body.style.overflow = 'hidden'

  const focusables = getFocusableElements(modal)
  ;(focusables[0] ?? modal).focus()
}

// TODO: Step 5 - Implement closeModal function
// Steps:
//   1. Add .hidden to backdrop and modal
//   2. Restore body scroll: document.body.style.overflow = ''
//   3. Return focus to lastFocused element (the trigger button)

function closeModal() {
  backdrop.classList.add('hidden')
  modal.classList.add('hidden')
  document.body.style.overflow = ''

  if (lastFocused instanceof HTMLElement) {
    lastFocused.focus()
  }
}

openBtn.addEventListener('click', () => openModal(openBtn))
openBtn2.addEventListener('click', () => openModal(openBtn2))
closeBtn.addEventListener('click', closeModal)
backdrop.addEventListener('click', closeModal)
modal.addEventListener('keydown', (event: KeyboardEvent) => {
  const key = event.key

  if (key === 'Escape') {
    event.preventDefault()
    closeModal()
    return
  }

  if (key !== 'Tab') return

  const focusables = getFocusableElements(modal)
  if (focusables.length === 0) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const current = document.activeElement as HTMLElement | null

  if (event.shiftKey) {
    // Shift+Tab (backwards)
    if (current === first || !focusables.includes(current!)) {
      event.preventDefault() // Prevent default Tab behavior
      last.focus() // Wrap to last element
    }
  } else {
    // Tab (forwards)
    if (current === last || !focusables.includes(current!)) {
      event.preventDefault() // Prevent default Tab behavior
      first.focus() // Wrap to first element
    }
  }
})

// TODO: Step 8 - Implement focus trap
// Add keydown listener to modal element
// Handle:
//   - ESC key → event.preventDefault(), then closeModal()
//   - Tab key:
//     - Get focusable elements using getFocusableElements(modal)
//     - Find first and last focusable elements
//     - Get current focused element: document.activeElement
//     - If Shift+Tab (backwards):
//       - If on first element OR not in focusables → preventDefault(), focus last
//     - If Tab (forwards):
//       - If on last element OR not in focusables → preventDefault(), focus first
//     - This creates a "trap" - focus can't escape the modal
// Why preventDefault()? Without it, the browser's default Tab behavior would
// move focus outside the modal. We prevent that and manually control focus instead.

// TODO: Step 9 - Create getFocusableElements helper
// Function that finds all focusable elements in a container:
//   - Use querySelectorAll with: 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
//   - Filter out disabled elements: !el.hasAttribute("disabled")
//   - Filter out aria-hidden elements: !el.getAttribute("aria-hidden")
//   - Return Array.from(...) to convert NodeList to Array
// Returns array of HTMLElements
// This helper is used by both openModal (to focus first element) and focus trap (to cycle through)

// TODO: Step 10 - Test accessibility
// - Open modal, try Tab/Shift+Tab (should stay inside)
// - Press ESC (should close and return focus)
// - Open from different buttons (focus should return to correct one)
// - Check with screen reader if possible

export {} // Make this a module
