// Vanilla JS SPA Router
document.addEventListener('DOMContentLoaded', () => {
    // Intercept all link clicks
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link], a[href^="/"]')) {
            // Find closest anchor tag
            const anchor = e.target.closest('a');
            if(anchor && anchor.origin === window.location.origin) {
                e.preventDefault();
                navigateTo(anchor.href);
            }
        }
    });

    // Handle back/forward browser buttons
    window.addEventListener('popstate', () => {
        router();
    });

    // Initial load
    router();
});

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    let path = window.location.pathname;
    if (path === '/') path = '/index'; // Map / to index
    
    // We fetch the raw HTML of the target view from our express server
    try {
        // Express naturally handles /login and returns the html file!
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Not found');
        }
        const html = await response.text();
        
        // Parse the fetched HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Replace current body with fetched body (or just main, but body ensures modals/styles load)
        document.body.innerHTML = doc.body.innerHTML;
        
        // Ensure scripts are re-executed
        executeScripts(document.body);
        
        // Re-init UI tools like cart
        if (typeof UI !== 'undefined' && UI.updateCartUI) {
            UI.updateCartUI();
        }

    } catch (e) {
        console.error(e);
        document.body.innerHTML = '<div class="p-20 text-center"><h1 class="text-4xl text-error font-bold">404 - Page not found</h1><a href="/" class="text-primary mt-4 block" data-link>Go Home</a></div>';
    }
};

// Evaluate scripts in dynamically inserted HTML
function executeScripts(element) {
    const scripts = element.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}
