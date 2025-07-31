// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuButton = document.querySelector('nav button');
    const mobileMenu = document.querySelector('.md\\:hidden.bg-white.p-4');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Email signup popup functionality
    const emailPopup = document.getElementById('email-popup');
    const closePopup = document.getElementById('close-popup');
    const showPopupButtons = document.querySelectorAll('.show-popup');
    
    if (emailPopup && closePopup) {
        // Show popup after 5 seconds on homepage
        if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            setTimeout(function() {
                emailPopup.classList.remove('hidden');
            }, 5000);
        }
        
        // Close popup when clicking the close button
        closePopup.addEventListener('click', function() {
            emailPopup.classList.add('hidden');
            // Set a cookie to remember that the user closed the popup
            document.cookie = "popupClosed=true; max-age=86400; path=/";
        });
        
        // Show popup when clicking designated buttons
        if (showPopupButtons) {
            showPopupButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    emailPopup.classList.remove('hidden');
                });
            });
        }
        
        // Close popup when clicking outside of it
        emailPopup.addEventListener('click', function(e) {
            if (e.target === emailPopup) {
                emailPopup.classList.add('hidden');
            }
        });
    }

    // Product quantity controls
    const quantityControls = document.querySelectorAll('.quantity-control');
    
    if (quantityControls) {
        quantityControls.forEach(control => {
            const decreaseBtn = control.querySelector('.decrease');
            const increaseBtn = control.querySelector('.increase');
            const quantityInput = control.querySelector('input');
            
            if (decreaseBtn && increaseBtn && quantityInput) {
                decreaseBtn.addEventListener('click', function() {
                    let value = parseInt(quantityInput.value);
                    if (value > 1) {
                        quantityInput.value = value - 1;
                    }
                });
                
                increaseBtn.addEventListener('click', function() {
                    let value = parseInt(quantityInput.value);
                    quantityInput.value = value + 1;
                });
            }
        });
    }

    // FAQ accordion functionality
    const faqButtons = document.querySelectorAll('.faq-button');
    
    if (faqButtons) {
        faqButtons.forEach(button => {
            button.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('i');
                
                // Toggle content visibility
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            });
        });
    }

    // Product filtering functionality for shop page
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const productItems = document.querySelectorAll('.product-item');
    const priceRange = document.getElementById('price-range');
    const priceOutput = document.getElementById('price-output');
    
    if (filterCheckboxes && productItems) {
        // Category filtering
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateFilters);
        });
        
        // Price range filtering
        if (priceRange && priceOutput) {
            priceRange.addEventListener('input', function() {
                priceOutput.textContent = '₹' + priceRange.value;
                updateFilters();
            });
        }
        
        function updateFilters() {
            const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
                .map(checkbox => checkbox.value);
                
            const selectedSizes = Array.from(document.querySelectorAll('.size-filter:checked'))
                .map(checkbox => checkbox.value);
                
            const selectedColors = Array.from(document.querySelectorAll('.color-filter:checked'))
                .map(checkbox => checkbox.value);
                
            const maxPrice = priceRange ? parseInt(priceRange.value) : 10000;
            
            productItems.forEach(item => {
                const itemCategory = item.dataset.category;
                const itemSize = item.dataset.size;
                const itemColor = item.dataset.color;
                const itemPrice = parseInt(item.dataset.price);
                
                const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(itemCategory);
                const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(itemSize);
                const colorMatch = selectedColors.length === 0 || selectedColors.includes(itemColor);
                const priceMatch = itemPrice <= maxPrice;
                
                if (categoryMatch && sizeMatch && colorMatch && priceMatch) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }
    }

    // Product sorting functionality
    const sortSelect = document.getElementById('sort-select');
    const productGrid = document.querySelector('.product-grid');
    
    if (sortSelect && productGrid && productItems.length > 0) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productsArray = Array.from(productItems);
            
            productsArray.sort((a, b) => {
                const priceA = parseInt(a.dataset.price);
                const priceB = parseInt(b.dataset.price);
                const nameA = a.dataset.name;
                const nameB = b.dataset.name;
                
                if (sortValue === 'price-low-high') {
                    return priceA - priceB;
                } else if (sortValue === 'price-high-low') {
                    return priceB - priceA;
                } else if (sortValue === 'name-a-z') {
                    return nameA.localeCompare(nameB);
                } else if (sortValue === 'name-z-a') {
                    return nameB.localeCompare(nameA);
                }
                
                return 0;
            });
            
            // Remove all products from the grid
            productItems.forEach(item => {
                item.remove();
            });
            
            // Add sorted products back to the grid
            productsArray.forEach(item => {
                productGrid.appendChild(item);
            });
        });
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.fa-shopping-bag + span');
    
    if (addToCartButtons && cartCount) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get current cart count
                let count = parseInt(cartCount.textContent);
                
                // Update cart count
                cartCount.textContent = count + 1;
                
                // Show added to cart message
                const product = this.closest('.product-item') || this.closest('.product-details');
                if (product) {
                    const productName = product.dataset.name || 'Product';
                    showNotification(`${productName} added to cart!`);
                } else {
                    showNotification('Product added to cart!');
                }
            });
        });
    }

    // Notification function
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification fixed top-20 right-4 bg-primary text-white py-2 px-4 rounded-lg shadow-md transform translate-x-full transition-transform duration-300';
            document.body.appendChild(notification);
        }
        
        // Set message and show notification
        notification.textContent = message;
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
        }, 3000);
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    
    if (forms) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Basic validation
                let isValid = true;
                const requiredInputs = form.querySelectorAll('[required]');
                
                requiredInputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('border-red-500');
                    } else {
                        input.classList.remove('border-red-500');
                    }
                });
                
                // Email validation for email inputs
                const emailInputs = form.querySelectorAll('input[type="email"]');
                emailInputs.forEach(input => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (input.value.trim() && !emailRegex.test(input.value.trim())) {
                        isValid = false;
                        input.classList.add('border-red-500');
                    }
                });
                
                if (isValid) {
                    // In a real application, you would submit the form data to a server here
                    showNotification('Form submitted successfully!');
                    form.reset();
                } else {
                    showNotification('Please fill in all required fields correctly.');
                }
            });
        });
    }

    // Initialize product image gallery on product detail page
    const mainImage = document.querySelector('.main-product-image img');
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image src
                mainImage.src = this.src;
                
                // Update active thumbnail
                thumbnails.forEach(thumb => {
                    thumb.classList.remove('border-primary');
                    thumb.classList.add('border-transparent');
                });
                
                this.classList.remove('border-transparent');
                this.classList.add('border-primary');
            });
        });
    }

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.wishlist-toggle');
    
    if (wishlistButtons) {
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function() {
                const icon = this.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    // Add to wishlist
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.classList.add('text-red-500');
                    showNotification('Added to wishlist!');
                } else {
                    // Remove from wishlist
                    icon.classList.remove('fas');
                    icon.classList.remove('text-red-500');
                    icon.classList.add('far');
                    showNotification('Removed from wishlist!');
                }
            });
        });
    }
});