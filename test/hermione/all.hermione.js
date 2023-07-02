const { assert } = require('chai');

const basePath = '/hw/store';
const baseUrl = 'http://localhost:3000';

const checkTooWide = async (browser, width) => {
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

describe('страницы  главная, условия доставки, контакты должны иметь статическое содержимое', () => {
    it('"Главная" имеет статическое содержимое', async ({ browser }) => {

        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto(`${baseUrl}${basePath}/`);

        await browser.assertView('plain', 'body');
    });

    it('"Условия доставки" имеет статическое содержимое', async ({ browser }) => {

        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto(`${baseUrl}${basePath}/delivery`);

        await browser.assertView('plain', 'body');
    });

    it('"Контакты" имеет статическое содержимое', async ({ browser }) => {

        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto(`${baseUrl}${basePath}/contacts`);

        await browser.assertView('plain', 'body');
    });
});

describe('верстка должна адаптироваться под ширину экрана', () => {
    it('Главная адаптируется к 1280', async ({ browser }) => {
        const width = 1280;
        await browser.url(`${baseUrl}${basePath}/`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

    it('Главная адаптируется к 768', async ({ browser }) => {
        const width = 768;
        await browser.url(`${baseUrl}${basePath}/`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

    it('Главная адаптируется к 320', async ({ browser }) => {
        const width = 320;
        await browser.url(`${baseUrl}${basePath}/`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });
    it('Доставка адаптируется к 1280', async ({ browser }) => {
        const width = 1280;
        await browser.url(`${baseUrl}${basePath}/delivery`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

    it('Доставка адаптируется к 768', async ({ browser }) => {
        const width = 768;
        await browser.url(`${baseUrl}${basePath}/delivery`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

    it('Доставка адаптируется к 320', async ({ browser }) => {
        const width = 320;
        await browser.url(`${baseUrl}${basePath}/delivery`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });
    it('Контакты адаптируется к 1280', async ({ browser }) => {
        const width = 1280;
        await browser.url(`${baseUrl}${basePath}/contacts`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

    it('Контакты адаптируется к 768', async ({ browser }) => {
        const width = 768;
        await browser.url(`${baseUrl}${basePath}/contacts`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

    it('Контакты адаптируется к 320', async ({ browser }) => {
        const width = 320;
        await browser.url(`${baseUrl}${basePath}/contacts`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

    it('Каталог адаптируется к 1280', async ({ browser }) => {
        const width = 1280;
        await browser.url(`${baseUrl}${basePath}/catalog`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

    it('Каталог адаптируется к 768', async ({ browser }) => {
        const width = 768;
        await browser.url(`${baseUrl}${basePath}/catalog`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

    it('Каталог адаптируется к 320', async ({ browser }) => {
        const width = 320;
        await browser.url(`${baseUrl}${basePath}/catalog`);
        const tooWide = await checkTooWide(browser, width);
        assert.isFalse(tooWide);
    });

});

describe('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', () => {

    it('на ширине больше 576px есть навигационное меню', async ({ browser }) => {
        const width = 590;
        await browser.url(`${baseUrl}${basePath}/`);
        browser.setWindowSize(width, 1000);
        const navlinks = await browser.$$('.nav-link');
        const isDisplayed = await navlinks[0].isDisplayed()
        assert.isTrue(isDisplayed);
    });

    it('на ширине больше 576px нет гамбургера - через isDisplayed', async ({ browser }) => {
        const width = 590;
        await browser.url(`${baseUrl}${basePath}/`);
        browser.setWindowSize(width, 1000);
        const isDisplayed = await browser.$('.Application-Toggler').isDisplayed()
        assert.isFalse(isDisplayed);
    });

    it('на ширине меньше 576px нет навигационного меню', async ({ browser }) => {
        const width = 570;
        await browser.url(`${baseUrl}${basePath}/`);
        browser.setWindowSize(width, 1000);
        const navlinks = await browser.$$('.nav-link');
        const isDisplayed = await navlinks[0].isDisplayed()
        assert.isFalse(isDisplayed);

    });

    it('на ширине меньше 576px есть гамбургер - скриншотом', async ({ browser }) => {
        const width = 570;
        await browser.url(`${baseUrl}${basePath}/`);
        browser.setWindowSize(width, 1000);
        await browser.assertView('plain', '.Application-Toggler')
    });

    it('на ширине меньше 576px есть гамбургер - свойством idsDisplayed', async ({ browser }) => {
        const width = 570;
        await browser.url(`${baseUrl}${basePath}/`);
        browser.setWindowSize(width, 1000);
        const isDisplayed = await browser.$('.Application-Toggler').isDisplayed()
        assert.isTrue(isDisplayed);
    });

})


it('при выборе пункта меню в гамбургере, меню должно закрываться', async ({ browser }) => {
    const width = 570;
    await browser.url(`${baseUrl}${basePath}/`);
    browser.setWindowSize(width, 1000);

    const hamburger = await browser.$('.Application-Toggler');
    await hamburger.click();

    const navlinks = await browser.$$('.nav-link');
    const navlink = navlinks[0];
    await navlink.click();

    const isDisplayed = await navlink.isDisplayed();
    assert.isFalse(isDisplayed);
});