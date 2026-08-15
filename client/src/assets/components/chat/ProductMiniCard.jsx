import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductMiniCard({ product }) {
  if (!product) return null;

  const productId = product._id || product.id;
  const imageSrc =
    product.image ||
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop';

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--cm-border)] bg-[var(--cm-bg)]/80 px-4 py-2.5 backdrop-blur-xs transition">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[var(--cm-border)] bg-white p-0.5">
          <img
            src={imageSrc}
            alt={product.title || 'Product'}
            className="h-full w-full object-contain"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop';
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--cm-blue-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--cm-blue)]">
              <Tag size={10} />
              Item Inquiry
            </span>
          </div>
          <h4 className="truncate text-xs font-bold text-[var(--cm-ink)] sm:text-sm">
            {product.title || product.description || 'Campus Item'}
          </h4>
          <p className="text-xs font-extrabold text-[var(--cm-blue)]">
            ₹{Number(product.price || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {productId && (
        <Link
          to={`/api/product/${productId}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[var(--cm-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--cm-ink)] shadow-xs transition hover:border-[var(--cm-blue)] hover:bg-[var(--cm-blue-soft)] hover:text-[var(--cm-blue)]"
        >
          <span>View Details</span>
          <ExternalLink size={12} />
        </Link>
      )}
    </div>
  );
}
