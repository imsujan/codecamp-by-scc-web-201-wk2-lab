/**
 * Box Model + Flex Playground Panel (Act B)
 *
 * Goal: Feel the CSS box model and Flexbox as layout physics you can control
 * - See how padding/margin/border affect total size
 * - Understand content-box vs border-box
 * - Control Flexbox properties and see immediate layout changes
 * - Complete layout "poses" (challenges)
 *
 * Follow the lab instructions (Act B) step-by-step to implement this.
 */

// TODO: Step 1 - Grab the panel container
const layoutPanel = document.querySelector<HTMLElement>('#layout-panel')
if (!layoutPanel) throw new Error('#layout-panel not found')

// TODO: Step 2 - Inject Box Model section markup
// Include:
//   - Header
//   - Controls: sliders for padding, margin, border width
//   - Dropdown for box-sizing (content-box vs border-box)
//     Note: Set border-box as default (selected) - it's more common in modern CSS
//   - Demo box element
//   - Metrics display (content width/height, total width/height)
//   - Optional: Add a "target" hint for Drill A (see instructions)

layoutPanel.innerHTML = `
  <section class="layout-lab">
    <header>
      <h2>Box Model + Flex Playground</h2>
      <p>Adjust padding, margin, border, box-sizing and see the actual box.</p>
    </header>

    <section class="box-model">
      <h3>Box Model</h3>
      <div class="controls">
        <label>Padding <input type="range" id="pad" min="0" max="64" value="16"></label>
        <label>Margin <input type="range" id="mar" min="0" max="64" value="8"></label>
        <label>Border <input type="range" id="bor" min="0" max="16" value="2"></label>
        <label>Box-sizing
          <select id="box-sizing">
            <option value="content-box">content-box</option>
            <option value="border-box" selected>border-box</option>
          </select>
        </label>
         </div>
      <div class="box-wrapper">
        <div class="demo-box" id="demo-box">
          <span>Box</span>
        </div>
      </div>
      <dl class="metrics" aria-live="polite">
        <div><dt>Content width</dt><dd id="content-w">–</dd></div>
        <div><dt>Content height</dt><dd id="content-h">–</dd></div>
        <div><dt>Total width</dt><dd id="total-w">–</dd></div>
        <div><dt>Total height</dt><dd id="total-h">–</dd></div>
      </dl>
      <p class="target">
        Target: total width <strong>240px</strong>, content width
        <strong>160px</strong>.
      </p>
    </section>

  </section>`

// TODO: Step 3 - Add CSS for Box Model visualization
// Style the demo box, controls, and metrics panel
// Use getBoundingClientRect() and getComputedStyle() to calculate actual sizes
const padInput = document.querySelector<HTMLInputElement>("#pad")!;
const marInput = document.querySelector<HTMLInputElement>("#mar")!;
const borInput = document.querySelector<HTMLInputElement>("#bor")!;
const boxSizingSelect =
  document.querySelector<HTMLSelectElement>("#box-sizing")!;
const demoBox = document.querySelector<HTMLElement>("#demo-box")!;

const contentW = document.querySelector<HTMLElement>("#content-w")!;
const contentH = document.querySelector<HTMLElement>("#content-h")!;
const totalW = document.querySelector<HTMLElement>("#total-w")!;
const totalH = document.querySelector<HTMLElement>("#total-h")!;


//Function to Update box Model
function updateBoxModel() {
  const pad = Number(padInput.value);
  const mar = Number(marInput.value);
  const bor = Number(borInput.value);
  const boxSizing = boxSizingSelect.value as "content-box" | "border-box";

    demoBox.style.padding = `${pad}px`;
    demoBox.style.margin = `${mar}px`;
    demoBox.style.borderWidth = `${bor}px`;
    demoBox.style.borderStyle = "solid";
    demoBox.style.borderColor = "#1f2937";
    demoBox.style.boxSizing = boxSizing;

    const rect = demoBox.getBoundingClientRect();
    totalW.textContent = `${Math.round(rect.width)}px`;
    totalH.textContent = `${Math.round(rect.height)}px`;

    const styles = getComputedStyle(demoBox);

    const innerWidth = rect.width - 2 *bor - (paddingLeft + paddingRight);
    const innerHeight = rect.height - 2*bor - (paddingTop + paddingBottom);

    contentW.textContent = `${Math.round(innerWidth)}px`;
    contentH.textContent = `${Math.round(innerHeight)}px`;
}

[padInput, marInput, borInput, boxSizingSelect].forEach((el) => {
el.addEventListener("input", updateBoxModel);
});

updateBoxModel();


// TODO: Step 4 - Wire up Box Model controls
// Listen for 'input' events on all sliders and the box-sizing select
// In updateBoxModel():
//   1. Read current slider/select values
//   2. Apply them to demoBox.style
//   3. Calculate and display metrics:
//      - Total size: use getBoundingClientRect() (returns actual rendered size)
//      - Content size: total - padding - border
//   4. Show the difference between content-box and border-box
// Why getBoundingClientRect()? It returns the actual rendered size including transforms.
// offsetWidth only includes padding/border, not transforms. For accurate visual
// measurements, getBoundingClientRect() is the right choice.

layoutPanel.innerHTML += `
  <section class="flex-lab">
    <h3>Flex Layout</h3>
    <p>Change direction, justification, alignment, and gap. Watch cards move.</p>
    <div class="flex-controls">
      <label>Direction
        <select id="flex-dir">
          <option value="row" selected>row</option>
          <option value="column">column</option>
        </select>
      </label>
      <label>Justify-content
        <select id="flex-justify">
          <option value="flex-start" selected>flex-start</option>
          <option value="center">center</option>
          <option value="space-between">space-between</option>
          <option value="space-around">space-around</option>
        </select>
      </label>
      <label>Align-items
        <select id="flex-align">
          <option value="stretch" selected>stretch</option>
          <option value="flex-start">flex-start</option>
          <option value="center">center</option>
          <option value="flex-end">flex-end</option>
        </select>
      </label>
      <label>Gap
        <input type="range" id="flex-gap" min="0" max="48" value="12">
      </label>
      
        <div class="flex-target" id="flex-target">
      <div class="card">One</div>
      <div class="card">Two</div>
      <div class="card">Three</div>
    </div>

    <ul class="flex-poses">
      <li>Pose 1: three cards in a row, centered horizontally & vertically</li>
      <li>Pose 2: column layout, cards packed at the top with equal gaps</li>
      <li>Pose 3: row layout, first card left, last card right</li>
    </ul>

  </section>`

// TODO: Step 5 - Add Flex Playground section
// Inject markup for:
//   - Flex controls (direction, justify-content, align-items, gap)
//     Note: Set reasonable defaults: row, flex-start, stretch, gap 12px
//   - Flex container with 3 demo cards
//   - List of "poses" (layout challenges) - see instructions for the three poses

const flexDir = document.querySelector<HTMLSelectElement>("#flex-dir")!;
const flexJustify = document.querySelector<HTMLSelectElement>("#flex-justify")!;
const flexAlign = document.querySelector<HTMLSelectElement>("#flex-align")!;
const flexGap = document.querySelector<HTMLInputElement>("#flex-gap")!;
const flexTarget = document.querySelector<HTMLElement>("#flex-target")!;

function updateFlex() {
  flexTarget.style.flexDirection = flexDir.value;
  flexTarget.style.justifyContent = flexJustify.value;
  flexTarget.style.alignItems = flexAlign.value;
  flexTarget.style.gap = `${flexGap.value}px`;
}

[flexDir, flexJustify, flexAlign, flexGap].forEach((el) => {
  el.addEventListener("input", updateFlex);
});

updateFlex();

// TODO: Step 6 - Wire up Flex controls
// Listen for changes on flex direction, justify, align, gap controls
// In updateFlex():
//   1. Read control values
//   2. Apply to flex container's style
//   3. Watch cards move in real-time

// TODO: Step 7 - Complete layout drills
// Try to achieve each "pose" listed in the instructions
// Document your settings in README

export { } // Make this a module

