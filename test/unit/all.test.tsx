import { it, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Provider } from 'react-redux';
import { initStore } from "../../src/client/store";
import { Application } from "../../src/client/Application";
import React from "react";
import { CartState } from "../../src/common/types";
import userEvent from "@testing-library/user-event";
import { waitForElementToBeRemoved } from "@testing-library/react";


const productsData = [
    {
        "id": 0,
        "name": "Handmade Pizza",
        "price": 509
    },
    {
        "id": 1,
        "name": "Unbranded Chips",
        "price": 35
    },
    {
        "id": 2,
        "name": "Generic Pants",
        "price": 106
    },
    {
        "id": 3,
        "name": "Rustic Ball",
        "price": 999
    },
    {
        "id": 4,
        "name": "Generic Chips",
        "price": 250
    },
    {
        "id": 5,
        "name": "Generic Bike",
        "price": 438
    },
    {
        "id": 6,
        "name": "Handmade Sausages",
        "price": 320
    },
    {
        "id": 7,
        "name": "Generic Salad",
        "price": 608
    },
    {
        "id": 8,
        "name": "Handmade Hat",
        "price": 224
    },
    {
        "id": 9,
        "name": "Fantastic Car",
        "price": 291
    },
    {
        "id": 10,
        "name": "Intelligent Towels",
        "price": 382
    },
    {
        "id": 11,
        "name": "Handmade Chicken",
        "price": 322
    },
    {
        "id": 12,
        "name": "Intelligent Chair",
        "price": 2
    },
    {
        "id": 13,
        "name": "Licensed Gloves",
        "price": 945
    },
    {
        "id": 14,
        "name": "Incredible Pants",
        "price": 470
    },
    {
        "id": 15,
        "name": "Practical Tuna",
        "price": 225
    },
    {
        "id": 16,
        "name": "Licensed Bike",
        "price": 404
    },
    {
        "id": 17,
        "name": "Ergonomic Cheese",
        "price": 557
    },
    {
        "id": 18,
        "name": "Incredible Sausages",
        "price": 421
    },
    {
        "id": 19,
        "name": "Intelligent Shirt",
        "price": 513
    },
    {
        "id": 20,
        "name": "Unbranded Chips",
        "price": 709
    },
    {
        "id": 21,
        "name": "Ergonomic Bike",
        "price": 814
    },
    {
        "id": 22,
        "name": "Licensed Mouse",
        "price": 518
    },
    {
        "id": 23,
        "name": "Awesome Hat",
        "price": 23
    },
    {
        "id": 24,
        "name": "Incredible Hat",
        "price": 734
    },
    {
        "id": 25,
        "name": "Ergonomic Towels",
        "price": 550
    },
    {
        "id": 26,
        "name": "Intelligent Towels",
        "price": 176
    }
]

const productDetailsData = {
    "description": "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    "color": "grey",
    "material": "Concrete",
}

let checkoutCount = 1
const getCheckoutRes = () => { return { "id": checkoutCount++ } };

const mockCart = {
    getState(): CartState {
        try {
            const json = localStorage.getItem('test-store-cart');
            return json ? JSON.parse(json) as CartState : {};
        } catch {
            return {};
        }
    },
    setState(cart: CartState) {
        localStorage.setItem('test-store-cart', JSON.stringify(cart));
    }
} as any;

const mockApi = {
    basename: '/hw/store',
    getProducts: jest.fn(async () => {
        return await Promise.resolve({ data: productsData });
    }),

    getProductById: jest.fn(async (id: number) => {
        const data = productsData.find(product => product.id === id) as any
        const result = Object.assign({}, data, productDetailsData);
        return await Promise.resolve({ data: result });
    }),

    checkout: jest.fn(() => {
        Promise.resolve(getCheckoutRes());
    }),
} as any;
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
            const catalogHref = hrefs.find(href => href.includes('delivery'))
            expect(catalogHref).toBeTruthy();
        });

        it('отображается ссылка Contacts', () => {
            const catalogHref = hrefs.find(href => href.includes('contacts'))
            expect(catalogHref).toBeTruthy();
        });

        it('отображается ссылка Cart', () => {
            const catalogHref = hrefs.find(href => href.includes('cart'))
            expect(catalogHref).toBeTruthy();
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

        it('по адресу "/catalog" должна открываться страница "Каталог" ("catalog")', () => {
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

        it('по адресу /delivery должна открываться страница "Условия доставки" ("delivery")', () => {
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

        it('по адресу /contacts должна открываться страница "Контакты" ("contacts")', () => {
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

it('по адресу /catalog должна открываться страница "Catalog и быть товары"', async () => {
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
        // const cartClear = container.querySelector('.Cart-Clear');
        const cartClear = container.getElementsByClassName('Cart-Clear')[0];
        expect(cartClear).toBeTruthy();
        userEvent.click(cartClear as HTMLElement);
        await waitForElementToBeRemoved(container.querySelector('.Cart-Table'));
        const cartTable = container.querySelector('.Cart-Table');
        expect(cartTable).toBeNull();
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
        // let cart = {};
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
})