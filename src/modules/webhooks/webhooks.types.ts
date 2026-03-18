// Define the shape of a webhook event that the server expects
export interface WebhookEvent {
  event: string;             // The name/type of the event, e.g., "user_created"
  data: Record<string, any>; // Arbitrary payload sent by the external system
}