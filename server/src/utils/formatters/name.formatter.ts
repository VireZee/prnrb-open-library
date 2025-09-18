export default (name: string) => {
    const nameParts = name.split(' ')
    const initials = nameParts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    return name = initials.join(' ')
}