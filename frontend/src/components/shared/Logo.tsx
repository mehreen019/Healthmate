import React from 'react'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'

const Logo = () => {
  return (
    <div style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "15px",
      }}
    >
        <Link to={"/"}>
        <img
          src="logo.jpg"
          alt="openai"
          width={"60px"}
          height={"60px"}
          className="image-inverted"
        />
      </Link>{" "}
      <Typography
        sx={{
          display: { md: "block", sm: "none", xs: "none" },
          mr: "auto",
          fontWeight: "800",
          textShadow: "2px 2px 20px #000",
        }}
      >
        <span style={{ fontSize: "15px" }}>HEALTH-MATE</span>
      </Typography>
      
    </div>
  )
}

export default Logo
