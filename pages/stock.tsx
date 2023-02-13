import { useState, useEffect, useMemo, FormEvent } from 'react';
import { withRouter, useRouter } from 'next/router';
import { Tags } from '../components/Tags';
import Link from 'next/link';
import Editor from '../components/TextEditor';
import { descAtom, tagAtom } from '../utils/atoms'
import { useAtom } from 'jotai'
import { ConfirmationModal } from '../components/Modal';

function Stock() {
  const router = useRouter()

  return (
    <div className='p-5 bg-slate-100'>
      STOCK HERE
    </div>
  )
}

export default withRouter(Stock);