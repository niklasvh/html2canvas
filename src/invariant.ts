export const invariant = (assertion: boolean, error: string): void => {
    if (!assertion) {
        console.error(error);
    }
};
