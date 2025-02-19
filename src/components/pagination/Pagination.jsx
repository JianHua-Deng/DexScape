import ReactPaginate from 'react-paginate';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

export default function Pagination({ pageCount, onPageChange, currentPage, pageRange, marginPagesDisplayed}) {
  return (
    <ReactPaginate
      previousLabel={
        <KeyboardArrowLeft className="w-7 h-7 min-w-6 dark:text-lightText" />
      }
      nextLabel={
        <KeyboardArrowRight className="w-7 h-7 min-w-6 dark:text-lightText" />
      }
      breakLabel="..."
      pageCount={pageCount}
      pageRangeDisplayed={pageRange}
      marginPagesDisplayed={marginPagesDisplayed}
      onPageChange={onPageChange}
      forcePage={currentPage - 1} // currentPage is 1-indexed
      renderOnZeroPageCount={null}

      // Container: a flex container with no list style, zero padding,
      containerClassName="flex list-none p-0 justify-center items-center gap-[.2rem] lg:gap-[.5rem]"

      // Each page item li
      pageClassName="cursor-pointer group"
      
      // The anchor inside each page item
      pageLinkClassName="no-underline py-1 px-2 lg:py-2 lg:px-3 border border-[#ddd] dark:border-none transition-colors duration-300 hover:bg-gray-400 dark:bg-lightDark dark:text-lightText dark:hover:bg-blue-600"
      
      // The active li gets the "active" class.
      activeLinkClassName="active bg-blue-500 text-white dark:text-blue-400 dark:!bg-blue-700"

      // Previous & Next items:
      // We remove borders on the links using Tailwind’s border-0 utility.
      previousClassName="cursor-pointer previous-item group focus:outline:none flex flex-col justify-center items-center"
      previousLinkClassName="no-underline border border-[#ddd] transition-colors duration-300 hover:bg-gray-400 border-0 focus:outline:none dark:hover:bg-blue-600"
      nextClassName="cursor-pointer next-item group focus:outline:none flex flex-col justify-center items-center "
      nextLinkClassName="no-underline border border-[#ddd] transition-colors duration-300 hover:bg-gray-400 border-0 focus:outline:none dark:hover:bg-blue-600"

      // Break (ellipsis) items
      breakClassName="cursor-pointer group"
      breakLinkClassName="no-underline py-1 px-2 lg:py-2 lg:px-3 border border-[#ddd] dark:border-none dark:bg-lightDark dark:text-lightText dark:hover:bg-blue-600 transition-colors duration-300 hover:bg-slate-400"
    />
  );
}
