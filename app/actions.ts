// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function clearLandingPageCache() {
  // Yeh Vercel ko batayega ke homepage ('/') ka cache nikal do aur naya data fetch karo
  revalidatePath('/');
}