import { API_URL } from "../../api/api"
import { useAuthentication } from "../authentication"
import { useRef, useState } from "react"

export default function XMLUploader({ onUploadSuccess, uploadUrl, disabled = false, label}) {

    const [user] = useAuthentication()
    const [status, setStatus] = useState("")

    // useRef in this context is the react way of getting an element
    // referencem kind of like: document.getElementById("")
    const uploadInputRef = useRef(null)

    function uploadFile(e) {
        e.preventDefault()

        // Select just the first file that was picked - files is an array because
        // the user could select multiple files when choosing with the file dialog.
        const file = uploadInputRef.current.files[0]

        // Fetch needs multipart form data which includes the file
        // we want to upload
        const formData = new FormData()
        formData.append("xml-file", file)

        // We have the form data object with the file inside,
        // now we need to use fetch to send it to the backend.

        fetch(API_URL + uploadUrl, {
            method: "POST",
            headers: {
                'X-AUTH-KEY': user.authenticationKey
            },
            body: formData
        })
        .then(response => response.json())
        .then(APIResponse => {
            setStatus(APIResponse.message)

            // Clear the selected file - reset the file selector on the front end
            uploadInputRef.current.value = null

            if (typeof onUploadSuccess == "function") {
                onUploadSuccess()
            }
        })
        .catch(error => {
            setStatus("Error " + error)
        })
    }

    return <div>
        <form className="flex-grow m-4" onSubmit={uploadFile}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">XML File Import for {label}</span>
                </label>
                <div className="flex gap-2">
                    <input ref={uploadInputRef} type="file" disabled={disabled} className="file-input file-input-bordered file-input-primary" />
                    <button diabled={disabled} className="btn bg-test mr-2">Upload</button>
                </div>
                <div className="label">
                    <span className="label-text-alt">{status}</span>
                </div>
            </div>
        </form>
    </div>
}