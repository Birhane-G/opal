export function generateMemberNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `MEM${timestamp.slice(-6)}${random}`
}

export function generateLoanNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `LOAN${timestamp.slice(-6)}${random}`
}

export function generateAccountNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ACC${timestamp.slice(-6)}${random}`
}

export function maskId(id: string): string {
  if (!id || id.length < 4) return "****"
  return `****${id.slice(-4)}`
}
