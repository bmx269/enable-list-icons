# Enable List Icons

Easily add icons to List Block items in WordPress.

**Recommended Companion Plugin:** Use the [Icon Block](https://wordpress.org/plugins/icon-block/) plugin to add custom icon sets and expand your icon library options. Icon Block is a powerful companion that allows you to register additional icon libraries for use with Enable List Icons.

## Features

### Icon Selection
- **Icon Library** - Browse and select from a curated collection of WordPress icons
- **Media Library** - Upload and use custom SVG icons from your media library
- **Custom SVG** - Paste custom SVG code directly for complete flexibility

### Icon Positioning
- **Left/Right Placement** - Position icons before or after list item text

### Icon Styling
- **Icon Size** - Adjust icon dimensions with a slider control (supports px, em, rem units)
- **Icon Spacing** - Control the gap between icon and text (supports px, em, rem units)
- **Icon Color** - Choose from theme colors or set a custom color
- **No Fill Option** - Support for stroke-based icons (e.g., Lucide icons)
- **Vertical Alignment** - Align icons relative to text: top, center (default), or bottom

### List Block Default Settings
Set default icon settings at the List block level that apply to all child list items:
- **Global Defaults** - Configure size, spacing, color, position, alignment, and styling once for the entire list
- **Item-Level Overrides** - Individual list items can inherit defaults or use custom settings
- **Nested Support** - Works seamlessly with multiple and nested List blocks

This feature streamlines icon management for large lists by eliminating repetitive configuration while maintaining flexibility for individual items.

### Supported Blocks
- `core/list` - List block (for setting default icon settings)
- `core/list-item` - Standard list items

## Requirements

- WordPress 6.3 or higher
- PHP 7.4 or higher

## Installation

1. Download the plugin zip file
2. Go to **Plugins > Add New** in your WordPress admin
3. Click **Upload Plugin** and select the zip file
4. Activate the plugin

## Usage

### Adding Icons to List Items

1. Add or edit a List block in the block editor
2. Select a list item
3. Click **Add icon** in the block toolbar
4. Choose an icon from the library, upload from media, or paste custom SVG
5. Adjust icon settings in the block sidebar:
   - Toggle icon position (left/right)
   - Set icon size and spacing
   - Choose icon color
   - Set vertical alignment (top, center, bottom)
   - Enable "No icon fill" for stroke-based icons

### Setting List Block Defaults

To apply consistent icon settings across all list items:

1. Select the List block (parent container)
2. Open the block settings sidebar
3. Configure **Default Icon Settings**:
   - Set default icon size
   - Set default icon spacing
   - Choose default icon color
   - Set default icon position (left/right)
   - Set default vertical alignment
   - Enable "No icon fill" for stroke-based icons by default
4. All list items will inherit these settings automatically

### Overriding Defaults for Individual Items

Individual list items can override List block defaults:

1. Select a list item
2. In the block sidebar, locate **Icon Settings**
3. Toggle off **Use default icon settings**
4. Configure custom settings for this specific item

When "Use default icon settings" is enabled (default), the item inherits all settings from the parent List block. When disabled, the item uses its own custom settings.

## Development

```bash
# Install dependencies
npm install

# Start development build with watch
npm start

# Build for production
npm run build
```

## Acknowledgments

This plugin was inspired by and incorporates code and ideas from the [enable-button-icons](https://github.com/ndiego/enable-button-icons) and [enable-navigation-icons](https://github.com/bmx269/enable-navigation-icons) projects.

## License

GPLv2 or later. See [LICENSE](LICENSE) for details.
