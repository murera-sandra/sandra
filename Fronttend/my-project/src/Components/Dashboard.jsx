import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("suppliers");
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [supplierForm, setSupplierForm] = useState({
    supplierCode: "",
    companyName: "",
    phone: "",
  });

  const [materialForm, setMaterialForm] = useState({
    materialCode: "",
    name: "",
    unit: "kg",
    unitPrice: "",
    currentStock: "",
  });

  const [stockInForm, setStockInForm] = useState({
    materialId: "",
    supplierId: "",
    quantity: "",
  });

  const [stockOutForm, setStockOutForm] = useState({
    materialId: "",
    quantity: "",
  });

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadSuppliersAndMaterials = async () => {
    if (!token) return;
    try {
      const [supRes, matRes] = await Promise.all([
        api.get("/api/suppliers", authHeaders),
        api.get("/api/materials", authHeaders),
      ]);
      setSuppliers(supRes.data.data || []);
      setMaterials(matRes.data.data || []);
    } catch {
      // ignore for now, basic demo
    }
  };

  useEffect(() => {
    loadSuppliersAndMaterials();
  }, []);

  const handleLogout = async () => {
    try {
      if (token) {
        await api.post("/api/auth/logout", {}, authHeaders);
      }
    } catch {
      // ignore backend errors on logout, just clear client state
    } finally {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/suppliers", supplierForm, authHeaders);
      setSupplierForm({ supplierCode: "", companyName: "", phone: "" });
      loadSuppliersAndMaterials();
    } catch {
      // handle error in real app
    }
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/materials",
        {
          ...materialForm,
          unitPrice: Number(materialForm.unitPrice || 0),
          currentStock: Number(materialForm.currentStock || 0),
        },
        authHeaders
      );
      setMaterialForm({
        materialCode: "",
        name: "",
        unit: "kg",
        unitPrice: "",
        currentStock: "",
      });
      loadSuppliersAndMaterials();
    } catch {
      // handle error in real app
    }
  };

  const handleStockInSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/stock/in",
        {
          materialId: stockInForm.materialId,
          supplierId: stockInForm.supplierId,
          quantity: Number(stockInForm.quantity || 0),
        },
        authHeaders
      );
      setStockInForm({ materialId: "", supplierId: "", quantity: "" });
      loadSuppliersAndMaterials();
    } catch {
      // handle error
    }
  };

  const handleStockOutSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/stock/out",
        {
          materialId: stockOutForm.materialId,
          quantity: Number(stockOutForm.quantity || 0),
        },
        authHeaders
      );
      setStockOutForm({ materialId: "", quantity: "" });
      loadSuppliersAndMaterials();
    } catch {
      // handle error
    }
  };

  if (!token) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* Header Navigation */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo-text">Inventory Simplified</h1>
          </div>
          <nav className="main-nav">
            <button
              className={`nav-tab ${activeTab === "suppliers" ? "active" : ""}`}
              onClick={() => setActiveTab("suppliers")}
            >
              Suppliers
            </button>
            <button
              className={`nav-tab ${activeTab === "materials" ? "active" : ""}`}
              onClick={() => setActiveTab("materials")}
            >
              Materials
            </button>
            <button
              className={`nav-tab ${activeTab === "stockIn" ? "active" : ""}`}
              onClick={() => setActiveTab("stockIn")}
            >
              Stock In
            </button>
            <button
              className={`nav-tab ${activeTab === "stockOut" ? "active" : ""}`}
              onClick={() => setActiveTab("stockOut")}
            >
              Stock Out
            </button>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-wrapper">
          {/* Suppliers Tab */}
          {activeTab === "suppliers" && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Suppliers</h2>
                <p className="section-subtitle">Manage your supplier information</p>
              </div>

              <div className="card">
                <h3 className="card-title">Add New Supplier</h3>
                <form onSubmit={handleSupplierSubmit} className="form-grid">
                  <div className="form-group">
                    <label>Supplier Code</label>
                    <input
                      type="text"
                      placeholder="Enter supplier code"
                      value={supplierForm.supplierCode}
                      onChange={(e) =>
                        setSupplierForm({ ...supplierForm, supplierCode: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={supplierForm.companyName}
                      onChange={(e) =>
                        setSupplierForm({ ...supplierForm, companyName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={supplierForm.phone}
                      onChange={(e) =>
                        setSupplierForm({ ...supplierForm, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <button type="submit" className="btn-primary">
                      Add Supplier
                    </button>
                  </div>
                </form>
              </div>

              <div className="card">
                <h3 className="card-title">Supplier List</h3>
                {suppliers.length === 0 ? (
                  <div className="empty-state">
                    <p>No suppliers added yet. Add your first supplier above.</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Company Name</th>
                          <th>Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers.map((s) => (
                          <tr key={s._id}>
                            <td className="code-cell">{s.supplierCode}</td>
                            <td>{s.companyName}</td>
                            <td>{s.phone || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Raw Materials</h2>
                <p className="section-subtitle">Track and manage your inventory materials</p>
              </div>

              <div className="card">
                <h3 className="card-title">Add New Material</h3>
                <form onSubmit={handleMaterialSubmit} className="form-grid">
                  <div className="form-group">
                    <label>Material Code</label>
                    <input
                      type="text"
                      placeholder="Enter material code"
                      value={materialForm.materialCode}
                      onChange={(e) =>
                        setMaterialForm({ ...materialForm, materialCode: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Material Name</label>
                    <input
                      type="text"
                      placeholder="Enter material name"
                      value={materialForm.name}
                      onChange={(e) =>
                        setMaterialForm({ ...materialForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <select
                      value={materialForm.unit}
                      onChange={(e) =>
                        setMaterialForm({ ...materialForm, unit: e.target.value })
                      }
                      required
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="pcs">pcs</option>
                      <option value="L">L</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Unit Price</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={materialForm.unitPrice}
                      onChange={(e) =>
                        setMaterialForm({ ...materialForm, unitPrice: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Initial Stock</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={materialForm.currentStock}
                      onChange={(e) =>
                        setMaterialForm({
                          ...materialForm,
                          currentStock: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <button type="submit" className="btn-primary">
                      Add Material
                    </button>
                  </div>
                </form>
              </div>

              <div className="card">
                <h3 className="card-title">Materials Inventory</h3>
                {materials.length === 0 ? (
                  <div className="empty-state">
                    <p>No materials added yet. Add your first material above.</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Stock</th>
                          <th>Unit</th>
                          <th>Unit Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materials.map((m) => (
                          <tr key={m._id}>
                            <td className="code-cell">{m.materialCode}</td>
                            <td className="name-cell">{m.name}</td>
                            <td className="stock-cell">{m.currentStock || 0}</td>
                            <td>{m.unit}</td>
                            <td className="price-cell">${m.unitPrice || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stock In Tab */}
          {activeTab === "stockIn" && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Stock In</h2>
                <p className="section-subtitle">Record incoming inventory</p>
              </div>

              <div className="card">
                <h3 className="card-title">Add Stock In</h3>
                <form onSubmit={handleStockInSubmit} className="form-grid">
                  <div className="form-group">
                    <label>Material</label>
                    <select
                      value={stockInForm.materialId}
                      onChange={(e) =>
                        setStockInForm({ ...stockInForm, materialId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Material</option>
                      {materials.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.materialCode} - {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Supplier</label>
                    <select
                      value={stockInForm.supplierId}
                      onChange={(e) =>
                        setStockInForm({ ...stockInForm, supplierId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.supplierCode} - {s.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      value={stockInForm.quantity}
                      onChange={(e) =>
                        setStockInForm({ ...stockInForm, quantity: e.target.value })
                      }
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <button type="submit" className="btn-primary">
                      Record Stock In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Stock Out Tab */}
          {activeTab === "stockOut" && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Stock Out</h2>
                <p className="section-subtitle">Record outgoing inventory</p>
              </div>

              <div className="card">
                <h3 className="card-title">Add Stock Out</h3>
                <form onSubmit={handleStockOutSubmit} className="form-grid">
                  <div className="form-group">
                    <label>Material</label>
                    <select
                      value={stockOutForm.materialId}
                      onChange={(e) =>
                        setStockOutForm({ ...stockOutForm, materialId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Material</option>
                      {materials.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.materialCode} - {m.name} (Current: {m.currentStock} {m.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      value={stockOutForm.quantity}
                      onChange={(e) =>
                        setStockOutForm({ ...stockOutForm, quantity: e.target.value })
                      }
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <button type="submit" className="btn-primary">
                      Record Stock Out
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
