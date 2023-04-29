import { useState } from 'react'
import { WithContext as ReactTags } from 'react-tag-input';
import { CATEGORIES } from '../utils/categories';
import { tagAtom } from '../utils/atoms'
import { useAtom } from 'jotai'

const suggestions = CATEGORIES.map(category => {
  return {
    id: category,
    text: category
  };
});

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export const Tags = () => {
  const [tags, setTags] = useAtom(tagAtom)

  const handleDelete = (i: number) => {
    setTags(tags.filter((_tag, index) => index !== i));
  };

  const handleAddition = (tag: { id: string; text: string; }) => {
    setTags([...tags, tag]);
  };

  return (
    <div >
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          inputFieldPosition="bottom"
          autocomplete
        />
    </div>
  );
};