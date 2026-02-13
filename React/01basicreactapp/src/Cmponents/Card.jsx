import React, {useState} from "react";
import "./Card.css";




function Card({ buttonText }) {
  const [color, setColor] = useState("olive");
//   function changeBg(color){
//   console.log("Color received:", color);
// //  document.body.style.backgroundColor = color;
//    setColor(color);
// }
  return (
   <div style={{backgroundColor:color}}>
        <button className="card-button"  onClick={() => setColor(buttonText)}>{buttonText}</button>
    </div>
  );
}

export default Card;
