const bcrypt = require('bcryptjs');
const password = 'Admin@2026!';
const hash = bcrypt.hashSync(password, 12);
console.log('=== DenymStyle Admin Setup ===');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nSQL:');
console.log("UPDATE usuarios SET password_hash='" + hash + "' WHERE username='marcelo_admin';");
