import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';

// Initialize New Relic (uncomment when integrated)
// import NewRelic from '@newrelic/react-native-agent';
// NewRelic.startAgent();

const API_BASE = 'https://your-api-domain.com/api';

export default function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'users' ? '/users' : '/products';
      
      // Simulate API call (replace with actual API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeTab === 'users') {
        const mockUsers = [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
        ];
        setUsers(mockUsers);
      } else {
        const mockProducts = [
          { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 45 },
          { id: 2, name: 'Wireless Headphones', price: 199.99, category: 'Electronics', stock: 120 },
          { id: 3, name: 'Coffee Maker', price: 89.99, category: 'Appliances', stock: 30 }
        ];
        setProducts(mockProducts);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [activeTab]);

  const handleOrder = async (productId) => {
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate occasional failures
      if (Math.random() < 0.2) {
        throw new Error('Order failed');
      }
      
      Alert.alert('Success', `Order placed for product ${productId}!`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const filteredData = activeTab === 'users' 
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const renderUserCard = (user) => (
    <View key={user.id} style={styles.card}>
      <Text style={styles.cardTitle}>{user.name}</Text>
      <Text style={styles.cardText}>📧 {user.email}</Text>
      <Text style={styles.cardText}>🔰 {user.role}</Text>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => Alert.alert('Info', `Viewing ${user.name}'s profile`)}
      >
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductCard = (product) => (
    <View key={product.id} style={styles.card}>
      <Text style={styles.cardTitle}>{product.name}</Text>
      <Text style={styles.cardText}>💰 ${product.price}</Text>
      <Text style={styles.cardText}>📦 Stock: {product.stock}</Text>
      <Text style={styles.cardText}>🏷️ {product.category}</Text>
      <TouchableOpacity 
        style={[styles.actionButton, styles.orderButton]}
        onPress={() => handleOrder(product.id)}
      >
        <Text style={styles.buttonText}>Order Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 Demo Mobile App</Text>
        <Text style={styles.headerSubtitle}>New Relic Monitoring Showcase</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            Products
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading {activeTab}...</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'users' ? 'Users' : 'Products'} ({filteredData.length})
          </Text>
          
          {filteredData.map(item =>
            activeTab === 'users' 
              ? renderUserCard(item)
              : renderProductCard(item)
          )}
          
          {filteredData.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No {activeTab} found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: '#007acc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  orderButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
