export default Object.freeze({
    USERNAME_REGEX: /^[\w\d]+$/,
    EMAIL_REGEX: /^[\w.-]+@([\w-]+\.)+[A-Za-z]{2,}$/,
    SANITIZE_REGEX: /[^A-Za-z0-9|-]/g
} as const)