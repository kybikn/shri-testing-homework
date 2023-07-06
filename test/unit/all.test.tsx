import { it, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Provider } from 'react-redux';
import { initStore } from "../../src/client/store";
import { Application } from "../../src/client/Application";
import React from "react";
import userEvent from "@testing-library/user-event";
import { mockApi, mockCart, productsData } from "../tools/mocks";

const getCheckoutRes = () => {
    return { "id": 1 }
};
const store = initStore(mockApi, mockCart);

describe('Раздел Общие', () => {

    describe('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
        const application = (
            <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByRole } = render(application);

        const navLinks = container.getElementsByClassName('nav-link');
        const hrefs: string[] = [];
        for (let i = 0; i < navLinks.length; i++) {
            const navLink = navLinks[i] as HTMLLinkElement;
            const href = navLink.href;
            hrefs.push(href);
        }

        it('отображается ссылка Catalog', () => {
            const catalogHref = hrefs.find(href => href.includes('catalog'))
            expect(catalogHref).toBeTruthy();
        });

        it('отображается ссылка Delivery', () => {
            const deliveryHref = hrefs.find(href => href.includes('delivery'))
            expect(deliveryHref).toBeTruthy();
        });

        it('отображается ссылка Contacts', () => {
            const contactsHref = hrefs.find(href => href.includes('contacts'))
            expect(contactsHref).toBeTruthy();
        });

        it('отображается ссылка Cart', () => {
            const cartHref = hrefs.find(href => href.includes('cart'))
            expect(cartHref).toBeTruthy();
        });
    })

    it('название магазина в шапке должно быть ссылкой на главную страницу', () => {
        const application = (
            <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByRole } = render(application);
        const mainLink = container.getElementsByClassName('Application-Brand')[0];
        expect(mainLink).toBeTruthy();
        const href = mainLink.getAttribute('href');
        expect(href).toBe('/');
    });

})

describe('Раздел Страницы', () => {

    describe('в магазине должны быть страницы: главная, каталог, условия доставки, контакты', () => {

        it('по адресу "/" должна открываться страница "Home"', () => {
            const application = (
                <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            );
            const { container } = render(application);
            const pageDiv = container.getElementsByClassName('Home')[0];
            expect(pageDiv).toBeTruthy();
        });

        it('по адресу "/catalog" должна открываться страница "Каталог"', () => {
            const application = (
                <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            );
            const { container } = render(application);
            const pageDiv = container.getElementsByClassName('Catalog')[0];
            expect(pageDiv).toBeTruthy();
        });

        it('по адресу /delivery должна открываться страница "Условия доставки"', () => {
            const store = initStore(mockApi, mockCart);
            const application = (
                <MemoryRouter initialEntries={["/delivery"]} initialIndex={0}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            );
            const { container } = render(application);
            const pageDiv = container.getElementsByClassName('Delivery')[0];
            expect(pageDiv).toBeTruthy();
        });

        it('по адресу /contacts должна открываться страница "Контакты"', () => {
            const store = initStore(mockApi, mockCart);
            const application = (
                <MemoryRouter initialEntries={["/contacts"]} initialIndex={0}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            );
            const { container } = render(application);
            const pageDiv = container.getElementsByClassName('Contacts')[0];
            expect(pageDiv).toBeTruthy();
        });
    })
})

it('по адресу "/catalog" должна открываться страница "Catalog и быть товары"', async () => {
    const store = initStore(mockApi, mockCart);

    const application = (
        <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
            <Provider store={store}>
                <Application />
            </Provider>
        </MemoryRouter>
    );
    const { container, findAllByText } = render(application);
    const productItem = productsData[1];
    await findAllByText(productItem.name);
    const pageDivs = container.getElementsByClassName('ProductItem');
    expect(pageDivs.length === productsData.length).toBeTruthy();
});

describe('Раздел Каталог', () => {

    const store = initStore(mockApi, mockCart);
    const application = (
        <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
            <Provider store={store}>
                <Application />
            </Provider>
        </MemoryRouter>
    );
    const { container } = render(application);
    const productItems = container.getElementsByClassName('ProductItem');

    it('в каталоге должны отображаться товары, список которых приходит с сервера', async () => {

        for (let i = 0; i < productItems.length; i++) {
            const productItem = productItems[i];
            const titleElement = productItem.querySelector(".ProductItem-Name");
            const titleText = titleElement?.textContent;
            const titleFound = productsData.find(item => item.name === titleText);
            expect(titleElement).toBeTruthy();
            expect(titleFound).toBeTruthy();
        }
    });

    it('для каждого товара в каталоге отображается название', async () => {
        for (let i = 0; i < productItems.length; i++) {
            const div = productItems[i];
            const titleElement = div.querySelector(".ProductItem-Name");
            expect(titleElement).toBeTruthy();
            expect(titleElement?.textContent).toBeTruthy();
        }
    });

    it('для каждого товара в каталоге отображается цена', async () => {
        for (let i = 0; i < productItems.length; i++) {
            const div = productItems[i];
            const priceElement = div.querySelector(".ProductItem-Price");
            expect(priceElement).toBeTruthy();
            expect(priceElement?.textContent).toBeTruthy();
        }
    });

    it('для каждого товара в каталоге отображается ссылка на страницу с подробной информацией о товаре', async () => {
        for (let i = 0; i < productItems.length; i++) {
            const div = productItems[i];
            const link = div.querySelector(".ProductItem-DetailsLink");
            expect(link).toBeTruthy();
            expect(link?.textContent).toBeTruthy();
        }
    })

    it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка * * "добавить в корзину"', async () => {
        const productItem = productsData[1];
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={[`/catalog/${productItem.id}`]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, findByText } = render(application);
        const name = await findByText(productItem.name);
        expect(name.textContent).toBeTruthy();
        const price = await findByText(`$${productItem.price}`);
        expect(price.textContent).toBeTruthy();
        const description = container.querySelector(".ProductDetails-Description");
        expect(description).toBeTruthy();
        expect(description?.textContent).toBeTruthy();
        const color = container.querySelector(".ProductDetails-Color");
        expect(color).toBeTruthy();
        expect(color?.textContent).toBeTruthy();
        const material = container.querySelector(".ProductDetails-Material");
        expect(material).toBeTruthy();
        expect(material?.textContent).toBeTruthy();
        const button = container.querySelector(".ProductDetails-AddToCart");
        expect(button).toBeTruthy();
        expect(button?.textContent).toBeTruthy();
    });
})

describe('Раздел Корзина', () => {
    it('в корзине должна отображаться таблица с добавленными в нее товарами', async () => {
        let cart = { "1": { "name": "Rustic Chicken", "count": 1, "price": 242 }, "5": { "name": "Intelligent Chair", "count": 1, "price": 857 }, "14": { "name": "Fantastic Towels", "count": 1, "price": 976 } };
        mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container } = render(application);
        const cartTable = container.querySelector('.Cart-Table');
        const rows = cartTable?.getElementsByClassName('Cart-Index');
        expect(rows?.length).toBe(Object.keys(cart).length);
    })

    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {

        const cart = { "1": { "name": "Rustic Chicken", "count": 1, "price": 242 }, "5": { "name": "Intelligent Chair", "count": 1, "price": 857 }, "14": { "name": "Fantastic Towels", "count": 1, "price": 976 } };
        await mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container } = render(application);
        const cartClear = container.getElementsByClassName('Cart-Clear')[0];
        expect(cartClear).toBeTruthy();
        await userEvent.click(cartClear as HTMLElement);
        const cartTable = container.querySelector('.Cart-Table');
        expect(cartTable).toBeNull();
        const cartState = await mockCart.getState();
        expect(Object.keys(cartState).length).toBeFalsy();
    })

    it('при оформлении заказа, должен появиться текст Well done!', async () => {

        const cart = { "1": { "name": "Rustic Chicken", "count": 1, "price": 242 }, "5": { "name": "Intelligent Chair", "count": 1, "price": 857 }, "14": { "name": "Fantastic Towels", "count": 1, "price": 976 } };
        await mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByLabelText, findByText } = render(application);
        const nameInput = getByLabelText('Name');
        const phoneInput = getByLabelText('Phone');
        const addressInput = getByLabelText('Address');
        const checkoutBtn = container.getElementsByClassName('Form-Submit')[0];
        expect(checkoutBtn).toBeTruthy();
        await userEvent.type(nameInput, 'User');
        await userEvent.type(phoneInput, '1234567890');
        await userEvent.type(addressInput, 'NewYork');
        await userEvent.click(checkoutBtn as HTMLElement);
        const wellDoneMessage = await findByText('Well done!');
        expect(wellDoneMessage).toBeTruthy();
    })

    it('текст Well done - цвета успеха', async () => {

        const cart = { "1": { "name": "Rustic Chicken", "count": 1, "price": 242 }, "5": { "name": "Intelligent Chair", "count": 1, "price": 857 }, "14": { "name": "Fantastic Towels", "count": 1, "price": 976 } };
        await mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByLabelText, findByText } = render(application);
        const nameInput = getByLabelText('Name');
        const phoneInput = getByLabelText('Phone');
        const addressInput = getByLabelText('Address');
        const checkoutBtn = container.getElementsByClassName('Form-Submit')[0];
        expect(checkoutBtn).toBeTruthy();
        await userEvent.type(nameInput, 'User');
        await userEvent.type(phoneInput, '1234567890');
        await userEvent.type(addressInput, 'NewYork');
        await userEvent.click(checkoutBtn as HTMLElement);
        await findByText('Well done!');
        const messageBox = container.querySelector('.Cart-SuccessMessage');
        expect(messageBox?.classList.contains('alert-success')).toBeTruthy();
    })


    it('для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', async () => {
        let cart = { "1": { "name": "Rustic Chicken", "count": 1, "price": 242 }, "5": { "name": "Intelligent Chair", "count": 1, "price": 857 }, "14": { "name": "Fantastic Towels", "count": 1, "price": 976 } };
        mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByTestId } = render(application);
        Object.entries(cart).forEach(([id, item], index) => {
            const row = getByTestId(id);
            const cartIndex = row.querySelector('.Cart-Index')?.textContent;
            const cartName = row.querySelector('.Cart-Name')?.textContent;
            const cartPrice = row.querySelector('.Cart-Price')?.textContent;
            const cartCount = row.querySelector('.Cart-Count')?.textContent;
            const cartTotal = row.querySelector('.Cart-Total')?.textContent;
            expect(cartIndex).toBe((index + 1).toString());
            expect(cartName).toBe(item.name);
            expect(cartPrice).toContain((item.price).toString());
            expect(cartCount).toContain((item.count).toString());
            expect(cartTotal).toContain((item.count * item.price).toString());
        })
        const cartOrderPrice = container.getElementsByClassName('Cart-OrderPrice')[0];
        expect(cartOrderPrice).toBeTruthy();
    });

    it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
        let cart = { "1": { "name": "Rustic Chicken", "count": 1, "price": 242 }, "5": { "name": "Intelligent Chair", "count": 1, "price": 857 }, "14": { "name": "Fantastic Towels", "count": 1, "price": 976 } };
        mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { getByText } = render(application);
        const catalogName = getByText(/Cart \([0-9]+\)/i) as HTMLLinkElement;
        expect(catalogName.textContent).toContain(Object.keys(cart).length.toString());
    })

    it('если корзина пустая, должна отображаться ссылка на каталог товаров', async () => {
        let cart = {};
        mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { getByText } = render(application);
        const catalogName = getByText('catalog') as HTMLLinkElement;
        expect(catalogName.href).toContain('/catalog');
    })

    it('если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
        const productItem = productsData[1];
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={[`/catalog/${productItem.id}`]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { findByText, findByRole } = render(application);

        const AddToCartBtn = await findByRole('button', { name: 'Add to Cart' });
        await userEvent.click(AddToCartBtn);
        const inCartMessageElement = await findByText('Item in cart');
        expect(inCartMessageElement).toBeTruthy();
    })

    it('Кнопка добавления в корзину большая', async () => {
        const productItem = productsData[1];
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={[`/catalog/${productItem.id}`]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { findByRole } = render(application);
        const AddToCartBtn = await findByRole('button', { name: 'Add to Cart' });
        expect(AddToCartBtn.classList.contains('btn-lg')).toBeTruthy();
    })
})

describe('работает проверка данных формы заказа', () => {

    const cart = { "1": { "name": "Rustic Chicken", "count": 1, "price": 242 }, "5": { "name": "Intelligent Chair", "count": 1, "price": 857 }, "14": { "name": "Fantastic Towels", "count": 1, "price": 976 } };
    it('нет ошибок если все данные есть', async () => {
        mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByLabelText, getByText } = render(application);
        const nameInput = getByLabelText('Name') as HTMLInputElement;
        const phoneInput = getByLabelText('Phone') as HTMLInputElement;
        const addressInput = getByLabelText('Address') as HTMLTextAreaElement;
        const checkoutBtn = container.getElementsByClassName('Form-Submit')[0];
        expect(checkoutBtn).toBeTruthy();
        await userEvent.type(nameInput, 'Username');
        await userEvent.type(phoneInput, '1234567890');
        await userEvent.type(addressInput, 'NewYork');
        await userEvent.click(checkoutBtn as HTMLElement);
        expect(nameInput.classList.contains('is-invalid')).toBeFalsy();
        expect(phoneInput.classList.contains('is-invalid')).toBeFalsy();
        expect(addressInput.classList.contains('is-invalid')).toBeFalsy();
    })

    it('ошибка если нет имени', async () => {
        mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByLabelText, findByText } = render(application);
        const phoneInput = getByLabelText('Phone') as HTMLInputElement;
        const addressInput = getByLabelText('Address') as HTMLTextAreaElement;
        const checkoutBtn = container.getElementsByClassName('Form-Submit')[0];
        expect(checkoutBtn).toBeTruthy();
        await userEvent.type(phoneInput, '1234567890');
        await userEvent.type(addressInput, 'NewYork');
        await userEvent.click(checkoutBtn as HTMLElement);
        const errorMessage = await findByText('Please provide your name');
        expect(errorMessage).toBeTruthy();
    })

    it('ошибка если нет адреса', async () => {
        mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByLabelText, findByText } = render(application);
        const nameInput = getByLabelText('Name') as HTMLInputElement;
        const phoneInput = getByLabelText('Phone') as HTMLInputElement;
        const checkoutBtn = container.getElementsByClassName('Form-Submit')[0];
        expect(checkoutBtn).toBeTruthy();
        await userEvent.type(nameInput, 'User');
        await userEvent.type(phoneInput, '1234567890');
        await userEvent.click(checkoutBtn as HTMLElement);
        const errorMessage = await findByText('Please provide a valid address');
        expect(errorMessage).toBeTruthy();
    })

    it('ошибка если нет телефона', async () => {
        mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByLabelText, findByText } = render(application);
        const nameInput = getByLabelText('Name') as HTMLInputElement;
        const addressInput = getByLabelText('Address') as HTMLTextAreaElement;
        const checkoutBtn = container.getElementsByClassName('Form-Submit')[0];
        expect(checkoutBtn).toBeTruthy();
        await userEvent.type(nameInput, 'User');
        await userEvent.type(addressInput, 'NewYork');
        await userEvent.click(checkoutBtn as HTMLElement);
        const errorMessage = await findByText('Please provide a valid phone');
        expect(errorMessage).toBeTruthy();
    })

    it('ошибка если неверный телефон', async () => {
        mockCart.setState(cart);
        const store = initStore(mockApi, mockCart);
        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        const { container, getByLabelText, findByText } = render(application);
        const nameInput = getByLabelText('Name') as HTMLInputElement;
        const phoneInput = getByLabelText('Phone') as HTMLInputElement;
        const addressInput = getByLabelText('Address') as HTMLTextAreaElement;
        const checkoutBtn = container.getElementsByClassName('Form-Submit')[0];
        expect(checkoutBtn).toBeTruthy();
        await userEvent.type(nameInput, 'User');
        await userEvent.type(phoneInput, '12345ds3232');
        await userEvent.type(addressInput, 'NewYork');
        await userEvent.click(checkoutBtn as HTMLElement);
        const errorMessage = await findByText('Please provide a valid phone');
        expect(errorMessage).toBeTruthy();
    })
})
