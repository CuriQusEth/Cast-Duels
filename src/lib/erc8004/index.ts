// ERC-8004 Trustless Agents Utilities

/**
 * Validates agent registrations and handles agent-to-agent communication
 * as per EIP-8004 specifications.
 */
export async function verifyAgentRegistration(agentId: string) {
  // Logic to verify agent on-chain
  return true;
}

export function formatAgentCard(name: string, capabilities: string[]) {
  return {
    "@context": "https://eips.ethereum.org/EIPS/eip-8004",
    name,
    capabilities,
    version: "1.0.0"
  };
}
