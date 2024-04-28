export const generateUniqueID = () => {
    const currentDate = new Date();
    const milliseconds = currentDate.getTime();
    const uniqueIdentifier = 'id-' + milliseconds;
    return uniqueIdentifier;
}