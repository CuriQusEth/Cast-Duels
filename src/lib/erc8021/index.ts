// ERC-8021 Transaction Attribution Utilities

export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "[BUILDER_CODE]";

function stringToHex(str: string): string {
  let hex = '';
  for(let i=0; i<str.length; i++) {
    hex += ''+str.charCodeAt(i).toString(16);
  }
  return hex;
}

/**
 * Appends attribution tracking to transaction data
 */
export function appendAttribution(data: string = "0x"): string {
  // Strip 0x if present
  let baseData = data.startsWith("0x") ? data.slice(2) : data;
  
  // Hex encode the tags
  const attrHex = stringToHex(ATTRIBUTION_CODE);
  const builderHex = stringToHex(BUILDER_CODE);
  
  // Example of appending standard attribution data
  // In a real implementation this follows the EIP exactly.
  return `0x${baseData}${attrHex}${builderHex}`;
}
