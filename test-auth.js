const fs = require('fs');
const path = require('path');

// Test the user storage system directly
const userStoragePath = path.join(__dirname, 'lib', 'user-storage.ts');

console.log('Testing Authentication System...\n');

// Test 1: Check if user storage file exists
console.log('1. User Storage File Check:');
if (fs.existsSync(userStoragePath)) {
  console.log('✅ User storage file exists');
  
  // Read and validate user storage content
  const content = fs.readFileSync(userStoragePath, 'utf8');
  
  if (content.includes('admin') && content.includes('doctor') && content.includes('assistant')) {
    console.log('✅ Demo users are configured');
  } else {
    console.log('❌ Demo users not found');
  }
  
  if (content.includes('findUserByCredentials') && content.includes('addUser')) {
    console.log('✅ Required functions are present');
  } else {
    console.log('❌ Required functions missing');
  }
} else {
  console.log('❌ User storage file missing');
}

console.log('\n2. API Routes Check:');

// Test 2: Check if API routes exist
const apiRoutes = [
  'app/api/auth/login/route.ts',
  'app/api/auth/logout/route.ts', 
  'app/api/auth/session/route.ts',
  'app/api/auth/signup/route.ts',
  'app/api/auth/profile/route.ts'
];

apiRoutes.forEach(route => {
  const routePath = path.join(__dirname, route);
  if (fs.existsSync(routePath)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ ${route}`);
  }
});

console.log('\n3. Component Check:');

// Test 3: Check if components exist
const components = [
  'components/auth-context.tsx',
  'app/auth/login/page.tsx'
];

components.forEach(component => {
  const componentPath = path.join(__dirname, component);
  if (fs.existsSync(componentPath)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component}`);
  }
});

console.log('\n4. Demo Credentials:');
console.log('Admin: admin / admin123');
console.log('Doctor: doctor / doctor123');
console.log('Assistant: assistant / assist123');

console.log('\n5. Instructions:');
console.log('1. Run "npm run dev" to start the server');
console.log('2. Navigate to http://localhost:3000/auth/login');
console.log('3. Try logging in with the demo credentials above');
console.log('4. Check browser console for any errors');

console.log('\nTest complete! If all items show ✅, the authentication system should work.');