import ReactPaginate from 'react-paginate';

export default function Pagination({ pageCount, onPageChange, currentPage, pageRange, marginPagesDisplayed}) {
  return (
    <ReactPaginate
      previousLabel={
        <img
          src="/previous-page.svg"
          className="previous-logo logo w-6 h-6 min-w-6"
          alt="previous"
        />
      }
      nextLabel={
        <img src="/next-page.svg" className="next-logo logo w-6 h-6 min-w-6" alt="next" />
      }
      breakLabel="..."
      pageCount={pageCount}
      pageRangeDisplayed={pageRange}
      marginPagesDisplayed={marginPagesDisplayed}
      onPageChange={onPageChange}
      forcePage={currentPage - 1} // currentPage is 1-indexed

      // Container: a flex container with no list style, zero padding,
      // centered items, and a custom gap of 0.2rem (using an arbitrary value)
      containerClassName="flex list-none p-0 justify-center items-center gap-[.2rem] lg:gap-[.5rem]"

      // Each page item li
      pageClassName="cursor-pointer group"
      
      // The anchor inside each page item
      pageLinkClassName="no-underline py-1 px-2 lg:py-2 lg:px-3 border border-[#ddd] transition-colors duration-300 hover:bg-gray-400"
      
      // The active li gets the "active" class.
      // (See note below on styling the inner anchor for the active page.)
      activeLinkClassName="active bg-blue-500 text-white"

      // Previous & Next items:
      // We remove borders on the links using Tailwind’s border-0 utility.
      previousClassName="cursor-pointer previous-item group focus:outline:none flex flex-col justify-center items-center"
      previousLinkClassName="no-underline border border-[#ddd] transition-colors duration-300 hover:bg-gray-400 border-0 focus:outline:none"
      nextClassName="cursor-pointer next-item group focus:outline:none flex flex-col justify-center items-center"
      nextLinkClassName="no-underline border border-[#ddd] transition-colors duration-300 hover:bg-gray-400 border-0 focus:outline:none"

      // Break (ellipsis) items
      breakClassName="cursor-pointer group"
      breakLinkClassName="no-underline py-1 px-2 lg:py-2 lg:px-3 border border-[#ddd] transition-colors duration-300 hover:bg-slate-400"
    />
  );
}
