// Mock env module — EncryptionService reads ENCRYPTION_KEY at construction.
// Using a deterministic test key makes encrypt/decrypt tests reproducible.
const TEST_KEY = 'a'.repeat(64); // 32 bytes hex
jest.mock('../../config/env', () => ({
  env: { ENCRYPTION_KEY: TEST_KEY },
}));

import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    service = new EncryptionService();
  });

  describe('konstruktor', () => {
    it('rzuca błąd gdy ENCRYPTION_KEY ma złą długość', () => {
      jest.resetModules();
      jest.doMock('../../config/env', () => ({
        env: { ENCRYPTION_KEY: 'abc123' },
      }));

      /* eslint-disable @typescript-eslint/no-require-imports */
      const { EncryptionService: BadService } =
        require('./encryption.service') as {
          EncryptionService: typeof EncryptionService;
        };
      /* eslint-enable @typescript-eslint/no-require-imports */
      expect(() => new BadService()).toThrow(
        'ENCRYPTION_KEY must be a valid 64-character hex string (32 bytes)',
      );
      jest.dontMock('../../config/env');
    });
  });

  describe('encrypt / decrypt round-trip', () => {
    it.each([
      'Jan Kowalski',
      '+48 600 123 456',
      'pan@example.com',
      'a',
      'Anna Nowak-Kowalska (ul. Długa 5/7, 00-001 Warszawa)',
      '🌸 Emoji są wspierane 🌸',
      'Unicode: żółć — łódź — piękne ąęś',
    ])('szyfruje i odszyfrowuje "%s"', (input) => {
      const encrypted = service.encrypt(input);
      const decrypted = service.decrypt(encrypted);
      expect(decrypted).toBe(input);
    });

    it('obsługuje długi tekst (1KB)', () => {
      const input = 'x'.repeat(1024);
      expect(service.decrypt(service.encrypt(input))).toBe(input);
    });
  });

  describe('format wyjściowy', () => {
    it('zwraca format iv:authTag:ciphertext (3 części hex)', () => {
      const encrypted = service.encrypt('test');
      const parts = encrypted.split(':');

      expect(parts).toHaveLength(3);
      // IV = 16 bajtów = 32 znaki hex
      expect(parts[0]).toMatch(/^[0-9a-f]{32}$/);
      // authTag = 16 bajtów = 32 znaki hex
      expect(parts[1]).toMatch(/^[0-9a-f]{32}$/);
      // ciphertext hex — dowolna długość parzysta
      expect(parts[2]).toMatch(/^[0-9a-f]*$/);
    });

    it('każde wywołanie encrypt() produkuje inny output (unique IV)', () => {
      const a = service.encrypt('same input');
      const b = service.encrypt('same input');
      expect(a).not.toBe(b);
      // Ale odszyfrowanie obu daje ten sam plaintext
      expect(service.decrypt(a)).toBe(service.decrypt(b));
    });
  });

  describe('decrypt — obsługa błędów', () => {
    // XOR pierwszego bajtu z 0xff — gwarantuje że byte zawsze się zmieni
    // (w odróżnieniu od replace(/^../, '00'), które jest no-op gdy pierwszy bajt to już 00)
    const flipFirstByte = (hex: string) => {
      const first = (parseInt(hex.slice(0, 2), 16) ^ 0xff)
        .toString(16)
        .padStart(2, '0');
      return first + hex.slice(2);
    };

    it('rzuca błąd dla niepoprawnego formatu (mniej niż 3 części)', () => {
      expect(() => service.decrypt('tylko-dwie:czesci')).toThrow(
        'Invalid ciphertext format',
      );
    });

    it('rzuca błąd dla pustego stringa', () => {
      expect(() => service.decrypt('')).toThrow('Invalid ciphertext format');
    });

    it('rzuca błąd gdy authTag został zmodyfikowany (tamper detection)', () => {
      const encrypted = service.encrypt('wrażliwe dane');
      const [iv, authTag, ciphertext] = encrypted.split(':');
      const tampered = `${iv}:${flipFirstByte(authTag)}:${ciphertext}`;
      expect(() => service.decrypt(tampered)).toThrow();
    });

    it('rzuca błąd gdy ciphertext został zmodyfikowany (tamper detection)', () => {
      const encrypted = service.encrypt('wrażliwe dane');
      const [iv, authTag, ciphertext] = encrypted.split(':');
      const tampered = `${iv}:${authTag}:${flipFirstByte(ciphertext)}`;
      expect(() => service.decrypt(tampered)).toThrow();
    });

    it('rzuca błąd gdy IV został zmodyfikowany (tamper detection)', () => {
      const encrypted = service.encrypt('wrażliwe dane');
      const [iv, authTag, ciphertext] = encrypted.split(':');
      const tampered = `${flipFirstByte(iv)}:${authTag}:${ciphertext}`;
      expect(() => service.decrypt(tampered)).toThrow();
    });
  });
});
