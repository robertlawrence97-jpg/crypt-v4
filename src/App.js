import React, { useState, useRef, useEffect } from 'react';
import { Camera, Package, Truck, Users, BarChart3, Search, Plus, MapPin, AlertCircle, Check, X, Edit, Trash2, Save, QrCode, Home, FileText, Clock, DollarSign, TrendingUp, Filter, Download, Calendar, Wrench, Bell, TrendingDown, Archive, RefreshCw, Shield, Activity, Target, Layers, Cloud, Upload } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';

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

// CryptKeeper Logo Component with actual logo image
const CryptKeeperLogo = ({ className = "h-12 w-auto" }) => (
  <img 
    src="https://i.ibb.co/F56wR6L/logo.png"
    alt="CryptKeeper Logo" 
    className={className}
    onError={(e) => {
      // Fallback to text logo if image fails
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'block';
    }}
  />
);

function App() {
  const [page, setPage] = useState('home');
  const [kegs, setKegs] = useState(() => {
    const saved = localStorage.getItem('kegtracker_kegs');
    return saved ? JSON.parse(saved) : initialKegs;
  });
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('kegtracker_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });
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
  const vid = useRef(null);
  const codeReader = useRef(null);
  const scanControlsRef = useRef(null); // Reference to store ZXing controls
  
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

  // Save to localStorage whenever state changes
  useEffect(() => {
    console.log('💾 Saving kegs to localStorage:', kegs.length, 'kegs');
    localStorage.setItem('kegtracker_kegs', JSON.stringify(kegs));
  }, [kegs]);

  useEffect(() => {
    localStorage.setItem('kegtracker_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('kegtracker_activity', JSON.stringify(activityLog));
  }, [activityLog]);

  // FIXED: Modal cleanup - only run on unmount, not on mount
  useEffect(() => {
    if (modal === 'scan') {
      console.log('🎥 Scan modal opened, starting camera...');
      
      // Check camera permission
      const permission = localStorage.getItem('cameraPermission');
      console.log('Camera permission status:', permission);
      
      if (!permission || permission === 'prompt') {
        console.log('Showing permission modal (first time or retrying)');
        setShowPermissionModal(true);
      } else if (permission === 'granted') {
        console.log('Permission already granted, starting camera');
        startCameraStream();
      } else if (permission === 'denied') {
        console.log('Permission denied previously');
        setErr('Camera permission was previously denied. Please enable it in your browser settings.');
      }

      // FIXED: Return cleanup function that only runs on unmount
      return () => {
        console.log('🎬 Modal closed, cleaning up camera...');
        stopCam();
      };
    }
  }, [modal]); // Only re-run when modal changes

  // Helper function to log activities
  const logActivity = (action, details, kegId = null) => {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      kegId,
      user: 'Current User'
    };
    setActivityLog(prev => [newActivity, ...prev].slice(0, 100));
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
    console.log('🎥 requestCameraPermission called - requesting from BROWSER now');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      console.log('✅ Browser granted camera permission!');
      console.log('📹 Stream obtained:', stream);
      console.log('📹 Stream active:', stream.active);
      console.log('📹 Video tracks:', stream.getVideoTracks().length);
      
      // Save permission
      localStorage.setItem('cameraPermission', 'granted');
      setCameraPermission('granted');
      setShowPermissionModal(false);
      
      // Attach stream to video element
      console.log('🎬 Attaching stream to video element');
      console.log('📹 Video ref exists:', !!vid.current);
      
      if (vid.current) {
        console.log('✅ Video element found, attaching stream');
        vid.current.srcObject = stream;
        
        // Wait for video to be ready, then start scanning
        vid.current.onloadedmetadata = () => {
          console.log('📹 Video metadata loaded!');
          vid.current.play()
            .then(() => {
              console.log('📹 Video playing successfully');
              // Wait a bit for video to stabilize before scanning
              setTimeout(() => startBarcodeScanning(), 1000);
            })
            .catch(err => console.error('❌ Play failed:', err));
        };
      } else {
        console.warn('⚠️ Video ref not found yet');
      }
      
    } catch (e) {
      console.error('❌ Camera permission error:', e);
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
    console.log('🎥 startCameraStream called');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      console.log('📹 Stream obtained!');
      
      if (vid.current) {
        console.log('✅ Attaching stream to video element');
        vid.current.srcObject = stream;
        
        vid.current.onloadedmetadata = () => {
          console.log('📹 Video metadata loaded');
          vid.current.play()
            .then(() => {
              console.log('📹 Video playing');
              // Wait for video to stabilize before scanning
              setTimeout(() => startBarcodeScanning(), 1000);
            })
            .catch(err => console.error('❌ Play error:', err));
        };
      }
      
    } catch (e) {
      console.error('❌ Camera error:', e);
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

  // FIXED: Improved barcode scanning with better error handling
  const startBarcodeScanning = async () => {
    console.log('🔍 Starting real barcode scanning with ZXing');
    
    // Check if video is ready
    if (!vid.current || !vid.current.srcObject) {
      console.log('⏳ Video not ready yet, retrying in 500ms...');
      setTimeout(() => startBarcodeScanning(), 500);
      return;
    }
    
    // Check if video is actually playing
    if (vid.current.paused || vid.current.readyState < 2) {
      console.log('⏳ Video not playing yet, retrying in 500ms...');
      setTimeout(() => startBarcodeScanning(), 500);
      return;
    }
    
    try {
      // Initialize the barcode reader if not already done
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
        console.log('✅ ZXing reader initialized');
      }

      console.log('📹 Starting continuous decode from video element');
      
      // FIXED: Use decodeFromVideoDevice with proper error filtering
      const controls = await codeReader.current.decodeFromVideoDevice(
        undefined, // Use default video device  
        vid.current,
        (result, err) => {
          if (result) {
            const barcodeText = result.getText();
            console.log('✅ Barcode detected:', barcodeText);
            
            // Play success beep
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAo=');
              audio.play();
            } catch (e) {
              console.log('Beep failed:', e);
            }
            
            // Set the barcode value
            setBc(barcodeText);
            setErr('');
            
            // Auto-submit after short delay
            setTimeout(() => {
              stopCam();
              submitBarcode(barcodeText);
            }, 500);
          }
          
          // FIXED: Only log non-NotFoundException errors to reduce console spam
          if (err && err.name !== 'NotFoundException') {
            console.error('❌ Scan error:', err.name, err.message);
          }
        }
      );
      
      // Store controls for cleanup
      scanControlsRef.current = controls;
      console.log('✅ Barcode scanning active');
      
    } catch (e) {
      console.error('❌ Barcode scanning error:', e);
      setErr('Barcode scanning failed: ' + e.message);
    }
  };

  const submitBarcode = (code) => {
    console.log('📝 Submitting barcode:', code);
    const k = kegs.find(x => x.barcode === code);
    if (k) {
      setSel(k);
      setModal('');
      setErr('');
      logActivity('Barcode Scanned', `Scanned keg ${k.id}`, k.id);
    } else {
      setErr(`No keg found with barcode: ${code}`);
    }
  };

  // FIXED: Improved cleanup function
  const stopCam = () => {
    console.log('🛑 Stopping camera and scanner...');
    
    // Stop the barcode reader using stored controls
    if (scanControlsRef.current) {
      try {
        scanControlsRef.current.stop();
        console.log('✅ Scanner stopped via controls');
      } catch (e) {
        console.log('⚠️ Scanner control stop error:', e);
      }
      scanControlsRef.current = null;
    }
    
    // Also reset the code reader
    if (codeReader.current) {
      try {
        codeReader.current.reset();
        console.log('✅ Code reader reset');
      } catch (e) {
        console.log('⚠️ Code reader reset error:', e);
      }
    }
    
    // Stop all video tracks
    if (vid.current?.srcObject) {
      const tracks = vid.current.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log('✅ Video track stopped');
      });
      vid.current.srcObject = null;
    }
    
    setModal('');
  };

  const addOrUpdateKeg = (updated) => {
    if (editingItem) {
      setKegs(kegs.map(k => k.id === editingItem.id ? { ...k, ...updated } : k));
      logActivity('Keg Updated', `Updated keg ${updated.id}`, updated.id);
    } else {
      const newKeg = {
        id: `KEG${String(kegs.length + 1).padStart(3, '0')}`,
        ...updated,
        turnsThisYear: 0,
        deposit: 30,
        lastCleaned: new Date().toISOString().split('T')[0],
        condition: 'Good',
        maintenanceNotes: '',
        rentalRate: 0,
        purchaseDate: new Date().toISOString().split('T')[0]
      };
      setKegs([...kegs, newKeg]);
      logActivity('Keg Added', `Added new keg ${newKeg.id}`, newKeg.id);
    }
    setEditingItem(null);
    setModal('');
  };

  const addOrUpdateCustomer = (updated) => {
    if (editingItem) {
      setCustomers(customers.map(c => c.id === editingItem.id ? { ...c, ...updated } : c));
      logActivity('Customer Updated', `Updated customer ${updated.name}`);
    } else {
      const newCustomer = {
        id: `C${customers.length + 1}`,
        ...updated,
        kegsOut: 0,
        depositBalance: 0,
        currentBalance: 0,
        status: 'Active'
      };
      setCustomers([...customers, newCustomer]);
      logActivity('Customer Added', `Added new customer ${updated.name}`);
    }
    setEditingItem(null);
    setModal('');
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.type === 'customer') {
      setCustomers(customers.filter((_, i) => i !== deleteConfirm.index));
      logActivity('Customer Deleted', `Deleted customer ${deleteConfirm.item.name}`);
    } else if (deleteConfirm.type === 'product') {
      // Product deletion would be handled here
      logActivity('Product Deleted', `Deleted product ${deleteConfirm.item.name}`);
    }
    
    setDeleteConfirm(null);
  };

  // Filter kegs based on search, status filter, and advanced filters
  const filteredKegs = kegs.filter(k => {
    // Basic search
    const matchesSearch = !search || 
      k.id.toLowerCase().includes(search.toLowerCase()) ||
      k.barcode.toLowerCase().includes(search.toLowerCase()) ||
      k.product.toLowerCase().includes(search.toLowerCase()) ||
      k.location.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || k.status === filterStatus;
    
    // Advanced filters
    const matchesAdvanced = (
      (advancedFilters.statuses.length === 0 || advancedFilters.statuses.includes(k.status)) &&
      (advancedFilters.products.length === 0 || advancedFilters.products.includes(k.product)) &&
      (advancedFilters.locations.length === 0 || advancedFilters.locations.includes(k.location)) &&
      (advancedFilters.conditions.length === 0 || advancedFilters.conditions.includes(k.condition)) &&
      (advancedFilters.customers.length === 0 || advancedFilters.customers.includes(k.customer)) &&
      (!advancedFilters.daysOutMin || k.daysOut >= parseInt(advancedFilters.daysOutMin)) &&
      (!advancedFilters.daysOutMax || k.daysOut <= parseInt(advancedFilters.daysOutMax))
    );
    
    return matchesSearch && matchesStatus && matchesAdvanced;
  });

  // Render functions for different pages
  const renderHome = () => (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to CryptKeeper</h1>
        <p className="text-xl mb-6">Professional Keg Tracking & Brewery Management</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setModal('scan')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Scan Barcode
          </button>
          <button
            onClick={() => setPage('kegs')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            View Kegs
          </button>
          <button
            onClick={() => setPage('reports')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            Reports
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Kegs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">At Customers</p>
              <p className="text-3xl font-bold text-green-600">{stats.atCustomers}</p>
            </div>
            <Truck className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Utilization</p>
              <p className="text-3xl font-bold text-purple-600">{stats.utilization}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          {activityLog.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {activityLog.slice(0, 10).map(activity => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => { setEditingItem(null); setModal('addKeg'); }}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-center gap-2"
        >
          <Plus className="w-8 h-8 text-blue-500" />
          <span className="font-semibold">Add Keg</span>
        </button>
        <button
          onClick={() => { setEditingItem(null); setModal('addCustomer'); }}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-center gap-2"
        >
          <Users className="w-8 h-8 text-green-500" />
          <span className="font-semibold">Add Customer</span>
        </button>
        <button
          onClick={() => setPage('deliveries')}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-center gap-2"
        >
          <Truck className="w-8 h-8 text-purple-500" />
          <span className="font-semibold">Deliveries</span>
        </button>
        <button
          onClick={() => setPage('maintenance')}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-center gap-2"
        >
          <Wrench className="w-8 h-8 text-orange-500" />
          <span className="font-semibold">Maintenance</span>
        </button>
      </div>
    </div>
  );

  const renderKegs = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Keg Inventory</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setEditingItem(null); setModal('addKeg'); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Keg
          </button>
          <button
            onClick={() => setModal('scan')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Scan
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search kegs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Empty">Empty</option>
            <option value="Filled">Filled</option>
            <option value="At Customer">At Customer</option>
            <option value="In Transit">In Transit</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Lost">Lost</option>
          </select>
          <button
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Advanced
          </button>
        </div>
        
        {showAdvancedFilter && (
          <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days Out Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={advancedFilters.daysOutMin}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, daysOutMin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={advancedFilters.daysOutMax}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, daysOutMax: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keg List */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKegs.map((k, idx) => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{k.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{k.barcode || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{k.product || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{k.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      k.status === 'At Customer' ? 'bg-green-100 text-green-800' :
                      k.status === 'Filled' ? 'bg-blue-100 text-blue-800' :
                      k.status === 'Empty' ? 'bg-gray-100 text-gray-800' :
                      k.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      k.status === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {k.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{k.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={k.daysOut > 30 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                      {k.daysOut > 0 ? `${k.daysOut} days` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(k); setModal('addKeg'); }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSel(k)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredKegs.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No kegs found matching your filters</p>
        </div>
      )}
    </div>
  );

  const renderCustomers = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={() => { setEditingItem(null); setModal('addCustomer'); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      <div className="grid gap-6">
        {customers.map((c, idx) => (
          <div key={c.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    c.status === 'Active' ? 'bg-green-100 text-green-800' :
                    c.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </p>
                    <p className="font-medium text-gray-900">{c.address}</p>
                    <p className="text-gray-600">{c.city}, {c.state} {c.zip}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{c.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Kegs Out</p>
                    <p className="font-bold text-2xl text-blue-600">{c.kegsOut}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Balance</p>
                    <p className="font-bold text-2xl text-green-600">${c.currentBalance}</p>
                  </div>
                </div>
                {c.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700"><strong>Notes:</strong> {c.notes}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingItem(c); setModal('addCustomer'); }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ type: 'customer', item: c, index: idx })}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No customers yet</p>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$12,450</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Avg Keg Turns</h3>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.avgTurns}</p>
          <p className="text-sm text-gray-600 mt-2">per keg this year</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Deposits</h3>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.deposits}</p>
          <p className="text-sm text-gray-600 mt-2">held currently</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fleet Value</h3>
            <Target className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">total keg inventory</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Keg Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.filled}</p>
            <p className="text-sm text-gray-600">Filled</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.atCustomers}</p>
            <p className="text-sm text-gray-600">At Customers</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.empty}</p>
            <p className="text-sm text-gray-600">Empty</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{stats.maintenance}</p>
            <p className="text-sm text-gray-600">Maintenance</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
            <p className="text-sm text-gray-600">Lost</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Export Keg List (CSV)
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Customer Report (PDF)
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Financial Summary (XLSX)
          </button>
        </div>
      </div>
    </div>
  );

  // Modals
  const renderScanModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Scan Barcode</h2>
          <button
            onClick={stopCam}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {showPermissionModal ? (
          <div className="space-y-4 py-6">
            <div className="text-center">
              <Camera className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Camera Permission Required</h3>
              <p className="text-gray-600 mb-6">
                This app needs access to your camera to scan barcodes. Your camera will only be used for scanning and no images will be stored.
              </p>
              <button
                onClick={requestCameraPermission}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Allow Camera Access
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <video
                ref={vid}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video bg-black rounded-lg"
                onLoadedMetadata={(e) => {
                  console.log('📹 Video metadata loaded event');
                }}
                onPlay={(e) => {
                  console.log('📹 Video play event');
                }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Enter Barcode Manually:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bc}
                    onChange={(e) => setBc(e.target.value)}
                    placeholder="Enter barcode..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && bc) {
                        stopCam();
                        submitBarcode(bc);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      stopCam();
                      submitBarcode(bc);
                    }}
                    disabled={!bc}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {err && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{err}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderAddKegModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      barcode: '',
      product: '',
      size: '15.5 gal',
      status: 'Empty',
      location: 'Brewery',
      fillDate: '',
      owner: 'Brewery',
      customer: ''
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingItem ? 'Edit Keg' : 'Add New Keg'}
            </h2>
            <button
              onClick={() => { setModal(''); setEditingItem(null); }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="3001234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="5.16 gal">5.16 gal (1/6 bbl)</option>
                  <option value="7.75 gal">7.75 gal (1/4 bbl)</option>
                  <option value="15.5 gal">15.5 gal (1/2 bbl)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Empty">Empty</option>
                  <option value="Filled">Filled</option>
                  <option value="At Customer">At Customer</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Brewery"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">No Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {formData.product && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fill Date</label>
                <input
                  type="date"
                  value={formData.fillDate}
                  onChange={(e) => setFormData({ ...formData, fillDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => addOrUpdateKeg(formData)}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                {editingItem ? 'Update Keg' : 'Add Keg'}
              </button>
              <button
                onClick={() => { setModal(''); setEditingItem(null); }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddCustomerModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      creditLimit: 1000,
      deliveryDay: 'Monday',
      route: 'Route A',
      notes: ''
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingItem ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <button
              onClick={() => { setModal(''); setEditingItem(null); }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Downtown Tap House"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="123 Main St"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Portland"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="OR"
                  maxLength="2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP *</label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="97201"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="555-0101"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="orders@customer.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Day</label>
                <select
                  value={formData.deliveryDay}
                  onChange={(e) => setFormData({ ...formData, deliveryDay: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <select
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Route A</option>
                  <option>Route B</option>
                  <option>Route C</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Special instructions or notes..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => addOrUpdateCustomer(formData)}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                {editingItem ? 'Update Customer' : 'Add Customer'}
              </button>
              <button
                onClick={() => { setModal(''); setEditingItem(null); }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteConfirmModal = () => {
    if (!deleteConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Confirm Deletion</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {deleteConfirm.type === 'customer' ? 'customer' : 'product'} <strong>{deleteConfirm.item.name}</strong>? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Keg Detail View
  const renderKegDetail = () => {
    if (!sel) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Keg Details: {sel.id}</h2>
            <button
              onClick={() => setSel(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                sel.status === 'At Customer' ? 'bg-green-100 text-green-800' :
                sel.status === 'Filled' ? 'bg-blue-100 text-blue-800' :
                sel.status === 'Empty' ? 'bg-gray-100 text-gray-800' :
                sel.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                sel.status === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {sel.status}
              </span>
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                sel.condition === 'Good' ? 'bg-green-100 text-green-800' :
                sel.condition === 'Needs Cleaning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {sel.condition}
              </span>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Barcode</p>
                <p className="font-semibold text-gray-900">{sel.barcode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Size</p>
                <p className="font-semibold text-gray-900">{sel.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-semibold text-gray-900">{sel.product || 'Empty'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">{sel.location}</p>
              </div>
            </div>

            {/* Date Info */}
            {sel.product && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Date Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Fill Date</p>
                    <p className="font-semibold text-gray-900">{sel.fillDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ship Date</p>
                    <p className="font-semibold text-gray-900">{sel.shipDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days Out</p>
                    <p className={`font-semibold ${sel.daysOut > 30 ? 'text-red-600' : 'text-gray-900'}`}>
                      {sel.daysOut > 0 ? `${sel.daysOut} days` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Return Date</p>
                    <p className="font-semibold text-gray-900">{sel.returnDate || 'Not returned'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Info */}
            {sel.customer && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                {(() => {
                  const customer = customers.find(c => c.id === sel.customer);
                  return customer ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.address}</p>
                      <p className="text-sm text-gray-600">{customer.city}, {customer.state} {customer.zip}</p>
                      <p className="text-sm text-gray-600 mt-2">{customer.phone}</p>
                    </div>
                  ) : (
                    <p className="text-gray-600">Customer not found</p>
                  );
                })()}
              </div>
            )}

            {/* Maintenance Info */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Maintenance Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Last Cleaned</p>
                  <p className="font-semibold text-gray-900">{sel.lastCleaned || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Turns This Year</p>
                  <p className="font-semibold text-gray-900">{sel.turnsThisYear}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deposit</p>
                  <p className="font-semibold text-gray-900">${sel.deposit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Purchase Date</p>
                  <p className="font-semibold text-gray-900">{sel.purchaseDate || 'N/A'}</p>
                </div>
              </div>
              {sel.maintenanceNotes && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">Maintenance Notes:</p>
                  <p className="text-sm text-yellow-800">{sel.maintenanceNotes}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => { setEditingItem(sel); setModal('addKeg'); setSel(null); }}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Keg
              </button>
              <button
                onClick={() => setSel(null)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CryptKeeperLogo className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CryptKeeper</h1>
                <p className="text-sm text-gray-600">Keg Tracking System</p>
              </div>
            </div>
            
            <nav className="flex gap-2">
              <button
                onClick={() => setPage('home')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  page === 'home' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => setPage('kegs')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  page === 'kegs' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                Kegs
              </button>
              <button
                onClick={() => setPage('customers')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  page === 'customers' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                Customers
              </button>
              <button
                onClick={() => setPage('reports')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  page === 'reports' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Reports
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {page === 'home' && renderHome()}
        {page === 'kegs' && renderKegs()}
        {page === 'customers' && renderCustomers()}
        {page === 'reports' && renderReports()}
      </main>

      {/* Modals */}
      {modal === 'scan' && renderScanModal()}
      {modal === 'addKeg' && renderAddKegModal()}
      {modal === 'addCustomer' && renderAddCustomerModal()}
      {sel && renderKegDetail()}
      {deleteConfirm && renderDeleteConfirmModal()}
    </div>
  );
}

export default App;
