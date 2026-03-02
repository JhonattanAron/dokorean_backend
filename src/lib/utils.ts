export function formatName(text: string): string {
  if (!text) return "";

  const hasSlugFormat =
    text.includes("-") || text.includes("+") || text.includes("%20");

  // 🔹 Si parece slug → lo convierte a texto normal
  if (hasSlugFormat) {
    return decodeURIComponent(text)
      .replace(/[-+]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // 🔹 Si es texto normal → lo convierte a slug
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}
