export const checkTooWide = async (browser, width) => {
    browser.setWindowSize(width, 1000);
    const allElements = await browser.$$('*');
    const widthPromises = allElements.map(element => element.getSize('width'));
    const widths = await Promise.all(widthPromises);
    let tooWide = false;
    for (i = 0; i < widths.length; i++) {
        if (widths[i] > width) { tooWide = true; break }
    }
    return tooWide
}