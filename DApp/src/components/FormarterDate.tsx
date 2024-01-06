
const FormarterDate = (initialTimestamp: number) => {

    const timestampToFormattedDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        const options: Intl.DateTimeFormatOptions  = { year: 'numeric', month: 'long', day: 'numeric'};
        return date.toLocaleString(undefined, options);
    };

    const formatted = timestampToFormattedDate(initialTimestamp);

    return formatted
}

export default FormarterDate;
