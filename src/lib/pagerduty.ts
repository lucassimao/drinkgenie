import "server-only";

//https://developer.pagerduty.com/api-reference/368ae3d938c9e-send-an-event-to-pager-duty
export async function notifyProductionIssue(
  summary: string,
  details: object,
  severity: "critical" | "warning" | "error" | "info",
) {
  if (!process.env.PAGERDUTY_ROUTING_KEY) {
    console.log(`skipping pagerdutiy event ${summary}`);
    return;
  }
  const response = await fetch(`https://events.pagerduty.com/v2/enqueue`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      payload: {
        summary,
        timestamp: new Date().toISOString(),
        severity,
        source: "Drinkgenie",
        custom_details: details,
      },
      routing_key: process.env.PAGERDUTY_ROUTING_KEY,
      event_action: "trigger",
    }),
  });
  if (!response.ok) {
    console.log(`failed to send pagerduty event`);
  }
}
