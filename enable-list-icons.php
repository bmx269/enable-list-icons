<?php
/**
 * Plugin Name:         Enable List Icons
 * Plugin URI:          https://github.com/bmx269/enable-list-icons
 * Description:         Easily add icons to List Block items.
 * Version:             0.1.0
 * Requires at least:   6.3
 * Requires PHP:        7.4
 * Author:              Trent Stromkins
 * Author URI:          https://smallrobot.co
 * License:             GPLv2
 * License URI:         https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain:         enable-list-icons
 * Domain Path:         /languages
 *
 * @package enable-list-icons
 */

defined( 'ABSPATH' ) || exit;

/**
 * Enqueue Editor scripts.
 *
 * @since 0.1.0
 */
function enable_list_icons_enqueue_block_editor_assets() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_enqueue_script(
		'enable-list-icons-editor-scripts',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_set_script_translations(
		'enable-list-icons-editor-scripts',
		'enable-list-icons',
		plugin_dir_path( __FILE__ ) . 'languages'
	);

}
add_action( 'enqueue_block_editor_assets', 'enable_list_icons_enqueue_block_editor_assets' );

/**
 * Enqueue Editor styles.
 *
 * @since 0.1.0
 */
function enable_list_icons_enqueue_block_assets() {
	if ( is_admin() ) {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

		wp_enqueue_style(
			'enable-list-icons-editor-styles',
			plugin_dir_url( __FILE__ ) . 'build/editor.css',
			array(),
			$asset_file['version']
		);
	}
}
add_action( 'enqueue_block_assets', 'enable_list_icons_enqueue_block_assets' );

/**
 * Enqueue block styles for list-item block.
 * (Applies to both frontend and Editor)
 *
 * @since 0.1.0
 */
function enable_list_icons_block_styles_list_item() {
	wp_enqueue_block_style(
		'core/list-item',
		array(
			'handle' => 'enable-list-icons-block-styles',
			'src'    => plugin_dir_url( __FILE__ ) . 'build/style.css',
			'ver'    => wp_get_theme()->get( 'Version' ),
			'path'   => plugin_dir_path( __FILE__ ) . 'build/style.css',
		)
	);
}
add_action( 'init', 'enable_list_icons_block_styles_list_item' );

/**
 * Render icons on the frontend for list items.
 *
 * @since 0.1.0
 * @param string $block_content The block content.
 * @param array  $block         The block data.
 * @param object $instance      The block instance.
 * @return string Modified block content with icon.
 */
function enable_list_icons_render_block_list_item( $block_content, $block, $instance ) {
	if ( ! isset( $block['attrs']['icon'] ) && ! isset( $block['attrs']['iconName'] ) ) {
		return $block_content;
	}

	$icon      = isset( $block['attrs']['icon'] ) ? $block['attrs']['icon'] : '';
	$icon_name = isset( $block['attrs']['iconName'] ) ? $block['attrs']['iconName'] : 'custom';

	// Check if we should use default settings from the parent List block.
	$use_default_settings = ! isset( $block['attrs']['useDefaultIconSettings'] ) || $block['attrs']['useDefaultIconSettings'] === true;

	// Get parent List block's default settings if they exist.
	$parent_defaults = array();
	if ( $use_default_settings ) {
		$parent_defaults = enable_list_icons_get_parent_defaults( $block );
	}

	// Determine effective settings (use defaults if enabled, otherwise use item-specific settings).
	$position_left = $use_default_settings && isset( $parent_defaults['defaultIconPositionLeft'] )
		? $parent_defaults['defaultIconPositionLeft']
		: ( isset( $block['attrs']['iconPositionLeft'] ) ? $block['attrs']['iconPositionLeft'] : false );

	$has_no_icon_fill = $use_default_settings && isset( $parent_defaults['defaultHasNoIconFill'] )
		? $parent_defaults['defaultHasNoIconFill']
		: ( isset( $block['attrs']['hasNoIconFill'] ) ? $block['attrs']['hasNoIconFill'] : false );

	$icon_size = $use_default_settings && ! empty( $parent_defaults['defaultIconSize'] )
		? $parent_defaults['defaultIconSize']
		: ( isset( $block['attrs']['iconSize'] ) ? $block['attrs']['iconSize'] : '' );

	$icon_spacing = $use_default_settings && ! empty( $parent_defaults['defaultIconSpacing'] )
		? $parent_defaults['defaultIconSpacing']
		: ( isset( $block['attrs']['iconSpacing'] ) ? $block['attrs']['iconSpacing'] : '' );

	$icon_vertical_alignment = $use_default_settings && ! empty( $parent_defaults['defaultIconVerticalAlignment'] )
		? $parent_defaults['defaultIconVerticalAlignment']
		: ( isset( $block['attrs']['iconVerticalAlignment'] ) ? $block['attrs']['iconVerticalAlignment'] : 'center' );

	// Determine effective custom icon color.
	$custom_icon_color = $use_default_settings && ! empty( $parent_defaults['defaultCustomIconColor'] )
		? $parent_defaults['defaultCustomIconColor']
		: ( isset( $block['attrs']['customIconColor'] ) ? $block['attrs']['customIconColor'] : '' );

	$icon_color_class = '';
	$icon_color       = '';
	if ( isset( $block['attrs']['iconColor'] ) ) {
		$icon_color_class = ' has-' . sanitize_html_class( $block['attrs']['iconColor'] ) . '-color';
	} elseif ( $custom_icon_color ) {
		$icon_color = 'style="color:' . esc_attr( $custom_icon_color ) . ';"';
	}

	// Build inline styles for icon size and color.
	$icon_styles = array();
	$li_styles   = array();

	if ( $icon_size ) {
		$li_styles[] = '--icon-size:' . esc_attr( $icon_size );
	}
	if ( $icon_spacing ) {
		$li_styles[] = '--icon-spacing:' . esc_attr( $icon_spacing );
	}
	if ( $custom_icon_color ) {
		$icon_styles[] = 'color:' . esc_attr( $custom_icon_color );
	}

	$icon_style_attr = ! empty( $icon_styles ) ? ' style="' . esc_attr( implode( ';', $icon_styles ) ) . '"' : '';

	// Append the icon class and custom properties to the <li> tag.
	$p = new WP_HTML_Tag_Processor( $block_content );

	if ( $p->next_tag( 'li' ) ) {
		// WordPress doesn't add wp-block-list-item class on the frontend,
		// but our CSS selectors require it. Add it so styles apply.
		$p->add_class( 'wp-block-list-item' );
		$p->add_class( 'has-icon__' . sanitize_html_class( $icon_name ) );
		if ( $has_no_icon_fill ) {
			$p->add_class( 'has-no-icon-fill' );
		}
		if ( $position_left ) {
			$p->add_class( 'has-icon-position__left' );
		}
		if ( $icon_vertical_alignment && 'center' !== $icon_vertical_alignment ) {
			$p->add_class( 'has-icon-align__' . sanitize_html_class( $icon_vertical_alignment ) );
		}

		// Apply custom properties to the <li> tag.
		if ( ! empty( $li_styles ) ) {
			$existing_style = $p->get_attribute( 'style' );
			$new_styles     = esc_attr( implode( ';', $li_styles ) );
			$final_style    = $existing_style ? $existing_style . ';' . $new_styles : $new_styles;
			$p->set_attribute( 'style', $final_style );
		}
	}
	$block_content = $p->get_updated_html();

	// Sanitize SVG content to prevent XSS attacks.
	$allowed_svg_tags = array(
		'svg'      => array(
			'xmlns'       => true,
			'fill'        => true,
			'viewbox'     => true,
			'role'        => true,
			'aria-hidden' => true,
			'focusable'   => true,
			'width'       => true,
			'height'      => true,
			'class'       => true,
		),
		'path'     => array(
			'd'              => true,
			'fill'           => true,
			'stroke'         => true,
			'stroke-width'   => true,
			'stroke-linecap' => true,
			'stroke-linejoin' => true,
		),
		'circle'   => array(
			'cx'     => true,
			'cy'     => true,
			'r'      => true,
			'fill'   => true,
			'stroke' => true,
		),
		'rect'     => array(
			'x'      => true,
			'y'      => true,
			'width'  => true,
			'height' => true,
			'fill'   => true,
			'stroke' => true,
		),
		'polygon'  => array(
			'points' => true,
			'fill'   => true,
			'stroke' => true,
		),
		'polyline' => array(
			'points' => true,
			'fill'   => true,
			'stroke' => true,
		),
		'line'     => array(
			'x1'     => true,
			'y1'     => true,
			'x2'     => true,
			'y2'     => true,
			'stroke' => true,
		),
		'g'        => array(
			'fill'   => true,
			'stroke' => true,
		),
	);

	// Check if the <li> already has an icon to avoid duplicates.
	if ( strpos( $block_content, 'wp-block-list-item__icon' ) !== false ) {
		return $block_content;
	}

	// Sanitize the icon SVG.
	$sanitized_icon = wp_kses( $icon, $allowed_svg_tags );

	// Build the icon markup.
	$icon_markup = '<span class="wp-block-list-item__icon' . $icon_color_class . '" aria-hidden="true"' . $icon_style_attr . '>' . $sanitized_icon . '</span>';

	// Wrap the text content in a span so it stays as a single flex item.
	// List items can contain inline elements (strong, a, em) and nested lists (ul/ol).
	// Only the inline text content should be wrapped — nested lists stay outside.
	$block_content = preg_replace(
		'/(<li[^>]*>)(.*?)(<(?:ul|ol)\b|<\/li>)/is',
		'$1<span class="wp-block-list-item__content">$2</span>$3',
		$block_content,
		1
	);

	// Inject icon inside the <li> tag (always before the content span).
	$block_content = preg_replace( '/(<li[^>]*>)/i', '$1' . $icon_markup, $block_content, 1 );

	return $block_content;
}
add_filter( 'render_block_core/list-item', 'enable_list_icons_render_block_list_item', 10, 3 );

/**
 * Capture List block attributes when processing block data.
 * Uses a stack to handle multiple/nested List blocks.
 *
 * @since 0.1.0
 * @param array $parsed_block The parsed block data.
 * @return array Unmodified block data.
 */
function enable_list_icons_capture_list_defaults( $parsed_block ) {
	if ( 'core/list' === $parsed_block['blockName'] ) {
		global $enable_list_icons_list_stack;

		if ( ! isset( $enable_list_icons_list_stack ) ) {
			$enable_list_icons_list_stack = array();
		}

		// Push List attributes onto the stack.
		$list_attrs = isset( $parsed_block['attrs'] ) ? $parsed_block['attrs'] : array();
		array_push( $enable_list_icons_list_stack, $list_attrs );
	}

	return $parsed_block;
}
add_filter( 'render_block_data', 'enable_list_icons_capture_list_defaults', 5, 1 );

/**
 * Clean up List stack after block finishes rendering.
 *
 * @since 0.1.0
 * @param string $block_content The rendered block content.
 * @param array  $block         The block data.
 * @return string Unmodified block content.
 */
function enable_list_icons_cleanup_list_defaults( $block_content, $block ) {
	global $enable_list_icons_list_stack;

	if ( isset( $enable_list_icons_list_stack ) && ! empty( $enable_list_icons_list_stack ) ) {
		array_pop( $enable_list_icons_list_stack );
	}

	return $block_content;
}
add_filter( 'render_block_core/list', 'enable_list_icons_cleanup_list_defaults', 1000, 2 );

/**
 * Get parent List block's default icon settings from the stack.
 *
 * @since 0.1.0
 * @param array $block The current block data.
 * @return array Parent List block's default settings.
 */
function enable_list_icons_get_parent_defaults( $block ) {
	global $enable_list_icons_list_stack;

	// Return the most recent List block's attributes from the stack.
	if ( isset( $enable_list_icons_list_stack ) && ! empty( $enable_list_icons_list_stack ) ) {
		return end( $enable_list_icons_list_stack );
	}

	return array();
}
