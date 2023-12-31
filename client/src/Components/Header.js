import React from "react";
import "./../Styles/HeaderStyles.css";

const Header = () => {
  return (
    <div className="Header">
      <div className="contactsLinks">
        <a href="tel:9991976174">Call us : 9991976174</a>{" "}<a href="tel:8901196174">/ 8901196174</a>{" "}
        <span className="contACTAdIV">|</span>{" "}
        <a href="mailto: learnuniq@gmail.com">Email us : learnuniq@gmail.com</a>
      </div>
      <div style={{ color: "white" }} className="SocialMedia">
        <div className="socialMedialinks">
          <a
            style={{ fontSize: "20px" }}
            href="https://wa.me/+919991976174?text=Hello Sir, I want to Inquiry About Course from your Universal Academy."
          >
            <i class="fa-brands fa-whatsapp"></i>
          </a>
          <i class="fa-brands fa-facebook-f"></i>
          <i class="fa-brands fa-twitter"></i>
          <i class="fa-brands fa-youtube"></i>
          <i class="fa-brands fa-instagram"></i>
        </div>
      </div>
    </div>
  );
};

export default Header;
