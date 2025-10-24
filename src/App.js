import React, { useState, useRef, useEffect } from 'react';
import { Camera, Package, Truck, Users, BarChart3, Search, Plus, MapPin, AlertCircle, Check, X, Edit, Trash2, Save, QrCode, Home, FileText, Clock, DollarSign, TrendingUp, Filter, Download, Calendar, Wrench, Bell, TrendingDown, Archive, RefreshCw, Shield, Activity, Target, Layers, Cloud, Upload, LogOut } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, addDoc, serverTimestamp, query, orderBy, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

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

// CryptKeeper Logo Component - using base64 encoded logo
const CryptKeeperLogo = ({ className = "h-12 w-auto" }) => (
  <img 
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    alt="CryptKeeper Logo" 
    className={className}
    onError={(e) => {
      // Fallback to text if image fails to load
      e.target.style.display = 'none';
      const textFallback = document.createElement('div');
      textFallback.className = className.replace('h-12', 'text-2xl') + ' font-bold text-blue-600';
      textFallback.textContent = 'CryptKeeper';
      e.target.parentNode.insertBefore(textFallback, e.target);
    }}
  />
);

const App = () => {
  const [kegs, setKegs] = useState(initialKegs);
  const [customers, setCustomers] = useState(initialCustomers);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('login');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [scan, setScan] = useState(false);
  const [selectedKeg, setSelectedKeg] = useState(null);
  const [modal, setModal] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [activities, setActivities] = useState([]);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedKegs, setSelectedKegs] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchKegs, setBatchKegs] = useState([]);
  const [quickActionMenu, setQuickActionMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const streamRef = useRef(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const userDoc = await getDocs(collection(db, 'users'));
        const userData = userDoc.docs.find(doc => doc.data().email === user.email);
        if (userData) {
          const userInfo = { id: userData.id, ...userData.data() };
          setCurrentUser(userInfo);
          
          // Update last login
          await updateDoc(doc(db, 'users', userData.id), {
            lastLogin: new Date().toISOString().split('T')[0]
          });
          
          setView('dashboard');
        } else {
          // Create user document if it doesn't exist
          const newUserId = `U${Date.now()}`;
          const newUser = {
            id: newUserId,
            email: user.email,
            name: user.email.split('@')[0],
            role: 'Staff',
            status: 'Active',
            createdDate: new Date().toISOString().split('T')[0],
            lastLogin: new Date().toISOString().split('T')[0]
          };
          await setDoc(doc(db, 'users', newUserId), newUser);
          setCurrentUser(newUser);
          setView('dashboard');
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setView('login');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load users from Firebase
  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(loadedUsers);
    });

    return () => unsubscribe();
  }, []);

  // Initialize Firebase collections if they don't exist
  useEffect(() => {
    const initializeData = async () => {
      try {
        const kegsSnapshot = await getDocs(collection(db, 'kegs'));
        if (kegsSnapshot.empty) {
          for (const keg of initialKegs) {
            await setDoc(doc(db, 'kegs', keg.id), keg);
          }
        }

        const customersSnapshot = await getDocs(collection(db, 'customers'));
        if (customersSnapshot.empty) {
          for (const customer of initialCustomers) {
            await setDoc(doc(db, 'customers', customer.id), customer);
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    if (currentUser) {
      initializeData();
    }
  }, [currentUser]);

  // Load kegs from Firebase
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'kegs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedKegs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setKegs(loadedKegs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Load customers from Firebase
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'customers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedCustomers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(loadedCustomers);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Load activities from Firebase
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedActivities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date()
      }));
      setActivities(loadedActivities);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // Auth state change will handle the rest
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setLoginError('Invalid email or password');
      } else if (error.code === 'auth/invalid-email') {
        setLoginError('Invalid email format');
      } else {
        setLoginError('Login failed. Please try again.');
      }
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Auth state change will handle the rest
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const logActivity = async (action, description, kegId = null) => {
    try {
      await addDoc(collection(db, 'activities'), {
        action,
        description,
        kegId,
        user: currentUser?.name || 'System',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready before starting scanner
        videoRef.current.onloadedmetadata = () => {
          codeReaderRef.current = new BrowserMultiFormatReader();
          
          codeReaderRef.current.decodeFromVideoElement(videoRef.current, (result, err) => {
            if (result) {
              const barcode = result.getText();
              if (batchMode) {
                handleBatchScan(barcode);
              } else {
                handleScan(barcode);
              }
              stopScanner();
            }
          });
        };
      }
    } catch (error) {
      console.error('Error starting scanner:', error);
      alert('Unable to access camera. Please check permissions.');
      setScan(false);
    }
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScan(false);
  };

  useEffect(() => {
    if (scan) {
      startScanner();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [scan]);

  const handleScan = (barcode) => {
    const keg = kegs.find(k => k.barcode === barcode);
    if (keg) {
      setSelectedKeg(keg);
      setModal('editKeg');
    } else {
      alert(`No keg found with barcode: ${barcode}`);
    }
  };

  const handleBatchScan = async (barcode) => {
    const keg = kegs.find(k => k.barcode === barcode);
    if (keg) {
      // Automatically add to batch
      if (!batchKegs.find(k => k.id === keg.id)) {
        const updatedBatchKegs = [...batchKegs, keg];
        setBatchKegs(updatedBatchKegs);
        
        // Show brief confirmation
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold';
        notification.textContent = `${keg.id} added to batch (${updatedBatchKegs.length} kegs)`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 2000);
        
        // Continue scanning
        setScan(true);
      } else {
        alert(`${keg.id} is already in the batch`);
        setScan(true);
      }
    } else {
      alert(`No keg found with barcode: ${barcode}`);
      setScan(true);
    }
  };

  const addKeg = async (newKeg) => {
    try {
      await setDoc(doc(db, 'kegs', newKeg.id), newKeg);
      logActivity('Add Keg', `Added new keg ${newKeg.id}`, newKeg.id);
      setModal(null);
    } catch (error) {
      console.error('Error adding keg:', error);
      alert('Failed to add keg. Please try again.');
    }
  };

  const updateKeg = async (updatedKeg) => {
    try {
      await setDoc(doc(db, 'kegs', updatedKeg.id), updatedKeg);
    } catch (error) {
      console.error('Error updating keg:', error);
      alert('Failed to update keg. Please try again.');
    }
  };

  const deleteKeg = async (id) => {
    if (window.confirm('Are you sure you want to delete this keg?')) {
      try {
        await deleteDoc(doc(db, 'kegs', id));
        logActivity('Delete Keg', `Deleted keg ${id}`, id);
      } catch (error) {
        console.error('Error deleting keg:', error);
        alert('Failed to delete keg. Please try again.');
      }
    }
  };

  const addCustomer = async (newCustomer) => {
    try {
      await setDoc(doc(db, 'customers', newCustomer.id), newCustomer);
      logActivity('Add Customer', `Added new customer ${newCustomer.name}`);
      setModal(null);
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer. Please try again.');
    }
  };

  const updateCustomer = async (updatedCustomer) => {
    try {
      await setDoc(doc(db, 'customers', updatedCustomer.id), updatedCustomer);
      logActivity('Update Customer', `Updated customer ${updatedCustomer.name}`);
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer. Please try again.');
    }
  };

  const exportData = (type) => {
    let data, filename;
    if (type === 'inventory') {
      data = kegs;
      filename = 'kegs_export.json';
    } else if (type === 'customers') {
      data = customers;
      filename = 'customers_export.json';
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    logActivity('Export Data', `Exported ${type} data`);
  };

  const filteredKegs = kegs.filter(keg => {
    const matchesSearch = search === '' || 
      keg.id.toLowerCase().includes(search.toLowerCase()) ||
      keg.barcode.toLowerCase().includes(search.toLowerCase()) ||
      keg.product.toLowerCase().includes(search.toLowerCase()) ||
      keg.location.toLowerCase().includes(search.toLowerCase()) ||
      keg.customer.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'All' || keg.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const filteredCustomers = customers.filter(customer =>
    search === '' || 
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.city.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalKegs: kegs.length,
    atCustomer: kegs.filter(k => k.status === 'At Customer').length,
    filled: kegs.filter(k => k.status === 'Filled').length,
    empty: kegs.filter(k => k.status === 'Empty').length,
    inTransit: kegs.filter(k => k.status === 'In Transit').length,
    needsCleaning: kegs.filter(k => k.condition === 'Needs Cleaning').length,
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'Active').length
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full mx-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8`}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CryptKeeperLogo className="h-20 w-auto" />
            </div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>CryptKeeper</h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Keg Tracking System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your password"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Demo: admin@cryptkeeper.com / demo123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CryptKeeperLogo className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-blue-600">CryptKeeper</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Keg Management System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              
              <div className={`text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="text-sm font-semibold">{currentUser?.name}</p>
                <p className="text-xs">{currentUser?.role}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'inventory', icon: Package, label: 'Inventory' },
              { id: 'customers', icon: Users, label: 'Customers' },
              { id: 'tracking', icon: Truck, label: 'Tracking' },
              { id: 'reports', icon: BarChart3, label: 'Reports' },
              { id: 'activity', icon: Activity, label: 'Activity' },
              { id: 'users', icon: Shield, label: 'Users' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  view === item.id
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold">{stats.totalKegs}</span>
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Kegs</h3>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Truck className="text-green-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold">{stats.atCustomer}</span>
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>At Customer</h3>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold">{stats.activeCustomers}</span>
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Customers</h3>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertCircle className="text-yellow-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold">{stats.needsCleaning}</span>
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Needs Attention</h3>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center gap-3">
                      <Activity className="text-blue-600" size={20} />
                      <div>
                        <p className="font-semibold">{activity.action}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{activity.description}</p>
                      </div>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {activity.timestamp?.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inventory View */}
        {view === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-3xl font-bold">Inventory Management</h2>
              <div className="flex gap-2 flex-wrap">
                {!batchMode && (
                  <>
                    <button
                      onClick={() => setScan(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      <Camera size={20} />
                      Scan
                    </button>
                    <button
                      onClick={() => setModal('addKeg')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      <Plus size={20} />
                      Add Keg
                    </button>
                    <button
                      onClick={() => setBulkSelectMode(!bulkSelectMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                        bulkSelectMode
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Target size={20} />
                      {bulkSelectMode ? 'Exit Bulk Select' : 'Bulk Select'}
                    </button>
                    <button
                      onClick={() => setBatchMode(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                    >
                      <Layers size={20} />
                      Batch Mode
                    </button>
                  </>
                )}
                {batchMode && (
                  <button
                    onClick={() => {
                      setBatchMode(false);
                      setBatchKegs([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    <X size={20} />
                    Exit Batch Mode
                  </button>
                )}
                <button
                  onClick={() => exportData('inventory')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                    darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Download size={20} />
                  Export
                </button>
              </div>
            </div>

            {batchMode && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Layers className="text-purple-600" size={24} />
                    <h3 className="text-xl font-bold">Batch Mode Active</h3>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{batchKegs.length} kegs</span>
                </div>
                <p className={darkMode ? 'text-gray-300 mb-4' : 'text-gray-600 mb-4'}>
                  Scan kegs to add them to the batch. When finished, select an action to apply to all kegs.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setScan(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    <Camera size={20} />
                    Scan Next Keg
                  </button>
                  {batchKegs.length > 0 && (
                    <>
                      <button
                        onClick={async () => {
                          const customer = prompt('Enter customer ID for all kegs:');
                          if (customer) {
                            for (const keg of batchKegs) {
                              await updateKeg({ ...keg, status: 'At Customer', customer, shipDate: new Date().toISOString().split('T')[0] });
                            }
                            logActivity('Batch Ship', `Shipped ${batchKegs.length} kegs to customer ${customer}`);
                            alert(`Successfully shipped ${batchKegs.length} kegs`);
                            setBatchKegs([]);
                            setBatchMode(false);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        <Truck size={20} />
                        Ship All
                      </button>
                      <button
                        onClick={async () => {
                          for (const keg of batchKegs) {
                            await updateKeg({ ...keg, status: 'Empty', product: '', barcode: '', returnDate: new Date().toISOString().split('T')[0] });
                          }
                          logActivity('Batch Return', `Returned ${batchKegs.length} kegs`);
                          alert(`Successfully returned ${batchKegs.length} kegs`);
                          setBatchKegs([]);
                          setBatchMode(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
                      >
                        <RefreshCw size={20} />
                        Return All
                      </button>
                      <button
                        onClick={() => {
                          setBatchKegs([]);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                      >
                        <X size={20} />
                        Clear Batch
                      </button>
                    </>
                  )}
                </div>
                {batchKegs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Kegs in Batch:</h4>
                    <div className="flex flex-wrap gap-2">
                      {batchKegs.map(keg => (
                        <div key={keg.id} className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">
                          <span className="font-semibold">{keg.id}</span>
                          <button
                            onClick={() => setBatchKegs(batchKegs.filter(k => k.id !== keg.id))}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {bulkSelectMode && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {selectedKegs.length} keg{selectedKegs.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (selectedKegs.length === filteredKegs.length) {
                          setSelectedKegs([]);
                        } else {
                          setSelectedKegs(filteredKegs.map(k => k.id));
                        }
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                    >
                      {selectedKegs.length === filteredKegs.length ? 'Deselect All' : 'Select All'}
                    </button>
                    {selectedKegs.length > 0 && (
                      <button
                        onClick={() => setSelectedKegs([])}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search kegs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option>All</option>
                <option>At Customer</option>
                <option>Filled</option>
                <option>Empty</option>
                <option>In Transit</option>
              </select>
            </div>

            {/* Kegs Table */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      {bulkSelectMode && (
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedKegs.length === filteredKegs.length && filteredKegs.length > 0}
                            onChange={() => {
                              if (selectedKegs.length === filteredKegs.length) {
                                setSelectedKegs([]);
                              } else {
                                setSelectedKegs(filteredKegs.map(k => k.id));
                              }
                            }}
                            className="w-4 h-4"
                          />
                        </th>
                      )}
                      <th className="px-6 py-4 text-left font-semibold">Keg ID</th>
                      <th className="px-6 py-4 text-left font-semibold">Barcode</th>
                      <th className="px-6 py-4 text-left font-semibold">Product</th>
                      <th className="px-6 py-4 text-left font-semibold">Size</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                      <th className="px-6 py-4 text-left font-semibold">Location</th>
                      <th className="px-6 py-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredKegs.map(keg => (
                      <tr key={keg.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        bulkSelectMode && selectedKegs.includes(keg.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}>
                        {bulkSelectMode && (
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedKegs.includes(keg.id)}
                              onChange={() => {
                                if (selectedKegs.includes(keg.id)) {
                                  setSelectedKegs(selectedKegs.filter(id => id !== keg.id));
                                } else {
                                  setSelectedKegs([...selectedKegs, keg.id]);
                                }
                              }}
                              className="w-4 h-4"
                            />
                          </td>
                        )}
                        <td className="px-6 py-4 font-semibold">{keg.id}</td>
                        <td className="px-6 py-4">{keg.barcode || '-'}</td>
                        <td className="px-6 py-4">{keg.product || '-'}</td>
                        <td className="px-6 py-4">{keg.size}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            keg.status === 'At Customer' ? 'bg-green-100 text-green-700' :
                            keg.status === 'Filled' ? 'bg-blue-100 text-blue-700' :
                            keg.status === 'Empty' ? 'bg-gray-100 text-gray-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {keg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{keg.location}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedKeg(keg);
                                setModal('editKeg');
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteKeg(keg.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers View */}
        {view === 'customers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Customer Management</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal('addCustomer')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  <Plus size={20} />
                  Add Customer
                </button>
                <button
                  onClick={() => exportData('customers')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                    darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Download size={20} />
                  Export
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map(customer => (
                <div key={customer.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{customer.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        customer.status === 'Active' ? 'bg-green-100 text-green-700' :
                        customer.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedKeg(customer);
                          setModal('editCustomer');
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{customer.city}, {customer.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span>{customer.kegsOut} kegs out</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span>Balance: ${customer.currentBalance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracking View */}
        {view === 'tracking' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Keg Tracking</h2>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats.atCustomer}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>At Customer</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats.filled}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Filled</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-gray-600">{stats.empty}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Empty</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{stats.inTransit}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>In Transit</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports View */}
        {view === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Reports & Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h3 className="text-xl font-bold mb-4">Keg Turnover Rate</h3>
                <div className="space-y-3">
                  {kegs.slice(0, 5).map(keg => (
                    <div key={keg.id} className="flex justify-between items-center">
                      <span className="font-semibold">{keg.id}</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{keg.turnsThisYear} turns/year</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h3 className="text-xl font-bold mb-4">Top Customers</h3>
                <div className="space-y-3">
                  {customers
                    .sort((a, b) => b.kegsOut - a.kegsOut)
                    .slice(0, 5)
                    .map(customer => (
                      <div key={customer.id} className="flex justify-between items-center">
                        <span className="font-semibold">{customer.name}</span>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{customer.kegsOut} kegs</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity View */}
        {view === 'activity' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Activity Log</h2>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Time</th>
                      <th className="px-6 py-4 text-left font-semibold">Action</th>
                      <th className="px-6 py-4 text-left font-semibold">Description</th>
                      <th className="px-6 py-4 text-left font-semibold">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {activities.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">{activity.timestamp?.toLocaleString()}</td>
                        <td className="px-6 py-4 font-semibold">{activity.action}</td>
                        <td className="px-6 py-4">{activity.description}</td>
                        <td className="px-6 py-4">{activity.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users View */}
        {view === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">User Management</h2>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Name</th>
                      <th className="px-6 py-4 text-left font-semibold">Email</th>
                      <th className="px-6 py-4 text-left font-semibold">Role</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                      <th className="px-6 py-4 text-left font-semibold">Last Login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 font-semibold">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'Active' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{user.lastLogin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Scanner Modal */}
      {scan && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-lg w-full p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Scan Barcode</h3>
              <button onClick={stopScanner} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-4 border-green-500 opacity-50 pointer-events-none"></div>
            </div>
            <p className={`text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Position barcode within the frame
            </p>
          </div>
        </div>
      )}

      {/* Add Keg Modal */}
      {modal === 'addKeg' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add New Keg</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newKeg = {
                id: formData.get('id'),
                barcode: formData.get('barcode'),
                product: formData.get('product'),
                size: formData.get('size'),
                status: formData.get('status'),
                location: formData.get('location'),
                owner: 'Brewery',
                customer: '',
                fillDate: formData.get('fillDate'),
                shipDate: '',
                returnDate: '',
                daysOut: 0,
                condition: 'Good',
                deposit: 30,
                lastCleaned: new Date().toISOString().split('T')[0],
                turnsThisYear: 0,
                batchNumber: formData.get('batchNumber'),
                maintenanceNotes: '',
                rentalRate: 0,
                purchaseDate: new Date().toISOString().split('T')[0]
              };
              addKeg(newKeg);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Keg ID</label>
                  <input
                    type="text"
                    name="id"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Barcode</label>
                  <input
                    type="text"
                    name="barcode"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product</label>
                  <select
                    name="product"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Size</label>
                  <select
                    name="size"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option>15.5 gal</option>
                    <option>7.75 gal</option>
                    <option>5.16 gal</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select
                    name="status"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option>Empty</option>
                    <option>Filled</option>
                    <option>At Customer</option>
                    <option>In Transit</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue="Brewery"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fill Date</label>
                  <input
                    type="date"
                    name="fillDate"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Batch Number</label>
                  <input
                    type="text"
                    name="batchNumber"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                    darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Add Keg
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Keg Modal */}
      {modal === 'editKeg' && selectedKeg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Edit Keg: {selectedKeg.id}</h3>
              <button onClick={() => { setModal(null); setSelectedKeg(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Keg ID</label>
                  <input
                    type="text"
                    value={selectedKeg.id}
                    disabled
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-400'
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Barcode</label>
                  <input
                    type="text"
                    value={selectedKeg.barcode}
                    onChange={(e) => setSelectedKeg({...selectedKeg, barcode: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product</label>
                  <select
                    value={selectedKeg.product}
                    onChange={(e) => setSelectedKeg({...selectedKeg, product: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select
                    value={selectedKeg.status}
                    onChange={(e) => setSelectedKeg({...selectedKeg, status: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option>Empty</option>
                    <option>Filled</option>
                    <option>At Customer</option>
                    <option>In Transit</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                  <input
                    type="text"
                    value={selectedKeg.location}
                    onChange={(e) => setSelectedKeg({...selectedKeg, location: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer</label>
                  <select
                    value={selectedKeg.customer}
                    onChange={(e) => setSelectedKeg({...selectedKeg, customer: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fill Date</label>
                  <input
                    type="date"
                    value={selectedKeg.fillDate}
                    onChange={(e) => setSelectedKeg({...selectedKeg, fillDate: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ship Date</label>
                  <input
                    type="date"
                    value={selectedKeg.shipDate}
                    onChange={(e) => setSelectedKeg({...selectedKeg, shipDate: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Return Date</label>
                  <input
                    type="date"
                    value={selectedKeg.returnDate}
                    onChange={(e) => setSelectedKeg({...selectedKeg, returnDate: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Condition</label>
                  <select
                    value={selectedKeg.condition}
                    onChange={(e) => setSelectedKeg({...selectedKeg, condition: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option>Good</option>
                    <option>Needs Cleaning</option>
                    <option>Needs Repair</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Batch Number</label>
                  <input
                    type="text"
                    value={selectedKeg.batchNumber}
                    onChange={(e) => setSelectedKeg({...selectedKeg, batchNumber: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Maintenance Notes</label>
                  <textarea
                    value={selectedKeg.maintenanceNotes}
                    onChange={(e) => setSelectedKeg({...selectedKeg, maintenanceNotes: e.target.value})}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => { setModal(null); setSelectedKeg(null); }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateKeg(selectedKeg);
                  logActivity('Edit Keg', `Updated keg ${selectedKeg.id}`, selectedKeg.id);
                  alert(`Keg ${selectedKeg.id} updated successfully!`);
                  setModal(null);
                  setSelectedKeg(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {modal === 'addCustomer' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add New Customer</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newCustomer = {
                id: `C${Date.now()}`,
                name: formData.get('name'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                kegsOut: 0,
                depositBalance: 0,
                creditLimit: parseInt(formData.get('creditLimit')),
                currentBalance: 0,
                deliveryDay: formData.get('deliveryDay'),
                route: formData.get('route'),
                notes: formData.get('notes'),
                status: 'Active'
              };
              addCustomer(newCustomer);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Business Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    maxLength="2"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Credit Limit</label>
                  <input
                    type="number"
                    name="creditLimit"
                    defaultValue="1000"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Delivery Day</label>
                  <select
                    name="deliveryDay"
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Route</label>
                  <input
                    type="text"
                    name="route"
                    defaultValue="Route A"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes</label>
                  <textarea
                    name="notes"
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                    darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Quick Action Button */}
      {view === 'inventory' && !bulkSelectMode && !batchMode && (
        <div className="fixed bottom-8 right-8 z-40">
          {quickActionMenu && (
            <div className="absolute bottom-20 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-3 space-y-2 mb-2">
              <button 
                onClick={() => { setModal('addKeg'); setQuickActionMenu(false); }}
                className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 w-full text-left font-semibold"
              >
                <Plus size={20} />
                <span>Add Keg</span>
              </button>
              <button 
                onClick={() => { setScan(true); setQuickActionMenu(false); }}
                className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 w-full text-left font-semibold"
              >
                <Camera size={20} />
                <span>Scan Barcode</span>
              </button>
              <button 
                onClick={() => { setBatchMode(true); setQuickActionMenu(false); }}
                className="flex items-center gap-3 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 w-full text-left font-semibold"
              >
                <Layers size={20} />
                <span>Batch Mode</span>
              </button>
              <button 
                onClick={() => { exportData('inventory'); setQuickActionMenu(false); }}
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left font-semibold"
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
