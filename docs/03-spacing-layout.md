# Spacing and layout

Milo uses a centered, contained desktop workspace rather than stretching controls across wide screens.

## Desktop

- Maximum workspace width: approximately `1304px`
- Writing column: approximately `840px`
- Support column: approximately `448px`
- Column gap: `16px`
- Outer page space: at least `24px` where the viewport allows it

## Responsive behavior

At narrower widths, the writing and support columns stack in normal document flow. Controls retain readable labels and accessible target sizes. The interface does not use visual scaling transforms to simulate responsiveness.

Shared spacing tokens are preferred over one-off margins. Dynamic content should not move primary navigation or progress controls unexpectedly.
