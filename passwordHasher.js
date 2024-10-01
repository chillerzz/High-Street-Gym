// Import the bcrypt module
const bcrypt = require('bcrypt');

// Generate a salt to use for hashing
const saltRounds = 10;
bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) {
        return console.error('Error generating salt:', err);
    }
    // Hash the password
    bcrypt.hash('Enter your password here', salt, function(err, hash) {
        if (err) {
            return console.error('Error hashing password:', err);
        }
        // Print the hashed password
        console.log('Hashed password:', hash);
    });
});
