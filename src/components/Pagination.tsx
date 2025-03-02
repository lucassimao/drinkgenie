import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  hrefStrategy: (page: number) => string;
}

export function Pagination({
  totalPages,
  currentPage,
  hrefStrategy,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 4) {
        // Show first 5 pages + ellipsis + last page
        pages.push(...Array.from({ length: 3 }, (_, i) => i + 1));
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page + ellipsis + last 5 pages
        pages.push(1);
        pages.push("...");
        pages.push(...Array.from({ length: 3 }, (_, i) => totalPages - 4 + i));
      } else {
        // Show first + ellipsis + current-1,current,current+1 + ellipsis + last
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    } else {
      // Show all pages if total pages <= 7
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Link rel="nofollow" href={hrefStrategy(currentPage - 1)}>
        <button
          disabled={currentPage === 1}
          className="p-2 rounded-lg border-2 border-primary/10 text-primary 
          disabled:opacity-50 disabled:cursor-not-allowed 
          hover:bg-primary/5 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </Link>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <Fragment key={index}>
            {page === "..." ? (
              <span className="px-4 py-2 text-primary/40">...</span>
            ) : (
              <Link rel="nofollow" href={hrefStrategy(+page)}>
                <button
                  className={`min-w-[40px] h-10 rounded-lg border-2 
                  transition-all duration-200 ${
                    page === currentPage
                      ? "border-accent bg-accent text-white font-medium"
                      : "border-primary/10 text-primary hover:bg-primary/5"
                  }`}
                >
                  {page}
                </button>
              </Link>
            )}
          </Fragment>
        ))}
      </div>

      <Link rel="nofollow" href={hrefStrategy(currentPage + 1)}>
        <button
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border-2 border-primary/10 text-primary 
          disabled:opacity-50 disabled:cursor-not-allowed 
          hover:bg-primary/5 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </Link>
    </div>
  );
}
