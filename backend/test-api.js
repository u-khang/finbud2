const http = require('http');

const BASE_URL = 'http://localhost:4000';
const API_BASE = `${BASE_URL}/api`;

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

const testTransaction = {
  type: 'expense',
  amount: 50.00,
  category: 'food',
  note: 'Test transaction',
  date: new Date().toISOString()
};

let sessionCookie = '';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    const signupResponse = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/users/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testUser);
    
    if (signupResponse.statusCode === 201) {
      console.log('OK: User registration successful');
      // Get session cookie
      if (signupResponse.headers['set-cookie']) {
        sessionCookie = signupResponse.headers['set-cookie'][0].split(';')[0];
      }
    } else {
      console.log('X: User registration failed:', signupResponse.data.error);
    }

    // Test 2: User Login
    console.log('\n2. Testing User Login...');
    const loginResponse = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/users/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: testUser.email,
      password: testUser.password
    });

    if (loginResponse.statusCode === 200) {
      console.log('OK: User login successful');
      // Get session cookie
      if (loginResponse.headers['set-cookie']) {
        sessionCookie = loginResponse.headers['set-cookie'][0].split(';')[0];
      }
    } else {
      console.log('X: User login failed:', loginResponse.data.error);
    }

    // Test 3: Get User Profile
    console.log('\n3. Testing Get User Profile...');
    const profileResponse = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/users/profile',
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    });

    if (profileResponse.statusCode === 200) {
      console.log('OK: User profile retrieved:', profileResponse.data.user.username);
    } else {
      console.log('X: Get profile failed:', profileResponse.data.error);
    }

    // Test 4: Create Transaction
    console.log('\n4. Testing Create Transaction...');
    const createTransactionResponse = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/transactions',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    }, testTransaction);

    if (createTransactionResponse.statusCode === 201) {
      console.log('OK: Transaction created:', createTransactionResponse.data.transaction._id);
    } else {
      console.log('X: Create transaction failed:', createTransactionResponse.data.error);
    }

    // Test 5: Get User Transactions
    console.log('\n5. Testing Get User Transactions...');
    const getTransactionsResponse = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/transactions/my',
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    });

    if (getTransactionsResponse.statusCode === 200) {
      console.log('OK: User transactions retrieved:', getTransactionsResponse.data.transactions.length, 'transactions');
    } else {
      console.log('X: Get transactions failed:', getTransactionsResponse.data.error);
    }

    // Test 6: User Logout
    console.log('\n6. Testing User Logout...');
    const logoutResponse = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/users/logout',
      method: 'POST',
      headers: {
        'Cookie': sessionCookie
      }
    });

    if (logoutResponse.statusCode === 200) {
      console.log('OK: User logout successful');
    } else {
      console.log('X: Logout failed:', logoutResponse.data.error);
    }

    console.log('\n API testing complete');

  } catch (error) {
    console.error('X: Test failed with error:', error.message);
  }
}

// Run the tests
testAPI();
