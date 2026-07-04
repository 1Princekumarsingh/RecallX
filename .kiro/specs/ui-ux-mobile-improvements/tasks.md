# Implementation Plan: UI/UX Mobile Improvements

## Overview

This implementation plan transforms the RecallX quiz application into a fully responsive, mobile-optimized experience with enhanced visual design, smooth animations, and comprehensive accessibility features. All changes are **frontend-only** — no backend logic, database schemas, or API contracts will be modified.

The plan is organized into logical phases that allow parallel work on independent components while respecting dependencies between UI layers.

## Tasks

- [x] 1. Setup responsive design system and utilities
  - [x] 1.1 Extend TailwindCSS configuration with design tokens
    - Add custom color palette extensions (success, error, warning, info)
    - Configure animation keyframes and presets (fade-in, slide-in, scale-in)
    - Define custom box shadows (elevated, elevated-hover)
    - Set up responsive typography scale with fluid sizing
    - Configure transition timing utilities (fast, slow, default)
    - _Requirements: 8.1, 8.2, 8.4, 9.8, 13.1, 13.2_

  - [x] 1.2 Create responsive breakpoint utilities and hooks
    - Implement `useMediaQuery` hook for responsive logic
    - Implement `useBreakpoint` hook returning current breakpoint
    - Create `ResponsiveGrid` layout component with configurable columns
    - Create `Container` component with responsive padding and max-width
    - Add viewport size detection utilities
    - _Requirements: 1.1, 1.2, 1.3, 1.8_

  - [x] 1.3 Create global responsive CSS utilities
    - Add touch-target sizing classes (min-height: 44px for mobile)
    - Implement fluid typography CSS custom properties
    - Add utility classes for preventing horizontal scroll
    - Create CSS Grid and Flexbox helper classes
    - Configure reduced motion media query support
    - _Requirements: 1.5, 1.7, 1.8, 9.7, 13.8_

- [ ] 2. Checkpoint - Verify design system setup
  - Ensure all tests pass, ask the user if questions arise.


- [x] 3. Build core reusable UI components
  - [x] 3.1 Create enhanced Button component
    - Implement variant system (primary, secondary, tertiary, danger)
    - Add size variants (sm, md, lg) with mobile touch target sizing
    - Add loading state with spinner and width preservation
    - Add icon support with left/right positioning
    - Implement fullWidth prop for mobile layouts
    - Add hover and active state transitions
    - Ensure disabled state styling and cursor changes
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

  - [x] 3.2 Create enhanced Input component
    - Add label, error, helperText, and success props
    - Implement focus state with primary color ring
    - Add error and success icon indicators
    - Implement character counter for maxLength inputs
    - Add appropriate mobile keyboard type hints
    - Include aria-describedby and aria-invalid support
    - Style error messages with red text and icons
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.7, 6.8_

  - [x] 3.3 Create Card component system
    - Implement base Card with variant support (elevated, outlined, flat)
    - Add padding size variants (sm, md, lg)
    - Add hoverable prop with scale and shadow transitions
    - Add onClick support for interactive cards
    - Implement responsive padding adjustments
    - Ensure accessibility with proper semantic HTML
    - _Requirements: 3.1, 3.2, 3.7_

  - [x] 3.4 Create loading state components
    - Implement Spinner component with size and color variants
    - Create SkeletonLoader with type presets (card, list, text, avatar)
    - Implement pulse animation for skeleton loaders
    - Add aria-live announcements for screen readers
    - _Requirements: 7.1, 7.2, 7.5_

  - [x] 3.5 Create feedback state components
    - Implement EmptyState with icon, title, description, and action
    - Implement ErrorState with retry functionality
    - Add centered layout patterns
    - Include appropriate icons and illustrations
    - _Requirements: 7.3, 7.4_


- [x] 4. Implement enhanced modal and dialog system
  - [x] 4.1 Create enhanced Modal component
    - Implement fade and scale entrance/exit animations (200ms)
    - Add semi-transparent backdrop with click-to-close
    - Implement size variants (sm, md, lg, full)
    - Make full-screen on mobile viewports (<768px)
    - Add close button in header with clear X icon
    - Implement preventClose prop to disable backdrop closing
    - Add aria-modal and role="dialog" for accessibility
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 4.2 Implement focus trap for modals
    - Create useFocusTrap hook for keyboard navigation
    - Trap Tab and Shift+Tab within modal
    - Auto-focus first focusable element on open
    - Restore focus to trigger element on close
    - Support Escape key to close modal
    - _Requirements: 4.7, 10.2_

  - [x] 4.3 Create ConfirmDialog component
    - Implement color-coded confirm button variants
    - Add loading state during async operations
    - Auto-focus cancel button for safety
    - Support custom confirm and cancel text
    - Add message and title props
    - _Requirements: 11.5, 11.6_

- [x] 5. Enhance navigation system
  - [x] 5.1 Create responsive Header component
    - Implement fixed positioning at top (z-index management)
    - Show hamburger menu + title + user icon on mobile
    - Show logo + horizontal nav + user menu on desktop
    - Set responsive heights (56px mobile, 64px desktop)
    - Add smooth background color transition
    - Implement user menu dropdown with click-outside-to-close
    - _Requirements: 2.1, 2.4_

  - [x] 5.2 Create MobileMenu drawer component
    - Implement slide-in animation from left (250ms)
    - Add semi-transparent backdrop overlay
    - Close on backdrop click, Escape key, or navigation
    - Implement smooth slide transition with easing
    - Add navigation items with active state highlighting
    - Trap focus within drawer when open
    - _Requirements: 2.2, 2.3, 2.6, 2.7, 2.8_


  - [x] 5.3 Create DesktopNav component
    - Implement horizontal navigation bar layout
    - Add active link highlighting with underline and color
    - Implement hover states with smooth transitions (150ms)
    - Add keyboard navigation support (Tab, Enter)
    - Ensure proper spacing and alignment
    - _Requirements: 2.4, 2.5, 2.7_

  - [x] 5.4 Implement skip-to-content accessibility links
    - Create skip link that appears on keyboard focus
    - Position absolutely at top with high z-index
    - Style with primary background when focused
    - Link to main content area with id="main-content"
    - Add smooth scroll behavior
    - _Requirements: 10.7_

- [ ] 6. Enhance card-based components
  - [ ] 6.1 Enhance SubjectCard component
    - Implement responsive layout (stacked mobile, horizontal desktop)
    - Add hover elevation effect on desktop only (scale and shadow)
    - Create color-coded completion progress bar (red/yellow/green gradients)
    - Style metadata with icons (chapter count, question count)
    - Make action buttons full-width on mobile
    - Add smooth transitions for all interactive states
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 3.7_

  - [ ] 6.2 Enhance ChapterCard component
    - Implement status badge system with color coding
    - Add NEW (gray), MASTERED (green), REVIEW (blue), ERROR (red), ALMOST_FORGOT (yellow)
    - Display accuracy percentage with visual indicator
    - Show question count with icon
    - Add hover effects on desktop (elevation + scale)
    - Make action buttons responsive and touch-friendly
    - _Requirements: 3.1, 3.5, 3.6, 3.7_

  - [ ] 6.3 Enhance QuestionCard component for import preview
    - Implement alternating background colors for visual separation
    - Add error badge display with red styling
    - Create inline editing mode for editable questions
    - Implement expandable/collapsible for long content
    - Add delete button with confirm dialog
    - Show validation errors clearly below fields
    - _Requirements: 3.1, 3.4, 3.7, 15.3, 15.4, 15.5, 15.6_


- [ ] 7. Checkpoint - Verify component library
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Optimize quiz interface for mobile
  - [ ] 8.1 Enhance quiz question display layout
    - Increase font sizes with generous whitespace
    - Create large tappable option cards with clear borders
    - Implement distinct highlighting for selected options
    - Add smooth color transitions on selection (150ms)
    - Make layout fully responsive (stacked on mobile, grid on desktop)
    - Ensure minimum touch target size (44px) for all options
    - _Requirements: 5.1, 5.2, 5.3, 1.5_

  - [ ] 8.2 Enhance quiz timer display
    - Position timer prominently at top of quiz interface
    - Implement color-coded warnings (green → yellow at 30% → red at 10%)
    - Add smooth color transitions for time warnings
    - Format time display clearly (MM:SS or HH:MM:SS)
    - Make timer responsive (larger on desktop, compact on mobile)
    - _Requirements: 5.5_

  - [ ] 8.3 Implement quiz progress indicators
    - Create progress bar showing answered/total questions
    - Add percentage display with smooth updates
    - Implement horizontal scrollable question palette for mobile
    - Create grid sidebar question palette for desktop
    - Add visual states for answered/unanswered/current questions
    - Ensure touch-friendly palette items (44px minimum)
    - _Requirements: 5.6, 5.7, 5.8_

  - [ ] 8.4 Add answer feedback styling for Practice Mode
    - Style correct answers with green background and border
    - Style incorrect answers with red background and border
    - Add checkmark icon for correct answers
    - Add X icon for incorrect answers
    - Implement smooth color transitions (200ms)
    - Ensure sufficient color contrast for accessibility
    - _Requirements: 5.4, 8.2, 8.3_


- [ ] 9. Implement mobile touch interactions
  - [ ] 9.1 Create swipe gesture handler for quiz navigation
    - Implement useSwipeGesture hook with threshold configuration
    - Track touch start, move, and end positions
    - Calculate swipe delta and direction
    - Trigger onSwipeLeft for next question
    - Trigger onSwipeRight for previous question
    - Add visual feedback during swipe (content slides slightly)
    - Prevent default scroll when threshold met
    - _Requirements: 5.9, 17.1, 17.2_

  - [ ] 9.2 Create long-press handler for context menus
    - Implement useLongPress hook with configurable delay (default 500ms)
    - Show context menu on mobile long-press
    - Cancel long-press on touch move
    - Add visual feedback (scale effect) during press
    - Clear timeout on touch end
    - _Requirements: 17.3_

  - [ ] 9.3 Implement pull-to-refresh gesture
    - Create usePullToRefresh hook with threshold (default 80px)
    - Track pull distance and show refresh indicator
    - Trigger refresh callback when threshold exceeded
    - Animate spinner during refresh operation
    - Hide indicator smoothly after completion
    - Only enable on mobile viewports
    - _Requirements: 17.4_

  - [ ] 9.4 Add touch interaction safety features
    - Implement useDebounceClick hook with 300ms delay
    - Apply debounce to all action buttons
    - Add CSS touch-action: manipulation to prevent pinch-zoom
    - Apply user-select: none to interactive elements
    - Implement tap-outside-to-close for dropdowns and modals
    - _Requirements: 17.5, 17.7, 17.8_

  - [ ] 9.5 Implement haptic feedback utility (progressive enhancement)
    - Create triggerHaptic utility function
    - Define haptic patterns (light, medium, heavy, success, warning, error)
    - Check for navigator.vibrate support
    - Apply light haptic to button clicks
    - Apply success haptic to successful actions
    - Apply error haptic to failed actions
    - _Requirements: 17.6_


- [ ] 10. Implement form validation and feedback UX
  - [ ] 10.1 Create field validation system
    - Implement useFieldValidation hook with validation rules
    - Create validation rule factory (required, minLength, maxLength, pattern)
    - Implement validate-on-blur strategy with touched state
    - Support real-time validation for specific fields
    - Return error state and validation functions
    - _Requirements: 6.2, 6.3_

  - [ ] 10.2 Enhance form submission UX
    - Implement form error scrolling to first invalid field
    - Auto-focus first error field on validation failure
    - Disable submit button during submission
    - Show loading spinner in submit button while processing
    - Display inline validation errors below fields
    - Show success messages after successful submission
    - _Requirements: 6.5, 6.6, 4.8_

  - [ ] 10.3 Add character counters to inputs
    - Display current count / max length below input
    - Update counter in real-time as user types
    - Change color to warning when approaching limit (90%)
    - Change color to error when at/over limit (100%)
    - Show counter only for inputs with maxLength prop
    - _Requirements: 6.7_

- [ ] 11. Create notification toast system
  - [ ] 11.1 Build Toast component
    - Implement toast variants (success, error, warning, info)
    - Add color-coded backgrounds (green, red, yellow, blue)
    - Include appropriate icons for each type
    - Add close button (X icon) on all toasts
    - Implement slide-in animation from top/right (250ms)
    - Add fade-out animation on dismiss
    - _Requirements: 12.1, 12.2, 12.3, 12.8_

  - [ ] 11.2 Create toast management system
    - Implement toast context with queue management
    - Position toasts top-right on desktop, top-center on mobile
    - Stack multiple toasts vertically with spacing
    - Auto-dismiss success toasts after 3 seconds
    - Keep error toasts until manually dismissed
    - Limit maximum visible toasts (e.g., 5)
    - _Requirements: 12.4, 12.5, 12.6, 12.7_


- [ ] 12. Enhance question import interface
  - [ ] 12.1 Improve import preview screen layout
    - Create tabbed navigation for paste text / upload DOCX
    - Add summary banner showing total, valid, and error counts
    - Implement filter buttons (All | Valid | Errors only)
    - Display question cards in scrollable list with alternating colors
    - Position action bar at bottom (Cancel | Save Valid | Save All)
    - Make layout fully responsive (stacked on mobile)
    - _Requirements: 15.1, 15.2_

  - [ ] 12.2 Add inline question editing in preview
    - Enable inline editing for question text with Input component
    - Enable inline editing for all four options
    - Add correct answer dropdown selector
    - Show validation errors in real-time
    - Implement delete button with confirmation dialog
    - Save edited state locally before API submission
    - _Requirements: 15.5, 15.6_

  - [ ] 12.3 Add progress feedback during question save
    - Display loading overlay with spinner during save
    - Show percentage progress if saving many questions
    - Display success toast after successful save
    - Display error toast with details if save fails
    - Redirect to chapter view after 2-second delay on success
    - _Requirements: 15.7, 15.8_

- [ ] 13. Enhance quiz results and review interface
  - [ ] 13.1 Improve results summary display
    - Create large circular progress indicator for score percentage
    - Add color-coded performance badges ("Excellent!", "Good Job!", "Keep Practicing!")
    - Display breakdown cards for correct/wrong/unanswered with color coding
    - Format and display total time taken prominently
    - Add action buttons (Review Answers, Back, Retry Quiz)
    - Make layout fully responsive (stacked on mobile, grid on desktop)
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [ ] 13.2 Enhance answer review interface
    - Display questions sequentially with clear navigation controls
    - Highlight correct answers with green styling
    - Highlight incorrect user answers with red styling
    - Add "Your Answer" and "Correct Answer" badges
    - Implement collapsible accordion for explanations
    - Add Previous/Next buttons with disabled states at boundaries
    - _Requirements: 16.5, 16.6, 16.7, 16.8_


- [ ] 14. Checkpoint - Verify feature components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement animations and transitions
  - [ ] 15.1 Add page transition animations
    - Implement fade-in animation for page loads (200ms)
    - Add smooth content transitions on route changes
    - Ensure animations respect prefers-reduced-motion
    - Apply consistent easing functions (ease-in-out)
    - _Requirements: 9.1, 9.7, 9.8_

  - [ ] 15.2 Add component entrance/exit animations
    - Implement modal fade + scale animations (200ms)
    - Add notification slide-in from top/right (250ms)
    - Create smooth collapse animation for list item deletion (300ms)
    - Add accordion expand/collapse height animations (250ms)
    - Ensure all animations use smooth easing curves
    - _Requirements: 9.2, 9.3, 9.5, 9.6_

  - [ ] 15.3 Add interactive element micro-animations
    - Implement hover scale and color transitions (150ms)
    - Add button press feedback (active state scale down)
    - Create smooth focus ring transitions
    - Add loading spinner spin animations
    - Implement smooth tooltip fade-in/out
    - _Requirements: 9.4, 9.8_

- [ ] 16. Implement comprehensive accessibility features
  - [ ] 16.1 Add ARIA labels and descriptions
    - Add aria-label to all icon-only buttons
    - Implement aria-describedby for form inputs with helper text
    - Add aria-invalid for invalid form fields
    - Implement aria-live regions for dynamic content updates
    - Add role="alert" for error messages
    - Add role="status" for success messages
    - _Requirements: 10.3, 10.4, 4.8_

  - [ ] 16.2 Implement keyboard navigation system
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators to all focusable elements
    - Implement focus trap for modals and drawers
    - Add Escape key support for closing modals and dropdowns
    - Ensure Tab navigation follows logical order
    - Support Enter and Space for button activation
    - _Requirements: 10.2, 10.5, 2.7, 2.8_


  - [ ] 16.3 Ensure semantic HTML structure
    - Use semantic HTML elements (nav, main, section, article, button)
    - Wrap main content in <main id="main-content">
    - Use proper heading hierarchy (h1 > h2 > h3)
    - Use <nav> for navigation sections with aria-label
    - Use <button> for interactive actions (not divs)
    - Ensure landmark regions are properly labeled
    - _Requirements: 10.6_

  - [ ] 16.4 Verify color contrast compliance
    - Audit all text/background combinations against WCAG AA standards
    - Ensure normal text has minimum 4.5:1 contrast ratio
    - Ensure large text has minimum 3:1 contrast ratio
    - Verify interactive element borders have 3:1 contrast
    - Test with high contrast mode
    - Document any contrast issues for resolution
    - _Requirements: 8.2, 8.3_

  - [ ] 16.5 Add descriptive alt text and tooltips
    - Add descriptive alt text to all images
    - Implement tooltip system for icon-only buttons
    - Show tooltips on hover (desktop) and long-press (mobile)
    - Ensure tooltips are accessible via keyboard focus
    - Add aria-label fallbacks where alt text not sufficient
    - _Requirements: 10.1, 11.8_

- [ ] 17. Enhance dashboard statistics visualization
  - [ ] 17.1 Create statistics card components
    - Design large, color-coded statistic cards
    - Add icons representing different statistic types
    - Implement progress rings/bars for completion percentages
    - Add trend indicators (up/down arrows) for comparative data
    - Use color gradients for accuracy (red < 50%, yellow 50-79%, green ≥ 80%)
    - Make cards responsive (1 col mobile, 2 col tablet, 3-4 col desktop)
    - _Requirements: 14.1, 14.2, 14.4, 14.5_

  - [ ] 17.2 Add statistics visualization features
    - Implement animated number counting effect on update
    - Add tooltips with additional context on hover
    - Create visual hierarchy with size and color
    - Add loading skeletons for statistics cards
    - Ensure accessibility with proper labels and descriptions
    - _Requirements: 14.7, 14.8_


- [ ] 18. Optimize performance
  - [ ] 18.1 Implement code-splitting and lazy loading
    - Lazy load route components with React.lazy and Suspense
    - Lazy load heavy components (modals, charts) below the fold
    - Add loading fallbacks for lazy-loaded components
    - Verify bundle size reduction in build output
    - _Requirements: 18.3_

  - [ ] 18.2 Optimize animations and interactions
    - Use CSS transforms instead of positional properties for animations
    - Implement debouncing for search inputs (300ms delay)
    - Use will-change CSS property sparingly for performance
    - Ensure animations run at 60fps on mobile devices
    - Profile animation performance in DevTools
    - _Requirements: 18.2, 18.4, 18.5_

  - [ ] 18.3 Add virtual scrolling for large lists
    - Identify lists with potential for 100+ items (question lists, history)
    - Implement virtual scrolling library or custom solution
    - Test performance with large datasets
    - Ensure smooth scrolling on mobile devices
    - Add loading indicators for virtual scroll boundaries
    - _Requirements: 18.6_

  - [ ] 18.4 Implement React performance optimizations
    - Use React.memo for expensive pure components
    - Implement useMemo for expensive calculations
    - Use useCallback for event handlers passed to child components
    - Verify no unnecessary re-renders with React DevTools Profiler
    - Optimize context value changes to prevent cascading updates
    - _Requirements: 18.7_

  - [ ] 18.5 Optimize images and assets
    - Compress existing images and convert to WebP format
    - Add fallback formats for browser compatibility
    - Implement lazy loading for images below fold
    - Use appropriate image sizes for different viewports
    - Add loading="lazy" to img tags
    - _Requirements: 18.8_

- [ ] 19. Final integration and polish
  - [ ] 19.1 Apply responsive design to all existing pages
    - Audit all pages for responsive layout issues
    - Apply Container and ResponsiveGrid components consistently
    - Ensure touch target sizes meet 44px minimum on mobile
    - Fix any horizontal scrolling issues
    - Test orientation changes (portrait/landscape)
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.7_


  - [ ] 19.2 Verify typography and readability improvements
    - Apply consistent font family (Inter, Roboto, or system fonts)
    - Ensure font size scale is consistent (14px-32px range)
    - Set line-height to 1.5 for body text, 1.2 for headings
    - Verify heading hierarchy is clear and consistent
    - Apply letter-spacing where needed for legibility
    - Increase font sizes 10-15% on mobile viewports
    - _Requirements: 13.1, 13.2, 13.3, 13.5, 13.6, 13.7, 13.8_

  - [ ] 19.3 Verify color scheme consistency
    - Audit all components for consistent color usage
    - Ensure semantic colors applied correctly (success, error, warning, info)
    - Verify status badge colors match design system
    - Check hover and active states use color variations correctly
    - Ensure neutral grays used for borders and disabled states
    - Document final color palette in design system
    - _Requirements: 8.1, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

  - [ ] 19.4 Cross-browser and cross-device testing
    - Test on Chrome, Firefox, Safari, Edge (latest versions)
    - Test on iOS Safari and Chrome
    - Test on Android Chrome
    - Verify all animations and transitions work correctly
    - Check touch interactions on real mobile devices
    - Test with screen readers (VoiceOver, TalkBack, NVDA)
    - Verify keyboard navigation on desktop browsers
    - _Requirements: 1.1, 1.2, 1.3, 9.7, 10.2, 10.4_

  - [ ] 19.5 Performance validation
    - Measure initial page load time on 3G connection (<2 seconds target)
    - Verify interactive elements respond within 100ms
    - Check Lighthouse performance score (target 90+)
    - Profile memory usage and check for leaks
    - Verify smooth 60fps animations on mobile
    - Test with Chrome DevTools mobile throttling
    - _Requirements: 18.1, 18.2_

- [ ] 20. Final checkpoint - Complete verification
  - Ensure all tests pass, ask the user if questions arise.


## Notes

### Task Organization

This implementation plan is structured to allow maximum parallelization while respecting dependencies:

**Wave 0 - Foundation**: Tasks 1.1, 1.2, 1.3 (design system setup) must be completed first as they provide the foundation for all other UI work.

**Wave 1 - Core Components**: Tasks 3.1-3.5, 4.1-4.3 (reusable UI components) can be worked on in parallel after the foundation is complete.

**Wave 2 - Feature Components**: Tasks 5.1-5.4, 6.1-6.3, 8.1-8.4, 9.1-9.5, 10.1-10.3, 11.1-11.2 (feature-specific enhancements) can be parallelized as they're built on top of core components.

**Wave 3 - Advanced Features**: Tasks 12.1-12.3, 13.1-13.2, 15.1-15.3, 16.1-16.5, 17.1-17.2 (specialized features) can be worked on in parallel.

**Wave 4 - Optimization & Polish**: Tasks 18.1-18.5, 19.1-19.5 (performance and final integration) should be done near the end when most features are implemented.

### Testing Strategy

- Visual regression testing should be performed for all component changes
- Accessibility testing with screen readers is critical for WCAG compliance
- Manual testing on real mobile devices is required for touch interactions
- Performance profiling should be done continuously, not just at the end

### Important Constraints

- **No Backend Changes**: This feature is 100% frontend-only. All backend APIs remain unchanged.
- **No Breaking Changes**: Existing functionality must continue to work. Only presentation layer changes.
- **Mobile-First Approach**: Design for mobile screens first, then enhance for larger viewports.
- **Progressive Enhancement**: Features like haptic feedback should gracefully degrade on unsupported devices.
- **Accessibility First**: Accessibility features should be built in from the start, not added later.

### Key Dependencies

- TailwindCSS 3.4.1 already installed and configured
- React 18.2.0 and TypeScript already in use
- React Router DOM 6.21.1 for routing
- TanStack Query 5.17.19 for data fetching (unchanged)

### Implementation Approach

Each task should:
1. Create or enhance components in `frontend/src/components/`
2. Update styling using TailwindCSS utility classes
3. Ensure TypeScript types are properly defined
4. Add appropriate ARIA attributes for accessibility
5. Test responsive behavior at all breakpoints (320px, 768px, 1024px, 1280px)
6. Verify animations respect `prefers-reduced-motion`


## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "1.2", "1.3"]
    },
    {
      "id": 1,
      "tasks": ["3.1", "3.2", "3.3", "3.4", "3.5", "4.1"]
    },
    {
      "id": 2,
      "tasks": ["4.2", "4.3", "5.1", "10.1"]
    },
    {
      "id": 3,
      "tasks": ["5.2", "5.3", "5.4", "6.1", "6.2", "9.1", "9.2", "9.3", "10.2", "11.1"]
    },
    {
      "id": 4,
      "tasks": ["6.3", "8.1", "8.2", "9.4", "9.5", "10.3", "11.2", "15.1", "16.1", "17.1"]
    },
    {
      "id": 5,
      "tasks": ["8.3", "8.4", "12.1", "13.1", "15.2", "16.2", "16.3", "17.2"]
    },
    {
      "id": 6,
      "tasks": ["12.2", "12.3", "13.2", "15.3", "16.4", "16.5", "18.1", "18.2"]
    },
    {
      "id": 7,
      "tasks": ["18.3", "18.4", "18.5", "19.1"]
    },
    {
      "id": 8,
      "tasks": ["19.2", "19.3", "19.4", "19.5"]
    }
  ]
}
```
