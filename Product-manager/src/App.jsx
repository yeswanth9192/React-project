import React, { useState, useEffect } from 'react';
import { Check, Edit2, Image, Package, Plus, X } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    info: ''
  });

  const resetForm = () => {
    setFormData({ name: '', image: '', price: '', info: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.price.trim()) {
      alert('Please fill required fields name and price');
      return;
    }

    const parsedPrice = parseFloat(formData.price) || 0;
    if (editingId) {
      setProducts(products.map(product =>
        product.id === editingId
          ? { ...formData, id: editingId, price: parsedPrice }
          : product
      ));
    } else {
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: parsedPrice
      };
      setProducts([...products, newProduct]);
    }
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      image: product.image,
      price: product.price.toString(),
      info: product.info
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="body">
      <h1 className="heading">Product Card Generator</h1>
      <p className="sub-heading">Create and Manage Beautiful Product Cards</p>

      <button className="btn" onClick={() => setShowForm(true)}>
        <Plus size={20} /> Add New Product
      </button>

      {showForm && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="modal-content">
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>

            <button className="close" onClick={resetForm}>
              <X size={20} />
            </button>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              required
            />

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="Image URL (optional)"
            />

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Product Price"
              step="0.01"
              min="0"
              required
            />

            <textarea
              name="info"
              value={formData.info}
              onChange={handleInputChange}
              placeholder="Product Description (optional)"
              rows={3}
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
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="image-placeholder visible">
                    <Image size={48} />
                  </div>
                )}

                <div className="card-actions">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(product)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(product.id)}>
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
                <button>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
