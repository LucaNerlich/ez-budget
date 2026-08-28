"use client";

import {useEffect} from 'react';
import {loadBootstrapJs} from '../src/lib/bootstrap';

export default function BootstrapClient() {
  useEffect(() => {
    loadBootstrapJs();
  }, []);
  return null;
}
