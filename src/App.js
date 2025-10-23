              <div className="space-y-2">
                {kegs
                  .filter(k => k.lastCleaned)
                  .sort((a, b) => new Date(b.lastCleaned) - new Date(a.lastCleaned))
                  .slice(0, 10)
                  .map(k => (
                    <div key={k.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{k.id}</p>
                        <p className="text-sm text-gray-600">Last cleaned: {k.lastCleaned}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        k.condition === 'Good' ? 'bg-green-100 text-green-700' :
                        k.condition === 'Needs Cleaning' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {k.condition}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {view === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            
            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-4">Fleet Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Kegs:</span>
                    <span className="font-bold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilization:</span>
                    <span className="font-bold text-green-600">{stats.utilization}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Turns:</span>
                    <span className="font-bold">{stats.avgTurns}/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fleet Value:</span>
                    <span className="font-bold">${stats.totalValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-4">Status Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">At Customers:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: `${(stats.atCustomers / stats.total) * 100}%`}}></div>
                      </div>
                      <span className="font-bold">{stats.atCustomers}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Filled & Ready:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(stats.filled / stats.total) * 100}%`}}></div>
                      </div>
                      <span className="font-bold">{stats.filled}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Empty:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-600 h-2 rounded-full" style={{width: `${(stats.empty / stats.total) * 100}%`}}></div>
                      </div>
                      <span className="font-bold">{stats.empty}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Maintenance:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{width: `${(stats.maintenance / stats.total) * 100}%`}}></div>
                      </div>
                      <span className="font-bold">{stats.maintenance}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-4">Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposits Held:</span>
                    <span className="font-bold text-green-600">${stats.deposits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fleet Value:</span>
                    <span className="font-bold">${stats.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lost Kegs:</span>
                    <span className="font-bold text-red-600">{stats.lost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lost Value:</span>
                    <span className="font-bold text-red-600">${stats.lost * 130}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Product Distribution</h3>
              <div className="space-y-2">
                {productList.map(p => {
                  const count = kegs.filter(k => k.product === p.name).length;
                  return (
                    <div key={p.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-gray-600">{p.style} · {p.abv}% ABV</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div className="bg-blue-600 h-3 rounded-full" style={{width: `${(count / stats.total) * 100}%`}}></div>
                        </div>
                        <span className="font-bold min-w-[40px] text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Activity */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Top Customers by Kegs</h3>
              <div className="space-y-3">
                {customers
                  .sort((a, b) => b.kegsOut - a.kegsOut)
                  .slice(0, 5)
                  .map(c => (
                    <div key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-sm text-gray-600">{c.deliveryDay} delivery</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{c.kegsOut}</p>
                        <p className="text-xs text-gray-600">kegs out</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings & Configuration</h2>
            
            {/* User Management Section */}
            {currentUser?.role === 'admin' && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users className="text-blue-600" />
                    User Management
                  </h3>
                  <button 
                    onClick={() => setModal('addUser')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <UserPlus size={20} />
                    Invite User
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-800 font-semibold">ℹ️ User Management</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Create user accounts for your team. All transactions will be tracked by user email and synced in real-time across all devices.
                    </p>
                  </div>
                  
                  {users.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No users yet. Create the first user account.</p>
                  ) : (
                    users.map(user => (
                      <div key={user.uid} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div>
                          <p className="font-semibold">{user.name || user.email}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role || 'user'}
                            </span>
                            {user.createdAt && (
                              <span className="text-xs text-gray-500">
                                Created: {new Date(user.createdAt.seconds * 1000).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {user.uid !== currentUser?.uid && (
                            <button 
                              onClick={() => {
                                if (window.confirm(`Delete user ${user.email}?`)) {
                                  handleDeleteUser(user.uid);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* Products Management */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Products</h3>
                <button 
                  onClick={() => { setEditingItem(null); setModal('addProduct'); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>
              <div className="space-y-2">
                {productList.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-gray-600">{p.style} · {p.abv}% ABV · {p.ibu} IBU</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem({ type: 'product', data: p, index: idx });
                            setModal('editProduct');
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteConfirm({ type: 'product', item: p, index: idx });
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Camera Permission</p>
                    <p className="text-sm text-gray-600">Current status: {cameraPermission}</p>
                  </div>
                  {cameraPermission === 'denied' && (
                    <button 
                      onClick={() => {
                        localStorage.removeItem('cameraPermission');
                        setCameraPermission('prompt');
                        alert('Camera permission reset. You will be asked again next time you scan.');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Reset Permission
                    </button>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Default Overdue Threshold</p>
                    <p className="text-sm text-gray-600">Kegs flagged as overdue after 30 days</p>
                  </div>
                  <input 
                    type="number" 
                    defaultValue="30"
                    className="w-20 px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Current User</p>
                    <p className="text-sm text-gray-600">{currentUser?.email} ({currentUser?.role || 'user'})</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Dashboard View */}
        {view === 'financial' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Financial Dashboard</h2>
              <button 
                onClick={() => exportData('financial')} 
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
              >
                <Download size={20} />
                Export Financial Report
              </button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <DollarSign className="mb-2" size={32} />
                <p className="text-3xl font-bold">${stats.deposits.toLocaleString()}</p>
                <p className="text-sm opacity-90">Total Deposits Held</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <Users className="mb-2" size={32} />
                <p className="text-3xl font-bold">
                  ${customers.reduce((sum, c) => sum + c.currentBalance, 0).toLocaleString()}
                </p>
                <p className="text-sm opacity-90">Total Receivables</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <TrendingUp className="mb-2" size={32} />
                <p className="text-3xl font-bold">
                  ${customers.reduce((sum, c) => sum + c.creditLimit, 0).toLocaleString()}
                </p>
                <p className="text-sm opacity-90">Total Credit Extended</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                <Package className="mb-2" size={32} />
                <p className="text-3xl font-bold">${(stats.total * 130).toLocaleString()}</p>
                <p className="text-sm opacity-90">Keg Fleet Value</p>
              </div>
            </div>

            {/* Customer Financial Details */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Customer Account Status</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Kegs Out</th>
                      <th className="text-right py-3 px-4">Deposit Balance</th>
                      <th className="text-right py-3 px-4">Current Balance</th>
                      <th className="text-right py-3 px-4">Credit Limit</th>
                      <th className="text-right py-3 px-4">Available Credit</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => {
                      const availableCredit = c.creditLimit - c.currentBalance;
                      const creditUtilization = (c.currentBalance / c.creditLimit * 100).toFixed(0);
                      
                      return (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{c.name}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded ${c.kegsOut > 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                              {c.kegsOut}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4 font-semibold text-green-600">${c.depositBalance}</td>
                          <td className="text-right py-3 px-4 font-semibold">${c.currentBalance}</td>
                          <td className="text-right py-3 px-4 text-gray-600">${c.creditLimit}</td>
                          <td className="text-right py-3 px-4">
                            <span className={`font-semibold ${availableCredit < 500 ? 'text-red-600' : 'text-green-600'}`}>
                              ${availableCredit}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              c.status === 'Active' ? 'bg-green-100 text-green-700' :
                              c.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold">
                      <td className="py-3 px-4">TOTALS</td>
                      <td className="py-3 px-4">{customers.reduce((sum, c) => sum + c.kegsOut, 0)}</td>
                      <td className="text-right py-3 px-4 text-green-600">
                        ${customers.reduce((sum, c) => sum + c.depositBalance, 0)}
                      </td>
                      <td className="text-right py-3 px-4">
                        ${customers.reduce((sum, c) => sum + c.currentBalance, 0)}
                      </td>
                      <td className="text-right py-3 px-4">
                        ${customers.reduce((sum, c) => sum + c.creditLimit, 0)}
                      </td>
                      <td className="text-right py-3 px-4">
                        ${customers.reduce((sum, c) => sum + (c.creditLimit - c.currentBalance), 0)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Deposit Reconciliation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Deposit Reconciliation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Expected Deposits (Kegs Out)</span>
                    <span className="font-bold">${kegs.filter(k => k.customer).length * 30}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Deposits on Account</span>
                    <span className="font-bold text-green-600">
                      ${customers.reduce((sum, c) => sum + c.depositBalance, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-2 border-blue-500">
                    <span className="font-bold text-blue-700">Variance</span>
                    <span className="font-bold text-blue-700">
                      ${Math.abs((kegs.filter(k => k.customer).length * 30) - customers.reduce((sum, c) => sum + c.depositBalance, 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Credit Alerts</h3>
                <div className="space-y-2">
                  {customers.filter(c => (c.currentBalance / c.creditLimit) > 0.8).map(c => (
                    <div key={c.id} className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="font-semibold text-red-700">{c.name}</p>
                      <p className="text-sm text-red-600">
                        {((c.currentBalance / c.creditLimit) * 100).toFixed(0)}% credit utilized
                      </p>
                    </div>
                  ))}
                  {customers.filter(c => (c.currentBalance / c.creditLimit) > 0.8).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No credit alerts</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Archive View */}
        {view === 'archive' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Archive</h2>
              <div className="text-sm text-gray-600">
                {archivedKegs.length} kegs · {archivedCustomers.length} customers · {archivedProducts.length} products
              </div>
            </div>

            {/* Archived Kegs */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Archive size={24} />
                  Archived Kegs
                </h3>
                <span className="text-sm text-gray-600">{archivedKegs.length} items</span>
              </div>
              
              {archivedKegs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No archived kegs</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {archivedKegs.map((keg, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div>
                        <p className="font-semibold">{keg.id}</p>
                        <p className="text-sm text-gray-600">
                          {keg.product || 'Empty'} · {keg.size} · {keg.location}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Archived: {keg.archivedDate ? new Date(keg.archivedDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const restoredKeg = { ...keg };
                            delete restoredKeg.archived;
                            delete restoredKeg.archivedDate;
                            setKegs([...kegs, restoredKeg]);
                            setArchivedKegs(archivedKegs.filter((_, i) => i !== idx));
                            saveKegToFirebase(restoredKeg);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                        >
                          <RefreshCw size={16} />
                          Restore
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Permanently delete keg ${keg.id}? This cannot be undone.`)) {
                              setArchivedKegs(archivedKegs.filter((_, i) => i !== idx));
                            }
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1 text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Archived Customers */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Archive size={24} />
                  Archived Customers
                </h3>
                <span className="text-sm text-gray-600">{archivedCustomers.length} items</span>
              </div>
              
              {archivedCustomers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No archived customers</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {archivedCustomers.map((customer, idx) => (
                    <div key={idx} className="fleximport React, { useState, useRef, useEffect } from 'react';
import { Camera, Package, Truck, Users, BarChart3, Search, Plus, MapPin, AlertCircle, Check, X, Edit, Trash2, Save, QrCode, Home, FileText, Clock, DollarSign, TrendingUp, Filter, Download, Calendar, Wrench, Bell, TrendingDown, Archive, RefreshCw, Shield, Activity, Target, Layers, Cloud, Upload, UserPlus, LogOut, Mail } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, addDoc, serverTimestamp, query, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf3KJFgXz7i4UjryWQNGD2bH9uedTeYVY",
  authDomain: "cryptkeeper-f695a.firebaseapp.com",
  projectId: "cryptkeeper-f695a",
  storageBucket: "cryptkeeper-f695a.firebasestorage.app",
  messagingSenderId: "354790573765",
  appId: "1:354790573765:web:365702abb10825b7d612ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Enhanced initial data with more realistic brewery operations
const initialKegs = [
  { id: 'KEG001', barcode: '3001234567890', product: 'Hazy IPA', size: '15.5 gal', status: 'At Customer', location: 'Downtown Tap House', owner: 'Brewery', customer: 'C1', fillDate: '2025-09-15', shipDate: '2025-09-16', returnDate: '', daysOut: 35, condition: 'Good', deposit: 30, lastCleaned: '2025-08-10', turnsThisYear: 8, batchNumber: 'B2024-089', maintenanceNotes: '', rentalRate: 0, purchaseDate: '2024-01-15' },
  { id: 'KEG002', barcode: '', product: '', size: '15.5 gal', status: 'Empty', location: 'Brewery', owner: 'Brewery', customer: '', fillDate: '', shipDate: '', returnDate: '2025-10-15', daysOut: 0, condition: 'Needs Cleaning', deposit: 30, lastCleaned: '2025-09-20', turnsThisYear: 12, batchNumber: '', maintenanceNotes: 'Valve leak detected', rentalRate: 0, purchaseDate: '2024-01-15' },
  { id: 'KEG003', barcode: '3001234567891', product: 'Pilsner', size: '7.75 gal', status: 'At Customer', location: 'Craft Beer Bar', owner: 'Brewery', customer: 'C2', fillDate: '2025-10-01', shipDate: '2025-10-02', returnDate: '', daysOut: 19, condition: 'Good', deposit: 30, lastCleaned: '2025-09-15', turnsThisYear: 10, batchNumber: 'B2024-095', maintenanceNotes: '', rentalRate: 0, purchaseDate: '2024-02-20' },
  { id: 'KEG004', barcode: '3001234567892', product: 'Stout', size: '7.75 gal', status: 'Filled', location: 'Brewery', owner: 'Brewery', customer: '', fillDate: '2025-10-18', shipDate: '', returnDate: '', daysOut: 0, condition: 'Good', deposit: 30, lastCleaned: '2025-10-15', turnsThisYear: 9, batchNumber: 'B2024-098', maintenanceNotes: '', rentalRate: 0, purchaseDate: '2024-02-20' },
  { id: 'KEG005', barcode: '', product: '', size: '5.16 gal', status: 'Empty', location: 'Brewery', owner: 'Brewery', customer: '', fillDate: '', shipDate: '', returnDate: '2025-10-20', daysOut: 0, condition: 'Good', deposit: 30, lastCleaned: '2025-10-20', turnsThisYear: 15, batchNumber: '', maintenanceNotes: '', rentalRate: 0, purchaseDate: '2024-03-10' },
  { id: 'KEG006', barcode: '3001234567893', product: 'Pale Ale', size: '5.16 gal', status: 'In Transit', location: 'Delivery Route A', owner: 'Brewery', customer: '', fillDate: '2025-10-20', shipDate: '2025-10-21', returnDate: '', daysOut: 0, condition: 'Good', deposit: 30, lastCleaned: '2025-10-15', turnsThisYear: 14, batchNumber: 'B2024-099', maintenanceNotes: '', rentalRate: 0, purchaseDate: '2024-03-10' },
  { id: 'KEG007', barcode: '', product: '', size: '15.5 gal', status: 'Empty', location: 'Brewery', owner: 'Brewery', customer: '', fillDate: '', shipDate: '', returnDate: '', daysOut: 0, condition: 'Good', deposit: 30, lastCleaned: '2025-09-01', turnsThisYear: 6, batchNumber: '', maintenanceNotes: 'Pressure testing required', rentalRate: 0, purchaseDate: '2024-01-15' },
  { id: 'KEG008', barcode: '3001234567894', product: 'Amber Ale', size: '7.75 gal', status: 'At Customer', location: 'Sports Bar & Grill', owner: 'Brewery', customer: 'C3', fillDate: '2025-10-10', shipDate: '2025-10-11', returnDate: '', daysOut: 10, condition: 'Good', deposit: 30, lastCleaned: '2025-10-05', turnsThisYear: 11, batchNumber: 'B2024-097', maintenanceNotes: '', rentalRate: 0, purchaseDate: '2024-02-20' },
  { id: 'KEG009', barcode: '', product: '', size: '5.16 gal', status: 'Empty', location: 'Brewery', owner: 'Brewery', customer: '', fillDate: '2025-08-01', shipDate: '2025-08-02', returnDate: '', daysOut: 0, condition: 'Good', deposit: 30, lastCleaned: '2025-07-20', turnsThisYear: 5, batchNumber: '', maintenanceNotes: 'Keg not returned - flagged for recovery', rentalRate: 0, purchaseDate: '2024-03-10' },
  { id: 'KEG010', barcode: '3001234567895', product: 'IPA', size: '15.5 gal', status: 'Filled', location: 'Brewery', owner: 'Brewery', customer: '', fillDate: '2025-10-21', shipDate: '', returnDate: '', daysOut: 0, condition: 'Good', deposit: 30, lastCleaned: '2025-10-18', turnsThisYear: 13, batchNumber: 'B2024-100', maintenanceNotes: '', rentalRate: 0, purchaseDate: '2024-01-15' },
];

const initialCustomers = [
  { id: 'C1', name: 'Downtown Tap House', address: '123 Main St', city: 'Portland', state: 'OR', zip: '97201', phone: '555-0101', email: 'orders@downtowntap.com', kegsOut: 1, depositBalance: 50, creditLimit: 2000, currentBalance: 450, deliveryDay: 'Monday', route: 'Route A', notes: 'Prefer morning deliveries', status: 'Active' },
  { id: 'C2', name: 'Craft Beer Bar', address: '456 Oak Ave', city: 'Portland', state: 'OR', zip: '97202', phone: '555-0102', email: 'manager@craftbeerbar.com', kegsOut: 1, depositBalance: 30, creditLimit: 1500, currentBalance: 320, deliveryDay: 'Wednesday', route: 'Route A', notes: 'VIP customer - priority service', status: 'Active' },
  { id: 'C3', name: 'Sports Bar & Grill', address: '789 Pine Rd', city: 'Portland', state: 'OR', zip: '97203', phone: '555-0103', email: 'purchasing@sportsbargrill.com', kegsOut: 1, depositBalance: 30, creditLimit: 3000, currentBalance: 890, deliveryDay: 'Friday', route: 'Route B', notes: 'High volume account', status: 'Active' },
  { id: 'C4', name: 'Riverside Tavern', address: '321 River St', city: 'Portland', state: 'OR', zip: '97204', phone: '555-0104', email: 'info@riversidetavern.com', kegsOut: 0, depositBalance: 0, creditLimit: 1000, currentBalance: 125, deliveryDay: 'Tuesday', route: 'Route B', notes: 'Late payments - monitor closely', status: 'Warning' },
];

const products = [
  { name: 'Hazy IPA', abv: 6.8, ibu: 45, style: 'IPA', active: true },
  { name: 'Pilsner', abv: 4.9, ibu: 32, style: 'Lager', active: true },
  { name: 'Stout', abv: 7.2, ibu: 38, style: 'Stout', active: true },
  { name: 'Pale Ale', abv: 5.5, ibu: 40, style: 'Pale Ale', active: true },
  { name: 'IPA', abv: 6.5, ibu: 65, style: 'IPA', active: true },
  { name: 'Amber Ale', abv: 5.8, ibu: 28, style: 'Amber', active: true },
  { name: 'Wheat Beer', abv: 5.2, ibu: 15, style: 'Wheat', active: true },
  { name: 'Porter', abv: 6.0, ibu: 35, style: 'Porter', active: true },
];

// CryptKeeper Logo Component
const CryptKeeperLogo = ({ className = "h-12 w-auto" }) => (
  <img 
    src="data:image/webp;base64,UklGRnBIBABXRUJQVlA4WAoAAAAwAAAABwcA1QMASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADY="
    alt="Crypt Keeper" 
    className={className}
  />
);

const App = () => {
  const [view, setView] = useState('dashboard');
  const [kegs, setKegs] = useState(() => {
    const saved = localStorage.getItem('kegtracker_kegs');
    return saved ? JSON.parse(saved) : initialKegs;
  });
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('kegtracker_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });
  const [productList, setProductList] = useState(() => {
    const saved = localStorage.getItem('kegtracker_products');
    return saved ? JSON.parse(saved) : products;
  });
  const [scan, setScan] = useState(false);
  const [bc, setBc] = useState('');
  const [err, setErr] = useState('');
  const [sel, setSel] = useState(null);
  const [modal, setModal] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedKegs, setSelectedKegs] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(localStorage.getItem('cameraPermission') || 'prompt');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [scannedBarcodeForInventory, setScannedBarcodeForInventory] = useState('');
  const vid = useRef(null);
  const codeReader = useRef(null);
  const scanControlsRef = useRef(null);
  
  // New state for enhanced features
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    statuses: [],
    dateRange: { start: '', end: '' },
    customers: [],
    products: [],
    locations: [],
    daysOutMin: '',
    daysOutMax: '',
    conditions: []
  });
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem('kegtracker_activity');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Archived state variables
  const [archivedKegs, setArchivedKegs] = useState([]);
  const [archivedCustomers, setArchivedCustomers] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showKegHistory, setShowKegHistory] = useState(null);
  const [quickActionMenu, setQuickActionMenu] = useState(false);
  
  // User Management State
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Firebase sync - Load data on mount and listen for changes
  useEffect(() => {
    const loadFromFirebase = async () => {
      try {
        // Load kegs
        const kegsSnapshot = await getDocs(collection(db, 'kegs'));
        if (!kegsSnapshot.empty) {
          const firebaseKegs = kegsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setKegs(firebaseKegs);
          localStorage.setItem('kegtracker_kegs', JSON.stringify(firebaseKegs));
        }

        // Load customers
        const customersSnapshot = await getDocs(collection(db, 'customers'));
        if (!customersSnapshot.empty) {
          const firebaseCustomers = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCustomers(firebaseCustomers);
          localStorage.setItem('kegtracker_customers', JSON.stringify(firebaseCustomers));
        }

        // Load products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        if (!productsSnapshot.empty) {
          const firebaseProducts = productsSnapshot.docs.map(doc => doc.data());
          setProductList(firebaseProducts);
          localStorage.setItem('kegtracker_products', JSON.stringify(firebaseProducts));
        }

        // Load transactions
        const transactionsQuery = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
        const transactionsSnapshot = await getDocs(transactionsQuery);
        if (!transactionsSnapshot.empty) {
          const firebaseTransactions = transactionsSnapshot.docs.map(doc => doc.data());
          setActivityLog(firebaseTransactions);
          localStorage.setItem('kegtracker_activity', JSON.stringify(firebaseTransactions));
        }
        
        // Load users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        if (!usersSnapshot.empty) {
          const firebaseUsers = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
          setUsers(firebaseUsers);
        }
      } catch (error) {
        console.error('Error loading from Firebase:', error);
      }
    };

    loadFromFirebase();

    // Real-time listeners
    const unsubscribeKegs = onSnapshot(collection(db, 'kegs'), (snapshot) => {
      const updatedKegs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setKegs(updatedKegs);
      localStorage.setItem('kegtracker_kegs', JSON.stringify(updatedKegs));
    });

    const unsubscribeCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const updatedCustomers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(updatedCustomers);
      localStorage.setItem('kegtracker_customers', JSON.stringify(updatedCustomers));
    });

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const updatedProducts = snapshot.docs.map(doc => doc.data());
      setProductList(updatedProducts);
      localStorage.setItem('kegtracker_products', JSON.stringify(updatedProducts));
    });

    const unsubscribeTransactions = onSnapshot(
      query(collection(db, 'transactions'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const updatedTransactions = snapshot.docs.map(doc => doc.data());
        setActivityLog(updatedTransactions);
        localStorage.setItem('kegtracker_activity', JSON.stringify(updatedTransactions));
      }
    );
    
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const updatedUsers = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      setUsers(updatedUsers);
    });

    return () => {
      unsubscribeKegs();
      unsubscribeCustomers();
      unsubscribeProducts();
      unsubscribeTransactions();
      unsubscribeUsers();
    };
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Load user data from Firestore
        const userDoc = await getDocs(collection(db, 'users'));
        const userData = userDoc.docs.find(doc => doc.id === user.uid);
        if (userData) {
          setCurrentUser({ uid: user.uid, email: user.email, ...userData.data() });
        } else {
          setCurrentUser({ uid: user.uid, email: user.email, role: 'user', name: user.email });
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save customers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kegtracker_customers', JSON.stringify(customers));
  }, [customers]);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kegtracker_products', JSON.stringify(productList));
  }, [productList]);

  // Save kegs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kegtracker_kegs', JSON.stringify(kegs));
  }, [kegs]);

  // Save activity log to localStorage
  useEffect(() => {
    localStorage.setItem('kegtracker_activity', JSON.stringify(activityLog));
  }, [activityLog]);

  // Auto-start camera when barcode scan modal opens
  useEffect(() => {
    if (modal === 'scanBarcode' || scan) {
      const timer = setTimeout(() => {
        startCameraStream();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        stopCam();
      };
    }
  }, [modal, scan]);

  // Lock body scroll when keg history modal is open
  useEffect(() => {
    if (showKegHistory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showKegHistory]);

  // Helper function to log activities
  const logActivity = (action, details, kegId = null) => {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      kegId,
      user: currentUser?.email || 'Current User'
    };
    setActivityLog(prev => [newActivity, ...prev].slice(0, 100));
    saveTransactionToFirebase(action, details, kegId);
  };

  // Enhanced statistics
  const stats = {
    total: kegs.length,
    filled: kegs.filter(k => k.product).length,
    empty: kegs.filter(k => !k.product && k.status !== 'Maintenance' && k.status !== 'Lost').length,
    atCustomers: kegs.filter(k => k.status === 'At Customer').length,
    overdue: kegs.filter(k => k.daysOut > 30).length,
    lost: kegs.filter(k => k.status === 'Lost').length,
    maintenance: kegs.filter(k => k.status === 'Maintenance').length,
    deposits: kegs.filter(k => k.customer).reduce((sum, k) => sum + k.deposit, 0),
    avgTurns: Math.round(kegs.reduce((sum, k) => sum + k.turnsThisYear, 0) / kegs.length * 10) / 10,
    totalValue: kegs.length * 130,
    utilization: Math.round((kegs.filter(k => k.status === 'At Customer' || k.status === 'Filled').length / kegs.length) * 100)
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1920, height: 1080 } 
      });
      
      localStorage.setItem('cameraPermission', 'granted');
      setCameraPermission('granted');
      setShowPermissionModal(false);
      
      if (vid.current) {
        vid.current.srcObject = stream;
        
        vid.current.addEventListener('loadedmetadata', () => {
          vid.current.play().catch(err => console.error('Play failed:', err));
        });
      }
      
      setTimeout(() => startBarcodeScanning(), 1000);
      
    } catch (e) {
      console.error('Camera permission error:', e);
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        localStorage.setItem('cameraPermission', 'denied');
        setCameraPermission('denied');
        setErr('Camera permission denied. Please enable camera access in your browser settings.');
      } else if (e.name === 'NotFoundError') {
        setErr('No camera found on this device.');
      } else {
        setErr('Camera failed to start: ' + e.message);
      }
    }
  };

  const startCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1920, height: 1080 } 
      });
      
      if (vid.current) {
        vid.current.srcObject = stream;
        vid.current.addEventListener('loadedmetadata', () => {
          vid.current.play().catch(err => console.error('Play error:', err));
        });
      }
      
      setTimeout(() => startBarcodeScanning(), 1000);
      
    } catch (e) {
      console.error('Camera error:', e);
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        localStorage.setItem('cameraPermission', 'denied');
        setCameraPermission('denied');
        setErr('Camera permission denied. Please enable camera access in your browser settings.');
      } else if (e.name === 'NotFoundError') {
        setErr('No camera found on this device.');
      } else {
        setErr('Camera failed to start: ' + e.message);
      }
    }
  };

  const startBarcodeScanning = async () => {
    if (!vid.current || !vid.current.srcObject) {
      setTimeout(() => startBarcodeScanning(), 500);
      return;
    }
    
    try {
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }
      
      const controls = await codeReader.current.decodeFromVideoDevice(
        undefined,
        vid.current,
        (result, err) => {
          if (result) {
            const barcodeText = result.getText();
            
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAo=');
              audio.play();
            } catch (e) {
              console.log('Beep failed:', e);
            }
            
            setBc(barcodeText);
            setErr('');
            
            setTimeout(() => {
              if (batchMode) {
                submitBarcode(barcodeText);
                setBc('');
              } else if (modal === 'addKeg' || modal === 'editKeg') {
                setScannedBarcodeForInventory(barcodeText);
                stopCam();
                setScan(false);
              } else {
                stopCam();
                submitBarcode(barcodeText);
              }
            }, 500);
          }
          
          if (err && err.name !== 'NotFoundException') {
            console.error('Scan error:', err.name, err.message);
          }
        }
      );
      
      scanControlsRef.current = controls;
    } catch (e) {
      console.error('Barcode scanning error:', e);
      setErr('Barcode scanning failed: ' + e.message);
    }
  };

  const submitBarcode = (code) => {
    const k = kegs.find(x => x.barcode === code);
    if (k) {
      if (batchMode) {
        if (!selectedKegs.includes(k.id)) {
          setSelectedKegs([...selectedKegs, k.id]);
        }
        setErr('');
      } else {
        setSel(k);
        setScan(false);
        setModal('trans');
        setErr('');
        saveTransactionToFirebase('Barcode Scanned', `Scanned keg ${k.id}`, k.id);
      }
    } else {
      setErr(`No keg found with barcode: ${code}`);
    }
  };

  const stopCam = () => {
    if (scanControlsRef.current) {
      try {
        scanControlsRef.current.stop();
      } catch (e) {
        console.log('Scanner control stop error:', e);
      }
      scanControlsRef.current = null;
    }
    
    if (codeReader.current) {
      try {
        codeReader.current.reset();
      } catch (e) {
        console.log('Code reader reset error:', e);
      }
    }
    
    if (vid.current?.srcObject) {
      vid.current.srcObject.getTracks().forEach(t => {
        t.stop();
      });
      vid.current.srcObject = null;
    }
  };

  // Firebase helper functions
  const saveKegToFirebase = async (keg) => {
    try {
      await setDoc(doc(db, 'kegs', keg.id), keg);
      console.log('✅ Keg saved to Firebase:', keg.id);
    } catch (error) {
      console.error('❌ Error saving keg to Firebase:', error);
    }
  };

  const saveCustomerToFirebase = async (customer) => {
    try {
      await setDoc(doc(db, 'customers', customer.id), customer);
      console.log('✅ Customer saved to Firebase:', customer.id);
    } catch (error) {
      console.error('❌ Error saving customer to Firebase:', error);
    }
  };

  const saveProductToFirebase = async (product) => {
    try {
      await setDoc(doc(db, 'products', product.name), product);
      console.log('✅ Product saved to Firebase:', product.name);
    } catch (error) {
      console.error('❌ Error saving product to Firebase:', error);
    }
  };

  const saveTransactionToFirebase = async (action, details, kegId = null) => {
    try {
      const transaction = {
        action,
        details,
        kegId,
        timestamp: serverTimestamp(),
        user: currentUser?.email || 'Current User'
      };
      await addDoc(collection(db, 'transactions'), transaction);
      console.log('✅ Transaction saved to Firebase');
    } catch (error) {
      console.error('❌ Error saving transaction:', error);
    }
  };

  useEffect(() => {
    if (scan) {
      const savedPermission = localStorage.getItem('cameraPermission');
      
      if (savedPermission === 'granted') {
        startCameraStream();
      } else {
        setShowPermissionModal(true);
      }
    } else {
      setShowPermissionModal(false);
      setErr('');
    }
    return () => stopCam();
  }, [scan]);

  const toggleKegSelection = (kegId) => {
    setSelectedKegs(prev => 
      prev.includes(kegId) ? prev.filter(id => id !== kegId) : [...prev, kegId]
    );
  };

  const processTrans = async (type, data) => {
    console.log('🔄 processTrans called:', type, data);
    const now = new Date().toISOString().split('T')[0];
    const kegsToUpdate = batchMode && selectedKegs.length > 0 ? selectedKegs : [sel.id];
    
    const updated = kegs.map(k => {
      if (kegsToUpdate.includes(k.id)) {
        let updatedKeg = { ...k };
        
        if (type === 'fill') {
          updatedKeg = {...k, product: data.product, fillDate: now, status: 'Filled', batchNumber: data.batchNumber || ''};
        }
        if (type === 'ship') {
          const customer = customers.find(c => c.id === data.customerId);
          updatedKeg = {
            ...k, 
            status: 'At Customer', 
            customer: data.customerId, 
            location: customer?.name || data.location,
            shipDate: now, 
            daysOut: 0
          };
        }
        if (type === 'return') {
          updatedKeg = {
            ...k, 
            status: 'Empty', 
            product: '', 
            customer: '', 
            location: 'Brewery',
            returnDate: now, 
            daysOut: 0,
            condition: data.condition || k.condition
          };
        }
        if (type === 'clean') {
          updatedKeg = {...k, status: 'Empty', condition: 'Good', lastCleaned: now, location: 'Brewery', maintenanceNotes: '', turnsThisYear: k.turnsThisYear + 1};
        }
        if (type === 'maintenance') {
          updatedKeg = {...k, status: 'Maintenance', maintenanceNotes: data.notes || '', location: 'Brewery'};
        }
        if (type === 'repair') {
          updatedKeg = {...k, status: 'Empty', condition: 'Good', lastCleaned: now, location: 'Brewery', maintenanceNotes: '', turnsThisYear: k.turnsThisYear + 1};
        }
        if (type === 'lost') {
          updatedKeg = {...k, status: 'Lost', location: 'Unknown'};
        }
        
        saveKegToFirebase(updatedKeg);
        logActivity(type.toUpperCase(), `${type} action on keg ${k.id}`, k.id);
        
        return updatedKeg;
      }
      return k;
    });
    
    setKegs(updated);
    
    if (type === 'ship' || type === 'return') {
      const updatedCustomers = customers.map(c => ({
        ...c,
        kegsOut: updated.filter(k => k.customer === c.id).length,
        depositBalance: updated.filter(k => k.customer === c.id).reduce((sum, k) => sum + k.deposit, 0)
      }));
      setCustomers(updatedCustomers);
      updatedCustomers.forEach(c => saveCustomerToFirebase(c));
    }
    
    setModal('');
    setSel(null);
    setSelectedKegs([]);
    setBatchMode(false);
  };

  const exportData = (type) => {
    let csvContent = '';
    let filename = '';
    
    if (type === 'inventory') {
      csvContent = 'ID,Product,Size,Status,Location,Customer,Days Out,Condition,Deposit,Last Cleaned,Turns This Year\n';
      kegs.forEach(k => {
        csvContent += `${k.id},${k.product},${k.size},${k.status},${k.location},${k.customer},${k.daysOut},${k.condition},${k.deposit},${k.lastCleaned},${k.turnsThisYear}\n`;
      });
      filename = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'customers') {
      csvContent = 'ID,Name,Address,Phone,Email,Kegs Out,Deposit Balance,Current Balance,Status\n';
      customers.forEach(c => {
        csvContent += `${c.id},${c.name},${c.address},${c.phone},${c.email},${c.kegsOut},${c.depositBalance},${c.currentBalance},${c.status}\n`;
      });
      filename = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'financial') {
      csvContent = 'Customer ID,Customer Name,Kegs Out,Deposit Balance,Current Balance,Credit Limit,Status\n';
      customers.forEach(c => {
        csvContent += `${c.id},${c.name},${c.kegsOut},${c.depositBalance},${c.currentBalance},${c.creditLimit},${c.status}\n`;
      });
      filename = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'activity') {
      csvContent = 'Timestamp,Action,Details,Keg ID,User\n';
      activityLog.forEach(a => {
        const timestamp = new Date(a.timestamp).toLocaleString();
        csvContent += `${timestamp},${a.action},${a.details},${a.kegId || 'N/A'},${a.user}\n`;
      });
      filename = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    logActivity('Export Data', `Exported ${type} report`);
  };

  // User Management Functions
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  };

  const handleCreateUser = async (email, password, name, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        name,
        role,
        createdAt: serverTimestamp(),
        createdBy: currentUser?.email || 'Admin'
      });
      
      alert(`User ${email} created successfully!`);
      setModal('');
    } catch (error) {
      alert('Error creating user: ' + error.message);
    }
  };

  const handleDeleteUser = async (uid) => {
    try {
      await deleteDoc(doc(db, 'users', uid));
      alert('User deleted successfully!');
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  const filteredKegs = kegs.filter(k => {
    const matchesSearch = k.id.toLowerCase().includes(search.toLowerCase()) || 
                         k.product.toLowerCase().includes(search.toLowerCase()) ||
                         k.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || k.status === filterStatus;
    
    const matchesAdvancedStatus = advancedFilters.statuses.length === 0 || advancedFilters.statuses.includes(k.status);
    const matchesCustomer = advancedFilters.customers.length === 0 || advancedFilters.customers.includes(k.customer);
    const matchesProduct = advancedFilters.products.length === 0 || advancedFilters.products.includes(k.product);
    const matchesLocation = advancedFilters.locations.length === 0 || advancedFilters.locations.includes(k.location);
    const matchesCondition = advancedFilters.conditions.length === 0 || advancedFilters.conditions.includes(k.condition);
    
    const matchesDaysOut = (!advancedFilters.daysOutMin || k.daysOut >= parseInt(advancedFilters.daysOutMin)) &&
                           (!advancedFilters.daysOutMax || k.daysOut <= parseInt(advancedFilters.daysOutMax));
    
    const matchesDateRange = (!advancedFilters.dateRange.start || !k.fillDate || k.fillDate >= advancedFilters.dateRange.start) &&
                             (!advancedFilters.dateRange.end || !k.fillDate || k.fillDate <= advancedFilters.dateRange.end);
    
    return matchesSearch && matchesStatus && matchesAdvancedStatus && matchesCustomer && 
           matchesProduct && matchesLocation && matchesCondition && matchesDaysOut && matchesDateRange;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <CryptKeeperLogo className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">CryptKeeper Pro</h1>
            <p className="text-gray-600 mt-2">Brewery Keg Management System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold transition-colors"
            >
              Sign In
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-600 mt-6">
            Need access? Contact your administrator
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div style={{ filter: 'invert(1) brightness(2)' }}>
                <CryptKeeperLogo className="h-12 w-auto" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400">Logged in as:</p>
                <p className="text-sm font-semibold">{currentUser?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setScan(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">
                <Camera size={20} />
                <span className="hidden sm:inline">Scan</span>
              </button>
              <button 
                onClick={() => { setBatchMode(!batchMode); if (batchMode) setSelectedKegs([]); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${batchMode ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
              >
                <Layers size={20} />
                <span className="hidden sm:inline">Batch</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'inventory', icon: Package, label: 'Inventory' },
              { id: 'customers', icon: Users, label: 'Customers' },
              { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
              { id: 'financial', icon: DollarSign, label: 'Financial' },
              { id: 'reports', icon: BarChart3, label: 'Reports' },
              { id: 'settings', icon: Shield, label: 'Settings' },
              { id: 'archive', icon: Archive, label: 'Archive' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-4 transition-all whitespace-nowrap ${
                  view === tab.id ? 'border-black text-black font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {view === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <Package className="text-gray-600" size={28} />
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Kegs</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Truck className="text-green-600 mb-2" size={28} />
                <p className="text-3xl font-bold text-green-600">{stats.atCustomers}</p>
                <p className="text-sm text-gray-600">At Customers</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Package className="text-blue-600 mb-2" size={28} />
                <p className="text-3xl font-bold text-blue-600">{stats.filled}</p>
                <p className="text-sm text-gray-600">Filled & Ready</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <AlertCircle className="text-red-600 mb-2" size={28} />
                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <DollarSign className="mb-2" size={28} />
                <p className="text-3xl font-bold">${stats.deposits}</p>
                <p className="text-sm opacity-90">Deposits Held</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <RefreshCw className="mb-2" size={28} />
                <p className="text-3xl font-bold">{stats.avgTurns}</p>
                <p className="text-sm opacity-90">Avg Turns/Year</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <Target className="mb-2" size={28} />
                <p className="text-3xl font-bold">{stats.utilization}%</p>
                <p className="text-sm opacity-90">Utilization Rate</p>
              </div>
            </div>

            {/* Alerts */}
            {(stats.overdue > 0 || stats.maintenance > 0 || stats.lost > 0) && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Bell className="text-red-600" />
                  Alerts & Notifications
                </h3>
                <div className="space-y-3">
                  {stats.overdue > 0 && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="font-semibold text-red-700">⚠️ {stats.overdue} Kegs Overdue</p>
                      <p className="text-sm text-red-600">Kegs have been out for more than 30 days</p>
                    </div>
                  )}
                  {stats.maintenance > 0 && (
                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                      <p className="font-semibold text-yellow-700">🔧 {stats.maintenance} Kegs in Maintenance</p>
                      <p className="text-sm text-yellow-600">Kegs requiring inspection or repair</p>
                    </div>
                  )}
                  {stats.lost > 0 && (
                    <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                      <p className="font-semibold text-orange-700">🔍 {stats.lost} Kegs Lost</p>
                      <p className="text-sm text-orange-600">Kegs marked as lost or missing</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Map & Activity Feed Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Map */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="text-blue-600" />
                  Customer Locations
                </h3>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <MapPin size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">Interactive Map View</p>
                  <p className="text-sm text-gray-500">Showing {customers.filter(c => c.status === 'Active').length} active customer locations</p>
                  <div className="mt-4 space-y-2">
                    {customers.filter(c => c.kegsOut > 0).slice(0, 5).map(c => (
                      <div key={c.id} className="flex justify-between items-center p-2 bg-white rounded">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${c.kegsOut > 2 ? 'bg-red-500' : c.kegsOut > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-sm font-medium">{c.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{c.kegsOut} kegs</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Activity className="text-purple-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {activityLog.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                  ) : (
                    activityLog.slice(0, 10).map(activity => (
                      <div key={activity.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity size={18} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.details}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.timestamp).toLocaleString()} - {activity.user}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Distribution Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Kegs by Status</h3>
                <div className="space-y-3">
                  {[
                    { status: 'At Customer', count: stats.atCustomers, color: 'bg-green-500' },
                    { status: 'Filled', count: stats.filled, color: 'bg-blue-500' },
                    { status: 'Empty', count: stats.empty, color: 'bg-gray-400' },
                    { status: 'Maintenance', count: stats.maintenance, color: 'bg-yellow-500' },
                    { status: 'Overdue', count: stats.overdue, color: 'bg-red-500' },
                  ].map(item => (
                    <div key={item.status} className="flex items-center gap-3">
                      <div className="w-32 text-sm font-medium">{item.status}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className={`${item.color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                          style={{ width: `${(item.count / stats.total * 100)}%` }}
                        >
                          <span className="text-white text-xs font-bold">{item.count}</span>
                        </div>
                      </div>
                      <div className="w-12 text-sm text-gray-600 text-right">
                        {Math.round(item.count / stats.total * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Top Products</h3>
                <div className="space-y-3">
                  {Object.entries(
                    kegs.filter(k => k.product).reduce((acc, k) => {
                      acc[k.product] = (acc[k.product] || 0) + 1;
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([product, count]) => (
                      <div key={product} className="flex items-center gap-3">
                        <div className="w-32 text-sm font-medium truncate">{product}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-purple-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${(count / stats.filled * 100)}%` }}
                          >
                            <span className="text-white text-xs font-bold">{count}</span>
                          </div>
                        </div>
                        <div className="w-12 text-sm text-gray-600 text-right">
                          {Math.round(count / stats.filled * 100)}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'inventory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold">Keg Inventory</h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search kegs..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="px-4 py-2 border-2 rounded-lg focus:border-black focus:outline-none flex-1 sm:flex-none"
                />
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border-2 rounded-lg focus:border-black focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="At Customer">At Customer</option>
                  <option value="Filled">Filled</option>
                  <option value="Empty">Empty</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Lost">Lost</option>
                </select>
                <button 
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${showAdvancedFilter ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  <Filter size={20} />
                  Filters
                </button>
                <button 
                  onClick={() => {
                    setBulkSelectMode(!bulkSelectMode);
                    setSelectedItems([]);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${bulkSelectMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  <Layers size={20} />
                  Bulk Select
                </button>
                <button 
                  onClick={() => setModal('addKeg')} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Keg
                </button>
                <button onClick={() => exportData('inventory')} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
                  <Download size={20} />
                  Export
                </button>
              </div>
            </div>

            {/* Advanced Filter Panel */}
            {showAdvancedFilter && (
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-500 mb-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Filter className="text-blue-600" />
                  Advanced Filters
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Status (Multi-select)</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded">
                      {['At Customer', 'Filled', 'Empty', 'In Transit', 'Maintenance', 'Lost'].map(status => (
                        <label key={status} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={advancedFilters.statuses.includes(status)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAdvancedFilters({...advancedFilters, statuses: [...advancedFilters.statuses, status]});
                              } else {
                                setAdvancedFilters({...advancedFilters, statuses: advancedFilters.statuses.filter(s => s !== status)});
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Days Out Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={advancedFilters.daysOutMin}
                        onChange={(e) => setAdvancedFilters({...advancedFilters, daysOutMin: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={advancedFilters.daysOutMax}
                        onChange={(e) => setAdvancedFilters({...advancedFilters, daysOutMax: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Condition</label>
                    <div className="space-y-2">
                      {['Good', 'Needs Cleaning', 'Damaged'].map(condition => (
                        <label key={condition} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={advancedFilters.conditions.includes(condition)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAdvancedFilters({...advancedFilters, conditions: [...advancedFilters.conditions, condition]});
                              } else {
                                setAdvancedFilters({...advancedFilters, conditions: advancedFilters.conditions.filter(c => c !== condition)});
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Fill Date Range</label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={advancedFilters.dateRange.start}
                        onChange={(e) => setAdvancedFilters({...advancedFilters, dateRange: {...advancedFilters.dateRange, start: e.target.value}})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="date"
                        value={advancedFilters.dateRange.end}
                        onChange={(e) => setAdvancedFilters({...advancedFilters, dateRange: {...advancedFilters.dateRange, end: e.target.value}})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setAdvancedFilters({
                      statuses: [], dateRange: { start: '', end: '' },
                      customers: [], products: [], locations: [],
                      daysOutMin: '', daysOutMax: '', conditions: []
                    })}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Clear All Filters
                  </button>
                  <div className="flex-1"></div>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                    {filteredKegs.length} kegs match filters
                  </span>
                </div>
              </div>
            )}

            {/* Bulk Select Actions */}
            {bulkSelectMode && selectedItems.length > 0 && (
              <div className="bg-purple-50 border-2 border-purple-500 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-purple-800">{selectedItems.length} items selected</p>
                  <button 
                    onClick={() => setSelectedItems([])}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Clear Selection
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <button 
                    onClick={() => {
                      const selectedKegObjs = kegs.filter(k => selectedItems.includes(k.id));
                      selectedKegObjs.forEach(k => {
                        logActivity('Bulk Fill', `Filled keg ${k.id}`, k.id);
                      });
                      alert(`Filled ${selectedItems.length} kegs`);
                      setSelectedItems([]);
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                  >
                    <Package size={16} className="inline mr-1" />
                    Fill
                  </button>
                  <button 
                    onClick={() => {
                      selectedItems.forEach(id => {
                        logActivity('Bulk Ship', `Shipped keg ${id}`, id);
                      });
                      alert(`Shipped ${selectedItems.length} kegs`);
                      setSelectedItems([]);
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                  >
                    <Truck size={16} className="inline mr-1" />
                    Ship
                  </button>
                  <button 
                    onClick={() => {
                      selectedItems.forEach(id => {
                        logActivity('Bulk Return', `Returned keg ${id}`, id);
                      });
                      alert(`Returned ${selectedItems.length} kegs`);
                      setSelectedItems([]);
                    }}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-semibold"
                  >
                    <RefreshCw size={16} className="inline mr-1" />
                    Return
                  </button>
                  <button 
                    onClick={() => {
                      selectedItems.forEach(id => {
                        const keg = kegs.find(k => k.id === id);
                        if (keg) {
                          keg.archived = true;
                          keg.archivedDate = new Date().toISOString();
                          logActivity('Bulk Archive', `Archived keg ${id}`, id);
                        }
                      });
                      setKegs([...kegs.filter(k => !selectedItems.includes(k.id))]);
                      setArchivedKegs([...archivedKegs, ...kegs.filter(k => selectedItems.includes(k.id))]);
                      setSelectedItems([]);
                    }}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold"
                  >
                    <Archive size={16} className="inline mr-1" />
                    Archive
                  </button>
                  <button 
                    onClick={() => setModal('bulkExport')}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold"
                  >
                    <Download size={16} className="inline mr-1" />
                    Export
                  </button>
                </div>
              </div>
            )}

            {batchMode && selectedKegs.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-blue-800">{selectedKegs.length} kegs selected</p>
                  <button 
                    onClick={() => { setSelectedKegs([]); setBatchMode(false); }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancel Selection
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button 
                    onClick={() => setModal('batchFill')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <Package size={16} />
                    Fill
                  </button>
                  <button 
                    onClick={() => setModal('batchShip')}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <Truck size={16} />
                    Ship
                  </button>
                  <button 
                    onClick={() => setModal('batchReturn')}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <RefreshCw size={16} />
                    Return
                  </button>
                  <button 
                    onClick={() => setModal('batchClean')}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <Check size={16} />
                    Clean
                  </button>
                  <button 
                    onClick={() => setModal('batchRepair')}
                    className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <Wrench size={16} />
                    Repair
                  </button>
                  <button 
                    onClick={() => setModal('batchMaintenance')}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <Wrench size={16} />
                    Flag Maint.
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Mark ${selectedKegs.length} kegs as lost?`)) {
                        processTrans('lost', {});
                      }
                    }}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <AlertCircle size={16} />
                    Lost
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKegs.map(k => (
                <div 
                  key={k.id} 
                  className={`bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${
                    (batchMode || bulkSelectMode) ? 'cursor-pointer' : ''
                  } ${(selectedKegs.includes(k.id) || selectedItems.includes(k.id)) ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => {
                    if (batchMode) toggleKegSelection(k.id);
                    if (bulkSelectMode) {
                      if (selectedItems.includes(k.id)) {
                        setSelectedItems(selectedItems.filter(id => id !== k.id));
                      } else {
                        setSelectedItems([...selectedItems, k.id]);
                      }
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {(batchMode || bulkSelectMode) && (
                        <input 
                          type="checkbox" 
                          checked={selectedKegs.includes(k.id) || selectedItems.includes(k.id)}
                          onChange={() => {}}
                          className="w-5 h-5"
                        />
                      )}
                      <div>
                        <p className="font-bold text-lg">{k.id}</p>
                        <p className="text-sm text-gray-600">{k.product || 'Empty'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        k.status === 'At Customer' ? 'bg-green-100 text-green-700' :
                        k.status === 'Filled' ? 'bg-blue-100 text-blue-700' :
                        k.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' :
                        k.status === 'Lost' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {k.status}
                      </span>
                      {!batchMode && !bulkSelectMode && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowKegHistory(k.id);
                            }}
                            className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                            title="View History"
                          >
                            <Clock size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItem({ type: 'keg', data: k, index: kegs.findIndex(keg => keg.id === k.id) });
                              setModal('editKeg');
                            }}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                            title="Edit Keg"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm({ type: 'keg', item: k, index: kegs.findIndex(keg => keg.id === k.id) });
                            }}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            title="Delete Keg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-3">
                    <p className="text-gray-600">📍 {k.location}</p>
                    <p className="text-gray-600">📏 {k.size}</p>
                    <p className="text-gray-600">
                      <QrCode size={14} className="inline mr-1" />
                      {k.barcode || 'No barcode'}
                    </p>
                    {k.customer && (
                      <p className="text-gray-600">👤 {customers.find(c => c.id === k.customer)?.name || 'Unknown'}</p>
                    )}
                    {k.daysOut > 0 && (
                      <p className={`font-semibold ${k.daysOut > 30 ? 'text-red-600' : 'text-orange-600'}`}>
                        ⏱️ {k.daysOut} days out {k.daysOut > 30 && '(OVERDUE)'}
                      </p>
                    )}
                    <p className="text-gray-600">🔄 {k.turnsThisYear} turns this year</p>
                    {k.condition !== 'Good' && (
                      <p className="text-orange-600 font-semibold">⚠️ {k.condition}</p>
                    )}
                    {k.maintenanceNotes && (
                      <p className="text-red-600 text-xs">📝 {k.maintenanceNotes}</p>
                    )}
                  </div>
                  
                  {!batchMode && !bulkSelectMode && (
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSel(k); setModal('editBarcode'); }} 
                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-1"
                        title="Scan/Edit Barcode"
                      >
                        <QrCode size={16} />
                        Barcode
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSel(k); setModal('trans'); }} 
                        className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
                      >
                        Manage
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Customer Management</h2>
              <div className="flex gap-2">
                <button onClick={() => { setEditingItem(null); setModal('addCustomer'); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus size={20} />
                  Add Customer
                </button>
                <button onClick={() => exportData('customers')} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
                  <Download size={20} />
                  Export
                </button>
              </div>
            </div>
            
            {customers.map((c, idx) => (
              <div key={c.id} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{c.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                          c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingItem({ type: 'customer', data: c, index: idx });
                            setModal('editCustomer');
                          }}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                          title="Edit Customer"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirm({ type: 'customer', item: c, index: idx });
                          }}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          title="Delete Customer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">📍 {c.address}, {c.city}, {c.state} {c.zip}</p>
                      <p className="text-gray-600">📞 {c.phone}</p>
                      <p className="text-gray-600">📧 {c.email}</p>
                      <p className="text-gray-600">🚚 Delivery: {c.deliveryDay} ({c.route})</p>
                      {c.notes && <p className="text-orange-600">💬 {c.notes}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-blue-600">{c.kegsOut}</p>
                      <p className="text-sm text-gray-600">Kegs Out</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-green-600">${c.depositBalance}</p>
                      <p className="text-sm text-gray-600">Deposits</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-purple-600">${c.currentBalance}</p>
                      <p className="text-sm text-gray-600">Balance Due</p>
                    </div>
                  </div>
                </div>
                
                {/* Kegs at Customer */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-bold mb-2">Kegs Currently Out:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {kegs.filter(k => k.customer === c.id).map(k => (
                      <div key={k.id} className="p-2 bg-gray-50 rounded border text-sm">
                        <p className="font-bold">{k.id}</p>
                        <p className="text-xs text-gray-600">{k.product}</p>
                        <p className="text-xs text-gray-500">{k.daysOut} days</p>
                      </div>
                    ))}
                    {kegs.filter(k => k.customer === c.id).length === 0 && (
                      <p className="text-gray-500 text-sm col-span-4">No kegs currently out</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'maintenance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Maintenance & Inspection</h2>
            
            {/* Maintenance Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-yellow-50 border-2 border-yellow-500 p-4 rounded-lg">
                <Wrench className="text-yellow-600 mb-2" size={28} />
                <p className="text-2xl font-bold text-yellow-700">{kegs.filter(k => k.status === 'Maintenance').length}</p>
                <p className="text-sm text-gray-700">In Maintenance</p>
              </div>
              <div className="bg-red-50 border-2 border-red-500 p-4 rounded-lg">
                <AlertCircle className="text-red-600 mb-2" size={28} />
                <p className="text-2xl font-bold text-red-700">{kegs.filter(k => k.condition === 'Needs Repair').length}</p>
                <p className="text-sm text-gray-700">Needs Repair</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded-lg">
                <Clock className="text-blue-600 mb-2" size={28} />
                <p className="text-2xl font-bold text-blue-700">{kegs.filter(k => k.condition === 'Needs Cleaning').length}</p>
                <p className="text-sm text-gray-700">Needs Cleaning</p>
              </div>
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded-lg">
                <Check className="text-green-600 mb-2" size={28} />
                <p className="text-2xl font-bold text-green-700">{kegs.filter(k => k.condition === 'Good').length}</p>
                <p className="text-sm text-gray-700">Good Condition</p>
              </div>
            </div>

            {/* Kegs Needing Attention */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Kegs Requiring Maintenance</h3>
              <div className="space-y-3">
                {kegs.filter(k => k.status === 'Maintenance' || k.condition === 'Needs Repair' || k.condition === 'Needs Cleaning').map(k => (
                  <div key={k.id} className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">{k.id}</p>
                        <p className="text-sm text-gray-600">{k.size} · Last cleaned: {k.lastCleaned}</p>
                        <p className="text-sm text-orange-600 font-semibold mt-1">Status: {k.condition}</p>
                        {k.maintenanceNotes && (
                          <p className="text-sm text-red-600 mt-1">⚠️ {k.maintenanceNotes}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => { setSel(k); setModal('trans'); }}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
                {kegs.filter(k => k.status === 'Maintenance' || k.condition === 'Needs Repair' || k.condition === 'Needs Cleaning').length === 0 && (
                  <p className="text-gray-500 text-center py-8">No kegs currently require maintenance</p>
                )}
              </div>
            </div>

            {/* Maintenance History */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Recent Maintenance Activity</h3>
              <div className="space-y-2">
                {kegs
                  .filter(k => k.lastCleaned)
                  .sort((a, b)
