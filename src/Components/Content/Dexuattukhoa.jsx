import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function Dexuattukhoa() {
  return (
    <div className="container">
      <h2 className="mb-4">Keyword Suggestion Editor</h2>
      <CKEditor
        editor={ClassicEditor}
        data="<p>Nhập nội dung tại đây...</p>"
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            // "underline",
            // "strikethrough",
            // "subscript",
            // "superscript",
            "link",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "imageUpload",
            "undo",
            "redo",
            "|",
            // "alignment",
            "indent",
            "outdent",
            "|",
            // "highlight",
            // "horizontalLine",
            // "pageBreak",
            // "specialCharacters",
          ],
          height: 500,
          simpleUpload: {
            uploadUrl: "http://localhost:4000/upload",
          },
        }}
        onReady={(editor) => {
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
    </div>
  );
}
