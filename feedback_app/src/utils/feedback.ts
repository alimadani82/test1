const formatChips = (chips: string[]) => chips.map((chip) => `[${chip}]`).join("");

export const buildItemComment = (chips: string[], text: string) => {
  const trimmed = text.trim();
  const prefix = formatChips(chips);
  if (!prefix && !trimmed) {
    return "";
  }
  return `${prefix}${trimmed ? ` ${trimmed}` : ""}`.trim();
};

export const buildGeneralFeedback = (chips: string[], text: string) => {
  const chipsLine = chips.join("|");
  const trimmed = text.trim();
  return `CHIPS: ${chipsLine}\nTEXT: ${trimmed}`.trim();
};
