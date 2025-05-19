function logout() {
    localStorage.removeItem('token');  // Remove the token to log out the user
    alert('You have been logged out.');
}