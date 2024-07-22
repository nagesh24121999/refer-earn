// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpv9Aa7Sp3_LcCNvuqAYy2gRnk5tojXOw",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "refer-and-earn-e1d01",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Sign up function
function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            // Generate referral code
            const referralCode = generateReferralCode();
            // Save user data in the database
            database.ref('users/' + user.uid).set({
                email: user.email,
                referralCode: referralCode
            });
            // Display referral code
            displayReferralCode(referralCode);
        })
        .catch(error => {
            console.error("Error signing up: ", error);
        });
}

// Login function
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            // Get referral code from the database
            database.ref('users/' + user.uid).once('value').then(snapshot => {
                const referralCode = snapshot.val().referralCode;
                displayReferralCode(referralCode);
            });
        })
        .catch(error => {
            console.error("Error logging in: ", error);
        });
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        document.getElementById("referral-container").style.display = "none";
        document.getElementById("login-container").style.display = "block";
    }).catch(error => {
        console.error("Error logging out: ", error);
    });
}

// Display referral code
function displayReferralCode(referralCode) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("referral-container").style.display = "block";
    document.getElementById("referralCode").textContent = referralCode;
}

// Generate referral code
function generateReferralCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode = '';
    for (let i = 0; i < 8; i++) {
        referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return referralCode;
}
