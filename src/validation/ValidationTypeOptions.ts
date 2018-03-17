/**
 * Options to be passed to IsURL decorator.
 */
export interface IsNumberOptions {
    allowNaN?: boolean;
    allowInfinity?: boolean;
}

/**
 * Options to be passed to IsCurrency decorator.
 */
export interface IsCurrencyOptions {
    symbol?: string;
    require_symbol?: boolean;
    allow_space_after_symbol?: boolean;
    symbol_after_digits?: boolean;
    allow_negatives?: boolean;
    parens_for_negatives?: boolean;
    negative_sign_before_digits?: boolean;
    negative_sign_after_digits?: boolean;
    allow_negative_sign_placeholder?: boolean;
    thousands_separator?: string;
    decimal_separator?: string;
    allow_space_after_digits?: boolean;
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
    host_whitelist?: false | string[];
    host_blacklist?: false | string[];
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

/**
 * Options to be passed to IsFQDN decorator.
 */
export interface IsFQDNOptions {
    require_tld?: boolean;
    allow_underscores?: boolean;
    allow_trailing_dot?: boolean;
}