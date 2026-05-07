export const BUILDER_CODE = 'bc_cxgi6r6a';

export type ERC8021Attribution = {
  attributionCode: string;
  builderCode: string;
};

// Utilities for ERC-8021 Transaction Attribution
export function getAttributionData(attributionCode: string): ERC8021Attribution {
  return {
    attributionCode,
    builderCode: BUILDER_CODE,
  };
}

export function encodeAttributionExtraData(attribution: ERC8021Attribution): `0x${string}` {
  // In a real scenario, this would use viem's encodeAbiParameters
  // For now, returning a mock encoded string that would be appended to calldata or sent as extraData
  return `0x8021${attribution.builderCode}${attribution.attributionCode}` as `0x${string}`;
}
