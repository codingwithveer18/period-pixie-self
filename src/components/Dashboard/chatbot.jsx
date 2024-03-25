import React, { useEffect } from "react";
const Chatbot = () => {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "3cdcfb1c-94c8-4c4a-a819-4903280d551a";
    (function () {
      var d = document;
      var s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);
};

export default Chatbot;
