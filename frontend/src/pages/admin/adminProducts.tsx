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
  const products = useAppSelector(
    (s) => s.adminProducts.products
  );

  /* ---------- ADD PRODUCT STATES ---------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  /* ---------- EDIT STATES ---------- */
  const [editingId, setEditingId] =
    useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editDescription, setEditDescription] =
    useState("");

  const [editImages, setEditImages] =
    useState<File[]>([]);
  const [editPreview, setEditPreview] =
    useState<string[]>([]);

  /* ---------- FETCH PRODUCTS ---------- */
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  console.log(products);

  /* ---------- ADD IMAGE SELECT ---------- */
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if(!e.target.files) return;

    const files = Array.from(e.target.files);

      setImages(files);

      const previews = files.map((file) => 
        URL.createObjectURL(file)
      );

      setPreview(previews);
  };

  /* ---------- ADD PRODUCT ---------- */
  const handleAddProduct = () => {
    if (!title || !description) return;

    if (Number(newPrice) <= 0) return;

    if (Number(newStock) <= 0) return;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", newPrice);
    formData.append("countInStock", newStock);

    images.forEach((file) => {
      formData.append("images", file);
    });

    dispatch(addProduct(formData));

    setTitle("");
    setDescription("");
    setNewPrice("");
    setNewStock("");
    setImages([]);
    setPreview([]);
  };

  /* ---------- EDIT START ---------- */
  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setPrice(String(product.price));
    setStock(String(product.countInStock));
    setEditDescription(product.description || "");

    setEditPreview(product.images || []);
  };

  /* ---------- SAVE EDIT ---------- */
  const saveEdit = (id: string) => {
    const formData = new FormData();

    formData.append("price", price);
    formData.append("countInStock", stock);
    formData.append("description", editDescription);

    editImages.forEach((file) => {
      formData.append("images", file);
    });

    dispatch(updateProduct({ id, formData }));

    setEditingId(null);
    setEditImages([]);
    setEditPreview([]);
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">
        Products
      </h1>

      {/* ---------- ADD PRODUCT FORM ---------- */}
      <div className="mb-6 flex gap-4 flex-wrap items-center">
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
  rows={1}
  className="bg-black border border-gray-700 px-3 py-1 w-64 resize-none"
/>

        <input
          type="number"
          value={newPrice}
          onChange={(e) =>
            setNewPrice(e.target.value)
          }
          placeholder="Price"
          className="bg-black border border-gray-700 px-3 py-1"
        />

        <input
          type="number"
          value={newStock}
          onChange={(e) =>
            setNewStock(e.target.value)
          }
          placeholder="Stock"
          className="bg-black border border-gray-700 px-3 py-1"
        />

        <label className="bg-yellow-500 px-4 py-1 rounded cursor-pointer">
          Add Image
          <input
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        <button
          onClick={handleAddProduct}
          className="bg-green-600 px-4 py-1 rounded"
        >
          Add Product
        </button>
      </div>

      
      <div>
        {preview.map((p, i) => (
          <img
            key={i}
            src={p}
            className="w-20 h-20 object-cover rounded"
          />
        ))}
      </div>
  
      {/* ---------- PRODUCT TABLE ---------- */}
      <table className="w-full text-sm border border-gray-800">
        <thead className="bg-black">
          <tr>
            <th className="p-3">Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr
              key={p._id}
              className="border-t border-gray-800"
            >
              <td className="p-3 flex gap-2">
                {p.images?.slice(0,3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="w-12 h-12 object-cover rounded"
                  />
                ))}
              </td>
              <td className="p-3">{p.title}</td>

              <td>
                {editingId === p._id ? (
                  <textarea
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(
                        e.target.value
                      )
                    }
                    className="bg-black border border-gray-700 px-2"
                    rows={2}
                  />
                ) : (
                  p.description
                )}
              </td>

              <td>
                {editingId === p._id ? (
                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
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
                    onChange={(e) =>
                      setStock(e.target.value)
                    }
                    className="bg-black border border-gray-700 w-16 px-2"
                  />
                ) : (
                  p.countInStock
                )}
              </td>

              <td className="flex flex-col gap-2">
                {editingId === p._id ? (
                  <>
                    <label className="bg-yellow-500 px-2 py-1 rounded cursor-pointer text-sm">
                      Change Image
                      <input
                        type="file"
                        multiple
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          if (!e.target.files) return;

                          const files = Array.from(e.target.files);

                          setEditImages(files);

                          const previews = files.map((file) => 
                            URL.createObjectURL(file)
                          );

                          setEditPreview(previews);
                        }}
                      />
                    </label>
                    

                    <div>
                      {editPreview.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="w-20 rounded"
                        />
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        saveEdit(p._id)
                      }
                      className="text-green-400"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        startEdit(p)
                      }
                      className="text-yellow-400"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        dispatch(
                          deleteProduct(p._id)
                        )
                      }
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