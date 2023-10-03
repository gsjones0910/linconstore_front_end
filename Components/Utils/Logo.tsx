import React from "react";
import Avatar from "@mui/material/Avatar";

const Logo: React.FC = () => {
  return (
    <Avatar
      variant={"square"}
      sx={{
        width: 270,
        height: 230,
        p: 2,
        m: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
      src={"/assets/img/bothword-store.png"}
      alt={"avatar of bothword-store"}
    />
  );
};

export default Logo;
