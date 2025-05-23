import { z } from 'zod';

import { ListTransactionsByAccountExternalDto } from '../../application/dtos/ListTransactionsByAccountExternalDto';

export class ListTransactionsValidator {
  public static validate(
    dto: ListTransactionsByAccountExternalDto,
  ): ListTransactionsByAccountExternalDto {
    const schema = z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    });

    const parsed = schema.parse(dto);

    // If one date is provided, both must be provided
    if (
      (parsed.startDate && !parsed.endDate) ||
      (!parsed.startDate && parsed.endDate)
    ) {
      throw new Error(
        'Both startDate and endDate must be provided if filtering by date',
      );
    }

    // If both dates are provided, validate them
    if (parsed.startDate && parsed.endDate) {
      const start = new Date(parsed.startDate);
      const end = new Date(parsed.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
      }

      if (start > end) {
        throw new Error('Start date cannot be after end date');
      }
    }

    return parsed;
  }
}
