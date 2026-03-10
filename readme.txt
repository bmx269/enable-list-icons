=== Enable List Icons ===
Contributors: bmx269
Tags: list, icons, block editor, gutenberg, list-item
Requires at least: 6.3
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html

Easily add icons to List Block items in WordPress.

== Description ==

Enable List Icons makes it simple to add and customize icons for your WordPress List Block items. Whether you're building a feature list, checklist, or any styled list, this plugin provides intuitive controls for adding beautiful icons to your list items. Icons replace the default bullet markers and render inline with your text.

**Recommended Companion Plugin:** Use the [Icon Block](https://wordpress.org/plugins/icon-block/) plugin to add custom icon sets and expand your icon library options. Icon Block is a powerful companion that allows you to register additional icon libraries for use with Enable List Icons.

= Key Features =

**Icon Selection**
* Browse and select from a curated collection of WordPress icons
* Upload and use custom SVG icons from your media library
* Paste custom SVG code directly for complete flexibility

**Icon Positioning**
* Position icons before or after list item text (left/right)
* Vertical alignment control (top, center, bottom) for precise icon placement relative to text

**Icon Styling**
* Adjust icon dimensions with a slider control (supports px, em, rem units)
* Control the gap between icon and text (supports px, em, rem units)
* Choose from theme colors or set a custom color
* Support for stroke-based icons with "No Fill" option (e.g., Lucide icons)

**List Block Default Settings**
Set default icon settings at the List block level that apply to all child list items:
* Configure size, spacing, color, position, alignment, and styling once for the entire list
* Individual list items can inherit defaults or use custom settings
* Works seamlessly with multiple and nested List blocks

This feature streamlines icon management for large lists by eliminating repetitive configuration while maintaining flexibility for individual items.

= Supported Blocks =

* `core/list` - List block (for setting default icon settings)
* `core/list-item` - Standard list items

= Credits =

This plugin was inspired by and incorporates code and ideas from the [enable-button-icons](https://github.com/ndiego/enable-button-icons) and [enable-navigation-icons](https://github.com/bmx269/enable-navigation-icons) projects.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/enable-list-icons` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Add or edit a List block in the block editor.
4. Select a list item.
5. Click "Add icon" in the block toolbar to get started.

== Frequently Asked Questions ==

= Does this work with any theme? =

Yes! Enable List Icons works with any WordPress theme that supports the block editor and List blocks.

= Can I use custom SVG icons? =

Absolutely! You can use icons from the built-in library, upload SVG files from your media library, or paste custom SVG code directly.

= Can I set default icon settings for the entire list? =

Yes! Select the List block (parent container) and configure default icon settings that will apply to all child list items. Individual items can still override these defaults if needed.

= How does vertical alignment work? =

The vertical alignment control lets you align icons relative to the text: top, center (default), or bottom. This is especially useful when icons are larger than the text line height.

== Screenshots ==

1. Icon selection interface showing library, media, and custom SVG options
2. Icon positioning and styling controls in the block sidebar
3. List block with default icon settings panel
4. Example list with icons in various styles and positions

== Changelog ==

= 0.1.0 =
* Initial release
* Icon selection (library, media, custom SVG)
* Icon positioning (left/right)
* Vertical alignment control (top, center, bottom)
* Icon styling (size, spacing, color, no fill option)
* List block default settings with inheritance
* Support for core/list and core/list-item blocks

== Upgrade Notice ==

= 0.1.0 =
Initial release of Enable List Icons.
