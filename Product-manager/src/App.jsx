import React, { useState, useEffect } from 'react';
import { Check, Edit2, Image, Package, Plus, X } from 'lucide-react';
import './App.css';

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '', price: '', info: '' });

  const resetForm = () => {
    setFormData({ name: '', image: '', price: '', info: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    const { name, price, image, info } = formData;
    if (!name.trim() || !price.trim()) {
      alert('Please fill required fields: name and price');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      alert('Price must be a valid number');
      return;
    }

    if (editingId) {
      setProducts(products.map(p => (p.id === editingId ? { ...formData, id: editingId, price: parsedPrice } : p)));
    } else {
      setProducts([...products, { id: Date.now(), name, image, price: parsedPrice, info }]);
    }
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, image: product.image, price: product.price.toString(), info: product.info });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="body">
      <h1 className="heading">Product Card Generator</h1>
      <p className="sub-heading">Create and Manage Beautiful Product Cards</p>

      <button className="btn" onClick={() => setShowForm(true)} aria-label="Add New Product">
        <Plus size={20} /> Add New Product
      </button>

      {showForm && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="modal-content">
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <button className="close" onClick={resetForm} aria-label="Close Form">
              <X size={20} />
            </button>

            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              required
            />
            <input
              name="image"
              type="url"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="Image URL (optional)"
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Product Price"
              step="0.01"
              min="0"
              required
            />
            <textarea
              name="info"
              rows={3}
              value={formData.info}
              onChange={handleInputChange}
              placeholder="Product Description (optional)"
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-reset" onClick={resetForm}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit}>
                <Check size={18} /> {editingId ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <Package size={80} />
          <h3>No Products yet</h3>
          <p>Click "Add New Product" to create your product card</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div className="product-card" key={product.id}>
              <div className="card-image-container">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                  />
                ) : (
                  <div className="image-placeholder visible">
                    <Image size={48} />
                  </div>
                )}
                <div className="card-actions">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(product)} aria-label="Edit Product">
                    <Edit2 size={16} />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(product.id)} aria-label="Delete Product">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="card-content">
                <h3>{product.name}</h3>
                <div className="price-value">
                  <p>${product.price.toFixed(2)}</p>
                </div>
                {product.info && <p className="info">{product.info}</p>}
                <button aria-label={`Add ${product.name} to Cart`}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;