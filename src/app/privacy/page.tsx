import React from "react";
import { Shield } from "lucide-react";
import { PageHeader } from "@/components/privacy/PageHeader";
import { TableOfContents } from "@/components/privacy/TableOfContents";
import { DataCollection } from "@/components/privacy/DataCollection";
import { DataUsage } from "@/components/privacy/DataUsage";
import { DataSharing } from "@/components/privacy/DataSharing";
import { UserRights } from "@/components/privacy/UserRights";
import { SecurityMeasures } from "@/components/privacy/SecurityMeasures";
import { CookiePolicy } from "@/components/privacy/CookiePolicy";
import { ContactInfo } from "@/components/privacy/ContactInfo";

export default function PrivacyPolicy() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          icon={<Shield />}
          title="Privacy Policy"
          description="Last updated: December 11, 2024"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Table of Contents - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <TableOfContents />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            <DataCollection />
            <DataUsage />
            <DataSharing />
            <UserRights />
            <SecurityMeasures />
            <CookiePolicy />
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
