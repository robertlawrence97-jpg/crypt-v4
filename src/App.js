import React, { useState, useRef, useEffect } from 'react';
import { Camera, Package, Truck, Users, BarChart3, Search, Plus, MapPin, AlertCircle, Check, X, Edit, Trash2, Save, QrCode, Home, FileText, Clock, DollarSign, TrendingUp, Filter, Download, Calendar, Wrench, Bell, TrendingDown, Archive, RefreshCw, Shield, Activity, Target, Layers, Cloud, Upload } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, addDoc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';

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

// Enhanced initial data
const initialKegs = [
  { id: 'KEG001', barcode: '3001234567890', product: 'Hazy IPA', size: '15.5 gal', status: 'At Customer', location: 'Downtown Tap House', owner: 'Brewery', customer: 'C1', fillDate: '2025-09-15', shipDate: '2025-09-16', returnDate: '', daysOut: 35, condition: 'Good', deposit: 30, lastCleaned: '2025-08-10', turnsThisYear: 8, batchNumber: 'B2024-089', maintenanceNotes: '', rentalRate: 0, purchaseDate: '2024-01-15' },
  { id: 'KEG002', barcode: '3001234567891', product: '', size: '15.5 gal', status: 'Empty', location: 'Brewery', owner: 'Brewery', customer: '', fillDate: '', shipDate: '', returnDate: '2025-10-15', daysOut: 0, condition: 'Needs Cleaning', deposit: 30, lastCleaned: '2025-09-20', turnsThisYear: 12, batchNumber: '', maintenanceNotes: 'Valve leak detected', rentalRate: 0, purchaseDate: '2024-01-15' },
  { id: 'KEG003', barcode: '3001234567892', product: 'Pilsner', size: '7.75 gal', status: 'At Customer', location: 'Craft Beer Bar', owner: 'Brewery', customer: 'C2', fillDate: '2025-10-01', shipDate: '2025-10-02', returnDate: '', daysOut: 19, condition: 'Good', deposit: 30, lastCleaned: '2025-09-15', turnsThisYear: 10, batchNumber: 'B2024-095', maintenanceNotes: '', rentalRate: 0, purchaseDate: '2024-02-20' },
];

const initialCustomers = [
  { id: 'C1', name: 'Downtown Tap House', address: '123 Main St', city: 'Portland', state: 'OR', zip: '97201', phone: '555-0101', email: 'orders@downtowntap.com', kegsOut: 1, depositBalance: 50, creditLimit: 2000, currentBalance: 450, deliveryDay: 'Monday', route: 'Route A', notes: 'Prefer morning deliveries', status: 'Active' },
  { id: 'C2', name: 'Craft Beer Bar', address: '456 Oak Ave', city: 'Portland', state: 'OR', zip: '97202', phone: '555-0102', email: 'manager@craftbeerbar.com', kegsOut: 1, depositBalance: 30, creditLimit: 1500, currentBalance: 320, deliveryDay: 'Wednesday', route: 'Route A', notes: 'VIP customer', status: 'Active' },
];

const products = [
  { name: 'Hazy IPA', abv: 6.8, ibu: 45, style: 'IPA', active: true },
  { name: 'Pilsner', abv: 4.9, ibu: 32, style: 'Lager', active: true },
  { name: 'Stout', abv: 7.2, ibu: 38, style: 'Stout', active: true },
];

const CryptKeeperLogo = ({ className = "h-12 w-auto" }) => (
  <img 
    src="data:image/webp;base64,UklGRnBIBABXRUJQVlA4WAoAAAAwAAAABwcA1QMASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADY="
    alt="Crypt Keeper" 
    className={className}
  />
);

const App = () => {
  const [view, setView] = useState('dashboard');
  const [kegs, setKegs] = useState(initialKegs);
  const [customers, setCustomers] = useState(initialCustomers);
  const [productList, setProductList] = useState(products);
  const [scan, setScan] = useState(false);
  const [bc, setBc] = useState('');
  const [err, setErr] = useState('');
  const [sel, setSel] = useState(null);
  const [modal, setModal] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedKegs, setSelectedKegs] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('prompt');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [archivedKegs, setArchivedKegs] = useState([]);
  const [showKegHistory, setShowKegHistory] = useState(null);
  
  const vid = useRef(null);
  const codeReader = useRef(null);
  const scanControlsRef = useRef(null);

  // Firebase sync - Load data on mount
  useEffect(() => {
    const loadFromFirebase = async () => {
      try {
        const kegsSnapshot = await getDocs(collection(db, 'kegs'));
        if (!kegsSnapshot.empty) {
          const firebaseKegs = kegsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setKegs(firebaseKegs);
        }

        const transactionsQuery = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
        const transactionsSnapshot = await getDocs(transactionsQuery);
        if (!transactionsSnapshot.empty) {
          const firebaseTransactions = transactionsSnapshot.docs.map(doc => doc.data());
          setActivityLog(firebaseTransactions);
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
    });

    const unsubscribeTransactions = onSnapshot(
      query(collection(db, 'transactions'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const updatedTransactions = snapshot.docs.map(doc => doc.data());
        setActivityLog(updatedTransactions);
      }
    );

    return () => {
      unsubscribeKegs();
      unsubscribeTransactions();
    };
  }, []);

  // Auto-start camera when scan modal opens
  useEffect(() => {
    if (scan) {
      const timer = setTimeout(() => {
        startCameraStream();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        stopCam();
      };
    }
  }, [scan]);

  // Firebase helper functions
  const saveKegToFirebase = async (keg) => {
    try {
      await setDoc(doc(db, 'kegs', keg.id), keg);
      console.log('✅ Keg saved to Firebase:', keg.id);
    } catch (error) {
      console.error('❌ Error saving keg to Firebase:', error);
    }
  };

  const saveTransactionToFirebase = async (action, details, kegId = null) => {
    try {
      const transaction = {
        action,
        details,
        kegId,
        timestamp: serverTimestamp(),
        user: 'Current User'
      };
      await addDoc(collection(db, 'transactions'), transaction);
      console.log('✅ Transaction saved to Firebase');
    } catch (error) {
      console.error('❌ Error saving transaction:', error);
    }
  };

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
    saveTransactionToFirebase(action, details, kegId);
  };

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
    console.log('🎥 Requesting camera permission from browser');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1920, height: 1080 } 
      });
      console.log('✅ Browser granted camera permission!');
      
      setCameraPermission('granted');
      setShowPermissionModal(false);
      
      if (vid.current) {
        console.log('✅ Attaching stream to video element');
        vid.current.srcObject = stream;
        
        vid.current.addEventListener('loadedmetadata', () => {
          console.log('📹 Video metadata loaded!');
          vid.current.play().catch(err => console.error('Play failed:', err));
        });
      }
      
      setTimeout(() => startBarcodeScanning(), 1000);
      
    } catch (e) {
      console.error('❌ Camera permission error:', e);
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
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
        video: { facingMode: 'environment', width: 1920, height: 1080 } 
      });
      console.log('📹 Stream obtained!');
      
      if (vid.current) {
        console.log('✅ Attaching stream to video element');
        vid.current.srcObject = stream;
        vid.current.addEventListener('loadedmetadata', () => {
          console.log('📹 Video playing');
          vid.current.play().catch(err => console.error('Play error:', err));
        });
      }
      
      setTimeout(() => startBarcodeScanning(), 1000);
      
    } catch (e) {
      console.error('❌ Camera error:', e);
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
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
    console.log('🔍 Starting real barcode scanning with ZXing');
    
    if (!vid.current || !vid.current.srcObject) {
      console.log('⏳ Video not ready yet, retrying...');
      setTimeout(() => startBarcodeScanning(), 500);
      return;
    }
    
    try {
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
        console.log('✅ ZXing reader initialized');
      }

      console.log('📹 Starting continuous decode from video element');
      
      const controls = await codeReader.current.decodeFromVideoDevice(
        undefined,
        vid.current,
        (result, err) => {
          if (result) {
            const barcodeText = result.getText();
            console.log('✅ Barcode detected:', barcodeText);
            
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
              } else {
                stopCam();
                submitBarcode(barcodeText);
              }
            }, 500);
          }
          
          if (err && err.name !== 'NotFoundException') {
            console.error('❌ Scan error:', err.name, err.message);
          }
        }
      );
      
      scanControlsRef.current = controls;
      console.log('✅ Barcode scanning active');
    } catch (e) {
      console.error('❌ Barcode scanning error:', e);
      setErr('Barcode scanning failed: ' + e.message);
    }
  };

  const submitBarcode = (code) => {
    console.log('🔍 Submitting barcode:', code);
    const k = kegs.find(x => x.barcode === code);
    if (k) {
      if (batchMode) {
        if (!selectedKegs.includes(k.id)) {
          setSelectedKegs([...selectedKegs, k.id]);
        }
        setErr('');
      } else {
        // KEY FIX: Open the manage modal immediately
        setSel(k);
        setScan(false); // Close scanner
        setModal('trans'); // Open manage modal
        setErr('');
        saveTransactionToFirebase('Barcode Scanned', `Scanned keg ${k.id}`, k.id);
      }
    } else {
      setErr(`No keg found with barcode: ${code}`);
    }
  };

  const stopCam = () => {
    console.log('🛑 Stopping camera and scanner...');
    
    if (scanControlsRef.current) {
      try {
        scanControlsRef.current.stop();
        console.log('✅ Scanner stopped via controls');
      } catch (e) {
        console.log('⚠️ Scanner control stop error:', e);
      }
      scanControlsRef.current = null;
    }
    
    if (codeReader.current) {
      try {
        codeReader.current.reset();
        console.log('✅ Code reader reset');
      } catch (e) {
        console.log('⚠️ Code reader reset error:', e);
      }
    }
    
    if (vid.current?.srcObject) {
      vid.current.srcObject.getTracks().forEach(t => {
        t.stop();
        console.log('✅ Video track stopped');
      });
      vid.current.srcObject = null;
    }
  };

  const processTrans = async (type, data) => {
    console.log('🔄 processTrans called:', type, data);
    const now = new Date().toISOString().split('T')[0];
    const kegsToUpdate = batchMode && selectedKegs.length > 0 ? selectedKegs : [sel.id];
    
    console.log('📦 Kegs to update:', kegsToUpdate);
    
    const updated = kegs.map(k => {
      if (kegsToUpdate.includes(k.id)) {
        console.log(`🔧 Updating keg ${k.id} with action: ${type}`);
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
          console.log(`✅ Processing return for ${k.id} - setting to Empty at Brewery`);
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
          console.log(`🧼 Cleaning keg ${k.id}`);
          updatedKeg = {...k, status: 'Empty', condition: 'Good', lastCleaned: now, location: 'Brewery', maintenanceNotes: '', turnsThisYear: k.turnsThisYear + 1};
        }
        if (type === 'maintenance') {
          updatedKeg = {...k, status: 'Maintenance', maintenanceNotes: data.notes || '', location: 'Brewery'};
        }
        if (type === 'repair') {
          console.log(`🔧 Repairing keg ${k.id}`);
          updatedKeg = {...k, status: 'Empty', condition: 'Good', lastCleaned: now, location: 'Brewery', maintenanceNotes: '', turnsThisYear: k.turnsThisYear + 1};
        }
        if (type === 'lost') {
          updatedKeg = {...k, status: 'Lost', location: 'Unknown'};
        }
        
        // KEY FIX: Save each updated keg to Firebase
        saveKegToFirebase(updatedKeg);
        logActivity(type.toUpperCase(), `${type} action on keg ${k.id}`, k.id);
        
        return updatedKeg;
      }
      return k;
    });
    
    console.log('💾 Setting new kegs state');
    setKegs(updated);
    
    // Update customer stats
    if (type === 'ship' || type === 'return') {
      setCustomers(prev => prev.map(c => ({
        ...c,
        kegsOut: updated.filter(k => k.customer === c.id).length,
        depositBalance: updated.filter(k => k.customer === c.id).reduce((sum, k) => sum + k.deposit, 0)
      })));
    }
    
    console.log('✅ Transaction complete, closing modal');
    setModal('');
    setSel(null);
    setSelectedKegs([]);
    setBatchMode(false);
  };

  const filteredKegs = kegs.filter(k => {
    const matchesSearch = k.id.toLowerCase().includes(search.toLowerCase()) || 
                         k.product.toLowerCase().includes(search.toLowerCase()) ||
                         k.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || k.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
              { id: 'reports', icon: BarChart3, label: 'Reports' },
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
                <Package className="text-gray-600 mb-2" size={28} />
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
                </select>
              </div>
            </div>

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
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKegs.map(k => (
                <div 
                  key={k.id} 
                  className={`bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${
                    batchMode ? 'cursor-pointer' : ''
                  } ${selectedKegs.includes(k.id) ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => {
                    if (batchMode) {
                      if (selectedKegs.includes(k.id)) {
                        setSelectedKegs(selectedKegs.filter(id => id !== k.id));
                      } else {
                        setSelectedKegs([...selectedKegs, k.id]);
                      }
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {batchMode && (
                        <input 
                          type="checkbox" 
                          checked={selectedKegs.includes(k.id)}
                          onChange={() => {}}
                          className="w-5 h-5"
                        />
                      )}
                      <div>
                        <p className="font-bold text-lg">{k.id}</p>
                        <p className="text-sm text-gray-600">{k.product || 'Empty'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      k.status === 'At Customer' ? 'bg-green-100 text-green-700' :
                      k.status === 'Filled' ? 'bg-blue-100 text-blue-700' :
                      k.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {k.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-3">
                    <p className="text-gray-600">📍 {k.location}</p>
                    <p className="text-gray-600">📏 {k.size}</p>
                    {k.daysOut > 0 && (
                      <p className={`font-semibold ${k.daysOut > 30 ? 'text-red-600' : 'text-orange-600'}`}>
                        ⏱️ {k.daysOut} days out {k.daysOut > 30 && '(OVERDUE)'}
                      </p>
                    )}
                  </div>
                  
                  {!batchMode && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSel(k); setModal('trans'); }} 
                      className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
                    >
                      Manage
                    </button>
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
            </div>
            
            {customers.map((c) => (
              <div key={c.id} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold">{c.name}</h3>
                    <div className="space-y-2 text-sm mt-3">
                      <p className="text-gray-600">📍 {c.address}, {c.city}, {c.state} {c.zip}</p>
                      <p className="text-gray-600">📞 {c.phone}</p>
                      <p className="text-gray-600">📧 {c.email}</p>
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
                      <p className="text-sm text-gray-600">Balance</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            
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
                </div>
              </div>
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
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={async () => {
                  await requestCameraPermission();
                }}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Allow Camera Access
              </button>
              <button 
                onClick={() => {
                  setShowPermissionModal(false);
                  setScan(false);
                  setCameraPermission('denied');
                }}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      {scan && !showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
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

            <div className="mb-4">
              <div className="relative bg-black rounded-xl overflow-hidden" style={{height: '400px'}}>
                <video 
                  ref={vid} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-80 h-40 border-4 border-red-500 rounded-xl relative">
                    <div className="absolute -top-2 -left-2 w-16 h-16 border-t-8 border-l-8 border-red-400 rounded-tl-xl"></div>
                    <div className="absolute -top-2 -right-2 w-16 h-16 border-t-8 border-r-8 border-red-400 rounded-tr-xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-8 border-l-8 border-red-400 rounded-bl-xl"></div>
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-8 border-r-8 border-red-400 rounded-br-xl"></div>
                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black bg-opacity-60 px-4 py-2 rounded-lg font-bold">
                      {vid.current?.srcObject ? 'Align Barcode' : 'Starting Camera...'}
                    </p>
                  </div>
                </div>
              </div>
              {err && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-semibold">{err}</p>
                </div>
              )}
            </div>

            <input
              type="text"
              value={bc}
              onChange={e => setBc(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && bc && submitBarcode(bc)}
              placeholder="Or type barcode..."
              className="w-full px-4 py-3 border-2 rounded-lg font-mono text-lg mb-3"
            />
            <button 
              onClick={() => bc && submitBarcode(bc)}
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
                  processTrans('clean', {});
                }} 
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Clean & Inspect
              </button>
            </div>
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
              <h3 className="text-xl font-bold">Batch Clean ({selectedKegs.length} kegs)</h3>
              <button onClick={() => setModal('')}>
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  This will clean and inspect all selected kegs, marking them as "Good" condition.
                </p>
              </div>
              
              <button 
                onClick={() => {
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

    </div>
  );
};

export default App;
