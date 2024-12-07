import React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4 text-primary/40" />}
          {item.path ? (
            <Link
              href={item.path}
              className="flex items-center text-primary/60 hover:text-primary transition-colors"
            >
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-primary/40">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
