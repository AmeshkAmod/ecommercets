import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { Product } from "../../types/product";
import AdminLayout from "./AdminLayout";

import {
  fetchProducts,
  deleteProduct,
  updateProduct,
  addProduct,
} from "../../store/slice/adminProductSlice";

export default function AdminProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.adminProducts.products);

  /* ---------- ADD PRODUCT STATES ---------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  const [images, setImages] = useState<FileList | null>(null);

  /* ---------- EDIT STATES ---------- */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [editImages, setEditImages] = useState<FileList | null>(null);

  /* ---------- FETCH PRODUCTS ---------- */
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ---------- ADD PRODUCT ---------- */
  const handleAddProduct = () => {
  if (!title || !description || !newPrice || !newStock) return;

  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", newPrice);
  formData.append("countInStock", newStock);

  if (images) {
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
  }

  dispatch(addProduct(formData as any));

  setTitle("");
  setDescription("");
  setNewPrice("");
  setNewStock("");
  setImages(null);
};

  /* ---------- EDIT START ---------- */
  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setPrice(String(product.price));
    setStock(String(product.countInStock));
    setEditDescription(product.description || "");
  };

  /* ---------- SAVE EDIT ---------- */
  const saveEdit = (id: string) => {
    const formData = new FormData();

    formData.append("price", price);
    formData.append("countInStock", stock);
    formData.append("description", editDescription);

    if (editImages) {
      for (let i = 0; i < editImages.length; i++) {
        formData.append("images", editImages[i]);
      }
    }

    dispatch(updateProduct({ id, formData } as any));

    setEditingId(null);
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">Products</h1>

      {/* ---------- ADD PRODUCT FORM ---------- */}
      <div className="mb-6 flex flex-col gap-3">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product title"
          className="bg-black border border-gray-700 px-3 py-1"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description"
          rows={2}
          className="bg-black border border-gray-700 px-3 py-1"
        />

        {/* MULTIPLE IMAGE UPLOAD */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="bg-black border border-gray-700 px-3 py-1"
        />

        <input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          placeholder="Price"
          className="bg-black border border-gray-700 px-3 py-1"
        />

        <input
          type="number"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          placeholder="Stock"
          className="bg-black border border-gray-700 px-3 py-1"
        />

        <button
          onClick={handleAddProduct}
          className="bg-green-600 px-4 py-1 rounded w-fit"
        >
          Add Product
        </button>
      </div>

      {/* ---------- PRODUCT TABLE ---------- */}
      <table className="w-full text-sm border border-gray-800">
        <thead className="bg-black">
          <tr>
            <th className="p-3">Title</th>
            <th>Description</th>
            <th>Images</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t border-gray-800">

              <td className="p-3">{p.title}</td>

              <td>
                {editingId === p._id ? (
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                    className="bg-black border border-gray-700 px-2"
                  />
                ) : (
                  p.description
                )}
              </td>

              {/* PRODUCT IMAGES */}
              <td className="flex gap-2">
                {p.images?.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-12 h-12 object-cover rounded"
                  />
                ))}
              </td>

              <td>
                {editingId === p._id ? (
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-black border border-gray-700 w-20 px-2"
                  />
                ) : (
                  `₹${p.price}`
                )}
              </td>

              <td>
                {editingId === p._id ? (
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="bg-black border border-gray-700 w-16 px-2"
                  />
                ) : (
                  p.countInStock
                )}
              </td>

              <td className="flex flex-col gap-2">
                {editingId === p._id ? (
                  <>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setEditImages(e.target.files)}
                      className="text-xs"
                    />

                    <button
                      onClick={() => saveEdit(p._id)}
                      className="text-green-400"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(p)}
                      className="text-yellow-400"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => dispatch(deleteProduct(p._id))}
                      className="text-red-400"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}