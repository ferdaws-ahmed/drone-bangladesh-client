'use client';

import { useState } from 'react';
import ProductTabsSection from '@/components/product-details/ProductTabsSection';
import ProductBuyCombo from '@/components/product-details/ProductBuyCombo';
import ProductAccessories from '@/components/product-details/ProductAccessories';

export default function ProductInteractiveSections({ product, productType }) {
  // বাই ডিফল্ট 'accessories' সেকশন একটিভ থাকবে
  const [activeTabSection, setActiveTabSection] = useState('accessories');

  return (
    <>
      {/* Tabs Section */}
      <div id="description-specs-section" className="mt-6">
        <ProductTabsSection 
          product={product} 
          onTabSwitch={(tabName) => {
            if (tabName === 'buy-combo') {
              setActiveTabSection('buy-combo');
            } else if (tabName === 'accessories') {
              setActiveTabSection('accessories');
            }
          }}
        />
      </div>

      {/* Conditional Display */}
      {activeTabSection === 'buy-combo' && (
        <div id="buy-combo-section" className="mt-6 scroll-mt-6">
          <ProductBuyCombo product={product} productType={productType} />
        </div>
      )}

      {activeTabSection === 'accessories' && (
        <div id="accessories-section" className="mt-6 scroll-mt-6">
          <ProductAccessories product={product} productType={productType} />
        </div>
      )}
    </>
  );
}