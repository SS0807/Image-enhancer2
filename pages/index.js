export default function Home() {
  return (
    <div style={{textAlign: 'center', padding: '50px'}}>
      <h1>Image Enhancer (Basic)</h1>
      <p>Upload an image to preview it (basic version)</p>
      <input type="file" accept="image/*" onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            document.getElementById('preview').src = ev.target.result;
          };
          reader.readAsDataURL(file);
        }
      }} />
      <br /><br />
      <img id="preview" alt="Preview will appear here" style={{maxWidth:'90%', border:'1px solid #ccc'}} />
    </div>
  )
  }
