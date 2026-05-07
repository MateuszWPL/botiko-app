import { createReviewSchema } from './create-review.dto';

describe('createReviewSchema — walidacja ratingu', () => {
  it.each([1, 2, 3, 4, 5])('akceptuje rating %d', (rating) => {
    expect(createReviewSchema.safeParse({ rating }).success).toBe(true);
  });

  it('odrzuca rating 0', () => {
    expect(createReviewSchema.safeParse({ rating: 0 }).success).toBe(false);
  });

  it('odrzuca rating 6', () => {
    expect(createReviewSchema.safeParse({ rating: 6 }).success).toBe(false);
  });

  it('odrzuca rating ujemny', () => {
    expect(createReviewSchema.safeParse({ rating: -1 }).success).toBe(false);
  });

  it('odrzuca rating niebędący liczbą całkowitą', () => {
    expect(createReviewSchema.safeParse({ rating: 3.5 }).success).toBe(false);
  });

  it('odrzuca brak pola rating', () => {
    expect(createReviewSchema.safeParse({}).success).toBe(false);
  });

  it('odrzuca rating jako string', () => {
    expect(createReviewSchema.safeParse({ rating: '5' }).success).toBe(false);
  });
});

describe('createReviewSchema — pole message', () => {
  it('akceptuje brak wiadomości (pole opcjonalne)', () => {
    expect(createReviewSchema.safeParse({ rating: 5 }).success).toBe(true);
  });

  it('akceptuje wiadomość do 500 znaków', () => {
    expect(
      createReviewSchema.safeParse({ rating: 4, message: 'Świetny produkt!' })
        .success,
    ).toBe(true);
  });

  it('odrzuca wiadomość dłuższą niż 500 znaków', () => {
    expect(
      createReviewSchema.safeParse({ rating: 4, message: 'x'.repeat(501) })
        .success,
    ).toBe(false);
  });

  it('trimmuje białe znaki z wiadomości', () => {
    const result = createReviewSchema.safeParse({
      rating: 3,
      message: '  OK  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe('OK');
    }
  });
});
