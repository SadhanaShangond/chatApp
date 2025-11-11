import { Image, Send, X } from "lucide-react";
import styles from "../Styles/MessageInput.module.css";
import { useChatStore } from "../Store/store";
import { useAuth } from "@clerk/clerk-react";
import { useRef, useState } from "react";

const MessageInput = () => {
 
const [text,setText]=useState();
const [image,setImage]=useState(null);
const [imagePreview,setImagePreview]= useState(null);
const fileInputRef = useRef(null);
const { sendMessage } = useChatStore();
const {getToken} = useAuth();

const handleImageChange = (e) =>{
  const file = e.target.files[0];
  if(file) {
    if(file.size > 5*1024*1024){
      alert("Image size should be less than 5MB");
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onload =()=>{
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
}
const removeImage =()=>{
  setImage(null);
  setImagePreview(null);
  if(fileInputRef.current) fileInputRef.current.value = "";
}

const handleSendMessage = async(e) =>{
  e.preventDefault();
  if(!text && !image) return;

const token = await getToken({template:"chatapp"})
const formData = new FormData();
if(text) formData.append("text",text);
if(image) formData.append("image",image);

await sendMessage(formData,token);
setText("");
removeImage();

}

  return (
    <form className={styles.formContainer} onSubmit={handleSendMessage}>
      {/* Show dummy image preview */}
      {imagePreview && (
        <div className={styles.previewContainer}>
          <img
            src={imagePreview}
            alt="Preview"
            className={styles.previewImage}
          />
          <button type="button" className={styles.removeButton} onClick={removeImage}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.imageButton}
          aria-label="Attach image"
          onClick={()=>fileInputRef.current.click()}
        >
          <Image size={20} />
        </button>
        {/* Hidden file input(not functional in static version) */}
        <input type="file" hidden accept="image/*" ref={fileInputRef} onChange={handleImageChange}/>
        <input
          type="text"
          //   value={dummyText}

          placeholder="Type a message..."
          className={styles.textInput}
          value={text}
          onChange={(e)=>setText(e.target.value)}
        />
        {/* Send button is enabled since we have dummy content */}
        <button type="submit" className={styles.sendButton}>
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
