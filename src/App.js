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
                  <p className="font-semibold text-orange-700">📍 {stats.lost} Kegs Lost</p>
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
            <div className="bg-gray-100 rounded-lg overflow-hidden relative" style={{ height: '400px' }}>
              {(() => {
                // Brewery location (Windsor, CT)
                const breweryLat = 41.8268;
                const breweryLng = -72.6686;
                
                // Get customers with kegs
                const customersWithKegs = customers.filter(c => c.kegsOut > 0);
                
                // Create unique map ID
                const mapId = 'customer-map-' + Date.now();
                
                // Initialize Leaflet map after component mounts
                React.useEffect(() => {
                  // Load Leaflet CSS
                  if (!document.getElementById('leaflet-css')) {
                    const link = document.createElement('link');
                    link.id = 'leaflet-css';
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                    link.crossOrigin = '';
                    document.head.appendChild(link);
                  }
                  
                  // Load Leaflet library
                  if (!window.L) {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                    script.crossOrigin = '';
                    script.onload = initMap;
                    document.head.appendChild(script);
                  } else {
                    initMap();
                  }
                  
                  function initMap() {
                    const mapElement = document.getElementById(mapId);
                    if (!mapElement || mapElement._leaflet_id) return;
                    
                    // Create map centered on brewery
                    const map = window.L.map(mapId).setView([breweryLat, breweryLng], 11);
                    
                    // Add OpenStreetMap tiles
                    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      attribution: '© OpenStreetMap contributors',
                      maxZoom: 19
                    }).addTo(map);
                    
                    // Custom brewery icon (blue house)
                    const breweryIcon = window.L.divIcon({
                      html: '<div style="background: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏠</div>',
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                      className: 'custom-icon'
                    });
                    
                    // Add brewery marker
                    window.L.marker([breweryLat, breweryLng], { icon: breweryIcon })
                      .addTo(map)
                      .bindPopup('<strong>Dudleytown Brewing Co.</strong><br>Windsor, CT<br>🏭 Brewery Location');
                    
                    // Add customer markers
                    customersWithKegs.forEach((customer, idx) => {
                      // Mock coordinates around Windsor, CT area
                      const lat = breweryLat + (Math.random() - 0.5) * 0.2;
                      const lng = breweryLng + (Math.random() - 0.5) * 0.2;
                      
                      // Custom customer icon (red circle with number)
                      const customerIcon = window.L.divIcon({
                        html: `<div style="background: #ef4444; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${idx + 1}</div>`,
                        iconSize: [28, 28],
                        iconAnchor: [14, 14],
                        className: 'custom-icon'
                      });
                      
                      window.L.marker([lat, lng], { icon: customerIcon })
                        .addTo(map)
                        .bindPopup(`<strong>${customer.name}</strong><br>${customer.kegsOut} keg${customer.kegsOut !== 1 ? 's' : ''} out<br>📍 ${customer.address || 'Address on file'}`);
                    });
                  }
                }, [customersWithKegs.length]);
                
                return (
                  <div id={mapId} style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }} />
                );
              })()}
            </div>
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {/* Brewery Location */}
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2">
                  <Home size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Dudleytown Brewing Co.</span>
                </div>
                <span className="text-xs text-blue-600">Windsor, CT</span>
              </div>
              
              {/* Customers with kegs */}
              {customers.filter(c => c.kegsOut > 0).map((c, idx) => (
                <div key={c.id} className="flex justify-between items-center p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{c.kegsOut} keg{c.kegsOut !== 1 ? 's' : ''}</span>
                </div>
              ))}
              {customers.filter(c => c.kegsOut > 0).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">No kegs currently at customer locations</p>
              )}
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
                        {new Date(activity.timestamp).toLocaleString()}
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
                <label className="block text-sm font-semibold mb-2">Keg Size</label>
                <div className="space-y-2">
                  {['15.5 gal', '7.75 gal', '5.16 gal'].map(size => (
                    <label key={size} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={advancedFilters.sizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAdvancedFilters({...advancedFilters, sizes: [...advancedFilters.sizes, size]});
                          } else {
                            setAdvancedFilters({...advancedFilters, sizes: advancedFilters.sizes.filter(s => s !== size)});
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{size}</span>
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
                  customers: [], products: [], locations: [], sizes: [],
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
                  setBulkOperationModal('fill');
                  setBulkOperationData({});
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
              >
                <Package size={16} className="inline mr-1" />
                Fill
              </button>
              <button 
                onClick={() => {
                  setBulkOperationModal('ship');
                  setBulkOperationData({});
                }}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
              >
                <Truck size={16} className="inline mr-1" />
                Ship
              </button>
              <button 
                onClick={() => {
                  setBulkOperationModal('return');
                  setBulkOperationData({});
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
              
              {!batchMode && (
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
        
        {/* User Management - Admin Only */}
        {currentUser.role === 'Admin' && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold">User Management</h3>
                <p className="text-sm text-gray-600">Manage system users and permissions</p>
              </div>
              <button 
                onClick={() => { setEditingItem(null); setModal('addUser'); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Add User
              </button>
            </div>
            <div className="space-y-2">
              {users.map((u, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{u.name}</p>
                    <p className="text-sm text-gray-600 truncate">{u.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Last login: {u.lastLogin} · Created: {u.createdDate}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.status}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem({ type: 'user', data: u, index: idx });
                          setModal('editUser');
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={18} />
                      </button>
                      {u.id !== currentUser.id && ( // Can't delete yourself
                        <button 
                          onClick={() => {
                            setDeleteConfirm({ type: 'user', item: u, index: idx });
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
              <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-600">{p.style} · {p.abv}% ABV · {p.ibu} IBU</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
                <p className="font-semibold">Theme</p>
                <p className="text-sm text-gray-600">Switch between light and dark mode</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
              >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
            
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
                <p className="font-semibold">Password</p>
                <p className="text-sm text-gray-600">Change your login password</p>
              </div>
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Change Password
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div>
                <p className="font-semibold text-red-700">Logout</p>
                <p className="text-sm text-red-600">Sign out of your account</p>
              </div>
              <button 
                onClick={async () => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    try {
                      await signOut(auth);
                      // Auth state listener will handle redirecting to login
                    } catch (error) {
                      console.error('Logout error:', error);
                      alert('Failed to logout: ' + error.message);
                    }
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 font-semibold"
              >
                <LogOut size={18} />
                Logout
              </button>
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
                        // Restore keg
                        const restoredKeg = { ...keg };
                        delete restoredKeg.archived;
                        delete restoredKeg.archivedDate;
                        setKegs([...kegs, restoredKeg]);
                        setArchivedKegs(archivedKegs.filter((_, i) => i !== idx));
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
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-gray-600">
                      {customer.address}, {customer.city}, {customer.state} {customer.zip}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Archived: {customer.archivedDate ? new Date(customer.archivedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        // Restore customer
                        const restoredCustomer = { ...customer };
                        delete restoredCustomer.archived;
                        delete restoredCustomer.archivedDate;
                        setCustomers([...customers, restoredCustomer]);
                        setArchivedCustomers(archivedCustomers.filter((_, i) => i !== idx));
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                    >
                      <RefreshCw size={16} />
                      Restore
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(`Permanently delete customer ${customer.name}? This cannot be undone.`)) {
                          setArchivedCustomers(archivedCustomers.filter((_, i) => i !== idx));
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

        {/* Archived Products */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Archive size={24} />
              Archived Products
            </h3>
            <span className="text-sm text-gray-600">{archivedProducts.length} items</span>
          </div>
          
          {archivedProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No archived products</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {archivedProducts.map((product, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.style} · {product.abv}% ABV · {product.ibu} IBU
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Archived: {product.archivedDate ? new Date(product.archivedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        // Restore product
                        const restoredProduct = { ...product };
                        delete restoredProduct.archived;
                        delete restoredProduct.archivedDate;
                        setProductList([...productList, restoredProduct]);
                        setArchivedProducts(archivedProducts.filter((_, i) => i !== idx));
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                    >
                      <RefreshCw size={16} />
                      Restore
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(`Permanently delete product ${product.name}? This cannot be undone.`)) {
                          setArchivedProducts(archivedProducts.filter((_, i) => i !== idx));
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
      </div>
    )}
  </div>

  {/* Camera Permission Modal */}
  {showPermissionModal && (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
        <button 
          onClick={() => {
            setShowPermissionModal(false);
            setScan(false);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={28} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera size={40} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Camera Access Required</h3>
          <p className="text-gray-600">
            CryptKeeper Pro needs camera access to scan keg barcodes. 
            Your camera will only be used for scanning and no data is stored.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 font-semibold mb-2">🔒 Privacy & Security</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Camera only active during scanning</li>
            <li>• No images or videos are recorded</li>
            <li>• Your permission choice is saved locally</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button 
            onClick={async () => {
              console.log('Allow button clicked');
              await requestCameraPermission();
            }}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Allow Camera Access
          </button>
          <button 
            onClick={() => {
              console.log('Not now clicked');
              setShowPermissionModal(false);
              setScan(false);
              localStorage.setItem('cameraPermission', 'denied');
              setCameraPermission('denied');
            }}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Not Now
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can change this permission anytime in Settings
        </p>
      </div>
    </div>
  )}

  {/* Scanner Modal */}
  {scan && (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4" style={{ display: showPermissionModal ? 'none' : 'flex' }}>
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h3 className="text-2xl font-bold">Scan Barcode</h3>
          <button onClick={() => { setScan(false); stopCam(); setBatchMode(false); setSelectedKegs([]); }}>
            <X size={28} />
          </button>
        </div>

        {batchMode && (
          <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-500 rounded-lg">
            <p className="font-bold text-blue-800">Batch Mode Active</p>
            <p className="text-sm text-blue-600">Scan multiple kegs. {selectedKegs.length} selected.</p>
          </div>
        )}

        {batchMode && selectedKegs.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border-2 border-green-500 rounded-lg">
            <p className="font-semibold text-green-800 mb-2">{selectedKegs.length} kegs ready for batch operation</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setModal('batchFill')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
              >
                Fill All
              </button>
              <button 
                onClick={() => setModal('batchShip')}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
              >
                Ship All
              </button>
              <button 
                onClick={() => setModal('batchReturn')}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-semibold"
              >
                Return All
              </button>
              <button 
                onClick={() => setModal('batchClean')}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold"
              >
                Clean All
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="relative bg-black rounded-xl overflow-hidden" style={{height: '400px'}}>
            <video 
              ref={vid} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
              onLoadedMetadata={() => console.log('📹 Video metadata loaded event')}
              onPlay={() => console.log('📹 Video play event')}
              onError={(e) => console.error('📹 Video error event:', e)}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-40 border-4 border-red-500 rounded-xl relative">
                <div className="absolute -top-2 -left-2 w-16 h-16 border-t-8 border-l-8 border-red-400 rounded-tl-xl"></div>
                <div className="absolute -top-2 -right-2 w-16 h-16 border-t-8 border-r-8 border-red-400 rounded-tr-xl"></div>
                <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-8 border-l-8 border-red-400 rounded-bl-xl"></div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-8 border-r-8 border-red-400 rounded-br-xl"></div>
                {!cameraInitialized && (
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black bg-opacity-60 px-4 py-2 rounded-lg font-bold">
                    Starting Camera...
                  </p>
                )}
              </div>
            </div>
          </div>
          {err && err.includes('Camera') ? (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-semibold">{err}</p>
              <p className="text-xs text-red-500 mt-1">
                To enable camera: Click the camera icon in your browser's address bar and allow access.
              </p>
            </div>
          ) : (
            <p className="text-center mt-3 text-sm text-gray-600">
              {cameraInitialized ? 'Camera active - Position barcode in red frame' : 'Activating camera...'}
            </p>
          )}
        </div>

        <input
          type="text"
          value={bc}
          onChange={e => setBc(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && bc && scanKeg(bc)}
          placeholder="Or type barcode (KEG001, KEG002...)"
          className="w-full px-4 py-3 border-2 rounded-lg font-mono text-lg mb-3"
        />
        {err && !err.includes('Camera') && <p className="text-red-600 text-sm mb-3">{err}</p>}
        <button 
          onClick={() => bc && scanKeg(bc)}
          className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
        >
          Submit Barcode
        </button>
      </div>
    </div>
  )}

  {/* Transaction Management Modal */}
  {modal === 'trans' && sel && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Keg Management</h3>
          <button onClick={() => setModal('')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-bold text-lg">{sel.id}</p>
          <p className="text-sm text-gray-600">{sel.product || 'Empty'} - {sel.size}</p>
          <p className="text-sm text-gray-600">📍 {sel.location}</p>
          <p className="text-sm text-gray-600">Status: {sel.status}</p>
          <p className="text-sm text-gray-600">Condition: {sel.condition}</p>
          {sel.daysOut > 0 && (
            <p className={`text-sm font-semibold mt-1 ${sel.daysOut > 30 ? 'text-red-600' : 'text-orange-600'}`}>
              ⏱️ {sel.daysOut} days out
            </p>
          )}
          {sel.maintenanceNotes && (
            <p className="text-sm text-red-600 mt-1">⚠️ {sel.maintenanceNotes}</p>
          )}
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => setModal('fillForm')} 
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
          >
            <Package size={20} />
            Fill Keg
          </button>
          <button 
            onClick={() => setModal('shipForm')} 
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
          >
            <Truck size={20} />
            Ship to Customer
          </button>
          <button 
            onClick={() => setModal('returnForm')} 
            className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Process Return
          </button>
          <button 
            onClick={() => {
              console.log('🔧 Repair completed button clicked for keg:', sel.id);
              processTrans('repair', {});
            }} 
            className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold flex items-center justify-center gap-2"
          >
            <Wrench size={20} />
            Repair Completed
          </button>
          <button 
            onClick={() => setModal('maintenanceForm')} 
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold flex items-center justify-center gap-2"
          >
            <Wrench size={20} />
            Flag for Maintenance
          </button>
          <button 
            onClick={() => processTrans('lost', {})} 
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2"
          >
            <AlertCircle size={20} />
            Mark as Lost
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Barcode Scan/Edit Modal */}
  {modal === 'editBarcode' && sel && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Scan/Edit Barcode</h3>
          <button onClick={() => { setModal(''); setSel(null); }}>
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-bold text-lg">{sel.id}</p>
          <p className="text-sm text-gray-600">{sel.product || 'Empty'} - {sel.size}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">Current Barcode: </span>
            {sel.barcode || 'Not set'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Barcode ID</label>
            <input
              id="barcodeInput"
              type="text"
              defaultValue={sel.barcode}
              placeholder="Enter or scan barcode..."
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Use a barcode scanner to automatically input the barcode number
            </p>
          </div>

          <button
            onClick={() => {
              setScan(false);
              setModal('scanBarcode');
            }}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Scan with Camera
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => { setModal(''); setSel(null); }}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const newBarcode = document.getElementById('barcodeInput').value.trim();
                if (!newBarcode) {
                  alert('Please enter a barcode');
                  return;
                }
                
                // Check if barcode is already used by another keg
                const existingKeg = kegs.find(k => k.barcode === newBarcode && k.id !== sel.id);
                if (existingKeg) {
                  alert(`Barcode ${newBarcode} is already assigned to ${existingKeg.id}`);
                  return;
                }
                
                console.log(`📊 Updating barcode for ${sel.id} from "${sel.barcode}" to "${newBarcode}"`);
                
                setKegs(kegs.map(k => 
                  k.id === sel.id 
                    ? { ...k, barcode: newBarcode }
                    : k
                ));
                
                setModal('');
                setSel(null);
              }}
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
            >
              Save Barcode
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Camera Barcode Scanner Modal */}
  {modal === 'scanBarcode' && sel && (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Scan Barcode with Camera</h3>
          <button onClick={() => { setModal('editBarcode'); stopCam(); }}>
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-bold">Scanning barcode for: {sel.id}</p>
          <p className="text-sm text-gray-600">Position the barcode within the camera view</p>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <video 
            ref={vid}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-4 border-purple-500 rounded-lg" style={{ width: '80%', height: '40%' }}>
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => { setModal('editBarcode'); stopCam(); }}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // For now, go back to manual entry
              // In production, this would process the camera feed for barcode detection
              setModal('editBarcode');
              stopCam();
            }}
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            Enter Manually
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          Note: Camera barcode scanning requires additional libraries. Use manual entry or a USB barcode scanner for best results.
        </p>
      </div>
    </div>
  )}

  {/* Fill Form Modal */}
  {modal === 'fillForm' && sel && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Fill Keg</h3>
          <button onClick={() => setModal('trans')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Product</label>
            <select 
              id="fillProduct" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            >
              {productList.filter(p => p.active).map(p => (
                <option key={p.name} value={p.name}>{p.name} ({p.abv}% ABV)</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Batch Number</label>
            <input 
              id="batchNumber"
              type="text" 
              placeholder="B2024-XXX" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            />
          </div>
          
          <button 
            onClick={() => {
              const product = document.getElementById('fillProduct').value;
              const batchNumber = document.getElementById('batchNumber').value;
              processTrans('fill', { product, batchNumber });
            }}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Fill Keg
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Ship Form Modal */}
  {modal === 'shipForm' && sel && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Ship to Customer</h3>
          <button onClick={() => setModal('trans')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Customer</label>
            <select 
              id="shipCustomer" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => {
              const customerId = document.getElementById('shipCustomer').value;
              processTrans('ship', { customerId });
            }}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Ship Keg
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Return Form Modal */}
  {modal === 'returnForm' && sel && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Process Return</h3>
          <button onClick={() => setModal('trans')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Condition</label>
            <select 
              id="returnCondition" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            >
              <option value="Good">Good</option>
              <option value="Needs Cleaning">Needs Cleaning</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>
          
          <button 
            onClick={() => {
              const condition = document.getElementById('returnCondition').value;
              console.log('🔄 Return button clicked, calling processTrans with condition:', condition);
              processTrans('return', { condition });
            }}
            className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
          >
            Process Return
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Maintenance Form Modal */}
  {modal === 'maintenanceForm' && sel && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Maintenance Details</h3>
          <button onClick={() => setModal('trans')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Issue Description</label>
            <textarea 
              id="maintenanceNotes"
              placeholder="Describe the issue..." 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
              rows="4"
            ></textarea>
          </div>
          
          <button 
            onClick={() => {
              const notes = document.getElementById('maintenanceNotes').value;
              processTrans('maintenance', { notes });
            }}
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
          >
            Flag for Maintenance
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Batch Fill Modal */}
  {modal === 'batchFill' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Batch Fill ({selectedKegs.length} kegs)</h3>
          <button onClick={() => setModal('')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Product</label>
            <select 
              id="batchFillProduct" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            >
              {productList.filter(p => p.active).map(p => (
                <option key={p.name} value={p.name}>{p.name} ({p.abv}% ABV)</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Batch Number</label>
            <input 
              id="batchFillBatchNumber"
              type="text" 
              placeholder="B2024-XXX" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            />
          </div>
          
          <button 
            onClick={() => {
              const product = document.getElementById('batchFillProduct').value;
              const batchNumber = document.getElementById('batchFillBatchNumber').value;
              processTrans('fill', { product, batchNumber });
            }}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Fill All Selected Kegs
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Batch Ship Modal */}
  {modal === 'batchShip' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Batch Ship ({selectedKegs.length} kegs)</h3>
          <button onClick={() => setModal('')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Customer</label>
            <select 
              id="batchShipCustomer" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => {
              const customerId = document.getElementById('batchShipCustomer').value;
              processTrans('ship', { customerId });
            }}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Ship All Selected Kegs
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Batch Return Modal */}
  {modal === 'batchReturn' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Batch Return ({selectedKegs.length} kegs)</h3>
          <button onClick={() => setModal('')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Condition</label>
            <select 
              id="batchReturnCondition" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            >
              <option value="Good">Good</option>
              <option value="Needs Cleaning">Needs Cleaning</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>
          
          <button 
            onClick={() => {
              const condition = document.getElementById('batchReturnCondition').value;
              processTrans('return', { condition });
            }}
            className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
          >
            Process All Returns
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Batch Clean Modal */}
  {modal === 'batchClean' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Batch Clean & Inspect ({selectedKegs.length} kegs)</h3>
          <button onClick={() => setModal('')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800">
              This will clean and inspect all selected kegs, marking them as "Good" condition and updating the last cleaned date.
            </p>
          </div>
          
          <button 
            onClick={() => {
              console.log('🧼 Batch clean button clicked');
              console.log('📦 Selected kegs:', selectedKegs);
              processTrans('clean', {});
            }}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            Clean All Selected Kegs
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Batch Repair Modal */}
  {modal === 'batchRepair' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Batch Repair Complete ({selectedKegs.length} kegs)</h3>
          <button onClick={() => setModal('')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-sm text-teal-800">
              This will mark repairs as complete for all selected kegs, returning them to "Good" condition and clearing maintenance notes.
            </p>
          </div>
          
          <button 
            onClick={() => {
              console.log('🔧 Batch repair button clicked');
              console.log('📦 Selected kegs:', selectedKegs);
              processTrans('repair', {});
            }}
            className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold"
          >
            Complete Repairs for All
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Batch Maintenance Modal */}
  {modal === 'batchMaintenance' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Batch Flag for Maintenance ({selectedKegs.length} kegs)</h3>
          <button onClick={() => setModal('')}>
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Issue Description</label>
            <textarea 
              id="batchMaintenanceNotes"
              placeholder="Describe the issue affecting these kegs..." 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
              rows="4"
            ></textarea>
          </div>
          
          <button 
            onClick={() => {
              const notes = document.getElementById('batchMaintenanceNotes').value;
              processTrans('maintenance', { notes });
            }}
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
          >
            Flag All for Maintenance
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Add/Edit Product Modal */}
  {(modal === 'addProduct' || modal === 'editProduct') && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full my-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{modal === 'addProduct' ? 'Add New Product' : 'Edit Product'}</h3>
          <button 
            onClick={() => {
              setModal('');
              setEditingItem(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4" key={editingItem?.data?.name || 'new'}>
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name</label>
            <input 
              id="productName"
              type="text" 
              defaultValue={editingItem?.data?.name || ''}
              placeholder="e.g., Hazy IPA" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-2">ABV (%)</label>
              <input 
                id="productABV"
                type="number" 
                step="0.1"
                defaultValue={editingItem?.data?.abv || ''}
                placeholder="6.5" 
                className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">IBU</label>
              <input 
                id="productIBU"
                type="number" 
                defaultValue={editingItem?.data?.ibu || ''}
                placeholder="45" 
                className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Style</label>
            <input 
              id="productStyle"
              type="text" 
              defaultValue={editingItem?.data?.style || ''}
              placeholder="IPA, Lager, Stout..." 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              id="productActive"
              type="checkbox" 
              defaultChecked={editingItem?.data?.active !== false}
              className="w-5 h-5"
            />
            <label className="text-sm font-semibold">Active (available for filling)</label>
          </div>
          
          <div className="flex gap-3 sticky bottom-0 bg-white pt-4 mt-4 border-t z-10">
            <button 
              onClick={() => {
                setModal('');
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                const name = document.getElementById('productName').value;
                const abv = parseFloat(document.getElementById('productABV').value);
                const ibu = parseInt(document.getElementById('productIBU').value);
                const style = document.getElementById('productStyle').value;
                const active = document.getElementById('productActive').checked;
                
                if (!name || !abv || !ibu || !style) {
                  alert('Please fill in all required fields');
                  return;
                }
                
                const newProduct = { name, abv, ibu, style, active };
                
                if (modal === 'addProduct') {
                  setProductList([...productList, newProduct]);
                  saveProductToFirebase(newProduct);
                  logActivity('Add Product', `Added product: ${name}`, null);
                } else {
                  // If editing, delete old product first (in case name changed)
                  if (editingItem.data.name !== name) {
                    deleteProductFromFirebase(editingItem.data);
                  }
                  const updated = [...productList];
                  updated[editingItem.index] = newProduct;
                  setProductList(updated);
                  saveProductToFirebase(newProduct);
                  logActivity('Edit Product', `Updated product: ${name}`, null);
                }
                
                setModal('');
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              {modal === 'addProduct' ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Add/Edit User Modal - Admin Only */}
  {(modal === 'addUser' || modal === 'editUser') && currentUser.role === 'Admin' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full my-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{modal === 'addUser' ? 'Add New User' : 'Edit User'}</h3>
          <button 
            onClick={() => {
              setModal('');
              setEditingItem(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4" key={editingItem?.data?.id || 'new'}>
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name *</label>
            <input 
              id="userName"
              type="text" 
              defaultValue={editingItem?.data?.name || ''}
              placeholder="e.g., John Smith" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address *</label>
            <input 
              id="userEmail"
              type="email" 
              defaultValue={editingItem?.data?.email || ''}
              placeholder="user@cryptkeeper.com" 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Role *</label>
            <select
              id="userRole"
              defaultValue={editingItem?.data?.role || 'Staff'}
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            >
              <option value="Admin">Admin - Full system access</option>
              <option value="Manager">Manager - Can manage kegs and customers</option>
              <option value="Staff">Staff - Basic operations only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Status *</label>
            <select
              id="userStatus"
              defaultValue={editingItem?.data?.status || 'Active'}
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">
              {modal === 'addUser' ? 'Initial Password *' : 'New Password'}
            </label>
            <input 
              id="userPassword"
              type="password" 
              placeholder={modal === 'addUser' ? 'Enter initial password' : 'Leave blank to keep current password'} 
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {modal === 'addUser' 
                ? 'User will be prompted to change on first login' 
                : 'Only fill this if you want to change the user\'s password'}
            </p>
          </div>
          
          <div className="flex gap-3 sticky bottom-0 bg-white pt-4 mt-4 border-t z-10">
            <button 
              onClick={() => {
                setModal('');
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                const name = document.getElementById('userName').value.trim();
                const email = document.getElementById('userEmail').value.trim();
                const role = document.getElementById('userRole').value;
                const status = document.getElementById('userStatus').value;
                
                if (!name || !email) {
                  alert('Please fill in all required fields');
                  return;
                }
                
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                  alert('Please enter a valid email address');
                  return;
                }
                
                // Check for duplicate email
                if (modal === 'addUser' && users.find(u => u.email === email)) {
                  alert('A user with this email already exists');
                  return;
                }
                
                if (modal === 'editUser' && users.find((u, idx) => u.email === email && idx !== editingItem.index)) {
                  alert('Another user with this email already exists');
                  return;
                }
                
                if (modal === 'addUser') {
                  const password = document.getElementById('userPassword').value;
                  if (!password) {
                    alert('Please enter an initial password');
                    return;
                  }
                  
                  const newUser = {
                    id: 'U' + (users.length + 1),
                    name,
                    email,
                    role,
                    status,
                    createdDate: new Date().toISOString().split('T')[0],
                    lastLogin: 'Never'
                  };
                  
                  setUsers([...users, newUser]);
                  saveUserToFirebase(newUser);
                  logActivity('Add User', `Added new user: ${name} (${email})`, null);
                  alert(`User ${name} added successfully!`);
                } else {
                  const password = document.getElementById('userPassword').value;
                  
                  const updatedUser = {
                    ...editingItem.data,
                    name,
                    email,
                    role,
                    status
                  };
                  
                  const updated = [...users];
                  updated[editingItem.index] = updatedUser;
                  setUsers(updated);
                  saveUserToFirebase(updatedUser);
                  
                  // Note: In a real app, you would update Firebase Auth password here
                  // For now, we just log it
                  if (password) {
                    logActivity('Edit User', `Updated user: ${name} (${email}) - Password changed`, null);
                    alert(`User ${name} updated successfully! Password has been changed.`);
                  } else {
                    logActivity('Edit User', `Updated user: ${name} (${email})`, null);
                    alert(`User ${name} updated successfully!`);
                  }
                }
                
                setModal('');
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              {modal === 'addUser' ? 'Add User' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Add/Edit Customer Modal */}
  {(modal === 'addCustomer' || modal === 'editCustomer') && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl h-[50vh] flex flex-col shadow-2xl">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex justify-between items-center px-5 py-3 border-b bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold">{modal === 'addCustomer' ? 'Add New Customer' : 'Edit Customer'}</h3>
          <button 
            onClick={() => {
              setModal('');
              setEditingItem(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3" style={{ overflowY: 'scroll' }} key={editingItem?.data?.id || 'new'}>
          <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Customer Name *</label>
            <input 
              id="customerName"
              type="text" 
              defaultValue={editingItem?.data?.name || ''}
              placeholder="e.g., Downtown Tap House" 
              className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold mb-1">Address *</label>
            <input 
              id="customerAddress"
              type="text" 
              defaultValue={editingItem?.data?.address || ''}
              placeholder="123 Main St" 
              className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1">City *</label>
              <input 
                id="customerCity"
                type="text" 
                defaultValue={editingItem?.data?.city || ''}
                placeholder="Portland" 
                className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold mb-1">State *</label>
              <input 
                id="customerState"
                type="text" 
                defaultValue={editingItem?.data?.state || ''}
                placeholder="OR" 
                className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold mb-1">ZIP *</label>
              <input 
                id="customerZip"
                type="text" 
                defaultValue={editingItem?.data?.zip || ''}
                placeholder="97201" 
                className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1">Phone *</label>
              <input 
                id="customerPhone"
                type="tel" 
                defaultValue={editingItem?.data?.phone || ''}
                placeholder="555-0101" 
                className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold mb-1">Email *</label>
              <input 
                id="customerEmail"
                type="email" 
                defaultValue={editingItem?.data?.email || ''}
                placeholder="orders@customer.com" 
                className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1">Delivery Day</label>
              <select 
                id="customerDeliveryDay"
                defaultValue={editingItem?.data?.deliveryDay || 'Monday'}
                className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              >
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold mb-1">Status</label>
              <select 
                id="customerStatus"
                defaultValue={editingItem?.data?.status || 'Active'}
                className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              >
                <option>Active</option>
                <option>Warning</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold mb-1">Notes</label>
            <textarea 
              id="customerNotes"
              defaultValue={editingItem?.data?.notes || ''}
              placeholder="Additional notes..." 
              className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              rows="2"
            ></textarea>
          </div>
          </div>
        </div>
          
        {/* Fixed Footer with Buttons */}
        <div className="flex-shrink-0 border-t px-5 py-3 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setModal('');
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                const name = document.getElementById('customerName').value;
                const address = document.getElementById('customerAddress').value;
                const city = document.getElementById('customerCity').value;
                const state = document.getElementById('customerState').value;
                const zip = document.getElementById('customerZip').value;
                const phone = document.getElementById('customerPhone').value;
                const email = document.getElementById('customerEmail').value;
                const deliveryDay = document.getElementById('customerDeliveryDay').value;
                const status = document.getElementById('customerStatus').value;
                const notes = document.getElementById('customerNotes').value;
                
                if (!name || !address || !city || !state || !zip || !phone || !email) {
                  alert('Please fill in all required fields (*)');
                  return;
                }
                
                const newCustomer = {
                  id: modal === 'addCustomer' ? `C${customers.length + 1}` : editingItem.data.id,
                  name, address, city, state, zip, phone, email,
                  deliveryDay, status, notes,
                  route: editingItem?.data?.route || 'N/A',
                  kegsOut: editingItem?.data?.kegsOut || 0,
                  depositBalance: editingItem?.data?.depositBalance || 0,
                  currentBalance: editingItem?.data?.currentBalance || 0,
                  creditLimit: editingItem?.data?.creditLimit || 2000
                };
                
                if (modal === 'addCustomer') {
                  setCustomers([...customers, newCustomer]);
                  saveCustomerToFirebase(newCustomer);
                  logActivity('Add Customer', `Added customer: ${newCustomer.name}`, null);
                } else {
                  const updated = [...customers];
                  updated[editingItem.index] = newCustomer;
                  setCustomers(updated);
                  saveCustomerToFirebase(newCustomer);
                  logActivity('Edit Customer', `Updated customer: ${newCustomer.name}`, null);
                }
                
                setModal('');
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm"
            >
              {modal === 'addCustomer' ? 'Add Customer' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Delete Confirmation Modal */}
  {deleteConfirm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-red-600">Are you sure?</h3>
        <p className="text-gray-700 mb-6">
          {deleteConfirm.type === 'customer' 
            ? `Delete customer "${deleteConfirm.item.name}"? This action cannot be undone.${deleteConfirm.item.kegsOut > 0 ? ` This will affect ${deleteConfirm.item.kegsOut} kegs currently out.` : ''}`
            : deleteConfirm.type === 'keg'
            ? `Delete keg "${deleteConfirm.item.id}"? This action cannot be undone.`
            : deleteConfirm.type === 'user'
            ? `Delete user "${deleteConfirm.item.name}"? This action cannot be undone.`
            : `Delete product "${deleteConfirm.item.name}"? This action cannot be undone.`
          }
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
          >
            No, Cancel
          </button>
          <button
            onClick={async () => {
              if (deleteConfirm.type === 'customer') {
                // Return all kegs from this customer to the brewery
                const customerName = deleteConfirm.item.name;
                const customerId = deleteConfirm.item.id;
                
                const updatedKegs = kegs.map(keg => {
                  // Check if keg is associated with this customer
                  if (keg.customer === customerId || keg.location === customerName) {
                    const returnedKeg = {
                      ...keg,
                      status: 'Empty',
                      location: 'Brewery',
                      customer: '',
                      returnDate: new Date().toISOString().split('T')[0],
                      daysOut: 0,
                      deposit: 0
                    };
                    saveKegToFirebase(returnedKeg);
                    return returnedKeg;
                  }
                  return keg;
                });
                
                setKegs(updatedKegs);
                
                // Delete the customer from Firebase
                await deleteDoc(doc(db, 'customers', customerId));
                setCustomers(customers.filter(c => c.id !== deleteConfirm.item.id));
                logActivity('Delete Customer', `Deleted customer: ${customerName}`, null);
              } else if (deleteConfirm.type === 'keg') {
                // Delete the keg from Firebase
                const kegToDelete = kegs[deleteConfirm.index];
                await deleteDoc(doc(db, 'kegs', kegToDelete.id));
                setKegs(kegs.filter((_, i) => i !== deleteConfirm.index));
                logActivity('Delete Keg', `Deleted keg: ${kegToDelete.id}`, kegToDelete.id);
              } else if (deleteConfirm.type === 'product') {
                const productToDelete = productList[deleteConfirm.index];
                await deleteProductFromFirebase(productToDelete);
                setProductList(productList.filter((_, i) => i !== deleteConfirm.index));
                logActivity('Delete Product', `Deleted product: ${productToDelete.name}`, null);
              } else if (deleteConfirm.type === 'user') {
                const userToDelete = deleteConfirm.item;
                await deleteUserFromFirebase(userToDelete.id);
                setUsers(users.filter((_, i) => i !== deleteConfirm.index));
                logActivity('Delete User', `Deleted user: ${userToDelete.name}`, null);
              }
              setDeleteConfirm(null);
            }}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Keg History Modal */}
  {showKegHistory && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex justify-between items-center px-5 py-3 border-b bg-white">
          <h3 className="text-lg font-bold">Keg History: {showKegHistory}</h3>
          <button onClick={() => setShowKegHistory(null)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {(() => {
            const keg = kegs.find(k => k.id === showKegHistory);
            if (!keg) return <p className="text-gray-500">Keg not found</p>;
            
            // Create a simulated history timeline
            const history = [
              keg.purchaseDate && { date: keg.purchaseDate, action: 'Purchased', details: `Keg ${keg.id} added to inventory`, icon: Package },
              keg.lastCleaned && { date: keg.lastCleaned, action: 'Cleaned', details: 'Keg cleaned and sanitized', icon: Check },
              keg.fillDate && { date: keg.fillDate, action: 'Filled', details: `Filled with ${keg.product}`, icon: Package },
              keg.shipDate && { date: keg.shipDate, action: 'Shipped', details: `Shipped to ${keg.location}`, icon: Truck },
              keg.returnDate && { date: keg.returnDate, action: 'Returned', details: 'Returned to brewery', icon: RefreshCw },
            ].filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
            
            return (
              <div className="space-y-4">
                {/* Current Status */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-bold mb-2 text-sm">Current Status</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="font-semibold">ID:</span> {keg.id}</div>
                    <div><span className="font-semibold">Product:</span> {keg.product || 'Empty'}</div>
                    <div><span className="font-semibold">Status:</span> {keg.status}</div>
                    <div><span className="font-semibold">Location:</span> {keg.location}</div>
                    <div><span className="font-semibold">Size:</span> {keg.size}</div>
                    <div><span className="font-semibold">Condition:</span> {keg.condition}</div>
                    <div><span className="font-semibold">Days Out:</span> {keg.daysOut}</div>
                    <div><span className="font-semibold">Turns:</span> {keg.turnsThisYear}</div>
                  </div>
                </div>
                
                {/* Timeline */}
                <div>
                  <h4 className="font-bold mb-2 text-sm">Activity Timeline</h4>
                  <div className="space-y-2">
                    {history.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 text-xs">No history available</p>
                    ) : (
                      history.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="flex gap-2 p-2 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon size={16} className="text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">{item.action}</p>
                              <p className="text-xs text-gray-600 truncate">{item.details}</p>
                              <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    
                    {/* Activity Log entries for this keg */}
                    {activityLog.filter(a => a.kegId === showKegHistory).slice(0, 5).map(activity => (
                      <div key={activity.id} className="flex gap-2 p-2 bg-purple-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Activity size={16} className="text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-600 truncate">{activity.details}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Additional Info */}
                {keg.maintenanceNotes && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 rounded">
                    <p className="font-semibold text-yellow-700 text-sm">Maintenance Notes</p>
                    <p className="text-xs text-yellow-600">{keg.maintenanceNotes}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  )}

  {/* Add Keg Modal */}
  {modal === 'addKeg' && !scan && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl h-[50vh] flex flex-col shadow-2xl">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex justify-between items-center px-5 py-3 border-b bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold">Add New Keg</h3>
          <button onClick={() => { 
            setModal(''); 
            setScannedBarcodeForInventory('');
          }} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3" style={{ overflowY: 'scroll' }}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Keg ID *</label>
                <input
                  id="newKegId"
                  type="text"
                  placeholder="e.g., KEG011"
                  className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Barcode *</label>
                <div className="flex gap-2">
                  <input
                    id="newKegBarcode"
                    type="text"
                    placeholder="Scan barcode..."
                    value={scannedBarcodeForInventory}
                    onChange={(e) => setScannedBarcodeForInventory(e.target.value)}
                    className="flex-1 px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setScan(true)}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1 text-sm"
                  >
                    <Camera size={16} />
                    Scan
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Keg Size *</label>
                <select
                  id="newKegSize"
                  className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                  defaultValue="15.5 gal"
                >
                  <option value="15.5 gal">15.5 gal (Half Barrel)</option>
                  <option value="7.75 gal">7.75 gal (Quarter Barrel)</option>
                  <option value="5.16 gal">5.16 gal (Sixth Barrel)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Owner *</label>
                <select
                  id="newKegOwner"
                  className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                  defaultValue="Brewery"
                >
                  <option value="Brewery">Brewery</option>
                  <option value="Rental">Rental</option>
                  <option value="Customer">Customer Owned</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Purchase Date *</label>
                <input
                  id="newKegPurchaseDate"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Deposit</label>
                <input
                  id="newKegDeposit"
                  type="text"
                  value="$30"
                  disabled
                  className="w-full px-3 py-2 border-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Notes (Optional)</label>
              <textarea
                id="newKegNotes"
                placeholder="Any notes..."
                rows="2"
                className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              />
            </div>

            <div className="bg-blue-50 border border-blue-300 p-2 rounded-lg">
              <p className="text-xs text-blue-800">
                Keg will be added as "Empty" at Brewery location.
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex-shrink-0 border-t px-5 py-3 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setModal('');
                setScannedBarcodeForInventory('');
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const kegId = document.getElementById('newKegId').value.trim().toUpperCase();
                const barcode = scannedBarcodeForInventory.trim();
                const size = document.getElementById('newKegSize').value;
                const owner = document.getElementById('newKegOwner').value;
                const purchaseDate = document.getElementById('newKegPurchaseDate').value;
                const deposit = 30;
                const notes = document.getElementById('newKegNotes').value.trim();

                if (!kegId) {
                  alert('Please enter a Keg ID');
                  return;
                }

                if (!barcode) {
                  alert('Please scan a barcode. Click the "Scan" button to use your camera.');
                  return;
                }

                if (kegs.find(k => k.id === kegId)) {
                  alert(`Keg ID "${kegId}" already exists. Please use a different ID.`);
                  return;
                }

                if (kegs.find(k => k.barcode === barcode)) {
                  alert(`Barcode "${barcode}" is already assigned to another keg.`);
                  return;
                }

                const newKeg = {
                  id: kegId,
                  barcode: barcode,
                  product: '',
                  size: size,
                  status: 'Empty',
                  location: 'Brewery',
                  owner: owner,
                  customer: '',
                  fillDate: '',
                  shipDate: '',
                  returnDate: '',
                  daysOut: 0,
                  condition: 'Good',
                  deposit: deposit,
                  lastCleaned: new Date().toISOString().split('T')[0],
                  turnsThisYear: 0,
                  batchNumber: '',
                  maintenanceNotes: notes,
                  rentalRate: 0,
                  purchaseDate: purchaseDate
                };

                console.log('➕ Adding new keg:', newKeg);
                setKegs([...kegs, newKeg]);
                
                // Save new keg to Firebase
                saveKegToFirebase(newKeg);
                
                // Log activity
                logActivity('Add Keg', `Added new keg ${kegId} (${size})`, kegId);
                
                setModal('');
                setScannedBarcodeForInventory(''); // Clear scanned barcode
                alert(`Keg ${kegId} added successfully!`);
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
            >
              Add Keg
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Edit Keg Modal */}
  {modal === 'editKeg' && editingItem && !scan && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl h-[50vh] flex flex-col shadow-2xl">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex justify-between items-center px-5 py-3 border-b bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold">Edit Keg</h3>
          <button onClick={() => { 
            setModal(''); 
            setEditingItem(null); 
            setScannedBarcodeForInventory('');
          }} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3" style={{ overflowY: 'scroll' }}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Keg ID *</label>
                <input
                  id="editKegId"
                  type="text"
                  defaultValue={editingItem.data.id}
                  disabled
                  className="w-full px-3 py-2 border-2 rounded-lg bg-gray-100 text-gray-600 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">ID cannot be changed</p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Barcode *</label>
                <div className="flex gap-2">
                  <input
                    id="editKegBarcode"
                    type="text"
                    placeholder="Scan barcode..."
                    value={scannedBarcodeForInventory || editingItem.data.barcode}
                    onChange={(e) => setScannedBarcodeForInventory(e.target.value)}
                    className="flex-1 px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setScan(true)}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1 text-sm"
                  >
                    <Camera size={16} />
                    Scan
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Keg Size *</label>
                <select
                  id="editKegSize"
                  className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                  defaultValue={editingItem.data.size}
                >
                  <option value="15.5 gal">15.5 gal (Half Barrel)</option>
                  <option value="7.75 gal">7.75 gal (Quarter Barrel)</option>
                  <option value="5.16 gal">5.16 gal (Sixth Barrel)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Owner *</label>
                <select
                  id="editKegOwner"
                  className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                  defaultValue={editingItem.data.owner}
                >
                  <option value="Brewery">Brewery</option>
                  <option value="Rental">Rental</option>
                  <option value="Customer">Customer Owned</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Condition</label>
                <select
                  id="editKegCondition"
                  className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                  defaultValue={editingItem.data.condition}
                >
                  <option value="Good">Good</option>
                  <option value="Needs Cleaning">Needs Cleaning</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Deposit</label>
                <input
                  id="editKegDeposit"
                  type="number"
                  defaultValue={editingItem.data.deposit}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Maintenance Notes</label>
              <textarea
                id="editKegNotes"
                placeholder="Any notes..."
                rows="2"
                defaultValue={editingItem.data.maintenanceNotes}
                className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex-shrink-0 border-t px-5 py-3 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-2">
            <button
              onClick={() => { 
                setModal(''); 
                setEditingItem(null); 
                setScannedBarcodeForInventory('');
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const barcode = scannedBarcodeForInventory.trim();
                const size = document.getElementById('editKegSize').value;
                const owner = document.getElementById('editKegOwner').value;
                const condition = document.getElementById('editKegCondition').value;
                const deposit = parseInt(document.getElementById('editKegDeposit').value);
                const notes = document.getElementById('editKegNotes').value.trim();

                if (!barcode) {
                  alert('Barcode is required. Please scan a barcode.');
                  return;
                }

                // Check if barcode already exists on a different keg
                if (kegs.find(k => k.barcode === barcode && k.id !== editingItem.data.id)) {
                  alert(`Barcode "${barcode}" is already assigned to another keg.`);
                  return;
                }

                const updatedKeg = {
                  ...editingItem.data,
                  barcode,
                  size,
                  owner,
                  condition,
                  deposit,
                  maintenanceNotes: notes
                };

                const updated = [...kegs];
                updated[editingItem.index] = updatedKeg;
                setKegs(updated);
                
                // Save updated keg to Firebase
                saveKegToFirebase(updatedKeg);
                
                setModal('');
                setEditingItem(null);
                setScannedBarcodeForInventory('');
                logActivity('Edit Keg', `Updated keg ${updatedKeg.id}`, updatedKeg.id);
                alert(`Keg ${updatedKeg.id} updated successfully!`);
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Bulk Fill Modal */}
  {bulkOperationModal === 'fill' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Fill Kegs</h2>
            <button onClick={() => setBulkOperationModal(null)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
              <select
                value={bulkOperationData.product || ''}
                onChange={(e) => setBulkOperationData({...bulkOperationData, product: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Product</option>
                {products.filter(p => p.active).map(p => (
                  <option key={p.name} value={p.name}>
                    {p.name} ({p.abv}% ABV)
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Number</label>
              <input
                type="text"
                placeholder="B2024-XXX"
                value={bulkOperationData.batchNumber || ''}
                onChange={(e) => setBulkOperationData({...bulkOperationData, batchNumber: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={() => {
              if (!bulkOperationData.product) {
                alert('Please select a product');
                return;
              }
              
              const selectedKegObjs = kegs.filter(k => selectedItems.includes(k.id));
              selectedKegObjs.forEach(k => {
                const updatedKeg = {
                  ...k,
                  product: bulkOperationData.product,
                  batchNumber: bulkOperationData.batchNumber || '',
                  status: 'Filled',
                  fillDate: new Date().toISOString().split('T')[0],
                  location: 'Brewery'
                };
                setKegs(prev => prev.map(keg => keg.id === k.id ? updatedKeg : keg));
                saveKegToFirebase(updatedKeg);
                logActivity('Bulk Fill', `Filled keg ${k.id} with ${bulkOperationData.product}`, k.id);
              });
              alert(`Filled ${selectedItems.length} kegs with ${bulkOperationData.product}`);
              setSelectedItems([]);
              setBulkOperationModal(null);
              setBulkOperationData({});
            }}
            className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Fill Kegs
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Bulk Ship Modal */}
  {bulkOperationModal === 'ship' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Ship to Customer</h2>
            <button onClick={() => setBulkOperationModal(null)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Customer</label>
              <select
                value={bulkOperationData.customer || ''}
                onChange={(e) => setBulkOperationData({...bulkOperationData, customer: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Customer</option>
                {customers.filter(c => c.status === 'Active').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={() => {
              if (!bulkOperationData.customer) {
                alert('Please select a customer');
                return;
              }
              
              const selectedKegObjs = kegs.filter(k => selectedItems.includes(k.id));
              const customer = customers.find(c => c.id === bulkOperationData.customer);
              
              selectedKegObjs.forEach(k => {
                const updatedKeg = {
                  ...k,
                  status: 'At Customer',
                  customer: bulkOperationData.customer,
                  shipDate: new Date().toISOString().split('T')[0],
                  location: customer?.name || 'Customer'
                };
                setKegs(prev => prev.map(keg => keg.id === k.id ? updatedKeg : keg));
                saveKegToFirebase(updatedKeg);
                logActivity('Bulk Ship', `Shipped keg ${k.id} to ${customer?.name}`, k.id);
              });
              
              alert(`Shipped ${selectedItems.length} kegs to ${customer?.name}`);
              setSelectedItems([]);
              setBulkOperationModal(null);
              setBulkOperationData({});
            }}
            className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Ship Kegs
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Bulk Return Modal */}
  {bulkOperationModal === 'return' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Process Return</h2>
            <button onClick={() => setBulkOperationModal(null)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
              <select
                value={bulkOperationData.condition || 'Good'}
                onChange={(e) => setBulkOperationData({...bulkOperationData, condition: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="Good">Good</option>
                <option value="Needs Cleaning">Needs Cleaning</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => {
              const selectedKegObjs = kegs.filter(k => selectedItems.includes(k.id));
              
              selectedKegObjs.forEach(k => {
                const updatedKeg = {
                  ...k,
                  status: 'Empty',
                  condition: bulkOperationData.condition || 'Good',
                  returnDate: new Date().toISOString().split('T')[0],
                  location: 'Brewery',
                  customer: '',
                  product: '',
                  batchNumber: ''
                };
                setKegs(prev => prev.map(keg => keg.id === k.id ? updatedKeg : keg));
                saveKegToFirebase(updatedKeg);
                logActivity('Bulk Return', `Returned keg ${k.id} in ${bulkOperationData.condition || 'Good'} condition`, k.id);
              });
              
              alert(`Processed return for ${selectedItems.length} kegs`);
              setSelectedItems([]);
              setBulkOperationModal(null);
              setBulkOperationData({});
            }}
            className="w-full mt-6 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
          >
            Process Return
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Floating Quick Action Button */}
  {view === 'inventory' && !bulkSelectMode && !batchMode && (
    <div className="fixed bottom-8 right-8 z-40">
      {quickActionMenu && (
        <div className="absolute bottom-20 right-0 bg-white rounded-xl shadow-2xl p-3 space-y-2 mb-2">
          <button 
            onClick={() => { setModal('addKeg'); setQuickActionMenu(false); }}
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 w-full text-left font-semibold"
          >
            <Plus size={20} />
            <span>Add Keg</span>
          </button>
          <button 
            onClick={() => { setScan(true); setQuickActionMenu(false); }}
            className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 w-full text-left font-semibold"
          >
            <Camera size={20} />
            <span>Scan Barcode</span>
          </button>
          <button 
            onClick={() => { setBatchMode(true); setQuickActionMenu(false); }}
            className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 w-full text-left font-semibold"
          >
            <Layers size={20} />
            <span>Batch Mode</span>
          </button>
          <button 
            onClick={() => { exportData('inventory'); setQuickActionMenu(false); }}
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 w-full text-left font-semibold"
          >
            <Download size={20} />
            <span>Export Data</span>
          </button>
        </div>
      )}
      <button 
        onClick={() => setQuickActionMenu(!quickActionMenu)}
        className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 flex items-center justify-center transition-transform hover:scale-110"
      >
        {quickActionMenu ? <X size={28} /> : <Plus size={28} />}
      </button>   
    </div>
  );
};

export default App;
