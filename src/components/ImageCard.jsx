function ImageCard({ imageUrl, description, link, onDelete, onEdit }) {
  return (
    <div className="image-card">
      <img src={imageUrl} alt={description} />
      <p>{description}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">Go to link</a>
      <div style={{ marginTop: "10px" }}>
        {onEdit && <button onClick={onEdit} style={{ marginRight: "10px" }}>Edit</button>}
        {onDelete && <button onClick={onDelete} style={{ color: "red" }}>Delete</button>}
      </div>
    </div>
  );
}

export default ImageCard;