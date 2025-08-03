function SearchBar({ searchTerm, onSearch }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search images..."
        value={searchTerm}
        onChange={e => onSearch(e.target.value)}
        style={{ padding: "8px", width: "250px" }}
      />
    </div>
  );
}

export default SearchBar;