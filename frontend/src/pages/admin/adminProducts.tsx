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
  const products = useAppSelector(s => s.adminProducts.products);

  const [title, setTitle] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [newStock, setNewStock] = useState<string>("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");


  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  const handleAddProduct = () => {
    if (!title || !newPrice || !newStock) return;

    dispatch(
      addProduct({
        title,
        price: Number(newPrice),
        countInStock: Number(newStock),
      })
    );

    setTitle("");
    setNewPrice("");
    setNewStock("");
  };

  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setPrice(String(product.price));
    setStock(String(product.countInStock));
  };

  const saveEdit = (id: string) => {
    dispatch(
      updateProduct({
        id,
        price: Number(price),
        countInStock: Number(stock),
      })
    );
    setEditingId(null);
  };


  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">Products</h1>

        {/* add product form */}
      <div className="mb-6 flex gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product title"
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
          className="bg-green-600 px-4 py-1 rounded"  
        >
          Add Product
        </button>
      </div>

      {/* product table */}
      <table className="w-full text-sm border border-gray-800">
        <thead className="bg-black">
          <tr>
            <th className="p-3">Title</th>
            <th>Price</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t border-gray-800">
              <td className="p-3">{p.title}</td>
              {/* price */}
              <td>
                {editingId === p._id ? (
                  <input
                   type="number"
                   value={price}
                   onChange={(e) => setPrice(e.target.value)}
                   className="bg-black border border-gray-700 w-20 px-2" 
                  />
                ) : (
                  `${p.price}`
                )}
              </td>

              {/* stock */}
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

              {/* actions */}
              <td className="flex gap-3">
                {editingId === p._id ? (
                  <button
                  onClick={() => saveEdit(p._id)}
                  className="text-green-400"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(p)}
                    className="text-yellow-400"
                  >
                    Edit
                  </button>
                )}


                <button
                  onClick={() => dispatch(deleteProduct(p._id))}
                  className="text-red-400"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
