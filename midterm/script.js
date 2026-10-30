// Get the search, sort and product elements
const searchInput = document.getElementById("product-search");
const sortButton = document.getElementById("sort-price");
const noProductsMessage = document.getElementById("no-products");

const productCards = document.querySelectorAll(".product-card");
const productGrids = document.querySelectorAll(".product-grid");
const collectionSections = document.querySelectorAll(".collection-section");

const categoryRadios = document.querySelectorAll(
    'input[name="category"]'
);

// Personal threshold based on roll number 136
const N = 36;
const premiumLimit = N * 100;

// Sorting starts with lowest to highest
let ascending = true;


// Add Premium labels when the page loads
productCards.forEach(function(card) {

    const priceText = card.querySelector("p").textContent;

    const price = Number(priceText.replace(/[^\d]/g, ""));

    if (price > premiumLimit) {

        const premiumLabel = document.createElement("span");

        premiumLabel.textContent = "Premium";

        premiumLabel.classList.add("premium-label");

        card.appendChild(premiumLabel);
    }

});


// Live search and category filtering
function filterProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const selectedCategory = document.querySelector(
        'input[name="category"]:checked'
    ).id;

    let visibleCount = 0;

    productCards.forEach(function(card) {

        const productName = card.querySelector("h4")
            .textContent.toLowerCase();

        const matchesSearch = productName.includes(searchValue);

        const section = card.closest(".collection-section");

        const category = section.id;

        let matchesCategory = true;

        if (selectedCategory === "filter-men") {
            matchesCategory = category === "men";
        }

        else if (selectedCategory === "filter-women") {
            matchesCategory = category === "women";
        }

        else if (selectedCategory === "filter-unisex") {
            matchesCategory = category === "unisex";
        }

        const isVisible = matchesSearch && matchesCategory;

        card.style.display = isVisible ? "" : "none";

        if (isVisible) {
            visibleCount++;
        }

    });


    // Hide collection headings when no cards match
    collectionSections.forEach(function(section) {

        const visibleCards = section.querySelectorAll(
            ".product-card:not([style*='display: none'])"
        );

        const selectedSection =
            selectedCategory === "filter-all" ||
            section.id === selectedCategory.replace("filter-", "");

        section.style.display =
            selectedSection && visibleCards.length > 0 ? "" : "none";

    });


    // Show message if no products match
    noProductsMessage.hidden = visibleCount !== 0;

}


// Search as the user types
searchInput.addEventListener("input", filterProducts);


// Update results when category changes
categoryRadios.forEach(function(radio) {

    radio.addEventListener("change", filterProducts);

});


// Sort products by price
sortButton.addEventListener("click", function() {

    productGrids.forEach(function(grid) {

        const cards = Array.from(
            grid.querySelectorAll(".product-card")
        );

        cards.sort(function(cardA, cardB) {

            const priceA = Number(
                cardA.querySelector("p").textContent.replace(/[^\d]/g, "")
            );

            const priceB = Number(
                cardB.querySelector("p").textContent.replace(/[^\d]/g, "")
            );

            if (ascending) {
                return priceA - priceB;
            }

            return priceB - priceA;

        });


        // Move existing cards instead of recreating them
        cards.forEach(function(card) {
            grid.appendChild(card);
        });

    });


    // Change sorting direction for next click
    ascending = !ascending;

    if (ascending) {
        sortButton.textContent = "Sort by Price: Low to High";
    }

    else {
        sortButton.textContent = "Sort by Price: High to Low";
    }

});


// Run filtering once when the page loads
filterProducts();
