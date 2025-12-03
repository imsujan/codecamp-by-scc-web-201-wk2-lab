/**
 * Main entry point for Browser Mechanics Lab
 *
 * This file orchestrates the three lab panels:
 * 1. Event Explorer (Act A)
 * 2. Box Model + Flex Playground (Act B)
 * 3. Modal Lab (Act C)
 *
 * Each panel is implemented in its own module to keep code organized.
 * We import them here so they run when the page loads.
 */

// Import global styles
import './styles.css'

// Import the three panel modules
// TODO: Uncomment these imports as you implement each panel
import './eventExplorer'
import './layoutPlayground'
import './modalLab'

/**
 * Why this structure?
 *
 * - Separation of concerns: Each panel is independent
 * - Easy to debug: You can comment out panels you're not working on
 * - Matches the lab instructions: Act A → Act B → Act C
 *
 * Each module will:
 * 1. Find its panel container (e.g., #event-panel)
 * 2. Inject HTML markup
 * 3. Wire up event listeners
 * 4. Implement the interactive behavior
 */

console.log('🔬 Browser Mechanics Lab loaded')
console.log('📝 TODO: Implement the three panels following lab instructions')

