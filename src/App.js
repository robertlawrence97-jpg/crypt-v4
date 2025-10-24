import React, { useState, useRef, useEffect } from 'react';
import { Camera, Package, Truck, Users, BarChart3, Search, Plus, MapPin, AlertCircle, Check, X, Edit, Trash2, Save, QrCode, Home, FileText, Clock, DollarSign, TrendingUp, Filter, Download, Calendar, Wrench, Bell, TrendingDown, Archive, RefreshCw, Shield, Activity, Target, Layers, Cloud, Upload, LogOut } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, addDoc, serverTimestamp, query, orderBy, deleteDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
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

const initialUsers = [
  { id: 'U1', name: 'Admin User', email: 'admin@cryptkeeper.com', role: 'Admin', status: 'Active', createdDate: '2024-01-01', lastLogin: '2025-10-23' },
  { id: 'U2', name: 'John Smith', email: 'john@cryptkeeper.com', role: 'Manager', status: 'Active', createdDate: '2024-02-15', lastLogin: '2025-10-22' },
  { id: 'U3', name: 'Sarah Johnson', email: 'sarah@cryptkeeper.com', role: 'Staff', status: 'Active', createdDate: '2024-03-20', lastLogin: '2025-10-20' },
];

// CryptKeeper Logo Component with actual logo image
const CryptKeeperLogo = ({ className = "h-12 w-auto" }) => (
  <img 
    src="data:image/webp;base64,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...< truncated 358264 characters >...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" 
    alt="Crypt Keeper" 
    className={className}
  />
);

const App = () => {
  const [view, setView] = useState('dashboard');
  const [kegs, setKegs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productList, setProductList] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser] = useState({ id: 'U1', name: 'Admin User', role: 'Admin' }); // Simulating logged-in admin
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
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'customer'|'product', item: object, index: number }
  const [scannedBarcodeForInventory, setScannedBarcodeForInventory] = useState(''); // For inventory barcode scan
  const vid = useRef(null);
  const codeReader = useRef(null);
  const scanControlsRef = useRef(null); // Store ZXing controls for cleanup
  
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
  const [showKegHistory, setShowKegHistory] = useState(null); // keg id to show history for
  const [quickActionMenu, setQuickActionMenu] = useState(false);

  // Firebase sync - Load ALL data on mount and listen for real-time changes
  useEffect(() => {
    const loadFromFirebase = async () => {
      try {
        console.log('🔥 Loading all data from Firebase...');
        
        // Load kegs
        const kegsSnapshot = await getDocs(collection(db, 'kegs'));
        if (!kegsSnapshot.empty) {
          const firebaseKegs = kegsSnapshot.docs.map(doc => doc.data());
          setKegs(firebaseKegs);
          console.log('✅ Loaded', firebaseKegs.length, 'kegs from Firebase');
        } else {
          // Initialize with default data if empty
          console.log('⚠️ No kegs in Firebase, initializing with defaults...');
          initialKegs.forEach(keg => saveKegToFirebase(keg));
          setKegs(initialKegs);
        }

        // Load customers
        const customersSnapshot = await getDocs(collection(db, 'customers'));
        if (!customersSnapshot.empty) {
          const firebaseCustomers = customersSnapshot.docs.map(doc => doc.data());
          setCustomers(firebaseCustomers);
          console.log('✅ Loaded', firebaseCustomers.length, 'customers from Firebase');
        } else {
          console.log('⚠️ No customers in Firebase, initializing with defaults...');
          initialCustomers.forEach(customer => saveCustomerToFirebase(customer));
          setCustomers(initialCustomers);
        }

        // Load products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        if (!productsSnapshot.empty) {
          const firebaseProducts = productsSnapshot.docs.map(doc => doc.data());
          setProductList(firebaseProducts);
          console.log('✅ Loaded', firebaseProducts.length, 'products from Firebase');
        } else {
          console.log('⚠️ No products in Firebase, initializing with defaults...');
          products.forEach(product => saveProductToFirebase(product));
          setProductList(products);
        }

        // Load users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        if (!usersSnapshot.empty) {
          const firebaseUsers = usersSnapshot.docs.map(doc => doc.data());
          setUsers(firebaseUsers);
          console.log('✅ Loaded', firebaseUsers.length, 'users from Firebase');
        } else {
          console.log('⚠️ No users in Firebase, initializing with defaults...');
          initialUsers.forEach(user => saveUserToFirebase(user));
          setUsers(initialUsers);
        }

        // Load transactions
        const transactionsQuery = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
        const transactionsSnapshot = await getDocs(transactionsQuery);
        if (!transactionsSnapshot.empty) {
          const firebaseTransactions = transactionsSnapshot.docs.map(doc => doc.data());
          setActivityLog(firebaseTransactions);
          console.log('✅ Loaded', firebaseTransactions.length, 'transactions from Firebase');
        }
      } catch (error) {
        console.error('❌ Error loading from Firebase:', error);
      }
    };

    loadFromFirebase();

    // Real-time listeners for all collections
    console.log('👂 Setting up real-time listeners...');
    
    const unsubscribeKegs = onSnapshot(collection(db, 'kegs'), (snapshot) => {
      const updatedKegs = snapshot.docs.map(doc => doc.data());
      setKegs(updatedKegs);
      console.log('🔄 Kegs updated from Firebase:', updatedKegs.length);
    });

    const unsubscribeCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const updatedCustomers = snapshot.docs.map(doc => doc.data());
      setCustomers(updatedCustomers);
      console.log('🔄 Customers updated from Firebase:', updatedCustomers.length);
    });

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const updatedProducts = snapshot.docs.map(doc => doc.data());
      setProductList(updatedProducts);
      console.log('🔄 Products updated from Firebase:', updatedProducts.length);
    });

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const updatedUsers = snapshot.docs.map(doc => doc.data());
      setUsers(updatedUsers);
      console.log('🔄 Users updated from Firebase:', updatedUsers.length);
    });

    const unsubscribeTransactions = onSnapshot(
      query(collection(db, 'transactions'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const updatedTransactions = snapshot.docs.map(doc => doc.data());
        setActivityLog(updatedTransactions);
        console.log('🔄 Transactions updated from Firebase:', updatedTransactions.length);
      }
    );

    return () => {
      console.log('🔌 Cleaning up Firebase listeners...');
      unsubscribeKegs();
      unsubscribeCustomers();
      unsubscribeProducts();
      unsubscribeUsers();
      unsubscribeTransactions();
    };
  }, []);

  // Auto-start camera when barcode scan modal opens
  useEffect(() => {
    if (modal === 'scanBarcode' || scan) {
      console.log('🎥 Scan modal opened, starting camera...');
      // Small delay to ensure modal is fully rendered
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
      user: 'Current User' // Could be extended with actual user management
    };
    setActivityLog(prev => [newActivity, ...prev].slice(0, 100)); // Keep last 100 activities
    saveTransactionToFirebase(action, details, kegId); // Save to Firebase
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
    totalValue: kegs.length * 130, // Average keg value
    utilization: Math.round((kegs.filter(k => k.status === 'At Customer' || k.status === 'Filled').length / kegs.length) * 100)
  };

  const requestCameraPermission = async () => {
    console.log('🎥 requestCameraPermission called - requesting from BROWSER now');
    try {
      // This will trigger the browser's native permission dialog
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1920, height: 1080 } 
      });
      console.log('✅ Browser granted camera permission!');
      console.log('📹 Stream obtained:', stream);
      console.log('📹 Stream active:', stream.active);
      console.log('📹 Video tracks:', stream.getVideoTracks().length);
      
      // Save permission
      localStorage.setItem('cameraPermission', 'granted');
      setCameraPermission('granted');
      setShowPermissionModal(false);
      
      // Video element should already exist, attach immediately
      console.log('🎬 Attaching stream to video element');
      console.log('📹 Video ref exists:', !!vid.current);
      
      if (vid.current) {
        console.log('✅ Video element found, attaching stream');
        vid.current.srcObject = stream;
        
        // Add event listeners
        vid.current.addEventListener('loadedmetadata', () => {
          console.log('📹 Video metadata loaded!');
          vid.current.play().catch(err => console.error('Play failed:', err));
        });
      } else {
        console.warn('⚠️ Video ref not found yet');
      }
      
      // Start mock scanning after a short delay to ensure video is playing
      // Start real barcode scanning
      setTimeout(() => startBarcodeScanning(), 1000);
      
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
      
      // Start real barcode scanning
      setTimeout(() => startBarcodeScanning(), 1000);
      
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

  const startBarcodeScanning = async () => {
    console.log('🔍 Starting real barcode scanning with ZXing');
    
    // Wait for video to be ready
    if (!vid.current || !vid.current.srcObject) {
      console.log('⏳ Video not ready yet, retrying...');
      setTimeout(() => startBarcodeScanning(), 500);
      return;
    }
    
    try {
      // Initialize the barcode reader
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
        console.log('✅ ZXing reader initialized');
      }

      console.log('📹 Starting continuous decode from video element');
      
      // Start continuous scanning from video element
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
            
            // Handle different scan modes
            setTimeout(() => {
              if (batchMode) {
                // Batch mode: don't close camera
                submitBarcode(barcodeText);
                setBc(''); // Clear for next scan
              } else if (modal === 'addKeg' || modal === 'editKeg') {
                // Inventory scan: populate barcode field and close camera
                setScannedBarcodeForInventory(barcodeText);
                stopCam();
                setScan(false);
              } else if (modal === 'scanBarcode' && sel) {
                // Scanning to assign barcode to specific keg: auto-update and close
                console.log(`📊 Auto-updating barcode for ${sel.id} to "${barcodeText}"`);
                
                // Check if barcode is already used by another keg
                const existingKeg = kegs.find(k => k.barcode === barcodeText && k.id !== sel.id);
                if (existingKeg) {
                  setErr(`Barcode ${barcodeText} is already assigned to ${existingKeg.id}`);
                  return;
                }
                
                // Update the keg with new barcode
                const updatedKeg = { ...sel, barcode: barcodeText };
                setKegs(kegs.map(k => k.id === sel.id ? updatedKeg : k));
                saveKegToFirebase(updatedKeg);
                
                // Close scanner and go back
                stopCam();
                setModal('editBarcode');
                setErr('');
              } else {
                // Normal mode: close camera and show manage modal
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
      if (batchMode) {
        // Batch mode: add to selection using functional update, don't close camera
        setSelectedKegs(prev => {
          if (!prev.includes(k.id)) {
            console.log('✅ Adding', k.id, 'to batch. Current batch:', prev);
            return [...prev, k.id];
          }
          console.log('⚠️ Keg', k.id, 'already in batch');
          return prev;
        });
        setErr('');
      } else {
        // Normal mode: open trans modal (transaction/manage modal)
        setSel(k);
        setModal('trans'); // Fixed: open 'trans' modal instead of 'manageKeg'
        setErr('');
        // Log to Firebase
        saveTransactionToFirebase('Barcode Scanned', `Scanned keg ${k.id}`, k.id);
      }
    } else {
      setErr(`No keg found with barcode: ${code}`);
    }
  };

  const stopCam = () => {
    console.log('🛑 Stopping camera and scanner...');
    
    // Stop the barcode reader using controls
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
    
    // Stop the video stream
    if (vid.current?.srcObject) {
      vid.current.srcObject.getTracks().forEach(t => {
        t.stop();
        console.log('✅ Video track stopped');
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
      // Products don't have IDs, so we'll use the name as the ID
      const productId = product.name.replace(/\s+/g, '_').toLowerCase();
      await setDoc(doc(db, 'products', productId), product);
      console.log('✅ Product saved to Firebase:', product.name);
    } catch (error) {
      console.error('❌ Error saving product to Firebase:', error);
    }
  };

  const deleteProductFromFirebase = async (product) => {
    try {
      const productId = product.name.replace(/\s+/g, '_').toLowerCase();
      await deleteDoc(doc(db, 'products', productId));
      console.log('✅ Product deleted from Firebase:', product.name);
    } catch (error) {
      console.error('❌ Error deleting product from Firebase:', error);
    }
  };

  const saveUserToFirebase = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.id), user);
      console.log('✅ User saved to Firebase:', user.id);
    } catch (error) {
      console.error('❌ Error saving user to Firebase:', error);
    }
  };

  const deleteUserFromFirebase = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      console.log('✅ User deleted from Firebase:', userId);
    } catch (error) {
      console.error('❌ Error deleting user from Firebase:', error);
    }
  };

  const saveTransactionToFirebase = async (action, details, kegId = null) => {
    try {
      const transaction = {
        action,
        details,
        kegId,
        timestamp: serverTimestamp(),
        user: currentUser.name
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
      console.log('Camera permission status:', savedPermission);
      
      if (savedPermission === 'granted') {
        console.log('Permission already granted, starting camera');
        startCameraStream();
      } else {
        // For denied or first time (null/'prompt'), show permission modal
        // Let user try again - browser will handle if they previously denied
        console.log('Showing permission modal (first time or retrying)');
        setShowPermissionModal(true);
      }
    } else {
      // Clean up when closing scan
      setShowPermissionModal(false);
      setErr('');
    }
    return () => stopCam();
  }, [scan]);

  const scanKeg = (code) => {
    const k = kegs.find(x => x.barcode === code);
    if (k) {
      if (batchMode) {
        toggleKegSelection(k.id);
      } else {
        setSel(k);
        setScan(false);
        stopCam();
        setModal('trans');
        setBc('');
      }
    } else {
      setErr('Keg not found');
    }
  };

  const toggleKegSelection = (kegId) => {
    setSelectedKegs(prev => 
      prev.includes(kegId) ? prev.filter(id => id !== kegId) : [...prev, kegId]
    );
  };

  const processTrans = (type, data) => {
    console.log('🔄 processTrans called:', type, data);
    const now = new Date().toISOString().split('T')[0];
    const kegsToUpdate = batchMode && selectedKegs.length > 0 ? selectedKegs : [sel.id];
    
    console.log('📦 Kegs to update:', kegsToUpdate);
    
    const updated = kegs.map(k => {
      if (kegsToUpdate.includes(k.id)) {
        console.log(`🔧 Updating keg ${k.id} with action: ${type}`);
        if (type === 'fill') {
          return {...k, product: data.product, fillDate: now, status: 'Filled', batchNumber: data.batchNumber || ''};
        }
        if (type === 'ship') {
          const customer = customers.find(c => c.id === data.customerId);
          return {
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
          return {
            ...k, 
            status: 'Empty', 
            product: '', 
            customer: '', 
            location: 'Brewery',
            returnDate: now, 
            daysOut: 0,
            condition: data.condition || k.condition,
            turnsThisYear: k.turnsThisYear + 1,
            lastCleaned: now
          };
        }
        if (type === 'clean') {
          console.log(`🧼 Cleaning keg ${k.id}`);
          return {...k, status: 'Empty', condition: 'Good', lastCleaned: now, location: 'Brewery', maintenanceNotes: '', turnsThisYear: k.turnsThisYear + 1};
        }
        if (type === 'maintenance') {
          return {...k, status: 'Maintenance', maintenanceNotes: data.notes || '', location: 'Brewery'};
        }
        if (type === 'repair') {
          console.log(`🔧 Repairing keg ${k.id}`);
          return {...k, status: 'Empty', condition: 'Good', lastCleaned: now, location: 'Brewery', maintenanceNotes: '', turnsThisYear: k.turnsThisYear + 1};
        }
        if (type === 'lost') {
          return {...k, status: 'Lost', location: 'Unknown'};
        }
      }
      return k;
    });
    
    console.log('💾 Setting new kegs state - this will trigger localStorage save');
    setKegs(updated);
    
    // Save updated kegs to Firebase
    kegsToUpdate.forEach(kegId => {
      const updatedKeg = updated.find(k => k.id === kegId);
      if (updatedKeg) {
        saveKegToFirebase(updatedKeg);
      }
    });
    
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

  // Firebase authentication is now handled by AuthContext in index.js
  // No need for the old password screen anymore

  const filteredKegs = kegs.filter(k => {
    const matchesSearch = k.id.toLowerCase().includes(search.toLowerCase()) || 
                         k.product.toLowerCase().includes(search.toLowerCase()) ||
                         k.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || k.status === filterStatus;
    
    // Advanced filters
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
                    <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex-1">
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last login: {u.lastLogin} · Created: {u.createdDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
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
                    onClick={() => {
                      if (confirm('Are you sure you want to logout?')) {
                        // In production, this would clear Firebase auth session
                        alert('Logout functionality will be implemented with Firebase Authentication');
                        // For now, just redirect to login page or refresh
                        window.location.reload();
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
                    {!vid.current?.srcObject && (
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
                  {vid.current?.srcObject ? 'Camera active - Position barcode in red frame' : 'Activating camera...'}
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
              
              {modal === 'addUser' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Initial Password *</label>
                  <input 
                    id="userPassword"
                    type="password" 
                    placeholder="Enter initial password" 
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-black focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">User will be prompted to change on first login</p>
                </div>
              )}
              
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
                      logActivity('Edit User', `Updated user: ${name} (${email})`, null);
                      alert(`User ${name} updated successfully!`);
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
      {modal === 'addKeg' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl h-[50vh] flex flex-col shadow-2xl">
            {/* Fixed Header */}
            <div className="flex-shrink-0 flex justify-between items-center px-5 py-3 border-b bg-white rounded-t-2xl">
              <h3 className="text-lg font-bold">Add New Keg</h3>
              <button onClick={() => setModal('')} className="text-gray-500 hover:text-gray-700">
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
                    <label className="block text-xs font-semibold mb-1">Barcode</label>
                    <input
                      id="newKegBarcode"
                      type="text"
                      placeholder="Optional"
                      className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                    />
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
                      <option value="5.0 gal">5.0 gal (Corny Keg)</option>
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
                  onClick={() => setModal('')}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const kegId = document.getElementById('newKegId').value.trim().toUpperCase();
                    const barcode = document.getElementById('newKegBarcode').value.trim();
                    const size = document.getElementById('newKegSize').value;
                    const owner = document.getElementById('newKegOwner').value;
                    const purchaseDate = document.getElementById('newKegPurchaseDate').value;
                    const deposit = 30;
                    const notes = document.getElementById('newKegNotes').value.trim();

                    if (!kegId) {
                      alert('Please enter a Keg ID');
                      return;
                    }

                    if (kegs.find(k => k.id === kegId)) {
                      alert(`Keg ID "${kegId}" already exists. Please use a different ID.`);
                      return;
                    }

                    if (barcode && kegs.find(k => k.barcode === barcode)) {
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
      {modal === 'editKeg' && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl h-[50vh] flex flex-col shadow-2xl">
            {/* Fixed Header */}
            <div className="flex-shrink-0 flex justify-between items-center px-5 py-3 border-b bg-white rounded-t-2xl">
              <h3 className="text-lg font-bold">Edit Keg</h3>
              <button onClick={() => { setModal(''); setEditingItem(null); }} className="text-gray-500 hover:text-gray-700">
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
                    <label className="block text-xs font-semibold mb-1">Barcode</label>
                    <input
                      id="editKegBarcode"
                      type="text"
                      defaultValue={editingItem.data.barcode}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border-2 rounded-lg focus:border-black focus:outline-none text-sm"
                    />
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
                      <option value="5.0 gal">5.0 gal (Corny Keg)</option>
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
                  onClick={() => { setModal(''); setEditingItem(null); }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const barcode = document.getElementById('editKegBarcode').value.trim();
                    const size = document.getElementById('editKegSize').value;
                    const owner = document.getElementById('editKegOwner').value;
                    const condition = document.getElementById('editKegCondition').value;
                    const deposit = parseInt(document.getElementById('editKegDeposit').value);
                    const notes = document.getElementById('editKegNotes').value.trim();

                    // Check if barcode already exists on a different keg
                    if (barcode && kegs.find(k => k.barcode === barcode && k.id !== editingItem.data.id)) {
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
      )}

    </div>
  );
};

export default App;
