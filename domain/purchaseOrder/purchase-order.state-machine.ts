import { POStatus } from "@prisma/client";
import { AppError } from "@/shared/errors/app-error";

const ALLOWED_TRANSITIONS: Record<
  POStatus,
  POStatus[]
> = {
  DRAFT: [
    POStatus.PLACED,
    POStatus.CANCELLED,
  ],

  PLACED: [
    POStatus.RECEIVED,
    POStatus.CANCELLED,
  ],

  RECEIVED: [],

  CANCELLED: [],
};

export function canTransition(
  current: POStatus,
  next: POStatus
): boolean {
  return ALLOWED_TRANSITIONS[current].includes(
    next
  );
}

export function assertTransition(
  current: POStatus,
  next: POStatus
) {
  if (!canTransition(current, next)) {
    throw new AppError(
      409,
      `Cannot transition from ${current} to ${next}`
    );
  }
}