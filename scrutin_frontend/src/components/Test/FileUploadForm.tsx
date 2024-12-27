import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";

interface FileUploadFormState {
  file: File | null;
  isPrivate: boolean;
  folder: string;
  doctype: string;
  docname: string;
  fieldname: string;
  error: string;
}

const FileUploadForm: React.FC = () => {
  const [state, setState] = useState<FileUploadFormState>({
    file: null,
    isPrivate: true,
    folder: 'Home',
    doctype: 'Scrutin Candidate',
    docname: '37hc0ipka2',
    fieldname: 'image',
    error: ''
  });

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setState(prevState => ({
        ...prevState,
        file: e.target.files ? e.target.files[0] : null,
        error: '' // Clear any previous errors
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!state.file) {
      setState(prevState => ({ ...prevState, error: 'Please select a file' }));
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', state.file);
    formData.append('is_private', state.isPrivate ? '1' : '0');
    formData.append('folder', state.folder);
    formData.append('doctype', state.doctype);
    formData.append('docname', state.docname);
    formData.append('fieldname', state.fieldname);

    // CSRF token (if needed)
    // const csrfToken = 'fbdb59ad5d779db9a155b3065719a8f7a51ff1fbea1f4287dd1e3c1e'; // Replace with dynamic CSRF token

    try {
      const response = await fetch('/api/method/upload_file', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          // 'X-Frappe-CSRF-Token': csrfToken,
        },
        body: formData,
        credentials: 'include', // Include cookies if necessary
      });

      if (!response.ok) {
        const errorData = await response.json();
        setState(prevState => ({ ...prevState, error: `Upload failed: ${errorData.message}` }));
      } else {
        const data = await response.json();
        console.log('Upload successful:', data);
        // Handle success (reset form or show message)
      }
    } catch (err) {
      if (err instanceof Error) {
        setState(prevState => ({ ...prevState, error: `Error: ${err.message}` }));
      } else {
        setState(prevState => ({ ...prevState, error: 'An unknown error occurred' }));
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>File:</label>
          <input type="file" className='text-black' onChange={handleFileChange} />
        </div>
        <div>
          <label>Is Private:</label>
          <input
            type="checkbox"
            checked={state.isPrivate}
            onChange={() => setState({ ...state, isPrivate: !state.isPrivate })}
          />
        </div>
        <div>
          <label>Folder:</label>
          <input
            type="text"
            className='text-black'
            value={state.folder}
            onChange={(e) => setState({ ...state, folder: e.target.value })}
          />
        </div>
        <div>
          <label>Document Type:</label>
          <input
            type="text"
            className='text-black'
            value={state.doctype}
            onChange={(e) => setState({ ...state, doctype: e.target.value })}
          />
        </div>
        <div>
          <label>Document Name : Candidate id: </label>
          <input
            type="text"
            className='text-black'
            value={state.docname}
            onChange={(e) => setState({ ...state, docname: e.target.value })}
          />
        </div>
        <div>
          <label>Field Name:</label>
          <input
            type="text"
            className='text-black'
            value={state.fieldname}
            onChange={(e) => setState({ ...state, fieldname: e.target.value })}
          />
        </div>
        <div>
          <Button type="submit">Upload Image</Button>
        </div>
      </form>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
    </div>
  );
};

export default FileUploadForm;
