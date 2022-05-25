const Filter = ({ newFilter, handleFilterChange }) => (
  <>
    filter shown with
    <input value={newFilter} onChange={handleFilterChange} />
  </>
);

export default Filter;
