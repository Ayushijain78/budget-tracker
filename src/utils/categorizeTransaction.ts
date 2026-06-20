export function categorizeTransaction(
  note: string,
): string {
  const lower = note.toLowerCase();

  if (
    lower.includes("blinkit") ||
    lower.includes("zomato") ||
    lower.includes("swiggy") ||
    lower.includes("foods") ||
    lower.includes("kulfi") ||
    lower.includes("namkeen") ||
    lower.includes("kaleva")
  ) {
    return "Food";
  }

  if (
    lower.includes("flipkart") ||
    lower.includes("myntra") ||
    lower.includes("supermart") ||
    lower.includes("retail")
  ) {
    return "Shopping";
  }

  if (
    lower.includes("electricity") ||
    lower.includes("power corporation") ||
    lower.includes("jio")
  ) {
    return "Bills";
  }

  if (
    lower.includes("nps") ||
    lower.includes("pension")
  ) {
    return "Investment";
  }

  if (
    lower.includes("salon")
  ) {
    return "Personal Care";
  }

  if (
    lower.includes("received") ||
    lower.includes("ayushi jain") ||
    lower.includes("pine labs")
  ) {
    return "Income";
  }

  return "Other";
}