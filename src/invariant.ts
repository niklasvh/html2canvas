export const invariant = (assertion: boolean, error: string) => {
    if (!assertion) {
        console.error(error);
    }
};
