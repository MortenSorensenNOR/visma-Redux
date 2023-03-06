export default getWeek = () => {
    const date = new Date();
    const beginOfYear = new Date(date.getFullYear(), 0, 1);
    const dayNr = Math.ceil((date - beginOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((dayNr + beginOfYear.getDay()) / 7);
}