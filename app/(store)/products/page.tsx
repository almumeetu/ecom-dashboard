'use client';

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/sections/ui/product-card';
import PageBanner from '@/components/ui/page-banner';
import { InfiniteScroll } from '@/app/admin/_components/infinite-scroll';
import {
  fetchShopProducts,
  fetchShopCategories,
  fetchShopBrands,
  type ShopProduct,
  type ShopCategory,
  type ShopBrand,
} from '@/lib/shop-api';
import {
  LuSlidersHorizontal,
  LuX,
  LuChevronDown,
  LuChevronUp,
  LuSearch,
  LuCheck,
  LuRotateCcw,
  LuTag,
  LuSparkles,
} from 'react-icons/lu';
import { IoCloseOutline } from 'react-icons/io5';

const PAGE_LIMIT = 24;

const SORT_OPTIONS = [
  { label: 'Date, new to old', value: 'newest' },
  { label: 'Price, low to high', value: 'price_asc' },
  { label: 'Price, high to low', value: 'price_desc' },
  { label: 'Alphabetically, A-Z', value: 'alpha_asc' },
  { label: 'Alphabetically, Z-A', value: 'alpha_desc' },
];

const PRICE_PRESETS = [
  { label: 'Under ৳1,000', min: 0, max: 1000 },
  { label: '৳1,000 - ৳3,000', min: 1000, max: 3000 },
  { label: '৳3,000 - ৳10,000', min: 3000, max: 10000 },
  { label: 'Over ৳10,000', min: 10000, max: Infinity },
];

const NO_IMAGE = '/images/no-image-icon-6.png';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchVal = searchParams?.get('search') || '';

  // Display & UI state
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);
  const [viewMode, setViewMode] = useState<'grid2' | 'grid3' | 'grid4'>('grid3');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Accordion open/close state for Shopify facets
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    availability: true,
    price: true,
    collection: true,
    category: true,
    brand: true,
    deals: true,
  });

  const toggleAccordion = (facet: string) => {
    setOpenAccordions((prev) => ({ ...prev, [facet]: !prev[facet] }));
  };

  // DB Data
  const [dbCategories, setDbCategories] = useState<ShopCategory[]>([]);
  const [dbBrands, setDbBrands] = useState<ShopBrand[]>([]);

  // Filter Values
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [minPriceInput, setMinPriceInput] = useState<string>('');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [activePricePreset, setActivePricePreset] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('newest');

  // Search inside brand and category lists
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [catSearchTerm, setCatSearchTerm] = useState('');

  // Products Data
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const reqIdRef = useRef(0);
  const pageRef = useRef(1);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Lock scroll on mobile drawer
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  // Load filter reference metadata
  useEffect(() => {
    async function loadFilterData() {
      try {
        const [cats, brs] = await Promise.all([
          fetchShopCategories(),
          fetchShopBrands(),
        ]);
        setDbCategories(cats);
        setDbBrands(brs);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    }
    loadFilterData();
  }, []);

  // Sync category param from URL on initial mount or change
  useEffect(() => {
    if (typeof window !== 'undefined' && dbCategories.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const brandParam = params.get('brand');

      if (brandParam) {
        const matchedBrand = dbBrands.find(
          (b) => b.name.toLowerCase() === brandParam.toLowerCase() || b.slug?.toLowerCase() === brandParam.toLowerCase()
        );
        if (matchedBrand) setSelectedBrand(matchedBrand.name);
      }

      if (cat) {
        const decodedCat = decodeURIComponent(cat).toLowerCase();
        const match = dbCategories.find(
          (c) => c.name.toLowerCase() === decodedCat || c.slug?.toLowerCase() === decodedCat
        );
        if (match) {
          if (!match.parentId) {
            setSelectedCollection(match.name);
            setSelectedCategory('All');
          } else {
            setSelectedCategory(match.name);
            const parent = dbCategories.find((p) => p.id === match.parentId);
            if (parent) {
              setSelectedCollection(parent.name);
            }
          }
        } else {
          setSelectedCategory(cat);
        }
      }
    }
  }, [dbCategories, dbBrands]);

  // Compute options
  const collectionOptions = useMemo(() => {
    const mainCats = dbCategories.filter((c) => !c.parentId);
    return ['All', ...mainCats.map((c) => c.name)];
  }, [dbCategories]);

  const categoryOptions = useMemo(() => {
    let filtered = dbCategories;
    if (selectedCollection !== 'All') {
      const parent = dbCategories.find((c) => c.name.toLowerCase() === selectedCollection.toLowerCase());
      if (parent && parent.children && parent.children.length > 0) {
        return ['All', ...parent.children.map((c) => c.name)];
      }
    }
    return ['All', ...filtered.map((c) => c.name)];
  }, [dbCategories, selectedCollection]);

  const brandOptions = useMemo(() => {
    return ['All', ...dbBrands.map((b) => b.name)];
  }, [dbBrands]);

  const selectedCategoryId = useMemo(() => {
    if (selectedCategory !== 'All') {
      return dbCategories.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase())?.id;
    }
    if (selectedCollection !== 'All') {
      const col = dbCategories.find((c) => c.name.toLowerCase() === selectedCollection.toLowerCase());
      if (col && (!col.children || col.children.length === 0)) {
        return col.id;
      }
    }
    return undefined;
  }, [selectedCategory, selectedCollection, dbCategories]);

  const selectedBrandId = useMemo(() => {
    if (selectedBrand === 'All') return undefined;
    return dbBrands.find((b) => b.name.toLowerCase() === selectedBrand.toLowerCase())?.id;
  }, [selectedBrand, dbBrands]);

  // Fetch products from backend
  const fetchProducts = useCallback(
    async (append: boolean) => {
      const pageNum = append ? pageRef.current + 1 : 1;
      pageRef.current = pageNum;
      const id = ++reqIdRef.current;
      setIsLoading(true);
      try {
        const res = await fetchShopProducts({
          page: pageNum,
          limit: PAGE_LIMIT,
          search: searchVal || undefined,
          categoryId: selectedCategoryId,
          brandId: selectedBrandId,
        });
        if (id !== reqIdRef.current) return;
        setProducts((prev) => (append ? [...prev, ...res.data] : res.data));
        setHasMore(res.data.length === PAGE_LIMIT);
      } catch (err) {
        if (id !== reqIdRef.current) return;
        console.error('Failed to fetch products:', err);
      } finally {
        if (id === reqIdRef.current) setIsLoading(false);
      }
    },
    [searchVal, selectedCategoryId, selectedBrandId],
  );

  useEffect(() => {
    fetchProducts(false);
  }, [fetchProducts]);

  const handleLoadMore = useCallback(() => {
    if (isLoading) return;
    fetchProducts(true);
  }, [isLoading, fetchProducts]);

  // Price presets handler
  const handlePricePreset = (preset: typeof PRICE_PRESETS[0]) => {
    if (activePricePreset === preset.label) {
      setActivePricePreset(null);
      setAppliedMinPrice(null);
      setAppliedMaxPrice(null);
      setMinPriceInput('');
      setMaxPriceInput('');
    } else {
      setActivePricePreset(preset.label);
      setAppliedMinPrice(preset.min);
      setAppliedMaxPrice(preset.max === Infinity ? null : preset.max);
      setMinPriceInput(preset.min.toString());
      setMaxPriceInput(preset.max === Infinity ? '' : preset.max.toString());
    }
  };

  const applyCustomPrice = () => {
    const min = minPriceInput.trim() !== '' ? Number(minPriceInput) : null;
    const max = maxPriceInput.trim() !== '' ? Number(maxPriceInput) : null;
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
    setActivePricePreset(null);
  };

  // Filtered & Sorted products pipeline
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // 1. Collection filter
      if (selectedCollection !== 'All') {
        const catObj = dbCategories.find((c) => c.name.toLowerCase() === p.category?.toLowerCase());
        const parentObj = catObj?.parentId ? dbCategories.find((c) => c.id === catObj.parentId) : null;
        if (
          p.category?.toLowerCase() !== selectedCollection.toLowerCase() &&
          parentObj?.name.toLowerCase() !== selectedCollection.toLowerCase()
        ) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'All' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // 3. Brand filter
      if (selectedBrand !== 'All' && p.team?.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // 4. Price range filter
      if (appliedMinPrice !== null && p.price < appliedMinPrice) return false;
      if (appliedMaxPrice !== null && p.price > appliedMaxPrice) return false;

      // 5. On sale filter
      if (onSaleOnly) {
        if (!p.originalPrice || p.originalPrice <= p.price) return false;
      }

      return true;
    });

    // Sort Pipeline
    if (selectedSort === 'price_asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price_desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'alpha_asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'alpha_desc') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedCollection,
    selectedBrand,
    appliedMinPrice,
    appliedMaxPrice,
    onSaleOnly,
    selectedSort,
    dbCategories,
  ]);

  // Active filters list
  const activeFilters = useMemo(() => {
    const list: { id: string; label: string; onRemove: () => void }[] = [];

    if (searchVal) {
      list.push({
        id: 'search',
        label: `Search: "${searchVal}"`,
        onRemove: () => router.push('/products'),
      });
    }

    if (selectedCollection !== 'All') {
      list.push({
        id: 'collection',
        label: `Collection: ${selectedCollection}`,
        onRemove: () => setSelectedCollection('All'),
      });
    }

    if (selectedCategory !== 'All') {
      list.push({
        id: 'category',
        label: `Category: ${selectedCategory}`,
        onRemove: () => setSelectedCategory('All'),
      });
    }

    if (selectedBrand !== 'All') {
      list.push({
        id: 'brand',
        label: `Brand: ${selectedBrand}`,
        onRemove: () => setSelectedBrand('All'),
      });
    }

    if (appliedMinPrice !== null || appliedMaxPrice !== null) {
      let priceLabel = '';
      if (appliedMinPrice !== null && appliedMaxPrice !== null) {
        priceLabel = `Price: ৳${appliedMinPrice.toLocaleString()} - ৳${appliedMaxPrice.toLocaleString()}`;
      } else if (appliedMinPrice !== null) {
        priceLabel = `Price: Over ৳${appliedMinPrice.toLocaleString()}`;
      } else if (appliedMaxPrice !== null) {
        priceLabel = `Price: Under ৳${appliedMaxPrice.toLocaleString()}`;
      }
      list.push({
        id: 'price',
        label: priceLabel,
        onRemove: () => {
          setAppliedMinPrice(null);
          setAppliedMaxPrice(null);
          setActivePricePreset(null);
          setMinPriceInput('');
          setMaxPriceInput('');
        },
      });
    }

    if (inStockOnly) {
      list.push({
        id: 'inStock',
        label: 'In Stock Only',
        onRemove: () => setInStockOnly(false),
      });
    }

    if (onSaleOnly) {
      list.push({
        id: 'onSale',
        label: 'On Sale / Deals',
        onRemove: () => setOnSaleOnly(false),
      });
    }

    return list;
  }, [
    searchVal,
    selectedCollection,
    selectedCategory,
    selectedBrand,
    appliedMinPrice,
    appliedMaxPrice,
    inStockOnly,
    onSaleOnly,
    router,
  ]);

  const clearAllFilters = () => {
    setSelectedCollection('All');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setActivePricePreset(null);
    setMinPriceInput('');
    setMaxPriceInput('');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSelectedSort('newest');
    if (searchVal) router.push('/products');
  };

  // Page Heading
  const pageHeading = useMemo(() => {
    if (searchVal) return `Search Results for "${searchVal}"`;
    if (selectedCategory !== 'All') return selectedCategory;
    if (selectedCollection !== 'All') return selectedCollection;
    if (selectedBrand !== 'All') return selectedBrand;
    return 'All Products';
  }, [selectedCategory, selectedCollection, selectedBrand, searchVal]);

  const currentSortLabel = useMemo(() => {
    return SORT_OPTIONS.find((s) => s.value === selectedSort)?.label || 'Date, new to old';
  }, [selectedSort]);

  // Sidebar Facets Component (used in both Desktop & Mobile Drawer)
  const renderSidebarFilters = (isMobile = false) => {
    return (
      <div className="space-y-6 text-zinc-800 text-xs">
        {/* 1. Availability Facet */}
        <div className="border-b border-zinc-200 pb-5">
          <button
            type="button"
            onClick={() => toggleAccordion('availability')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-zinc-900 py-1 cursor-pointer select-none"
          >
            <span>Availability</span>
            {openAccordions.availability ? (
              <LuChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <LuChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {openAccordions.availability && (
            <div className="mt-3.5 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-zinc-700 group-hover:text-zinc-900 font-medium">
                  In stock only
                </span>
              </label>
            </div>
          )}
        </div>

        {/* 2. Price Facet (Shopify numeric inputs + presets) */}
        <div className="border-b border-zinc-200 pb-5">
          <button
            type="button"
            onClick={() => toggleAccordion('price')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-zinc-900 py-1 cursor-pointer select-none"
          >
            <span>Price (BDT)</span>
            {openAccordions.price ? (
              <LuChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <LuChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {openAccordions.price && (
            <div className="mt-3.5 space-y-3">
              {/* Quick Preset Pills */}
              <div className="flex flex-wrap gap-1.5">
                {PRICE_PRESETS.map((preset) => {
                  const isActive = activePricePreset === preset.label;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePricePreset(preset)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Min - Max Inputs */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">৳</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 border border-zinc-200 rounded-md text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <span className="text-zinc-400 text-xs">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">৳</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 border border-zinc-200 rounded-md text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyCustomPrice}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-emerald-600 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Collection / Department Facet */}
        <div className="border-b border-zinc-200 pb-5">
          <button
            type="button"
            onClick={() => toggleAccordion('collection')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-zinc-900 py-1 cursor-pointer select-none"
          >
            <span>Department / Collection</span>
            {openAccordions.collection ? (
              <LuChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <LuChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {openAccordions.collection && (
            <div className="mt-3.5 space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {collectionOptions.map((opt) => {
                const isSelected = selectedCollection === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedCollection(opt);
                      setSelectedCategory('All');
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <LuCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Subcategories Facet */}
        <div className="border-b border-zinc-200 pb-5">
          <button
            type="button"
            onClick={() => toggleAccordion('category')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-zinc-900 py-1 cursor-pointer select-none"
          >
            <span>Categories</span>
            {openAccordions.category ? (
              <LuChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <LuChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {openAccordions.category && (
            <div className="mt-3.5 space-y-2">
              {/* Category Search Filter if long */}
              {categoryOptions.length > 7 && (
                <div className="relative mb-2">
                  <LuSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={catSearchTerm}
                    onChange={(e) => setCatSearchTerm(e.target.value)}
                    placeholder="Filter categories..."
                    className="w-full pl-8 pr-2 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {categoryOptions
                  .filter((opt) => opt.toLowerCase().includes(catSearchTerm.toLowerCase()))
                  .map((opt) => {
                    const isSelected = selectedCategory === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedCategory(opt)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {isSelected && <LuCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Brand / Vendor Facet */}
        <div className="border-b border-zinc-200 pb-5">
          <button
            type="button"
            onClick={() => toggleAccordion('brand')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-zinc-900 py-1 cursor-pointer select-none"
          >
            <span>Brand / Merchant</span>
            {openAccordions.brand ? (
              <LuChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <LuChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {openAccordions.brand && (
            <div className="mt-3.5 space-y-2">
              {brandOptions.length > 6 && (
                <div className="relative mb-2">
                  <LuSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={brandSearchTerm}
                    onChange={(e) => setBrandSearchTerm(e.target.value)}
                    placeholder="Search brands..."
                    className="w-full pl-8 pr-2 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {brandOptions
                  .filter((opt) => opt.toLowerCase().includes(brandSearchTerm.toLowerCase()))
                  .map((opt) => {
                    const isSelected = selectedBrand === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedBrand(opt)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {isSelected && <LuCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* 6. Special Offers / Discounts */}
        <div className="pb-2">
          <button
            type="button"
            onClick={() => toggleAccordion('deals')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-zinc-900 py-1 cursor-pointer select-none"
          >
            <span>Deals & Discounts</span>
            {openAccordions.deals ? (
              <LuChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <LuChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {openAccordions.deals && (
            <div className="mt-3.5 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-zinc-700 group-hover:text-zinc-900 font-medium flex items-center gap-1.5">
                  <LuTag className="w-3.5 h-3.5 text-rose-500" />
                  <span>On Sale / Special Deals</span>
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-left">
      <main className="flex-grow w-full text-left">
        {/* Strictly Left-Aligned Page Banner */}
        <PageBanner
          title={pageHeading}
          subtitle={`Explore ${filteredProducts.length} verified products from multi-vendors with doorstep delivery and buyer protection.`}
          badge="Marketplace Catalog"
          breadcrumbs={[
            { label: 'Products', href: '/products' },
            ...(selectedCategory !== 'All' ? [{ label: selectedCategory }] : []),
          ]}
        />

        {/* Shopify OS 2.0 Filter Control Toolbar */}
        <div className="w-full border-b border-zinc-200 bg-white sticky top-[60px] z-30 shadow-xs">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-3 flex items-center justify-between gap-4">
            
            {/* Left: Filter Toggle & Item Count */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Desktop Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setShowDesktopSidebar(!showDesktopSidebar)}
                className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:bg-zinc-50"
                aria-label="Toggle Filters"
              >
                <LuSlidersHorizontal className="w-4 h-4 text-zinc-600" />
                <span>{showDesktopSidebar ? 'Hide Filters' : 'Show Filters'}</span>
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              {/* Mobile Filter Trigger Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                <LuSlidersHorizontal className="w-4 h-4 text-zinc-600" />
                <span>Filters & Sort</span>
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              {/* Total Products Count */}
              <span className="text-xs text-zinc-500 font-medium">
                Showing <strong className="text-zinc-900 font-semibold">{filteredProducts.length}</strong> products
              </span>
            </div>

            {/* Right: Grid Switcher & Shopify Sort By */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Desktop Grid Switcher */}
              <div className="hidden sm:flex items-center gap-1 border border-zinc-200 rounded-lg p-0.5 bg-zinc-50">
                {/* 2 Cols */}
                <button
                  type="button"
                  onClick={() => setViewMode('grid2')}
                  title="2 Columns Grid"
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === 'grid2'
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="2" width="6" height="12" rx="1" />
                    <rect x="9" y="2" width="6" height="12" rx="1" />
                  </svg>
                </button>

                {/* 3 Cols */}
                <button
                  type="button"
                  onClick={() => setViewMode('grid3')}
                  title="3 Columns Grid"
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === 'grid3'
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="2" width="4" height="12" rx="0.75" />
                    <rect x="6" y="2" width="4" height="12" rx="0.75" />
                    <rect x="11" y="2" width="4" height="12" rx="0.75" />
                  </svg>
                </button>

                {/* 4 Cols */}
                <button
                  type="button"
                  onClick={() => setViewMode('grid4')}
                  title="4 Columns Grid"
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === 'grid4'
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="2" width="2.5" height="12" rx="0.5" />
                    <rect x="5" y="2" width="2.5" height="12" rx="0.5" />
                    <rect x="9" y="2" width="2.5" height="12" rx="0.5" />
                    <rect x="13" y="2" width="2.5" height="12" rx="0.5" />
                  </svg>
                </button>
              </div>

              {/* Sort By Dropdown (Shopify Style) */}
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-900 font-medium py-1.5 px-2.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white transition-all cursor-pointer shadow-2xs"
                >
                  <span className="text-zinc-400">Sort by:</span>
                  <span className="font-semibold text-zinc-900">{currentSortLabel}</span>
                  <LuChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white border border-zinc-200 rounded-xl shadow-xl py-1.5 z-50">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSelectedSort(opt.value);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                          selectedSort === opt.value
                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                            : 'text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {selectedSort === opt.value && <LuCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Active Filter Chips Bar (Shopify Pill Tags) */}
        {activeFilters.length > 0 && (
          <div className="w-full bg-zinc-50/70 border-b border-zinc-200/80 py-2.5 px-4 sm:px-6 md:px-10 lg:px-16">
            <div className="max-w-[1440px] mx-auto flex items-center gap-2 flex-wrap text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1 select-none">
                Active filters:
              </span>

              {activeFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={filter.onRemove}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-zinc-300 text-zinc-800 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer shadow-2xs group"
                >
                  <span>{filter.label}</span>
                  <LuX className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-500" />
                </button>
              ))}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 ml-1 cursor-pointer transition-colors"
              >
                Clear all ({activeFilters.length})
              </button>
            </div>
          </div>
        )}

        {/* Main Body: Desktop Sidebar + Product Grid */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-10">
          <div className="flex items-start gap-8 lg:gap-10">
            
            {/* Desktop Left-Hand Shopify Sidebar */}
            {showDesktopSidebar && (
              <aside className="hidden lg:block w-72 shrink-0 sticky top-28 self-start pr-2">
                <div className="flex items-center justify-between pb-4 mb-2 border-b border-zinc-200">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                    <LuSlidersHorizontal className="w-4 h-4 text-emerald-600" />
                    <span>Filter By</span>
                  </h3>
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {renderSidebarFilters(false)}
              </aside>
            )}

            {/* Right Product Grid Area */}
            <div className="flex-1 min-w-0">
              {isLoading && products.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-[360px] bg-zinc-50 animate-pulse border border-zinc-100 rounded-xl flex flex-col justify-between p-4"
                    >
                      <div className="w-full h-[200px] bg-zinc-200 rounded-lg" />
                      <div className="h-4 bg-zinc-200 w-3/4 rounded mt-3" />
                      <div className="flex justify-between items-center mt-3">
                        <div className="h-4 bg-zinc-200 w-1/3 rounded" />
                        <div className="h-7 bg-zinc-200 w-1/3 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div
                    className={`grid gap-3 sm:gap-6 ${
                      viewMode === 'grid2'
                        ? 'grid-cols-2'
                        : viewMode === 'grid3'
                        ? 'grid-cols-2 md:grid-cols-3'
                        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    }`}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={`৳${product.price.toLocaleString()}`}
                        originalPrice={
                          product.originalPrice ? `৳${product.originalPrice.toLocaleString()}` : ''
                        }
                        image={product.image || NO_IMAGE}
                        slug={product.slug}
                        category={product.category}
                        brand={product.team}
                        unit={product.unit}
                      />
                    ))}
                  </div>

                  {/* Infinite Scroll trigger */}
                  <div className="mt-12">
                    <InfiniteScroll
                      hasMore={hasMore}
                      isLoading={isLoading}
                      onLoadMore={handleLoadMore}
                      allLoadedLabel="All marketplace products loaded"
                      loadingLabel="Loading more products..."
                      sentinelLabel="Scroll to view more items"
                    />
                  </div>
                </>
              ) : (
                /* Empty state when filters return 0 results */
                <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200 my-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <LuRotateCcw className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">
                    No products matched your filters
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-md mb-6 leading-relaxed">
                    Try changing your price range, clearing some category tags, or resetting all filters to see our full catalogue.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Slide-Over Filter Drawer (Shopify Style) */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
            <div className="w-full max-w-[360px] h-full bg-white shadow-2xl flex flex-col justify-between font-sans">
              
              {/* Drawer Header */}
              <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between shrink-0 bg-zinc-50">
                <div className="flex items-center gap-2">
                  <LuSlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                    Filters & Sort
                  </h3>
                  {activeFilters.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      {activeFilters.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-[11px] font-bold text-red-500 uppercase tracking-wider cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-800 cursor-pointer bg-white"
                    aria-label="Close filters"
                  >
                    <IoCloseOutline className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-grow overflow-y-auto px-5 py-5 space-y-6 bg-white">
                {/* Mobile Sort Option */}
                <div className="border-b border-zinc-200 pb-5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900 mb-3">
                    Sort By
                  </h4>
                  <div className="grid grid-cols-1 gap-1.5">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedSort(opt.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          selectedSort === opt.value
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {selectedSort === opt.value && <LuCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                {renderSidebarFilters(true)}
              </div>

              {/* Drawer Sticky Footer Action */}
              <div className="p-4 border-t border-zinc-200 bg-zinc-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3.5 bg-zinc-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl text-center transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  View Products ({filteredProducts.length})
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mb-4" />
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Loading marketplace products...</p>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
