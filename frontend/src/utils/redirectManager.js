// Redirect manager to handle order flow after login
class RedirectManager {
    constructor() {
        this.storageKey = 'redirect_after_login';
    }

    // Store redirect URL before login
    storeRedirect(url) {
        sessionStorage.setItem(this.storageKey, url);
    }

    // Get redirect URL after login
    getRedirect() {
        const url = sessionStorage.getItem(this.storageKey);
        sessionStorage.removeItem(this.storageKey);
        return url || '/';
    }

    // Check if there's a pending redirect
    hasPendingRedirect() {
        return !!sessionStorage.getItem(this.storageKey);
    }

    // Store order context
    storeOrderContext(orderData) {
        sessionStorage.setItem('pending_order', JSON.stringify(orderData));
    }

    // Get order context
    getOrderContext() {
        const data = sessionStorage.getItem('pending_order');
        sessionStorage.removeItem('pending_order');
        return data ? JSON.parse(data) : null;
    }
}

const redirectManager = new RedirectManager();
export default redirectManager;
