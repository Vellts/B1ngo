
// generate a random lobby id of 6 characters with base64 encoding
export const generateLobbyId = (): string => {
    return Buffer.from(Math.random().toString(36).substring(2, 8)).toString('base64');
}