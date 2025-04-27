import React, { useEffect, useState } from "react";
import axios from "axios";
import "./list.css";

const List = () => {
    const [list, setList] = useState([]);
    const [deletingId, setDeletingId] = useState(null);

    const backendUrl = "http://localhost:3000"; // your real backend

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/products`);
                setList(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                alert('Failed to load products');
            }
        };
        fetchItems();
    }, []);

    const deleteItem = async (id) => {
        try {
            setDeletingId(id);
            await axios.delete(`${backendUrl}/api/products/${id}`);
            setList(prevList => prevList.filter(item => item.ID !== id));
            alert('Product deleted successfully!');
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="list-container">
            <h1>Food Products</h1>
            <div className="list-header">
                <div className="header-item">Name</div>
                <div className="header-item">Category</div>
                <div className="header-item">Price</div>
                <div className="header-item">Supplier ID</div>
                <div className="header-item">Actions</div>
            </div>

            {list.map((item) => (
                <div key={item.ID} className="list-item">
                    <div className="item-row">
                        <div className="item-cell">{item.NAME}</div>
                        <div className="item-cell">{item.CATEGORY}</div>
                        <div className="item-cell">${item.PRICE}</div>
                        <div className="item-cell">{item.SUPPLIER_ID}</div>
                        <div className="item-cell actions">
                            <button
                                className={`button delete-btn ${deletingId === item.ID ? 'deleting' : ''}`}
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this product?')) {
                                        deleteItem(item.ID);
                                    }
                                }}
                                disabled={deletingId === item.ID}
                            >
                                {deletingId === item.ID ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default List;
