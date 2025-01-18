// src/utils/date.ts
var getDate = (span, unit = "ms") => {
  return new Date(Date.now() + (unit === "sec" ? span * 1e3 : span));
};

export { getDate };
