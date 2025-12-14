/**
 * Main JavaScript for Personal Website
 * Optional interactive features and enhancements
 */

(function() {
    'use strict';

    /**
     * Initialize on DOM ready
     */
    function init() {
        setupSmoothScrolling();
        setupFilterFeatures();
        highlightCurrentNavLink();
        addCopyButtonsToCodeBlocks();
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Setup filtering for project/writing lists
     */
    function setupFilterFeatures() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                const items = document.querySelectorAll('[data-category]');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                items.forEach(item => {
                    const categories = item.getAttribute('data-category').split(' ');
                    
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /**
     * Highlight current navigation link based on page
     */
    function highlightCurrentNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            if (currentPath.includes(linkPath) && linkPath !== '/') {
                link.style.fontWeight = '700';
                link.style.color = 'var(--color-accent)';
            }
        });
    }

    /**
     * Utility: Copy text to clipboard
     */
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    }

    /**
     * Add copy buttons to code blocks
     */
    function addCopyButtonsToCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            const button = document.createElement('button');
            button.textContent = 'Copy';
            button.className = 'copy-button';
            button.style.cssText = 'position:absolute;top:0.5rem;right:0.5rem;padding:0.25rem 0.5rem;font-size:0.8rem;';
            
            const pre = block.parentElement;
            pre.style.position = 'relative';
            pre.appendChild(button);
            
            button.addEventListener('click', () => {
                copyToClipboard(block.textContent);
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        });
    }

    /**
     * Initialize everything when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
