import type { CreateStayOutput } from '@/features/create-stay/schema';

// This is a mock API function.
// In a real application, this would make a POST request to your server.
export async function createStay(
  data: CreateStayOutput
): Promise<{ success: true; stayId: string }> {
  console.log('API CALL: createStay with data', data);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate a successful response
  return {
    success: true,
    stayId: `stay_${Date.now()}`,
  };
}
