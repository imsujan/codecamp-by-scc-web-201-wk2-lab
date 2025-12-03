/**
 * Event Explorer Panel (Act A)
 *
 * Goal: Visualize how events flow through the DOM tree
 * - See event bubbling in action
 * - Understand event.target vs event.currentTarget
 * - Compare direct listeners vs delegated listeners
 * - Experience stopPropagation() effect
 *
 * Follow the lab instructions (Act A) step-by-step to implement this.
 */

// TODO: Step 1 - Grab the panel container
// Use document.querySelector to find #event-panel
// Throw an error if it's not found (helps catch typos early)
// const eventPanel = document.querySelector<HTMLElement>('#event-panel')
// if (!eventPanel) throw new Error('#event-panel not found')
// Note: We check for null here because querySelector can return null.
//       Later, after injecting HTML with innerHTML, we can use ! (non-null assertion)
//       because we know those elements exist.

const eventPanel = document.querySelector<HTMLElement>("#event-panel");
if (!eventPanel) throw new Error("#event-panel not found");

// TODO: Step 2 - Inject the Event Explorer markup
// Use innerHTML to add the HTML structure (see lab instructions)
// Why innerHTML? For static markup injected once, it's simpler than createElement.
// We use innerHTML because the HTML is static and we're not dealing with user input.
// Include:
//   - Header with title and description
//   - Mode toggle (direct vs delegated listeners)
//   - stopPropagation checkbox
//   - Nested boxes (outer → middle → inner)
//   - Event log section (with aria-live="polite" for screen readers)
//   - Event quiz section


eventPanel.innerHTML = `
  <section class="event-lab">
    <header>
      <h2>Event Explorer</h2>
      <p>Click inside the boxes and watch the event log.</p>
    </header>

    <div class="modes">
      <label><input type="radio" name="mode" value="direct" checked> Direct listeners</label>
      <label><input type="radio" name="mode" value="delegated"> Delegated listener</label>
      <label><input type="checkbox" id="stop-prop"> stopPropagation on inner</label>
    </div>

    <div class="boxes" id="box-root">
      <div class="box outer" data-name="outer">
        outer
        <div class="box middle" data-name="middle">
          middle
          <button class="box inner" data-name="inner">inner (button)</button>
        </div>
      </div>
    </div>

    <section class="log">
      <h3>Event log</h3>
      <ol id="event-log" aria-live="polite"></ol>
    </section>
       <section class="event-quiz">
      <h3>Predict the log</h3>
      <p>Select a scenario, write your prediction, then run it.</p>
      <ol>
        <li>Direct mode, click <code>inner</code>, stopPropagation OFF.</li>
        <li>Direct mode, click <code>inner</code>, stopPropagation ON.</li>
        <li>Delegated mode, click <code>middle</code>, stopPropagation OFF.</li>
        <li>Delegated mode, click <code>outer</code>.</li>
      </ol>
    </section>

  </section>`;

// TODO: Step 3 - Set up logging helper
// Create a function that appends log entries to #event-log
// Use prepend() to show newest entries first
// Format: [mode] handler=label, target=name, currentTarget=name

const boxRoot = document.querySelector<HTMLElement>("#box-root")!;
const eventLog = document.querySelector<HTMLOListElement>("#event-log")!;
const stopPropCheckbox =
  document.querySelector<HTMLInputElement>("#stop-prop")!;
const modeInputs =
  document.querySelectorAll<HTMLInputElement>('input[name="mode"]');



function log(message: string) {
const li = document.createElement("li");
li.textContent = message;
eventLog.prepend(li); // newest first
}

// TODO: Step 4 - Implement direct listeners mode
// Attach click listeners directly to .outer, .middle, .inner
// In each handler, log:
//   - Handler label (which element)
//   - event.target (where the click actually happened)
//   - event.currentTarget (which element's handler is running)
// Handle stopPropagation checkbox: if checked and handler is "inner", call event.stopPropagation()

function setupDirectListeners() {
  log("--- switched to direct listeners ---");

  const outer = boxRoot.querySelector<HTMLElement>(".outer")!;
  const middle = boxRoot.querySelector<HTMLElement>(".middle")!;
  const inner = boxRoot.querySelector<HTMLElement>(".inner")!;

  function handler(label: string) {
    return (event: MouseEvent) => {
      if (stopPropCheckbox.checked && label === "inner") {
        event.stopPropagation();
      }
      const t = event.target as HTMLElement | null;
      const c = event.currentTarget as HTMLElement | null;
      log(
        `[direct] handler=${label}, target=${t?.dataset.name}, currentTarget=${c?.dataset.name}`
      );
    };
  }

  outer.addEventListener("click", handler("outer"));
  middle.addEventListener("click", handler("middle"));
  inner.addEventListener("click", handler("inner"));

  cleanup = () => {
    outer.replaceWith(outer.cloneNode(true));
    middle.replaceWith(middle.cloneNode(true));
    inner.replaceWith(inner.cloneNode(true));
  };
}

// TODO: Step 5 - Implement delegated listener mode
// Attach ONE click listener to #box-root (the parent)
// Use event.target and closest('.box') to find which box was clicked
// Log the same info but note it's coming from the delegated handler
// This is the pattern you'll use for menus, tables, tag lists, etc.
function setupDelegatedListener() {
  log("--- switched to delegated listener ---");

  function delegatedHandler(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    const box = target?.closest<HTMLElement>(".box");
    if (!box) return;

    const name = box.dataset.name ?? "unknown";
    if (stopPropCheckbox.checked && name === "inner") {
      event.stopPropagation();
    }

    log(
      `[delegated] handler=box-root, target=${target?.dataset.name}, closestBox=${name}`
    );
  }

  boxRoot.addEventListener("click", delegatedHandler);

  cleanup = () => {
    boxRoot.removeEventListener("click", delegatedHandler);
  };
}


// TODO: Step 6 - Wire up mode switching
// Listen for changes on the radio buttons (name="mode")
// When mode changes:
//   1. Clean up old listeners (call cleanup function if it exists)
//      Note: For direct listeners, cleanup clones nodes (removes listeners).
//            For delegated listeners, cleanup uses removeEventListener.
//      After cleanup, setupDirectListeners/setupDelegatedListener will re-query
//      elements, so stale references aren't an issue.
//   2. Set up new listeners based on selected mode
//   3. Log a separator line to show the switch
modeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (!input.checked) return;
    if (cleanup) cleanup(); // Remove old listeners
    // After cleanup, setup functions will re-query elements, so fresh references
    if (input.value === "direct") {
      setupDirectListeners();
    } else {
      setupDelegatedListener();
    }
  });
});

// initial mode
setupDirectListeners();


// TODO: Step 7 (Optional but powerful) - Show event phase
// Extend handlers to log event.eventPhase (1=capture, 2=target, 3=bubble)
// Also log event.composedPath() to see the full DOM path
// This really helps you understand how events flow through the DOM tree!
// Consider making this required - it's very educational.

// TODO: Step 8 - Add tag list delegation example (Drill B)
// Option A: Add tag list HTML in Step 2 (in the main markup)
// Option B: Add it separately here as a new section
// Either way works! Include:
//   - <ul id="tag-list"> with <li> items (each with data-tag attribute)
//   - <p id="tag-output"> to show which tag was clicked
// Use ONE delegated listener on the <ul>
// When a tag is clicked, use event.target and closest('li') to find the clicked tag
// Show the tag name in the output element
// This demonstrates real-world delegation pattern (menus, tables, dynamic lists)

export { } // Make this a module

