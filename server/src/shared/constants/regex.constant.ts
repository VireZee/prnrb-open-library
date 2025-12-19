export default Object.freeze({
    USERNAME_REGEX: /^[\w\d]+$/,
    EMAIL_REGEX: /^[\w.-]+@([\w-]+\.)+[A-Za-z]{2,}$/,
    SANITIZE_REGEX: /[^A-Za-z0-9|-]/g,
    ISBN: /^\d{10}(\d{3})?$/,
    WHITESPACES: /\s+/g
} as const)