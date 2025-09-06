import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import PRODUCT_APIs from "../../src/handlers/apis/product-apis"; // Adjust path as needed
import { IProduct } from "../../src/handlers/interfaces/products"; // Adjust path as needed

const mock = new AxiosMockAdapter(axios);
const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`;

const mockProduct: IProduct = {
  id: 1,
  name: "Test Product",
  price: 100,
  description: "A test product",
  category: "Electronics",
  stock: 10,
  imageUrl: "http://example.com/image.jpg",
};

describe("PRODUCT_APIs", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should fetch all products", async () => {
    mock.onGet(BASE_URL).reply(200, [mockProduct]);

    const response = await PRODUCT_APIs.getProducts();

    expect(response.status).toBe(200);
    expect(response.data).toEqual([mockProduct]);
  });

  it("should fetch a single product by ID", async () => {
    const productId = 1;
    mock.onGet(`${BASE_URL}/${productId}`).reply(200, mockProduct);

    const response = await PRODUCT_APIs.getProduct(productId);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockProduct);
  });

  it("should add a new product", async () => {
    mock.onPost(BASE_URL).reply(201, mockProduct);

    const response = await PRODUCT_APIs.addProduct(mockProduct);

    expect(response.status).toBe(201);
    expect(response.data).toEqual(mockProduct);
  });

  it("should update an existing product", async () => {
    const updatedProduct = { ...mockProduct, name: "Updated Name" };
    mock.onPut(`${BASE_URL}/${mockProduct.id}`).reply(200, updatedProduct);

    const response = await PRODUCT_APIs.updateProduct(
      mockProduct.id,
      updatedProduct
    );

    expect(response.status).toBe(200);
    expect(response.data.name).toBe("Updated Name");
  });

  it("should delete a product by ID", async () => {
    mock
      .onDelete(`${BASE_URL}/${mockProduct.id}`)
      .reply(200, { success: true });

    const response = await PRODUCT_APIs.deleteProduct(
      mockProduct.id.toString()
    );

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
  });
});
