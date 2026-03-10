/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter, applyFilters } from '@wordpress/hooks';
import {
	BlockControls,
	InspectorControls,
	MediaUpload,
	useBlockEditingMode,
	useStyleOverride,
	withColors,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	Dropdown,
	MenuGroup,
	MenuItem,
	NavigableMenu,
	PanelBody,
	PanelRow,
	SelectControl,
	ToggleControl,
	ToolbarButton,
	__experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { code, media as mediaIcon } from '@wordpress/icons';
import {
	compose,
	createHigherOrderComponent,
	useInstanceId,
} from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	CustomInserterModal,
	DimensionControl,
	InserterModal,
} from './components';
import { parseUploadedMediaAndSetIcon, getIconStyle } from './utils';
import { bolt as defaultIcon } from './icons/bolt';

/**
 * Add the attributes needed for list icons.
 *
 * @since 0.1.0
 * @param {Object} settings Block settings.
 * @return {Object} Modified block settings.
 */
function addAttributes( settings ) {
	// Add global default icon settings to the List block
	if ( settings.name === 'core/list' ) {
		const globalIconAttributes = {
			defaultIconSize: {
				type: 'string',
			},
			defaultIconSpacing: {
				type: 'string',
			},
			defaultIconColor: {
				type: 'string',
			},
			defaultCustomIconColor: {
				type: 'string',
			},
			defaultIconPositionLeft: {
				type: 'boolean',
				default: false,
			},
			defaultHasNoIconFill: {
				type: 'boolean',
				default: false,
			},
			defaultIconVerticalAlignment: {
				type: 'string',
				default: 'center',
			},
		};

		return {
			...settings,
			attributes: {
				...settings.attributes,
				...globalIconAttributes,
			},
		};
	}

	// Add per-item icon attributes to list-item
	if ( settings.name !== 'core/list-item' ) {
		return settings;
	}

	// Add the icon attributes.
	const iconAttributes = {
		icon: {
			// String of icon svg (custom, media library).
			type: 'string',
		},
		iconPositionLeft: {
			type: 'boolean',
			default: false,
		},
		iconName: {
			// Name prop of icon (WordPress icon library, etc).
			type: 'string',
		},
		iconColor: {
			type: 'string',
		},
		customIconColor: {
			type: 'string',
		},
		hasNoIconFill: {
			type: 'boolean',
			default: false,
		},
		iconSize: {
			type: 'string',
		},
		iconSpacing: {
			type: 'string',
		},
		useDefaultIconSettings: {
			type: 'boolean',
			default: true,
		},
		iconVerticalAlignment: {
			type: 'string',
			default: 'center',
		},
	};

	const newSettings = {
		...settings,
		attributes: {
			...settings.attributes,
			...iconAttributes,
		},
	};

	return newSettings;
}

addFilter(
	'blocks.registerBlockType',
	'enable-list-icons/add-attributes',
	addAttributes
);

// Allowed types for the current WP_User
function GetAllowedMimeTypes() {
	const { allowedMimeTypes, mediaUpload } = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );

		// In WordPress 6.1 and lower, allowedMimeTypes returns
		// null in the post editor, so need to use getEditorSettings.
		// TODO: Remove once minimum version is bumped to 6.2
		const { getEditorSettings } = select( 'core/editor' );

		return {
			allowedMimeTypes: getSettings().allowedMimeTypes
				? getSettings().allowedMimeTypes
				: getEditorSettings().allowedMimeTypes,
			mediaUpload: getSettings().mediaUpload,
		};
	}, [] );
	return { allowedMimeTypes, mediaUpload };
}

/**
 * Filter the BlockEdit object and add icon inspector controls to list blocks.
 *
 * @since 0.1.0
 * @param {Object} BlockEdit
 */
const withBlockControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// Handle List block (parent) - add default icon settings
		if ( props.name === 'core/list' ) {
			const { attributes, setAttributes } = props;
			const {
				defaultIconSize,
				defaultIconSpacing,
				defaultCustomIconColor,
				defaultIconPositionLeft,
				defaultHasNoIconFill,
				defaultIconVerticalAlignment,
			} = attributes;

			const colorGradientSettings = useMultipleOriginColorsAndGradients();

			return (
				<>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __(
								'Default Icon Settings',
								'enable-list-icons'
							) }
							initialOpen={ false }
						>
							<PanelRow>
								<p className="description">
									{ __(
										'Set default icon settings for all list items. Individual items can override these settings.',
										'enable-list-icons'
									) }
								</p>
							</PanelRow>
							<DimensionControl
								label={ __(
									'Icon size',
									'enable-list-icons'
								) }
								value={ defaultIconSize || '' }
								onChange={ ( value ) => {
									setAttributes( { defaultIconSize: value } );
								} }
								units={ [ 'px', 'em', 'rem' ] }
							/>
							<DimensionControl
								label={ __(
									'Icon spacing',
									'enable-list-icons'
								) }
								value={ defaultIconSpacing || '' }
								onChange={ ( value ) => {
									setAttributes( {
										defaultIconSpacing: value,
									} );
								} }
								units={ [ 'px', 'em', 'rem' ] }
							/>
							<PanelRow>
								<ToggleControl
									label={ __(
										'Show icons on left',
										'enable-list-icons'
									) }
									checked={ defaultIconPositionLeft }
									onChange={ () => {
										setAttributes( {
											defaultIconPositionLeft:
												! defaultIconPositionLeft,
										} );
									} }
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={ __(
										'No icon fill (stroke only)',
										'enable-list-icons'
									) }
									checked={ defaultHasNoIconFill }
									onChange={ () => {
										setAttributes( {
											defaultHasNoIconFill:
												! defaultHasNoIconFill,
										} );
									} }
								/>
							</PanelRow>
							<SelectControl
								label={ __(
									'Icon vertical alignment',
									'enable-list-icons'
								) }
								value={
									defaultIconVerticalAlignment || 'center'
								}
								options={ [
									{
										label: __(
											'Top',
											'enable-list-icons'
										),
										value: 'top',
									},
									{
										label: __(
											'Center',
											'enable-list-icons'
										),
										value: 'center',
									},
									{
										label: __(
											'Bottom',
											'enable-list-icons'
										),
										value: 'bottom',
									},
								] }
								onChange={ ( value ) => {
									setAttributes( {
										defaultIconVerticalAlignment: value,
									} );
								} }
							/>
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="color">
						<ColorGradientSettingsDropdown
							panelId={ props.clientId }
							settings={ [
								{
									label: __(
										'Default Icon Color',
										'enable-list-icons'
									),
									colorValue:
										defaultCustomIconColor || undefined,
									onColorChange: ( value ) => {
										setAttributes( {
											defaultCustomIconColor: value,
										} );
									},
								},
							] }
							{ ...colorGradientSettings }
						/>
					</InspectorControls>
				</>
			);
		}

		// Handle list items (children)
		if ( props.name !== 'core/list-item' ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, iconColor, setIconColor, setAttributes, clientId } =
			props;
		const {
			icon,
			iconName,
			iconPositionLeft,
			customIconColor,
			iconSize,
			iconSpacing,
			iconVerticalAlignment,
			useDefaultIconSettings,
		} = attributes;
		const { allowedMimeTypes } = GetAllowedMimeTypes();
		const isSVGUploadAllowed = allowedMimeTypes
			? Object.values( allowedMimeTypes ).includes( 'image/svg+xml' )
			: false;

		const [ isInserterOpen, setInserterOpen ] = useState( false );
		const [ isCustomInserterOpen, setCustomInserterOpen ] =
			useState( false );

		// Allow the iconBlock to disable custom SVG icons.
		const enableCustomIcons = applyFilters(
			'iconBlock.enableCustomIcons',
			true
		);

		const isContentOnlyMode = useBlockEditingMode() === 'contentOnly';

		// Ensure a valid string or undefined is passed to colorValue
		let validColorValue;
		if ( typeof iconColor === 'string' && iconColor.trim() !== '' ) {
			validColorValue = iconColor;
		} else if (
			typeof customIconColor === 'string' &&
			customIconColor.trim() !== ''
		) {
			validColorValue = customIconColor;
		}

		const colorGradientSettings = useMultipleOriginColorsAndGradients();

		const ARROW_DOWN = 40;
		const openOnArrowDown = ( event ) => {
			if ( event.keyCode === ARROW_DOWN ) {
				event.preventDefault();
				event.target.click();
			}
		};

		const replaceText =
			icon || iconName
				? __( 'Replace icon', 'icon-block' )
				: __( 'Add icon', 'icon-block' );
		const customIconText =
			icon || iconName
				? __( 'Add/edit custom icon', 'icon-block' )
				: __( 'Add custom icon', 'icon-block' );

		const replaceDropdown = (
			<Dropdown
				renderToggle={ ( { isOpen, onToggle } ) => (
					<ToolbarButton
						aria-expanded={ isOpen }
						aria-haspopup="true"
						onClick={ onToggle }
						onKeyDown={ openOnArrowDown }
					>
						{ replaceText }
					</ToolbarButton>
				) }
				style={ { zIndex: 1 } }
				className="enable-button-icon-dropdown"
				contentClassName="enable-button-icon-dropdown-content"
				renderContent={ ( { onClose } ) => (
					<NavigableMenu className="enable-button-icon-navigableMenu">
						<MenuGroup>
							<MenuItem
								onClick={ () => {
									setInserterOpen( true );
									onClose( true );
								} }
								icon={ defaultIcon }
							>
								{ __( 'Browse Icon Library', 'icon-block' ) }
							</MenuItem>
							{ isSVGUploadAllowed && (
								<MediaUpload
									onSelect={ ( media ) => {
										parseUploadedMediaAndSetIcon(
											media,
											attributes,
											setAttributes
										);
										onClose( true );
									} }
									allowedTypes={ [ 'image/svg+xml' ] }
									render={ ( { open } ) => (
										<MenuItem
											onClick={ open }
											icon={ mediaIcon }
										>
											{ __(
												'Open Media Library',
												'icon-block'
											) }
										</MenuItem>
									) }
									className={
										'enable-button-icon-media-upload'
									}
								/>
							) }
							{ enableCustomIcons && (
								<MenuItem
									onClick={ () => {
										setCustomInserterOpen( true );
										onClose( true );
									} }
									icon={ code }
								>
									{ customIconText }
								</MenuItem>
							) }
						</MenuGroup>
						{ ( icon || iconName ) && (
							<MenuGroup>
								<MenuItem
									onClick={ () => {
										setAttributes( {
											icon: undefined,
											iconName: undefined,
										} );
										onClose( true );
									} }
								>
									{ __( 'Reset', 'icon-block' ) }
								</MenuItem>
							</MenuGroup>
						) }
					</NavigableMenu>
				) }
			/>
		);

		return (
			<>
				<BlockEdit { ...props } />
				<BlockControls group={ isContentOnlyMode ? 'inline' : 'other' }>
					<>
						{ enableCustomIcons || isSVGUploadAllowed ? (
							replaceDropdown
						) : (
							<ToolbarButton
								onClick={ () => {
									setInserterOpen( true );
								} }
							>
								{ replaceText }
							</ToolbarButton>
						) }
					</>
				</BlockControls>
				{ ( icon || iconName ) && (
					<>
						<InspectorControls>
							<PanelBody
								title={ __(
									'Icon settings',
									'enable-list-icons'
								) }
								className="list-icon-picker"
								initialOpen={ true }
							>
								<PanelRow>
									<ToggleControl
										label={ __(
											'Use default icon settings',
											'enable-list-icons'
										) }
										help={ __(
											'When enabled, this item will use the default settings from the List block.',
											'enable-list-icons'
										) }
										checked={ useDefaultIconSettings }
										onChange={ () => {
											setAttributes( {
												useDefaultIconSettings:
													! useDefaultIconSettings,
											} );
										} }
									/>
								</PanelRow>
								{ ! useDefaultIconSettings && (
									<>
										<PanelRow>
											<ToggleControl
												label={ __(
													'Show icon on left',
													'enable-list-icons'
												) }
												checked={ iconPositionLeft }
												onChange={ () => {
													setAttributes( {
														iconPositionLeft:
															! iconPositionLeft,
													} );
												} }
											/>
										</PanelRow>
										<DimensionControl
											label={ __(
												'Icon size',
												'enable-list-icons'
											) }
											value={ iconSize || '' }
											onChange={ ( value ) => {
												setAttributes( {
													iconSize: value,
												} );
											} }
											units={ [ 'px', 'em', 'rem' ] }
										/>
										<DimensionControl
											label={ __(
												'Icon spacing',
												'enable-list-icons'
											) }
											value={ iconSpacing || '' }
											onChange={ ( value ) => {
												setAttributes( {
													iconSpacing: value,
												} );
											} }
											units={ [ 'px', 'em', 'rem' ] }
										/>
										<SelectControl
											label={ __(
												'Icon vertical alignment',
												'enable-list-icons'
											) }
											value={
												iconVerticalAlignment ||
												'center'
											}
											options={ [
												{
													label: __(
														'Top',
														'enable-list-icons'
													),
													value: 'top',
												},
												{
													label: __(
														'Center',
														'enable-list-icons'
													),
													value: 'center',
												},
												{
													label: __(
														'Bottom',
														'enable-list-icons'
													),
													value: 'bottom',
												},
											] }
											onChange={ ( value ) => {
												setAttributes( {
													iconVerticalAlignment:
														value,
												} );
											} }
										/>
									</>
								) }
							</PanelBody>
						</InspectorControls>
						{ ! useDefaultIconSettings && (
							<InspectorControls group="color">
								<ColorGradientSettingsDropdown
									panelId={ clientId }
									settings={ [
										{
											label: 'Icon',
											colorValue: validColorValue,
											onColorChange: ( value ) => {
												setIconColor( value );

												setAttributes( {
													customIconColor: value,
												} );
											},
										},
									] }
									{ ...colorGradientSettings }
								/>
							</InspectorControls>
						) }
					</>
				) }
				<InserterModal
					isInserterOpen={ isInserterOpen }
					setInserterOpen={ setInserterOpen }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
				{ enableCustomIcons && (
					<CustomInserterModal
						isCustomInserterOpen={ isCustomInserterOpen }
						setCustomInserterOpen={ setCustomInserterOpen }
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				) }
			</>
		);
	};
}, 'withBlockControls' );

addFilter(
	'editor.BlockEdit',
	'enable-list-icons/with-block-controls',
	compose( [ withColors( { iconColor: 'iconColor' } ), withBlockControls ] )
);

/**
 * Add icon and position classes in the Editor.
 *
 * @since 0.1.0
 * @param {Object} BlockListBlock
 */
function addClasses( BlockListBlock ) {
	return ( props ) => {
		const { name, attributes, clientId } = props;

		if (
			name !== 'core/list-item' ||
			! ( attributes?.icon || attributes?.iconName )
		) {
			return <BlockListBlock { ...props } />;
		}

		// Get parent List block's default settings
		const parentListDefaults = useSelect(
			( select ) => {
				const { getBlockParentsByBlockName, getBlockAttributes } =
					select( 'core/block-editor' );
				const listParents = getBlockParentsByBlockName(
					clientId,
					'core/list'
				);

				if ( listParents && listParents.length > 0 ) {
					const parentId = listParents[ 0 ];
					return getBlockAttributes( parentId );
				}

				return {};
			},
			[ clientId ]
		);

		// Determine effective settings based on useDefaultIconSettings
		const useDefaults = attributes?.useDefaultIconSettings !== false; // Default to true
		const effectiveIconSize =
			useDefaults && parentListDefaults?.defaultIconSize
				? parentListDefaults.defaultIconSize
				: attributes?.iconSize;
		const effectiveIconSpacing =
			useDefaults && parentListDefaults?.defaultIconSpacing
				? parentListDefaults.defaultIconSpacing
				: attributes?.iconSpacing;
		const effectiveIconPositionLeft =
			useDefaults &&
			parentListDefaults?.defaultIconPositionLeft !== undefined
				? parentListDefaults.defaultIconPositionLeft
				: attributes?.iconPositionLeft;
		const effectiveCustomIconColor =
			useDefaults && parentListDefaults?.defaultCustomIconColor
				? parentListDefaults.defaultCustomIconColor
				: attributes?.customIconColor;
		const effectiveHasNoIconFill =
			useDefaults &&
			parentListDefaults?.defaultHasNoIconFill !== undefined
				? parentListDefaults.defaultHasNoIconFill
				: attributes?.hasNoIconFill;
		const effectiveIconVerticalAlignment =
			useDefaults && parentListDefaults?.defaultIconVerticalAlignment
				? parentListDefaults.defaultIconVerticalAlignment
				: attributes?.iconVerticalAlignment || 'center';

		const id = useInstanceId( BlockListBlock );
		const selectorPrefix = `wp-block-list-item-has-icon-`;
		const selectorClassname = `${ selectorPrefix }${ id }`;
		// Only use ::before for icons to avoid conflict with WP core's
		// use of ::after for block hover/selection outlines.
		const selector = `.${ selectorClassname }::before`;

		// Get CSS string for the current icon.
		// The CSS and `style` element is only output if it is not empty.
		const css = getIconStyle( {
			selector,
			icon: attributes?.icon,
			iconName: attributes?.iconName,
			customIconColor: effectiveCustomIconColor,
			iconSize: effectiveIconSize,
			iconSpacing: effectiveIconSpacing,
		} );

		const classes = classnames( props?.className, {
			[ `has-icon__${ attributes?.iconName }` ]: attributes?.iconName,
			'has-icon__custom': attributes?.icon && ! attributes?.iconName,
			'has-icon-position__left': effectiveIconPositionLeft,
			'has-no-icon-fill': effectiveHasNoIconFill,
			[ `has-icon-align__${ effectiveIconVerticalAlignment }` ]:
				effectiveIconVerticalAlignment &&
				effectiveIconVerticalAlignment !== 'center',
			[ `${ selectorClassname }` ]: true,
		} );

		useStyleOverride( { css } );

		return <BlockListBlock { ...props } className={ classes } />;
	};
}

addFilter(
	'editor.BlockListBlock',
	'enable-list-icons/add-classes',
	addClasses
);
