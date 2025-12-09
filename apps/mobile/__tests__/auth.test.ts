/**
 * Manual test cases for authentication
 * Run these in the Expo app console or React Native Debugger
 */

import { loginSchema, registerSchema, passwordSchema, emailSchema, usernameSchema } from '../utils/validation';

// Test 1: Email Validation
console.log('=== Email Validation Tests ===');
try {
  emailSchema.parse('test@example.com');
  console.log('✅ Valid email passes');
} catch (e) {
  console.error('❌ Valid email failed');
}

try {
  emailSchema.parse('invalid-email');
  console.error('❌ Invalid email passed (should fail)');
} catch (e) {
  console.log('✅ Invalid email rejected');
}

// Test 2: Password Validation
console.log('\n=== Password Validation Tests ===');
try {
  passwordSchema.parse('Password123');
  console.log('✅ Valid password passes');
} catch (e) {
  console.error('❌ Valid password failed');
}

try {
  passwordSchema.parse('short');
  console.error('❌ Short password passed (should fail)');
} catch (e) {
  console.log('✅ Short password rejected');
}

try {
  passwordSchema.parse('nouppercase123');
  console.error('❌ No uppercase password passed (should fail)');
} catch (e) {
  console.log('✅ No uppercase password rejected');
}

// Test 3: Username Validation
console.log('\n=== Username Validation Tests ===');
try {
  usernameSchema.parse('validuser123');
  console.log('✅ Valid username passes');
} catch (e) {
  console.error('❌ Valid username failed');
}

try {
  usernameSchema.parse('ab');
  console.error('❌ Too short username passed (should fail)');
} catch (e) {
  console.log('✅ Too short username rejected');
}

// Test 4: Login Schema
console.log('\n=== Login Schema Test ===');
try {
  loginSchema.parse({
    email: 'test@example.com',
    password: 'anypassword',
  });
  console.log('✅ Valid login data passes');
} catch (e) {
  console.error('❌ Valid login data failed');
}

// Test 5: Register Schema
console.log('\n=== Register Schema Test ===');
try {
  registerSchema.parse({
    email: 'test@example.com',
    username: 'testuser',
    password: 'Password123',
    confirmPassword: 'Password123',
  });
  console.log('✅ Valid registration data passes');
} catch (e) {
  console.error('❌ Valid registration data failed:', e);
}

try {
  registerSchema.parse({
    email: 'test@example.com',
    username: 'testuser',
    password: 'Password123',
    confirmPassword: 'DifferentPassword',
  });
  console.error('❌ Mismatched passwords passed (should fail)');
} catch (e) {
  console.log('✅ Mismatched passwords rejected');
}

console.log('\n=== All Validation Tests Complete ===');