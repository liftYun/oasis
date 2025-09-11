'use client';

import { useState } from 'react';
import { SmartKeyEmpty, SmartKeyList } from '@/features/smart-key';

export function SmartKey() {
  const [hasKey, setHasKey] = useState(false);

  return <div>{hasKey ? <SmartKeyEmpty /> : <SmartKeyList />}</div>;
}
