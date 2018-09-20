/**
 * Options to be passed to IsURL decorator.
 */
export interface IsNumberOptions {
    allowNaN?: boolean;
    allowInfinity?: boolean;
}

/**
 * Options to be passed to IsURL decorator.
 */
export interface IsURLOptions {
    protocols?: string[];
    require_tld?: boolean;
    require_protocol?: boolean;
    require_valid_protocol?: boolean;
    allow_underscores?: boolean;
    host_whitelist?: false | (string | RegExp)[];
    host_blacklist?: false | (string | RegExp)[];
    allow_trailing_dot?: boolean;
    allow_protocol_relative_urls?: boolean;
}

/**
 * Options to be passed to isEmail decorator.
 */
export interface IsEmailOptions {
    allow_display_name?: boolean;
    allow_utf8_local_part?: boolean;
    require_tld?: boolean;
}