import React, { useEffect, useState } from "react";
import { getProducts } from "../../firebase/firestore";
import { Form } from "react-bootstrap";

/**
 * ProductCategoryFilter
 * - Dynamically fetches unique product categories from Firestore.
 * - Allows user to select a category to filter products.
 * - Calls onCategoryChange with the selected category (or null for all).
 */
const ProductCategoryFilter: React.FC<{
  selected: string | null;
  onCategoryChange: (category: string | null) => void;
}> = ({ selected, onCategoryChange }) => {
  // State to hold unique product categories
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch products from Firestore and extract unique categories
    getProducts().then(snapshot => {
      const prods = snapshot.docs.map(doc => doc.data());
      // Get unique, non-empty categories
      const unique = Array.from(new Set(prods.map((p: any) => p.category).filter(Boolean)));
      setCategories(unique);
    });
  }, []);

  return (
    <div className="mb-4 d-flex align-items-center" style={{ width: "100%" }}>
      {/* Label for the category filter */}
      <span
        style={{
          fontWeight: 600,
          marginRight: 12,
          whiteSpace: "nowrap",
        }}
      >
        Filter by Category:
      </span>
      {/* Dropdown select for categories */}
      <Form.Select
        value={selected ?? ""}
        onChange={e => onCategoryChange(e.target.value === "" ? null : e.target.value)}
        style={{ maxWidth: 300, minWidth: 160 }}
      >
        {/* Option to show all products */}
        <option value="">All</option>
        {/* Render options for each unique category */}
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Form.Select>
    </div>
  );
};

export default ProductCategoryFilter;
