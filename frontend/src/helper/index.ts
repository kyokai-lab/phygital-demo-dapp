export const shortenSmartContractAddress = (address: string): string => {
    if (!address || address.length < 10) {
      return address;
    }

    const prefix = address.slice(0, 6);
    const suffix = address.slice(-6);

    return `${prefix}...${suffix}`;
}