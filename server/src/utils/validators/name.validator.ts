export default (name: string) => {
    if (!name) return "Name can't be empty!"
    else if (name.length >= 75) return 'Name is too long!'
    return
}