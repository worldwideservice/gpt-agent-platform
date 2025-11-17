# Mobile Optimization

Comprehensive mobile-first design and touch-optimized components.

## Overview

The platform is optimized for mobile devices with:
- **Touch-friendly targets** (minimum 44x44px for iOS, 48x48px for Material)
- **Swipe gestures** for common actions
- **Bottom sheets** for mobile-friendly modals
- **Responsive design** that adapts to all screen sizes
- **Mobile utilities** for device detection and mobile-specific features

## Components

### TouchTarget

Ensures minimum touch target size for accessibility and usability.

```tsx
import { TouchTarget } from '@/components/mobile/touch-target'

export function IconButton() {
  return (
    <TouchTarget size="material">
      <button className="p-2">
        <Icon />
      </button>
    </TouchTarget>
  )
}
```

**Props:**
- `size`: 'ios' (44px), 'material' (48px), or 'auto'
- `responsiveSize`: Smaller on desktop, full size on mobile

**Standards:**
- WCAG 2.5.5 (Level AAA) - Target Size
- Apple HIG: Minimum 44x44pt
- Material Design: Minimum 48x48dp

### Swipeable

Add swipe gesture support to any component.

```tsx
import { Swipeable } from '@/components/mobile/swipeable'

export function Card() {
  return (
    <Swipeable
      onSwipeLeft={() => console.log('Next')}
      onSwipeRight={() => console.log('Previous')}
      threshold={50}
      showFeedback={true}
    >
      <div>Card Content</div>
    </Swipeable>
  )
}
```

**Props:**
- `onSwipeLeft/Right/Up/Down`: Callbacks for swipe directions
- `threshold`: Minimum distance in pixels (default: 50)
- `showFeedback`: Visual feedback during swipe

### SwipeableCard

Card with swipe actions (like iOS Mail).

```tsx
import { SwipeableCard } from '@/components/mobile/swipeable'
import { Trash, Archive } from 'lucide-react'

export function EmailCard() {
  return (
    <SwipeableCard
      leftAction={{
        label: 'Delete',
        icon: <Trash />,
        onClick: () => deleteEmail(),
        color: 'red',
      }}
      rightAction={{
        label: 'Archive',
        icon: <Archive />,
        onClick: () => archiveEmail(),
        color: 'green',
      }}
    >
      <div className="p-4">
        <h3>Email Subject</h3>
        <p>Email preview...</p>
      </div>
    </SwipeableCard>
  )
}
```

### BottomSheet

Mobile-friendly modal that slides up from bottom.

```tsx
import { BottomSheet } from '@/components/mobile/bottom-sheet'

export function MobileModal() {
  const [open, setOpen] = useState(false)

  return (
    <BottomSheet
      open={open}
      onClose={() => setOpen(false)}
      title="Select Option"
      description="Choose from the options below"
      swipeToClose={true}
      snapPoints={[0.5, 0.9]} // 50% and 90% of screen height
      initialSnap={0} // Start at 50%
    >
      <div className="space-y-4">
        <button className="w-full">Option 1</button>
        <button className="w-full">Option 2</button>
        <button className="w-full">Option 3</button>
      </div>
    </BottomSheet>
  )
}
```

**Features:**
- Drag handle for visual affordance
- Swipe down to close
- Multiple snap points (partial/full height)
- Backdrop click to close
- Scroll content independently

## Mobile Utilities

### Device Detection

```tsx
import {
  isMobile,
  isIOS,
  isAndroid,
  isTablet,
  hasTouch,
  getDeviceType,
  isPWA,
} from '@/lib/utils/mobile'

// Detect mobile
if (isMobile()) {
  console.log('Running on mobile')
}

// Detect iOS
if (isIOS()) {
  console.log('Running on iOS')
}

// Detect touch support
if (hasTouch()) {
  console.log('Touch supported')
}

// Get device type
const device = getDeviceType() // 'mobile' | 'tablet' | 'desktop'

// Check if PWA
if (isPWA()) {
  console.log('Running as PWA')
}
```

### Haptic Feedback

```tsx
import { hapticFeedback } from '@/lib/utils/mobile'

// Light tap
hapticFeedback('light')

// Success feedback
hapticFeedback('success')

// Error feedback
hapticFeedback('error')

// Options: 'light', 'medium', 'heavy', 'success', 'warning', 'error'
```

**Support:**
- iOS: Uses Taptic Engine
- Android: Uses Vibration API
- Gracefully degrades on unsupported devices

### Prevent Body Scroll

```tsx
import { preventBodyScroll } from '@/lib/utils/mobile'

// Open modal
preventBodyScroll(true)

// Close modal
preventBodyScroll(false)
```

Prevents background scrolling while modal is open. Preserves scroll position.

### Safe Area Insets

For devices with notches (iPhone X+).

```tsx
import { getSafeAreaInsets, addSafeAreaVariables } from '@/lib/utils/mobile'

// Add CSS variables
useEffect(() => {
  addSafeAreaVariables()
}, [])

// Get insets programmatically
const insets = getSafeAreaInsets()
console.log(insets.top) // Notch height
```

**CSS Usage:**
```css
.header {
  padding-top: var(--sat); /* safe-area-inset-top */
  padding-bottom: var(--sab); /* safe-area-inset-bottom */
}
```

**Tailwind:**
```tsx
className="pt-[var(--sat)] pb-[var(--sab)]"
```

### Orientation Detection

```tsx
import { getOrientation, onOrientationChange } from '@/lib/utils/mobile'

// Get current orientation
const orientation = getOrientation() // 'portrait' | 'landscape'

// Listen for changes
useEffect(() => {
  const cleanup = onOrientationChange((orientation) => {
    console.log('Orientation changed:', orientation)
  })

  return cleanup
}, [])
```

### Viewport Dimensions

Get accurate viewport dimensions excluding browser chrome.

```tsx
import { getViewportDimensions } from '@/lib/utils/mobile'

const { width, height } = getViewportDimensions()
```

### Keyboard Detection (iOS)

```tsx
import { isKeyboardVisible } from '@/lib/utils/mobile'

if (isKeyboardVisible()) {
  console.log('Keyboard is open')
}
```

## Responsive Design

### Breakpoints

```tsx
// Tailwind breakpoints
sm: 640px  // Small devices
md: 768px  // Medium devices (tablets)
lg: 1024px // Large devices (laptops)
xl: 1280px // Extra large devices (desktops)
2xl: 1536px // 2X large devices (large desktops)
```

### Mobile-First Approach

✅ **DO:**
```tsx
<div className="text-sm md:text-base lg:text-lg">
  Mobile first, then scale up
</div>
```

❌ **DON'T:**
```tsx
<div className="text-lg md:text-sm">
  Desktop first
</div>
```

### Responsive Grids

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### Hide/Show on Mobile

```tsx
{/* Show only on mobile */}
<div className="block md:hidden">Mobile only</div>

{/* Hide on mobile */}
<div className="hidden md:block">Desktop only</div>
```

### Responsive Spacing

```tsx
<div className="p-4 md:p-6 lg:p-8">
  {/* Smaller padding on mobile */}
</div>
```

## Touch Interactions

### Touch-Friendly Buttons

```tsx
import { Button } from '@/components/ui/button'

<Button
  size="lg" // Larger on mobile
  className="min-h-[44px] min-w-[44px]" // iOS minimum
>
  Submit
</Button>
```

### Pull to Refresh

```tsx
'use client'

import { useState } from 'react'

export function PullToRefresh({ onRefresh, children }) {
  const [startY, setStartY] = useState(0)
  const [pullDistance, setPullDistance] = useState(0)
  const threshold = 80

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e) => {
    if (startY === 0) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY

    if (distance > 0) {
      setPullDistance(distance)
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > threshold) {
      await onRefresh()
    }

    setStartY(0)
    setPullDistance(0)
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      )}
      {children}
    </div>
  )
}
```

### Long Press

```tsx
'use client'

import { useRef } from 'react'

export function useLongPress(
  onLongPress: () => void,
  duration = 500
) {
  const timerRef = useRef<NodeJS.Timeout>()

  const start = () => {
    timerRef.current = setTimeout(() => {
      hapticFeedback('medium')
      onLongPress()
    }, duration)
  }

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
  }
}

// Usage
function Card() {
  const longPress = useLongPress(() => {
    console.log('Long pressed!')
  })

  return <div {...longPress}>Hold me</div>
}
```

## Performance Optimization

### Lazy Loading Images

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Virtual Scrolling

For long lists on mobile:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualList({ items }) {
  const parentRef = useRef(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  })

  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Reduce Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing on Mobile

### Local Testing

```bash
# Find your local IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux

# Access from mobile device
http://192.168.1.x:3000
```

### Browser DevTools

1. Chrome DevTools → Toggle device toolbar (Cmd+Shift+M)
2. Select device preset or set custom dimensions
3. Test touch events, orientation, viewport

### Real Device Testing

1. Connect device via USB
2. Enable USB debugging (Android) or Web Inspector (iOS)
3. Use Chrome DevTools or Safari Web Inspector for remote debugging

## Best Practices

### Touch Targets

✅ **DO:**
- Minimum 44x44px touch targets
- Adequate spacing between targets (8px+)
- Larger targets for primary actions

❌ **DON'T:**
- Tiny buttons (<40px)
- Crowded clickable areas
- Icon-only buttons without labels (on mobile)

### Gestures

✅ **DO:**
- Support common gestures (swipe, pinch, tap)
- Provide visual feedback
- Allow gesture cancellation

❌ **DON'T:**
- Override native browser gestures
- Require complex multi-touch gestures
- Make gestures the only way to perform actions

### Forms

✅ **DO:**
```tsx
<input
  type="email"
  inputMode="email"
  autoComplete="email"
  autoCapitalize="none"
/>
```

❌ **DON'T:**
```tsx
<input type="text" />
```

### Navigation

✅ **DO:**
- Bottom navigation on mobile
- Hamburger menu when necessary
- Thumb-friendly tap zones

❌ **DON'T:**
- Top-only navigation
- Small menu items
- Nested dropdown menus

## Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Guidelines](https://material.io/design)
- [WCAG Mobile Accessibility](https://www.w3.org/WAI/standards-guidelines/mobile/)
