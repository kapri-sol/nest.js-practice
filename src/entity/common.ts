import { ValueTransformer } from 'typeorm';

export const primaryTransformer: ValueTransformer = {
  to: (value: bigint): string => value.toString(),
  from: (value: string): bigint => BigInt(value),
};
