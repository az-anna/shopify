import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { descAtom } from '../utils/atoms'
import { useAtom } from 'jotai'
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
export default function Editor() {
  const [description, setDescription] = useAtom(descAtom);
  return <ReactQuill theme="snow" value={description} onChange={setDescription} />;
}