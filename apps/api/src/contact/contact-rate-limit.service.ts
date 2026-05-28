import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
export class ContactRateLimitService {
  private readonly submissions = new Map<string, RateLimitEntry>();
  private readonly maxSubmissions = 3;
  private readonly windowMs = 15 * 60 * 1000;

  assertAllowed(key: string): void {
    const now = Date.now();
    const current = this.submissions.get(key);

    if (!current || current.resetAt <= now) {
      this.submissions.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return;
    }

    if (current.count >= this.maxSubmissions) {
      throw new HttpException('Too many contact submissions. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    current.count += 1;
    this.submissions.set(key, current);
  }
}
