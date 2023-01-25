import { useRef } from 'react';
import { ViewportList } from 'react-viewport-list';

const ItemList = (props) => {
  const ref = useRef(null);
  const listRef = useRef(null);
  return (
    <div className="scroll-container" ref={ref}>
      <ViewportList
        ref={listRef}
        viewportRef={ref}
        items={props}
      >
        {(item) => (

        )}
      </ViewportList>
      <button
        className="up-button"
        onClick={() =>
          listRef.current.scrollToIndex(0)
        }
      />
    </div>
  );
};

export { ItemList };