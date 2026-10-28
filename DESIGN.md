---
name: OZON × DPD
description: A clear, connected visual system for delivery integration.
colors:
  blue: "#005bff"
  blue-dark: "#0046cf"
  red: "#dc0032"
  ink: "#17212e"
  muted: "#586575"
  paper: "#ffffff"
  ice: "#eef4ff"
  surface: "#f6f8fb"
  line: "#dce3ed"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(52px, 5.25vw, 76px)"
    fontWeight: 750
    lineHeight: 1.09
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(32px, 3.4vw, 46px)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 450
    lineHeight: 1.75
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13px"
    fontWeight: 600
rounded:
  button: "8px"
  compact-surface: "10px"
  shipment: "12px"
  panel: "16px"
spacing:
  compact: "8px"
  control: "16px"
  group: "24px"
  panel: "28px"
  section: "100px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "16px 23px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.blue-dark}"
  button-secondary:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.blue}"
    rounded: "{rounded.button}"
    padding: "16px 23px"
  button-white:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.blue}"
    rounded: "{rounded.button}"
    padding: "16px 23px"
  shipment:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.shipment}"
    padding: "20px"
---

# Design System: OZON × DPD

## Overview

**Creative North Star: "The Connected Route"**

A calm, direct system built around the connection between OZON and DPD. Clear typography and spacious surfaces give technical information a simple, approachable presence. The supplied identity assets and the two brands' colors anchor the system.

Flat surfaces and restrained geometry support a confident, uncluttered interface. Lines represent connections or ordered steps; the interactive shipment example turns the integration into a visible sequence. The language here records the implemented direction; it is not a separate brand approval.

**Key Characteristics:**

- Spacious, flat surfaces with cool tonal separation.
- Dense Manrope headings and readable Russian body copy.
- Blue actions, red brand accents, and explicit connection geometry.
- Small, purposeful movement with reduced-motion support.

## Colors

The palette combines a vivid action blue with a restrained DPD red and cool neutral surfaces. Frontmatter values are normative and map to the identically named CSS custom properties.

### Primary

- **OZON Action Blue:** primary actions, selected panels, connection graphics, and heading emphasis. Its darker companion is the primary button hover state.

### Secondary

- **DPD Signal Red:** DPD signatures, selected symbols, and visible keyboard focus.

### Neutral

- **Deep Ink / Slate Text:** primary reading and supporting labels, respectively.
- **White Paper / Ice Blue / Cool Surface:** the page, highlighted integration panels, and grouped supporting content.
- **Connection Grey:** quiet process rules and dividers where retained by the final stylesheet.

**The Connection Rule.** Use lines to explain a route, relationship, or sequence rather than as repeated decorative separators.

## Typography

**Display Font:** Manrope, sans-serif. **Body Font:** Manrope, sans-serif. Local regular and bold font files supply the implemented weights.

The same geometric family carries both display and utility text. Tight heading tracking creates a compact silhouette; generous paragraph leading keeps the technical explanation readable.

### Hierarchy

- **Display:** the frontmatter role describes the desktop hero. It becomes 60px below 1100px, 48px below 800px, and a 44–66px fluid size below 600px; very wide screens use 80px.
- **Headline:** section headings use the frontmatter role; phone layouts use 34px except the compact closing panel.
- **Title:** the base heading role; feature titles grow to 27px, and the final plan titles use 23px on desktop and phones.
- **Body:** explanatory section text uses the frontmatter role. Important introductory copy uses 24px on desktop and 18px below 800px.
- **Label:** navigation, process labels, captions, and pricing details mostly use 13px. Primary desktop action text uses 14px and weight 700.

## Layout

The centered container caps at 1280px. Its total horizontal allowance is 96px on wide screens, 64px below 1100px, and 40px below 800px. Section padding reduces from the frontmatter section spacing to 70px below 800px and 58px below 600px.

Desktop compositions alternate paired columns and three-step or three-plan rows. Below 600px these become single columns, including the benefit strip. The hero retains paired columns on tablets. Navigation switches to an expandable menu at 800px; tablet and phone menus retain all section destinations and the cabinet link. Below 360px the cabinet shortcut moves entirely into that menu.

## Elevation & Depth

The system uses no box shadows. White, ice, and cool grey surfaces establish depth through tonal contrast and contained padding. The saturated blue panel holds a white shipment surface; this is the strongest layer relationship.

## Shapes

Panels use the panel radius, controls the button radius, compact documents the compact-surface radius, and the shipment the shipment radius from frontmatter. Status dots and step markers are circular. A clipped angular outline inside the blue demonstration panel echoes the connection motif without adding another surface style.

## Components

### Buttons

Confident, compact actions pair a label with an arrow. The primary variant uses action blue; secondary uses ice with blue text; the white variant belongs on blue surfaces. Primary buttons darken and rise 2px on hover, then move down 1px while pressed. All interactive elements receive a 3px red focus outline with 5px offset. Disabled buttons show a waiting cursor and reduced opacity.

### Cards / Containers

Tonal panels group related information without shadows. Pricing panels use 28px desktop padding and 26px phone padding; the middle plan uses the blue treatment. Feature panels use more generous padding and a wider explanatory area. Rounded FAQ containers use native details/summary behavior with a rotating plus marker.

### Navigation

Desktop links are compact, medium-weight text with blue hover feedback. The cabinet shortcut has a cool surface. Menu buttons expose expanded state; the menu closes after a destination is selected or Escape is pressed.

### Shipment Demonstration

Three selectable stages change the order heading, symbol, and status. The interface explicitly labels the content as an example. Pressed state is exposed to assistive technology, and status changes are announced politely. Selection uses a 250ms reveal; section entrances use 650ms, the initial shipment reveal 900ms, and route dots pulse over 2.8s. Reduced motion disables these effects and smooth scrolling.

### Cabinet Preview

A restrained browser frame contains the actual login screenshot. The presentation page has no native editable form; the fields visible in this image are not interface components of this site.

## Do's and Don'ts

### Do:

- **Do** use the supplied identity assets and established blue/red roles.
- **Do** retain visible keyboard focus and reduced-motion behavior.
- **Do** preserve word spacing when removing responsive line breaks.
- **Do** use real service imagery and label illustrative shipment states.

### Don't:

- **Don't** introduce shadows into the established flat surface system without a deliberate design change.
- **Don't** replace the real login preview with a fabricated authenticated dashboard.
- **Don't** present reference-site prices or test conditions as confirmed DPD terms.
