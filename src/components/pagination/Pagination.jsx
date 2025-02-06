import ReactPaginate from 'react-paginate'
import './Pagination.css'


export default function Pagination({pageCount, onPageChange, currentPage, pageRange, marginPagesDisplayed}) {

    return (
        <ReactPaginate
            previousLabel={<img src='/previous-page.svg' className='previous-logo logo' alt='previous'/>}
            nextLabel={<img src='/next-page.svg' className='next-logo logo' alt='next'/>}
            breakLabel='...'
            pageCount={pageCount}
            pageRangeDisplayed={pageRange}
            marginPagesDisplayed={marginPagesDisplayed}
            onPageChange={onPageChange}
            containerClassName='pagination'
            activeClassName='active'
            renderOnZeroPageCount={null}
            forcePage={currentPage - 1} // currentPage passed as a prop (1-indexed)

            previousClassName="previous-item"
            previousLinkClassName="previous-link"
            nextClassName="next-item"
            nextLinkClassName="next-link"
        >

        </ReactPaginate>
    )
}