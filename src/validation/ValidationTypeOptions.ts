/**
 * Options to be passed to IsURL decorator.
 */
export interface IsNumberOptions {
    allowNaN?: boolean;
    allowInfinity?: boolean;
}

/**
 * Options to be passed to isEmail decorator.
 */
export interface IsEmailOptions {
    allow_display_name?: boolean;
    allow_utf8_local_part?: boolean;
    require_tld?: boolean;
}