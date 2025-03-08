"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import {
  Loader2,
  AlertCircle,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import {
  getSubscriptionHistory,
  cancelSubscription,
} from "@/app/actions/subscription";

interface Subscription {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

export default function SubscriptionHistoryPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    // Redirect if not signed in
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    fetchSubscriptions();
  }, [isLoaded, isSignedIn, router]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptionHistory();
      setSubscriptions(data.subscriptions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (subscription: Subscription) => {
    try {
      setCancelling(subscription.id);
      await cancelSubscription(subscription.id);

      // Refresh the subscription list
      fetchSubscriptions();
      setDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusBadge = (status: string, endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);

    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
          <XCircle className="h-3 w-3" />
          Cancelled
        </span>
      );
    }

    if (end < now) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
          <Clock className="h-3 w-3" />
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </span>
    );
  };

  return (
    <div className="container max-w-4xl py-8">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Subscription", path: "/subscription" },
          { label: "History" },
        ]}
      />

      <h1 className="text-3xl font-bold mb-8">Subscription History</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            You don&apos;t have any subscription history yet.
          </p>
          <Button
            variant="default"
            onClick={() => router.push("/subscription")}
          >
            View Subscription Plans
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubscriptions}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="p-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      {getStatusBadge(
                        subscription.status,
                        subscription.end_date,
                      )}
                      <span className="text-sm text-gray-500">
                        ID: {subscription.id}
                      </span>
                    </div>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Start Date:</span>{" "}
                      {formatDate(subscription.start_date)}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">End Date:</span>{" "}
                      {formatDate(subscription.end_date)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Created:</span>{" "}
                      {formatDate(subscription.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center">
                    {subscription.status !== "cancelled" &&
                      new Date(subscription.end_date) > new Date() && (
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setSelectedSubscription(subscription)
                              }
                            >
                              Unsubscribe
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Cancellation</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to cancel your
                                subscription? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  selectedSubscription &&
                                  handleUnsubscribe(selectedSubscription)
                                }
                                disabled={cancelling !== null}
                              >
                                {cancelling === selectedSubscription?.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  "Yes, Cancel Subscription"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
