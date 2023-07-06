import { CartState } from "../../src/common/types";

export const productsData = [
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

export const productDetailsData = {
    "description": "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    "color": "grey",
    "material": "Concrete",
}

export const mockCart = {
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

export const mockApi = {
    basename: '/hw/store',
    getProducts: jest.fn(async () => {
        return await Promise.resolve({ data: productsData });
    }),

    getProductById: jest.fn(async (id: number) => {
        const data = productsData.find(product => product.id === id) as any
        const result = Object.assign({}, data, productDetailsData);
        return await Promise.resolve({ data: result });
    }),

    checkout: jest.fn(async () => {
        return await Promise.resolve({ data: { id: 12 } });
    }),
} as any;